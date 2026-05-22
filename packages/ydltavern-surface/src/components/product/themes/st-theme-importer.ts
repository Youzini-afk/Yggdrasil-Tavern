import type { TavernTheme, TavernThemeTokens, TavernThemeFlags } from './theme-types.js';

/**
 * SillyTavern theme JSON shape (flat object).
 * @see SillyTavern/default/content/themes/*.json
 */
export interface STThemeJson {
  name: string;
  blur_strength?: number;
  main_text_color?: string;
  italics_text_color?: string;
  underline_text_color?: string;
  quote_text_color?: string;
  blur_tint_color?: string;
  chat_tint_color?: string;
  user_mes_blur_tint_color?: string;
  bot_mes_blur_tint_color?: string;
  shadow_color?: string;
  shadow_width?: number;
  border_color?: string;
  font_scale?: number;
  fast_ui_mode?: boolean;
  waifuMode?: boolean;
  avatar_style?: number;
  chat_display?: number;
  noShadows?: boolean;
  chat_width?: number;
  timer_enabled?: boolean;
}

/**
 * Convert a ST theme JSON blob into a YdlTavern TavernTheme.
 *
 * ST themes are flat objects that map directly onto CSS custom properties.
 * YdlTavern uses a nested token object. This function maps the flat fields.
 *
 * The original ST `name` field becomes both `name` and `label` (via id).
 * All missing fields fall back to ST's own factory defaults.
 */
export function importSTTheme(stJson: STThemeJson): TavernTheme {
  const tokens: TavernThemeTokens = {
    bgPrimary: stJson.blur_tint_color ?? 'rgba(23, 23, 23, 1)',
    bgSecondary: stJson.chat_tint_color ?? 'rgba(23, 23, 23, 1)',
    bgTertiary: stJson.blur_tint_color ?? 'rgba(23, 23, 23, 1)',
    fgPrimary: stJson.main_text_color ?? 'rgb(220, 220, 210)',
    fgSecondary: stJson.italics_text_color ?? 'rgb(145, 145, 145)',
    fgMuted: stJson.italics_text_color ?? 'rgb(145, 145, 145)',
    accentPrimary: stJson.quote_text_color ?? 'rgb(225, 138, 36)',
    accentHover: stJson.quote_text_color ?? 'rgb(225, 138, 36)',
    userBubble: stJson.user_mes_blur_tint_color ?? 'rgba(0, 0, 0, 0.3)',
    assistantBubble: stJson.bot_mes_blur_tint_color ?? 'rgba(60, 60, 60, 0.3)',
    systemBubble: stJson.italics_text_color ?? 'rgb(145, 145, 145)',
    border: stJson.border_color ?? 'rgba(0, 0, 0, 0.5)',
    shadow: stJson.shadow_color ?? 'rgba(0, 0, 0, 0.5)',
    // New ST-aligned tokens
    bodyColor: stJson.main_text_color ?? 'rgb(220, 220, 210)',
    emColor: stJson.italics_text_color ?? 'rgb(145, 145, 145)',
    underlineColor: stJson.underline_text_color ?? 'rgb(188, 231, 207)',
    quoteColor: stJson.quote_text_color ?? 'rgb(225, 138, 36)',
    blurTint: stJson.blur_tint_color ?? 'rgba(23, 23, 23, 1)',
    chatTint: stJson.chat_tint_color ?? 'rgba(23, 23, 23, 1)',
    userMesTint: stJson.user_mes_blur_tint_color ?? 'rgba(0, 0, 0, 0.3)',
    botMesTint: stJson.bot_mes_blur_tint_color ?? 'rgba(60, 60, 60, 0.3)',
    shadowColor: stJson.shadow_color ?? 'rgba(0, 0, 0, 0.5)',
    borderColor: stJson.border_color ?? 'rgba(0, 0, 0, 0.5)',
    blurStrength: stJson.blur_strength ?? 10,
    fontScale: stJson.font_scale ?? 1,
  };

  const flags: TavernThemeFlags = {
    fastUiMode: stJson.fast_ui_mode ?? false,
    waifuMode: stJson.waifuMode ?? false,
    noShadows: stJson.noShadows ?? false,
    avatarStyle: stJson.avatar_style ?? 0,
    chatDisplay: stJson.chat_display ?? 0,
    chatWidth: stJson.chat_width ?? 50,
    timerEnabled: stJson.timer_enabled ?? false,
  };

  return {
    name: slugify(stJson.name),
    label: stJson.name,
    tokens,
    font: {
      family: '"Noto Sans", "Inter", ui-sans-serif, system-ui, sans-serif',
      sizeBase: `${(stJson.font_scale ?? 1) * 15}px`,
      sizeSm: `${(stJson.font_scale ?? 1) * 13}px`,
      sizeLg: `${(stJson.font_scale ?? 1) * 18}px`,
    },
    density: 'comfortable',
    flags,
    classic: true,
  };
}

/**
 * Convert a YdlTavern TavernTheme back into an STThemeJson blob.
 *
 * This is a best-effort round-trip. Tokens from non-ST themes may be mapped
 * as-is without ST-specific values for missing fields.
 */
export function exportSTTheme(theme: TavernTheme): STThemeJson {
  const t = theme.tokens;
  const f = theme.flags;
  return {
    name: theme.label ?? theme.name,
    main_text_color: t.bodyColor ?? t.fgPrimary,
    italics_text_color: t.emColor ?? t.fgSecondary,
    underline_text_color: t.underlineColor,
    quote_text_color: t.quoteColor ?? t.accentPrimary,
    blur_tint_color: t.blurTint ?? t.bgPrimary,
    chat_tint_color: t.chatTint ?? t.bgSecondary,
    user_mes_blur_tint_color: t.userMesTint ?? t.userBubble,
    bot_mes_blur_tint_color: t.botMesTint ?? t.assistantBubble,
    shadow_color: t.shadowColor ?? t.shadow,
    border_color: t.borderColor ?? t.border,
    blur_strength: t.blurStrength,
    font_scale: t.fontScale ?? 1,
    fast_ui_mode: f?.fastUiMode,
    waifuMode: f?.waifuMode,
    noShadows: f?.noShadows,
    avatar_style: f?.avatarStyle,
    chat_display: f?.chatDisplay,
    chat_width: f?.chatWidth,
    timer_enabled: f?.timerEnabled,
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
