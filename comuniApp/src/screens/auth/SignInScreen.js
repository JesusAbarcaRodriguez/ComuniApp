// src/screens/auth/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthProvider';

function friendlyAuthError(error) {
    const msg = (error?.message || '').toLowerCase();
    if (error?.status === 400 || msg.includes('invalid login credentials'))
        return 'Correo o contraseña inválidos.';
    if (msg.includes('confirm') || msg.includes('verified') || msg.includes('verificar') || msg.includes('confirmado'))
        return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada y completa la verificación.';
    return error?.message || 'No se pudo iniciar sesión.';
}

export default function SignInScreen({ navigation }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) return Alert.alert('Faltan datos', 'Ingresa email y contraseña');

        try {
            setLoading(true);
            const { error } = await signIn(email.trim(), password);
            setLoading(false);

            if (error) {
                return Alert.alert('Error', friendlyAuthError(error));
            }

            navigation.replace('SelectGroup'); // éxito
        } catch (e) {
            setLoading(false);
            Alert.alert('Error', e.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.container}
                >
                <Image
                    source={require('../../assets/comuniapp.png')}
                    style={styles.logoImage}
                    resizeMode="contain"
                />

                <View style={{ gap: 12, width: '100%' }}>
                    {/* Email */}
                    <View style={styles.inputWrap}>
                        <AntDesign name="mail" size={18} color="#9CA3AF" />
                        <TextInput
                            placeholder="abc@email.com"
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password */}
                    <View style={styles.inputWrap}>
                        <FontAwesome name="lock" size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Tu contraseña"
                            style={styles.input}
                            secureTextEntry={hidden}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <Pressable onPress={() => setHidden(!hidden)} hitSlop={8}>
                            <Ionicons name={hidden ? 'eye-off' : 'eye'} size={18} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                <View style={{ marginTop: 12, alignSelf: 'flex-end' }}>
                    <Pressable onPress={() => navigation.navigate('Forgot')}>
                        <Text style={{ color: '#6B7280' }}>¿Olvidaste tu contraseña?</Text>
                    </Pressable>
                </View>

                <PrimaryButton title={loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'} onPress={handleSignIn} disabled={loading} />

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Pressable onPress={() => navigation.navigate('SignUp')}>
                        <Text>
                            ¿No tienes cuenta? <Text style={{ color: '#4F59F5', fontWeight: '700' }}>Regístrate</Text>
                        </Text>
                    </Pressable>
                </View>

                <Text style={{ color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}>
                    ¿No te llegó el correo? Revisa SPAM o solicita otro desde "Recuperar contraseña".
                </Text>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',   // centra verticalmente
        alignItems: 'center',       // centra horizontalmente ✅
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: '800',
        color: '#173049',
        marginBottom: 22
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        gap: 10,
        width: '100%',              // aseguramos que los inputs sigan tomando todo el ancho
    },
    input: { flex: 1 },
    logoImage: {
        width: 140,
        height: 140,
        marginBottom: 20,
    },
});

