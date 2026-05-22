# Real extension loading

> [English](./REAL_EXTENSION_LOADING.en.md) · [中文](./REAL_EXTENSION_LOADING.md)

This guide explains how the YdlTavern sandbox loads real SillyTavern-style ESM extensions, which capabilities are enabled, which capabilities remain blocked, and how to write smoke tests.

## Overview

Real extension loading means the QuickJS sandbox is no longer limited to a single-file synthetic fixture. It can read an ESM entry file from an extension directory, parse same-package relative imports, inject the ST host API bridge, and run extension initialization code.

Currently enabled:

- QuickJS module-mode ESM execution.
- Recursive preloading for same-package relative imports.
- Virtual module mapping for common ST host import paths.
- Minimal browser API stubs.
- Extended ST API bridge surface.
- Audit log for host API calls.
- Always-on synthetic micro-BME smoke.
- Env-gated real BME smoke.

Currently blocked:

- Network: `fetch`, XHR, `WebSocket`.
- Browser local databases: `indexedDB`, OPFS.
- `Worker` and WASM native acceleration.
- Real DOM rendering and complex UI lifecycle.
- npm bare imports; dependencies must be vendored into the extension package.

## Permission gate

Real extension loading is explicit opt-in. Sandbox loader calls must grant:

```ts
permissions: {
  realExtensionLoad: true,
}
```

Without this flag, the sandbox keeps the default behavior used by synthetic tests: minimal bridge only, with no recursive ESM package reads from a real extension directory. This prevents existing unit tests and low-trust execution paths from accidentally gaining a larger capability surface.

`realExtensionLoad` only permits reading caller-provided extension package files and enabling the ESM loader. It does not permit network, IndexedDB, Worker, WebSocket, or real DOM access.

## ESM module loading

The loader starts from the extension entrypoint, usually `index.js` or the script named by the manifest:

1. Read entry source.
2. Parse static `import ... from '...'` statements.
3. Resolve `./` and `../` relative specifiers to files under the same extension root.
4. Recursively preload those modules.
5. Evaluate them in QuickJS module mode.

Resolution is bounded to the extension root. The loader does not escape to arbitrary host paths, does not resolve npm bare imports, and does not automatically read `node_modules`. Real third-party extensions that depend on package-manager output should bundle or vendor those dependencies into the extension directory.

## Virtual ST host module

SillyTavern extensions often import host files through relative paths, for example:

```js
import { event_types, getRequestHeaders } from '../../../../script.js';
import { extension_prompt_types } from '../../../extensions.js';
import { getTokenCountAsync } from '../../../../openai.js';
```

YdlTavern does not read real SillyTavern source files. The loader maps these host paths to one virtual module that only exports APIs allowed by the sandbox bridge. Current mappings include:

- `../../../../script.js`
- `../../../extensions.js`
- `../../../../openai.js`

Future work will add smarter path-pattern support, including BME-style paths such as `regex/engine.js`.

## Browser stubs

Available stubs:

- `document`
- `window`
- `localStorage`
- `sessionStorage`
- `performance`
- `crypto`
- `AbortController`
- `DOMException`
- `matchMedia`
- `requestAnimationFrame`

These stubs only support initialization, event registration, settings access, and similar logic paths. They are not a real browser DOM and do not promise UI rendering.

Blocked APIs:

- `fetch`: throws a blocked error.
- `indexedDB`: throws a blocked error.
- `Worker`: throws a blocked error.
- `WebSocket`: throws a blocked error.

Extensions that need outbound access must not call `fetch` directly. Future support should expose audited paths through a Yggdrasil host outbound capability bridge.

## ST API bridge surface

The U0 baseline already includes:

- `getContext`
- event on/emit
- `registerSlashCommand`
- `setExtensionPrompt`
- settings bridge

Real extension loading additionally exposes:

- `event_types`
- `extension_prompt_types`
- `extension_prompt_roles`
- `getRequestHeaders`
- `saveSettingsDebounced`
- `saveMetadata`
- `saveMetadataDebounced`
- `reloadCurrentChat`
- `updateChatMetadata`
- `getExtensionPrompt`
- `substituteParams`
- `getTokenCountAsync`

These APIs are implemented through the host bridge. Noop-style functions still record audit entries; state-changing functions write through to YdlTavern settings, metadata, or extension prompt stores.

## Audit log

Every host API call enters the sandbox audit log. Entries record call name, time, extension identity, and redacted argument shape; raw secrets are not recorded. The audit log keeps real extension loading explainable: even if a stub is a noop, you can see what the extension attempted to call.

## Smoke test pattern

See `packages/ydltavern-extensions/test/sandbox-real-extension.test.mjs`.

A typical test flow:

1. Create a sandbox runtime.
2. Create a host bridge with settings, metadata, extension prompt store, and event bus.
3. Grant `realExtensionLoad: true`.
4. Point the loader at an extension root and entry file.
5. Evaluate the ESM extension through the loader.
6. Assert that the extension registered event listeners, wrote settings, called `setExtensionPrompt`, or used another host API.
7. Read the audit log and verify call order and argument shapes.

Minimal smokes should avoid real network, IndexedDB, Worker, WASM, or DOM rendering. `test/fixtures/micro-bme/` is the recommended shape: it mimics a real extension's ESM/import/API call pattern while staying small and deterministic.

## Real BME

Real BME smoke is opt-in:

```bash
YGG_BME_TEST_PATH=/path/to/extension npm test --prefix packages/ydltavern-extensions
```

When `YGG_BME_TEST_PATH` is not set, this test is skipped; CI still runs synthetic micro-BME.

Real BME is **not a full boot** today. It advances into deeper import/stub paths during initialization, then stops on limitations such as the missing `regex/engine.js` import path. This is a known limitation: BME source contains path shapes that loader v1 does not yet cover, plus IndexedDB/Dexie/OPFS/fetch/WASM/UI dependencies.

The current claim is therefore limited: the sandbox can load a real ESM extension entry and advance through part of init; synthetic micro-BME passes always-on; real BME requires env opt-in and has not fully booted.

## Limitations

- **No fetch**: `fetch` is blocked inside the sandbox. Use Yggdrasil host outbound through a capability bridge for audited outbound access.
- **No IndexedDB/OPFS**: only host-bridge state such as settings, metadata, and prompt store is available; no browser persistent database is provided.
- **No Worker/WASM**: background threads and native acceleration are outside v1 capability.
- **No real DOM rendering**: UI extensions can register, initialize, and read/write settings, but complex panels will not render.
- **Single-package bundle**: only same-package relative imports are resolved. npm bare imports, external `node_modules`, and arbitrary host paths are unsupported; vendor dependencies.

## Forward work

- Smarter ESM resolution for paths such as BME's `regex/engine.js`.
- Basic `Map`-backed IndexedDB stub for initialization-time schema/setup.
- Audited fetch bridge routed through Yggdrasil outbound.
- WASM loading through a host bridge.
- Worker stub.
- Full BME functional smoke once browser stubs are richer.
