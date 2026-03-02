import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface GlowButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
    icon?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    variant?: 'primary' | 'secondary' | 'outline';
}

export const GlowButton: React.FC<GlowButtonProps> = ({
    title,
    onPress,
    style,
    textStyle,
    disabled = false,
    icon,
    size = 'medium',
    variant = 'primary',
}) => {
    const { theme, isDark } = useTheme();
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
        pressed.value = withSpring(1, { damping: 15, stiffness: 300 });
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
        pressed.value = withSpring(0, { damping: 15, stiffness: 300 });
    };

    const sizeStyles = {
        small: { paddingVertical: 10, paddingHorizontal: 20, fontSize: 14 },
        medium: { paddingVertical: 14, paddingHorizontal: 28, fontSize: 16 },
        large: { paddingVertical: 18, paddingHorizontal: 36, fontSize: 18 },
    };

    const getGradientColors = () => {
        if (disabled) return ['#6B7280', '#4B5563'];
        if (variant === 'primary') return [theme.primary, theme.secondary];
        if (variant === 'secondary') return [theme.surface, theme.surface];
        return ['transparent', 'transparent'];
    };

    const textColor = disabled
        ? '#9CA3AF'
        : variant === 'primary'
        ? '#FFFFFF'
        : variant === 'outline'
        ? theme.primary
        : theme.text;

    const borderColor = variant === 'outline' ? theme.primary : 'transparent';

    return (
        <Animated.View style={[styles.container, animatedStyle, style]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled}
                activeOpacity={0.9}
                style={[
                    styles.touchable,
                    { borderColor, borderWidth: variant === 'outline' ? 2 : 0 },
                ]}
            >
                <LinearGradient
                    colors={getGradientColors()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.gradient,
                        {
                            paddingVertical: sizeStyles[size].paddingVertical,
                            paddingHorizontal: sizeStyles[size].paddingHorizontal,
                        },
                    ]}
                >
                    {icon && <Animated.View style={styles.icon}>{icon}</Animated.View>}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: textColor,
                                fontSize: sizeStyles[size].fontSize,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    touchable: {
        borderRadius: 14,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
