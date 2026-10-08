// src/components/organisms/GroupListItem.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Avatar, Badge, Button } from '../atoms';
import { colors, spacing } from '../../theme';

const ROLE_LABEL = { OWNER: 'Owner', ADMIN: 'Admin', MEMBER: 'Miembro' };

/**
 * Grupo en el selector. La acción depende del estado:
 * miembro → Entrar · solicitud pendiente → Solicitado · ninguno → Unirme
 */
export default function GroupListItem({ group, role, pending, joining, onSelect, onJoin }) {
    return (
        <View style={styles.row}>
            <Avatar name={group.name} />
            <View style={styles.text}>
                <AppText variant="body" weight="700" numberOfLines={1}>{group.name}</AppText>
                {role ? <Badge label={ROLE_LABEL[role] || role} tone="neutral" /> : null}
            </View>

            {role ? (
                <Button title="Entrar" variant="secondary" size="sm" icon="chevron-forward" iconPosition="right" onPress={onSelect} accessibilityLabel={`Entrar a ${group.name}`} />
            ) : pending ? (
                <Badge label="Solicitado" icon="time-outline" tone="neutral" style={styles.pending} />
            ) : (
                <Button title="Unirme" size="sm" icon="person-add-outline" loading={joining} onPress={onJoin} accessibilityLabel={`Unirme a ${group.name}`} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: colors.border,
    },
    text: { flex: 1, gap: spacing.xs },
    pending: { alignSelf: 'center' },
});
