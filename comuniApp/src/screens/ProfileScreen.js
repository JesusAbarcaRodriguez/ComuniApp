import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ProfileScreen({ navigation }) {
    const [push, setPush] = React.useState(true);

    const onLogout = () => {
        Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Salir',
                style: 'destructive',
                onPress: () => navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] }),
            },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header simple con avatar */}
            <View style={styles.header}>
                <View style={styles.avatar}><Text style={{ fontSize: 28 }}>🧑🏽‍💻</Text></View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>Johnny Chavarría</Text>
                    <Text style={styles.email}>johnny@example.com</Text>
                </View>
                <Pressable onPress={() => navigation.navigate('EditProfile')}>
                    <Ionicons name="create-outline" size={22} color="#4F59F5" />
                </Pressable>
            </View>

            {/* Quick actions */}
            <View style={styles.card}>
                <Pressable style={styles.row} onPress={() => navigation.navigate('EditProfile')}>
                    <Ionicons name="person-circle-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Editar perfil</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.row} onPress={() => navigation.navigate('GroupRequests')}>
                    <Ionicons name="people-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Solicitudes de grupos</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.row} onPress={() => navigation.navigate('EventRequests')}>
                    <MaterialCommunityIcons name="calendar-clock" size={22} color="#173049" />
                    <Text style={styles.rowText}>Solicitudes de eventos</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Preferencias */}
            <Text style={styles.sectionTitle}>Preferencias</Text>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Ionicons name="notifications-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Notificaciones push</Text>
                    <Switch value={push} onValueChange={setPush} />
                </View>

                <Pressable style={styles.row} onPress={() => { }}>
                    <Ionicons name="shield-checkmark-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Privacidad</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable style={styles.row} onPress={() => { }}>
                    <Ionicons name="help-circle-outline" size={22} color="#173049" />
                    <Text style={styles.rowText}>Ayuda</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
            </View>

            {/* Logout */}
            <Pressable style={styles.logout} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
    avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    name: { fontSize: 18, fontWeight: '800', color: '#173049' },
    email: { color: '#6B7280' },
    sectionTitle: { marginTop: 18, marginBottom: 8, fontSize: 14, fontWeight: '800', color: '#6B7280' },
    card: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
    row: { paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    rowText: { flex: 1, color: '#173049', fontWeight: '600' },
    logout: { marginTop: 22, backgroundColor: '#EF4444', paddingVertical: 14, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
    logoutText: { color: '#fff', fontWeight: '800' },
});
