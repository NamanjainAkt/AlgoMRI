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
        if (value.includes('1') || value.includes('log')) return '#0070F3'; // Blue
        if (value.includes('n²') || value.includes('2^n')) return '#FF0080'; // Pink/Red
        return '#F5A623'; // Orange
    };

    const ComplexityBox = ({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) => (
        <View style={[styles.complexityBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Ionicons name={icon} size={20} color={theme.textMuted} style={styles.boxIcon} />
            <Text style={[styles.boxLabel, { color: theme.textMuted }]}>{label}</Text>
            <View style={[styles.boxBadge, { backgroundColor: getBadgeColor(value) }]}>
                <Text style={styles.boxBadgeText}>{value}</Text>
            </View>
        </View>
    );

    return (
        <GlassCard style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="speedometer-outline" size={24} color={theme.primary} />
                <Text style={[styles.title, { color: theme.text }]}>
                    Complexity Analysis
                </Text>
            </View>

            <View style={styles.timeSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Time Complexity
                </Text>
                <View style={styles.grid}>
                    <ComplexityBox label="Best Case" value={complexity.time.best} icon="flash-outline" />
                    <ComplexityBox label="Average" value={complexity.time.avg} icon="analytics-outline" />
                    <ComplexityBox label="Worst Case" value={complexity.time.worst} icon="warning-outline" />
                </View>
            </View>

            <View style={styles.spaceSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Space Complexity
                </Text>
                <View style={[styles.spaceBadge, { backgroundColor: getBadgeColor(complexity.space) }]}>
                    <Ionicons name="cube-outline" size={18} color="#000" />
                    <Text style={styles.spaceBadgeText}>{complexity.space}</Text>
                </View>
            </View>

            {complexity.warnings && complexity.warnings.length > 0 && (
                <View style={styles.warningsSection}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                        Performance Warnings
                    </Text>
                    {complexity.warnings.map((warning, index) => (
                        <View key={index} style={[styles.warning, { backgroundColor: theme.surface, borderColor: '#F5A623' }]}>
                            <Ionicons name="alert-circle" size={18} color="#F5A623" />
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    timeSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    grid: {
        flexDirection: 'row',
        gap: 10,
        flexWrap: 'wrap',
    },
    complexityBox: {
        flex: 1,
        minWidth: 100,
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        gap: 8,
    },
    boxIcon: {
        marginBottom: 4,
    },
    boxLabel: {
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    boxBadge: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 16,
        marginTop: 4,
    },
    boxBadgeText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    spaceSection: {
        marginBottom: 20,
    },
    spaceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
    },
    spaceBadgeText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '800',
        fontFamily: 'monospace',
    },
    warningsSection: {
        marginTop: 8,
    },
    warning: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10,
        marginTop: 10,
        gap: 10,
        borderWidth: 1,
        borderLeftWidth: 4,
    },
    warningText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
});

