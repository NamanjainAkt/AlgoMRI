import React, { useRef, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from './GlassCard';

interface FlowchartViewerProps {
    mermaidCode: string;
}

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ mermaidCode }) => {
    const { theme, isDark } = useTheme();
    const webViewRef = useRef<WebView>(null);
    const viewRef = useRef<View>(null);
    const [isLoading, setIsLoading] = useState(true);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background-color: ${isDark ? '#000000' : '#FFFFFF'};
          color: ${isDark ? '#EDEDED' : '#000000'};
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 24px;
        }
        .mermaid { width: 100%; text-align: center; }
      </style>
    </head>
    <body>
      <div class="mermaid">${mermaidCode}</div>
      <script>
        try {
          mermaid.initialize({
            startOnLoad: true,
            theme: 'base',
            themeVariables: ${isDark ? `{
              primaryColor: '#000000',
              primaryTextColor: '#EDEDED',
              primaryBorderColor: '#333333',
              lineColor: '#666666',
              secondaryColor: '#111111',
              tertiaryColor: '#111111',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              mainBkg: '#000000',
              nodeBorder: '#333333',
              clusterBkg: '#111111',
              clusterBorder: '#333333',
              edgeLabelBackground: '#111111',
            }` : `{
              primaryColor: '#FFFFFF',
              primaryTextColor: '#000000',
              primaryBorderColor: '#EAEAEA',
              lineColor: '#999999',
              secondaryColor: '#FAFAFA',
              tertiaryColor: '#FFFFFF',
              fontFamily: 'sans-serif',
              fontSize: '14px',
              mainBkg: '#FFFFFF',
              nodeBorder: '#EAEAEA',
              clusterBkg: '#FAFAFA',
              clusterBorder: '#EAEAEA',
              edgeLabelBackground: '#FFFFFF',
            }`}
          });
        } catch (e) {
          console.error('Mermaid init error:', e);
          document.body.innerHTML = '<div style="color: #EE0000; padding: 20px; font-family: sans-serif;">Flowchart Syntax Error: ' + e.message + '</div>';
        }
        
        window.ReactNativeWebView?.postMessage(JSON.stringify({ type: 'loaded' }));
      </script>
    </body>
    </html>
  `;

    const handleDownload = async () => {
        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant media library permission');
                return;
            }

            if (!viewRef.current) return;

            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });

            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('AlgoMRI', asset, false);

            Alert.alert('Success', 'Flowchart saved to gallery!');
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Failed to save flowchart');
        }
    };

    const handleShare = async () => {
        try {
            if (!viewRef.current) return;

            const uri = await captureRef(viewRef, {
                format: 'png',
                quality: 1,
            });

            await Sharing.shareAsync(uri);
        } catch (error) {
            console.error('Share error:', error);
            Alert.alert('Error', 'Failed to share flowchart');
        }
    };

    return (
        <GlassCard style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Flowchart</Text>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={handleDownload} style={styles.iconButton}>
                        <Ionicons name="download" size={20} color={theme.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                        <Ionicons name="share-social" size={20} color={theme.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            <View ref={viewRef} style={styles.webViewContainer}>
                <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: htmlContent }}
                    style={[styles.webView, { backgroundColor: theme.background }]}
                    onLoadEnd={() => setIsLoading(false)}
                    javaScriptEnabled
                />
            </View>
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
        fontSize: 18,
        fontWeight: '700',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        padding: 8,
    },
    webViewContainer: {
        height: 600,
        borderRadius: 8,
        overflow: 'hidden',
    },
    webView: {
        flex: 1,
    },
});
