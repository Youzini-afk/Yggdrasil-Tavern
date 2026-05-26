// SillyTavern public/scripts/extensions.js compatibility shim.

const g = globalThis;
const value = (name, fallback = undefined) => (name in g ? g[name] : fallback);
const call = (name) => (...args) => {
  const ctx = g.SillyTavern?.getContext?.();
  const fn = g[name] ?? ctx?.[name];
  return typeof fn === 'function' ? fn(...args) : undefined;
};
const objectProxy = (name) => new Proxy({}, {
  get(_target, prop) { return value(name, {})[prop]; },
  set(_target, prop, val) { if (!g[name]) g[name] = {}; g[name][prop] = val; return true; },
  has(_target, prop) { return prop in value(name, {}); },
  ownKeys() { return Reflect.ownKeys(value(name, {})); },
  getOwnPropertyDescriptor(_target, prop) { return Object.getOwnPropertyDescriptor(value(name, {}), prop); },
});

export const extensionNames = value('extensionNames', []);
export const extensionTypes = objectProxy('extensionTypes');
export const modules = value('modules', []);
export const extension_settings = objectProxy('extension_settings');
export const UNSET_VALUE = '__@@UNSET@@__';
export const EMPTY_AUTHOR = Object.freeze({ name: '', url: '' });

export const getContext = () => g.SillyTavern?.getContext?.();
export const getApiUrl = (...args) => value('getApiUrl', () => extension_settings.apiUrl)?.(...args);
export const isOfficialExtension = (url) => {
  if (typeof g.isOfficialExtension === 'function') return g.isOfficialExtension(url);
  try { return /^https:\/\/github\.com\/SillyTavern\/(.+)$/i.test(new URL(url).href); } catch { return false; }
};
export const cancelDebouncedMetadataSave = call('cancelDebouncedMetadataSave');
export const saveMetadataDebounced = call('saveMetadataDebounced');
export const renderExtensionTemplate = call('renderExtensionTemplate');
export const renderExtensionTemplateAsync = call('renderExtensionTemplateAsync');
export const doExtrasFetch = call('doExtrasFetch');
export const enableExtension = call('enableExtension');
export const disableExtension = call('disableExtension');
export const findExtension = call('findExtension');
export const getExtensionManifest = call('getExtensionManifest');
export const deleteExtension = call('deleteExtension');
export const installExtension = call('installExtension');
export const loadExtensionSettings = call('loadExtensionSettings');
export const doDailyExtensionUpdatesCheck = call('doDailyExtensionUpdatesCheck');
export const runGenerationInterceptors = call('runGenerationInterceptors');
export const writeExtensionField = call('writeExtensionField');
export const writeExtensionFieldBulk = call('writeExtensionFieldBulk');
export const openThirdPartyExtensionMenu = call('openThirdPartyExtensionMenu');
export const getAuthorFromUrl = call('getAuthorFromUrl');
export const initExtensions = call('initExtensions');

export class ModuleWorkerWrapper {
  constructor(callback) { this.callback = callback; this.busy = false; }
  async update() {
    if (this.busy) return undefined;
    this.busy = true;
    try { return await this.callback?.(); } finally { this.busy = false; }
  }
}
