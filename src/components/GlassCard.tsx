import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
    animated?: boolean;
    delay?: number;
}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 20,
    animated = true,
    delay = 0,
}) => {
    const { theme, isDark } = useTheme();

    const CardWrapper = animated ? Animated.View : View;
    const animationProps = animated ? {
        entering: FadeInUp.duration(400).delay(delay).springify(),
    } : {};

    return (
        <CardWrapper {...animationProps} style={[styles.container, style]}>
            <View style={[
                styles.innerContainer,
                {
                    backgroundColor: isDark ? 'rgba(30, 30, 35, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    shadowColor: isDark ? '#000' : '#000',
                }
            ]}>
                <BlurView
                    intensity={intensity}
                    tint={isDark ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                    colors={isDark
                        ? ['rgba(255,255,255,0.03)', 'rgba(255,255,255,0)']
                        : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.2)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.content}>
                    {children}
                </View>
            </View>
        </CardWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    innerContainer: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 24,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    content: {
        padding: 20,
        position: 'relative',
        zIndex: 1,
    },
});
