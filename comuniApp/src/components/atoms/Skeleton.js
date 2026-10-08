// src/components/atoms/Skeleton.js
import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { colors, radius } from '../../theme';

/** Bloque gris que "respira" mientras carga el contenido real. */
export default function Skeleton({ width = '100%', height = 14, borderRadius = radius.sm, style }) {
    const opacity = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.5, duration: 700, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [opacity]);

    return (
        <Animated.View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[{ width, height, borderRadius, backgroundColor: colors.border, opacity }, style]}
        />
    );
}
