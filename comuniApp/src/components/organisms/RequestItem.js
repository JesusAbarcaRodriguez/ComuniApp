// src/components/organisms/RequestItem.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Avatar, Button } from '../atoms';
import { colors, spacing } from '../../theme';

/**
 * Solicitud pendiente con acciones Aceptar / Rechazar.
 * Se usa para: unirse a un grupo, eventos propuestos y asistencia a eventos.
 * onAccept / onReject pueden ser async: el botón muestra loading mientras tanto.
 */
export default function RequestItem({ title, subtitle, meta, avatarName, onAccept, onReject, acceptLabel = 'Aceptar', divider = false }) {
    const [busy, setBusy] = useState(null); // 'accept' | 'reject' | null

    const run = (kind, fn) => async () => {
        setBusy(kind);
        try { await fn?.(); } finally { setBusy(null); }
    };

    return (
        <View style={[styles.wrap, divider && styles.divider]}>
            <View style={styles.info}>
                {avatarName !== undefined ? <Avatar name={avatarName} /> : null}
                <View style={styles.text}>
                    <AppText variant="label" weight="700" numberOfLines={1}>{title}</AppText>
                    {subtitle ? <AppText variant="caption" tone="secondary" numberOfLines={2}>{subtitle}</AppText> : null}
                    {meta ? <AppText variant="caption" tone="muted">{meta}</AppText> : null}
                </View>
            </View>
            <View style={styles.actions}>
                <Button
                    title="Rechazar"
                    variant="outline"
                    size="sm"
                    icon="close"
                    style={styles.action}
                    loading={busy === 'reject'}
                    disabled={!!busy}
                    onPress={run('reject', onReject)}
                    accessibilityLabel={`Rechazar: ${title}`}
                />
                <Button
                    title={acceptLabel}
                    size="sm"
                    icon="checkmark"
                    style={styles.action}
                    loading={busy === 'accept'}
                    disabled={!!busy}
                    onPress={run('accept', onAccept)}
                    accessibilityLabel={`${acceptLabel}: ${title}`}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { padding: spacing.md, gap: spacing.md },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    info: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    text: { flex: 1, gap: spacing.xxs },
    actions: { flexDirection: 'row', gap: spacing.sm },
    action: { flex: 1 },
});
