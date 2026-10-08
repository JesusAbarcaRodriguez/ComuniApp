// src/components/organisms/NotificationItem.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Button } from '../atoms';
import { colors, radius, spacing } from '../../theme';
import { timeAgo } from '../../utils/format';

/** Notificación del inbox personal, con punto de "no leída". */
export default function NotificationItem({ notification, onMarkRead, divider = false }) {
    const { title, body, read, created_at: createdAt } = notification;
    return (
        <View style={[styles.row, divider && styles.divider]}>
            <View style={[styles.dot, read && styles.dotRead]} />
            <View style={styles.text}>
                <AppText variant="label" weight={read ? '600' : '800'} numberOfLines={1}>{title}</AppText>
                {body ? <AppText variant="caption" tone="secondary" numberOfLines={2}>{body}</AppText> : null}
                <AppText variant="caption" tone="muted">{timeAgo(createdAt)}</AppText>
            </View>
            {!read ? (
                <Button
                    title="Leído"
                    variant="secondary"
                    size="sm"
                    icon="checkmark-done"
                    onPress={onMarkRead}
                    accessibilityLabel={`Marcar como leída: ${title}`}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
    dot: { width: 8, height: 8, borderRadius: radius.pill, backgroundColor: colors.primary },
    dotRead: { backgroundColor: 'transparent' },
    text: { flex: 1, gap: spacing.xxs },
});
