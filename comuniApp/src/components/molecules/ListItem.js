// src/components/molecules/ListItem.js
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText, Icon } from '../atoms';
import { colors, sizes, spacing } from '../../theme';

/** Fila de menú: ícono + texto + chevron. Usar dentro de un <Card padded={false}>. */
export default function ListItem({ icon, label, onPress, tone = 'primary', divider = false }) {
    const color = tone === 'danger' ? colors.danger : colors.textPrimary;
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, divider && styles.divider, pressed && styles.pressed]}
        >
            <Icon name={icon} color={color} />
            <AppText variant="label" style={[styles.label, { color }]}>{label}</AppText>
            <Icon name="chevron-forward" size={18} color={colors.textMuted} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: sizes.touchTarget + spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    pressed: { backgroundColor: colors.surfaceMuted },
    label: { flex: 1 },
});
