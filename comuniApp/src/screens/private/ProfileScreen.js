// src/screens/app/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function ProfileScreen() {
    const { user, updateProfile, updatePassword } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('id', user.id)
                .single();
            if (!mounted) return;
            if (error && error.code !== 'PGRST116') console.log(error);
            setDisplayName(data?.display_name || '');
            setLoading(false);
        };
        load();
        return () => { mounted = false; };
    }, [user?.id]);

    const onSave = async () => {
        const { error } = await updateProfile({ id: user.id, display_name: displayName });
        if (error) return Alert.alert('Error', error.message);
        Alert.alert('Éxito', 'Perfil actualizado');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Perfil</Text>
            {loading ? <Text>Cargando...</Text> : (
                <>
                    <TextInput value={displayName} onChangeText={setDisplayName} placeholder="Nombre" style={styles.input} />
                    <Pressable style={styles.primary} onPress={onSave}><Text style={styles.primaryText}>Guardar</Text></Pressable>
                </>
            )}
            {/* Ejemplo de cambio de password */}
            {/* <Pressable onPress={() => updatePassword('nuevoPass123!')}>...</Pressable> */}
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    h1: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
    input: { height: 48, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, marginBottom: 10 },
    primary: { backgroundColor: '#4F59F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
    primaryText: { color: '#fff', fontWeight: '700' },
});
