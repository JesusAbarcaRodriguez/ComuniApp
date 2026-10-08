// src/components/molecules/StateViews.js
// Estados de pantalla reutilizables: vacío, error y carga.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Button, Icon } from '../atoms';
import { colors, radius, spacing } from '../../theme';

export function EmptyState({ icon = 'file-tray-outline', title, message, actionLabel, onAction, style }) {
    return (
        <View style={[styles.wrap, style]}>
            <View style={styles.iconCircle}>
                <Icon name={icon} size={36} color={colors.primary} />
            </View>
            <AppText variant="heading" align="center">{title}</AppText>
            {message ? <AppText variant="caption" tone="secondary" align="center">{message}</AppText> : null}
            {actionLabel ? (
                <Button title={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} />
            ) : null}
        </View>
    );
}

export function ErrorState({ message, actionLabel = 'Reintentar', onAction, style }) {
    return (
        <View style={[styles.wrap, style]}>
            <Icon name="alert-circle-outline" size={36} color={colors.danger} />
            <AppText variant="label" tone="danger" align="center">{message}</AppText>
            {onAction ? (
                <Button title={actionLabel} onPress={onAction} variant="secondary" size="sm" style={styles.action} />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
    iconCircle: {
        width: 88,
        height: 88,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    action: { marginTop: spacing.sm },
});
