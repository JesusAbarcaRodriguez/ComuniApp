import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function EditProfileScreen({ navigation }) {
    const [name, setName] = useState('Johnny Chavarría');
    const [email, setEmail] = useState('johnny@example.com');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar perfil</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />

            <Text style={styles.label}>Correo</Text>
            <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

            <View style={{ marginTop: 16 }}>
                <PrimaryButton title="Guardar" icon="checkmark" onPress={() => navigation.goBack()} />
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
