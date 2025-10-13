import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { listGroupsByName, setSelectedGroup } from '../data/groups.supabase';

export default function SelectGroupScreen({ navigation }) {
    const [q, setQ] = useState('');
    const [groups, setGroups] = useState([]);

    useEffect(() => { load(); }, []);
    const load = async () => {
        const data = await listGroupsByName('');
        setGroups(data);
    };

    const filtered = q ? groups.filter(g => g.name.toLowerCase().includes(q.toLowerCase())) : groups;

    const onSelect = async (item) => {
        await setSelectedGroup(item.id);
        navigation.replace('MainTabs', { groupId: item.id, groupName: item.name });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Selecciona un grupo</Text>
            <View style={styles.search}>
                <Ionicons name="search" size={18} color="#9CA3AF" />
                <TextInput
                    placeholder="Buscar grupo..."
                    style={{ flex: 1, marginLeft: 8 }}
                    value={q}
                    onChangeText={setQ}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingVertical: 8 }}
                renderItem={({ item }) => (
                    <Pressable onPress={() => onSelect(item)} style={styles.item}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#6B7280" />
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={{ color: '#9CA3AF', marginTop: 12 }}>Sin resultados</Text>}
            />

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
    item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemText: { fontSize: 16, color: '#173049', fontWeight: '600' },
    createBtn: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', marginTop: 16 },
});
