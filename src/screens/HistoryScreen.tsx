import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { GlassCard } from '../components/GlassCard';
import { useTheme } from '../context/ThemeContext';
import { storageService, SavedAnalysis } from '../services/storageService';
import type { RootStackParamList } from '../types/navigation';

type HistoryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HistoryScreen = () => {
    const { theme } = useTheme();
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

    const renderItem = ({ item }: { item: SavedAnalysis }) => {
        const date = new Date(item.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('Result', { result: item.result, code: item.code })}
            >
                <GlassCard style={styles.historyItem}>
                    <View style={styles.itemHeader}>
                        <Text style={[styles.itemTitle, { color: theme.text }]}>
                            {item.title}
                        </Text>
                        <TouchableOpacity onPress={() => handleDelete(item.id)}>
                            <Ionicons name="trash-outline" size={20} color={theme.accent} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.itemDate, { color: theme.textMuted }]}>
                        {formattedDate}
                    </Text>

                    <Text
                        style={[styles.itemCode, { color: theme.textMuted }]}
                        numberOfLines={2}
                    >
                        {item.code}
                    </Text>
                </GlassCard>
            </TouchableOpacity>
        );
    };

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

            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="search" size={20} color={theme.textMuted} />
                    <TextInput
                        value={searchQuery}
                        onChangeText={handleSearch}
                        placeholder="Search history..."
                        placeholderTextColor={theme.textMuted}
                        style={[styles.searchInput, { color: theme.text }]}
                    />
                </View>
            </View>

            {isLoading ? (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                        Loading...
                    </Text>
                </View>
            ) : history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="folder-open-outline" size={64} color={theme.textMuted} />
                    <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                        {searchQuery ? 'No results found' : 'No saved analyses yet'}
                    </Text>
                    <Text style={[styles.emptySubtext, { color: theme.textMuted }]}>
                        {searchQuery ? 'Try a different search term' : 'Analyze some code to get started!'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 16,
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
    },
    listContent: {
        padding: 16,
        paddingTop: 0,
    },
    historyItem: {
        marginBottom: 12,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    itemDate: {
        fontSize: 12,
        marginBottom: 8,
    },
    itemCode: {
        fontSize: 12,
        fontFamily: 'monospace',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
    clearButton: {
        fontSize: 14,
        fontWeight: '600',
    },
});
