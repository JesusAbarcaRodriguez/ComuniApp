// src/screens/CreateEventScreen.js
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    KeyboardAvoidingView,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Platform,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import PrimaryButton from '../components/PrimaryButton';
import { createEvent } from '../data/events.supabase';
import { getSelectedGroup } from '../data/groups.supabase';

function pad(n) { return String(n).padStart(2, '0'); }
function fmtYMD(d) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function fmtHM(d) {
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function CreateEventScreen({ navigation, route }) {
    const [groupId, setGroupId] = useState(route?.params?.groupId || null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [loading, setLoading] = useState(false);

    // mantenemos Date objects para la UI
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    // pickers (Android: diálogo; iOS: sheet modal)
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    // resolver grupo por defecto si no viene en params
    useEffect(() => {
        if (groupId) return;
        (async () => {
            try {
                const gid = await getSelectedGroup();
                setGroupId(gid || null);
            } catch (e) {
                console.log('getSelectedGroup error', e);
            }
        })();
    }, [groupId]);

    // --- handlers Fecha/Hora
    const onChangeDate = (_, selected) => {
        if (Platform.OS === 'android') setShowDate(false);
        if (selected) setDate(selected);
    };
    const onChangeTime = (_, selected) => {
        if (Platform.OS === 'android') setShowTime(false);
        if (selected) setTime(selected);
    };

    const onCreate = async () => {
        try {
            if (!groupId) return Alert.alert('Selecciona un grupo', 'Debes elegir un grupo primero.');
            if (!title.trim()) return Alert.alert('Requerido', 'El título es obligatorio');

            setLoading(true);

            // 👉 convertir a strings para createEvent()
            const startDate = fmtYMD(date);  // "YYYY-MM-DD"
            const startTime = fmtHM(time);   // "HH:mm"

            // NOTE: status final lo determina createEvent según si el user es OWNER/ADMIN
            const row = await createEvent({
                groupId,
                title: title.trim(),
                description: description.trim() || null,
                startDate,
                startTime,
                endDate: null,
                endTime: null,
                locationName: place.trim() || null,
                status: undefined, // deja que la función decida (OWNER => APPROVED, demás => PENDING)
            });

            Alert.alert('Éxito', 'Evento creado');
            navigation.replace('EventDetails', { eventId: row.id });
        } catch (e) {
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

    // --- iOS sheets para fecha/hora
    const IOSDateSheet = ({ visible, mode, value, onChange, onCancel, onOk }) => (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.sheetBackdrop}>
                <View style={styles.sheetCard}>
                    <View style={styles.sheetHeader}>
                        <Pressable onPress={onCancel} style={styles.sheetBtnGhost}>
                            <Text style={styles.sheetBtnGhostText}>Cancelar</Text>
                        </Pressable>
                        <Text style={styles.sheetTitle}>{mode === 'date' ? 'Seleccionar fecha' : 'Seleccionar hora'}</Text>
                        <Pressable onPress={onOk} style={styles.sheetBtnPrimary}>
                            <Text style={styles.sheetBtnPrimaryText}>OK</Text>
                        </Pressable>
                    </View>
                    <DateTimePicker
                        value={value}
                        mode={mode}
                        display={mode === 'date' ? 'inline' : 'spinner'}
                        onChange={(_, sel) => { if (sel) onChange(sel); }}
                        style={{ alignSelf: 'center' }}
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                    >
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
                            returnKeyType="next"
                            autoCapitalize="sentences"
                        />

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Ej. Entrenamiento semanal para principiantes."
                            style={[styles.input, styles.multiline]}
                            multiline
                            textAlignVertical="top"
                            returnKeyType="done"
                            blurOnSubmit
                        />

                        <Text style={styles.label}>Fecha</Text>
                        <PrimaryButton
                            title="Seleccionar fecha"
                            onPress={() => setShowDate(true)}
                            icon="arrow-forward"
                        />
                        <Text style={styles.value}>{fmtYMD(date)}</Text>

                        <Text style={styles.label}>Hora</Text>
                        <PrimaryButton
                            title="Seleccionar hora"
                            onPress={() => setShowTime(true)}
                            icon="arrow-forward"
                        />
                        <Text style={styles.value}>{fmtHM(time)}</Text>

                        <Text style={styles.label}>Lugar</Text>
                        <TextInput
                            value={place}
                            onChangeText={setPlace}
                            placeholder="Bolivia Platanare's Sports Square"
                            style={styles.input}
                            returnKeyType="done"
                            blurOnSubmit
                        />

                        <View style={{ marginTop: 16 }}>
                            <PrimaryButton
                                title={loading ? 'Publicando...' : 'Publicar'}
                                onPress={onCreate}
                                icon="send"
                                disabled={!groupId || loading}
                            />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* ANDROID pickers como siempre */}
            {Platform.OS === 'android' && showDate && (
                <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
            )}
            {Platform.OS === 'android' && showTime && (
                <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} />
            )}

            {/* iOS sheets */}
            {Platform.OS === 'ios' && (
                <>
                    <IOSDateSheet
                        visible={showDate}
                        mode="date"
                        value={date}
                        onChange={setDate}
                        onCancel={() => setShowDate(false)}
                        onOk={() => setShowDate(false)}
                    />
                    <IOSDateSheet
                        visible={showTime}
                        mode="time"
                        value={time}
                        onChange={setTime}
                        onCancel={() => setShowTime(false)}
                        onOk={() => setShowTime(false)}
                    />
                </>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 16 },
    label: { marginTop: 10, marginBottom: 6, color: '#374151', fontWeight: '600' },
    input: {
        borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 48,
    },
    multiline: { height: 110 },

    value: { color: '#6B7280', marginTop: 6 },

    // iOS sheet
    sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
    sheetCard: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingBottom: 12 },
    sheetHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
    },
    sheetTitle: { fontWeight: '700', color: '#173049' },
    sheetBtnGhost: { paddingVertical: 8, paddingHorizontal: 8 },
    sheetBtnGhostText: { color: '#6B7280', fontWeight: '700' },
    sheetBtnPrimary: { paddingVertical: 8, paddingHorizontal: 8 },
    sheetBtnPrimaryText: { color: '#4F59F5', fontWeight: '700' },
});
