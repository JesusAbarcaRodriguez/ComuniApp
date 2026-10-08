// src/components/atoms/Avatar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import Icon from './Icon';
import { colors, radius, sizes } from '../../theme';

function initials(name = '') {
    return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('');
}

/** Avatar circular con iniciales o, si no hay nombre, un ícono de persona. */
export default function Avatar({ name, size = sizes.avatar }) {
    const text = initials(name);
    return (
        <View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.base, { width: size, height: size }]}
        >
            {text ? (
                <AppText variant={size >= sizes.avatarLg ? 'heading' : 'label'} tone="brand" weight="800">{text}</AppText>
            ) : (
                <Icon name="person" size={size * 0.5} color={colors.primary} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: radius.pill,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
