import type { TavernTheme } from './theme-types.js';

export const DARK_THEME: TavernTheme = {
  name: 'dark',
  tokens: {
    bgPrimary: '#0b0d12',
    bgSecondary: '#11141b',
    bgTertiary: '#07080c',
    fgPrimary: '#e7eaf2',
    fgSecondary: '#b6bccd',
    fgMuted: '#7d8499',
    accentPrimary: '#e6b15c',
    accentHover: '#f1c98a',
    userBubble: '#9aa3ff',
    assistantBubble: '#e6b15c',
    systemBubble: '#5ac8d8',
    border: '#232a39',
    shadow: '#0b0d12',
  },
  font: {
    family: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    sizeBase: '15px',
    sizeSm: '13px',
    sizeLg: '18px',
  },
  density: 'comfortable',
};

export const LIGHT_THEME: TavernTheme = {
  name: 'light',
  tokens: {
    bgPrimary: '#f8f9fc',
    bgSecondary: '#ffffff',
    bgTertiary: '#f0f2f6',
    fgPrimary: '#1a1d26',
    fgSecondary: '#4a4e5c',
    fgMuted: '#8b90a0',
    accentPrimary: '#c9952e',
    accentHover: '#a87a20',
    userBubble: '#6b74d9',
    assistantBubble: '#c9952e',
    systemBubble: '#1a8a99',
    border: '#d4d8e0',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  font: {
    family: '"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    sizeBase: '15px',
    sizeSm: '13px',
    sizeLg: '18px',
  },
  density: 'comfortable',
};

export const PARCHMENT_THEME: TavernTheme = {
  name: 'parchment',
  tokens: {
    bgPrimary: '#f5efe0',
    bgSecondary: '#faf6ed',
    bgTertiary: '#ede5d0',
    fgPrimary: '#2c2416',
    fgSecondary: '#5e5340',
    fgMuted: '#9a8f78',
    accentPrimary: '#a8651e',
    accentHover: '#8a5216',
    userBubble: '#5b4c92',
    assistantBubble: '#a8651e',
    systemBubble: '#3a7a6a',
    border: '#d6cdb8',
    shadow: 'rgba(0, 0, 0, 0.06)',
  },
  font: {
    family: '"Fraunces", "Iowan Old Style", Georgia, serif',
    sizeBase: '15px',
    sizeSm: '13px',
    sizeLg: '18px',
  },
  density: 'spacious',
};

export const BUILT_IN_THEMES: readonly TavernTheme[] = [
  DARK_THEME,
  LIGHT_THEME,
  PARCHMENT_THEME,
];

export function getThemeById(id: string): TavernTheme {
  const found = BUILT_IN_THEMES.find((t) => t.name === id);
  return found ?? DARK_THEME;
}
