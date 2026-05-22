// Synthetic micro-BME extension — mimics BME's bootstrap pattern.
// Uses ESM imports, ST host imports, and exercises:
//   - eventSource.on for multiple event types
//   - extension_settings[MODULE_NAME] read/write
//   - setExtensionPrompt via host bridge
//   - getRequestHeaders + saveSettingsDebounced calls
//   - localStorage read/write
//   - performance.now timing

import { eventSource, event_types, extension_settings, getContext, setExtensionPrompt, saveSettingsDebounced, getRequestHeaders } from '../../../../script.js';
import { initSubsystem } from './lib/subsystem.js';
import { DEFAULTS } from './lib/defaults.js';

const MODULE_NAME = 'micro-bme';

// Initialize settings
if (!extension_settings[MODULE_NAME]) {
  extension_settings[MODULE_NAME] = { ...DEFAULTS };
}

const settings = extension_settings[MODULE_NAME];
settings.bootstrapped_at = performance.now();
settings.context_chat_id = getContext().chatId;

// Register events
let messageCount = 0;
eventSource.on(event_types.MESSAGE_SENT, () => {
  messageCount++;
  settings.message_count = messageCount;
  saveSettingsDebounced();
});
eventSource.on(event_types.GENERATION_STARTED, () => {
  setExtensionPrompt('micro-bme/inject', 'Synthetic injection from micro-bme', 0, 4, false, 0);
});
eventSource.on(event_types.CHAT_CHANGED, () => {
  settings.chat_changed_seen = true;
});

// Call other host APIs
const headers = getRequestHeaders();
settings.last_headers = headers ? Object.keys(headers).join(',') : '';

// Use localStorage
localStorage.setItem('micro-bme-installed', 'true');

// Use a real WebAssembly check (will be undefined in v1)
settings.has_wasm = typeof WebAssembly !== 'undefined';

initSubsystem(MODULE_NAME, settings);
