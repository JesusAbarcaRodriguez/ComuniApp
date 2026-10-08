// src/components/templates/AuthTemplate.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AppText } from '../atoms';
import { spacing } from '../../theme';
import Screen from './Screen';

/** Layout de las pantallas de autenticación: logo, título, subtítulo, formulario y pie. */
export default function AuthTemplate({ title, subtitle, showLogo = true, children, footer, safeTop = true }) {
    return (
        <Screen keyboard centered safeTop={safeTop}>
            <View style={styles.container}>
                <View style={styles.head}>
                    {showLogo ? (
                        <Image
                            source={require('../../assets/comuniapp.png')}
                            style={styles.logo}
                            resizeMode="contain"
                            accessibilityIgnoresInvertColors
                            accessibilityLabel="ComuniApp"
                        />
                    ) : null}
                    {title ? <AppText variant="title" align="center" accessibilityRole="header">{title}</AppText> : null}
                    {subtitle ? <AppText variant="body" tone="secondary" align="center">{subtitle}</AppText> : null}
                </View>

                <View style={styles.form}>{children}</View>

                {footer ? <View style={styles.footer}>{footer}</View> : null}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    // ancho máximo para que en web/tablet no se estire el formulario
    container: { width: '100%', maxWidth: 420, alignSelf: 'center' },
    head: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xl },
    logo: { width: 120, height: 120, marginBottom: spacing.sm },
    form: { gap: spacing.lg },
    footer: { marginTop: spacing.xl, alignItems: 'center', gap: spacing.md },
});
