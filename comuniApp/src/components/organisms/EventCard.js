// src/components/organisms/EventCard.js
import React, { useEffect, useRef } from 'react';
import { Pressable, View, StyleSheet, Animated } from 'react-native';
import { AppText, Icon, Skeleton } from '../atoms';
import { InfoRow } from '../molecules';
import { colors, radius, shadows, spacing } from '../../theme';
import { formatEventShort } from '../../utils/format';

/** Tarjeta de evento con entrada escalonada según `index`. */
export default function EventCard({ event, onPress, index = 0 }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(anim, {
            toValue: 1,
            delay: index * 80,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }, [anim, index]);

    const when = formatEventShort(event.start_at);

    return (
        <Animated.View
            style={[
                styles.card,
                { opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] },
            ]}
        >
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={`${event.title}, ${when}${event.location_name ? `, ${event.location_name}` : ''}`}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
                <View style={styles.accent} />
                <View style={styles.content}>
                    <AppText variant="body" weight="700" numberOfLines={2}>{event.title}</AppText>
                    <InfoRow icon="time-outline" text={when} size="sm" />
                    {event.location_name ? <InfoRow icon="location-outline" text={event.location_name} size="sm" /> : null}
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textMuted} style={styles.chevron} />
            </Pressable>
        </Animated.View>
    );
}

/** Placeholder con la misma silueta que EventCard. */
export function EventCardSkeleton() {
    return (
        <View style={[styles.card, styles.row]}>
            <View style={[styles.accent, { backgroundColor: colors.border }]} />
            <View style={styles.content}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="45%" height={12} />
                <Skeleton width="55%" height={12} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        ...shadows.sm,
    },
    row: { flexDirection: 'row', alignItems: 'stretch', borderRadius: radius.lg, overflow: 'hidden' },
    pressed: { backgroundColor: colors.surfaceMuted },
    accent: { width: 6, backgroundColor: colors.primary },
    content: { flex: 1, padding: spacing.lg, gap: spacing.xs + spacing.xxs },
    chevron: { alignSelf: 'center', marginRight: spacing.md },
});
