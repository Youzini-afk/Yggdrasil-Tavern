import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bindHostBridge,
  DEFAULT_PERMISSIONS,
  ExtensionSandbox,
  loadExtensionInSandbox,
} from '../dist/index.js';

const SYNTHETIC_REGEX_EXT = `
const ctx = getContext();
const settings = getExtensionSettings();

// Register a slash command that uppercases its argument
registerSlashCommand('uppercase', 'cb-uppercase', 'Uppercase a string');

// Set an extension prompt
setExtensionPrompt('1_synth', 'synth-prompt-text', 0, 4, false, 0);

// Listen for an event
eventOn('USER_MESSAGE_RENDERED', 'cb-on-user-msg');

// Export an activate hook
globalThis.__exports__ = {
  activate(snapshot) {
    globalThis.__activationChatLength = snapshot.chat.length;
    return 'activated';
  },
};
`;

test('ExtensionSandbox.init creates QuickJS context with memory and timeout limits', async () => {
  const sandbox = new ExtensionSandbox('init-test', { memoryLimitBytes: 8 * 1024 * 1024, stackSizeBytes: 256 * 1024, callTimeoutMs: 50 });
  await sandbox.init();
  assert.equal(await sandbox.eval('1 + 1'), 2);
  sandbox.destroy();
});

test('ExtensionSandbox.eval runs simple JS and returns result', async () => {
  const sandbox = new ExtensionSandbox('eval-test');
  await sandbox.init();
  assert.equal(await sandbox.eval('const a = 20; a + 22;'), 42);
  sandbox.destroy();
});

test('ExtensionSandbox.eval rejects code that exceeds timeout', async () => {
  const sandbox = new ExtensionSandbox('timeout-test', { callTimeoutMs: 10 });
  await sandbox.init();
  await assert.rejects(() => sandbox.eval('while (true) {}'), /interrupted|Extension eval error/);
  sandbox.destroy();
});

test('ExtensionSandbox.eval rejects code that exceeds memory limit', async () => {
  const sandbox = new ExtensionSandbox('memory-test', { memoryLimitBytes: 1024 * 1024, callTimeoutMs: 250 });
  await sandbox.init();
  await assert.rejects(() => sandbox.eval('const x = []; while (true) x.push(new Array(10000).fill("x"));'), /out of memory|interrupted|Extension eval error/i);
  sandbox.destroy();
});

test('bindHostBridge installs only allowed permissions', async () => {
  const sandbox = new ExtensionSandbox('permission-test');
  await sandbox.init();
  bindHostBridge(sandbox, DEFAULT_PERMISSIONS, createMockHostBridge());
  assert.equal(await sandbox.eval('typeof kernel'), 'undefined');
  assert.equal(await sandbox.eval('typeof fetch'), 'undefined');
  assert.equal(await sandbox.eval('typeof XMLHttpRequest'), 'undefined');
  sandbox.destroy();
});

test('loadExtensionInSandbox runs synthetic extension and registers slash command via host bridge', async () => {
  const host = createMockHostBridge();
  const loaded = await loadSynthetic(host);
  assert.deepEqual(host.slashCommands, [{ name: 'uppercase', callbackId: 'cb-uppercase', helpString: 'Uppercase a string' }]);
  loaded.destroy();
});

test('loadExtensionInSandbox propagates setExtensionPrompt call to host', async () => {
  const host = createMockHostBridge();
  const loaded = await loadSynthetic(host);
  assert.deepEqual(host.prompts, [{ key: '1_synth', value: 'synth-prompt-text', position: 0, depth: 4, scan: false, role: 0 }]);
  loaded.destroy();
});

test('loadExtensionInSandbox propagates eventOn registration', async () => {
  const host = createMockHostBridge();
  const loaded = await loadSynthetic(host);
  assert.deepEqual(host.events, [{ eventName: 'USER_MESSAGE_RENDERED', callbackId: 'cb-on-user-msg' }]);
  loaded.destroy();
});

test('Activation hook is invoked with hostBridge.getContextSnapshot data', async () => {
  const host = createMockHostBridge({ chat: [{ mes: 'hello' }, { mes: 'world' }] });
  const loaded = await loadSynthetic(host);
  assert.equal(await loaded.sandbox.eval('globalThis.__activationChatLength'), 2);
  loaded.destroy();
});

test('Audit log records every host API call from sandbox', async () => {
  const host = createMockHostBridge();
  const loaded = await loadSynthetic(host);
  const apis = loaded.sandbox.getAuditLog().map((entry) => entry.api);
  assert.deepEqual(apis, ['getContext', 'registerSlashCommand', 'setExtensionPrompt', 'eventOn']);
  loaded.destroy();
});

test('Sandbox cannot access fetch, XMLHttpRequest, require, process', async () => {
  const sandbox = new ExtensionSandbox('globals-test');
  await sandbox.init();
  assert.deepEqual(
    await sandbox.eval('[typeof fetch, typeof XMLHttpRequest, typeof require, typeof process]'),
    ['undefined', 'undefined', 'undefined', 'undefined'],
  );
  sandbox.destroy();
});

async function loadSynthetic(hostBridge) {
  return loadExtensionInSandbox({
    record: {
      id: 'synth',
      manifest: { display_name: 'Synthetic', js: 'index.js', hooks: { activate: 'activate' } },
    },
    activationContext: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: '1.0.0',
    },
    basePath: '/scripts/extensions/synth',
    readSource: async (relPath) => {
      assert.equal(relPath, 'index.js');
      return SYNTHETIC_REGEX_EXT;
    },
    hostBridge,
  });
}

function createMockHostBridge(snapshot = { chat: [{ mes: 'hi' }], characters: [{ name: 'Bot' }] }) {
  const host = {
    prompts: [],
    slashCommands: [],
    events: [],
    emitted: [],
    settings: { enabled: true },
    getContextSnapshot() {
      return snapshot;
    },
    setExtensionPrompt(key, value, position, depth, scan, role) {
      host.prompts.push({ key, value, position, depth, scan, role });
    },
    registerSlashCommand(name, callbackId, helpString) {
      host.slashCommands.push({ name, callbackId, helpString });
    },
    eventOn(eventName, callbackId) {
      host.events.push({ eventName, callbackId });
    },
    eventEmit(eventName, payload) {
      host.emitted.push({ eventName, payload });
    },
    getSettings() {
      return host.settings;
    },
    setSettings(value) {
      host.settings = value;
    },
  };
  return host;
}
