// src/components/atoms/IconButton.js
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, radius, sizes } from '../../theme';

/** Botón de solo ícono. `accessibilityLabel` es obligatorio: sin texto visible, es lo único que lee VoiceOver/TalkBack. */
export default function IconButton({ icon, onPress, accessibilityLabel, color = colors.textPrimary, size = 24, style }) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            style={({ pressed }) => [styles.base, pressed && styles.pressed, style]}
        >
            <Icon name={icon} size={size} color={color} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        minWidth: sizes.touchTarget,
        minHeight: sizes.touchTarget,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.pill,
    },
    pressed: { opacity: 0.6 },
});
