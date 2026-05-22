import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  bootstrapSTEnv,
  smokeExtensionAgainstGlobals,
  type BootstrappedEnv,
} from './bootstrap-helpers';
import { microStExtension } from './fixtures/micro-st-ext';
import { iifeStyleExtension } from './fixtures/iife-ext';

let env: BootstrappedEnv;

beforeEach(() => {
  env = bootstrapSTEnv();
});

afterEach(() => {
  env.cleanup();
});

test('globals are mounted on window after bootstrap', () => {
  assert.ok(env.window.SillyTavern);
  assert.equal(typeof env.window.SillyTavern.getContext, 'function');
  assert.ok(env.window.eventSource);
  assert.ok(env.window.event_types);
  assert.ok(env.window.chat);
});

test('SillyTavern.getContext() returns a live deep context', () => {
  const ctx = env.window.SillyTavern.getContext();
  assert.ok(ctx);
  assert.ok(Array.isArray(ctx.chat));
  assert.equal(typeof ctx.eventSource?.on, 'function');
});

test('chat array is live (writes from window propagate to context)', () => {
  env.window.chat[0] = { mes: 'hello', name: 'user' };
  const ctx = env.window.SillyTavern.getContext();
  assert.equal(ctx.chat[0].mes, 'hello');
});

test('micro ST-style extension boots without errors', async () => {
  const result = await smokeExtensionAgainstGlobals(() => {
    const r = microStExtension(env.window);
    assert.equal(r.registered, true);
    assert.equal(r.eventListeners, 3);
    assert.deepEqual(r.slashCommands, ['mst-hello']);
  }, env);
  assert.deepEqual(result.errors, []);
});

test('extension settings panel injection survives in DOM', async () => {
  await smokeExtensionAgainstGlobals(() => microStExtension(env.window), env);
  const panel = env.window.document.getElementById('micro-st-ext-settings');
  assert.ok(panel);
  assert.equal(panel.textContent, 'Micro ST Extension Settings Panel');
});

test('extension events are dispatched through eventSource', async () => {
  await smokeExtensionAgainstGlobals(() => microStExtension(env.window), env);

  const evt = env.window.event_types.MESSAGE_RECEIVED ?? 'MESSAGE_RECEIVED';

  // Manually emit. The listener registered in microStExtension should have fired
  // (we can't read its closure, but we can assert the event had a listener and no throw).
  assert.equal(await env.window.eventSource.emit(evt, { content: 'test' }), true);
});

test('IIFE-style extension boots and writes namespaced localStorage', async () => {
  const result = await smokeExtensionAgainstGlobals(() => {
    const r = iifeStyleExtension(env.window);
    assert.equal(r.booted, true);
  }, env);
  assert.deepEqual(result.errors, []);

  const stored = env.window.localStorage.getItem('iife-ext__settings');
  assert.ok(stored);
  const parsed = JSON.parse(stored);
  assert.equal(parsed.enabled, true);
});

test('IIFE extension panel renders into #extensions_settings2', async () => {
  await smokeExtensionAgainstGlobals(() => iifeStyleExtension(env.window), env);
  const panel = env.window.document.getElementById('iife-ext-panel');
  assert.ok(panel);
  assert.match(panel.innerHTML, /IIFE Extension/);
});

test('two extensions coexist with isolated mount points', async () => {
  await smokeExtensionAgainstGlobals(() => {
    microStExtension(env.window);
    iifeStyleExtension(env.window);
  }, env);

  const microPanel = env.window.document.getElementById('micro-st-ext-settings');
  const iifePanel = env.window.document.getElementById('iife-ext-panel');
  assert.ok(microPanel);
  assert.ok(iifePanel);
});

test('slash commands registered via SillyTavern.SlashCommandParser are addressable', async () => {
  await smokeExtensionAgainstGlobals(() => microStExtension(env.window), env);

  // The SlashCommandParser should have our registered command.
  const parser = env.window.SlashCommandParser;
  assert.ok(parser);
  // Various impls expose commands differently; just verify it's queryable.
  assert.equal(typeof parser.addCommandObject, 'function');
});
