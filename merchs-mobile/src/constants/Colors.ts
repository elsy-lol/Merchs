/**
 * src/constants/Colors.ts
 * Theme constants matching the web project's aesthetics.
 */

const tintColorLight = '#ff006e';
const tintColorDark = '#ff006e';

export const Colors = {
  light: {
    text: '#09090b',
    textSecondary: '#3f3f46',
    textMuted: '#71717a',
    background: '#ffffff',
    bgSecondary: '#f1f1f4',
    bgTertiary: '#e2e2e7',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    border: '#d4d4d8',
    accent: '#ff006e',
    accentPurple: '#8338ec',
    success: '#10b981',
    error: '#ef4444',
  },
  dark: {
    text: '#fafafa',
    textSecondary: '#a1a1aa',
    textMuted: '#52525b',
    background: '#09090b',
    bgSecondary: '#121214',
    bgTertiary: '#1c1c1f',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    border: '#27272a',
    accent: '#ff006e',
    accentPurple: '#8338ec',
    success: '#10b981',
    error: '#ef4444',
  },
};
