// src/components/organisms/Fab.js
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../atoms';
import { colors, radius, shadows, spacing } from '../../theme';

/** Botón flotante de acción principal, con entrada animada. */
export default function Fab({ icon = 'add', onPress, accessibilityLabel, disabled = false, delay = 0 }) {
    const insets = useSafeAreaInsets();
    const scale = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scale, { toValue: 1, delay, tension: 50, friction: 6, useNativeDriver: true }).start();
    }, [scale, delay]);

    return (
        <Animated.View
            style={[
                styles.fab,
                { bottom: Math.max(insets.bottom, spacing.lg) + spacing.sm, transform: [{ scale }] },
                disabled && styles.disabled,
            ]}
        >
            <Pressable
                onPress={onPress}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel}
                accessibilityState={{ disabled }}
                style={({ pressed }) => [styles.pressable, pressed && { backgroundColor: colors.primaryPressed }]}
            >
                <Icon name={icon} size={28} color={colors.onPrimary} />
            </Pressable>
        </Animated.View>
    );
}

const SIZE = 56;

const styles = StyleSheet.create({
    fab: { position: 'absolute', right: spacing.lg, width: SIZE, height: SIZE, borderRadius: radius.pill, ...shadows.md },
    pressable: {
        flex: 1,
        borderRadius: radius.pill,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: { opacity: 0.5 },
});
