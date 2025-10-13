// src/screens/auth/SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthProvider';

export default function SignUpScreen({ navigation }) {
    const { signUp } = useAuth();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!email || !password) return Alert.alert('Faltan datos', 'Ingresa email y contraseña');

        try {
            setLoading(true);
            const { error } = await signUp(email.trim(), password, displayName.trim());
            setLoading(false);

            if (error) return Alert.alert('Error', error.message);

            Alert.alert(
                'Revisa tu correo',
                'Hemos enviado un correo de verificación. Por favor confirma tu dirección y luego inicia sesión.',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (e) {
            setLoading(false);
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Create account</Text>

            <TextInput
                placeholder="Tu nombre"
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
            />

            <TextInput
                placeholder="Email"
                autoCapitalize="none"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />

            <Pressable style={styles.primary} onPress={onSubmit} disabled={loading}>
                <Text style={styles.primaryText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
            </Pressable>

            <Text style={{ color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
                Se enviará un correo de confirmación a {email || 'tu correo'}.
            </Text>
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
