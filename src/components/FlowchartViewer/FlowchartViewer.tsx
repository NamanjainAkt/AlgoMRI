import React, { useMemo, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import Svg, { Rect, Polygon, Path, Text as SvgText, G, Defs, Marker } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { captureRef as captureRefFn } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { FlowchartNode, FlowchartEdge } from '../../services/storageService';
import { getLayoutedElements, calculateViewBox, LayoutedNode, LayoutedEdge } from '../../utils/layoutEngine';

interface FlowchartViewerProps {
    nodes: FlowchartNode[];
    edges: FlowchartEdge[];
    isDark?: boolean;
}

type NodeColors = {
    bg: string;
    border: string;
    text: string;
};

const NODE_COLORS_LIGHT: Record<string, NodeColors> = {
    start: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
    end: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
    process: { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
    decision: { bg: '#FFEDD5', border: '#F97316', text: '#9A3412' },
    io: { bg: '#EDE9FE', border: '#8B5CF6', text: '#6D28D9' },
    loop: { bg: '#FFE4E6', border: '#EC4899', text: '#9F1239' },
    return: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B' },
};

const NODE_COLORS_DARK: Record<string, NodeColors> = {
    start: { bg: '#6EE7B7', border: '#34D399', text: '#064E3B' },
    end: { bg: '#6EE7B7', border: '#34D399', text: '#064E3B' },
    process: { bg: '#93C5FD', border: '#60A5FA', text: '#1E3A8A' },
    decision: { bg: '#FDBA74', border: '#FB923C', text: '#7C2D12' },
    io: { bg: '#C4B5FD', border: '#A78BFA', text: '#5B21B6' },
    loop: { bg: '#FDA4AF', border: '#F472B6', text: '#881337' },
    return: { bg: '#FCA5A5', border: '#F87171', text: '#7F1D1D' },
};

const DIAMOND_PADDING = 16;

const FlowchartNodeComponent = React.memo(({ node, colors }: { node: LayoutedNode; colors: NodeColors }) => {
    const { x, y, width, height, label, type } = node;

    if (type === 'decision') {
        const cx = x + width / 2;
        const cy = y + height / 2;
        const size = Math.max(width, height) / 2 + DIAMOND_PADDING;
        const points = `${cx},${cy - size} ${cx + size},${cy} ${cx},${cy + size} ${cx - size},${cy}`;

        return (
            <G>
                <Polygon points={points} fill={colors.bg} stroke={colors.border} strokeWidth={2} />
                <SvgText x={cx} y={cy + 4} fill={colors.text} fontSize={11} fontWeight="600" textAnchor="middle">
                    {label}
                </SvgText>
            </G>
        );
    }

    if (type === 'start' || type === 'end') {
        return (
            <G>
                <Rect x={x} y={y} width={width} height={height} rx={height / 2} ry={height / 2} fill={colors.bg} stroke={colors.border} strokeWidth={2} />
                <SvgText x={x + width / 2} y={y + height / 2 + 4} fill={colors.text} fontSize={12} fontWeight="600" textAnchor="middle">
                    {label}
                </SvgText>
            </G>
        );
    }

    return (
        <G>
            <Rect x={x} y={y} width={width} height={height} rx={6} fill={colors.bg} stroke={colors.border} strokeWidth={2} />
            <SvgText x={x + width / 2} y={y + height / 2 + 4} fill={colors.text} fontSize={11} fontWeight="500" textAnchor="middle">
                {label}
            </SvgText>
        </G>
    );
});

const FlowchartEdgeComponent = React.memo(({ edge, colors, arrowColor }: { edge: LayoutedEdge; colors: NodeColors; arrowColor: string }) => {
    if (!edge.points || edge.points.length < 2) return null;

    const pathData = edge.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    const midIndex = Math.floor(edge.points.length / 2);
    const midPoint = edge.points[midIndex];

    return (
        <G>
            <Path d={pathData} stroke={colors.border} strokeWidth={2} fill="none" markerEnd={`url(#arrow-${arrowColor.replace('#', '')})`} />
            {edge.label && midPoint && (
                <>
                    <Rect x={midPoint.x - 15} y={midPoint.y - 10} width={30} height={20} rx={4} fill={colors.bg} opacity={0.9} />
                    <SvgText x={midPoint.x} y={midPoint.y + 4} fill={colors.text} fontSize={10} fontWeight="500" textAnchor="middle">
                        {edge.label}
                    </SvgText>
                </>
            )}
        </G>
    );
});

const SvgContent: React.FC<{
    viewBox: string;
    width: number;
    height: number;
    layoutedEdges: LayoutedEdge[];
    layoutedNodes: LayoutedNode[];
    colorScheme: Record<string, NodeColors>;
    arrowColor: string;
}> = ({ viewBox, width, height, layoutedEdges, layoutedNodes, colorScheme, arrowColor }) => (
    <Svg width={width} height={height} viewBox={viewBox}>
        <Defs>
            <Marker id="arrow-60A5FA" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <Path d="M0,0 L0,6 L9,3 z" fill="#60A5FA" />
            </Marker>
            <Marker id="arrow-3B82F6" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                <Path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
            </Marker>
        </Defs>

        {layoutedEdges.map((edge, index) => (
            <FlowchartEdgeComponent
                key={`edge-${index}`}
                edge={edge}
                colors={colorScheme[edge.from] || colorScheme.process}
                arrowColor={arrowColor}
            />
        ))}

        {layoutedNodes.map((node) => (
            <FlowchartNodeComponent
                key={node.id}
                node={node}
                colors={colorScheme[node.type] || colorScheme.process}
            />
        ))}
    </Svg>
);

const parseViewBox = (viewBox: string): { x: number; y: number; w: number; h: number } => {
    const parts = viewBox.split(' ').map(Number);
    return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
};

export const FlowchartViewer: React.FC<FlowchartViewerProps> = ({ nodes, edges, isDark = false }) => {
    const captureRef = useRef<View>(null);
    const { width: screenWidth } = useWindowDimensions();
    const colorScheme = isDark ? NODE_COLORS_DARK : NODE_COLORS_LIGHT;
    const arrowColor = isDark ? '#60A5FA' : '#3B82F6';
    const [zoomPercent, setZoomPercent] = useState(100);

    const { layoutedNodes, layoutedEdges, viewBox } = useMemo(() => {
        const layouted = getLayoutedElements(nodes, edges);
        return {
            layoutedNodes: layouted.nodes,
            layoutedEdges: layouted.edges,
            viewBox: calculateViewBox(layouted.nodes),
        };
    }, [nodes, edges]);

    // Parse viewBox to get actual content dimensions
    const { svgWidth, svgHeight, captureWidth, captureHeight } = useMemo(() => {
        const vb = parseViewBox(viewBox);
        // For display: fit to screen width with some padding
        const displayPadding = 32;
        const maxDisplayWidth = screenWidth - displayPadding;
        const aspectRatio = vb.w / vb.h;
        const displayW = Math.min(vb.w, maxDisplayWidth);
        const displayH = displayW / aspectRatio;
        // For capture: use actual viewBox dimensions at 1:1 (capped at 2x for very large charts)
        const maxCapture = 2000;
        const captureScale = Math.min(1, maxCapture / Math.max(vb.w, vb.h));
        return {
            svgWidth: displayW,
            svgHeight: displayH,
            captureWidth: Math.round(vb.w * captureScale),
            captureHeight: Math.round(vb.h * captureScale),
        };
    }, [viewBox, screenWidth]);

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const clampScale = (s: number) => {
        'worklet';
        return Math.min(Math.max(s, 0.5), 3);
    };

    const updateZoomLabel = (s: number) => {
        setZoomPercent(Math.round(s * 100));
    };

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            const newScale = clampScale(savedScale.value * e.scale);
            scale.value = newScale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
            runOnJS(updateZoomLabel)(scale.value);
        });

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateX.value = savedTranslateX.value + e.translationX;
            translateY.value = savedTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    const doubleTapGesture = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
            scale.value = withSpring(1);
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            savedScale.value = 1;
            savedTranslateX.value = 0;
            savedTranslateY.value = 0;
            runOnJS(updateZoomLabel)(1);
        });

    const composedGesture = Gesture.Simultaneous(pinchGesture, Gesture.Simultaneous(panGesture, doubleTapGesture));

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { scale: scale.value },
            ] as any,
        };
    });

    const handleZoomIn = () => {
        const newScale = Math.min(savedScale.value + 0.25, 3);
        savedScale.value = newScale;
        scale.value = withSpring(newScale);
        setZoomPercent(Math.round(newScale * 100));
    };

    const handleZoomOut = () => {
        const newScale = Math.max(savedScale.value - 0.25, 0.5);
        savedScale.value = newScale;
        scale.value = withSpring(newScale);
        setZoomPercent(Math.round(newScale * 100));
    };

    const handleReset = () => {
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        setZoomPercent(100);
    };

    const handleDownload = async () => {
        try {
            if (!captureRef.current) return;

            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Please grant media library permission');
                return;
            }

            const uri = await captureRefFn(captureRef, {
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
            if (!captureRef.current) return;

            const uri = await captureRefFn(captureRef, {
                format: 'png',
                quality: 1,
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Error', 'Sharing not available');
            }
        } catch (error) {
            console.error('Share error:', error);
            Alert.alert('Error', 'Failed to share flowchart');
        }
    };

    const iconColor = isDark ? '#E2E8F0' : '#334155';
    const toolbarBg = isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.92)';
    const toolbarBorder = isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.6)';
    const dividerColor = isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.8)';
    const zoomTextColor = isDark ? '#94A3B8' : '#64748B';
    const captureBg = isDark ? '#1E293B' : '#FFFFFF';

    return (
        <View style={styles.container}>
            {/* Fixed toolbar at top */}
            <View style={[styles.toolbarRow, { backgroundColor: toolbarBg, borderColor: toolbarBorder }]}>
                <TouchableOpacity onPress={handleDownload} style={styles.toolbarButton} hitSlop={4}>
                    <Ionicons name="download-outline" size={20} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShare} style={styles.toolbarButton} hitSlop={4}>
                    <Ionicons name="share-social-outline" size={20} color={iconColor} />
                </TouchableOpacity>

                <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                <TouchableOpacity onPress={handleZoomOut} style={styles.toolbarButton} hitSlop={4}>
                    <Ionicons name="remove" size={20} color={iconColor} />
                </TouchableOpacity>
                <Text style={[styles.zoomText, { color: zoomTextColor }]}>{zoomPercent}%</Text>
                <TouchableOpacity onPress={handleZoomIn} style={styles.toolbarButton} hitSlop={4}>
                    <Ionicons name="add" size={20} color={iconColor} />
                </TouchableOpacity>

                <View style={[styles.divider, { backgroundColor: dividerColor }]} />

                <TouchableOpacity onPress={handleReset} style={styles.toolbarButton} hitSlop={4}>
                    <Ionicons name="contract-outline" size={18} color={iconColor} />
                </TouchableOpacity>
            </View>

            {/* Zoomable/pannable chart area */}
            <GestureDetector gesture={composedGesture}>
                <Animated.View style={[styles.svgWrapper, animatedStyle]}>
                    <View style={[styles.svgContainer, { width: svgWidth, height: svgHeight }]}>
                        <SvgContent
                            viewBox={viewBox}
                            width={svgWidth}
                            height={svgHeight}
                            layoutedEdges={layoutedEdges}
                            layoutedNodes={layoutedNodes}
                            colorScheme={colorScheme}
                            arrowColor={arrowColor}
                        />
                    </View>
                </Animated.View>
            </GestureDetector>

            {/* Off-screen capture view — 1:1 scale, no transforms, solid background */}
            <View
                ref={captureRef}
                style={[styles.captureContainer, { width: captureWidth, height: captureHeight, backgroundColor: captureBg }]}
                collapsable={false}
            >
                <SvgContent
                    viewBox={viewBox}
                    width={captureWidth}
                    height={captureHeight}
                    layoutedEdges={layoutedEdges}
                    layoutedNodes={layoutedNodes}
                    colorScheme={colorScheme}
                    arrowColor={arrowColor}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    svgWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    svgContainer: {
        backgroundColor: 'transparent',
    },
    captureContainer: {
        position: 'absolute',
        left: -9999,
        top: -9999,
    },
    toolbarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginHorizontal: 12,
        marginBottom: 8,
        borderRadius: 20,
        borderWidth: 1,
        gap: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    toolbarButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: 1,
        height: 24,
        marginHorizontal: 4,
    },
    zoomText: {
        fontSize: 12,
        fontWeight: '600',
        minWidth: 40,
        textAlign: 'center',
    },
});
