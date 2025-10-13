import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { getEventById, getMyEventStatus, joinEvent } from '../data/events.supabase';

function fmtDate(iso) {
    try {
        const d = new Date(iso);
        const optD = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        const optT = { hour: '2-digit', minute: '2-digit' };
        return `${d.toLocaleDateString(undefined, optD)} · ${d.toLocaleTimeString(undefined, optT)}`;
    } catch { return iso; }
}

export default function EventDetailsScreen({ route, navigation }) {
    const eventId = route?.params?.eventId;
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [event, setEvent] = useState(null);
    const [userStatus, setUserStatus] = useState(null);
    const [goingCount, setGoingCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    const whenText = useMemo(() => (event?.start_at ? fmtDate(event.start_at) : ''), [event?.start_at]);

    const load = async () => {
        try {
            setLoading(true);
            const { event: ev, goingCount: gc } = await getEventById(eventId);
            setEvent(ev);
            setGoingCount(gc);
            const st = await getMyEventStatus(eventId);
            setUserStatus(st);
        } catch (e) {
            setErrorMsg(e?.message || 'No se pudo cargar el evento');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!eventId) {
            setErrorMsg('Falta el ID del evento');
            setLoading(false);
            return;
        }
        load();
    }, [eventId]);

    const handleJoin = async () => {
        try {
            setJoining(true);
            await joinEvent(eventId);
            Alert.alert('Solicitud enviada', 'Tu solicitud para unirte al evento está pendiente de aprobación.');
            await load();
        } catch (e) {
            Alert.alert('Aviso', e.message);
        } finally {
            setJoining(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </Pressable>
                <Text numberOfLines={1} style={styles.headerTitle}>Event Details</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando...</Text>
                </View>
            ) : errorMsg ? (
                <View style={styles.center}>
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text style={{ marginTop: 8, color: '#EF4444', textAlign: 'center' }}>{errorMsg}</Text>
                    <Pressable style={styles.retry} onPress={() => navigation.goBack()}>
                        <Text style={{ color: '#4F59F5', fontWeight: '700' }}>Volver</Text>
                    </Pressable>
                </View>
            ) : !event ? (
                <View style={styles.center}><Text>No se encontró el evento.</Text></View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
                    <Text style={styles.title}>{event.title}</Text>

                    <View style={{ marginTop: 24 }}>
                        {userStatus === 'PENDING' ? (
                            <PrimaryButton title="Solicitud pendiente" disabled />
                        ) : userStatus === 'GOING' ? (
                            <PrimaryButton title="Ya estás inscrito" disabled />
                        ) : (
                            <PrimaryButton
                                title={joining ? 'Enviando...' : 'Solicitar unirse'}
                                onPress={handleJoin}
                                disabled={joining}
                                icon="person-add-outline"
                            />
                        )}
                    </View>

                    <View style={styles.row}>
                        <View style={styles.pill}><Text style={styles.pillText}>{event.status}</Text></View>
                        {event.groups?.name ? (
                            <View style={[styles.pill, { backgroundColor: '#E5E7EB' }]}>
                                <Ionicons name="people-outline" size={14} color="#374151" />
                                <Text style={[styles.pillText, { color: '#374151', marginLeft: 6 }]}>{event.groups.name}</Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}><Ionicons name="time-outline" size={18} color="#4F59F5" /><Text style={styles.infoText}>{whenText}</Text></View>
                        {event.location_name ? (
                            <View style={[styles.infoRow, { marginTop: 8 }]}><Ionicons name="location-outline" size={18} color="#4F59F5" /><Text style={styles.infoText}>{event.location_name}</Text></View>
                        ) : null}
                    </View>

                    {event.description ? (
                        <>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <View style={styles.descCard}><Text style={{ color: '#374151' }}>{event.description}</Text></View>
                        </>
                    ) : null}

                    <Text style={styles.sectionTitle}>Attendees</Text>
                    <View style={styles.attendeesCard}>
                        <Ionicons name="people-circle-outline" size={20} color="#4F59F5" />
                        <Text style={{ marginLeft: 8, color: '#173049', fontWeight: '700' }}>{goingCount} going</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: { backgroundColor: '#4F59F5', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800', flex: 1, textAlign: 'center' },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
    retry: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#EEF2FF' },

    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 10 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },

    pill: { backgroundColor: '#EDEBFE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
    pillText: { color: '#4F59F5', fontWeight: '700', textTransform: 'capitalize' },

    infoCard: { marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoText: { marginLeft: 8, color: '#173049', fontWeight: '600' },

    sectionTitle: { marginTop: 18, marginBottom: 8, fontSize: 16, fontWeight: '800', color: '#173049' },
    descCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
    attendeesCard: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
});
