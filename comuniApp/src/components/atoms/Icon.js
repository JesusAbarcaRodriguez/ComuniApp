// src/components/atoms/Icon.js
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors, sizes } from '../../theme';

/** Una sola familia de íconos (Ionicons) en toda la app. */
export default function Icon({ name, size = sizes.icon, color = colors.textPrimary, style }) {
    return <Ionicons name={name} size={size} color={color} style={style} />;
}
