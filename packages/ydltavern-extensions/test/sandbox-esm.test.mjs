import assert from 'node:assert/strict';
import test from 'node:test';

import { ExtensionSandbox, loadExtensionInSandbox } from '../dist/index.js';

test('evalModule runs a simple ESM module that exports a default', async () => {
  const sandbox = new ExtensionSandbox('esm-default');
  await sandbox.init();
  assert.deepEqual(await sandbox.evalModule('export default 42;', 'entry.js'), { default: 42 });
  sandbox.destroy();
});

test('loader resolves relative imports and pre-loads them', async () => {
  const loaded = await loadReal({
    'index.js': "import { value } from './lib/value.js'; globalThis.__result = value; export const activate = () => value;",
    'lib/value.js': 'export const value = 7;',
  });
  assert.equal(await loaded.sandbox.eval('globalThis.__result'), 7);
  loaded.destroy();
});

test('loader maps ST host imports to virtual module', async () => {
  const loaded = await loadReal({
    'index.js': "import { event_types, getRequestHeaders } from '../../../../script.js'; globalThis.__mapped = [event_types.APP_READY, getRequestHeaders()['Content-Type']];",
  });
  assert.deepEqual(await loaded.sandbox.eval('globalThis.__mapped'), ['app_ready', 'application/json']);
  loaded.destroy();
});

test('loader rejects bare npm imports with clear error', async () => {
  await assert.rejects(
    () => loadReal({ 'index.js': "import thing from 'left-pad'; globalThis.thing = thing;" }),
    /bare npm imports not supported in sandbox v1; vendor the dependency/,
  );
});

test("multi-file extension with import './lib/util.js' loads util before entry", async () => {
  const loaded = await loadReal({
    'index.js': "import './lib/util.js'; globalThis.__entrySawUtil = globalThis.__utilLoaded === true;",
    'lib/util.js': 'globalThis.__utilLoaded = true; export {};',
  });
  assert.equal(await loaded.sandbox.eval('globalThis.__entrySawUtil'), true);
  loaded.destroy();
});

async function loadReal(sources) {
  return loadExtensionInSandbox({
    record: { id: 'real', manifest: { display_name: 'Real', js: 'index.js' } },
    activationContext: { installedExtras: new Set(), installedExtensions: new Set(), disabledExtensions: new Set(), clientVersion: '1.0.0' },
    basePath: '/scripts/extensions/real',
    readSource: async (relPath) => {
      assert.ok(relPath in sources, `unexpected source read: ${relPath}`);
      return sources[relPath];
    },
    hostBridge: createMockHostBridge(),
    permissions: { realExtensionLoad: true },
  });
}

function createMockHostBridge() {
  return {
    getContextSnapshot() { return { chat: [] }; },
    setExtensionPrompt() {},
    registerSlashCommand() {},
    eventOn() {},
    eventEmit() {},
    getSettings() { return {}; },
    setSettings() {},
  };
}
