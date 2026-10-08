// src/components/molecules/InfoRow.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Icon } from '../atoms';
import { colors, sizes, spacing } from '../../theme';

/** Ícono + texto en una línea (fecha, lugar, asistentes...). */
export default function InfoRow({ icon, text, size = 'md', iconColor = colors.primary, style }) {
    const small = size === 'sm';
    return (
        <View style={[styles.row, style]}>
            <Icon name={icon} size={small ? 14 : sizes.icon} color={small ? colors.textSecondary : iconColor} />
            <AppText variant={small ? 'caption' : 'label'} tone={small ? 'secondary' : 'primary'} style={styles.text}>
                {text}
            </AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    text: { flexShrink: 1 },
});
