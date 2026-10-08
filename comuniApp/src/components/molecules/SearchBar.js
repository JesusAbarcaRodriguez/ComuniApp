// src/components/molecules/SearchBar.js
import React from 'react';
import { IconButton, Input } from '../atoms';
import { colors } from '../../theme';

/** Input de búsqueda con botón para limpiar. */
export default function SearchBar({ value, onChangeText, placeholder = 'Buscar...', style }) {
    return (
        <Input
            icon="search"
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            accessibilityLabel={placeholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            style={style}
            right={
                value ? (
                    <IconButton
                        icon="close-circle"
                        size={18}
                        color={colors.textMuted}
                        onPress={() => onChangeText('')}
                        accessibilityLabel="Limpiar búsqueda"
                        style={{ marginRight: -10 }}
                    />
                ) : null
            }
        />
    );
}
