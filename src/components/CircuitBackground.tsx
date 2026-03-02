import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withTiming,
    useSharedValue,
    withDelay,
    interpolate,
} from 'react-native-reanimated';
import Svg, {
    Path,
    Circle,
    Line,
    Defs,
    LinearGradient,
    Stop,
} from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircuitLineProps {
    d: string;
    color: string;
    delay: number;
    duration: number;
}

const AnimatedCircuitLine: React.FC<CircuitLineProps> = ({ d, color, delay, duration }) => {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, { duration }),
                -1,
                false
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 0.5, 1], [0.1, 0.8, 0.1]),
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
                <Path
                    d={d}
                    stroke={color}
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </Animated.View>
    );
};

interface CircuitNodeProps {
    cx: number;
    cy: number;
    color: string;
    delay: number;
}

const CircuitNode: React.FC<CircuitNodeProps> = ({ cx, cy, color, delay }) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
        scale.value = withDelay(
            delay,
            withRepeat(
                withTiming(1.5, { duration: 2000 }),
                -1,
                true
            )
        );
        opacity.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, { duration: 2000 }),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.node,
                {
                    left: cx - 4,
                    top: cy - 4,
                    backgroundColor: color,
                },
                animatedStyle,
            ]}
        />
    );
};

export const CircuitBackground: React.FC = () => {
    const { isDark } = useTheme();
    const lineColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
    const nodeColor = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.2)';
    const pulseColor = isDark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(59, 130, 246, 0.4)';

    // Circuit paths - creating a tech grid pattern
    const circuits = [
        // Top left corner circuits
        'M 20,100 L 20,60 L 60,60 L 60,40',
        'M 20,150 L 20,180 L 50,180 L 50,200',
        'M 80,20 L 80,80 L 120,80 L 120,120',
        'M 150,20 L 150,50 L 200,50',

        // Top right corner circuits
        `M ${SCREEN_WIDTH - 20},80 L ${SCREEN_WIDTH - 20},120 L ${SCREEN_WIDTH - 60},120`,
        `M ${SCREEN_WIDTH - 40},40 L ${SCREEN_WIDTH - 40},60 L ${SCREEN_WIDTH - 100},60 L ${SCREEN_WIDTH - 100},100`,
        `M ${SCREEN_WIDTH - 80},20 L ${SCREEN_WIDTH - 80},40`,

        // Bottom left circuits
        `M 40,${SCREEN_HEIGHT - 100} L 40,${SCREEN_HEIGHT - 60} L 80,${SCREEN_HEIGHT - 60}`,
        `M 20,${SCREEN_HEIGHT - 150} L 20,${SCREEN_HEIGHT - 200} L 60,${SCREEN_HEIGHT - 200} L 60,${SCREEN_HEIGHT - 240}`,
        `M 100,${SCREEN_HEIGHT - 40} L 140,${SCREEN_HEIGHT - 40} L 140,${SCREEN_HEIGHT - 80}`,

        // Bottom right circuits
        `M ${SCREEN_WIDTH - 60},${SCREEN_HEIGHT - 60} L ${SCREEN_WIDTH - 60},${SCREEN_HEIGHT - 100} L ${SCREEN_WIDTH - 100},${SCREEN_HEIGHT - 100}`,
        `M ${SCREEN_WIDTH - 20},${SCREEN_HEIGHT - 120} L ${SCREEN_WIDTH - 20},${SCREEN_HEIGHT - 180}`,
        `M ${SCREEN_WIDTH - 80},${SCREEN_HEIGHT - 40} L ${SCREEN_WIDTH - 120},${SCREEN_HEIGHT - 40}`,

        // Center area circuits (subtle)
        `M ${SCREEN_WIDTH / 2 - 100},${SCREEN_HEIGHT / 2 - 50} L ${SCREEN_WIDTH / 2 - 100},${SCREEN_HEIGHT / 2} L ${SCREEN_WIDTH / 2 - 50},${SCREEN_HEIGHT / 2}`,
        `M ${SCREEN_WIDTH / 2 + 50},${SCREEN_HEIGHT / 2 + 50} L ${SCREEN_WIDTH / 2 + 100},${SCREEN_HEIGHT / 2 + 50} L ${SCREEN_WIDTH / 2 + 100},${SCREEN_HEIGHT / 2}`,

        // Horizontal lines
        'M 0,250 L 60,250 L 60,280 L 100,280',
        `M ${SCREEN_WIDTH},300 L ${SCREEN_WIDTH - 80},300 L ${SCREEN_WIDTH - 80},340`,

        // Vertical lines
        'M 200,0 L 200,60 L 230,60',
        `M ${SCREEN_WIDTH - 150},${SCREEN_HEIGHT} L ${SCREEN_WIDTH - 150},${SCREEN_HEIGHT - 60}`,
    ];

    // Node positions
    const nodes = [
        { cx: 20, cy: 60 },
        { cx: 60, cy: 40 },
        { cx: 50, cy: 200 },
        { cx: 120, cy: 120 },
        { cx: 200, cy: 50 },
        { cx: SCREEN_WIDTH - 60, cy: 120 },
        { cx: SCREEN_WIDTH - 100, cy: 100 },
        { cx: SCREEN_WIDTH - 80, cy: 40 },
        { cx: 80, cy: SCREEN_HEIGHT - 60 },
        { cx: 60, cy: SCREEN_HEIGHT - 240 },
        { cx: 140, cy: SCREEN_HEIGHT - 80 },
        { cx: SCREEN_WIDTH - 100, cy: SCREEN_HEIGHT - 100 },
        { cx: SCREEN_WIDTH - 20, cy: SCREEN_HEIGHT - 180 },
        { cx: 100, cy: 280 },
        { cx: SCREEN_WIDTH - 80, cy: 340 },
        { cx: 230, cy: 60 },
    ];

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Static circuit lines (dim) */}
            <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
                {circuits.map((d, index) => (
                    <Path
                        key={`static-${index}`}
                        d={d}
                        stroke={lineColor}
                        strokeWidth="1"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                ))}
            </Svg>

            {/* Animated pulse lines */}
            {circuits.slice(0, 8).map((d, index) => (
                <AnimatedCircuitLine
                    key={`pulse-${index}`}
                    d={d}
                    color={pulseColor}
                    delay={index * 300}
                    duration={3000 + index * 500}
                />
            ))}

            {/* Circuit nodes */}
            {nodes.map((node, index) => (
                <CircuitNode
                    key={`node-${index}`}
                    cx={node.cx}
                    cy={node.cy}
                    color={nodeColor}
                    delay={index * 150}
                />
            ))}

            {/* Corner accents */}
            <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} style={StyleSheet.absoluteFill}>
                {/* Top-left corner bracket */}
                <Path
                    d="M 30,30 L 30,50 M 30,30 L 50,30"
                    stroke={lineColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Top-right corner bracket */}
                <Path
                    d={`M ${SCREEN_WIDTH - 30},30 L ${SCREEN_WIDTH - 30},50 M ${SCREEN_WIDTH - 30},30 L ${SCREEN_WIDTH - 50},30`}
                    stroke={lineColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Bottom-left corner bracket */}
                <Path
                    d={`M 30,${SCREEN_HEIGHT - 30} L 30,${SCREEN_HEIGHT - 50} M 30,${SCREEN_HEIGHT - 30} L 50,${SCREEN_HEIGHT - 30}`}
                    stroke={lineColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Bottom-right corner bracket */}
                <Path
                    d={`M ${SCREEN_WIDTH - 30},${SCREEN_HEIGHT - 30} L ${SCREEN_WIDTH - 30},${SCREEN_HEIGHT - 50} M ${SCREEN_WIDTH - 30},${SCREEN_HEIGHT - 30} L ${SCREEN_WIDTH - 50},${SCREEN_HEIGHT - 30}`}
                    stroke={lineColor}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </Svg>

            {/* Grid dots pattern */}
            <View style={styles.gridContainer}>
                {Array.from({ length: 8 }).map((_, row) =>
                    Array.from({ length: 6 }).map((_, col) => (
                        <View
                            key={`dot-${row}-${col}`}
                            style={[
                                styles.gridDot,
                                {
                                    left: 40 + col * (SCREEN_WIDTH / 6),
                                    top: 200 + row * 80,
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                                },
                            ]}
                        />
                    ))
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    node: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    gridContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    gridDot: {
        position: 'absolute',
        width: 3,
        height: 3,
        borderRadius: 1.5,
    },
});
