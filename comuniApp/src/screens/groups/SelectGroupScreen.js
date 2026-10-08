// src/screens/groups/SelectGroupScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Screen, AppText, Button, SearchBar, Skeleton, EmptyState, GroupListItem } from '../../components';
import { useToast } from '../../feedback';
import { colors, spacing } from '../../theme';
import {
    listGroupsByName,
    listMyMemberships,
    listMyJoinRequestsPending,
    setSelectedGroup,
    requestJoinGroup,
} from '../../data/groups.supabase';

export default function SelectGroupScreen({ navigation }) {
    const toast = useToast();
    const [q, setQ] = useState('');
    const [groups, setGroups] = useState([]);
    const [memberships, setMemberships] = useState([]); // [{group_id, role}]
    const [pendingIds, setPendingIds] = useState([]);   // [group_id,...]
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [joiningId, setJoiningId] = useState(null);

    const load = useCallback(async () => {
        try {
            const [gs, ms, prs] = await Promise.all([
                listGroupsByName(''),
                listMyMemberships(),
                listMyJoinRequestsPending(),
            ]);
            setGroups(gs);
            setMemberships(ms);
            setPendingIds(prs);
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

    const roleByGroup = useMemo(() => new Map(memberships.map((m) => [m.group_id, m.role])), [memberships]);

    // Primero mis grupos, luego el resto; filtrado por búsqueda
    const filtered = useMemo(() => {
        const qq = q.trim().toLowerCase();
        return groups
            .filter((g) => !qq || g.name.toLowerCase().includes(qq))
            .sort((a, b) => Number(roleByGroup.has(b.id)) - Number(roleByGroup.has(a.id)));
    }, [q, groups, roleByGroup]);

    const onSelect = async (item) => {
        try {
            await setSelectedGroup(item.id);
            navigation.replace('MainTabs', { groupId: item.id, groupName: item.name });
        } catch (e) {
            toast.error(e.message);
        }
    };

    const onRequestJoin = async (item) => {
        try {
            setJoiningId(item.id);
            const res = await requestJoinGroup(item.id);
            setPendingIds(await listMyJoinRequestsPending());
            if (res.already) toast.info('Tu solicitud ya está pendiente de aprobación.');
            else toast.success('Solicitud enviada al admin del grupo.');
        } catch (e) {
            toast.error(e?.message ?? 'No se pudo enviar la solicitud');
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <Screen
            scroll={false}
            padded={false}
            footer={
                <Button title="Crear nuevo grupo" variant="secondary" icon="add-circle-outline" onPress={() => navigation.navigate('CreateGroup')} />
            }
        >
            <View style={styles.top}>
                <AppText variant="body" tone="secondary">Entra a uno de tus grupos o únete a uno nuevo.</AppText>
                <SearchBar value={q} onChangeText={setQ} placeholder="Buscar grupo..." />
            </View>

            {loading ? (
                <View style={styles.list}>
                    {[0, 1, 2, 3].map((i) => (
                        <View key={i} style={styles.skeletonRow}>
                            <Skeleton width={40} height={40} borderRadius={20} />
                            <View style={{ flex: 1, gap: spacing.xs }}>
                                <Skeleton width="60%" height={16} />
                                <Skeleton width="25%" height={12} />
                            </View>
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={[styles.list, !filtered.length && { flexGrow: 1 }]}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                    renderItem={({ item }) => (
                        <GroupListItem
                            group={item}
                            role={roleByGroup.get(item.id)}
                            pending={pendingIds.includes(item.id)}
                            joining={joiningId === item.id}
                            onSelect={() => onSelect(item)}
                            onJoin={() => onRequestJoin(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            icon="search-outline"
                            title={q ? 'Sin resultados' : 'Aún no hay grupos'}
                            message={q ? `No encontramos grupos con "${q}".` : 'Crea el primero para tu comunidad.'}
                        />
                    }
                />
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    top: { padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.md },
    list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
    skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
});
