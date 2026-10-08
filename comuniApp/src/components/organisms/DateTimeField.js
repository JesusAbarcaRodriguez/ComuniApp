// src/components/organisms/DateTimeField.js
import React, { useState } from 'react';
import { View, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppText, Icon } from '../atoms';
import { colors, radius, sizes, spacing } from '../../theme';

/**
 * Campo de fecha u hora con aspecto de input.
 * Android: diálogo nativo · iOS: hoja inferior con "Listo" · Web: input nativo del navegador.
 */
export default function DateTimeField({ label, mode = 'date', value, onChange, display }) {
    const [open, setOpen] = useState(false);
    const icon = mode === 'date' ? 'calendar-outline' : 'time-outline';

    if (Platform.OS === 'web') {
        const pad = (n) => String(n).padStart(2, '0');
        const str = mode === 'date'
            ? `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
            : `${pad(value.getHours())}:${pad(value.getMinutes())}`;
        return (
            <View style={styles.wrap}>
                <AppText variant="label" tone="body">{label}</AppText>
                <View style={styles.field}>
                    <Icon name={icon} color={colors.textMuted} />
                    {React.createElement('input', {
                        type: mode,
                        value: str,
                        'aria-label': label,
                        onChange: (e) => {
                            const next = new Date(value);
                            if (mode === 'date') {
                                const [y, m, d] = e.target.value.split('-').map(Number);
                                if (y) next.setFullYear(y, m - 1, d);
                            } else {
                                const [h, min] = e.target.value.split(':').map(Number);
                                if (!Number.isNaN(h)) next.setHours(h, min);
                            }
                            onChange(next);
                        },
                        style: { flex: 1, border: 'none', outline: 'none', fontSize: 16, color: colors.textPrimary, background: 'transparent' },
                    })}
                </View>
            </View>
        );
    }

    const display_ = mode === 'date'
        ? value.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
        : value.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    return (
        <View style={styles.wrap}>
            <AppText variant="label" tone="body">{label}</AppText>
            <Pressable
                onPress={() => setOpen(true)}
                accessibilityRole="button"
                accessibilityLabel={`${label}: ${display_}. Toca para cambiar`}
                style={({ pressed }) => [styles.field, (pressed || open) && styles.fieldActive]}
            >
                <Icon name={icon} color={colors.textMuted} />
                <AppText variant="body" style={styles.value}>{display_}</AppText>
                <Icon name="chevron-down" size={18} color={colors.textMuted} />
            </Pressable>

            {Platform.OS === 'android' && open ? (
                <DateTimePicker
                    value={value}
                    mode={mode}
                    display="default"
                    onChange={(_, sel) => { setOpen(false); if (sel) onChange(sel); }}
                />
            ) : null}

            {Platform.OS === 'ios' ? (
                <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
                    <Pressable style={styles.backdrop} onPress={() => setOpen(false)} accessibilityLabel="Cerrar" />
                    <View style={styles.sheet}>
                        <View style={styles.sheetHeader}>
                            <AppText variant="label" weight="700">{label}</AppText>
                            <Pressable onPress={() => setOpen(false)} hitSlop={8} accessibilityRole="button">
                                <AppText variant="label" tone="brand" weight="700">Listo</AppText>
                            </Pressable>
                        </View>
                        <DateTimePicker
                            value={value}
                            mode={mode}
                            display={display || (mode === 'date' ? 'inline' : 'spinner')}
                            onChange={(_, sel) => { if (sel) onChange(sel); }}
                            style={{ alignSelf: 'center' }}
                        />
                    </View>
                </Modal>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { gap: spacing.xs + spacing.xxs },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        minHeight: sizes.control,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    fieldActive: { borderColor: colors.primary },
    value: { flex: 1, textTransform: 'capitalize' },
    backdrop: { flex: 1, backgroundColor: colors.overlay },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
        paddingBottom: spacing.xxl,
    },
    sheetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
});
