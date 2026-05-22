# How YdlTavern relates to Yggdrasil

> [English](./ARCHITECTURE.en.md) · [中文](./ARCHITECTURE.md)

YdlTavern is a product that runs on top of [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil). It consumes the platform through Yggdrasil's public protocol, on equal footing with any other third-party project.

```text
┌──────────────────────────────────────────────┐
│  YdlTavern package family                       │
│  · Tavern frontend surfaces (chat/settings/ext) │
│  · ST extension compat layer (getContext, etc)  │
│  · Engine + asset importers (cards/worlds/etc)  │
└──────────────────────────────────────────────┘
                    ▲
                    │ HTTP /rpc + SSE
                    │ (public protocol)
                    ▼
┌──────────────────────────────────────────────┐
│  Yggdrasil platform                            │
│  · Model providers (OpenAI / Anthropic / ...)  │
│  · persona-lab / knowledge-lab / context-lab   │
│  · memory-lab / sharing-lab / outbound audit   │
│  · Streaming lifecycle, proposals & approval   │
│  · Kernel: sessions, events, permissions       │
└──────────────────────────────────────────────┘
```

## Boundary

YdlTavern owns:

- product identity, UI design language, interaction flow;
- Tavern product frontend surfaces (chat UI, character panel, world-book panel, preset editor, extension manager, settings UI);
- SillyTavern asset importers;
- the SillyTavern extension compatibility layer (API surface, loader, runtime bridge);
- everything that interfaces directly with the SillyTavern community (migration guides, extension compatibility matrix, community channels);
- YdlTavern's own product decisions (default theme, marketing, release cadence).

Yggdrasil owns:

- the platform substrate, kernel, public protocol;
- desktop shell, web shell, app shell, Home / Play / Forge / Assistant containers, and surface hosting;
- generic capability packages (model integration, persona, knowledge, context, memory, sharing, etc.);
- secure execution (`secret_ref`, network declarations, outbound audit, streaming lifecycle);
- platform discipline, conformance, cross-project rules.

The clean split means YdlTavern can evolve however it needs without leaking Tavern shape into the Yggdrasil kernel, and Yggdrasil can evolve without contorting itself for YdlTavern. Yggdrasil does not write YdlTavern's chat UI; YdlTavern does not write an independent desktop/web/app shell.

## How the two depend on each other

### During development

Developers usually clone the two repos as siblings:

```text
some-parent/
├── Yggdrasil/      (the platform repo)
└── YdlTavern/      (this repo)
```

YdlTavern talks to Yggdrasil through a local host: start one with `ygg host serve --http 127.0.0.1:8787`. YdlTavern's engine package consumes the platform through `/rpc` and SSE; YdlTavern's frontend is delivered as `@ydltavern/surface` for the Yggdrasil shell to mount.

YdlTavern doesn't depend on the Yggdrasil source path or import Yggdrasil internals — only the protocol.

### Presentation model

The YdlTavern frontend is not an independent app. It is a surface bundle:

- `packages/ydltavern-surface` provides React components, styles, and a draft surface descriptor.
- Yggdrasil's web / desktop / app shell discovers, loads, and mounts those surfaces.
- YdlTavern surfaces own the Tavern product UI; the Yggdrasil shell owns navigation, windows, permission dialogs, installation, audit, and platform lifecycle.

Future bundled local installs can ship the Yggdrasil host and YdlTavern packages together, but the shell still belongs to Yggdrasil and the product frontend still belongs to YdlTavern.

### In distribution

End users obtain the YdlTavern package family through Yggdrasil's install/load mechanism. Whether the host is local or remote, YdlTavern only interacts with Yggdrasil through the public protocol and the surface contract.

## Key mechanisms

### Model calls

YdlTavern does not connect to OpenAI / Anthropic / Gemini directly. Live model calls enter Yggdrasil through `ydltavern/engine/model.live_call` and `ydltavern/engine/model.live_call.stream`: the YdlTavern engine builds the provider request body with `buildChatRequest`, calls `kernel.outbound.execute` or `kernel.outbound.stream` through the subprocess SDK `kernelClient`, and the host live outbound executor performs provider HTTPS. YdlTavern passes only `secret_ref` strings and manifest declarations, not raw keys; audit, redaction, cancel, and timeout behavior are owned by the Yggdrasil outbound event path.

### Realtime via Yggdrasil WebSocket outbound

Realtime model calls use a separate WebSocket path: `ydltavern/engine/model.live_realtime` → `kernelClient.openWebSocket` → `kernel.outbound.websocket.open` → provider `wss://...`. OpenAI Realtime uses `wss://api.openai.com/v1/realtime?model=...`; Gemini Live is currently a best-effort stub. Non-streaming and chat-completion streaming still use the HTTP/SSE path above (`kernel.outbound.execute` / `kernel.outbound.stream`). The HTTP, SSE, and WebSocket paths share the same safety boundary: manifest declarations, `secret_ref`, namespace, allowed hosts, host-side audit/redaction, cancel, and timeout behavior. YdlTavern never opens a WebSocket directly and never holds raw keys.

### Tokenizer runtime

`@ydltavern/engine-core` keeps ST's `TOKENIZER` / best-match rules and lazy-loads runtime adapters per family. OpenAI/GPT-2 uses `gpt-tokenizer` (cl100k/o200k/p50k/r50k), Llama 1/2 uses `llama-tokenizer-js`, Llama 3 uses `llama3-tokenizer-js`, Claude uses the local `@anthropic-ai/tokenizer` approximation, and Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A use `@huggingface/tokenizers`. HF sources can be supplied by the caller or fetched with `fetchHuggingFaceTokenizer`, which asks the Yggdrasil host through `kernel.outbound.execute` to download `tokenizer.json`; the fetcher supports optional SHA-256 pinning and an in-memory LRU cache. Without a real source the registry falls back to ST-style UTF-8/3.35 guesstimate.

### Extension hosting model

ST extensions run in the same window as the React shell. React renders ST-compatible DOM IDs and lets go of explicit jQuery territories. `messageFormatting()` goes through showdown → DOMPurify with extension hooks. Window globals are bootstrapped via `mountSTGlobals()`. ESM relative imports resolve to `/script.js` shims served by Vite middleware in development or by the host static route in production.

This model intentionally follows ST's trust boundary: extensions have page-level DOM/storage/network access, while YdlTavern isolates callback failures with error handling and will add transparent Activity Drawer diagnostics in Round 9. The older QuickJS sandbox remains useful for constrained synthetic tests and capability experiments, but the Round 8 compatibility promise is same-window execution for unmodified ST extensions.

### QuickJS extension sandbox

`@ydltavern/extensions` has `src/sandbox/`: QuickJS runtime, host bridge, ESM loader, permissions, browser stubs, and audit. ST extension JS runs inside a separate QuickJS context. Default synthetic sandbox tests still use the minimal capability set; loading a real ESM extension requires explicit `realExtensionLoad: true` permission so older tests and lower-trust extensions do not accidentally gain file-level import capability.

The ESM loader parses static relative imports from the entry module, recursively reads files from the same extension package, and evaluates them in QuickJS module mode. ST host imports map to virtual modules: paths such as `../../../../script.js`, `../../../extensions.js`, and `../../../../openai.js` do not read real ST files; they export the host bridge's allowed API surface. npm bare imports are still not resolved; third-party extensions must vendor dependencies into the extension package.

The browser stub set is deliberately small and audited: `document`, `window`, `localStorage`, `sessionStorage`, `performance`, `crypto`, `AbortController`, `DOMException`, `matchMedia`, and `requestAnimationFrame` are available; `fetch`, `indexedDB`, `Worker`, and `WebSocket` throw blocked errors. Every host API call enters the audit log with a redacted call name and argument shape. Synthetic micro-BME runs as an always-on smoke; real BME is opt-in through `YGG_BME_TEST_PATH`, but still stops before full functional boot on unsupported import/stub paths.

### Macro engine

The deep ST-compatible macro implementation now lives in `@ydltavern/engine-core`, covering recursive expansion, comment macros, trim/newline post-processors, random/pick/roll with seeded RNG, frozen time/date/isodate/weekday/datetimeformat paths, and related behavior. `@ydltavern/st-compat` keeps `macros-st.ts` as a compatibility entrypoint that re-exports the engine-core implementation, avoiding a reverse dependency from engine-core to st-compat. The current golden harness macro set is 4/4 byte-perfect.

### Slash command coverage

`createSTContextDeep` registers 14 slash-command batches (A-N), covering all 199 ST canonical commands. Commands fall into three classes: real implementations read/write the st-compat context directly; plan-only descriptors return JSON `{ planned: true, action, fields }` for host capability execution; unsupported sentinels throw `SlashCommandUnsupportedError` with a clear reason. Duplicate registrations go through `registerIfMissing`, preserving the first registered version rather than overwriting earlier built-ins or batch behavior. `/secret-write` accepts only `secret_ref:env:NAME` values and rejects raw secret writes.

### World Info alignment

The World Info pipeline continues to target ST `checkWorldInfo` behavior. After Round 4, budget cost uses the ST fallback-style token approximation (UTF-8/3.35 approximation rather than character length), and budget caps follow the context budget percentage. Probability gates and random paths use injected seedrandom so golden harness and engine-core stay deterministic for fixtures. The current world-info set is 4/4 byte-perfect, but that covers the existing fixtures rather than claiming every WI edge case is fully implemented.

### Frontend surfaces

YdlTavern provides its own Tavern UI: chat, message rendering, world books, presets, extension management, and settings panels. These live in `@ydltavern/surface`, not `clients/desktop` or a standalone SPA. Yggdrasil only places the surfaces inside platform containers such as Home / Play / Forge / Assistant. The current surface has moved from diagnostics to a product UI: `react-virtuoso` virtualized chat list, dark/light/parchment theme system, Connection/Sampler/Persona/Theme settings, ExtensionsDrawer driven by loader-st state, QuickReplyBar, mobile responsive layout, and a complete TavernProvider state layer.

Surface descriptors use a dual-manifest pattern: `packages/ydltavern-surface/manifest.yaml` is the Yggdrasil package manifest consumed by the host and exposed through `kernel.surface.contribution.list` for 9 contributions (`ydltavern/play`, `ydltavern/settings`, `ydltavern/extensions`, plus 6 drawer-specific entries); `packages/ydltavern-surface/surface.manifest.json` is the React bundle descriptor with framework hints such as export name, wrapper class, fonts, fixtures, and sample props for SurfaceHost when mounting the React bundle.

#### Surface bundle build pipeline

`packages/ydltavern-surface` has two build outputs:

- `tsc` emits `dist/index.js` and `.d.ts` files for TypeScript / package consumers.
- Vite library mode emits `dist/bundle.mjs`, the browser-ready ESM bundle that Yggdrasil iframe SurfaceHost can dynamic import; React and surface runtime dependencies are bundled so the iframe does not see bare imports.
- `scripts/copy-assets.mjs` copies `src/styles/*.css` into `dist/styles/` and copies 4 Latin-subset woff2 files from `@fontsource/noto-sans@5.2.10` and `@fontsource/noto-sans-mono@5.2.10` into `dist/fonts/`. The `@font-face` declarations in `surface.css` use `../fonts/`, so `dist/styles/surface.css` references `dist/fonts/`.

The font strategy is self-hosted Noto Sans + Noto Sans Mono (SIL OFL 1.1, AGPL-compatible), with Inter / system fallback. After Round 7 the fonts are bundled via @fontsource (Noto Sans Regular/Medium/Bold plus Noto Sans Mono Regular, Latin subset, ~50KB), so the build no longer depends on manually placed `public/fonts/` files.

#### TavernProvider state architecture

`TavernProvider` is the single source of truth for the surface UI. After Round 6 it contains:

- settings slices: sampler, connection, formatting, background display, plus active preset / connection profile and related selection state;
- library collections: characters, personas, world books, backgrounds, plus active / selected ids;
- CRUD and message operations: character/persona/world-book/background management, message edit/delete/move/copy/hide/swipe/regenerate/branch/checkpoint;
- schema-versioned persistence: `ydltavern.settings.v2` plus separate localStorage keys for sampler / connection / formatting / personas / characters / worldbooks / backgrounds, including v1→v2 migration.

All 9 drawer surfaces (AI Config, API Connections, Advanced Formatting, World Info, User Settings, Backgrounds, Extensions, Persona, Characters) read and write provider state through `useTavern()` instead of maintaining local stub state that conflicts with the provider.

#### Shell architecture

After Round 5 V-track, `packages/ydltavern-surface/src/components/shell/` uses a SillyTavern-like shell: `TopBar` provides 9 Font Awesome icon entries, `DrawerShell` owns the shared drawer container and backdrop click-to-close, `Sheld` is the centered 50vw main chat column, and the `drawer-rail` layout owns the left/right drawer placement. The left side contains AI Config, API Connections, Advanced Formatting, World Info, User Settings, Backgrounds, Extensions, and Persona; the right side contains Characters.

Drawer state is maintained by the `useDrawers` hook: a single `openId` enforces mutual exclusion, clicking the already-open icon closes it, and clicking the backdrop clears open state. Yggdrasil `clients/web` / Desktop / App still own iframe `SurfaceHost`, navigation, permissions, installation, and platform lifecycle; `@ydltavern/surface` is a React component library, not a standalone app or platform shell.

#### Visual design system

`src/styles/surface.css` defines the scoped visual system. Round 5 added 29 ST-aligned `--tavern-*` tokens covering background, text, accents, chat tint, message tint, shadow, border, font scale, animation, Sheld width, avatars, and icon sizing. The ST theme JSON importer/exporter lives in `src/components/product/themes/st-theme-importer.ts` and converts between ST flat JSON and YdlTavern `TavernTheme`.

There are 6 built-in themes: 3 YdlTavern native themes (dark, light, parchment) and 3 ST classic themes (Dark V 1.0, Azure, Celestial Macaron). Global text-shadow is enabled only under `.tavern-themed-root`, avoiding leakage into the Yggdrasil host page.

#### Mobile responsive

Mobile overrides live in `src/styles/mobile.css`, imported by `surface.css` through `@import`. It uses a 1000px primary breakpoint (matching ST `mobile-styles.css`) and a 768px secondary breakpoint for narrower portrait phones. Below 1000px, drawers become full-screen sheets, the top bar scrolls horizontally, drag/pin handles are hidden, and drawer icons, message buttons, and composer buttons get larger touch targets.

Mobile styling also handles `env(safe-area-inset-bottom)`, and `send_textarea` uses 16px to avoid iOS focus zoom. `prefers-reduced-motion: reduce` disables transitions / animations, while `forced-colors: active` adds explicit borders / outlines.

### Golden harness

`golden-harness/` is a Node + jsdom fixture generator. It treats SillyTavern source as a read-only sibling (via `YDLTAVERN_ST_PATH`), loads ST ESM modules, and uses shims for DOM, fetch, randomness, and time to extract chat, world-info, macro, instruct, and tokenizer fixtures. Those fixtures are the alignment baseline for YdlTavern deep-port modules. After the Round 6 W-track, compare covers 20 scenarios (20 perfect, 0 cosmetic, 0 structural, 0 unverifiable, 0 errors), with chat 4/4 converged from cosmetic to golden-harness verified.

### Extension distribution

A key future capability: installing capability packages from a GitHub address. Yggdrasil will provide that as a controlled host-side path for git fetch / verify / sandboxed install. YdlTavern's extensions ride on the same path — no separate distribution logic.

For details, see Yggdrasil's [`docs/roadmap/NEXT_STEPS.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/roadmap/NEXT_STEPS.en.md).

### Data ownership

- User content (character cards, world books, presets, chats) is owned by YdlTavern and lives in YdlTavern's own storage. The exact storage shape lands when implementation starts.
- Platform-level data (events, permission grants, proposal audit, outbound audit) is owned by Yggdrasil and lives in Yggdrasil's event log.
- The two layers can reference each other (a YdlTavern character pointing at a Yggdrasil asset id), but they don't mix.

### Where old extensions run

The compatibility layer lives inside YdlTavern. Old extensions see the global APIs that YdlTavern provides. When an extension's API call touches model inference, memory, or outbound requests, YdlTavern translates it into a Yggdrasil public-protocol call.

Old extensions don't know Yggdrasil exists — they think they're still running inside SillyTavern.

## Invariants

No matter how YdlTavern evolves:

- it always speaks Yggdrasil's public protocol, never reads internals;
- it always lives in a separate repo from Yggdrasil;
- it never asks Yggdrasil for Tavern-specific APIs;
- it always provides its own Tavern product UI surfaces, but never owns the platform shell;
- compatibility coverage for SillyTavern assets, UI structure, and extension APIs only grows, never shrinks.

## Status

YdlTavern's main development surface has completed a systematic pass, a deep-port pass, Round 3 T-track tightening, Round 4 U-track closure, Round 5 V-track UI parity, Round 6 W-track convergence, Round 7 X-track slash/font completion, and Round 8 Y-track same-window ST extension compatibility: asset import/export, ST compatibility runtime, STScript runtime, ~150+ slash commands (A-N, covering 199 ST canonical commands), engine core (PromptManager, World Info, chat/text completion adapters, instruct mode, tokenizer registry + HF runtime fetcher, deep macro engine), built-in extension logic, ESM-capable sandbox extension loader, live model call / realtime boundary, product surface shell, 9 provider-backed drawers, browser-ready bundle, 9 mount adapters, the clients/web E2E demo path, and diagnostic inspectors are all in tested code. Deep-port modules are ported function-by-function from ST source with file/line references baked in. Current status is still `partial`: real tokenizer coverage exists for OpenAI/GPT-2/Llama/Llama3/Claude/HF families, ST extensions can bootstrap in the same-window DOM fork through globals and ESM shims, the QuickJS sandbox remains available for constrained synthetic tests, live model calls can opt into Yggdrasil outbound, the surface descriptor has a Yggdrasil-compliant `manifest.yaml`, and golden harness `compare.mjs` runs across 20 scenarios (20 perfect, 0 cosmetic, 0 structural, 0 unverifiable, 0 errors). None of this claims full byte-level ST alignment across all domains; provider-specific I/O, more real-extension functional paths, and more fixture scenarios still need to be filled in.
