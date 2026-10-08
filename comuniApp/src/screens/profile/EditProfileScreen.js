// src/screens/profile/EditProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, Button, FormField, PasswordField, Skeleton } from '../../components';
import { useToast } from '../../feedback';
import { radius, spacing } from '../../theme';
import { useAuth } from '../../context/AuthProvider';
import { supabase } from '../../lib/supabase';

export default function EditProfileScreen({ navigation }) {
    const toast = useToast();
    const { user, updateProfile, updatePassword } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (!user?.id) throw new Error('Usuario no autenticado');
                const { data, error } = await supabase
                    .from('profiles')
                    .select('display_name')
                    .eq('id', user.id)
                    .single();
                if (error) throw error;
                if (mounted) setDisplayName(data?.display_name || '');
            } catch (e) {
                toast.error(e.message);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [user?.id]);

    const onSave = async () => {
        const next = {};
        if (!displayName.trim() && !password) next.displayName = 'Escribe un nombre o una nueva contraseña.';
        if (password && password.length < 6) next.password = 'Debe tener al menos 6 caracteres.';
        setErrors(next);
        if (Object.keys(next).length) return;

        setSaving(true);
        try {
            if (displayName.trim()) {
                const { error } = await updateProfile({ id: user.id, display_name: displayName.trim() });
                if (error) throw error;
            }
            if (password) {
                const { error } = await updatePassword(password);
                if (error) throw error;
            }
            toast.success('Perfil actualizado');
            navigation.goBack();
        } catch (e) {
            toast.error(e.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Screen>
                <View style={styles.form}>
                    {[0, 1, 2].map((i) => <Skeleton key={i} height={74} borderRadius={radius.md} />)}
                </View>
            </Screen>
        );
    }

    return (
        <Screen keyboard footer={<Button title="Guardar cambios" icon="checkmark" onPress={onSave} loading={saving} />}>
            <View style={styles.form}>
                <FormField
                    label="Nombre visible"
                    icon="person-outline"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={displayName}
                    onChangeText={(t) => { setDisplayName(t); if (errors.displayName) setErrors({}); }}
                    error={errors.displayName}
                />
                <FormField
                    label="Correo"
                    icon="mail-outline"
                    value={user?.email || ''}
                    editable={false}
                    hint="Cambiar el correo requiere verificación adicional, por eso es de solo lectura."
                />
                <PasswordField
                    label="Nueva contraseña (opcional)"
                    icon="lock-closed-outline"
                    placeholder="Déjalo vacío para no cambiarla"
                    autoComplete="new-password"
                    textContentType="newPassword"
                    value={password}
                    onChangeText={(t) => { setPassword(t); if (errors.password) setErrors({}); }}
                    error={errors.password}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: { gap: spacing.lg },
});
