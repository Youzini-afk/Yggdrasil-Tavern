import type { TavernThemeSettings } from '../components/product/themes/theme-types.js';
import type { BackgroundDisplaySettings, BackgroundEntry, CharacterEntry, ConnectionSettings, FormattingSettings, PersistedSelection, PersonaEntry, SamplerSettings, WorldBookEntry } from '../types/state.js';
export interface TavernSettings {
    readonly activePreset: string;
    readonly streaming: boolean;
    readonly bannedTokens: string;
    readonly logitBias: string;
    readonly fastUImode: boolean;
    readonly reducedMotion: boolean;
    readonly showTimestamps: boolean;
    readonly showTokenCounter: boolean;
    readonly fontScale: number;
    readonly chatWidth: number;
    readonly avatarStyle: number;
}
export declare const DEFAULT_SETTINGS: TavernSettings;
export declare const DEFAULT_THEME_SETTINGS: TavernThemeSettings;
export declare const DEFAULT_SAMPLER: SamplerSettings;
export declare const DEFAULT_CONNECTION: ConnectionSettings;
export declare const DEFAULT_FORMATTING: FormattingSettings;
export declare const DEFAULT_BACKGROUND_DISPLAY: BackgroundDisplaySettings;
export declare const SEED_PERSONA: PersonaEntry;
export declare const SEED_CHARACTER: CharacterEntry;
export declare const SEED_WORLDBOOK: WorldBookEntry;
export declare const SEED_BACKGROUND: BackgroundEntry;
export declare const DEFAULT_SELECTION: PersistedSelection;
//# sourceMappingURL=defaults.d.ts.map