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
                    {showThemeToggle && (
                        <TouchableOpacity
                            onPress={toggleTheme}
                            style={[styles.themeButton, { backgroundColor: theme.cardBg }]}
                        >
                            <Ionicons
                                name={isDark ? 'sunny' : 'moon'}
                                size={20}
                                color={theme.primary}
                            />
                        </TouchableOpacity>
                    )}
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
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    themeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradient: {
        height: 3,
        marginTop: 12,
        borderRadius: 1.5,
    },
});
