import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, Text, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';

interface CodeEditorProps {
    value: string;
    onChangeText: (text: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChangeText,
}) => {
    const { theme, isDark } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const cursorOpacity = useSharedValue(1);

    // Blinking cursor animation
    useEffect(() => {
        if (!value && !isFocused) {
            cursorOpacity.value = withRepeat(
                withTiming(0, { duration: 800 }),
                -1,
                true
            );
        } else {
            cursorOpacity.value = 0;
        }
    }, [value, isFocused]);

    const cursorStyle = useAnimatedStyle(() => ({
        opacity: cursorOpacity.value,
    }));

    const lineCount = value.split('\n').length || 1;
    const showPlaceholder = !value && !isFocused;

    return (
        <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.container}>
            <View style={[
                styles.card,
                {
                    backgroundColor: isDark ? 'rgba(25, 25, 30, 0.8)' : 'rgba(245, 245, 250, 0.9)',
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                }
            ]}>
                <BlurView
                    intensity={isDark ? 30 : 50}
                    tint={isDark ? 'dark' : 'light'}
                    style={StyleSheet.absoluteFill}
                />
                
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.dots}>
                            <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
                            <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                            <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
                        </View>
                        <Text style={[styles.title, { color: theme.textMuted }]}>
                            code.editor
                        </Text>
                    </View>
                    <View style={styles.stats}>
                        <Text style={[styles.statsText, { color: theme.textMuted }]}>
                            {lineCount} lines
                        </Text>
                    </View>
                </View>

                {/* Editor */}
                <View style={styles.editorContainer}>
                    <LinearGradient
                        colors={isDark
                            ? ['rgba(0,0,0,0.3)', 'transparent']
                            : ['rgba(0,0,0,0.02)', 'transparent']
                        }
                        style={styles.editorGradient}
                    />

                    {/* Custom Placeholder */}
                    {showPlaceholder && (
                        <View style={styles.placeholderContainer} pointerEvents="none">
                            <View style={styles.placeholderLine}>
                                <Text style={[
                                    styles.placeholderComment,
                                    { color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.45)' }
                                ]}>
                                    //
                                </Text>
                                <Text style={[
                                    styles.placeholderText,
                                    { color: isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.55)' }
                                ]}>
                                    {' '}Paste your code here...
                                </Text>
                                <Animated.View style={[styles.cursor, { backgroundColor: theme.primary }, cursorStyle]} />
                            </View>
                            <View style={styles.placeholderLine}>
                                <Text style={[
                                    styles.placeholderComment,
                                    { color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)' }
                                ]}>
                                    //
                                </Text>
                                <Text style={[
                                    styles.placeholderHint,
                                    { color: isDark ? 'rgba(255,255,255,0.30)' : 'rgba(0,0,0,0.40)' }
                                ]}>
                                    {' '}We'll generate flowcharts, complexity analysis & more
                                </Text>
                            </View>
                        </View>
                    )}

                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        multiline
                        style={[
                            styles.input,
                            { color: theme.text }
                        ]}
                        textAlignVertical="top"
                        spellCheck={false}
                        autoCorrect={false}
                        autoCapitalize="none"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    card: {
        borderRadius: 20,
        borderWidth: 1,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128, 128, 128, 0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
        }),
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    stats: {
        flexDirection: 'row',
        gap: 12,
    },
    statsText: {
        fontSize: 12,
        fontWeight: '500',
    },
    editorContainer: {
        position: 'relative',
        minHeight: 280,
        maxHeight: 450,
    },
    editorGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        zIndex: 1,
    },
    placeholderContainer: {
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        zIndex: 0,
    },
    placeholderLine: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    placeholderComment: {
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontWeight: '400',
    },
    placeholderText: {
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontWeight: '400',
    },
    placeholderHint: {
        fontSize: 13,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        fontWeight: '400',
        letterSpacing: 0.2,
    },
    cursor: {
        width: 2,
        height: 18,
        marginLeft: 2,
        borderRadius: 1,
    },
    input: {
        flex: 1,
        minHeight: 280,
        maxHeight: 450,
        fontSize: 14,
        lineHeight: 22,
        padding: 16,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
        letterSpacing: 0.3,
        zIndex: 2,
    },
});
