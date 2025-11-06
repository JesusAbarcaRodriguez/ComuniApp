// src/screens/ExploreScreen.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, Modal, TextInput, Alert, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import AnimatedEventCard from '../components/AnimatedEventCard';
import { getSelectedGroup, getGroupName, createGroup, setSelectedGroup } from '../data/groups.supabase';
import { listUpcomingEventsByGroup } from '../data/events.supabase';

export default function ExploreScreen({ navigation, route }) {
    const [headerTitle, setHeaderTitle] = useState('Explorar');
    const [groupId, setGroupId] = useState(null);
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Modal Crear Grupo
    const [showCreate, setShowCreate] = useState(false);
    const [gName, setGName] = useState('');
    const [gDesc, setGDesc] = useState('');
    const [creating, setCreating] = useState(false);

    // Animación del FAB
    const fabScale = useRef(new Animated.Value(0)).current;
    const fabOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animar FAB después de que carguen los eventos
        if (groupId && events.length > 0) {
            const delay = events.length * 100 + 100;
            Animated.parallel([
                Animated.timing(fabOpacity, {
                    toValue: 1,
                    delay: delay,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(fabScale, {
                    toValue: 1,
                    delay: delay,
                    tension: 50,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]).start();
        } else if (groupId) {
            // Si hay grupo pero sin eventos, animar inmediatamente
            Animated.parallel([
                Animated.timing(fabOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(fabScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [events, groupId]);

    const load = useCallback(async (gidParam) => {
        const gid = gidParam || route?.params?.groupId || (await getSelectedGroup());
        setGroupId(gid || null);
        const name = gid ? await getGroupName(gid) : null;
        setHeaderTitle(name || 'Explorar');

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
                <Text style={styles.sectionTitle}>Próximos Eventos</Text>

                {/* Lista real de eventos con animaciones */}
                {groupId && events.map((ev, index) => (
                    <AnimatedEventCard
                        key={ev.id}
                        event={ev}
                        index={index}
                        onPress={() => navigation.navigate('EventDetails', { eventId: ev.id })}
                    />
                ))}

                {/* Empty state si no hay eventos */}
                {groupId && events.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={{ fontWeight: '700', color: '#173049', marginBottom: 6 }}>Sin Eventos Próximos</Text>
                        <Text style={{ color: '#6B7280', textAlign: 'center' }}>
                            Aún no hay eventos para este grupo.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB Crear Evento con animación */}
            <Animated.View
                style={[
                    styles.fab,
                    {
                        opacity: fabOpacity,
                        transform: [{ scale: fabScale }],
                    },
                    !groupId && { opacity: 0.5 },
                ]}
            >
                <Pressable
                    onPress={() => navigation.navigate('CreateEvent', { groupId })}
                    disabled={!groupId}
                    style={styles.fabPressable}
                >
                    <Ionicons name="add" size={28} color="#fff" />
                </Pressable>
            </Animated.View>

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
    fab: {
        position: 'absolute',
        bottom: 24,
        alignSelf: 'center',
        backgroundColor: '#4F59F5',
        width: 56,
        height: 56,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    fabPressable: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
