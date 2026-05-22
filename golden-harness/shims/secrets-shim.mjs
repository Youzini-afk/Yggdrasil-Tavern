// secrets-shim.mjs: Replaces ST's secrets.js
export const SECRET_KEYS = {
  OPENAI: 'openai',
  CLAUDE: 'claude',
  NOVELAI: 'novelai',
};

export const secret_state = {};
export function writeSecret() {}
export function findSecret() { return ''; }
export function readSecret() { return ''; }
export function readSecretState() { return {}; }
