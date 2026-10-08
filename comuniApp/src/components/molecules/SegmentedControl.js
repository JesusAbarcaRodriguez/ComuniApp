// src/components/molecules/SegmentedControl.js
import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from '../atoms';
import { colors, radius, shadows, spacing } from '../../theme';

export default function SegmentedControl({ options = [], value, onChange }) {
    return (
        <View style={styles.wrapper} accessibilityRole="tablist">
            {options.map((opt) => {
                const active = value === opt.value;
                return (
                    <Pressable
                        key={opt.value}
                        onPress={() => onChange(opt.value)}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        style={[styles.item, active && styles.active]}
                    >
                        <AppText variant="label" tone={active ? 'brand' : 'secondary'}>{opt.label}</AppText>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.surfaceSubtle,
        borderRadius: radius.pill,
        padding: spacing.xxs + 1,
        flexDirection: 'row',
    },
    item: { flex: 1, paddingVertical: spacing.sm + spacing.xxs, borderRadius: radius.pill, alignItems: 'center' },
    active: { backgroundColor: colors.surface, ...shadows.sm },
});
