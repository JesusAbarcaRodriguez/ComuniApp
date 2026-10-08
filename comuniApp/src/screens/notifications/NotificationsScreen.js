// src/screens/notifications/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import {
    Screen, AppHeader, Card, Skeleton, SectionHeader, EmptyState,
    RequestItem, NotificationItem,
} from '../../components';
import { useToast } from '../../feedback';
import { radius, spacing } from '../../theme';
import { timeAgo } from '../../utils/format';
import {
    approveGroupJoinRequest,
    rejectGroupJoinRequest,
    approveEvent,
    rejectEvent,
    listAdminNotifications,
} from '../../data/requests.supabase';
import {
    listMyNotifications,
    markNotificationRead,
    markAllRead,
} from '../../data/notifications.supabase';

const ADMIN_ACTIONS = {
    JOIN: { accept: approveGroupJoinRequest, reject: rejectGroupJoinRequest, accepted: 'Solicitud aprobada', rejected: 'Solicitud rechazada' },
    EVENT: { accept: approveEvent, reject: rejectEvent, accepted: 'Evento aprobado', rejected: 'Evento rechazado' },
};

export default function NotificationsScreen({ route, navigation }) {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [adminFeed, setAdminFeed] = useState([]);
    const [inbox, setInbox] = useState([]);

    // En el tab no hay header de navegación; en el stack sí.
    const isTab = route?.name === 'NotificationsTab';

    const load = useCallback(async () => {
        const [adminRows, inboxRows] = await Promise.all([
            listAdminNotifications().catch(() => []),
            listMyNotifications().catch(() => []),
        ]);
        setAdminFeed(adminRows || []);
        setInbox(inboxRows || []);
        setLoading(false);
    }, []);

    useEffect(() => navigation.addListener('focus', load), [navigation, load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const runAdmin = async (item, kind) => {
        const actions = ADMIN_ACTIONS[item.type];
        if (!actions) return toast.error(`Tipo desconocido: ${item.type}`);
        try {
            await actions[kind](item.id);
            toast.success(kind === 'accept' ? actions.accepted : actions.rejected);
            await load();
        } catch (e) {
            toast.error(e.message);
        }
    };

    const onMarkOne = async (id) => {
        try { await markNotificationRead(id); await load(); }
        catch (e) { toast.error(e.message); }
    };
    const onMarkAll = async () => {
        try { await markAllRead(); toast.success('Todo marcado como leído'); await load(); }
        catch (e) { toast.error(e.message); }
    };

    const header = isTab ? <AppHeader title="Notificaciones" /> : null;
    const unread = inbox.filter((n) => !n.read).length;

    if (loading) {
        return (
            <Screen header={header}>
                <View style={{ gap: spacing.md }}>
                    <Skeleton width="50%" height={20} />
                    <Skeleton height={96} borderRadius={radius.md} />
                    <Skeleton height={96} borderRadius={radius.md} />
                </View>
            </Screen>
        );
    }

    if (!adminFeed.length && !inbox.length) {
        return (
            <Screen header={header} onRefresh={onRefresh} refreshing={refreshing}>
                <EmptyState
                    icon="notifications-outline"
                    title="Sin notificaciones"
                    message="Aquí verás solicitudes y novedades de tus grupos."
                />
            </Screen>
        );
    }

    return (
        <Screen header={header} onRefresh={onRefresh} refreshing={refreshing}>
            {adminFeed.length ? (
                <>
                    <SectionHeader title="Por revisar" style={{ marginTop: 0 }} />
                    <Card padded={false}>
                        {adminFeed.map((n, i) => (
                            <RequestItem
                                key={`ADMIN_${n.type}_${n.id}`}
                                avatarName={n.type === 'JOIN' ? n.requesterName : undefined}
                                title={n.type === 'JOIN' ? n.requesterName : n.title}
                                subtitle={n.type === 'JOIN' ? `Quiere unirse a ${n.groupName}` : `Evento propuesto en ${n.groupName}`}
                                meta={timeAgo(n.time)}
                                divider={i < adminFeed.length - 1}
                                onAccept={() => runAdmin(n, 'accept')}
                                onReject={() => runAdmin(n, 'reject')}
                            />
                        ))}
                    </Card>
                </>
            ) : null}

            {inbox.length ? (
                <>
                    <SectionHeader
                        title={unread ? `Mis notificaciones (${unread})` : 'Mis notificaciones'}
                        actionLabel={unread ? 'Marcar todo leído' : undefined}
                        onAction={onMarkAll}
                        style={!adminFeed.length && { marginTop: 0 }}
                    />
                    <Card padded={false}>
                        {inbox.map((n, i) => (
                            <NotificationItem
                                key={`INBOX_${n.id}`}
                                notification={n}
                                divider={i < inbox.length - 1}
                                onMarkRead={() => onMarkOne(n.id)}
                            />
                        ))}
                    </Card>
                </>
            ) : null}
        </Screen>
    );
}
