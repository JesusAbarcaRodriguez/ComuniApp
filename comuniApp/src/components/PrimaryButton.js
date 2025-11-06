import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrimaryButton({ title, onPress, icon = 'arrow-forward' }) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [styles.btn, pressed && { opacity: 0.9 }]}>
            <Text style={styles.text}>{title}</Text>
            {icon ? <View style={styles.iconWrap}><Ionicons name={icon} size={18} color="#fff" /></View> : null}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: '#4F59F5',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    text: { color: '#fff', fontWeight: '700', fontSize: 16 },
    iconWrap: { backgroundColor: 'rgba(255,255,255,0.18)', padding: 6, borderRadius: 999 },
});
