// src/screens/events/EventAttendanceRequestsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Screen, AppHeader, Card, InfoRow, Skeleton, EmptyState, RequestItem } from '../../components';
import { useToast } from '../../feedback';
import { colors, radius, spacing } from '../../theme';
import {
    listEventAttendanceRequests,
    approveAttendanceRequest,
    rejectAttendanceRequest,
} from '../../data/events.supabase';

export default function EventAttendanceRequestsScreen({ route, navigation }) {
    const toast = useToast();
    const eventId = route?.params?.eventId;
    const eventTitle = route?.params?.eventTitle || 'Evento';

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        if (!eventId) return;
        try {
            setRequests(await listEventAttendanceRequests(eventId));
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const handleApprove = async (userId, userName) => {
        try {
            await approveAttendanceRequest(eventId, userId);
            toast.success(`${userName} fue aprobado`);
            await load();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const handleReject = async (userId, userName) => {
        try {
            await rejectAttendanceRequest(eventId, userId);
            toast.info(`Solicitud de ${userName} rechazada`);
            await load();
        } catch (e) {
            toast.error(e.message);
        }
    };

    return (
        <Screen
            header={<AppHeader title="Solicitudes de asistencia" onBack={() => navigation.goBack()} />}
            onRefresh={onRefresh}
            refreshing={refreshing}
        >
            <View style={styles.eventInfo}>
                <InfoRow icon="calendar-outline" text={eventTitle} />
            </View>

            {loading ? (
                <Skeleton height={120} borderRadius={radius.md} />
            ) : requests.length === 0 ? (
                <EmptyState
                    icon="checkmark-done-outline"
                    title="No hay solicitudes pendientes"
                    message="Todas las solicitudes han sido procesadas."
                />
            ) : (
                <Card padded={false}>
                    {requests.map((req, i) => (
                        <RequestItem
                            key={req.userId}
                            avatarName={req.userName}
                            title={req.userName}
                            subtitle="Quiere asistir al evento"
                            acceptLabel="Aprobar"
                            divider={i < requests.length - 1}
                            onAccept={() => handleApprove(req.userId, req.userName)}
                            onReject={() => handleReject(req.userId, req.userName)}
                        />
                    ))}
                </Card>
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    eventInfo: {
        backgroundColor: colors.primarySoft,
        padding: spacing.md,
        borderRadius: radius.md,
        marginBottom: spacing.lg,
    },
});
