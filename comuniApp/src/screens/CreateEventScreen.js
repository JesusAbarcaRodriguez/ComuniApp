import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { createEvent } from '../data/events.supabase';
import { getSelectedGroup } from '../data/groups.supabase';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateEventScreen({ navigation, route }) {
    const [groupId, setGroupId] = useState(route?.params?.groupId || null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [loading, setLoading] = useState(false);


    const [date, setDate] = useState(new Date());
    const [showDate, setShowDate] = useState(false);

    const [time, setTime] = useState(new Date());
    const [showTime, setShowTime] = useState(false);
    // Si no vino groupId por params, lo leemos del perfil
    useEffect(() => {
        if (groupId) return;
        (async () => {
            try {
                const gid = await getSelectedGroup();
                setGroupId(gid);
            } catch (e) {
                console.log('getSelectedGroup error', e);
            }
        })();
    }, [groupId]);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTime(Platform.OS === 'ios');
        setTime(currentTime);
    };


    const onCreate = async () => {
        try {
            setLoading(true);
            const row = await createEvent({
                groupId,
                title,
                startDate: date,
                startTime: time,
                locationName: place,
                // status: 'APPROVED', // <- usa esto mientras desarrollas si quieres verlo de una vez en Explore
            });
            setLoading(false);
            Alert.alert('Éxito', 'Evento creado');
            // Ir a detalles del evento recién creado
            navigation.replace('EventDetails', { eventId: row.id });
        } catch (e) {
            setLoading(false);
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Crear evento</Text>

            {!groupId && (
                <Text style={{ color: '#EF4444', marginBottom: 8 }}>
                    Debes seleccionar un grupo antes de crear el evento.
                </Text>
            )}

            <Text style={styles.label}>Título</Text>
            <TextInput value={title} onChangeText={setTitle} placeholder="Ej. Basketball classes" style={styles.input} />

            <Text style={styles.label}>Descripción</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Ej. Entrenamiento semanal para principiantes."
                style={[styles.input, styles.multiline]}
                multiline
            />

            <Text style={styles.label}>Fecha</Text>
            <PrimaryButton title="Seleccionar fecha" onPress={() => setShowDate(true)} />
            <Text style={styles.value}>{date.toISOString().split('T')[0]}</Text>

            <Text style={styles.label}>Hora</Text>
            <PrimaryButton title="Seleccionar hora" onPress={() => setShowTime(true)} />
            <Text style={styles.value}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>

            {showDate && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

            {showTime && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                />
            )}

            <Text style={styles.label}>Lugar</Text>
            <TextInput value={place} onChangeText={setPlace} placeholder="Bolivia Platanare's Sports Square" style={styles.input} />

            <View style={{ marginTop: 16 }}>
                <PrimaryButton title={loading ? 'Publicando...' : 'Publicar'} onPress={onCreate} icon="send" disabled={!groupId || loading} />
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
