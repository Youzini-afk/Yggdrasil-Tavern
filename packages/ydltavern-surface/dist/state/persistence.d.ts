import type { TavernThemeSettings } from '../components/product/themes/theme-types.js';
import { type TavernSettings } from './defaults.js';
import type { BackgroundDisplaySettings, BackgroundEntry, CharacterEntry, ConnectionSettings, FormattingSettings, PersistedSelection, PersonaEntry, SamplerSettings, WorldBookEntry } from '../types/state.js';
export declare const STORAGE_KEYS: {
    readonly settings: "ydltavern.settings.v2";
    readonly themeSettings: "ydltavern.themeSettings.v1";
    readonly legacyThemeSettings: "ydltavern.themeSettings";
    readonly sampler: "ydltavern.samplerSettings.v1";
    readonly connection: "ydltavern.connectionProfiles.v1";
    readonly formatting: "ydltavern.formattingSettings.v1";
    readonly personas: "ydltavern.personas.v1";
    readonly characters: "ydltavern.characters.v1";
    readonly worldbooks: "ydltavern.worldbooks.v1";
    readonly backgrounds: "ydltavern.backgrounds.v1";
    readonly backgroundDisplay: "ydltavern.backgroundDisplaySettings.v1";
    readonly selection: "ydltavern.selection.v1";
};
export interface PersistedConnectionState {
    readonly current: ConnectionSettings;
    readonly profiles: Record<string, ConnectionSettings>;
}
export declare function readPersisted<T>(key: string, fallback: T): T;
export declare function writePersisted<T>(key: string, value: T): void;
export declare function migrateSettingsV1ToV2(): void;
export declare function readTavernSettings(): TavernSettings;
export declare function readThemeSettings(): TavernThemeSettings;
export declare function writeThemeSettings(settings: TavernThemeSettings): void;
export declare function readSamplerSettings(): SamplerSettings;
export declare function readConnectionState(): PersistedConnectionState;
export declare function writeConnectionState(current: ConnectionSettings, profiles: Record<string, ConnectionSettings>): void;
export declare function readFormattingSettings(): FormattingSettings;
export declare function readBackgroundDisplaySettings(): BackgroundDisplaySettings;
export declare function readCharacters(): CharacterEntry[];
export declare function readPersonas(): PersonaEntry[];
export declare function readWorldBooks(): WorldBookEntry[];
export declare function readBackgrounds(): BackgroundEntry[];
export declare function readSelection(): PersistedSelection;
//# sourceMappingURL=persistence.d.ts.map