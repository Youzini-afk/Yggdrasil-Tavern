export interface TavernTheme {
  readonly name: string;
  readonly tokens: {
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
  };
  readonly font: {
    readonly family: string;
    readonly sizeBase: string;
    readonly sizeSm: string;
    readonly sizeLg: string;
  };
  readonly density: 'compact' | 'comfortable' | 'spacious';
}

export type ThemeDensity = TavernTheme['density'];

export interface TavernThemeSettings {
  readonly themeId: string;
  readonly density: ThemeDensity;
  readonly fontFamily: string;
}
