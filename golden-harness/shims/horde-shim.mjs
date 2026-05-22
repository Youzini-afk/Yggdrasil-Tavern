// horde-shim.mjs: Replaces ST's horde.js
export let horde_settings = {};
export const MIN_LENGTH = 0;
export function loadHordeSettings() {}
export function generateHorde() { return Promise.resolve(''); }
export function getStatusHorde() {}
export function getHordeModels() { return []; }
export function adjustHordeGenerationParams() {}
export function isHordeGenerationNotAllowed() { return false; }
export function initHorde() {}
