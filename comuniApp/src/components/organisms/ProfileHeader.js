// src/components/organisms/ProfileHeader.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Avatar, Badge } from '../atoms';
import { sizes, spacing } from '../../theme';

export default function ProfileHeader({ name, email, groupName }) {
    return (
        <View style={styles.wrap}>
            <Avatar name={name} size={sizes.avatarLg + spacing.xl} />
            <AppText variant="title" align="center" numberOfLines={1}>{name || 'Sin nombre'}</AppText>
            <AppText variant="caption" tone="secondary" align="center" numberOfLines={1}>{email}</AppText>
            <Badge
                icon="people-outline"
                tone={groupName ? 'brand' : 'neutral'}
                label={groupName ? groupName : 'Sin grupo por defecto'}
                style={styles.badge}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xl },
    badge: { alignSelf: 'center', marginTop: spacing.sm },
});
