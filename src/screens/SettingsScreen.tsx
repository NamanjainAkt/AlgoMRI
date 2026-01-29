import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { GlowButton } from '../components/GlowButton';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';

export const SettingsScreen = () => {
    const { theme } = useTheme();
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
                        AI Model Configuration
                    </Text>
                    <Text style={[styles.description, { color: theme.textMuted }]}>
                        Configure your AI model for code analysis. You'll need to set this up in the code.
                    </Text>

                    <Text style={[styles.label, { color: theme.text }]}>
                        API Key (Optional)
                    </Text>
                    <TextInput
                        value={apiKey}
                        onChangeText={setApiKey}
                        placeholder="Enter your API key..."
                        placeholderTextColor={theme.textMuted}
                        style={[
                            styles.input,
                            {
                                color: theme.text,
                                backgroundColor: theme.surface,
                                borderColor: theme.border,
                            }
                        ]}
                        secureTextEntry
                    />

                    <Text style={[styles.hint, { color: theme.textMuted }]}>
                        Note: Model configuration is done in aiAnalyzer.ts using setAIModel()
                    </Text>
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
});
