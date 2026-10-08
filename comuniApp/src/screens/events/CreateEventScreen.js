// src/screens/events/CreateEventScreen.js
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Screen, AppText, Button, FormField, DateTimeField } from '../../components';
import { useToast } from '../../feedback';
import { colors, radius, spacing } from '../../theme';
import { formatYMD, formatHM } from '../../utils/format';
import { createEvent } from '../../data/events.supabase';
import { getSelectedGroup } from '../../data/groups.supabase';

export default function CreateEventScreen({ navigation, route }) {
    const toast = useToast();
    const descRef = useRef(null);
    const placeRef = useRef(null);
    const [groupId, setGroupId] = useState(route?.params?.groupId || null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // resolver grupo por defecto si no viene en params
    useEffect(() => {
        if (groupId) return;
        getSelectedGroup()
            .then((gid) => setGroupId(gid || null))
            .catch((e) => console.log('getSelectedGroup error', e));
    }, [groupId]);

    const onCreate = async () => {
        const next = {};
        if (!title.trim()) next.title = 'El título es obligatorio.';
        setErrors(next);
        if (Object.keys(next).length) return;

        setLoading(true);
        try {
            // el status final lo decide createEvent según el rol (OWNER/ADMIN => APPROVED, demás => PENDING)
            const row = await createEvent({
                groupId,
                title: title.trim(),
                description: description.trim() || null,
                startDate: formatYMD(date),
                startTime: formatHM(time),
                endDate: null,
                endTime: null,
                locationName: place.trim() || null,
                status: undefined,
            });
            toast.success('Evento creado');
            navigation.replace('EventDetails', { eventId: row.id });
        } catch (e) {
            toast.error(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Screen
            keyboard
            footer={<Button title="Publicar evento" icon="send" onPress={onCreate} loading={loading} disabled={!groupId} />}
        >
            <View style={styles.form}>
                {!groupId ? (
                    <View style={styles.warning} accessibilityRole="alert">
                        <AppText variant="caption" tone="danger">Debes seleccionar un grupo antes de crear el evento.</AppText>
                    </View>
                ) : null}

                <FormField
                    label="Título"
                    placeholder="Ej. Clases de básquetbol"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    onSubmitEditing={() => descRef.current?.focus()}
                    value={title}
                    onChangeText={(t) => { setTitle(t); if (errors.title) setErrors({}); }}
                    error={errors.title}
                />

                <FormField
                    ref={descRef}
                    label="Descripción (opcional)"
                    placeholder="Ej. Entrenamiento semanal para principiantes."
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <View style={styles.row}>
                    <View style={styles.col}>
                        <DateTimeField label="Fecha" mode="date" value={date} onChange={setDate} />
                    </View>
                    <View style={styles.col}>
                        <DateTimeField label="Hora" mode="time" value={time} onChange={setTime} />
                    </View>
                </View>

                <FormField
                    ref={placeRef}
                    label="Lugar (opcional)"
                    icon="location-outline"
                    placeholder="Ej. Plaza de deportes"
                    returnKeyType="done"
                    value={place}
                    onChangeText={setPlace}
                />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    form: { gap: spacing.lg },
    row: { flexDirection: 'row', gap: spacing.md },
    col: { flex: 1 },
    warning: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm, padding: spacing.md },
});
