import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, it } from 'node:test';

const compatRoot = resolve('public/st-compat');
const scriptPath = resolve(compatRoot, 'script.js');
const scriptsRoot = resolve(compatRoot, 'scripts');

async function importFresh(path: string) {
  const url = pathToFileURL(path);
  url.searchParams.set('t', `${Date.now()}-${Math.random()}`);
  return import(url.href);
}

async function importFromSource(source: string) {
  const dir = await mkdtemp(join(tmpdir(), 'ydl-st-compat-'));
  const file = join(dir, 'shim.mjs');
  await writeFile(file, source, 'utf8');
  try {
    return await importFresh(file);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

describe('ST compatibility shims', () => {
  it('script.js declares core ST exports', () => {
    const src = readFileSync(scriptPath, 'utf8');
    assert.match(src, /^export const eventSource/m);
    assert.match(src, /^export const event_types/m);
    assert.match(src, /^export const chat/m);
    assert.match(src, /^export const characters/m);
    assert.match(src, /^export const getRequestHeaders/m);
  });

  it('script.js chat and characters proxies read through globalThis', async () => {
    (globalThis as typeof globalThis & { chat?: unknown[]; characters?: unknown[] }).chat = [{ mes: 'hello' }];
    (globalThis as typeof globalThis & { chat?: unknown[]; characters?: unknown[] }).characters = [{ name: 'Bot' }];
    const shim = await importFresh(scriptPath);
    assert.equal(shim.chat[0].mes, 'hello');
    assert.equal(shim.characters[0].name, 'Bot');
    (globalThis as typeof globalThis & { chat?: unknown[] }).chat = [{ mes: 'updated' }];
    assert.equal(shim.chat[0].mes, 'updated');
  });

  it('script.js function passthroughs call current globals', async () => {
    const source = readFileSync(scriptPath, 'utf8').replace(
      /^export const getRequestHeaders = call\('getRequestHeaders'\);/m,
      'export const getRequestHeadersForTest = call(\'getRequestHeaders\');',
    );
    (globalThis as typeof globalThis & { getRequestHeaders?: () => string }).getRequestHeaders = () => 'headers';
    const shim = await importFromSource(source);
    assert.equal(shim.getRequestHeadersForTest(), 'headers');
  });

  it('extensions.js exports settings and getContext', async () => {
    (globalThis as typeof globalThis & { SillyTavern?: { getContext: () => object }; extension_settings?: object }).SillyTavern = {
      getContext: () => ({ ok: true }),
    };
    (globalThis as typeof globalThis & { extension_settings?: { apiUrl: string } }).extension_settings = { apiUrl: 'http://extras' };
    const shim = await importFresh(join(scriptsRoot, 'extensions.js'));
    assert.equal(shim.extension_settings.apiUrl, 'http://extras');
    assert.deepEqual(shim.getContext(), { ok: true });
    assert.equal(typeof shim.ModuleWorkerWrapper, 'function');
  });

  it('events.js exports eventSource and event_types from globals', async () => {
    const eventSource = { emit() {} };
    const event_types = { APP_READY: 'app_ready' };
    Object.assign(globalThis, { eventSource, event_types });
    const shim = await importFresh(join(scriptsRoot, 'events.js'));
    assert.equal(shim.eventSource, eventSource);
    assert.equal(shim.event_types, event_types);
  });

  it('st-context.js getContext returns SillyTavern context', async () => {
    (globalThis as typeof globalThis & { SillyTavern?: { getContext: () => object } }).SillyTavern = {
      getContext: () => ({ context: 1 }),
    };
    const shim = await importFresh(join(scriptsRoot, 'st-context.js'));
    assert.deepEqual(shim.getContext(), { context: 1 });
  });

  it('group-chats.js mirrors selected_group and function exports', async () => {
    Object.assign(globalThis, { selected_group: 'group-1', groups: [{ id: 'group-1' }], getGroupMembers: () => ['a'] });
    const shim = await importFresh(join(scriptsRoot, 'group-chats.js'));
    assert.equal(shim.selected_group, 'group-1');
    assert.equal(shim.groups[0].id, 'group-1');
    assert.deepEqual(shim.getGroupMembers(), ['a']);
  });

  it('secrets.js hides secret state and exports safe helpers', async () => {
    const shim = await importFresh(join(scriptsRoot, 'secrets.js'));
    assert.equal(shim.secret_state.OPENAI, false);
    assert.equal(shim.SECRET_KEYS.OPENAI, 'api_key_openai');
    assert.deepEqual(await shim.readSecretState(), {});
    assert.equal(await shim.findSecret(), null);
  });

  it('power-user.js exports power_user from globals', async () => {
    const power_user = { fast_ui_mode: true };
    Object.assign(globalThis, { power_user });
    const shim = await importFresh(join(scriptsRoot, 'power-user.js'));
    assert.equal(shim.power_user, power_user);
  });
});
