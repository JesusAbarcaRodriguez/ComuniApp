import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { createEvent } from '../data/events.supabase';

export default function CreateEventScreen({ navigation, route }) {
    const groupId = route?.params?.groupId; // si lo pasas; si no, podrías leerlo de profiles
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('2025-07-10');  // YYYY-MM-DD (ejemplo)
    const [time, setTime] = useState('07:00');       // HH:mm
    const [place, setPlace] = useState('');

    const onCreate = async () => {
        if (!groupId) return Alert.alert('Falta grupo', 'Selecciona un grupo primero');
        if (!title.trim()) return Alert.alert('Requerido', 'Título es obligatorio');

        const startAtISO = new Date(`${date}T${time}:00Z`).toISOString();
        try {
            await createEvent({ groupId, title: title.trim(), startAtISO, endAtISO: null, locationName: place.trim() });
            Alert.alert('Éxito', 'Evento creado (PENDING)');
            navigation.goBack();
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear evento</Text>
            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Ej. Basketball classes" style={styles.input} />
            <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
            <TextInput value={date} onChangeText={setDate} placeholder="2025-07-10" style={styles.input} />
            <Text style={styles.label}>Hora (HH:mm)</Text>
            <TextInput value={time} onChangeText={setTime} placeholder="07:00" style={styles.input} />
            <Text style={styles.label}>Lugar</Text>
            <TextInput value={place} onChangeText={setPlace} placeholder="Bolivia Platanare's Sports Square" style={styles.input} />
            <View style={{ marginTop: 16 }}>
                <PrimaryButton title="Publicar" onPress={onCreate} icon="send" />
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
