import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';

export default function CreateEventScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [place, setPlace] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear evento</Text>

            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Ej. Basketball classes" style={styles.input} />

            <Text style={styles.label}>Fecha</Text>
            <TextInput value={date} onChangeText={setDate} placeholder="10/07/2025" style={styles.input} />

            <Text style={styles.label}>Hora</Text>
            <TextInput value={time} onChangeText={setTime} placeholder="7:00 AM" style={styles.input} />

            <Text style={styles.label}>Lugar</Text>
            <TextInput value={place} onChangeText={setPlace} placeholder="Bolivia Platanar es Sports Square" style={styles.input} />

            <View style={{ marginTop: 16 }}>
                <PrimaryButton title="Publicar" onPress={() => navigation.goBack()} icon="send" />
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
