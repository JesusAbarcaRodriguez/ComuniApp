import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';

export default function ExploreScreen({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.navigate('Notifications', { variant: 'list' })}>
                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
                <View style={styles.chipsRow}>
                    {['Sports', 'Music', 'Food'].map((t, i) => (
                        <View key={i} style={[styles.chip, { backgroundColor: ['#FFE7E1', '#FFF1C9', '#E6F7EC'][i] }]}>
                            <Text style={{ fontWeight: '700' }}>{t}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Upcoming Events</Text>

                {/* Acción rápida: Crear grupo */}
                <Pressable
                    onPress={() => navigation.navigate('CreateGroup')}
                    style={{ alignSelf: 'flex-start', marginBottom: 10, backgroundColor: '#EEF2FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}
                >
                    <Text style={{ color: '#4F59F5', fontWeight: '700' }}>+ Create Group</Text>
                </Pressable>

                {/* Card placeholder (sin imágenes) */}
                <View style={styles.card}>
                    <View style={styles.cardThumb} />
                    <View style={{ padding: 12 }}>
                        <Text style={{ fontWeight: '800', fontSize: 16, color: '#173049' }}>Community Clean-up</Text>
                        <Text style={{ color: '#6B7280', marginTop: 4 }}>10 June · 9:00 AM</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                            <Text style={{ color: '#4F59F5', fontWeight: '700' }}>+20 Going</Text>
                            <Pressable onPress={() => navigation.navigate('EventDetails')}>
                                <Ionicons name="bookmark-outline" size={20} color="#4F59F5" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Nearby + FAB feeling */}
                <Text style={styles.sectionTitle}>Nearby You</Text>
                <View style={[styles.card, { height: 120 }]}>
                    <View style={[styles.cardThumb, { width: 120 }]} />
                    <View style={{ padding: 12, flex: 1, justifyContent: 'space-between' }}>
                        <Text style={{ fontWeight: '800', fontSize: 16, color: '#173049' }}>Pick-up Game</Text>
                        <PrimaryButton title="Details" icon="chevron-forward" onPress={() => navigation.navigate('EventDetails')} />
                    </View>
                </View>
            </ScrollView>

            {/* FAB */}
            <Pressable style={styles.fab} onPress={() => navigation.navigate('CreateEvent')}>
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { backgroundColor: '#4F59F5', paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    searchWrap: { backgroundColor: '#fff', marginTop: -20, marginHorizontal: 16, borderRadius: 14, paddingHorizontal: 12, height: 48, alignItems: 'center', flexDirection: 'row', gap: 8, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2 },
    filterBtn: { backgroundColor: '#EEF2FF', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row', alignItems: 'center' },
    chipsRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
    chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
    sectionTitle: { marginTop: 18, marginBottom: 8, fontSize: 18, fontWeight: '800', color: '#173049' },
    card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1, marginBottom: 12, flexDirection: 'row' },
    cardThumb: { backgroundColor: '#DDE3FF', height: 120, width: 140 },
    fab: { position: 'absolute', bottom: 24, alignSelf: 'center', backgroundColor: '#4F59F5', width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 4 },
});
