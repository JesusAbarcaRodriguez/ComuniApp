// src/components/organisms/AppHeader.js
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { setStatusBarStyle } from 'expo-status-bar';
import { AppText, IconButton } from '../atoms';
import { colors, sizes, spacing } from '../../theme';

/**
 * Encabezado de marca (fondo primario).
 * - onBack: muestra la flecha para volver
 * - right:  acciones a la derecha (IconButton, Button sm, ...)
 * - align:  'left' (título grande, pantallas raíz) | 'center' (pantallas internas)
 */
export default function AppHeader({ title, onBack, right, align = onBack ? 'center' : 'left' }) {
    const insets = useSafeAreaInsets();
    const centered = align === 'center';

    // texto claro en la barra de estado sobre el fondo de marca, solo mientras la pantalla está visible
    useFocusEffect(useCallback(() => {
        setStatusBarStyle('light');
        return () => setStatusBarStyle('dark');
    }, []));

    return (
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
            {onBack ? (
                <IconButton icon="chevron-back" color={colors.onPrimary} onPress={onBack} accessibilityLabel="Volver" />
            ) : centered ? (
                <View style={styles.side} />
            ) : null}

            <AppText
                variant={centered ? 'heading' : 'title'}
                tone="inverse"
                numberOfLines={1}
                accessibilityRole="header"
                style={[styles.title, centered && styles.titleCenter]}
            >
                {title}
            </AppText>

            <View style={[styles.right, centered && styles.side]}>{right}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: colors.primary,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    title: { flex: 1, paddingHorizontal: spacing.sm },
    titleCenter: { textAlign: 'center' },
    side: { minWidth: sizes.touchTarget },
    right: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.xs },
});
