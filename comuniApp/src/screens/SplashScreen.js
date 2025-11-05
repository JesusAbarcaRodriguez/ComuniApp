import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const t = setTimeout(() => navigation.replace('SignIn'), 900);
        return () => clearTimeout(t);
    }, [navigation]);

    return (
        <View style={styles.container}>
            {/* Imagen del logo */}
            <Image
                source={require('../assets/comuniapp.png')}
                style={styles.logoImage}
                resizeMode="contain"
            />
            <Text style={styles.appName}>ComuniApp</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: 120, // ajusta según el tamaño que quieras
        height: 120,
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#173049',
    },
});
