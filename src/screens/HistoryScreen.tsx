import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInRight, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { storageService, SavedAnalysis } from '../services/storageService';
import type { RootStackParamList } from '../types/navigation';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export const HistoryScreen = () => {
    const { theme, isDark } = useTheme();
    const navigation = useNavigation<HistoryScreenNavigationProp>();
    const [history, setHistory] = useState<SavedAnalysis[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await storageService.getHistory();
            setHistory(data);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            const results = await storageService.searchHistory(query);
            setHistory(results);
        } else {
            loadHistory();
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Analysis',
            'Are you sure you want to delete this analysis?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await storageService.deleteAnalysis(id);
                        loadHistory();
                    },
                },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            'Clear History',
            'Are you sure you want to delete all saved analyses?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                        await storageService.clearHistory();
                        loadHistory();
                    },
                },
            ]
        );
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const renderItem = ({ item, index }: { item: SavedAnalysis; index: number }) => {
        return (
            <Animated.View
                entering={FadeInUp.delay(index * 50)}
                layout={Layout.springify()}
            >
                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('Result', { result: item.result, code: item.code })}
                >
                    <GlassCard style={styles.historyItem} animated={false}>
                        <View style={styles.itemHeader}>
                            <View style={styles.titleContainer}>
                                <View style={[styles.algoIcon, { backgroundColor: `${theme.primary}15` }]}>
                                    <Ionicons name="cube-outline" size={18} color={theme.primary} />
                                </View>
                                <Text style={[styles.itemTitle, { color: theme.text }]} numberOfLines={1}>
                                    {item.title}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={styles.deleteButton}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <View style={[styles.deleteButtonInner, { backgroundColor: `${theme.accent}12` }]}>
                                    <Ionicons name="trash-outline" size={18} color={theme.accent} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.codePreview}>
                            <Text
                                style={[styles.itemCode, { color: theme.textMuted }]}
                                numberOfLines={2}
                            >
                                {item.code}
                            </Text>
                        </View>

                        <View style={styles.itemFooter}>
                            <View style={styles.timeContainer}>
                                <Ionicons name="time-outline" size={14} color={theme.textMuted} />
                                <Text style={[styles.itemDate, { color: theme.textMuted }]}>
                                    {formatDate(item.timestamp)}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
                        </View>
                    </GlassCard>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const renderEmptyState = () => (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.emptyContainer}>
            <LinearGradient
                colors={isDark ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)'] : ['rgba(59, 130, 246, 0.05)', 'rgba(139, 92, 246, 0.05)']}
                style={styles.emptyIconBg}
            >
                <Ionicons name="folder-open-outline" size={48} color={theme.textMuted} />
            </LinearGradient>
            <Text style={[styles.emptyText, { color: theme.text }]}>
                {searchQuery ? 'No results found' : 'No saved analyses yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>
                {searchQuery ? 'Try a different search term' : 'Analyze some code to get started!'}
            </Text>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header
                title="History"
                rightComponent={
                    history.length > 0 && (
                        <TouchableOpacity onPress={handleClearAll}>
                            <Text style={[styles.clearButton, { color: theme.accent }]}>
                                Clear All
                            </Text>
                        </TouchableOpacity>
                    )
                }
            />

            <Animated.View entering={FadeInUp.duration(400)} style={styles.searchContainer}>
                <View style={[
                    styles.searchBox,
                    {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    }
                ]}>
                    <Ionicons name="search" size={20} color={theme.textMuted} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Search analyses..."
                        placeholderTextColor={theme.textMuted}
                        style={[styles.searchInput, { color: theme.text }]}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color={theme.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </Animated.View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <View style={[styles.loadingCircle, { borderColor: theme.primary }]}>
                        <ActivityIndicator size="small" color={theme.primary} />
                    </View>
                </View>
            ) : history.length === 0 ? (
                renderEmptyState()
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

import { ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
        paddingTop: 4,
    },
    historyItem: {
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
    },
    algoIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    deleteButton: {},
    deleteButtonInner: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    codePreview: {
        backgroundColor: 'rgba(128, 128, 128, 0.05)',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
    },
    itemCode: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        lineHeight: 18,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemDate: {
        fontSize: 13,
        fontWeight: '500',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyIconBg: {
        width: 96,
        height: 96,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 240,
        lineHeight: 20,
    },
    clearButton: {
        fontSize: 14,
        fontWeight: '600',
    },
});
