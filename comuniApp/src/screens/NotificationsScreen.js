import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import {
    approveGroupJoinRequest,
    rejectGroupJoinRequest,
    approveEvent,
    rejectEvent,
    listAdminNotifications
} from '../data/requests.supabase';

function timeago(d) {
    if (!d) return '';
    const sec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (sec < 60) return 'Just now';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min} min ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr} h ago`;
    const dd = Math.floor(hr / 24);
    return `${dd} d ago`;
}

export default function NotificationsScreen() {
    const [loading, setLoading] = useState(true);
    const [feed, setFeed] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const rows = await listAdminNotifications();
            setFeed(rows);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const onAccept = async (item) => {
        try {
            console.log('[NOTIF] Accept pressed ->', item);   // <--- LOG
            switch (item.type) {
                case 'JOIN':
                    await approveGroupJoinRequest(item.id);
                    Alert.alert('Listo', 'Solicitud de ingreso aprobada.');
                    break;
                case 'EVENT':
                    await approveEvent(item.id);
                    Alert.alert('Listo', 'Evento aprobado.');
                    break;
                default:
                    console.warn('[NOTIF] Unknown type on accept:', item.type); // <--- LOG
                    Alert.alert('Aviso', `Tipo desconocido: ${item.type}`);
                    return;
            }
            await load();
        } catch (e) {
            console.error('[NOTIF] Accept error:', e);        // <--- LOG
            Alert.alert('Error', e.message);
        }
    };

    const onReject = async (item) => {
        try {
            console.log('[NOTIF] Reject pressed ->', item);   // <--- LOG
            switch (item.type) {
                case 'JOIN':
                    await rejectGroupJoinRequest(item.id);
                    Alert.alert('Listo', 'Solicitud de ingreso rechazada.');
                    break;
                case 'EVENT':
                    await rejectEvent(item.id);
                    Alert.alert('Listo', 'Evento rechazado.');
                    break;
                default:
                    console.warn('[NOTIF] Unknown type on reject:', item.type); // <--- LOG
                    Alert.alert('Aviso', `Tipo desconocido: ${item.type}`);
                    return;
            }
            await load();
        } catch (e) {
            console.error('[NOTIF] Reject error:', e);        // <--- LOG
            Alert.alert('Error', e.message);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando...</Text>
            </View>
        );
    }

    if (!feed.length) {
        return (
            <View style={styles.center}>
                <View style={styles.bell}><Text style={{ fontSize: 36 }}>🔔</Text></View>
                <Text style={styles.emptyTitle}>No Notifications!</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {feed.map((n) => (
                <View key={`${n.type}_${n.id}`} style={styles.item}>
                    <View style={{ flex: 1 }}>
                        {n.type === 'JOIN' && (
                            <>
                                <Text style={styles.title}>{n.requesterName}</Text>
                                <Text style={styles.sub}>Solicita acceso a {n.groupName}</Text>
                            </>
                        )}
                        {n.type === 'EVENT' && (
                            <>
                                <Text style={styles.title}>{n.title}</Text>
                                <Text style={styles.sub}>Evento propuesto en {n.groupName}</Text>
                            </>
                        )}
                        <Text style={styles.time}>{timeago(n.time)}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable style={styles.reject} onPress={() => onReject(n)}>
                            <Text style={{ color: '#374151' }}>Reject</Text>
                        </Pressable>
                        <Pressable style={styles.accept} onPress={() => onAccept(n)}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Accept</Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    bell: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#173049' },
    item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    title: { fontWeight: '700', color: '#173049' },
    sub: { color: '#6B7280', marginTop: 2, maxWidth: 240 },
    time: { color: '#9CA3AF', marginTop: 2 },
    reject: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
    accept: { backgroundColor: '#4F59F5', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
});
