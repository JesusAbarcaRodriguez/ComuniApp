// src/components/templates/Screen.js
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, RefreshControl, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

/**
 * Plantilla base de todas las pantallas.
 *
 * header      Nodo arriba, fuera del scroll (ej. <AppHeader/>)
 * footer      Nodo fijo abajo (ej. botón principal); respeta el área segura
 * scroll      Envuelve el contenido en ScrollView (default true)
 * keyboard    Activa KeyboardAvoidingView (formularios)
 * safeTop     Añade el inset superior (pantallas sin header de navegación ni AppHeader)
 * centered    Centra el contenido vertical (auth, estados vacíos)
 * onRefresh / refreshing   Pull-to-refresh
 */
export default function Screen({
    children,
    header,
    footer,
    scroll = true,
    keyboard = false,
    safeTop = false,
    centered = false,
    padded = true,
    onRefresh,
    refreshing = false,
    contentStyle,
}) {
    const insets = useSafeAreaInsets();

    const contentStyles = [
        padded && styles.padded,
        centered && styles.centered,
        safeTop && { paddingTop: insets.top + spacing.lg },
        contentStyle,
    ];

    const body = scroll ? (
        <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, ...contentStyles]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            refreshControl={
                onRefresh ? (
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
                ) : undefined
            }
        >
            {children}
        </ScrollView>
    ) : (
        <View style={[styles.flex, ...contentStyles]}>{children}</View>
    );

    const inner = (
        <>
            {header}
            {body}
            {footer ? (
                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>{footer}</View>
            ) : null}
        </>
    );

    return (
        <View style={styles.root}>
            {keyboard ? (
                <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                    {inner}
                </KeyboardAvoidingView>
            ) : inner}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    flex: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingBottom: spacing.xxl },
    padded: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
    centered: { justifyContent: 'center' },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        backgroundColor: colors.background,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
    },
});
