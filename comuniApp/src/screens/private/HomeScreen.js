// src/screens/app/HomeScreen.js
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthProvider';

export default function HomeScreen({ navigation }) {
    const { user, signOut } = useAuth();
    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Hola {user?.email}</Text>
            <Pressable style={styles.btn} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.btnText}>Ir a Perfil</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.danger]} onPress={signOut}>
                <Text style={styles.btnText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    h1: { fontSize: 22, fontWeight: '800', marginBottom: 16 },
    btn: { backgroundColor: '#4F59F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
    danger: { backgroundColor: '#EF4444' },
    btnText: { color: '#fff', fontWeight: '700' },
});
