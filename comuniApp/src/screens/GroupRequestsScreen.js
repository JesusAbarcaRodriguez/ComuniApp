import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const REQUESTS = [
    { id: 'r1', user: 'Ana Mora', group: 'Comité Deportivo', time: 'Just now' },
    { id: 'r2', user: 'Carlos Ruiz', group: 'Barrio La Florida', time: '10 min ago' },
];

export default function GroupRequestsScreen() {
    return (
        <View style={styles.container}>
            {REQUESTS.map(r => (
                <View key={r.id} style={styles.row}>
                    <View>
                        <Text style={styles.title}>{r.user}</Text>
                        <Text style={styles.sub}>Solicitud para unirse a {r.group}</Text>
                        <Text style={styles.time}>{r.time}</Text>
                    </View>
                    <View style={styles.actions}>
                        <Pressable style={styles.reject}><Text>Reject</Text></Pressable>
                        <Pressable style={styles.accept}><Text style={{ color: '#fff', fontWeight: '700' }}>Accept</Text></Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontWeight: '700', color: '#173049' },
    sub: { color: '#6B7280', marginTop: 2, maxWidth: 220 },
    time: { color: '#9CA3AF', marginTop: 2 },
    actions: { flexDirection: 'row', gap: 8 },
    reject: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
    accept: { backgroundColor: '#4F59F5', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
});
