// src/screens/CreateEventScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrimaryButton from '../components/PrimaryButton';
import { createEvent } from '../data/events.supabase';
import { getSelectedGroup } from '../data/groups.supabase';
import { supabase } from '../lib/supabase';

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

    const onChangeDate = (_event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onChangeTime = (_event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTime(Platform.OS === 'ios');
        setTime(currentTime);
    };

    // Verifica si el usuario actual es OWNER/ADMIN del grupo
    const isOwnerOrAdmin = async (gid) => {
        const { data: auth } = await supabase.auth.getUser();
        const uid = auth?.user?.id;
        if (!uid || !gid) return false;

        // 1) Dueño por groups.owner_id
        const { data: owned, error: e1 } = await supabase
            .from('groups')
            .select('id')
            .eq('id', gid)
            .eq('owner_id', uid)
            .maybeSingle();
        if (e1) throw e1;
        if (owned) return true;

        // 2) Admin por group_members
        const { data: gm, error: e2 } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', gid)
            .eq('user_id', uid)
            .in('role', ['OWNER', 'ADMIN'])
            .maybeSingle();
        if (e2) throw e2;

        return !!gm;
    };

    const pad2 = (n) => String(n).padStart(2, '0');

    const onCreate = async () => {
        try {
            if (!groupId) return Alert.alert('Falta grupo', 'Selecciona un grupo antes de crear el evento.');
            if (!title.trim()) return Alert.alert('Requerido', 'El título es obligatorio');

            setLoading(true);

            // Define status según rol
            const admin = await isOwnerOrAdmin(groupId);
            const status = admin ? 'APPROVED' : 'PENDING';

            // Formatear fecha/hora a strings
            const y = date.getFullYear();
            const m = pad2(date.getMonth() + 1);
            const d = pad2(date.getDate());
            const startDate = `${y}-${m}-${d}`;

            const hh = pad2(time.getHours());
            const mm = pad2(time.getMinutes());
            const startTime = `${hh}:${mm}`;

            const row = await createEvent({
                groupId,
                title: title.trim(),
                description: description?.trim() || null,
                startDate,
                startTime,
                endDate: null,
                endTime: null,
                locationName: place?.trim() || null,
                status, // ← aprobado si es owner/admin, si no pending
            });

            Alert.alert('Éxito', admin ? 'Evento publicado' : 'Evento enviado a revisión');
            navigation.replace('EventDetails', { eventId: row.id });
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
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
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ej. Basketball classes"
                style={styles.input}
            />

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
                <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
            )}

            {showTime && (
                <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} />
            )}

            <Text style={styles.label}>Lugar</Text>
            <TextInput
                value={place}
                onChangeText={setPlace}
                placeholder="Bolivia Platanare's Sports Square"
                style={styles.input}
            />

            <View style={{ marginTop: 16 }}>
                <PrimaryButton
                    title={loading ? 'Publicando...' : 'Publicar'}
                    onPress={onCreate}
                    icon="send"
                    disabled={!groupId || loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 16 },
    label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48 },
    multiline: { height: 100, textAlignVertical: 'top' },
    value: { color: '#6B7280', marginTop: 6 },
});
