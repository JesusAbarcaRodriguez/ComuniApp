// src/screens/events/EventRequestsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { Screen, Card, Skeleton, EmptyState, RequestItem } from '../../components';
import { useToast } from '../../feedback';
import { timeAgo } from '../../utils/format';
import { listPendingEventsForAdmin, approveEvent, rejectEvent } from '../../data/requests.supabase';

export default function EventRequestsScreen() {
    const toast = useToast();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setRows(await listPendingEventsForAdmin());
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);
    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const act = (fn, msg) => async (id) => {
        try { await fn(id); toast.success(msg); await load(); }
        catch (e) { toast.error(e.message); }
    };
    const onAccept = act(approveEvent, 'Evento aprobado');
    const onReject = act(rejectEvent, 'Evento rechazado');

    if (loading) {
        return <Screen><Skeleton height={120} /></Screen>;
    }

    if (!rows.length) {
        return (
            <Screen onRefresh={onRefresh} refreshing={refreshing}>
                <EmptyState icon="checkmark-done-outline" title="Todo al día" message="No hay eventos pendientes de aprobación." />
            </Screen>
        );
    }

    return (
        <Screen onRefresh={onRefresh} refreshing={refreshing}>
            <Card padded={false}>
                {rows.map((r, i) => (
                    <RequestItem
                        key={r.id}
                        title={r.title}
                        subtitle={`Propuesto en ${r.groupName}`}
                        meta={r.time ? timeAgo(r.time) : ''}
                        acceptLabel="Aprobar"
                        divider={i < rows.length - 1}
                        onAccept={() => onAccept(r.id)}
                        onReject={() => onReject(r.id)}
                    />
                ))}
            </Card>
        </Screen>
    );
}
