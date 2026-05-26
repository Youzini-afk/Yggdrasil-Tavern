// SillyTavern public/scripts/power-user.js compatibility shim.

const g = globalThis;
const value = (name, fallback = undefined) => (name in g ? g[name] : fallback);
const call = (name) => (...args) => {
  const fn = g[name] ?? g.SillyTavern?.getContext?.()?.[name];
  return typeof fn === 'function' ? fn(...args) : undefined;
};

export const toastPositionClasses = value('toastPositionClasses', []);
export const MAX_CONTEXT_DEFAULT = value('MAX_CONTEXT_DEFAULT', 8192);
export const MAX_RESPONSE_DEFAULT = value('MAX_RESPONSE_DEFAULT', 2048);
export const chat_styles = value('chat_styles', {});
export const send_on_enter_options = value('send_on_enter_options', {});
export const persona_description_positions = value('persona_description_positions', {});
export const power_user = value('power_user', {});
export const context_presets = value('context_presets', []);
export const playMessageSound = call('playMessageSound');
export const collapseNewlines = call('collapseNewlines');
export const fixMarkdown = call('fixMarkdown');
export const registerDebugFunction = call('registerDebugFunction');
export const applyPowerUserSettings = call('applyPowerUserSettings');
export const applyStylePins = call('applyStylePins');
export const loadPowerUserSettings = call('loadPowerUserSettings');
export const loadMovingUIState = call('loadMovingUIState');
export const getContextSettings = call('getContextSettings');
export const performFuzzySearch = call('performFuzzySearch');
export const fuzzySearchCharacters = call('fuzzySearchCharacters');
export const fuzzySearchWorldInfo = call('fuzzySearchWorldInfo');
export const fuzzySearchPersonas = call('fuzzySearchPersonas');
export const fuzzySearchTags = call('fuzzySearchTags');
export const fuzzySearchGroups = call('fuzzySearchGroups');
export const renderStoryString = call('renderStoryString');
export const sortEntitiesList = call('sortEntitiesList');
export const getThemeObject = call('getThemeObject');
export const resetMovableStyles = call('resetMovableStyles');
export const addEphemeralStoppingString = call('addEphemeralStoppingString');
export const flushEphemeralStoppingStrings = call('flushEphemeralStoppingStrings');
export const generatedTextFiltered = call('generatedTextFiltered');
export const getCustomStoppingStrings = call('getCustomStoppingStrings');
export const forceCharacterEditorTokenize = call('forceCharacterEditorTokenize');
