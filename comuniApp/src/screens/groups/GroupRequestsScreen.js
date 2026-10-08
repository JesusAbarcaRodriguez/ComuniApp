// src/screens/groups/GroupRequestsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { Screen, Card, Skeleton, EmptyState, RequestItem } from '../../components';
import { useToast } from '../../feedback';
import { timeAgo } from '../../utils/format';
import { listGroupJoinRequestsForAdmin, approveGroupJoinRequest, rejectGroupJoinRequest } from '../../data/requests.supabase';

export default function GroupRequestsScreen() {
    const toast = useToast();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = useCallback(async () => {
        try {
            setRows(await listGroupJoinRequestsForAdmin());
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
    const onAccept = act(approveGroupJoinRequest, 'Solicitud aprobada');
    const onReject = act(rejectGroupJoinRequest, 'Solicitud rechazada');

    if (loading) {
        return <Screen><Skeleton height={120} /></Screen>;
    }

    if (!rows.length) {
        return (
            <Screen onRefresh={onRefresh} refreshing={refreshing}>
                <EmptyState icon="checkmark-done-outline" title="Todo al día" message="No hay solicitudes pendientes." />
            </Screen>
        );
    }

    return (
        <Screen onRefresh={onRefresh} refreshing={refreshing}>
            <Card padded={false}>
                {rows.map((r, i) => (
                    <RequestItem
                        key={r.id}
                        avatarName={r.requesterName}
                        title={r.requesterName}
                        subtitle={`Quiere unirse a ${r.groupName}`}
                        meta={timeAgo(r.time)}
                        divider={i < rows.length - 1}
                        onAccept={() => onAccept(r.id)}
                        onReject={() => onReject(r.id)}
                    />
                ))}
            </Card>
        </Screen>
    );
}
