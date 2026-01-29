import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { useTheme } from '../context/ThemeContext';

interface CodeEditorProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    value,
    onChangeText,
    placeholder = 'Paste your code here...'
}) => {
    const { theme } = useTheme();

    return (
        <GlassCard style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Code Input</Text>
                <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: '#FF5F56' }]} />
                    <View style={[styles.dot, { backgroundColor: '#FFBD2E' }]} />
                    <View style={[styles.dot, { backgroundColor: '#27C93F' }]} />
                </View>
            </View>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={theme.textMuted}
                multiline
                style={[
                    styles.input,
                    {
                        color: theme.text,
                        borderColor: theme.border,
                    }
                ]}
                textAlignVertical="top"
            />
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    input: {
        minHeight: 200,
        maxHeight: 400,
        fontSize: 14,
        lineHeight: 20,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: 'monospace',
    },
});
