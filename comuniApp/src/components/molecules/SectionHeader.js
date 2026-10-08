// src/components/molecules/SectionHeader.js
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../atoms';
import { spacing } from '../../theme';

/** Título de sección con acción opcional a la derecha ("Marcar todo leído"). */
export default function SectionHeader({ title, actionLabel, onAction, style }) {
    return (
        <View style={[styles.row, style]}>
            <AppText variant="heading" accessibilityRole="header">{title}</AppText>
            {actionLabel ? (
                <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
                    <AppText variant="label" tone="brand" weight="700">{actionLabel}</AppText>
                </Pressable>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
        marginBottom: spacing.sm,
    },
});
