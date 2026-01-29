import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';
import { TestCase } from '../services/storageService';

interface TestCaseCardProps {
    testCases: TestCase[];
}

export const TestCaseCard: React.FC<TestCaseCardProps> = ({ testCases }) => {
    const { theme } = useTheme();

    if (!testCases || testCases.length === 0) {
        return (
            <GlassCard>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    No test cases available
                </Text>
            </GlassCard>
        );
    }

    return (
        <GlassCard style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>
                Test Cases
            </Text>

            {testCases.map((testCase, index) => (
                <View
                    key={index}
                    style={[styles.testCase, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                    <View style={styles.header}>
                        <Text style={[styles.testNumber, { color: theme.text }]}>
                            Test {index + 1}
                        </Text>
                        {testCase.isEdgeCase && (
                            <View style={[styles.badge, { backgroundColor: theme.accent }]}>
                                <Text style={styles.badgeText}>Edge Case</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textMuted }]}>Input:</Text>
                        <Text style={[styles.value, { color: theme.primary }]}>
                            {testCase.input}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.label, { color: theme.textMuted }]}>Expected:</Text>
                        <Text style={[styles.value, { color: theme.secondary }]}>
                            {testCase.expectedOutput}
                        </Text>
                    </View>
                </View>
            ))}
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
    testCase: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    testNumber: {
        fontSize: 16,
        fontWeight: '600',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    row: {
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        fontFamily: 'monospace',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
    },
});
