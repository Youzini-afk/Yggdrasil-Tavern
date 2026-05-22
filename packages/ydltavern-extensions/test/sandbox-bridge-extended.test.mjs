import assert from 'node:assert/strict';
import test from 'node:test';

import { bindHostBridge, DEFAULT_PERMISSIONS, ExtensionSandbox } from '../dist/index.js';
import { ExtensionPromptStore } from '@ydltavern/st-compat';

test('event_types global exposes ST_EVENT_TYPES', async () => {
  const { sandbox } = await createBoundSandbox(true);
  assert.equal(await sandbox.eval('event_types.APP_READY'), 'app_ready');
  sandbox.destroy();
});

test('extension_prompt_types global is { NONE, IN_PROMPT, IN_CHAT, BEFORE_PROMPT }', async () => {
  const { sandbox } = await createBoundSandbox(true);
  assert.deepEqual(await sandbox.eval('extension_prompt_types'), { NONE: -1, IN_PROMPT: 0, IN_CHAT: 1, BEFORE_PROMPT: 2 });
  sandbox.destroy();
});

test('getRequestHeaders returns content-type json', async () => {
  const { sandbox } = await createBoundSandbox(true);
  assert.deepEqual(await sandbox.eval('getRequestHeaders()'), { 'Content-Type': 'application/json' });
  sandbox.destroy();
});

test('saveSettingsDebounced is callable and audited', async () => {
  const { sandbox } = await createBoundSandbox(true);
  await sandbox.eval('saveSettingsDebounced()');
  assert.ok(sandbox.getAuditLog().some((entry) => entry.api === 'saveSettingsDebounced'));
  sandbox.destroy();
});

test('saveMetadata is callable and audited', async () => {
  const { sandbox } = await createBoundSandbox(true);
  await sandbox.eval('saveMetadata()');
  assert.ok(sandbox.getAuditLog().some((entry) => entry.api === 'saveMetadata'));
  sandbox.destroy();
});

test('getTokenCountAsync returns char/3.35 approximation', async () => {
  const { sandbox } = await createBoundSandbox(true);
  assert.equal(await sandbox.eval("getTokenCountAsync('abcdefghij')"), 3);
  sandbox.destroy();
});

test('getExtensionPrompt reads from ExtensionPromptStore', async () => {
  const extensionPrompts = new ExtensionPromptStore();
  extensionPrompts.set('test', 'stored prompt', 0, 4, false, 0);
  const { sandbox } = await createBoundSandbox(true, { extensionPrompts });
  assert.equal(await sandbox.eval('getExtensionPrompt(extension_prompt_types.IN_PROMPT, 4)'), 'stored prompt');
  sandbox.destroy();
});

test('substituteParams returns text unchanged when no host bridge', async () => {
  const { sandbox } = await createBoundSandbox(true);
  assert.equal(await sandbox.eval("substituteParams('hello {{user}}')"), 'hello {{user}}');
  sandbox.destroy();
});

test('extended bridge surfaces are NOT available when realExtensionLoad: false', async () => {
  const { sandbox } = await createBoundSandbox(false);
  assert.deepEqual(await sandbox.eval('[typeof event_types, typeof getRequestHeaders, typeof saveMetadata]'), ['undefined', 'undefined', 'undefined']);
  sandbox.destroy();
});

async function createBoundSandbox(realExtensionLoad, overrides = {}) {
  const sandbox = new ExtensionSandbox(`bridge-${realExtensionLoad}`);
  await sandbox.init();
  const hostBridge = { ...createMockHostBridge(), ...overrides };
  bindHostBridge(sandbox, { ...DEFAULT_PERMISSIONS, realExtensionLoad }, hostBridge);
  return { sandbox, hostBridge };
}

function createMockHostBridge() {
  return {
    getContextSnapshot() { return { chat: [], chatMetadata: {} }; },
    setExtensionPrompt() {},
    registerSlashCommand() {},
    eventOn() {},
    eventEmit() {},
    getSettings() { return {}; },
    setSettings() {},
  };
}
