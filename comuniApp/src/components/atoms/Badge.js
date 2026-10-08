// src/components/atoms/Badge.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, radius, spacing, sizes } from '../../theme';

const TONES = {
    brand: { bg: colors.primarySoft, fg: colors.primary },
    neutral: { bg: colors.surfaceSubtle, fg: colors.textBody },
    danger: { bg: colors.dangerMuted, fg: colors.danger },
    success: { bg: colors.successSoft, fg: colors.success },
};

/** Etiqueta tipo "pill" para estados, roles o conteos. */
export default function Badge({ label, tone = 'brand', icon, style }) {
    const t = TONES[tone];
    return (
        <View style={[styles.base, { backgroundColor: t.bg }, style]}>
            {icon ? <Icon name={icon} size={sizes.iconSm} color={t.fg} /> : null}
            <AppText variant="caption" weight="700" style={{ color: t.fg }}>{label}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radius.pill,
    },
});
