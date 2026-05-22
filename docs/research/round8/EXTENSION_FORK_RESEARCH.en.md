# Round 8 Extension Fork Research

> [English](./EXTENSION_FORK_RESEARCH.en.md) · [中文](./EXTENSION_FORK_RESEARCH.md)

This archive summarizes the Round 8 research that led to the Y-track implementation. The temporary reports were written under `/tmp/opencode`; this durable version records the conclusions from the plan, implementation commits, and compatibility docs.

## Scope

Round 8 asked whether YdlTavern should keep treating ST extensions as untrusted sandboxed scripts or become a proper ST DOM fork. The answer was: unmodified ST extension compatibility requires a same-window host.

## Three Audit Dimensions

The research combined three dimensions:

1. **ST source contract audit** — what SillyTavern exposes to extensions in practice.
2. **YdlTavern surface gap audit** — what the React shell was missing before Round 8.
3. **Library and rendering landscape** — which markdown/sanitizer/runtime choices preserve ST behavior.

The result became the Y-track work: formatting pipeline, DOM territory cession, window globals bootstrap, ESM URL shims, Vite middleware, and real extension smoke tests.

## ST Source Contract

The ST source audit found that extensions rely on a broad ambient environment rather than a narrow plugin API:

- `messageFormatting()` in `script.js` performs regex hooks, quote/code protection, showdown rendering, DOMPurify sanitization, and post-processing.
- `chats.js` configures DOMPurify hooks that mutate links, class names, media elements, and custom style blocks.
- extension code imports top-level values from `script.js`, `scripts/extensions.js`, `scripts/events.js`, and related files.
- extension code also reads `window.SillyTavern`, `eventSource`, `chat`, `characters`, `extension_settings`, jQuery, and legacy libraries.
- extension UI assumes concrete DOM IDs such as `#chat`, `#extensions_settings`, `#extensionsMenu`, and `#movingDivs`.

The important conclusion: the contract is not just TypeScript-shaped API calls. It is a page-level contract made of globals, DOM, import paths, and permissive access.

## YdlTavern Gap Audit

Before Round 8, YdlTavern already had deep ST runtime work: `getContext()`, `eventSource`, slash commands, macro engine, loader planning, and QuickJS sandbox tests. But the React surface did not yet present the same page shape as ST.

Major gaps were:

- `.mes_text` was rendered as plain React text rather than ST-formatted sanitized HTML.
- `#chat` and several extension anchors were missing.
- extension settings panels were React-owned instead of ceded to jQuery-style mutation.
- ST globals existed inside compatibility modules or sandbox bridges, not on the real `globalThis` page.
- standard ST ESM URLs such as `/script.js` and `/scripts/extensions.js` were absent.
- smoke tests verified synthetic sandbox loading more than real same-window bootstrap behavior.

Round 8 closed those gaps for the Y-track.

## Library and Rendering Landscape

The rendering audit compared possible markdown and sanitizer choices. ST's observable behavior comes from `showdown` plus DOMPurify hooks, not from a generic markdown renderer.

YdlTavern therefore uses:

- `showdown` with ST-aligned options and extensions;
- DOMPurify with ST-shaped hook behavior;
- explicit style-tag encode/decode behavior where needed;
- formatting hooks before markdown, before sanitize, and after render.

Alternatives such as `marked`, `markdown-it`, or React markdown components were rejected for Round 8 because they would produce different HTML trees and force a growing compatibility patch layer.

## Why Same-Window React + DOM Cession

Iframe sandboxing was the wrong default for ST extension compatibility. Many community extensions assume:

- synchronous access to `window` globals;
- direct jQuery selectors against the host document;
- mutation of extension settings panels and message button slots;
- localStorage, IndexedDB, Worker, WASM, and fetch in the page runtime;
- relative ESM imports that resolve to ST's URL layout.

Putting each extension in an iframe would require async bridges for almost every operation and would force extensions to be rewritten or wrapped. That would create a new extension platform rather than a fork-compatible host.

The chosen model is therefore:

- React renders the product shell and ST anchors;
- explicit DOM territories are ceded to extension mutation;
- React continues to own stateful product controls such as `#send_textarea` and `#send_but`;
- extension callbacks are error-isolated, not permission-isolated.

This matches ST's trust model and maximizes compatibility.

## Why Showdown + DOMPurify Direct Integration

`messageFormatting()` is a high-frequency compatibility boundary. Extensions and users notice small HTML differences.

Direct integration was chosen because:

- ST uses showdown options that affect underscores, tables, image dimensions, emoji, and line breaks;
- ST's DOMPurify hooks implement link target/rel behavior, class prefixing, media allow-lists, and custom style handling;
- React markdown renderers would turn markdown into React element trees, not the same HTML string contract;
- sanitizer differences can become security differences and compatibility differences at the same time;
- tests can assert the exact HTML output of YdlTavern's pipeline.

This does not mean every ST edge case is globally proven, but it means the implementation follows the same architectural path.

## Why ESM Shim Files at Standard URLs

Runtime injection was considered and rejected as the primary mechanism. ST extensions often contain static imports such as:

```js
import { eventSource } from '../../../script.js';
import { extension_settings } from '../../extensions.js';
```

Browsers resolve those imports before extension code executes. A runtime global injection cannot satisfy missing module URLs.

Standard URL shim files solve this directly:

- `/script.js` exports live values from `globalThis`;
- `/scripts/extensions.js` exports extension manager values;
- `/scripts/events.js`, `/scripts/st-context.js`, `/scripts/group-chats.js`, `/scripts/secrets.js`, and `/scripts/power-user.js` fill common import targets;
- extension-relative imports continue to work unchanged.

Development uses Vite middleware. Production hosting uses a host static route.

## Trust Model Decision

Round 8 deliberately adopted ST's trust model for same-window extensions:

- no per-extension permission prompt;
- no capability grant manifest;
- no iframe boundary;
- community curation and user discretion;
- diagnostic transparency in a future Activity Drawer.

This is not weaker than ST; it is the same model. It is also the only model that supports the compatibility promise without rewriting community extensions.

## Implemented Y-track Outputs

The durable outputs of the research are:

- ST-compatible formatting pipeline using showdown + DOMPurify + hooks.
- ST DOM anchors rendered by the React shell.
- Explicit jQuery let-go zones for extension-owned containers.
- `mountSTGlobals()` for page-level globals.
- ESM shim files at the standard ST URL layout.
- Vite middleware for dev serving of those URLs.
- Real extension smoke tests for BME and shujuku bootstrap paths.

## Future Work

Round 9 should build on this without changing the compatibility promise:

- production extension hosting route for `/scripts/extensions/<id>/`;
- Activity Drawer for transparent extension audit signals;
- more legacy library shims as real extensions reveal them;
- continued compatibility records for concrete community extensions.
