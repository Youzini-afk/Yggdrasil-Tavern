import type { TavernTheme } from './theme-types.js';
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
export declare function importSTTheme(stJson: STThemeJson): TavernTheme;
/**
 * Convert a YdlTavern TavernTheme back into an STThemeJson blob.
 *
 * This is a best-effort round-trip. Tokens from non-ST themes may be mapped
 * as-is without ST-specific values for missing fields.
 */
export declare function exportSTTheme(theme: TavernTheme): STThemeJson;
//# sourceMappingURL=st-theme-importer.d.ts.map