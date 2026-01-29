import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from '../constants/themes';

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@algomri_theme';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        }
    };

    const toggleTheme = async () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
