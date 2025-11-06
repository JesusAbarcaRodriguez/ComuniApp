import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    listEventAttendanceRequests,
    approveAttendanceRequest,
    rejectAttendanceRequest
} from '../data/events.supabase';

export default function EventAttendanceRequestsScreen({ route, navigation }) {
    const eventId = route?.params?.eventId;
    const eventTitle = route?.params?.eventTitle || 'Evento';

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        if (!eventId) return;
        setLoading(true);
        try {
            const data = await listEventAttendanceRequests(eventId);
            setRequests(data);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        load();
    }, [load]);

    const onRefresh = async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    };

    const handleApprove = async (userId, userName) => {
        try {
            await approveAttendanceRequest(eventId, userId);
            Alert.alert('Aprobado', `${userName} fue aprobado para asistir al evento.`);
            await load();
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    const handleReject = async (userId, userName) => {
        try {
            await rejectAttendanceRequest(eventId, userId);
            Alert.alert('Rechazado', `La solicitud de ${userName} fue rechazada.`);
            await load();
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </Pressable>
                <Text numberOfLines={1} style={styles.headerTitle}>Solicitudes de Asistencia</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={styles.eventInfo}>
                    <Ionicons name="calendar-outline" size={18} color="#4F59F5" />
                    <Text style={styles.eventTitle}>{eventTitle}</Text>
                </View>

                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator color="#4F59F5" />
                        <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando solicitudes...</Text>
                    </View>
                ) : requests.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.emptyText}>No hay solicitudes pendientes</Text>
                        <Text style={styles.emptySubtext}>Todas las solicitudes han sido procesadas</Text>
                    </View>
                ) : (
                    requests.map((req) => (
                        <View key={req.userId} style={styles.requestCard}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}>
                                    <Ionicons name="person" size={20} color="#4F59F5" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.userName}>{req.userName}</Text>
                                    <Text style={styles.requestTime}>Solicitud de asistencia</Text>
                                </View>
                            </View>
                            <View style={styles.actions}>
                                <Pressable
                                    style={styles.rejectBtn}
                                    onPress={() => handleReject(req.userId, req.userName)}
                                >
                                    <Ionicons name="close" size={18} color="#EF4444" />
                                    <Text style={styles.rejectText}>Rechazar</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.approveBtn}
                                    onPress={() => handleApprove(req.userId, req.userName)}
                                >
                                    <Ionicons name="checkmark" size={18} color="#fff" />
                                    <Text style={styles.approveText}>Aprobar</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#4F59F5',
        paddingTop: 56,
        paddingBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        flex: 1,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EEF2FF',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    eventTitle: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '700',
        color: '#173049',
        flex: 1,
    },
    center: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '700',
        color: '#173049',
    },
    emptySubtext: {
        marginTop: 4,
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
    },
    requestCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#173049',
    },
    requestTime: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    rejectBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        backgroundColor: '#FEF2F2',
    },
    rejectText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '700',
        color: '#EF4444',
    },
    approveBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#4F59F5',
    },
    approveText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});
