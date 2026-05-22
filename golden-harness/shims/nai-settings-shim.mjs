// nai-settings-shim.mjs: Replaces ST's nai-settings.js
export let nai_settings = {};
export const novelai_settings = [];
export const novelai_setting_names = [];
export function loadNovelSettings() {}
export function generateNovelWithStreaming() { return Promise.resolve(''); }
export function getNovelGenerationData() { return {}; }
export function getKayraMaxContextTokens() { return 8192; }
export function initNovelAISettings() {}
export function adjustNovelInstructionPrompt() { return ''; }
export function parseNovelAILogprobs() { return []; }
