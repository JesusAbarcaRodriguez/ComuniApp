import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import {
    approveGroupJoinRequest,
    rejectGroupJoinRequest,
    approveEvent,
    rejectEvent,
    listAdminNotifications,   // <- tu feed de revisión (JOIN/EVENT)
} from '../data/requests.supabase';
import {
    listMyNotifications,      // <- inbox personal (tabla notifications)
    markNotificationRead,
    markAllRead,
} from '../data/notifications.supabase';

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
    const [refreshing, setRefreshing] = useState(false);

    // Bandeja de admin (revisión)
    const [adminFeed, setAdminFeed] = useState([]); // [{id,type:'JOIN'|'EVENT',...}]
    // Inbox personal
    const [inbox, setInbox] = useState([]);         // [{id,type,title,body,read,created_at,...}]

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [adminRows, inboxRows] = await Promise.all([
                // si el user no es admin, esto probablemente devolverá []
                listAdminNotifications().catch(() => []),
                listMyNotifications().catch(() => []),
            ]);
            setAdminFeed(adminRows || []);
            setInbox(inboxRows || []);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    // --- Acciones ADMIN (revisión)
    const onAccept = async (item) => {
        try {
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
                    Alert.alert('Aviso', `Tipo desconocido: ${item.type}`);
                    return;
            }
            await load();
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    const onReject = async (item) => {
        try {
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
                    Alert.alert('Aviso', `Tipo desconocido: ${item.type}`);
                    return;
            }
            await load();
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    // --- Acciones de INBOX personal
    const onMarkOne = async (id) => {
        try { await markNotificationRead(id); await load(); }
        catch (e) { Alert.alert('Error', e.message); }
    };
    const onMarkAll = async () => {
        try { await markAllRead(); await load(); }
        catch (e) { Alert.alert('Error', e.message); }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando...</Text>
            </View>
        );
    }

    const hasAdmin = adminFeed.length > 0;
    const hasInbox = inbox.length > 0;

    if (!hasAdmin && !hasInbox) {
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
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Sección ADMIN (si hay) */}
            {hasAdmin && (
                <>
                    <Text style={styles.sectionTitle}>Revisión del administrador</Text>
                    {adminFeed.map((n) => (
                        <View key={`ADMIN_${n.type}_${n.id}`} style={styles.item}>
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
                </>
            )}

            {/* Sección INBOX personal */}
            {hasInbox && (
                <>
                    <View style={styles.inboxHeader}>
                        <Text style={styles.sectionTitle}>Mis notificaciones</Text>
                        <Pressable onPress={onMarkAll}><Text style={styles.link}>Marcar todo leído</Text></Pressable>
                    </View>

                    {inbox.map(n => (
                        <View key={`INBOX_${n.id}`} style={styles.item}>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.title, !n.read && { fontWeight: '800' }]}>{n.title}</Text>
                                {!!n.body && <Text style={styles.sub}>{n.body}</Text>}
                                <Text style={styles.time}>{timeago(new Date(n.created_at))}</Text>
                            </View>

                            {!n.read ? (
                                <Pressable style={styles.lightBtn} onPress={() => onMarkOne(n.id)}>
                                    <Text style={{ color: '#4F59F5', fontWeight: '700' }}>Marcar leído</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    ))}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    bell: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '800', color: '#173049' },

    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#173049', marginBottom: 8, marginTop: 8 },

    item: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
    },
    title: { color: '#173049', fontWeight: '700' },
    sub: { color: '#6B7280', marginTop: 2, maxWidth: 260 },
    time: { color: '#9CA3AF', marginTop: 2 },

    reject: { borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
    accept: { backgroundColor: '#4F59F5', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },

    inboxHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
    link: { color: '#4F59F5', fontWeight: '700' },

    lightBtn: { backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 10 },
});
