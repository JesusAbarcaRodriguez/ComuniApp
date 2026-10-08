// src/components/atoms/Card.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radius, spacing, shadows } from '../../theme';

/** Contenedor con borde (por defecto) o sombra (`elevated`). `padded={false}` para listas con divisores. */
export default function Card({ children, elevated = false, padded = true, style }) {
    return (
        <View style={[styles.base, elevated ? shadows.sm : styles.bordered, padded && styles.padded, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: { backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden' },
    bordered: { borderWidth: 1, borderColor: colors.border },
    padded: { padding: spacing.md },
});
