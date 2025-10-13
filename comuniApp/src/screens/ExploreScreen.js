// src/screens/ExploreScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { getSelectedGroup, getGroupName, createGroup, setSelectedGroup } from '../data/groups.supabase';
import { listUpcomingEventsByGroup } from '../data/events.supabase';

function fmtDate(iso) {
    try {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, '0');
        const mon = d.toLocaleString(undefined, { month: 'long' });
        const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        return `${day} ${mon} · ${time}`;
    } catch { return iso; }
}

export default function ExploreScreen({ navigation, route }) {
    const [headerTitle, setHeaderTitle] = useState('Explore');
    const [groupId, setGroupId] = useState(null);
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Modal Crear Grupo
    const [showCreate, setShowCreate] = useState(false);
    const [gName, setGName] = useState('');
    const [gDesc, setGDesc] = useState('');
    const [creating, setCreating] = useState(false);

    const load = useCallback(async (gidParam) => {
        const gid = gidParam || route?.params?.groupId || (await getSelectedGroup());
        setGroupId(gid || null);
        const name = gid ? await getGroupName(gid) : null;
        setHeaderTitle(name || 'Explore');

        if (!gid) { setEvents([]); return; }
        const rows = await listUpcomingEventsByGroup(gid);
        setEvents(rows);
    }, [route?.params?.groupId]);

    useEffect(() => { load(); }, [load]);

    const onRefresh = async () => {
        setRefreshing(true);
        await load(groupId);
        setRefreshing(false);
    };

    // Crear grupo (lógica completa)
    const submitCreateGroup = async () => {
        const name = gName.trim();
        const desc = gDesc.trim();
        if (!name) return Alert.alert('Requerido', 'El nombre del grupo es obligatorio');
        try {
            setCreating(true);
            const g = await createGroup({ name, description: desc });
            await setSelectedGroup(g.id);
            setShowCreate(false);
            setGName(''); setGDesc('');
            await load(g.id); // recarga título y eventos con el nuevo grupo seleccionado
            Alert.alert('Éxito', 'Grupo creado y seleccionado');
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={styles.header}>
                <Text numberOfLines={1} style={styles.headerTitle}>{headerTitle}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Botón crear grupo en header */}
                    <Pressable
                        onPress={() => navigation.navigate('CreateGroup')}
                        style={styles.headerCreateBtn}
                        hitSlop={8}
                    >
                        <Ionicons name="add-circle-outline" size={18} color="#4F59F5" />
                        <Text style={styles.headerCreateText}>Crear grupo</Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Notifications', { variant: 'list' })} hitSlop={8} style={{ marginLeft: 10 }}>
                        <Ionicons name="notifications-outline" size={24} color="#fff" />
                    </Pressable>
                </View>
            </View>

            {/* Aviso si no hay grupo aún */}
            {!groupId && (
                <Pressable style={styles.banner} onPress={() => navigation.replace('SelectGroup')}>
                    <Ionicons name="information-circle-outline" size={18} color="#173049" />
                    <Text style={{ marginLeft: 6, color: '#173049', fontWeight: '600' }}>
                        Elige un grupo para ver y crear eventos
                    </Text>
                </Pressable>
            )}

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.sectionTitle}>Upcoming Events</Text>

                {/* Lista real de eventos */}
                {groupId && events.map(ev => (
                    <Pressable key={ev.id} style={styles.card} onPress={() => navigation.navigate('EventDetails', { eventId: ev.id })}>
                        <View style={[styles.cardThumb, { width: 14, borderRadius: 4 }]} />
                        <View style={{ padding: 12, flex: 1 }}>
                            <Text style={{ fontWeight: '800', fontSize: 16, color: '#173049' }}>{ev.title}</Text>
                            <Text style={{ color: '#6B7280', marginTop: 4 }}>{fmtDate(ev.start_at)}</Text>
                            {ev.location_name ? <Text style={{ color: '#6B7280', marginTop: 2 }}>{ev.location_name}</Text> : null}
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" style={{ alignSelf: 'center', marginRight: 10 }} />
                    </Pressable>
                ))}

                {/* Empty state si no hay eventos */}
                {groupId && events.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={{ fontWeight: '700', color: '#173049', marginBottom: 6 }}>No Upcoming Event</Text>
                        <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                            Aún no hay eventos para este grupo.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB Crear Evento */}
            <Pressable
                style={[styles.fab, !groupId && { opacity: 0.5 }]}
                onPress={() => navigation.navigate('CreateEvent', { groupId })}
                disabled={!groupId}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>

            {/* MODAL CREAR GRUPO */}
            <Modal visible={showCreate} animationType="slide" transparent>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>Crear grupo</Text>

                        <Text style={styles.label}>Nombre</Text>
                        <TextInput
                            value={gName}
                            onChangeText={setGName}
                            placeholder="Ej. Barrio Central"
                            style={styles.input}
                        />

                        <Text style={styles.label}>Descripción (opcional)</Text>
                        <TextInput
                            value={gDesc}
                            onChangeText={setGDesc}
                            placeholder="¿De qué trata el grupo?"
                            style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
                            multiline
                        />

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                            <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setShowCreate(false)} disabled={creating}>
                                <Text style={[styles.btnText, { color: '#4F59F5' }]}>Cancelar</Text>
                            </Pressable>
                            <Pressable style={[styles.btn, styles.btnPrimary, creating && { opacity: 0.6 }]} onPress={submitCreateGroup} disabled={creating}>
                                <Text style={[styles.btnText, { color: '#fff' }]}>{creating ? 'Creando...' : 'Crear'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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
    headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800', flex: 1, marginRight: 12 },
    headerCreateBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerCreateText: { marginLeft: 6, color: '#4F59F5', fontWeight: '700' },
    banner: {
        margin: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    },
    sectionTitle: { marginTop: 18, marginBottom: 8, fontSize: 18, fontWeight: '800', color: '#173049' },
    card: {
        backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
        shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1,
        marginBottom: 12, flexDirection: 'row', alignItems: 'stretch'
    },
    cardThumb: { backgroundColor: '#DDE3FF', height: '100%' },
    fab: {
        position: 'absolute', bottom: 24, alignSelf: 'center', backgroundColor: '#4F59F5',
        width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 4
    },
    empty: { marginTop: 16, alignItems: 'center', padding: 16, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12 },

    // Modal
    modalBackdrop: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16,
        borderWidth: 1, borderColor: '#E5E7EB',
    },
    modalTitle: { fontSize: 18, fontWeight: '800', color: '#173049', marginBottom: 8 },
    label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48 },

    btn: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
    btnGhost: { backgroundColor: '#EEF2FF' },
    btnPrimary: { backgroundColor: '#4F59F5' },
    btnText: { fontWeight: '700' },
});
