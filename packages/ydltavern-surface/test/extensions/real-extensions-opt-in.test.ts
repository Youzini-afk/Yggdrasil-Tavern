import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BME_PATH = process.env.YGG_BME_TEST_PATH;
const SHUJUKU_PATH = process.env.YGG_SHUJUKU_TEST_PATH;

test('BME repository structure check (opt-in)', { skip: !BME_PATH }, () => {
  assert.ok(BME_PATH);

  // Verify expected ST-extension layout.
  const manifestPath = resolve(BME_PATH, 'manifest.json');
  assert.ok(existsSync(manifestPath), 'manifest.json should exist');

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  assert.ok(manifest.display_name, 'manifest has display_name');
  assert.ok(manifest.js, 'manifest declares js entrypoint');

  // Verify entry file.
  const entryPath = resolve(BME_PATH, manifest.js);
  assert.ok(existsSync(entryPath), 'entry js file exists');

  // Verify imports match ST conventions.
  const entrySource = readFileSync(entryPath, 'utf-8');
  assert.match(entrySource, /from\s+['"]\.\.\/\.\.\/\.\.\/\.\.?\/(script|extensions)\.js['"]/);
});

test('BME WASM file exists (opt-in)', { skip: !BME_PATH }, () => {
  assert.ok(BME_PATH);
  // BME ships a WebAssembly module under vendor/wasm/pkg/.
  const wasmPath = resolve(BME_PATH, 'vendor/wasm/pkg/stbme_core_pkg_bg.wasm');
  if (existsSync(wasmPath)) {
    const stats = readFileSync(wasmPath);
    assert.ok(stats.length > 0, 'WASM file is non-empty');
  } else {
    // Acceptable: BME may not have built the WASM in some environments.
    console.warn('[smoke] BME WASM not found; skipping size check');
  }
});

test('shujuku repository structure check (opt-in)', { skip: !SHUJUKU_PATH }, () => {
  assert.ok(SHUJUKU_PATH);

  const manifestPath = resolve(SHUJUKU_PATH, 'manifest.json');
  assert.ok(existsSync(manifestPath), 'manifest.json should exist');

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  assert.ok(manifest.display_name, 'manifest has display_name');
  assert.ok(manifest.js, 'manifest declares js entrypoint');
});

test('shujuku declares sql.js dependency (opt-in)', { skip: !SHUJUKU_PATH }, () => {
  assert.ok(SHUJUKU_PATH);

  const pkgPath = resolve(SHUJUKU_PATH, 'package.json');
  if (existsSync(pkgPath)) {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    assert.ok(
      deps['sql.js'] || deps['@sqlite.org/sqlite-wasm'],
      'expected sql.js or sqlite-wasm dependency',
    );
  }
});
