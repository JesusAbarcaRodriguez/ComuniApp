// src/screens/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Alert,
    ScrollView,
    RefreshControl,
    Platform,
} from 'react-native';
import {
    approveGroupJoinRequest,
    rejectGroupJoinRequest,
    approveEvent,
    rejectEvent,
    listAdminNotifications,
} from '../data/requests.supabase';
import {
    listMyNotifications,
    markNotificationRead,
    markAllRead,
} from '../data/notifications.supabase';

function timeago(d) {
    if (!d) return '';
    const sec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (sec < 60) return 'Ahora mismo';
    const min = Math.floor(sec / 60);
    if (min < 60) return `Hace ${min} min`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `Hace ${hr} h`;
    const dd = Math.floor(hr / 24);
    return `Hace ${dd} d`;
}

export default function NotificationsScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [adminFeed, setAdminFeed] = useState([]);
    const [inbox, setInbox] = useState([]);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const [adminRows, inboxRows] = await Promise.all([
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

    // --- Acciones ADMIN
    const onAccept = async (item) => {
        try {
            if (item.type === 'JOIN') {
                await approveGroupJoinRequest(item.id);
                Alert.alert('Listo', 'Solicitud de ingreso aprobada.');
            } else if (item.type === 'EVENT') {
                await approveEvent(item.id);
                Alert.alert('Listo', 'Evento aprobado.');
            } else {
                return Alert.alert('Aviso', `Tipo desconocido: ${item.type}`);
            }
            await load();
        } catch (e) { Alert.alert('Error', e.message); }
    };
    const onReject = async (item) => {
        try {
            if (item.type === 'JOIN') {
                await rejectGroupJoinRequest(item.id);
                Alert.alert('Listo', 'Solicitud de ingreso rechazada.');
            } else if (item.type === 'EVENT') {
                await rejectEvent(item.id);
                Alert.alert('Listo', 'Evento rechazado.');
            } else {
                return Alert.alert('Aviso', `Tipo desconocido: ${item.type}`);
            }
            await load();
        } catch (e) { Alert.alert('Error', e.message); }
    };

    // --- Acciones INBOX
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
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.muted}>Cargando...</Text>
                </View>
            </SafeAreaView>
        );
    }

    const hasAdmin = adminFeed.length > 0;
    const hasInbox = inbox.length > 0;

    if (!hasAdmin && !hasInbox) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <View style={styles.bell}><Text style={{ fontSize: 36 }}>🔔</Text></View>
                    <Text style={styles.emptyTitle}>¡Sin Notificaciones!</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header compacto y seguro en iOS */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notificaciones</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* ADMIN */}
                {hasAdmin && (
                    <>
                        <Text style={styles.sectionTitle}>Revisión del administrador</Text>
                        <View style={styles.card}>
                            {adminFeed.map((n, idx) => (
                                <View key={`ADMIN_${n.type}_${n.id}`} style={[styles.item, idx !== adminFeed.length - 1 && styles.itemDivider]}>
                                    <View style={{ flex: 1 }}>
                                        {n.type === 'JOIN' && (
                                            <>
                                                <Text numberOfLines={1} style={styles.title}>{n.requesterName}</Text>
                                                <Text numberOfLines={2} style={styles.sub}>Solicita acceso a {n.groupName}</Text>
                                            </>
                                        )}
                                        {n.type === 'EVENT' && (
                                            <>
                                                <Text numberOfLines={1} style={styles.title}>{n.title}</Text>
                                                <Text numberOfLines={2} style={styles.sub}>Evento propuesto en {n.groupName}</Text>
                                            </>
                                        )}
                                        <Text style={styles.time}>{timeago(n.time)}</Text>
                                    </View>

                                    <View style={styles.actionsRow}>
                                        <Pressable style={[styles.pillBtn, styles.pillGhost]} onPress={() => onReject(n)}>
                                            <Text style={styles.pillGhostText}>Rechazar</Text>
                                        </Pressable>
                                        <Pressable style={[styles.pillBtn, styles.pillPrimary]} onPress={() => onAccept(n)}>
                                            <Text style={styles.pillPrimaryText}>Aceptar</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </>
                )}

                {/* INBOX */}
                {hasInbox && (
                    <>
                        <View style={styles.inboxHeader}>
                            <Text style={styles.sectionTitle}>Mis notificaciones</Text>
                            <Pressable onPress={onMarkAll}><Text style={styles.link}>Marcar todo leído</Text></Pressable>
                        </View>

                        <View style={styles.card}>
                            {inbox.map((n, idx) => (
                                <View key={`INBOX_${n.id}`} style={[styles.item, idx !== inbox.length - 1 && styles.itemDivider]}>
                                    <View style={{ flex: 1 }}>
                                        <Text numberOfLines={1} style={[styles.title, !n.read && styles.unread]}>{n.title}</Text>
                                        {!!n.body && <Text numberOfLines={2} style={styles.sub}>{n.body}</Text>}
                                        <Text style={styles.time}>{timeago(new Date(n.created_at))}</Text>
                                    </View>

                                    {!n.read ? (
                                        <Pressable style={[styles.pillBtn, styles.pillSoft]} onPress={() => onMarkOne(n.id)}>
                                            <Text style={styles.pillSoftText}>Marcar leído</Text>
                                        </Pressable>
                                    ) : null}
                                </View>
                            ))}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },

    // Header compacto (ocupa poco, respeta notch)
    header: {
        paddingTop: Platform.OS === 'android' ? 16 : 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#173049' },

    content: { padding: 12, paddingBottom: 28 },

    sectionTitle: { fontSize: 15, fontWeight: '800', color: '#173049', marginTop: 8, marginBottom: 6 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    itemDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F3F4F6',
    },

    title: { color: '#173049', fontWeight: '700', fontSize: 14 },
    unread: { fontWeight: '800' },
    sub: { color: '#6B7280', marginTop: 2, fontSize: 13, maxWidth: 260 },
    time: { color: '#9CA3AF', marginTop: 2, fontSize: 12 },

    actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },

    // Botones "pill" compactos
    pillBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        minWidth: 70,
        alignItems: 'center',
    },
    pillPrimary: { backgroundColor: '#4F59F5' },
    pillPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 13 },
    pillGhost: { borderWidth: StyleSheet.hairlineWidth, borderColor: '#E5E7EB', backgroundColor: '#fff' },
    pillGhostText: { color: '#374151', fontWeight: '600', fontSize: 13 },
    pillSoft: { backgroundColor: '#EEF2FF' },
    pillSoftText: { color: '#4F59F5', fontWeight: '700', fontSize: 13 },

    bell: {
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
    },
    emptyTitle: { fontSize: 16, fontWeight: '800', color: '#173049' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    muted: { marginTop: 8, color: '#6B7280' },
    inboxHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 6 },
    link: { color: '#4F59F5', fontWeight: '700', fontSize: 13 },
});
