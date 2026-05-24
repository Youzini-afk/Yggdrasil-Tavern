# H Track: Extension Loading / ST DOM Fork

> [English](./H_EXTENSION_LOADER.en.md) · [中文](./H_EXTENSION_LOADER.md)

## Scope

Third-party extension loading and runtime environment. Two parallel channels:

1. **ST-style channel** — old ST extensions (`manifest.json` + `index.js`) run through a perfect ST DOM fork in the same window, unmodified.
2. **Yggdrasil package channel** — new extensions aware of the Yggdrasil public protocol use ordinary Yggdrasil capability packages and get all platform capabilities.

## ST-style channel

Current status: **perfect ST DOM fork — extensions run unmodified**. Loading is the same as ST:

- Extensions live in the `extensions/<name>/` directory
- `manifest.json` declares dependencies
- `index.js` ES module entry
- Global environment provides the track D ST-compatible APIs (`getContext`, `eventSource`, `SlashCommandParser`, `window.SillyTavern`)
- Extensions are enabled / disabled through the YdlTavern UI

Security:

- ST-style JS runs in the same YdlTavern page window, matching the ST trust model.
- React renders ST DOM anchors and cedes `#extensions_settings`, `#extensionsMenu`, `#movingDivs`, `.mes_buttons_extra`, and related jQuery territories.
- `mountSTGlobals()` provides page globals such as `SillyTavern`, `eventSource`, and `chat`.
- `/script.js` and `/scripts/*.js` shims preserve extension relative ESM imports unchanged.
- Installation warns the user, and the user decides the trust level (same as ST).

## Yggdrasil package channel

New extensions can choose:

- Ordinary Yggdrasil subprocess package (manifest + capabilities + surface descriptor)
- Directly consume sessions, proposals, streaming, memory, and outbound through the Yggdrasil public protocol
- Avoid the limits of the ST compatibility layer

YdlTavern exposes these package surfaces in the main panel (following Yggdrasil surface descriptor), the same as other Yggdrasil clients.

## Installation channels

Installation does not depend on a kernel git transport:

- ST-style extensions: YdlTavern pulls git / zip itself and stores them in `extensions/`
- Yggdrasil packages: wait for Yggdrasil's ordinary capability package `official/git-tools-lab`, an install flow; no dedicated kernel git method is used

## Dependencies

- Track D (ST-style extensions use the compatibility layer)
- Yggdrasil's ordinary-package installation channel
- Track C (extension generate hooks)
- Track E (extensions register slash commands / macros)

## Current status

Track H now has a same-window ST DOM fork plus the retained ESM-capable sandbox loader: `loader-st.ts` still handles ST manifest parsing, activation eligibility, and load planning; `src/sandbox/` can execute extension JS from that plan with a constrained host bridge, permission merging, activation timeout, browser stubs, and audit. Same-window smoke is implemented: BME and shujuku bootstrap have real-extension smoke; the QuickJS sandbox remains for constrained synthetic tests; production `/scripts/extensions/<id>/` hosting and installation UX remain to be done.

Loader capabilities now include:

- ESM module-mode execution with static relative import parsing from the entry file and recursive preloading of same-package files.
- ST host import paths map to a virtual host module, including `../../../../script.js`, `../../../extensions.js`, and `../../../../openai.js`.
- The virtual host module exposes the U0 baseline (`getContext`, event on/emit, slash command, extension prompt, settings) plus extended APIs: `event_types`, `extension_prompt_types`, `extension_prompt_roles`, `getRequestHeaders`, `saveSettingsDebounced`, `saveMetadata`, `saveMetadataDebounced`, `reloadCurrentChat`, `updateChatMetadata`, `getExtensionPrompt`, `substituteParams`, and `getTokenCountAsync`.
- Browser stubs cover `document`, `window`, `localStorage`, `sessionStorage`, `performance`, `crypto`, `AbortController`, `DOMException`, `matchMedia`, and `requestAnimationFrame`; `fetch`, `indexedDB`, `Worker`, and `WebSocket` throw blocked errors.

`@ydltavern/extensions` now has a deep-ported ST-style loader (`loader-st.ts`):

- `STExtensionManifest` schema (display_name/loading_order/requires/optional/dependencies/minimum_client_version/js/css/author/version/homePage/hooks/i18n/auto_update/generate_interceptor);
- `parseSTManifest` with required/type validation + unknown-field warnings;
- `isActivationEligible` checking disabled/extras/dependencies/minimum_client_version;
- `sortByActivationOrder` (loading_order asc, display_name asc);
- `buildLoadPlan` emitting add_locale/add_script/add_style/register_interceptor/call_hook/mark_active steps in order;
- `STDisabledExtensionsStore`;
- `planActivateAll` with progressive dependency tracking.
- Loader plans can be handed to the QuickJS sandbox for execution; multi-file same-package ESM reads are supported, while real zip/git installation is still not in place.

`ydltavern-engine` exposes `extension.loader.parse_manifest` and `extension.loader.plan_activate_all` capabilities. This is still `partial-sandboxed`: constrained JS can execute and can read real extension package files under permission opt-in, but zip/git installation is not implemented and DOM/network capabilities are incomplete.

## Out of scope

- Central extension marketplace / ratings / popularity ranking — not doing it
- Extension signing network — deferred
- Moving all old ST extensions into the YdlTavern repo — not doing it; extensions are maintained by the community

## Completion criteria

- ST-style extension loading flow works
- Yggdrasil package channel works
- A set of 30+ top old ST extensions can be installed directly and can run (concrete list decided during implementation)
- Third-party compatibility matrix is maintained publicly
