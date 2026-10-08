// src/components/molecules/PasswordField.js
import React, { forwardRef, useState } from 'react';
import { IconButton } from '../atoms';
import { colors } from '../../theme';
import FormField from './FormField';

/** FormField de contraseña con botón para mostrar/ocultar. */
const PasswordField = forwardRef(function PasswordField(props, ref) {
    const [hidden, setHidden] = useState(true);
    return (
        <FormField
            ref={ref}
            secureTextEntry={hidden}
            autoCapitalize="none"
            autoCorrect={false}
            right={
                <IconButton
                    icon={hidden ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textMuted}
                    onPress={() => setHidden((h) => !h)}
                    accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                    style={{ marginRight: -10 }}
                />
            }
            {...props}
        />
    );
});

export default PasswordField;
