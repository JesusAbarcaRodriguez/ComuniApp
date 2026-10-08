// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { AppText } from '../components';
import { colors, spacing } from '../theme';

export default function SplashScreen({ navigation }) {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(anim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
        const t = setTimeout(() => navigation.replace('SignIn'), 900);
        return () => clearTimeout(t);
    }, [navigation, anim]);

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    alignItems: 'center',
                    opacity: anim,
                    transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
                }}
            >
                <Image
                    source={require('../assets/comuniapp.png')}
                    style={styles.logo}
                    resizeMode="contain"
                    accessibilityLabel="ComuniApp"
                />
                <AppText variant="display">ComuniApp</AppText>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    logo: { width: 120, height: 120, marginBottom: spacing.lg },
});
