import { DEFAULTS } from './defaults.js';

export function initSubsystem(name, settings) {
  // Just record we got called; this proves the relative import was resolved
  settings.subsystem_initialized = true;
  settings.subsystem_keys = Object.keys(DEFAULTS).join(',');
  return { name, ready: true };
}
