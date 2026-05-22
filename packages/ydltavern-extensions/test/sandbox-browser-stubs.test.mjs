import assert from 'node:assert/strict';
import test from 'node:test';

import { ExtensionSandbox, installBrowserStubs } from '../dist/index.js';

test('document.createElement returns a stub element', async () => {
  const sandbox = await createBrowserSandbox();
  assert.equal(await sandbox.eval("document.createElement('div').tagName"), 'DIV');
  assert.ok(sandbox.getAuditLog().some((entry) => entry.api === 'document.createElement'));
  sandbox.destroy();
});

test('localStorage.getItem returns null for missing keys', async () => {
  const sandbox = await createBrowserSandbox();
  assert.equal(await sandbox.eval("localStorage.getItem('missing')"), null);
  sandbox.destroy();
});

test('localStorage round-trip: set then get', async () => {
  const sandbox = await createBrowserSandbox();
  assert.equal(await sandbox.eval("localStorage.setItem('a', 'b'); localStorage.getItem('a')"), 'b');
  sandbox.destroy();
});

test('localStorage.removeItem deletes', async () => {
  const sandbox = await createBrowserSandbox();
  assert.equal(await sandbox.eval("localStorage.setItem('a', 'b'); localStorage.removeItem('a'); localStorage.getItem('a')"), null);
  sandbox.destroy();
});

test('fetch throws blocked-in-sandbox error', async () => {
  const sandbox = await createBrowserSandbox();
  await assert.rejects(() => sandbox.eval('fetch("https://example.invalid")'), /fetch is blocked in sandbox v1/);
  sandbox.destroy();
});

test('indexedDB.open throws blocked error', async () => {
  const sandbox = await createBrowserSandbox();
  await assert.rejects(() => sandbox.eval("indexedDB.open('db')"), /indexedDB is blocked in sandbox v1/);
  sandbox.destroy();
});

test('crypto.randomUUID returns a deterministic UUID-shaped string when seeded', async () => {
  const a = await createBrowserSandbox('seeded');
  const b = await createBrowserSandbox('seeded');
  const uuidA = await a.eval('crypto.randomUUID()');
  const uuidB = await b.eval('crypto.randomUUID()');
  assert.match(uuidA, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(uuidA, uuidB);
  a.destroy();
  b.destroy();
});

test('performance.now returns a number', async () => {
  const sandbox = await createBrowserSandbox();
  assert.equal(await sandbox.eval('typeof performance.now()'), 'number');
  sandbox.destroy();
});

test('window.matchMedia returns { matches: false }', async () => {
  const sandbox = await createBrowserSandbox();
  assert.deepEqual(await sandbox.eval("window.matchMedia('(max-width: 1px)').matches"), false);
  sandbox.destroy();
});

test('requestAnimationFrame fires the callback via setTimeout-like behavior', async () => {
  const sandbox = await createBrowserSandbox();
  assert.equal(await sandbox.eval('let fired = false; requestAnimationFrame(() => { fired = true; }); fired'), true);
  sandbox.destroy();
});

test('DOMException class is constructible', async () => {
  const sandbox = await createBrowserSandbox();
  assert.deepEqual(await sandbox.eval("const e = new DOMException('nope', 'Blocked'); [e.name, e.message]"), ['Blocked', 'nope']);
  sandbox.destroy();
});

async function createBrowserSandbox(seed = 'browser') {
  const sandbox = new ExtensionSandbox('browser', { seed });
  await sandbox.init();
  installBrowserStubs(sandbox, { seed });
  return sandbox;
}
