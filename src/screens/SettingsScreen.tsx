import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    Switch,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    title: string;
    subtitle?: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    iconColor,
    title,
    subtitle,
    rightComponent,
    onPress,
    isFirst,
    isLast,
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            style={[
                styles.settingItem,
                !isFirst && styles.settingItemBorder,
                { borderColor: 'rgba(128, 128, 128, 0.1)' },
            ]}
        >
            <View style={[styles.settingIconContainer, { backgroundColor: `${iconColor}15` }]}>
                <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
                {subtitle && (
                    <Text style={[styles.settingSubtitle, { color: theme.textMuted }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightComponent ||
                (onPress && <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />)}
        </TouchableOpacity>
    );
};

interface Stats {
    total: number;
    lastDate: number | null;
}

const APP_VERSION = '1.0.0';

export const SettingsScreen = () => {
    const { theme, isDark, toggleTheme } = useTheme();
    const [stats, setStats] = useState<Stats>({ total: 0, lastDate: null });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        const history = await storageService.getHistory();
        setStats({
            total: history.length,
            lastDate: history[0]?.timestamp || null,
        });
    };

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleClearHistory = () => {
        Alert.alert(
            'Clear History',
            'This will delete all saved analyses. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await storageService.clearHistory();
                        setStats({ total: 0, lastDate: null });
                        Alert.alert('Success', 'History cleared successfully');
                    },
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header title="Settings" />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Statistics Section */}
                <Animated.View entering={FadeInUp.duration(400)}>
                    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>STATISTICS</Text>
                    <GlassCard style={styles.section} animated={false}>
                        <SettingItem
                            icon="analytics-outline"
                            iconColor="#10B981"
                            title="Total Analyses"
                            subtitle={`${stats.total} saved analyses`}
                            isFirst={true}
                        />
                        <SettingItem
                            icon="time-outline"
                            iconColor="#3B82F6"
                            title="Last Analysis"
                            subtitle={stats.lastDate ? formatDate(stats.lastDate) : 'No analyses yet'}
                            isFirst={false}
                        />
                        <SettingItem
                            icon="server-outline"
                            iconColor="#8B5CF6"
                            title="Storage Used"
                            subtitle={`~${(stats.total * 1).toFixed(0)} KB estimated`}
                            isFirst={false}
                            isLast={true}
                        />
                    </GlassCard>
                </Animated.View>

                {/* Appearance Section */}
                <Animated.View entering={FadeInUp.duration(400).delay(100)}>
                    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>APPEARANCE</Text>
                    <GlassCard style={styles.section} animated={false}>
                        <SettingItem
                            icon="moon-outline"
                            iconColor="#8B5CF6"
                            title="Dark Mode"
                            subtitle={isDark ? 'Dark theme active' : 'Light theme active'}
                            isFirst={true}
                            isLast={true}
                            rightComponent={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                    trackColor={{ false: '#D1D5DB', true: theme.accent }}
                                    thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
                                    ios_backgroundColor="#D1D5DB"
                                />
                            }
                        />
                    </GlassCard>
                </Animated.View>

                {/* Storage Section */}
                <Animated.View entering={FadeInUp.duration(400).delay(150)}>
                    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>STORAGE</Text>
                    <GlassCard style={styles.section} animated={false}>
                        <SettingItem
                            icon="trash-outline"
                            iconColor="#EF4444"
                            title="Clear History"
                            subtitle="Delete all saved analyses"
                            isFirst={true}
                            isLast={true}
                            onPress={handleClearHistory}
                        />
                    </GlassCard>
                </Animated.View>

                {/* About Section */}
                <Animated.View entering={FadeInUp.duration(400).delay(200)}>
                    <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>ABOUT</Text>
                    <GlassCard style={styles.section} animated={false}>
                        <SettingItem
                            icon="phone-portrait-outline"
                            iconColor="#0070F3"
                            title="Version"
                            subtitle={`AlgoMRI v${APP_VERSION}`}
                            isFirst={true}
                        />
                        <SettingItem
                            icon="code-slash-outline"
                            iconColor="#10B981"
                            title="Built with"
                            subtitle="React Native + Expo"
                            isFirst={false}
                            isLast={true}
                        />
                    </GlassCard>
                </Animated.View>

                {/* Footer */}
                <Animated.View entering={FadeInUp.duration(400).delay(250)} style={styles.footer}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://github.com/namanjainakt')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.footerText}>
                            Made with <Text style={styles.heart}>♥</Text> by{' '}
                            <Text style={styles.username}>Naman</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 8,
        marginTop: 20,
        marginLeft: 4,
    },
    section: {
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    settingItemBorder: {
        borderTopWidth: 1,
    },
    settingIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    settingSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    heart: {
        color: '#EF4444',
        fontSize: 16,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
    },
    username: {
        color: '#00ffd5',
        fontWeight: '600',
    },
    bottomSpace: {
        height: 32,
    },
});
