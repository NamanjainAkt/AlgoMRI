import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';

interface ComplexityCardProps {
    complexity: {
        time: { best: string; avg: string; worst: string };
        space: string;
        warnings: string[];
    };
}

export const ComplexityCard: React.FC<ComplexityCardProps> = ({ complexity }) => {
    const { theme } = useTheme();

    const getBadgeColor = (value: string) => {
        if (value.includes('1') || value.includes('log')) return '#27C93F';
        if (value.includes('n²') || value.includes('2^n')) return '#FF5F56';
        return '#FFBD2E';
    };

    return (
        <GlassCard style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>
                Time & Space Complexity
            </Text>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                    Time Complexity
                </Text>
                <View style={styles.badges}>
                    <View style={styles.badgeRow}>
                        <Text style={[styles.badgeLabel, { color: theme.textMuted }]}>Best:</Text>
                        <View style={[styles.badge, { backgroundColor: getBadgeColor(complexity.time.best) }]}>
                            <Text style={styles.badgeText}>{complexity.time.best}</Text>
                        </View>
                    </View>
                    <View style={styles.badgeRow}>
                        <Text style={[styles.badgeLabel, { color: theme.textMuted }]}>Avg:</Text>
                        <View style={[styles.badge, { backgroundColor: getBadgeColor(complexity.time.avg) }]}>
                            <Text style={styles.badgeText}>{complexity.time.avg}</Text>
                        </View>
                    </View>
                    <View style={styles.badgeRow}>
                        <Text style={[styles.badgeLabel, { color: theme.textMuted }]}>Worst:</Text>
                        <View style={[styles.badge, { backgroundColor: getBadgeColor(complexity.time.worst) }]}>
                            <Text style={styles.badgeText}>{complexity.time.worst}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                    Space Complexity
                </Text>
                <View style={[styles.badge, { backgroundColor: getBadgeColor(complexity.space) }]}>
                    <Text style={styles.badgeText}>{complexity.space}</Text>
                </View>
            </View>

            {complexity.warnings && complexity.warnings.length > 0 && (
                <View style={styles.warningsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
                        Warnings
                    </Text>
                    {complexity.warnings.map((warning, index) => (
                        <View key={index} style={[styles.warning, { backgroundColor: theme.surface }]}>
                            <Ionicons name="warning" size={16} color="#FFBD2E" />
                            <Text style={[styles.warningText, { color: theme.text }]}>
                                {warning}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    badges: {
        gap: 8,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    badgeLabel: {
        fontSize: 14,
        width: 50,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    badgeText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '700',
        fontFamily: 'monospace',
    },
    warningsSection: {
        marginTop: 8,
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
        gap: 8,
    },
    warningText: {
        flex: 1,
        fontSize: 14,
    },
});
