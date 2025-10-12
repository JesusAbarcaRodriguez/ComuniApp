import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function SegmentedControl({ options = [], value, onChange }) {
    return (
        <View style={styles.wrapper}>
            {options.map(opt => {
                const active = value === opt.value;
                return (
                    <Pressable key={opt.value} onPress={() => onChange(opt.value)} style={[styles.item, active && styles.active]}>
                        <Text style={[styles.text, active && styles.textActive]}>{opt.label}</Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#F0F1F6',
        borderRadius: 24,
        padding: 3,
        flexDirection: 'row',
    },
    item: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    active: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
    text: { color: '#6B7280', fontWeight: '600' },
    textActive: { color: '#4F59F5' },
});
