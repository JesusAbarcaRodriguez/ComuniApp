import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    Platform,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }) {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState('');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                const { data: prof, error: pErr } = await supabase
                    .from('profiles')
                    .select('display_name, avatar_url, selected_group_id')
                    .eq('id', user?.id)
                    .single();
                if (pErr) throw pErr;
                if (!mounted) return;

                setDisplayName(prof?.display_name || '');
                setAvatarUrl(prof?.avatar_url || '');

                if (prof?.selected_group_id) {
                    const { data: g, error: gErr } = await supabase
                        .from('groups')
                        .select('name')
                        .eq('id', prof.selected_group_id)
                        .single();
                    if (!gErr && mounted) setSelectedGroupName(g?.name || '');
                } else {
                    setSelectedGroupName('');
                }
            } catch (e) {
                if (mounted) Alert.alert('Error', e.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [user?.id]);

    const onLogout = () => {
        if (Platform.OS === 'web') {
            const ok = window.confirm('¿Seguro que deseas salir?');
            if (!ok) return;
            (async () => {
                const { error } = await signOut();
                if (error) return window.alert(`Error: ${error.message}`);
                navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
            })();
            return;
        }

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
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.muted}>Cargando perfil...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header compacto */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={{ fontSize: 26 }}>{avatarUrl ? '🖼️' : '👤'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.name}>
                        {displayName || 'Sin nombre'}
                    </Text>
                    <Text numberOfLines={1} style={styles.email}>{email}</Text>
                    <Text style={styles.meta}>
                        {selectedGroupName ? `Grupo por defecto: ${selectedGroupName}` : 'Sin grupo por defecto'}
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Opciones (solo lo que existe en profiles) */}
                <View style={styles.card}>
                    <Pressable style={[styles.row, styles.rowDivider]} onPress={() => navigation.navigate('EditProfile')}>
                        <Ionicons name="person-circle-outline" size={20} color="#173049" />
                        <Text style={styles.rowText}>Editar perfil</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </Pressable>

                    <Pressable style={styles.row} onPress={() => navigation.navigate('SelectGroup')}>
                        <Ionicons name="people-outline" size={20} color="#173049" />
                        <Text style={styles.rowText}>Cambiar grupo por defecto</Text>
                        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                    </Pressable>
                </View>

                {/* Espaciador para que no tape el botón fijo */}
                <View style={{ height: 80 }} />
            </ScrollView>

            {/* Botón fijo de logout (mobile-friendly) */}
            <View style={styles.footer}>
                <Pressable style={styles.logout} onPress={onLogout}>
                    <Ionicons name="log-out-outline" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 8 : 4,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    avatar: {
        width: 54, height: 54, borderRadius: 27,
        backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center',
    },
    name: { fontSize: 18, fontWeight: '800', color: '#173049' },
    email: { color: '#6B7280', marginTop: 2, fontSize: 13 },
    meta: { color: '#9CA3AF', marginTop: 2, fontSize: 12 },

    content: { padding: 16, paddingBottom: 0 },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    row: {
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    rowDivider: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F3F4F6',
    },
    rowText: { flex: 1, color: '#173049', fontWeight: '600', fontSize: 14 },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    muted: { marginTop: 8, color: '#6B7280' },

    footer: {
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#E5E7EB',
    },
    logout: {
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    logoutText: { color: '#fff', fontWeight: '800' },
});
