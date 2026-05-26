import { DEFAULT_BACKGROUND_DISPLAY, DEFAULT_CONNECTION, DEFAULT_FORMATTING, DEFAULT_SAMPLER, DEFAULT_SELECTION, DEFAULT_SETTINGS, DEFAULT_THEME_SETTINGS, SEED_BACKGROUND, SEED_CHARACTER, SEED_PERSONA, SEED_WORLDBOOK, } from './defaults.js';
import { normalizeSecretRef } from './secrets.js';
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
};
export function readPersisted(key, fallback) {
    try {
        if (typeof localStorage === 'undefined')
            return fallback;
        const raw = localStorage.getItem(key);
        if (!raw)
            return fallback;
        const parsed = JSON.parse(raw);
        if (Array.isArray(fallback))
            return (Array.isArray(parsed) ? parsed : fallback);
        if (isPlainObject(fallback) && isPlainObject(parsed))
            return { ...fallback, ...parsed };
        return parsed;
    }
    catch {
        return fallback;
    }
}
export function writePersisted(key, value) {
    try {
        if (typeof localStorage === 'undefined')
            return;
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        // ignore quota / serialize errors
    }
}
export function migrateSettingsV1ToV2() {
    try {
        if (typeof localStorage === 'undefined')
            return;
        const v1 = localStorage.getItem('ydltavern.settings');
        const v2 = localStorage.getItem(STORAGE_KEYS.settings);
        if (!v1 || v2)
            return;
        const parsed = JSON.parse(v1);
        const v2Settings = {
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
        const existingSelection = readPersisted(STORAGE_KEYS.selection, DEFAULT_SELECTION);
        writePersisted(STORAGE_KEYS.selection, { ...existingSelection, activePreset: v2Settings.activePreset });
    }
    catch {
        // migration is best-effort
    }
}
export function readTavernSettings() {
    return readPersisted(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
}
export function readThemeSettings() {
    const v1 = readPersisted(STORAGE_KEYS.themeSettings, undefined);
    if (v1 !== undefined)
        return { ...DEFAULT_THEME_SETTINGS, ...v1 };
    return readPersisted(STORAGE_KEYS.legacyThemeSettings, DEFAULT_THEME_SETTINGS);
}
export function writeThemeSettings(settings) {
    writePersisted(STORAGE_KEYS.themeSettings, settings);
    writePersisted(STORAGE_KEYS.legacyThemeSettings, settings);
}
export function readSamplerSettings() {
    return readPersisted(STORAGE_KEYS.sampler, DEFAULT_SAMPLER);
}
export function readConnectionState() {
    const persisted = readPersisted(STORAGE_KEYS.connection, { current: DEFAULT_CONNECTION, profiles: {} });
    return sanitizeConnectionState(persisted);
}
export function writeConnectionState(current, profiles) {
    writePersisted(STORAGE_KEYS.connection, sanitizeConnectionState({ current, profiles }));
}
function sanitizeConnectionState(state) {
    const current = isPlainObject(state.current) ? state.current : DEFAULT_CONNECTION;
    const profiles = isPlainObject(state.profiles) ? state.profiles : {};
    return {
        current: sanitizeConnectionSettings(current),
        profiles: Object.fromEntries(Object.entries(profiles).map(([name, settings]) => [name, sanitizeConnectionSettings(settings)])),
    };
}
function sanitizeConnectionSettings(settings) {
    const normalizedSecretRef = normalizeSecretRef(settings.secretRef);
    return normalizedSecretRef === undefined
        ? { ...settings, secretRef: undefined }
        : { ...settings, secretRef: normalizedSecretRef };
}
export function readFormattingSettings() {
    return readPersisted(STORAGE_KEYS.formatting, DEFAULT_FORMATTING);
}
export function readBackgroundDisplaySettings() {
    return readPersisted(STORAGE_KEYS.backgroundDisplay, DEFAULT_BACKGROUND_DISPLAY);
}
export function readCharacters() {
    return readCollection(STORAGE_KEYS.characters, [SEED_CHARACTER]);
}
export function readPersonas() {
    return readCollection(STORAGE_KEYS.personas, [SEED_PERSONA]);
}
export function readWorldBooks() {
    return readCollection(STORAGE_KEYS.worldbooks, [SEED_WORLDBOOK]);
}
export function readBackgrounds() {
    return readCollection(STORAGE_KEYS.backgrounds, [SEED_BACKGROUND]);
}
export function readSelection() {
    return readPersisted(STORAGE_KEYS.selection, DEFAULT_SELECTION);
}
function readCollection(key, seed) {
    const persisted = readPersisted(key, seed);
    return persisted.length > 0 ? persisted : seed;
}
function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function stringOr(value, fallback) {
    return typeof value === 'string' ? value : fallback;
}
function booleanOr(value, fallback) {
    return typeof value === 'boolean' ? value : fallback;
}
function numberOr(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
//# sourceMappingURL=persistence.js.map