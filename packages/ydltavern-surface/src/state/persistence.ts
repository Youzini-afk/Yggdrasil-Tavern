import type { TavernThemeSettings } from '../components/product/themes/theme-types.js';
import {
  DEFAULT_BACKGROUND_DISPLAY,
  DEFAULT_CONNECTION,
  DEFAULT_FORMATTING,
  DEFAULT_SAMPLER,
  DEFAULT_SELECTION,
  DEFAULT_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  SEED_BACKGROUND,
  SEED_CHARACTER,
  SEED_PERSONA,
  SEED_WORLDBOOK,
  type TavernSettings,
} from './defaults.js';
import type {
  BackgroundDisplaySettings,
  BackgroundEntry,
  CharacterEntry,
  ConnectionSettings,
  FormattingSettings,
  PersistedSelection,
  PersonaEntry,
  SamplerSettings,
  WorldBookEntry,
} from '../types/state.js';

export const STORAGE_KEYS = {
  settings: 'ydltavern.settings.v2',
  themeSettings: 'ydltavern.themeSettings.v1',
  legacyThemeSettings: 'ydltavern.themeSettings',
  sampler: 'ydltavern.samplerSettings.v1',
  connection: 'ydltavern.connectionProfiles.v1',
  formatting: 'ydltavern.formattingSettings.v1',
  personas: 'ydltavern.personas.v1',
  characters: 'ydltavern.characters.v1',
  worldbooks: 'ydltavern.worldbooks.v1',
  backgrounds: 'ydltavern.backgrounds.v1',
  backgroundDisplay: 'ydltavern.backgroundDisplaySettings.v1',
  selection: 'ydltavern.selection.v1',
} as const;

export interface PersistedConnectionState {
  readonly current: ConnectionSettings;
  readonly profiles: Record<string, ConnectionSettings>;
}

export function readPersisted<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === 'undefined') return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(fallback)) return (Array.isArray(parsed) ? parsed : fallback) as T;
    if (isPlainObject(fallback) && isPlainObject(parsed)) return { ...fallback, ...parsed } as T;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writePersisted<T>(key: string, value: T): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialize errors
  }
}

export function migrateSettingsV1ToV2(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const v1 = localStorage.getItem('ydltavern.settings');
    const v2 = localStorage.getItem(STORAGE_KEYS.settings);
    if (!v1 || v2) return;

    const parsed = JSON.parse(v1) as Record<string, unknown>;
    const v2Settings: TavernSettings = {
      activePreset: stringOr(parsed.activePreset, DEFAULT_SETTINGS.activePreset),
      streaming: booleanOr(parsed.streaming, DEFAULT_SETTINGS.streaming),
      bannedTokens: stringOr(parsed.bannedTokens, DEFAULT_SETTINGS.bannedTokens),
      logitBias: stringOr(parsed.logitBias, DEFAULT_SETTINGS.logitBias),
      fastUImode: booleanOr(parsed.fastUImode, DEFAULT_SETTINGS.fastUImode),
      reducedMotion: booleanOr(parsed.reducedMotion, DEFAULT_SETTINGS.reducedMotion),
      showTimestamps: booleanOr(parsed.showTimestamps, DEFAULT_SETTINGS.showTimestamps),
      showTokenCounter: booleanOr(parsed.showTokenCounter, DEFAULT_SETTINGS.showTokenCounter),
      fontScale: numberOr(parsed.fontScale, DEFAULT_SETTINGS.fontScale),
      chatWidth: numberOr(parsed.chatWidth, DEFAULT_SETTINGS.chatWidth),
      avatarStyle: numberOr(parsed.avatarStyle, DEFAULT_SETTINGS.avatarStyle),
    };

    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(v2Settings));
    const existingSelection = readPersisted<PersistedSelection>(STORAGE_KEYS.selection, DEFAULT_SELECTION);
    writePersisted(STORAGE_KEYS.selection, { ...existingSelection, activePreset: v2Settings.activePreset });
  } catch {
    // migration is best-effort
  }
}

export function readTavernSettings(): TavernSettings {
  return readPersisted<TavernSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}

export function readThemeSettings(): TavernThemeSettings {
  const v1 = readPersisted<TavernThemeSettings | undefined>(STORAGE_KEYS.themeSettings, undefined);
  if (v1 !== undefined) return { ...DEFAULT_THEME_SETTINGS, ...v1 };
  return readPersisted<TavernThemeSettings>(STORAGE_KEYS.legacyThemeSettings, DEFAULT_THEME_SETTINGS);
}

export function writeThemeSettings(settings: TavernThemeSettings): void {
  writePersisted(STORAGE_KEYS.themeSettings, settings);
  writePersisted(STORAGE_KEYS.legacyThemeSettings, settings);
}

export function readSamplerSettings(): SamplerSettings {
  return readPersisted<SamplerSettings>(STORAGE_KEYS.sampler, DEFAULT_SAMPLER);
}

export function readConnectionState(): PersistedConnectionState {
  return readPersisted<PersistedConnectionState>(STORAGE_KEYS.connection, { current: DEFAULT_CONNECTION, profiles: {} });
}

export function writeConnectionState(current: ConnectionSettings, profiles: Record<string, ConnectionSettings>): void {
  writePersisted<PersistedConnectionState>(STORAGE_KEYS.connection, { current, profiles });
}

export function readFormattingSettings(): FormattingSettings {
  return readPersisted<FormattingSettings>(STORAGE_KEYS.formatting, DEFAULT_FORMATTING);
}

export function readBackgroundDisplaySettings(): BackgroundDisplaySettings {
  return readPersisted<BackgroundDisplaySettings>(STORAGE_KEYS.backgroundDisplay, DEFAULT_BACKGROUND_DISPLAY);
}

export function readCharacters(): CharacterEntry[] {
  return readCollection(STORAGE_KEYS.characters, [SEED_CHARACTER]);
}

export function readPersonas(): PersonaEntry[] {
  return readCollection(STORAGE_KEYS.personas, [SEED_PERSONA]);
}

export function readWorldBooks(): WorldBookEntry[] {
  return readCollection(STORAGE_KEYS.worldbooks, [SEED_WORLDBOOK]);
}

export function readBackgrounds(): BackgroundEntry[] {
  return readCollection(STORAGE_KEYS.backgrounds, [SEED_BACKGROUND]);
}

export function readSelection(): PersistedSelection {
  return readPersisted<PersistedSelection>(STORAGE_KEYS.selection, DEFAULT_SELECTION);
}

function readCollection<T>(key: string, seed: T[]): T[] {
  const persisted = readPersisted<T[]>(key, seed);
  return persisted.length > 0 ? persisted : seed;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function booleanOr(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function numberOr(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
