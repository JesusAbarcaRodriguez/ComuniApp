import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const t = setTimeout(() => navigation.replace('SignIn'), 900);
        return () => clearTimeout(t);
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoCircle}><Text style={styles.logoEmoji}>📅</Text></View>
            <Text style={styles.appName}>ComuniApp</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
    logoCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#E9ECFF', alignItems: 'center', justifyContent: 'center' },
    logoEmoji: { fontSize: 44 },
    appName: { marginTop: 12, fontSize: 22, fontWeight: '700', color: '#173049' },
});
