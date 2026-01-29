import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Header } from '../components/Header';
import { CodeEditor } from '../components/CodeEditor';
import { GlowButton } from '../components/GlowButton';
import { useTheme } from '../context/ThemeContext';
import { analyzeCode } from '../services/aiAnalyzer';
import { storageService } from '../services/storageService';
import type { RootStackParamList } from '../types/navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Tabs'>;

export const HomeScreen = () => {
    const { theme } = useTheme();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [code, setCode] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!code.trim()) {
            Alert.alert('Empty Code', 'Please enter some code to analyze');
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await analyzeCode(code);

            // Save to offline storage
            await storageService.saveAnalysis(code, result);

            // Navigate to results
            navigation.navigate('Result', { result, code });
        } catch (error) {
            console.error('Analysis error:', error);
            Alert.alert('Error', 'Failed to analyze code. Please check your model configuration.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header title="AlgoMRI" />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
            >
                <CodeEditor
                    value={code}
                    onChangeText={setCode}
                    placeholder="Paste your code here...&#10;&#10;Example:&#10;function bubbleSort(arr) {&#10;  for (let i = 0; i < arr.length; i++) {&#10;    for (let j = 0; j < arr.length - i - 1; j++) {&#10;      if (arr[j] > arr[j + 1]) {&#10;        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];&#10;      }&#10;    }&#10;  }&#10;  return arr;&#10;}"
                />

                {isAnalyzing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.primary} />
                    </View>
                ) : (
                    <GlowButton
                        title="Analyze Code"
                        onPress={handleAnalyze}
                        disabled={!code.trim()}
                    />
                )}
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
    loadingContainer: {
        padding: 32,
        alignItems: 'center',
    },
});
