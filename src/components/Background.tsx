import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Canvas, Rect, Skia, Shader } from '@shopify/react-native-skia';
import { useSharedValue, withRepeat, withTiming, Easing, useDerivedValue } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface BackgroundProps {
    children: React.ReactNode;
}

const shaderSource = `
uniform float2 resolution;
uniform float time;

half4 main(float2 fragCoord) {
  float2 uv = (fragCoord * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  float t = time * 0.3;
  float lineWidth = 0.02;

  float r = 0.0;
  float g = 0.0;
  float b = 0.0;

  for (int i = 0; i < 6; i++) {
    float d = abs(length(uv) - fract(t + float(i) * 0.15));
    float intensity = lineWidth / d;

    r += intensity * 0.4;
    g += intensity * 0.7;
    b += intensity;
  }

  return half4(b, g, r, 1.0);
}
`;

const ShaderBackground: React.FC = () => {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: 4000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const runtimeEffect = Skia.RuntimeEffect.Make(shaderSource);

    if (!runtimeEffect) {
        return null;
    }

    const uniforms = useDerivedValue(() => {
        return {
            time: progress.value * 10,
            resolution: [width, height],
        };
    }, [progress]);

    return (
        <Canvas style={StyleSheet.absoluteFill}>
            <Rect x={0} y={0} width={width} height={height}>
                <Shader source={runtimeEffect} uniforms={uniforms} />
            </Rect>
        </Canvas>
    );
};

export const Background: React.FC<BackgroundProps> = ({ children }) => {
    return (
        <View style={styles.container}>
            <ShaderBackground />
            <View style={styles.content}>
                {children}
            </View>
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
});
