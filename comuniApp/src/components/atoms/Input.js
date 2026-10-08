// src/components/atoms/Input.js
import React, { forwardRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from './Icon';
import { colors, radius, sizes, spacing, typography } from '../../theme';

/** Campo de texto base: borde, foco, error, ícono a la izquierda y slot a la derecha. */
const Input = forwardRef(function Input(
    { icon, right, error = false, multiline = false, editable = true, style, inputStyle, onFocus, onBlur, ...rest },
    ref
) {
    const [focused, setFocused] = useState(false);

    return (
        <View
            style={[
                styles.wrap,
                multiline && styles.multiline,
                focused && styles.focused,
                error && styles.error,
                !editable && styles.readOnly,
                style,
            ]}
        >
            {icon ? <Icon name={icon} size={sizes.icon} color={colors.textMuted} /> : null}
            <TextInput
                ref={ref}
                placeholderTextColor={colors.textMuted}
                multiline={multiline}
                editable={editable}
                textAlignVertical={multiline ? 'top' : 'center'}
                onFocus={(e) => { setFocused(true); onFocus?.(e); }}
                onBlur={(e) => { setFocused(false); onBlur?.(e); }}
                style={[styles.input, !editable && { color: colors.textSecondary }, inputStyle]}
                {...rest}
            />
            {right}
        </View>
    );
});

export default Input;

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        minHeight: sizes.control,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    multiline: { minHeight: 110, alignItems: 'flex-start', paddingVertical: spacing.md },
    focused: { borderColor: colors.primary },
    error: { borderColor: colors.danger },
    readOnly: { backgroundColor: colors.surfaceMuted },
    input: {
        flex: 1,
        alignSelf: 'stretch',
        fontSize: typography.body.fontSize,
        color: colors.textPrimary,
        // quita el contorno azul del navegador en web
        outlineStyle: 'none',
    },
});
