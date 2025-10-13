import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthProvider';

export default function ForgotScreen() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmit = async () => {
        if (!email) return Alert.alert('Falta email', 'Ingresa tu correo');

        try {
            setLoading(true);
            const { error } = await resetPassword(email.trim());
            setLoading(false);

            if (error) return Alert.alert('Error', error.message);

            Alert.alert(
                'Enlace enviado',
                'Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.'
            );
        } catch (e) {
            setLoading(false);
            Alert.alert('Error', e.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Reset password</Text>
            <TextInput placeholder="Email" autoCapitalize="none" style={styles.input} value={email} onChangeText={setEmail} />
            <Pressable style={styles.primary} onPress={onSubmit} disabled={loading}>
                <Text style={styles.primaryText}>{loading ? 'Sending...' : 'Send link'}</Text>
            </Pressable>
            <Text style={{ color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
                Te enviaremos un enlace a {email || 'tu correo'} para restablecer la contraseña.
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
