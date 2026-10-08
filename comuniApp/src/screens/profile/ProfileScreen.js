// src/screens/profile/ProfileScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Button, Card, ListItem, ProfileHeader, SectionHeader, Skeleton } from '../../components';
import { confirm, useToast } from '../../feedback';
import { spacing } from '../../theme';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../lib/supabase';
import { isGroupOwner, deleteGroup } from '../../data/groups.supabase';

export default function ProfileScreen({ navigation }) {
    const toast = useToast();
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState('');
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    const load = useCallback(async () => {
        try {
            const { data: prof, error: pErr } = await supabase
                .from('profiles')
                .select('display_name, selected_group_id')
                .eq('id', user?.id)
                .single();
            if (pErr) throw pErr;

            setDisplayName(prof?.display_name || '');

            if (prof?.selected_group_id) {
                setSelectedGroupId(prof.selected_group_id);
                const [{ data: g }, owner] = await Promise.all([
                    supabase.from('groups').select('name').eq('id', prof.selected_group_id).single(),
                    isGroupOwner(prof.selected_group_id),
                ]);
                setSelectedGroupName(g?.name || '');
                setIsOwner(owner);
            } else {
                setSelectedGroupName('');
                setSelectedGroupId(null);
                setIsOwner(false);
            }
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    // refresca al volver de "Editar perfil"
    useEffect(() => navigation.addListener('focus', load), [navigation, load]);

    const handleDeleteGroup = async () => {
        if (!selectedGroupId) return;
        const ok = await confirm({
            title: 'Eliminar grupo',
            message: `¿Seguro que quieres eliminar "${selectedGroupName}"? Se eliminarán también todos sus eventos. Esta acción no se puede deshacer.`,
            confirmText: 'Eliminar',
            destructive: true,
        });
        if (!ok) return;
        try {
            await deleteGroup(selectedGroupId);
            await supabase.from('profiles').update({ selected_group_id: null }).eq('id', user?.id);
            toast.success('Grupo eliminado');
            navigation.navigate('SelectGroup');
        } catch (e) {
            toast.error(e.message);
        }
    };

    const onLogout = async () => {
        const ok = await confirm({ title: 'Cerrar sesión', message: '¿Seguro que quieres salir?', confirmText: 'Salir', destructive: true });
        if (!ok) return;
        const { error } = await signOut();
        if (error) return toast.error(error.message);
        navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
    };

    if (loading) {
        return (
            <Screen safeTop>
                <View style={styles.skeleton}>
                    <Skeleton width={80} height={80} borderRadius={40} />
                    <Skeleton width="50%" height={22} />
                    <Skeleton width="65%" height={14} />
                </View>
            </Screen>
        );
    }

    return (
        <Screen
            safeTop
            footer={<Button title="Cerrar sesión" variant="dangerSoft" icon="log-out-outline" onPress={onLogout} />}
        >
            <ProfileHeader name={displayName} email={user?.email} groupName={selectedGroupName} />

            <SectionHeader title="Cuenta" style={{ marginTop: 0 }} />
            <Card padded={false}>
                <ListItem icon="person-circle-outline" label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} divider />
                <ListItem icon="swap-horizontal" label="Cambiar grupo por defecto" onPress={() => navigation.navigate('SelectGroup')} />
            </Card>

            {isOwner && selectedGroupId ? (
                <>
                    <SectionHeader title="Zona de peligro" />
                    <Card padded={false}>
                        <ListItem icon="trash-outline" label="Eliminar mi grupo" tone="danger" onPress={handleDeleteGroup} />
                    </Card>
                </>
            ) : null}
        </Screen>
    );
}

const styles = StyleSheet.create({
    skeleton: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl },
});
