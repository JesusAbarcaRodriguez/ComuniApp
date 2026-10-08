// src/screens/events/ExploreScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import {
    Screen, AppHeader, IconButton, SectionHeader, EmptyState, ErrorState,
    EventCard, EventCardSkeleton, Fab,
} from '../../components';
import { colors } from '../../theme';
import { getSelectedGroup, getGroupName } from '../../data/groups.supabase';
import { listUpcomingEventsByGroup } from '../../data/events.supabase';

export default function ExploreScreen({ navigation, route }) {
    const [title, setTitle] = useState(route?.params?.groupName || 'Explorar');
    const [groupId, setGroupId] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    const load = useCallback(async (gidParam) => {
        try {
            setError('');
            const gid = gidParam || route?.params?.groupId || (await getSelectedGroup());
            setGroupId(gid || null);
            if (!gid) { setEvents([]); return; }

            const [name, rows] = await Promise.all([getGroupName(gid), listUpcomingEventsByGroup(gid)]);
            setTitle(name || 'Explorar');
            setEvents(rows);
        } catch (e) {
            setError(e.message || 'No se pudieron cargar los eventos.');
        } finally {
            setLoading(false);
        }
    }, [route?.params?.groupId]);

    useEffect(() => { load(); }, [load]);

    // recarga al volver (p. ej. después de crear o borrar un evento)
    useEffect(() => navigation.addListener('focus', () => { if (groupId) load(groupId); }), [navigation, groupId, load]);

    const onRefresh = async () => { setRefreshing(true); await load(groupId); setRefreshing(false); };

    const header = (
        <AppHeader
            title={title}
            right={
                <IconButton
                    icon="swap-horizontal"
                    color={colors.onPrimary}
                    onPress={() => navigation.navigate('SelectGroup')}
                    accessibilityLabel="Cambiar de grupo"
                />
            }
        />
    );

    let content;
    if (loading) {
        content = [0, 1, 2].map((i) => <EventCardSkeleton key={i} />);
    } else if (error) {
        content = <ErrorState message={error} onAction={() => load(groupId)} />;
    } else if (!groupId) {
        content = (
            <EmptyState
                icon="people-outline"
                title="Elige un grupo"
                message="Selecciona un grupo para ver y crear eventos."
                actionLabel="Seleccionar grupo"
                onAction={() => navigation.replace('SelectGroup')}
            />
        );
    } else if (!events.length) {
        content = (
            <EmptyState
                icon="calendar-outline"
                title="Sin eventos próximos"
                message="Sé el primero en proponer una actividad para el grupo."
                actionLabel="Crear evento"
                onAction={() => navigation.navigate('CreateEvent', { groupId })}
            />
        );
    } else {
        content = events.map((ev, index) => (
            <EventCard
                key={ev.id}
                event={ev}
                index={index}
                onPress={() => navigation.navigate('EventDetails', { eventId: ev.id })}
            />
        ));
    }

    return (
        <View style={{ flex: 1 }}>
            <Screen header={header} onRefresh={onRefresh} refreshing={refreshing}>
                <SectionHeader title="Próximos eventos" style={{ marginTop: 0 }} />
                {content}
                {/* espacio para que el FAB no tape la última tarjeta */}
                <View style={{ height: 72 }} />
            </Screen>

            {groupId ? (
                <Fab
                    icon="add"
                    accessibilityLabel="Crear evento"
                    onPress={() => navigation.navigate('CreateEvent', { groupId })}
                />
            ) : null}
        </View>
    );
}
