import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';
import { DryRunStep } from '../services/storageService';

interface DryRunStepperProps {
    steps: DryRunStep[];
}

export const DryRunStepper: React.FC<DryRunStepperProps> = ({ steps }) => {
    const { theme } = useTheme();
    const [currentStep, setCurrentStep] = useState(0);

    if (!steps || steps.length === 0) {
        return (
            <GlassCard>
                <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    No dry run data available
                </Text>
            </GlassCard>
        );
    }

    const step = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <GlassCard style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>
                    Dry Run - Step {currentStep + 1} of {steps.length}
                </Text>
            </View>

            <View style={[styles.stepCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.lineCode, { color: theme.primary }]}>
                    {step.line}
                </Text>
                <Text style={[styles.description, { color: theme.textMuted }]}>
                    {step.description}
                </Text>
            </View>

            <View style={styles.variablesSection}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                    Variables
                </Text>
                <View style={[styles.table, { borderColor: theme.border }]}>
                    <View style={[styles.tableHeader, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.tableHeaderText, { color: theme.text }]}>Name</Text>
                        <Text style={[styles.tableHeaderText, { color: theme.text }]}>Value</Text>
                    </View>
                    <ScrollView style={styles.tableBody}>
                        {Object.entries(step.variables).map(([key, value]) => (
                            <View key={key} style={[styles.tableRow, { borderTopColor: theme.border }]}>
                                <Text style={[styles.tableCellName, { color: theme.primary }]}>
                                    {key}
                                </Text>
                                <Text style={[styles.tableCellValue, { color: theme.text }]}>
                                    {JSON.stringify(value)}
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>

            <View style={styles.navigation}>
                <TouchableOpacity
                    onPress={handlePrevious}
                    disabled={currentStep === 0}
                    style={[
                        styles.navButton,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        currentStep === 0 && styles.navButtonDisabled
                    ]}
                >
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={currentStep === 0 ? theme.textMuted : theme.primary}
                    />
                    <Text style={[
                        styles.navButtonText,
                        { color: currentStep === 0 ? theme.textMuted : theme.text }
                    ]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNext}
                    disabled={currentStep === steps.length - 1}
                    style={[
                        styles.navButton,
                        { backgroundColor: theme.surface, borderColor: theme.border },
                        currentStep === steps.length - 1 && styles.navButtonDisabled
                    ]}
                >
                    <Text style={[
                        styles.navButtonText,
                        { color: currentStep === steps.length - 1 ? theme.textMuted : theme.text }
                    ]}>
                        Next
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={currentStep === steps.length - 1 ? theme.textMuted : theme.primary}
                    />
                </TouchableOpacity>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    stepCard: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 16,
    },
    lineCode: {
        fontSize: 14,
        fontFamily: 'monospace',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
    },
    variablesSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    table: {
        borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        padding: 12,
    },
    tableHeaderText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
    },
    tableBody: {
        maxHeight: 200,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 12,
        borderTopWidth: 1,
    },
    tableCellName: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'monospace',
    },
    tableCellValue: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'monospace',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 8,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 14,
    },
});
