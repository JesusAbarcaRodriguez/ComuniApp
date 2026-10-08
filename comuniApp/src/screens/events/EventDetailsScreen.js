// src/screens/events/EventDetailsScreen.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import {
    Screen, AppHeader, AppText, Badge, Button, Card, Icon, IconButton, InfoRow,
    SectionHeader, Skeleton, ErrorState,
} from '../../components';
import { confirm, useToast } from '../../feedback';
import { colors, radius, spacing } from '../../theme';
import { formatEventLong } from '../../utils/format';
import {
    getEventById, getMyEventStatus, confirmAttendance, isEventAdmin,
    getPendingAttendanceCount, deleteEvent,
} from '../../data/events.supabase';

const STATUS = {
    APPROVED: { label: 'Aprobado', tone: 'success' },
    PENDING: { label: 'Pendiente', tone: 'neutral' },
    REJECTED: { label: 'Rechazado', tone: 'danger' },
};

export default function EventDetailsScreen({ route, navigation }) {
    const toast = useToast();
    const eventId = route?.params?.eventId;
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [event, setEvent] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [goingCount, setGoingCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);

    const whenText = useMemo(() => (event?.start_at ? formatEventLong(event.start_at) : ''), [event?.start_at]);

    const load = useCallback(async () => {
        try {
            setErrorMsg('');
            const [{ event: ev, goingCount: gc }, st, adminStatus] = await Promise.all([
                getEventById(eventId),
                getMyEventStatus(eventId),
                isEventAdmin(eventId),
            ]);
            setEvent(ev);
            setGoingCount(gc);
            setUserStatus(st);
            setIsAdmin(adminStatus);
            if (adminStatus) setPendingCount(await getPendingAttendanceCount(eventId));
        } catch (e) {
            setErrorMsg(e?.message || 'No se pudo cargar el evento');
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        if (!eventId) {
            setErrorMsg('Falta el ID del evento');
            setLoading(false);
            return;
        }
        load();
    }, [eventId, load]);

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    // al volver de aprobar solicitudes, refresca el contador
    useEffect(() => navigation.addListener('focus', () => { if (event) load(); }), [navigation, event, load]);

    const handleConfirmAttendance = async () => {
        try {
            setJoining(true);
            await confirmAttendance(eventId);
            toast.success('¡Asistencia confirmada!');
            await load();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setJoining(false);
        }
    };

    const handleDeleteEvent = async () => {
        const ok = await confirm({
            title: 'Eliminar evento',
            message: '¿Seguro que quieres eliminar este evento? Esta acción no se puede deshacer.',
            confirmText: 'Eliminar',
            destructive: true,
        });
        if (!ok) return;
        try {
            await deleteEvent(eventId);
            toast.success('Evento eliminado');
            navigation.goBack();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const header = (
        <AppHeader
            title="Detalle del evento"
            onBack={() => navigation.goBack()}
            right={isAdmin ? (
                <IconButton icon="trash-outline" color={colors.onPrimary} onPress={handleDeleteEvent} accessibilityLabel="Eliminar evento" />
            ) : null}
        />
    );

    if (loading) {
        return (
            <Screen header={header}>
                <View style={{ gap: spacing.md }}>
                    <Skeleton width="80%" height={28} />
                    <Skeleton width="40%" height={20} />
                    <Skeleton height={80} borderRadius={radius.md} />
                    <Skeleton height={60} borderRadius={radius.md} />
                </View>
            </Screen>
        );
    }

    if (errorMsg || !event) {
        return (
            <Screen header={header} scroll={false}>
                <ErrorState message={errorMsg || 'No se encontró el evento.'} actionLabel="Volver" onAction={() => navigation.goBack()} />
            </Screen>
        );
    }

    const status = STATUS[event.status] || { label: event.status, tone: 'neutral' };
    const going = userStatus === 'GOING';

    return (
        <Screen
            header={header}
            onRefresh={onRefresh}
            refreshing={refreshing}
            footer={
                going ? (
                    <Button title="Ya confirmaste tu asistencia" variant="secondary" icon="checkmark-circle" disabled />
                ) : (
                    <Button title="Voy a asistir" icon="checkmark-circle-outline" onPress={handleConfirmAttendance} loading={joining} />
                )
            }
        >
            <AppText variant="title">{event.title}</AppText>

            <View style={styles.badges}>
                <Badge label={status.label} tone={status.tone} />
                {event.groups?.name ? <Badge label={event.groups.name} icon="people-outline" tone="neutral" /> : null}
            </View>

            <Card style={styles.infoCard}>
                <InfoRow icon="time-outline" text={whenText} />
                {event.location_name ? <InfoRow icon="location-outline" text={event.location_name} /> : null}
                <InfoRow icon="people-circle-outline" text={`${goingCount} ${goingCount === 1 ? 'asistente' : 'asistentes'}`} />
            </Card>

            {event.description ? (
                <>
                    <SectionHeader title="Descripción" />
                    <AppText variant="body" tone="body">{event.description}</AppText>
                </>
            ) : null}

            {isAdmin && pendingCount > 0 ? (
                <>
                    <SectionHeader title="Gestión" />
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`${pendingCount} solicitudes de asistencia pendientes`}
                        onPress={() => navigation.navigate('EventAttendanceRequests', { eventId, eventTitle: event.title })}
                        style={({ pressed }) => [styles.requests, pressed && { backgroundColor: colors.surfaceMuted }]}
                    >
                        <View style={styles.requestsIcon}>
                            <Icon name="person-add-outline" color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <AppText variant="label" weight="700">Solicitudes pendientes</AppText>
                            <AppText variant="caption" tone="secondary">
                                {pendingCount} {pendingCount === 1 ? 'persona espera' : 'personas esperan'} aprobación
                            </AppText>
                        </View>
                        <Badge label={String(pendingCount)} tone="danger" style={{ alignSelf: 'center' }} />
                        <Icon name="chevron-forward" size={18} color={colors.textMuted} />
                    </Pressable>
                </>
            ) : null}
        </Screen>
    );
}

const styles = StyleSheet.create({
    badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
    infoCard: { marginTop: spacing.lg, gap: spacing.md, padding: spacing.lg },
    requests: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
    },
    requestsIcon: {
        width: 40,
        height: 40,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
