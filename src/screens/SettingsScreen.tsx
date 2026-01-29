import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Switch, TouchableOpacity } from 'react-native';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';

export const SettingsScreen = () => {
    const { theme, isDark, toggleTheme } = useTheme();
    const [apiKey, setApiKey] = useState('');

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
            >
                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Appearance
                    </Text>
                    <View style={styles.row}>
                        <View>
                            <Text style={[styles.rowTitle, { color: theme.text }]}>
                                Dark Mode
                            </Text>
                            <Text style={[styles.rowSubtitle, { color: theme.textMuted }]}>
                                {isDark ? 'Dark mode is active' : 'Light mode is active'}
                            </Text>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#767577', true: theme.accent }}
                            thumbColor={isDark ? '#FFFFFF' : '#f4f3f4'}
                        />
                    </View>
                </GlassCard>

                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Storage
                    </Text>
                    <Text style={[styles.description, { color: theme.textMuted }]}>
                        Manage your offline saved analyses. Maximum 50 items are stored.
                    </Text>

                    <GlowButton
                        title="Clear All History"
                        onPress={handleClearHistory}
                        style={styles.button}
                    />
                </GlassCard>

                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        About
                    </Text>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                            Version
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            1.0.0
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={[styles.infoLabel, { color: theme.textMuted }]}>
                            Max Saved Items
                        </Text>
                        <Text style={[styles.infoValue, { color: theme.text }]}>
                            50
                        </Text>
                    </View>
                </GlassCard>
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
        padding: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 14,
        marginBottom: 8,
    },
    hint: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    button: {
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowSubtitle: {
        fontSize: 12,
        marginTop: 4,
    },
});
