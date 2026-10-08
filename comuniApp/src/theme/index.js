// src/theme/index.js
// Design tokens: única fuente de verdad para colores, espaciado, tipografía, radios y sombras.
import { colors } from './colors';

// Escala de 4pt
export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
};

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
};

// Escala tipográfica: 6 variantes, nada fuera de aquí.
export const typography = {
    display: { fontSize: 28, lineHeight: 34, fontWeight: '800' },
    title: { fontSize: 22, lineHeight: 28, fontWeight: '800' },
    heading: { fontSize: 18, lineHeight: 24, fontWeight: '700' },
    body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
    label: { fontSize: 14, lineHeight: 20, fontWeight: '600' },
    caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
};

export const shadows = {
    sm: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    md: {
        shadowColor: colors.shadow,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
};

export const sizes = {
    control: 50,      // altura de inputs y botones
    controlSm: 36,
    touchTarget: 44,  // mínimo táctil recomendado (iOS HIG)
    icon: 20,
    iconSm: 16,
    avatar: 40,
    avatarLg: 56,
};

export { colors };

export const theme = { colors, spacing, radius, typography, shadows, sizes };
export default theme;
