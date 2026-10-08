// src/components/atoms/Button.js
import React from 'react';
import { Pressable, StyleSheet, ActivityIndicator, View } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, radius, sizes, spacing } from '../../theme';

const VARIANTS = {
    primary: { bg: colors.primary, bgPressed: colors.primaryPressed, fg: colors.onPrimary },
    secondary: { bg: colors.primarySoft, bgPressed: colors.primaryMuted, fg: colors.primary },
    outline: { bg: colors.surface, bgPressed: colors.surfaceSubtle, fg: colors.textBody, border: colors.border },
    danger: { bg: colors.danger, bgPressed: colors.danger, fg: colors.onPrimary },
    dangerSoft: { bg: colors.dangerSoft, bgPressed: colors.dangerMuted, fg: colors.danger, border: colors.dangerMuted },
    ghost: { bg: 'transparent', bgPressed: colors.surfaceSubtle, fg: colors.primary },
};

/**
 * Botón del design system.
 * variant: primary | secondary | outline | danger | dangerSoft | ghost
 * size:    md (50px, ancho completo por defecto) | sm (36px, compacto)
 */
export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = size === 'md',
    style,
    accessibilityLabel,
}) {
    const v = VARIANTS[variant];
    const isDisabled = disabled || loading;
    const iconSize = size === 'sm' ? sizes.iconSm : sizes.icon;
    const iconEl = icon ? <Icon name={icon} size={iconSize} color={v.fg} /> : null;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || title}
            accessibilityState={{ disabled: isDisabled, busy: loading }}
            style={({ pressed }) => [
                styles.base,
                size === 'sm' ? styles.sm : styles.md,
                { backgroundColor: pressed ? v.bgPressed : v.bg },
                v.border && { borderWidth: 1, borderColor: v.border },
                fullWidth && styles.fullWidth,
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={v.fg} />
            ) : (
                <View style={styles.content}>
                    {iconPosition === 'left' && iconEl}
                    <AppText variant="label" weight="700" style={{ color: v.fg }}>{title}</AppText>
                    {iconPosition === 'right' && iconEl}
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: radius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    md: { minHeight: sizes.control, paddingHorizontal: spacing.lg },
    sm: { minHeight: sizes.controlSm, paddingHorizontal: spacing.md, borderRadius: radius.sm },
    fullWidth: { alignSelf: 'stretch' },
    content: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    disabled: { opacity: 0.5 },
});
