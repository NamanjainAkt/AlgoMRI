import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 20
}) => {
    const { theme, isDark } = useTheme();

    return (
        <View style={[styles.container, { borderColor: theme.border }, style]}>
            <BlurView
                intensity={intensity}
                tint={isDark ? 'dark' : 'light'}
                style={styles.blur}
            >
                <View style={[styles.content, { backgroundColor: theme.cardBg }]}>
                    {children}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
    },
    blur: {
        borderRadius: 16,
    },
    content: {
        padding: 16,
    },
});
