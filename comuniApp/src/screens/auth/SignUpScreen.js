// src/screens/auth/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthProvider';

export default function SignUpScreen({ navigation }) {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = async () => {
        if (!email || !password) return Alert.alert('Faltan datos', 'Ingresa email y contraseña');
        const { error } = await signUp(email.trim(), password);
        if (error) return Alert.alert('Error', error.message);
        Alert.alert('Listo', 'Revisa tu correo para confirmar (si el proyecto lo requiere).');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Create account</Text>
            <TextInput placeholder="Email" autoCapitalize="none" style={styles.input} value={email} onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />
            <Pressable style={styles.primary} onPress={onSubmit}><Text style={styles.primaryText}>Sign Up</Text></Pressable>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    h1: { fontSize: 24, fontWeight: '800', marginBottom: 14, color: '#111827' },
    input: { height: 48, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, marginBottom: 10 },
    primary: { backgroundColor: '#4F59F5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 6 },
    primaryText: { color: '#fff', fontWeight: '700' },
});
