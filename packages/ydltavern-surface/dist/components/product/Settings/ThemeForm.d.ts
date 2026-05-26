import type { TavernThemeSettings } from '../themes/theme-types.js';
export interface ThemeFormProps {
    readonly settings: TavernThemeSettings;
    readonly onChange: (settings: TavernThemeSettings) => void;
}
export declare function ThemeForm({ settings, onChange }: ThemeFormProps): JSX.Element;
export declare const DEFAULT_THEME_SETTINGS: TavernThemeSettings;
export type { TavernThemeSettings };
//# sourceMappingURL=ThemeForm.d.ts.map