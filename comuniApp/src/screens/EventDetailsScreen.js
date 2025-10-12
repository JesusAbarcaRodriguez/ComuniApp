import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailsScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* header ilustración reemplazada por bloque */}
            <View style={styles.hero} />
            <View style={{ padding: 16 }}>
                {/* going + invite */}
                <View style={styles.row}>
                    <View style={styles.goingPills}><Text style={{ fontWeight: '700' }}>+20 Going</Text></View>
                    <View style={styles.invite}><Text style={{ color: '#4F59F5', fontWeight: '700' }}>Invite</Text></View>
                </View>

                <Text style={styles.title}>Basketball classes</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoIcon}><Ionicons name="calendar-outline" size={18} color="#4F59F5" /></View>
                    <View>
                        <Text style={styles.infoStrong}>10th July, 2025</Text>
                        <Text style={styles.infoSub}>7:00 AM</Text>
                    </View>
                </View>

                <View style={styles.infoRow}>
                    <View style={styles.infoIcon}><Ionicons name="location-outline" size={18} color="#4F59F5" /></View>
                    <Text style={styles.infoStrong}>Bolivia Platanare s Sports Square</Text>
                </View>

                <View style={{ marginTop: 24 }}>
                    <PrimaryButton title="Join" icon="arrow-forward" onPress={() => { }} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: { height: 160, backgroundColor: '#4F59F5' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -24 },
    goingPills: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 1 },
    invite: { backgroundColor: '#EEF2FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 14 },
    title: { marginTop: 18, fontSize: 26, fontWeight: '800', color: '#173049' },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16 },
    infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center' },
    infoStrong: { fontWeight: '700', color: '#173049' },
    infoSub: { color: '#6B7280', marginTop: 2 },
});
