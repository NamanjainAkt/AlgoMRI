import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
    title: string;
    showThemeToggle?: boolean;
    rightComponent?: React.ReactNode;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showThemeToggle = true,
    rightComponent,
    showBackButton = false,
    onBackPress,
}) => {
    const { theme, isDark, toggleTheme } = useTheme();

    return (
        <Animated.View
            entering={FadeInDown.duration(400).springify()}
            style={[styles.container, { backgroundColor: theme.surface }]}
        >
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    {showBackButton && onBackPress && (
                        <TouchableOpacity
                            onPress={onBackPress}
                            style={styles.backButton}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.backButtonCircle, { backgroundColor: `${theme.primary}20` }]}>
                                <Ionicons name="arrow-back" size={22} color={theme.primary} />
                            </View>
                        </TouchableOpacity>
                    )}
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                        {title}
                    </Text>
                </View>

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
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 52,
        paddingBottom: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    backButton: {
        marginRight: 4,
    },
    backButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    gradient: {
        height: 3,
        marginTop: 12,
        borderRadius: 1.5,
    },
});
