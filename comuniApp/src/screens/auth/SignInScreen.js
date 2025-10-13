// src/screens/SignInScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthProvider'; // <-- ajusta si tu archivo se llama distinto

export default function SignInScreen({ navigation }) {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidden, setHidden] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSignIn = async () => {
        if (!email || !password) return Alert.alert('Faltan datos', 'Ingresa email y contraseña');
        setLoading(true);
        const { error } = await signIn(email.trim(), password);
        setLoading(false);
        if (error) return Alert.alert('Error', error.message);
        navigation.replace('SelectGroup');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.logoWrap}><Text style={{ fontSize: 42 }}>📅</Text></View>
                <Text style={styles.title}>ComuniApp</Text>

                {/* Email */}
                <View style={{ gap: 12, width: '100%' }}>
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
                            placeholder="Your password"
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

                {/* Forgot */}
                <View style={{ marginTop: 12, alignSelf: 'flex-end' }}>
                    <Pressable onPress={() => navigation.navigate('Forgot')}>
                        <Text style={{ color: '#6B7280' }}>Forgot Password?</Text>
                    </Pressable>
                </View>

                {/* Submit */}
                <PrimaryButton title={loading ? 'SIGNING IN...' : 'SIGN IN'} onPress={handleSignIn} disabled={loading} />

                {/* Sign up link */}
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Pressable onPress={() => navigation.navigate('SignUp')}>
                        <Text>
                            Don’t have an account?{' '}
                            <Text style={{ color: '#4F59F5', fontWeight: '700' }}>Sign up</Text>
                        </Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 24, justifyContent: 'center' },
    logoWrap: { alignSelf: 'center', width: 80, height: 80, borderRadius: 16, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    title: { textAlign: 'center', fontSize: 22, fontWeight: '800', color: '#173049', marginBottom: 22 },
    inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, paddingHorizontal: 12, height: 50, gap: 10 },
    input: { flex: 1 },
});
