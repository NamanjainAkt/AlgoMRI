import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    title: string;
    showThemeToggle?: boolean;
    rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showThemeToggle = true,
    rightComponent
}) => {
    const { theme, isDark, toggleTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>
                    {title}
                </Text>

                <View style={styles.rightSection}>
                    {rightComponent}
                </View>
            </View>

            <LinearGradient
                colors={[theme.primary, theme.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 48,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -1, // Geist/Inter style tight tracking
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    // themeButton removed
    gradient: {

        height: 3,
        marginTop: 12,
        borderRadius: 1.5,
    },
});
