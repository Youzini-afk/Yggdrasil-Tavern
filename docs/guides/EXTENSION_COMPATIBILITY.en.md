# Extension Compatibility (ST extensions run unmodified)

> [English](./EXTENSION_COMPATIBILITY.en.md) · [中文](./EXTENSION_COMPATIBILITY.md)

YdlTavern's extension compatibility model is the same-window SillyTavern DOM fork (replacing the older sandbox approximation). Existing ST extensions should load with their existing files, imports, globals, DOM selectors, and storage assumptions.

## Compatibility Promise

YdlTavern hosts SillyTavern extensions without requiring modifications. The hosting model mirrors ST's:

- Extensions execute in the same window as YdlTavern.
- All ST DOM IDs are present: `#chat`, `#extensions_settings`, `#extensionsMenu`, `#movingDivs`, `#leftSendForm`, `#rightSendForm`, `.mes`, `.mes_text`, `.mes_buttons`.
- All ST globals are mounted: `window.SillyTavern`, `eventSource`, `chat`, `characters`, and related context fields.
- ESM imports of `../../../script.js` and `../../extensions.js` resolve to compatibility shims.
- Extensions get full DOM, `fetch`, IndexedDB, WASM, Worker, and `localStorage` access in the page runtime.
- The trust model is the same as ST: community curation plus user discretion.

## Installation

Extensions install through Yggdrasil's git package channel:

```bash
ygg-cli install <github-url>
```

The host extracts to its managed extensions directory and exposes them at:

```text
/scripts/extensions/<id>/
```

Extensions that already use ST-style relative imports continue to import from their normal locations. They do not need a YdlTavern-specific manifest or rewrite step.

## Runtime Shape

YdlTavern runs the React shell, the ST compatibility layer, and third-party ST extensions in one browser window. This deliberately matches ST instead of creating an iframe-per-extension runtime.

The consequences are intentional:

- extensions can use normal DOM APIs and jQuery selectors;
- extensions can read and write ST-shaped globals;
- extensions can append controls into ST DOM anchors;
- extension errors are isolated with callback-level `try/catch`, not with a hard security sandbox;
- malicious extensions have page-level power, just like in ST.

## DOM Contract

YdlTavern's React shell renders these stable DOM anchors:

| ID/Selector | Purpose | Owner |
|---|---|---|
| `#chat` | Message list container | React (read-only for ext) |
| `.mes` / `.mes_block` | Per-message wrapper | React renders |
| `.mes_text` | Formatted HTML message body | React + `dangerouslySetInnerHTML` |
| `.mes_buttons_extra` | Per-message extension button mount slot | React lets go |
| `#extensions_settings` | Primary extension settings panel | React lets go |
| `#extensions_settings2` | Secondary extension settings panel | React lets go |
| `#extensionsMenu` | Top-bar extension popup menu | React lets go |
| `#movingDivs` | Floating popup container | React lets go |
| `#leftSendForm` | Send-form left button area | React lets go |
| `#rightSendForm` | Send-form right button area | React lets go |
| `#send_textarea` | Chat input textarea | React owns |
| `#send_but` | Send button | React owns |

"React lets go" means React renders the empty container once and never updates its children. Extensions can append children freely without React wiping them on the next render.

## Message HTML

Message bodies are rendered as sanitized HTML, not as plain React text children. The pipeline is the ST-compatible `messageFormatting()` path:

```text
raw text
  → extension pre-markdown hooks
  → quote/code protection
  → showdown markdown conversion
  → DOMPurify sanitization and hooks
  → style tag decoding / class prefixing
  → extension post-render hooks
```

The `.mes_text` node is the stable handoff point. React owns the initial formatted HTML. Extensions may inspect it, add buttons elsewhere, or mutate explicitly ceded child zones.

## Global API Surface

After `mountSTGlobals`, these are available on `globalThis` / `window`:

- `SillyTavern.{libs, getContext}`
- `eventSource`, `event_types`
- `chat`, `characters`, `this_chid`, `chat_metadata`
- `extension_settings`, `extension_prompt_types`, `extension_prompt_roles`
- `groups`, `selected_group`, `name1`, `name2`
- `SlashCommandParser`, `registerSlashCommand`
- `getRequestHeaders`, `saveSettingsDebounced`, `saveMetadata`, `saveMetadataDebounced`
- `reloadCurrentChat`, `saveChat`, `updateChatMetadata`, `addOneMessage`, `deleteLastMessage`
- `substituteParams`, `messageFormatting`, `callPopup`
- `setExtensionPrompt`, `getExtensionPrompt`, `getCurrentChatId`, `getTokenCountAsync`
- `generate`, `generateRaw`, `generateQuietPrompt`
- `$` / jQuery when mounted, plus `showdown`, `DOMPurify`, `hljs`, `Handlebars`, `moment`, and other legacy libraries as available

The exported values are live where ST expects live values. For example, `chat` is the same live array/proxy visible through the context projection.

## ESM Import Contract

ST extensions commonly import from paths relative to their own folder:

```js
import { chat, eventSource } from '../../../script.js';
import { extension_settings } from '../../extensions.js';
```

YdlTavern preserves that layout by serving compatibility modules at ST-standard URLs.

## URL Layout

Extensions resolve relative imports through these URLs:

| URL | Purpose |
|---|---|
| `/script.js` | top-level ST core globals shim |
| `/scripts/extensions.js` | extension manager shim |
| `/scripts/events.js` | `eventSource` and `event_types` |
| `/scripts/st-context.js` | `getContext()` |
| `/scripts/group-chats.js` | group chat exports |
| `/scripts/secrets.js` | safe secrets shim; always returns empty values |
| `/scripts/power-user.js` | `power_user` object |
| `/scripts/extensions/<id>/...` | installed extension files |

In dev, these are served by Vite middleware. In production, they are served by the host static route.

## Trust Model

YdlTavern uses the same trust model as ST:

- 100% open access: no permission prompts and no capability grant system.
- Community curation through git URLs and reputable sources.
- User discretion for what to install.
- Extension callbacks are wrapped so one failing extension does not intentionally take down the whole host page.

There is no sandbox between extensions and the host page. If you install a malicious extension, it can do whatever it wants in the page. This is the ST model and is required for unmodified compatibility.

## Error Handling

Compatibility does not mean extensions are trusted to be bug-free. YdlTavern should continue to isolate errors at integration points:

- event listener dispatch catches callback exceptions;
- hook runners catch and report failures;
- smoke tests verify bootstrap does not crash the surface;
- future diagnostics should expose extension activity and failures.

The goal is operational resilience, not permission enforcement.

## Activity Drawer (planned)

A future debug panel will show what extensions are doing without blocking them. Candidate signals:

- fetch URL hashes and methods;
- localStorage keys written;
- slash command registrations;
- event listener registrations;
- extension prompt writes;
- DOM mount targets touched.

This is transparency, not enforcement. It helps users and maintainers debug extension behavior while preserving ST's open compatibility model.

## Known Differences from ST

What YdlTavern has that ST does not:

- native React shell with faster long-chat rendering;
- live model calls through Yggdrasil outbound using HTTPS-only providers and `secret_ref`;
- Tauri desktop wrapper through the Yggdrasil platform shell;
- Vite-based development workflow;
- future Activity Drawer transparency.

What ST has that YdlTavern does not yet fully mirror:

- some niche legacy library shims still being audited;
- the full `/api/extensions/*` HTTP backend, replaced here by Yggdrasil git install and host capabilities;
- some DOM IDs not yet observed in the audited extensions; file an issue if an extension expects one.

## Trying It Locally

```bash
# Build YdlTavern surface
cd /workspace/Yggdrasil/YdlTavern
npm run build --prefix packages/ydltavern-surface

# Start Yggdrasil host
cd ../Yggdrasil
cargo run -p ygg-cli -- host serve --http 127.0.0.1:8787 --profile profiles/forge-alpha.yaml &

# Start clients/web
npm run dev --prefix clients/web

# Open http://127.0.0.1:1420
# Verify ST URL layout:
curl http://127.0.0.1:1420/script.js | head -10
```

## Compatibility Checklist for Extension Authors

Most ST extensions should not need changes. If an extension fails, check:

1. Does it import only ST-relative modules or vendored local files?
2. Does it rely on a very new ST DOM ID not listed above?
3. Does it call a server endpoint under `/api/extensions/*` that YdlTavern has replaced with host capabilities?
4. Does it assume a specific old jQuery plugin or global library?
5. Does it require external services or local files not installed through the Yggdrasil package channel?

When filing an issue, include the extension URL, the import that failed, the DOM selector that was missing, and any console error.

## Reference

See:

- `docs/ARCHITECTURE.md` and `docs/COMPATIBILITY_MATRIX.md` for the extension-compat architecture and coverage matrix;
- `packages/ydltavern-surface/src/formatting/` for the messageFormatting pipeline;
- `packages/ydltavern-st-compat/src/window-bootstrap.ts` for global mounting;
- `packages/ydltavern-surface/public/st-compat/` for ESM shim files.
