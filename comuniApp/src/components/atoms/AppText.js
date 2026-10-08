// src/components/atoms/AppText.js
import React from 'react';
import { Text } from 'react-native';
import { colors, typography } from '../../theme';

const toneColor = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    muted: colors.textMuted,
    body: colors.textBody,
    brand: colors.primary,
    danger: colors.danger,
    inverse: colors.onPrimary,
};

/**
 * Texto tipado por el design system.
 * variant: display | title | heading | body | label | caption
 * tone:    primary | secondary | muted | body | brand | danger | inverse
 */
export default function AppText({ variant = 'body', tone = 'primary', weight, align, style, children, ...rest }) {
    return (
        <Text
            style={[
                typography[variant],
                { color: toneColor[tone] },
                weight && { fontWeight: weight },
                align && { textAlign: align },
                style,
            ]}
            {...rest}
        >
            {children}
        </Text>
    );
}
