import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { createGroup } from '../data/groups.supabase';

export default function CreateGroupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    const onCreate = async () => {
        if (!name.trim()) return Alert.alert('Requerido', 'El nombre es obligatorio');
        try {
            const g = await createGroup({ name: name.trim(), description: desc.trim() });
            Alert.alert('Éxito', 'Grupo creado');
            navigation.replace('SelectGroup'); // vuelves a seleccionar (o navegar directo a tabs con ese grupo)
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear grupo</Text>
            <Text style={styles.label}>Nombre del grupo</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Ej. Vecinos de San Luis" style={styles.input} />
            <Text style={styles.label}>Descripción</Text>
            <TextInput value={desc} onChangeText={setDesc} placeholder="¿De qué trata el grupo?" style={[styles.input, { height: 90 }]} multiline />
            <View style={{ marginTop: 16 }}>
                <PrimaryButton title="Crear" onPress={onCreate} icon="checkmark" />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 16 },
    label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48 },
});
