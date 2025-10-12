import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Switch, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';

export default function SignInScreen({ navigation }) {
    const [remember, setRemember] = useState(true);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.logoWrap}><Text style={{ fontSize: 42 }}>📅</Text></View>
                <Text style={styles.title}>ComuniApp</Text>

                <View style={{ gap: 12, width: '100%' }}>
                    <View style={styles.inputWrap}>
                        <AntDesign name="mail" size={18} color="#9CA3AF" />
                        <TextInput placeholder="abc@email.com" style={styles.input} keyboardType="email-address" />
                    </View>
                    <View style={styles.inputWrap}>
                        <FontAwesome name="lock" size={20} color="#9CA3AF" />
                        <TextInput placeholder="Your password" style={styles.input} secureTextEntry />
                        <Ionicons name="eye-off" size={18} color="#9CA3AF" />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.row}>
                        <Switch value={remember} onValueChange={setRemember} />
                        <Text style={{ marginLeft: 8, color: '#374151' }}>Remember Me</Text>
                    </View>
                    <Pressable><Text style={{ color: '#6B7280' }}>Forgot Password?</Text></Pressable>
                </View>

                <PrimaryButton title="SIGN IN" onPress={() => navigation.replace('SelectGroup')} />

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ color: '#9CA3AF' }}>OR</Text>
                    <View style={styles.socialRow}>
                        <Pressable style={styles.socialBtn}><AntDesign name="google" size={20} color="#fff" /><Text style={styles.socialText}>Login with Google</Text></Pressable>
                        <Pressable style={[styles.socialBtn, { backgroundColor: '#1877F2' }]}><AntDesign name="facebook-square" size={20} color="#fff" /><Text style={styles.socialText}>Login with Facebook</Text></Pressable>
                    </View>
                    <Pressable style={{ marginTop: 10 }}>
                        <Text>Don’t have an account? <Text style={{ color: '#4F59F5', fontWeight: '700' }}>Sign up</Text></Text>
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
    row: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    socialRow: { width: '100%', gap: 10, marginTop: 12 },
    socialBtn: { backgroundColor: '#111827', paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, gap: 8 },
    socialText: { color: '#fff', fontWeight: '700' },
});
