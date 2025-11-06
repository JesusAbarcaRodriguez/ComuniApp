import React, { useEffect, useRef } from 'react';
import { Pressable, View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnimatedEventCard({ event, onPress, index = 0 }) {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Animación escalonada basada en el índice
        const delay = index * 100; // 100ms de diferencia entre cada tarjeta

        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: delay,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                delay: delay,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, [index]);

    const animatedStyle = {
        opacity: opacity,
        transform: [{ translateY: translateY }],
    };

    return (
        <Animated.View style={[styles.card, animatedStyle]}>
            <Pressable onPress={onPress} style={styles.pressableContent}>
                <View style={styles.cardThumb} />
                <View style={styles.cardContent}>
                    <Text style={styles.title}>{event.title}</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text style={styles.subtitle}>
                            {formatDate(event.start_at)}
                        </Text>
                    </View>
                    {event.location_name ? (
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={14} color="#6B7280" />
                            <Text style={styles.subtitle}>{event.location_name}</Text>
                        </View>
                    ) : null}
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9CA3AF"
                    style={styles.chevron}
                />
            </Pressable>
        </Animated.View>
    );
}

function formatDate(iso) {
    try {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, '0');
        const mon = d.toLocaleString(undefined, { month: 'long' });
        const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        return `${day} ${mon} · ${time}`;
    } catch {
        return iso;
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 12,
    },
    pressableContent: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    cardThumb: {
        backgroundColor: '#DDE3FF',
        width: 14,
        borderRadius: 4,
    },
    cardContent: {
        padding: 12,
        flex: 1,
    },
    title: {
        fontWeight: '800',
        fontSize: 16,
        color: '#173049',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    subtitle: {
        color: '#6B7280',
        fontSize: 13,
    },
    chevron: {
        alignSelf: 'center',
        marginRight: 10,
    },
});
