// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthProvider';
import { ToastProvider } from './src/feedback';
import { colors } from './src/theme';

// En web initialWindowMetrics es null; sin métricas iniciales el provider no renderiza hasta medir.
const { width, height } = Dimensions.get('window');
const initialMetrics = initialWindowMetrics ?? {
    frame: { x: 0, y: 0, width, height },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const navigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.textPrimary,
        border: colors.border,
    },
};

export default function App() {
    return (
        <SafeAreaProvider initialMetrics={initialMetrics}>
            <AuthProvider>
                <ToastProvider>
                    <NavigationContainer theme={navigationTheme}>
                        <StatusBar style="dark" />
                        <RootNavigator />
                    </NavigationContainer>
                </ToastProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}
