import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SegmentedControl from '../components/SegmentedControl';
import PrimaryButton from '../components/PrimaryButton';

export default function EventsScreen({ navigation }) {
    const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past'

    return (
        <View style={styles.container}>
            <SegmentedControl
                value={tab}
                onChange={setTab}
                options={[
                    { label: 'UPCOMING', value: 'upcoming' },
                    { label: 'PAST EVENTS', value: 'past' },
                ]}
            />

            {tab === 'upcoming' ? (
                <View style={styles.emptyWrap}>
                    <View style={styles.illustration} />
                    <Text style={styles.title}>No Upcoming Event</Text>
                    <Text style={styles.subtitle}>Lorem ipsum dolor sit amet, consectetur</Text>
                    <View style={{ marginTop: 20 }}>
                        <PrimaryButton title="EXPLORE EVENTS" onPress={() => navigation.navigate('Explore')} icon="arrow-forward" />
                    </View>
                </View>
            ) : (
                <View style={styles.emptyWrap}>
                    <View style={[styles.illustration, { backgroundColor: '#FFEDE3' }]} />
                    <Text style={styles.title}>No Past Events</Text>
                    <Text style={styles.subtitle}>Your history will appear here</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
    illustration: { width: 180, height: 180, borderRadius: 90, backgroundColor: '#E9ECFF', marginBottom: 16 },
    title: { fontSize: 20, fontWeight: '800', color: '#173049', marginTop: 8 },
    subtitle: { color: '#6B7280', textAlign: 'center', marginTop: 8 },
});
