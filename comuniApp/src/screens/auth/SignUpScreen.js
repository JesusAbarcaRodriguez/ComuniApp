// src/screens/auth/SignUpScreen.js
import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AuthTemplate, AppText, Button, FormField, Icon, PasswordField } from '../../components';
import { useAuth } from '../../context/AuthProvider';
import { colors, radius, spacing } from '../../theme';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpScreen({ navigation }) {
    const { signUp } = useAuth();
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sentTo, setSentTo] = useState('');

    const onSubmit = async () => {
        const next = {};
        if (!email.trim()) next.email = 'Ingresa tu correo.';
        else if (!EMAIL_RE.test(email.trim())) next.email = 'El correo no es válido.';
        if (!password) next.password = 'Ingresa una contraseña.';
        else if (password.length < 6) next.password = 'Debe tener al menos 6 caracteres.';
        setErrors(next);
        setFormError('');
        if (Object.keys(next).length) return;

        setLoading(true);
        try {
            const { error } = await signUp(email.trim(), password, displayName.trim());
            if (error) return setFormError(error.message);
            setSentTo(email.trim());
        } catch (e) {
            setFormError(e.message);
        } finally {
            setLoading(false);
        }
    };

    if (sentTo) {
        return (
            <AuthTemplate showLogo={false} safeTop={false}>
                <View style={styles.success}>
                    <View style={styles.successIcon}>
                        <Icon name="mail-unread-outline" size={40} color={colors.primary} />
                    </View>
                    <AppText variant="title" align="center">Revisa tu correo</AppText>
                    <AppText variant="body" tone="secondary" align="center">
                        Enviamos un enlace de verificación a <AppText variant="body" weight="700">{sentTo}</AppText>.
                        Confírmalo y luego inicia sesión.
                    </AppText>
                </View>
                <Button title="Ir a iniciar sesión" onPress={() => navigation.goBack()} />
            </AuthTemplate>
        );
    }

    return (
        <AuthTemplate
            showLogo={false}
            safeTop={false}
            title="Crea tu cuenta"
            subtitle="Únete a tu comunidad en menos de un minuto"
        >
            <FormField
                label="Nombre"
                icon="person-outline"
                placeholder="¿Cómo te llamas?"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                value={displayName}
                onChangeText={setDisplayName}
                hint="Así te verán los demás miembros."
            />
            <FormField
                ref={emailRef}
                label="Correo electrónico"
                icon="mail-outline"
                placeholder="tu@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                value={email}
                onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((e) => ({ ...e, email: undefined })); }}
                error={errors.email}
            />
            <PasswordField
                ref={passwordRef}
                label="Contraseña"
                icon="lock-closed-outline"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                onSubmitEditing={onSubmit}
                value={password}
                onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: undefined })); }}
                error={errors.password}
            />

            {formError ? (
                <View style={styles.formError} accessibilityRole="alert">
                    <AppText variant="caption" tone="danger">{formError}</AppText>
                </View>
            ) : null}

            <Button title="Crear cuenta" onPress={onSubmit} loading={loading} />
        </AuthTemplate>
    );
}

const styles = StyleSheet.create({
    formError: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm, padding: spacing.md },
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
