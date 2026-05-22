import type { TavernTheme } from './theme-types.js';
import { importSTTheme } from './st-theme-importer.js';

// ---------------------------------------------------------------------------
// YdlTavern native themes (three original palettes)
// ---------------------------------------------------------------------------

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
    family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
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
    family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
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
    family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    sizeBase: '15px',
    sizeSm: '13px',
    sizeLg: '18px',
  },
  density: 'spacious',
};

// ---------------------------------------------------------------------------
// SillyTavern classic presets (imported through the ST theme JSON mapper)
// ---------------------------------------------------------------------------

/** Translated from SillyTavern/default/content/themes/Dark V 1.0.json */
export const ST_DARK_V1: TavernTheme = importSTTheme({
  name: 'Dark V 1.0',
  blur_strength: 13,
  main_text_color: 'rgba(207, 207, 197, 1)',
  italics_text_color: 'rgba(145, 145, 145, 1)',
  underline_text_color: 'rgba(145, 145, 145, 1)',
  quote_text_color: 'rgba(198, 193, 151, 1)',
  blur_tint_color: 'rgba(29, 33, 40, 0.9)',
  chat_tint_color: 'rgba(29, 33, 40, 0.9)',
  user_mes_blur_tint_color: 'rgba(29, 33, 40, 0.9)',
  bot_mes_blur_tint_color: 'rgba(29, 33, 40, 0.9)',
  shadow_color: 'rgba(0, 0, 0, 0.9)',
  shadow_width: 2,
  border_color: 'rgba(0, 0, 0, 1)',
  font_scale: 1,
  fast_ui_mode: false,
  waifuMode: false,
  avatar_style: 0,
  chat_display: 0,
  noShadows: false,
  chat_width: 55,
  timer_enabled: false,
});

/** Translated from SillyTavern/default/content/themes/Azure.json */
export const ST_AZURE: TavernTheme = importSTTheme({
  name: 'Azure',
  blur_strength: 11,
  main_text_color: 'rgba(171, 198, 223, 1)',
  italics_text_color: 'rgba(255, 255, 255, 1)',
  underline_text_color: 'rgba(188, 231, 207, 1)',
  quote_text_color: 'rgba(111, 133, 253, 1)',
  blur_tint_color: 'rgba(23, 30, 33, 0.61)',
  chat_tint_color: 'rgba(23, 23, 23, 0)',
  user_mes_blur_tint_color: 'rgba(0, 28, 174, 0.2)',
  bot_mes_blur_tint_color: 'rgba(0, 13, 57, 0.22)',
  shadow_color: 'rgba(0, 0, 0, 1)',
  shadow_width: 5,
  border_color: 'rgba(0, 0, 0, 0.5)',
  font_scale: 1,
  fast_ui_mode: false,
  waifuMode: false,
  avatar_style: 1,
  chat_display: 1,
  noShadows: false,
  chat_width: 50,
  timer_enabled: true,
});

/** Translated from SillyTavern/default/content/themes/Celestial Macaron.json */
export const ST_CELESTIAL_MACARON: TavernTheme = importSTTheme({
  name: 'Celestial Macaron',
  blur_strength: 10,
  main_text_color: 'rgba(229, 175, 162, 1)',
  italics_text_color: 'rgba(146, 147, 161, 1)',
  underline_text_color: 'rgba(157, 215, 198, 1)',
  quote_text_color: 'rgba(197, 202, 206, 1)',
  blur_tint_color: 'rgba(23, 36, 55, 0.9)',
  chat_tint_color: 'rgba(18, 26, 40, 0.9)',
  user_mes_blur_tint_color: 'rgba(51, 67, 90, 0.7)',
  bot_mes_blur_tint_color: 'rgba(23, 36, 55, 0.75)',
  shadow_color: 'rgba(0, 0, 0, 0.3)',
  shadow_width: 1,
  border_color: 'rgba(60, 74, 110, 0.93)',
  font_scale: 1,
  fast_ui_mode: false,
  waifuMode: false,
  avatar_style: 0,
  chat_display: 1,
  noShadows: true,
  chat_width: 58,
  timer_enabled: true,
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const BUILT_IN_THEMES: readonly TavernTheme[] = [
  DARK_THEME,
  LIGHT_THEME,
  PARCHMENT_THEME,
  ST_DARK_V1,
  ST_AZURE,
  ST_CELESTIAL_MACARON,
];

export function getThemeById(id: string): TavernTheme {
  const found = BUILT_IN_THEMES.find((t) => t.name === id);
  return found ?? DARK_THEME;
}
