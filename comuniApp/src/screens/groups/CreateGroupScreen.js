// src/screens/groups/CreateGroupScreen.js
import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, AppText, Button, FormField } from '../../components';
import { useToast } from '../../feedback';
import { spacing } from '../../theme';
import { createGroup, setSelectedGroup } from '../../data/groups.supabase';

export default function CreateGroupScreen({ navigation }) {
    const toast = useToast();
    const descRef = useRef(null);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onCreate = async () => {
        const trimmed = name.trim();
        if (!trimmed) return setError('El nombre es obligatorio.');
        setError('');
        setLoading(true);
        try {
            const g = await createGroup({ name: trimmed, description: desc.trim() });
            await setSelectedGroup(g.id);
            toast.success(`Grupo "${g.name}" creado`);
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs', params: { screen: 'Explore', params: { groupId: g.id, groupName: g.name } } }],
            });
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen
            keyboard
            footer={<Button title="Crear grupo" icon="checkmark" onPress={onCreate} loading={loading} />}
        >
            <View style={styles.form}>
                <AppText variant="body" tone="secondary">
                    Serás el owner del grupo y podrás aprobar miembros y eventos.
                </AppText>
                <FormField
                    label="Nombre del grupo"
                    placeholder="Ej. Vecinos de San Luis"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                    onSubmitEditing={() => descRef.current?.focus()}
                    value={name}
                    onChangeText={(t) => { setName(t); if (error) setError(''); }}
                    error={error}
                />
                <FormField
                    ref={descRef}
                    label="Descripción (opcional)"
                    placeholder="¿De qué trata el grupo?"
                    multiline
                    value={desc}
                    onChangeText={setDesc}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: { gap: spacing.lg },
});
