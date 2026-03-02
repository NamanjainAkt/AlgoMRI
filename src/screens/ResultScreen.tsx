import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInRight, FadeInUp, Layout } from 'react-native-reanimated';
import { Header } from '../components/Header';
import { FlowchartViewer } from '../components/FlowchartViewer/FlowchartViewer';
import { DryRunStepper } from '../components/DryRunStepper';
import { ComplexityCard } from '../components/ComplexityCard';
import { TestCaseCard } from '../components/TestCaseCard';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { AnalysisResult } from '../services/storageService';
import type { RootStackParamList } from '../types/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ResultScreenRouteProp = RouteProp<RootStackParamList, 'Result'>;
type ResultScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = 'flowchart' | 'pseudocode' | 'dryrun' | 'complexity' | 'tests';

interface Tab {
    key: TabType;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

export const ResultScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<ResultScreenNavigationProp>();
    const route = useRoute<ResultScreenRouteProp>();
    const { result } = route.params;
    const [activeTab, setActiveTab] = useState<TabType>('flowchart');

    const tabs: Tab[] = [
        { key: 'flowchart', label: 'Flowchart', icon: 'git-network-outline', color: '#3B82F6' },
        { key: 'pseudocode', label: 'Code', icon: 'code-slash-outline', color: '#8B5CF6' },
        { key: 'dryrun', label: 'Dry Run', icon: 'play-outline', color: '#10B981' },
        { key: 'complexity', label: 'Complexity', icon: 'speedometer-outline', color: '#F59E0B' },
        { key: 'tests', label: 'Tests', icon: 'checkbox-outline', color: '#EC4899' },
    ];

    const handleGoBack = () => {
        navigation.goBack();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'flowchart':
                return (
                    <Animated.View entering={FadeInUp.duration(300)} key="flowchart">
                        <FlowchartViewer
                            nodes={result.flowchartNodes || []}
                            edges={result.flowchartEdges || []}
                            isDark={theme.background === '#0A0A0A'}
                        />
                    </Animated.View>
                );

            case 'pseudocode':
                return (
                    <Animated.View entering={FadeInUp.duration(300)} key="pseudocode">
                        <GlassCard style={styles.contentCard}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: '#8B5CF620' }]}>
                                    <Ionicons name="document-text-outline" size={20} color="#8B5CF6" />
                                </View>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                    Pseudocode
                                </Text>
                            </View>
                            <View style={[styles.codeBlock, { backgroundColor: theme.surface }]}>
                                {result.pseudocode.map((line, index) => (
                                    <View key={index} style={styles.codeLineContainer}>
                                        <Text style={[styles.lineNumber, { color: theme.textMuted }]}>
                                            {index + 1}
                                        </Text>
                                        <Text style={[styles.codeLine, { color: theme.text }]}>
                                            {line}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.sectionHeader}>
                                <View style={[styles.iconContainer, { backgroundColor: '#10B98120' }]}>
                                    <Ionicons name="list-outline" size={20} color="#10B981" />
                                </View>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                    Step Summary
                                </Text>
                            </View>
                            {result.summary.map((step, index) => (
                                <Animated.View
                                    key={index}
                                    entering={FadeInRight.delay(index * 50)}
                                    style={[styles.summaryItem, { borderLeftColor: theme.primary }]}
                                >
                                    <Text style={[styles.summaryText, { color: theme.text }]}>
                                        {step}
                                    </Text>
                                </Animated.View>
                            ))}
                        </GlassCard>
                    </Animated.View>
                );

            case 'dryrun':
                return (
                    <Animated.View entering={FadeInUp.duration(300)} key="dryrun">
                        <DryRunStepper steps={result.dryRun} />
                    </Animated.View>
                );

            case 'complexity':
                return (
                    <Animated.View entering={FadeInUp.duration(300)} key="complexity">
                        <ComplexityCard complexity={result.complexity} />
                        {result.edgeCases && result.edgeCases.length > 0 && (
                            <GlassCard style={styles.contentCard}>
                                <View style={styles.sectionHeader}>
                                    <View style={[styles.iconContainer, { backgroundColor: '#F59E0B20' }]}>
                                        <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                                    </View>
                                    <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                        Edge Cases & Warnings
                                    </Text>
                                </View>
                                {result.edgeCases.map((edgeCase, index) => (
                                    <Animated.View
                                        key={index}
                                        entering={FadeInRight.delay(index * 50)}
                                        style={[styles.edgeCase, { backgroundColor: `${theme.accent}15` }]}
                                    >
                                        <Ionicons name="alert-circle" size={16} color={theme.accent} style={styles.edgeCaseIcon} />
                                        <Text style={[styles.edgeCaseText, { color: theme.text }]}>
                                            {edgeCase}
                                        </Text>
                                    </Animated.View>
                                ))}
                            </GlassCard>
                        )}
                    </Animated.View>
                );

            case 'tests':
                return (
                    <Animated.View entering={FadeInUp.duration(300)} key="tests">
                        <TestCaseCard testCases={result.testCases} />
                    </Animated.View>
                );

            default:
                return null;
        }
    };

    const activeTabIndex = tabs.findIndex(t => t.key === activeTab);

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header
                title={result.title}
                showBackButton={true}
                onBackPress={handleGoBack}
            />

            <View style={styles.tabsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsContainer}
                    contentContainerStyle={styles.tabsContent}
                >
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === tab.key;
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                onPress={() => setActiveTab(tab.key)}
                                activeOpacity={0.8}
                                style={[
                                    styles.tab,
                                    isActive && {
                                        backgroundColor: `${tab.color}20`,
                                        borderColor: tab.color,
                                    },
                                    !isActive && {
                                        backgroundColor: theme.surface,
                                        borderColor: theme.border,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={tab.icon}
                                    size={18}
                                    color={isActive ? tab.color : theme.textMuted}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        {
                                            color: isActive ? tab.color : theme.textMuted,
                                            fontWeight: isActive ? '700' : '500',
                                        },
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                                {isActive && (
                                    <View style={[styles.activeIndicator, { backgroundColor: tab.color }]} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
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
    tabsWrapper: {
        marginVertical: 12,
    },
    tabsContainer: {
        maxHeight: 60,
    },
    tabsContent: {
        paddingHorizontal: 16,
        gap: 10,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderWidth: 1.5,
        position: 'relative',
        overflow: 'hidden',
    },
    tabText: {
        fontSize: 14,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 12,
        right: 12,
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
        paddingTop: 8,
    },
    contentCard: {
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    codeBlock: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    codeLineContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    lineNumber: {
        fontSize: 13,
        fontFamily: 'monospace',
        width: 28,
        textAlign: 'right',
        marginRight: 12,
        opacity: 0.6,
    },
    codeLine: {
        fontSize: 13,
        fontFamily: 'monospace',
        lineHeight: 20,
        flex: 1,
    },
    summaryItem: {
        borderLeftWidth: 3,
        paddingLeft: 14,
        marginBottom: 12,
        paddingVertical: 4,
    },
    summaryText: {
        fontSize: 14,
        lineHeight: 20,
    },
    edgeCase: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    edgeCaseIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    edgeCaseText: {
        fontSize: 14,
        flex: 1,
        lineHeight: 20,
    },
});
