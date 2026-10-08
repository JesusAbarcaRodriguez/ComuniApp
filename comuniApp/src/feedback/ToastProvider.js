// src/feedback/ToastProvider.js
// Avisos breves no bloqueantes. Reemplazan a Alert.alert para éxitos y errores no críticos.
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, Icon } from '../components/atoms';
import { colors, radius, shadows, spacing } from '../theme';

const ToastContext = createContext({ show: () => {} });

const TYPES = {
    success: { icon: 'checkmark-circle', color: colors.success },
    error: { icon: 'alert-circle', color: colors.danger },
    info: { icon: 'information-circle', color: colors.primary },
};

const DURATION = 2800;

export function ToastProvider({ children }) {
    const insets = useSafeAreaInsets();
    const [toast, setToast] = useState(null);
    const anim = useRef(new Animated.Value(0)).current;
    const timer = useRef(null);

    const hide = useCallback(() => {
        Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setToast(null));
    }, [anim]);

    const show = useCallback((message, type = 'success') => {
        clearTimeout(timer.current);
        setToast({ message, type, key: Date.now() });
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
        timer.current = setTimeout(hide, DURATION);
    }, [anim, hide]);

    useEffect(() => () => clearTimeout(timer.current), []);

    const t = toast ? TYPES[toast.type] || TYPES.info : null;

    return (
        <ToastContext.Provider value={{ show }}>
            {children}
            {toast ? (
                <View pointerEvents="none" style={[styles.host, { top: insets.top + spacing.sm }]}>
                    <Animated.View
                        accessibilityLiveRegion="polite"
                        accessibilityRole="alert"
                        style={[
                            styles.toast,
                            {
                                opacity: anim,
                                transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
                            },
                        ]}
                    >
                        <Icon name={t.icon} color={t.color} />
                        <AppText variant="label" style={styles.text}>{toast.message}</AppText>
                    </Animated.View>
                </View>
            ) : null}
        </ToastContext.Provider>
    );
}

/** const toast = useToast(); toast.success('Guardado'); toast.error(e.message); */
export function useToast() {
    const { show } = useContext(ToastContext);
    return {
        success: (msg) => show(msg, 'success'),
        error: (msg) => show(msg, 'error'),
        info: (msg) => show(msg, 'info'),
    };
}

const styles = StyleSheet.create({
    host: { position: 'absolute', left: spacing.lg, right: spacing.lg, alignItems: 'center' },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        maxWidth: 480,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    text: { flexShrink: 1 },
});
