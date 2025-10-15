// src/screens/EditProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthProvider';
import { supabase } from '../lib/supabase';

export default function EditProfileScreen({ navigation }) {
    const { user, updateProfile, updatePassword } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                if (!user?.id) throw new Error('Usuario no autenticado');

                const { data, error } = await supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                if (!mounted) return;

                setDisplayName(data?.display_name || '');
                setEmail(user.email || '');
            } catch (e) {
                Alert.alert('Error', e.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [user?.id]);

    const onSave = async () => {
        try {
            if (!user?.id) return Alert.alert('Error', 'No hay usuario activo');

            if (!displayName.trim() && !password) {
                return Alert.alert('Sin cambios', 'Escribe un nombre o una nueva contraseña para guardar.');
            }

            setSaving(true);

            // 1) Actualizar nombre de perfil si cambió
            if (displayName.trim()) {
                const { error } = await updateProfile({ id: user.id, display_name: displayName.trim() });
                if (error) throw error;
            }

            // 2) Actualizar contraseña si se ingresó
            if (password) {
                const { error } = await updatePassword(password);
                if (error) throw error;
            }

            Alert.alert('Listo', 'Tu perfil se actualizó correctamente.');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator />
                <Text style={{ marginTop: 8, color: '#6B7280' }}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar perfil</Text>

            {/* Nombre de perfil (profiles.display_name) */}
            <Text style={styles.label}>Nombre de perfil</Text>
            <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                style={styles.input}
                placeholder="Tu nombre visible"
            />

            {/* Email (solo lectura desde auth) */}
            <Text style={styles.label}>Correo</Text>
            <TextInput
                value={email}
                editable={false}
                style={[styles.input, { backgroundColor: '#F9FAFB', color: '#6B7280' }]}
            />

            {/* Contraseña nueva (opcional) */}
            <Text style={styles.label}>Nueva contraseña (opcional)</Text>
            <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry={hidden}
                    style={{ flex: 1 }}
                />
                <Pressable onPress={() => setHidden(!hidden)} hitSlop={8}>
                    <Ionicons name={hidden ? 'eye-off' : 'eye'} size={18} color="#9CA3AF" />
                </Pressable>
            </View>

            <View style={{ marginTop: 16 }}>
                <PrimaryButton
                    title={saving ? 'Guardando...' : 'Guardar'}
                    icon="checkmark"
                    onPress={onSave}
                    disabled={saving}
                />
            </View>

            <Text style={{ color: '#9CA3AF', marginTop: 10 }}>
                Nota: cambiar el correo requiere un flujo de verificación adicional, por eso aquí es de solo lectura.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 16 },
    label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48 },
});
