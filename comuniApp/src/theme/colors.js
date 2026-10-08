// src/theme/colors.js
// Paleta base (no usar directo en componentes) + tokens semánticos (usar estos).

const palette = {
    indigo50: '#EEF2FF',
    indigo100: '#DDE3FF',
    indigo500: '#4F59F5',
    indigo600: '#3F48D9',

    navy900: '#173049',

    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray700: '#374151',

    red50: '#FEF2F2',
    red100: '#FEE2E2',
    red500: '#EF4444',

    green50: '#ECFDF5',
    green500: '#10B981',

    white: '#FFFFFF',
    black: '#000000',
};

export const colors = {
    primary: palette.indigo500,
    primaryPressed: palette.indigo600,
    primarySoft: palette.indigo50,
    primaryMuted: palette.indigo100,
    onPrimary: palette.white,

    background: palette.white,
    surface: palette.white,
    surfaceMuted: palette.gray50,
    surfaceSubtle: palette.gray100,

    textPrimary: palette.navy900,
    textSecondary: palette.gray500,
    textMuted: palette.gray400,
    textBody: palette.gray700,

    border: palette.gray200,
    divider: palette.gray100,

    danger: palette.red500,
    dangerSoft: palette.red50,
    dangerMuted: palette.red100,

    success: palette.green500,
    successSoft: palette.green50,

    overlay: 'rgba(0,0,0,0.25)',
    shadow: palette.black,
};
