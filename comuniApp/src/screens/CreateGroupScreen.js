// src/screens/CreateGroupScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { createGroup, setSelectedGroup } from '../data/groups.supabase';

export default function CreateGroupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);

    const onCreate = async () => {
        const trimmed = name.trim();
        if (!trimmed) return Alert.alert('Requerido', 'El nombre es obligatorio');
        try {
            setLoading(true);
            const g = await createGroup({ name: trimmed, description: desc.trim() });
            await setSelectedGroup(g.id);

            Alert.alert('Éxito', 'Grupo creado y seleccionado');
            // Llévate al Explore con este grupo activo
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs', params: { screen: 'Explore', params: { groupId: g.id, groupName: g.name } } }],
            });
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.scrollContent}
                >
                <Text style={styles.title}>Crear grupo</Text>

                <Text style={styles.label}>Nombre del grupo</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ej. Vecinos de San Luis"
                    style={styles.input}
                    autoCapitalize="words"
                    autoCorrect={false}
                />

                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    value={desc}
                    onChangeText={setDesc}
                    placeholder="¿De qué trata el grupo?"
                    style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
                    multiline
                    returnKeyType="done"
                    blurOnSubmit
                />

                <View style={{ marginTop: 16 }}>
                    <PrimaryButton title={loading ? 'Creando...' : 'Crear'} onPress={onCreate} icon="checkmark" disabled={loading} />
                </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    scrollContent: { flexGrow: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 16 },
    label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48 },
});
