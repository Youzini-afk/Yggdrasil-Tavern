export interface TavernThemeTokens {
  // Background / foreground
  readonly bgPrimary: string;
  readonly bgSecondary: string;
  readonly bgTertiary: string;
  readonly fgPrimary: string;
  readonly fgSecondary: string;
  readonly fgMuted: string;
  // Accent
  readonly accentPrimary: string;
  readonly accentHover: string;
  // Chat-specific
  readonly userBubble: string;
  readonly assistantBubble: string;
  readonly systemBubble: string;
  // Borders / shadows
  readonly border: string;
  readonly shadow: string;
  // === ST-aligned tokens (optional, for ST theme JSON imports) ===
  readonly bodyColor?: string;
  readonly emColor?: string;
  readonly underlineColor?: string;
  readonly quoteColor?: string;
  readonly blurTint?: string;
  readonly chatTint?: string;
  readonly userMesTint?: string;
  readonly botMesTint?: string;
  readonly shadowColor?: string;
  readonly borderColor?: string;
  readonly blurStrength?: number;
  readonly fontScale?: number;
}

export interface TavernThemeFlags {
  readonly fastUiMode?: boolean;
  readonly waifuMode?: boolean;
  readonly noShadows?: boolean;
  readonly avatarStyle?: number;
  readonly chatDisplay?: number;
  readonly chatWidth?: number;
  readonly timerEnabled?: boolean;
}

export interface TavernTheme {
  readonly name: string;
  /** Optional human-readable label (used for ST classic theme imports) */
  readonly label?: string;
  readonly tokens: TavernThemeTokens;
  readonly font: {
    readonly family: string;
    readonly sizeBase: string;
    readonly sizeSm: string;
    readonly sizeLg: string;
  };
  readonly density: 'compact' | 'comfortable' | 'spacious';
  /** Optional ST compatibility flags (used by imported ST classic themes) */
  readonly flags?: TavernThemeFlags;
  /** True if this theme was imported from an ST classic JSON */
  readonly classic?: boolean;
}

export type ThemeDensity = TavernTheme['density'];

export interface TavernThemeSettings {
  readonly themeId: string;
  readonly density: ThemeDensity;
  readonly fontFamily: string;
}
