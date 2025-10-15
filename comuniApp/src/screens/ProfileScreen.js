// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }) {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState('');

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                setLoading(true);
                // 1) Traer perfil
                const { data: prof, error: pErr } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url, selected_group_id')
                    .eq('id', user?.id)
                    .single();
                if (pErr) throw pErr;

                if (!isMounted) return;
                setDisplayName(prof?.display_name || '');
                setAvatarUrl(prof?.avatar_url || '');
                setSelectedGroupId(prof?.selected_group_id || null);

                // 2) Nombre del grupo por defecto (si hay)
                if (prof?.selected_group_id) {
                    const { data: g, error: gErr } = await supabase
                        .from('groups')
                        .select('name')
                        .eq('id', prof.selected_group_id)
                        .single();
                    if (!isMounted) return;
                    if (!gErr) setSelectedGroupName(g?.name || '');
                } else {
                    setSelectedGroupName('');
                }
            } catch (e) {
                if (isMounted) Alert.alert('Error', e.message);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [user?.id]);

    const onLogout = () => {
        console.log('llega');

        if (Platform.OS === 'web') {
            const ok = window.confirm('¿Seguro que deseas salir?');
            if (!ok) return;
            (async () => {
                const { error } = await signOut();
                if (error) {
                    // En web usa window.alert para asegurar que se vea
                    window.alert(`Error: ${error.message}`);
                    return;
                }
                navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
            })();
            return;
        }

        // iOS / Android
        Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Salir',
                style: 'destructive',
                onPress: async () => {
                    const { error } = await signOut();
                    if (error) return Alert.alert('Error', error.message);
                    navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header simple con avatar o emoji placeholder */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={{ fontSize: 28 }}>{avatarUrl ? '🖼️' : '👤'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{displayName || 'Sin nombre'}</Text>
                    <Text style={styles.email}>{email}</Text>
                    {selectedGroupName ? (
                        <Text style={styles.meta}>Grupo por defecto: {selectedGroupName}</Text>
                    ) : (
                        <Text style={styles.meta}>Sin grupo por defecto</Text>
                    )}
                </View>
            </View>

            {/* Opciones SOLO según tabla profiles */}
            <View style={styles.card}>
                {/* Editar nombre (display_name) */}
                <Pressable style={styles.row} onPress={() => navigation.navigate('EditProfile')}>
                    <Ionicons name="person-circle-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Editar perfil</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                {/* Cambiar grupo por defecto (selected_group_id) */}
                <Pressable style={styles.row} onPress={() => navigation.navigate('SelectGroup')}>
                    <Ionicons name="people-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Cambiar grupo por defecto</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Cerrar sesión real */}
            <Pressable style={styles.logout} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },

    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: 18, fontWeight: '800', color: '#173049' },
    email: { color: '#6B7280' },
    meta: { color: '#9CA3AF', marginTop: 4 },

    card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
    row: { paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    rowText: { flex: 1, color: '#173049', fontWeight: '600' },

    logout: { marginTop: 22, backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
    logoutText: { color: '#fff', fontWeight: '800' },
});
