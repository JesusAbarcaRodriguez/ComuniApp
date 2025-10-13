// src/screens/GroupRequestsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, RefreshControl } from 'react-native';
import { listGroupJoinRequestsForAdmin, approveGroupJoinRequest, rejectGroupJoinRequest } from '../data/requests.supabase';

export default function GroupRequestsScreen() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listGroupJoinRequestsForAdmin();
            setRows(data);
        } catch (e) { Alert.alert('Error', e.message); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const onAccept = async (id) => { try { await approveGroupJoinRequest(id); await load(); } catch (e) { Alert.alert('Error', e.message); } };
    const onReject = async (id) => { try { await rejectGroupJoinRequest(id); await load(); } catch (e) { Alert.alert('Error', e.message); } };

    return (
        <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            {loading && <Text style={{ color: '#6B7280' }}>Cargando...</Text>}
            {rows.map(r => (
                <View key={r.id} style={styles.row}>
                    <View>
                        <Text style={styles.title}>{r.requesterName}</Text>
                        <Text style={styles.sub}>Solicitud para unirse a {r.groupName}</Text>
                        <Text style={styles.time}>{r.time?.toLocaleString?.() || ''}</Text>
                    </View>
                    <View style={styles.actions}>
                        <Pressable style={styles.reject} onPress={() => onReject(r.id)}><Text>Reject</Text></Pressable>
                        <Pressable style={styles.accept} onPress={() => onAccept(r.id)}><Text style={{ color: '#fff', fontWeight: '700' }}>Accept</Text></Pressable>
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
    sub: { color: '#6B7280', marginTop: 2, maxWidth: 220 },
    time: { color: '#9CA3AF', marginTop: 2 },
    actions: { flexDirection: 'row', gap: 8 },
    reject: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
    accept: { backgroundColor: '#4F59F5', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
});
