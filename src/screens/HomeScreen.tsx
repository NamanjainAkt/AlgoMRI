import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown, FadeIn } from 'react-native-reanimated';
import { Header } from '../components/Header';
import { CodeEditor } from '../components/CodeEditor';
import { GlowButton } from '../components/GlowButton';
import { CircuitBackground } from '../components/CircuitBackground';
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
            await storageService.saveAnalysis(code, result);
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
            <CircuitBackground />
            <Header title="AlgoMRI" />

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Typography Hero */}
                <Animated.View entering={FadeInDown.duration(600)} style={styles.hero}>
                    <Text style={[styles.headline, { color: theme.text }]}>
                        Analyze your
                    </Text>
                    <Text style={[styles.headline, { color: theme.text }]}>
                        code instantly
                    </Text>
                </Animated.View>

                {/* Code Input */}
                <Animated.View entering={FadeInUp.duration(500).delay(200)}>
                    <CodeEditor
                        value={code}
                        onChangeText={setCode}
                    />
                </Animated.View>

                {/* Analyze Button */}
                <View style={styles.buttonContainer}>
                    {isAnalyzing ? (
                        <Animated.View entering={FadeIn.duration(300)} style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.primary} />
                            <Text style={[styles.loadingText, { color: theme.textMuted }]}>
                                Analyzing...
                            </Text>
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInUp.duration(500).delay(400)}>
                            <GlowButton
                                title="Analyze"
                                onPress={handleAnalyze}
                                disabled={!code.trim()}
                                size="large"
                            />
                        </Animated.View>
                    )}
                </View>

                <View style={styles.bottomSpace} />
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
        padding: 20,
    },
    hero: {
        marginBottom: 32,
        marginTop: 20,
        paddingLeft: 4,
    },
    headline: {
        fontSize: 42,
        fontWeight: '800',
        letterSpacing: -1.5,
        lineHeight: 46,
    },
    buttonContainer: {
        marginTop: 8,
    },
    loadingContainer: {
        paddingVertical: 24,
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '500',
    },
    bottomSpace: {
        height: 32,
    },
});
