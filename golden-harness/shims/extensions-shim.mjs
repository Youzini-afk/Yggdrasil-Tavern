// extensions-shim.mjs: Replaces ST's extensions.js
export const getContext = () => ({ characterId: 0, groupId: null, chat: [], chatId: 'test-chat', name1: 'User', name2: 'Assistant', characters: [], group: {}, extensionPrompts: {}, settings: {} });
export const getApiUrl = () => '';
export const extension_settings = {};
export const ModuleWorkerWrapper = class { constructor(fn) { this.run = fn; } };
export let extensionNames = [];
export let modules = [];
export function findExtension(_name) { return null; }
export function getExtension(_name) { return null; }
export function findExtensionByName(_name) { return null; }
export function getExtensionByName(_name) { return null; }
