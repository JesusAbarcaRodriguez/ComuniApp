import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    listGroupsByName,
    listMyMemberships,
    listMyJoinRequestsPending,
    setSelectedGroup,
    requestJoinGroup,
} from '../data/groups.supabase';

export default function SelectGroupScreen({ navigation }) {
    const [q, setQ] = useState('');
    const [groups, setGroups] = useState([]);
    const [memberships, setMemberships] = useState([]); // [{group_id, role}]
    const [pendingIds, setPendingIds] = useState([]);   // [group_id,...]
    const [loading, setLoading] = useState(true);
    const [joiningId, setJoiningId] = useState(null);

    const load = async () => {
        try {
            setLoading(true);
            const [gs, ms, prs] = await Promise.all([
                listGroupsByName(''),
                listMyMemberships(),
                listMyJoinRequestsPending(),
            ]);
            setGroups(gs);
            setMemberships(ms);
            setPendingIds(prs);
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const membershipMap = useMemo(() => {
        const map = new Map();
        memberships.forEach(m => map.set(m.group_id, m.role));
        return map;
    }, [memberships]);

    const isPending = (groupId) => pendingIds.includes(groupId);

    const filtered = useMemo(() => {
        if (!q) return groups;
        const qq = q.toLowerCase();
        return groups.filter(g => g.name.toLowerCase().includes(qq));
    }, [q, groups]);

    const onSelect = async (item) => {
        try {
            await setSelectedGroup(item.id);
            navigation.replace('MainTabs', { groupId: item.id, groupName: item.name });
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    const onRequestJoin = async (item) => {
        try {
            setJoiningId(item.id);
            const res = await requestJoinGroup(item.id);
            const prs = await listMyJoinRequestsPending();
            setPendingIds(prs);

            if (res.already) {
                Alert.alert('Ya enviado', 'Tu solicitud para unirte a este grupo ya está pendiente de aprobación.');
            } else {
                Alert.alert('Solicitud enviada', 'Se envió la solicitud al admin del grupo. Te notificaremos cuando sea aprobada.');
            }
        } catch (e) {
            console.warn('onRequestJoin error ->', e);
            Alert.alert('Error', e?.message ?? 'No se pudo enviar la solicitud');
        } finally {
            setJoiningId(null);
        }
    };

    const renderItem = ({ item }) => {
        const role = membershipMap.get(item.id);
        const pending = isPending(item.id);

        return (
            <View style={styles.item}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.itemText}>{item.name}</Text>
                    {!!role && <Text style={styles.badge}>{role}</Text>}
                    {/* Si quieres mostrar privacy/status: */}
                    {/* <Text style={styles.meta}>{item.privacy || 'PUBLIC'} · {item.status || 'APPROVED'}</Text> */}
                </View>

                {role ? (
                    <Pressable onPress={() => onSelect(item)} style={styles.selectBtn}>
                        <Text style={{ color: '#4F59F5', fontWeight: '700' }}>Seleccionar</Text>
                        <Ionicons name="chevron-forward" size={18} color="#4F59F5" />
                    </Pressable>
                ) : pending ? (
                    <View style={[styles.joinBtn, { backgroundColor: '#9CA3AF' }]}>
                        <Ionicons name="time-outline" size={18} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6 }}>Solicitado</Text>
                    </View>
                ) : (
                    <Pressable onPress={() => onRequestJoin(item)} style={styles.joinBtn} disabled={joiningId === item.id || loading}>
                        {joiningId === item.id ? (
                            <ActivityIndicator />
                        ) : (
                            <>
                                <Ionicons name="person-add-outline" size={18} color="#fff" />
                                <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6 }}>Unirme</Text>
                            </>
                        )}
                    </Pressable>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona un grupo</Text>

            <View style={styles.search}>
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput placeholder="Buscar grupo..." style={{ flex: 1, marginLeft: 8 }} value={q} onChangeText={setQ} />
            </View>

            {loading ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator />
                    <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando grupos...</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={{ color: '#9CA3AF', marginTop: 12 }}>Sin resultados</Text>}
                />
            )}

            <Pressable style={styles.createBtn} onPress={() => navigation.navigate('CreateGroup')}>
                <Ionicons name="add-circle" size={20} color="#4F59F5" />
                <Text style={{ marginLeft: 6, color: '#4F59F5', fontWeight: '700' }}>Crear nuevo grupo</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 10 },
    search: { height: 48, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center' },

    item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    itemText: { fontSize: 16, color: '#173049', fontWeight: '600' },

    badge: { marginTop: 4, color: '#6B7280', fontWeight: '600' },
    meta: { color: '#9CA3AF', marginTop: 2 },

    selectBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#EEF2FF' },
    joinBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: '#4F59F5' },

    createBtn: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 16 },
});
