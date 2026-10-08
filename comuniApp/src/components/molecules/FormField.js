// src/components/molecules/FormField.js
import React, { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText, Input } from '../atoms';
import { spacing } from '../../theme';

/** Label + Input + mensaje de error (o ayuda) debajo del campo. */
const FormField = forwardRef(function FormField({ label, error, hint, style, ...inputProps }, ref) {
    return (
        <View style={[styles.wrap, style]}>
            {label ? <AppText variant="label" tone="body">{label}</AppText> : null}
            <Input ref={ref} error={!!error} accessibilityLabel={label} {...inputProps} />
            {error ? (
                <AppText variant="caption" tone="danger" accessibilityLiveRegion="polite">{error}</AppText>
            ) : hint ? (
                <AppText variant="caption" tone="muted">{hint}</AppText>
            ) : null}
        </View>
    );
});

export default FormField;

const styles = StyleSheet.create({
    wrap: { gap: spacing.xs + spacing.xxs },
});
