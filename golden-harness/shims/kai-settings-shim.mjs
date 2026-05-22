// kai-settings-shim.mjs: Replaces ST's kai-settings.js
export let kai_settings = {};
export const koboldai_settings = [];
export const koboldai_setting_names = [];
export const kai_flags = {};
export function loadKoboldSettings() {}
export function generateKoboldWithStreaming() { return Promise.resolve(''); }
export function getKoboldGenerationData() { return {}; }
export function initKoboldSettings() {}
