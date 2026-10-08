// src/screens/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthTemplate, AppText, Button, FormField, Icon } from '../../components';
import { useAuth } from '../../context/AuthProvider';
import { colors, radius, spacing } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const onSubmit = async () => {
        if (!email.trim()) return setError('Ingresa tu correo.');
        setError('');
        setLoading(true);
        try {
            const { error: err } = await resetPassword(email.trim());
            if (err) return setError(err.message);
            setSent(true);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <AuthTemplate showLogo={false} safeTop={false}>
                <View style={styles.success}>
                    <View style={styles.successIcon}>
                        <Icon name="paper-plane-outline" size={36} color={colors.primary} />
                    </View>
                    <AppText variant="title" align="center">Enlace enviado</AppText>
                    <AppText variant="body" tone="secondary" align="center">
                        Si {email.trim()} está registrado, recibirás un enlace para restablecer tu contraseña.
                    </AppText>
                </View>
                <Button title="Volver a iniciar sesión" onPress={() => navigation.goBack()} />
            </AuthTemplate>
        );
    }

    return (
        <AuthTemplate
            showLogo={false}
            safeTop={false}
            title="Recupera tu contraseña"
            subtitle="Te enviaremos un enlace para crear una nueva"
        >
            <FormField
                label="Correo electrónico"
                icon="mail-outline"
                placeholder="tu@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="send"
                onSubmitEditing={onSubmit}
                value={email}
                onChangeText={(t) => { setEmail(t); if (error) setError(''); }}
                error={error}
            />
            <Button title="Enviar enlace" icon="paper-plane-outline" onPress={onSubmit} loading={loading} />
        </AuthTemplate>
    );
}

const styles = StyleSheet.create({
    success: { alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
    successIcon: {
        width: 88,
        height: 88,
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
