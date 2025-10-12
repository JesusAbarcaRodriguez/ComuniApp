import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function NotificationsScreen({ route }) {
    const variant = route?.params?.variant || 'empty'; // 'empty' | 'list'

    if (variant === 'empty') {
        return (
            <View style={styles.center}>
                <View style={styles.bell}><Text style={{ fontSize: 36 }}>🔔</Text></View>
                <Text style={styles.emptyTitle}>No Notifications!</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
            {[{ time: 'Just now' }, { time: '20 min ago' }].map((n, i) => (
                <View key={i} style={styles.item}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#9CA3AF' }}>{n.time}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable style={styles.reject}><Text style={{ color: '#374151' }}>Reject</Text></Pressable>
                        <Pressable style={styles.accept}><Text style={{ color: '#fff', fontWeight: '700' }}>Accept</Text></Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    bell: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#173049' },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    reject: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
    accept: { backgroundColor: '#4F59F5', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
});
