import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Header } from '../components/Header';
import { FlowchartViewer } from '../components/FlowchartViewer';
import { DryRunStepper } from '../components/DryRunStepper';
import { ComplexityCard } from '../components/ComplexityCard';
import { TestCaseCard } from '../components/TestCaseCard';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { AnalysisResult } from '../services/storageService';
import type { RootStackParamList } from '../types/navigation';

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;

type TabType = 'flowchart' | 'pseudocode' | 'dryrun' | 'complexity' | 'tests';

export const ResultScreen = () => {
    const { theme } = useTheme();
    const route = useRoute<ResultScreenRouteProp>();
    const { result } = route.params;
    const [activeTab, setActiveTab] = useState<TabType>('flowchart');

    const tabs: { key: TabType; label: string }[] = [
        { key: 'flowchart', label: 'Flowchart' },
        { key: 'pseudocode', label: 'Pseudocode' },
        { key: 'dryrun', label: 'Dry Run' },
        { key: 'complexity', label: 'Complexity' },
        { key: 'tests', label: 'Tests' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'flowchart':
                return <FlowchartViewer mermaidCode={result.flowchart} />;

            case 'pseudocode':
                return (
                    <GlassCard>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Pseudocode
                        </Text>
                        <View style={[styles.codeBlock, { backgroundColor: theme.surface }]}>
                            {result.pseudocode.map((line, index) => (
                                <Text key={index} style={[styles.codeLine, { color: theme.text }]}>
                                    {index + 1}. {line}
                                </Text>
                            ))}
                        </View>

                        <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 16 }]}>
                            Step Summary
                        </Text>
                        {result.summary.map((step, index) => (
                            <View key={index} style={[styles.summaryItem, { borderLeftColor: theme.primary }]}>
                                <Text style={[styles.summaryText, { color: theme.text }]}>
                                    {step}
                                </Text>
                            </View>
                        ))}
                    </GlassCard>
                );

            case 'dryrun':
                return <DryRunStepper steps={result.dryRun} />;

            case 'complexity':
                return (
                    <>
                        <ComplexityCard complexity={result.complexity} />
                        {result.edgeCases && result.edgeCases.length > 0 && (
                            <GlassCard>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                    Edge Cases & Warnings
                                </Text>
                                {result.edgeCases.map((edgeCase, index) => (
                                    <View key={index} style={[styles.edgeCase, { backgroundColor: theme.surface }]}>
                                        <Text style={[styles.edgeCaseText, { color: theme.text }]}>
                                            • {edgeCase}
                                        </Text>
                                    </View>
                                ))}
                            </GlassCard>
                        )}
                    </>
                );

            case 'tests':
                return <TestCaseCard testCases={result.testCases} />;

            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header title={result.title} />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabsContainer}
                contentContainerStyle={styles.tabsContent}
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        onPress={() => setActiveTab(tab.key)}
                        style={[
                            styles.tab,
                            { borderBottomColor: theme.primary },
                            activeTab === tab.key && styles.activeTab,
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                { color: activeTab === tab.key ? theme.primary : theme.textMuted },
                            ]}
                        >
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
            >
                {renderContent()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabsContainer: {
        maxHeight: 50,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabsContent: {
        paddingHorizontal: 16,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 8,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomWidth: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    codeBlock: {
        padding: 16,
        borderRadius: 8,
    },
    codeLine: {
        fontSize: 14,
        fontFamily: 'monospace',
        lineHeight: 20,
        marginBottom: 4,
    },
    summaryItem: {
        borderLeftWidth: 3,
        paddingLeft: 12,
        marginBottom: 12,
    },
    summaryText: {
        fontSize: 14,
        lineHeight: 20,
    },
    edgeCase: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    edgeCaseText: {
        fontSize: 14,
    },
});
