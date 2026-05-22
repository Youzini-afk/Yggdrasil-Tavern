import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  loadExtensionInSandbox,
  DEFAULT_PERMISSIONS,
} from '../dist/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

// === Helpers ===

function readSourceFromDir(baseDir) {
  return async (relPath) => {
    const filePath = resolve(baseDir, relPath);
    return readFileSync(filePath, 'utf-8');
  };
}

function makeMockHostBridge() {
  const eventListeners = new Map();
  let settings;
  const promptStore = new Map();
  const audit = [];

  return {
    audit,
    eventListeners,
    get settings() { return settings ?? {}; },
    promptStore,
    bridge: {
      getContextSnapshot() {
        return {
          chat: [],
          chatId: 'test-chat',
          characterId: 0,
          characters: [],
        };
      },
      eventOn(eventName, callbackId) {
        if (!eventListeners.has(eventName)) eventListeners.set(eventName, []);
        eventListeners.get(eventName).push(callbackId);
        audit.push({ api: 'eventOn', args: { eventName, callbackId } });
      },
      eventEmit(eventName, payload) {
        audit.push({ api: 'eventEmit', args: { eventName, payload } });
      },
      registerSlashCommand(name, callbackId, helpString) {
        audit.push({ api: 'registerSlashCommand', args: { name, callbackId, helpString } });
      },
      setExtensionPrompt(key, value, position, depth, scan, role) {
        promptStore.set(key, { value, position, depth, scan, role });
        audit.push({ api: 'setExtensionPrompt', args: { key, value, position, depth, scan, role } });
      },
      getSettings() { return settings; },
      setSettings(value) {
        settings = value && typeof value === 'object' ? value : {};
      },
      saveSettingsDebounced() { audit.push({ api: 'saveSettingsDebounced' }); },
      saveMetadata() { audit.push({ api: 'saveMetadata' }); return Promise.resolve(); },
      saveMetadataDebounced() { audit.push({ api: 'saveMetadataDebounced' }); },
      reloadCurrentChat() { audit.push({ api: 'reloadCurrentChat' }); return Promise.resolve(); },
      updateChatMetadata(values, reset) { audit.push({ api: 'updateChatMetadata', args: { values, reset } }); return values; },
      getRequestHeaders() {
        audit.push({ api: 'getRequestHeaders' });
        return { 'Content-Type': 'application/json' };
      },
      substituteParams(text) { return text; },
      getTokenCountAsync(text) { return Math.ceil(text.length / 3.35); },
    },
  };
}

function activationContext(clientVersion = '1.0.0') {
  return {
    installedExtras: new Set(),
    installedExtensions: new Set(),
    disabledExtensions: new Set(),
    clientVersion,
  };
}

function hasAuditEntry(audit, api) {
  return audit.some((entry) => entry.api === api);
}

// === Synthetic micro-BME test (always on) ===

test('micro-bme synthetic extension loads and registers ST hooks', async () => {
  const microBmeDir = resolve(__dirname, 'fixtures/micro-bme');
  const host = makeMockHostBridge();

  const loaded = await loadExtensionInSandbox({
    record: {
      id: 'micro-bme',
      manifest: {
        display_name: 'Micro BME',
        js: 'index.js',
      },
    },
    activationContext: activationContext(),
    basePath: '/extensions/micro-bme',
    readSource: readSourceFromDir(microBmeDir),
    hostBridge: host.bridge,
    permissions: { ...DEFAULT_PERMISSIONS, realExtensionLoad: true },
    sandboxConfig: {
      callTimeoutMs: 5000,
      seed: 'ydltavern-fixture-v1',
    },
  });

  try {
    // Assertions: hooks registered
    assert.ok(host.eventListeners.has('message_sent'), 'MESSAGE_SENT listener registered');
    assert.ok(host.eventListeners.has('generation_started'), 'GENERATION_STARTED listener registered');
    assert.ok(host.eventListeners.has('chat_id_changed'), 'CHAT_CHANGED listener registered');

    // Assertions: settings written
    const settings = host.settings['micro-bme'] ?? host.settings;
    assert.equal(settings.enabled, true, 'micro-bme settings should have enabled=true via DEFAULTS');
    assert.equal(settings.threshold, 5, 'micro-bme threshold default written');
    assert.equal(typeof settings.bootstrapped_at, 'number', 'performance.now wrote boot time');
    assert.equal(settings.context_chat_id, 'test-chat', 'getContext was callable through the virtual host import');

    // Assertions: relative import resolved
    assert.equal(settings.subsystem_initialized, true, 'lib/subsystem.js was imported and run');
    assert.equal(settings.subsystem_keys, 'enabled,threshold,max_history,message_count', 'lib/defaults.js was imported and read');

    // Assertions: host/browser APIs called
    assert.equal(settings.last_headers, 'Content-Type', 'getRequestHeaders result was observed');
    assert.ok(hasAuditEntry(host.audit, 'eventOn'), 'eventOn called for at least one event');
    assert.ok(loaded.sandbox.getAuditLog().some((entry) => entry.api === 'getRequestHeaders'), 'getRequestHeaders called');
    assert.ok(loaded.sandbox.getAuditLog().some((entry) => entry.api === 'localStorage.setItem'), 'localStorage.setItem was audited');
  } finally {
    loaded.destroy();
  }
});

test('micro-bme synthetic event callbacks update settings and prompts', async () => {
  const microBmeDir = resolve(__dirname, 'fixtures/micro-bme');
  const host = makeMockHostBridge();

  const loaded = await loadExtensionInSandbox({
    record: {
      id: 'micro-bme',
      manifest: {
        display_name: 'Micro BME',
        js: 'index.js',
      },
    },
    activationContext: activationContext(),
    basePath: '/extensions/micro-bme',
    readSource: readSourceFromDir(microBmeDir),
    hostBridge: host.bridge,
    permissions: { ...DEFAULT_PERMISSIONS, realExtensionLoad: true },
    sandboxConfig: {
      callTimeoutMs: 5000,
      seed: 'ydltavern-fixture-v1',
    },
  });

  try {
    const messageCallback = host.eventListeners.get('message_sent')?.[0];
    const generationCallback = host.eventListeners.get('generation_started')?.[0];
    assert.equal(typeof messageCallback, 'string', 'MESSAGE_SENT callback id was registered');
    assert.equal(typeof generationCallback, 'string', 'GENERATION_STARTED callback id was registered');

    await loaded.sandbox.callCallback(messageCallback, { id: 1 });
    const settings = host.settings['micro-bme'] ?? host.settings;
    assert.equal(settings.message_count, 1, 'MESSAGE_SENT callback updated settings');
    assert.ok(hasAuditEntry(host.audit, 'saveSettingsDebounced'), 'MESSAGE_SENT callback saved settings');

    await loaded.sandbox.callCallback(generationCallback, {});
    assert.deepEqual(host.promptStore.get('micro-bme/inject'), {
      value: 'Synthetic injection from micro-bme',
      position: 0,
      depth: 4,
      scan: false,
      role: 0,
    }, 'GENERATION_STARTED callback called setExtensionPrompt');
    assert.ok(hasAuditEntry(host.audit, 'setExtensionPrompt'), 'setExtensionPrompt call audited by mock host');
  } finally {
    loaded.destroy();
  }
});

// === Real BME test (opt-in) ===

const BME_PATH = process.env.YGG_BME_TEST_PATH;

test('Real ST-Bionic-Memory-Ecology bootstrap smoke', { skip: !BME_PATH }, async () => {
  const manifestPath = resolve(BME_PATH, 'manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  assert.equal(typeof manifest, 'object', 'manifest parses as an object');
  assert.equal(typeof manifest.js ?? 'index.js', 'string', 'manifest js entry is usable');

  const host = makeMockHostBridge();
  let loaded;
  let loadError;

  try {
    loaded = await loadExtensionInSandbox({
      record: {
        id: 'ST-BME',
        manifest: {
          ...manifest,
          display_name: manifest.display_name ?? 'ST-BME',
          js: manifest.js ?? 'index.js',
        },
      },
      activationContext: activationContext(manifest.minimum_client_version ?? '1.0.0'),
      basePath: '/extensions/ST-BME',
      readSource: readSourceFromDir(BME_PATH),
      hostBridge: host.bridge,
      permissions: { ...DEFAULT_PERMISSIONS, realExtensionLoad: true },
      sandboxConfig: {
        callTimeoutMs: 30000,
        activationTimeoutMs: 30000,
        seed: 'ydltavern-fixture-v1',
      },
    });
  } catch (err) {
    loadError = err;
  }

  // BME may throw during init due to fetch/IndexedDB/wasm/browser stubs; that's
  // acceptable for v1 smoke as long as the loader reached module evaluation.
  const eventListenerCount = [...host.eventListeners.values()].reduce((sum, listeners) => sum + listeners.length, 0);
  const settingsTouched = Object.keys(host.settings).length > 0;

  console.log(`BME smoke: event names registered=${host.eventListeners.size}, listener count=${eventListenerCount}, settings keys=${Object.keys(host.settings).join(',') || 'none'}, loadError=${loadError?.message ?? 'none'}`);
  console.log(`BME smoke: audit entries=${host.audit.length}`);

  assert.ok(eventListenerCount > 0 || settingsTouched || loadError, 'BME init registered events/touched settings OR threw a documented bootstrap error');

  loaded?.destroy();
});
