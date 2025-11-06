// src/screens/EventRequestsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, RefreshControl } from 'react-native';
import { listPendingEventsForAdmin, approveEvent, rejectEvent } from '../data/requests.supabase';

export default function EventRequestsScreen() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listPendingEventsForAdmin();
            setRows(data);
        } catch (e) { Alert.alert('Error', e.message); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const onAccept = async (id) => { try { await approveEvent(id); await load(); } catch (e) { Alert.alert('Error', e.message); } };
    const onReject = async (id) => { try { await rejectEvent(id); await load(); } catch (e) { Alert.alert('Error', e.message); } };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {loading && <Text style={{ color: '#6B7280' }}>Cargando...</Text>}
            {rows.map(r => (
                <View key={r.id} style={styles.row}>
                    <View>
                        <Text style={styles.title}>{r.title}</Text>
                        <Text style={styles.sub}>Propuesto en {r.groupName}</Text>
                        <Text style={styles.time}>{r.time ? new Date(r.time).toLocaleString() : ''}</Text>
                    </View>
                    <View style={styles.actions}>
                        <Pressable style={styles.reject} onPress={() => onReject(r.id)}><Text>Rechazar</Text></Pressable>
                        <Pressable style={styles.accept} onPress={() => onAccept(r.id)}><Text style={{ color: '#fff', fontWeight: '700' }}>Aceptar</Text></Pressable>
                    </View>
                </View>
            ))}
            {!loading && !rows.length && <Text style={{ marginTop: 10, color: '#6B7280' }}>No hay solicitudes</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontWeight: '700', color: '#173049' },
    sub: { color: '#6B7280', marginTop: 2, maxWidth: 230 },
    time: { color: '#9CA3AF', marginTop: 2 },
    actions: { flexDirection: 'row', gap: 8 },
    reject: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
    accept: { backgroundColor: '#4F59F5', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
});
