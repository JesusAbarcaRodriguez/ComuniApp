// src/screens/auth/SignInScreen.js
import React, { useRef, useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AuthTemplate, AppText, Button, FormField, PasswordField } from '../../components';
import { useAuth } from '../../context/AuthProvider';
import { colors, radius, spacing } from '../../theme';

function friendlyAuthError(error) {
    const msg = (error?.message || '').toLowerCase();
    if (error?.status === 400 || msg.includes('invalid login credentials'))
        return 'Correo o contraseña incorrectos.';
    if (msg.includes('confirm') || msg.includes('verified') || msg.includes('verificar') || msg.includes('confirmado'))
        return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.';
    if (msg.includes('failed to fetch') || msg.includes('network'))
        return 'No hay conexión con el servidor. Revisa tu internet.';
    return error?.message || 'No se pudo iniciar sesión.';
}

export default function SignInScreen({ navigation }) {
    const { signIn } = useAuth();
    const passwordRef = useRef(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        const next = {};
        if (!email.trim()) next.email = 'Ingresa tu correo.';
        if (!password) next.password = 'Ingresa tu contraseña.';
        setErrors(next);
        setFormError('');
        if (Object.keys(next).length) return;

        setLoading(true);
        try {
            const { error } = await signIn(email.trim(), password);
            if (error) return setFormError(friendlyAuthError(error));
            navigation.replace('SelectGroup');
        } catch (e) {
            setFormError(friendlyAuthError(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthTemplate
            title="Bienvenido de nuevo"
            subtitle="Inicia sesión para ver los eventos de tu comunidad"
            footer={
                <>
                    <Pressable onPress={() => navigation.navigate('SignUp')} accessibilityRole="link" hitSlop={8}>
                        <AppText variant="body" tone="secondary">
                            ¿No tienes cuenta? <AppText variant="body" tone="brand" weight="700">Regístrate</AppText>
                        </AppText>
                    </Pressable>
                    <AppText variant="caption" tone="muted" align="center">
                        ¿No te llegó el correo de verificación? Revisa tu carpeta de spam.
                    </AppText>
                </>
            }
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
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                value={email}
                onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((e) => ({ ...e, email: undefined })); }}
                error={errors.email}
            />

            <View style={styles.passwordBlock}>
                <PasswordField
                    ref={passwordRef}
                    label="Contraseña"
                    icon="lock-closed-outline"
                    placeholder="Tu contraseña"
                    autoComplete="password"
                    textContentType="password"
                    returnKeyType="go"
                    onSubmitEditing={handleSignIn}
                    value={password}
                    onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((e) => ({ ...e, password: undefined })); }}
                    error={errors.password}
                />
                <Pressable
                    onPress={() => navigation.navigate('Forgot')}
                    accessibilityRole="link"
                    hitSlop={8}
                    style={styles.forgot}
                >
                    <AppText variant="label" tone="brand">¿Olvidaste tu contraseña?</AppText>
                </Pressable>
            </View>

            {formError ? (
                <View style={styles.formError} accessibilityRole="alert" accessibilityLiveRegion="polite">
                    <AppText variant="caption" tone="danger">{formError}</AppText>
                </View>
            ) : null}

            <Button title="Iniciar sesión" icon="arrow-forward" iconPosition="right" onPress={handleSignIn} loading={loading} />
        </AuthTemplate>
    );
}

const styles = StyleSheet.create({
    passwordBlock: { gap: spacing.md },
    forgot: { alignSelf: 'flex-end' },
    formError: {
        backgroundColor: colors.dangerSoft,
        borderRadius: radius.sm,
        padding: spacing.md,
    },
});
