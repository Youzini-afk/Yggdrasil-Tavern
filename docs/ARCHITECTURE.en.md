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

### QuickJS extension sandbox

`@ydltavern/extensions` has `src/sandbox/`: QuickJS runtime, host bridge, ESM loader, permissions, browser stubs, and audit. ST extension JS runs inside a separate QuickJS context. Default synthetic sandbox tests still use the minimal capability set; loading a real ESM extension requires explicit `realExtensionLoad: true` permission so older tests and lower-trust extensions do not accidentally gain file-level import capability.

The ESM loader parses static relative imports from the entry module, recursively reads files from the same extension package, and evaluates them in QuickJS module mode. ST host imports map to virtual modules: paths such as `../../../../script.js`, `../../../extensions.js`, and `../../../../openai.js` do not read real ST files; they export the host bridge's allowed API surface. npm bare imports are still not resolved; third-party extensions must vendor dependencies into the extension package.

The browser stub set is deliberately small and audited: `document`, `window`, `localStorage`, `sessionStorage`, `performance`, `crypto`, `AbortController`, `DOMException`, `matchMedia`, and `requestAnimationFrame` are available; `fetch`, `indexedDB`, `Worker`, and `WebSocket` throw blocked errors. Every host API call enters the audit log with a redacted call name and argument shape. Synthetic micro-BME runs as an always-on smoke; real BME is opt-in through `YGG_BME_TEST_PATH`, but still stops before full functional boot on unsupported import/stub paths.

### Macro engine

The deep ST-compatible macro implementation now lives in `@ydltavern/engine-core`, covering recursive expansion, comment macros, trim/newline post-processors, random/pick/roll with seeded RNG, frozen time/date/isodate/weekday/datetimeformat paths, and related behavior. `@ydltavern/st-compat` keeps `macros-st.ts` as a compatibility entrypoint that re-exports the engine-core implementation, avoiding a reverse dependency from engine-core to st-compat. The current golden harness macro set is 4/4 byte-perfect.

### World Info alignment

The World Info pipeline continues to target ST `checkWorldInfo` behavior. After Round 4, budget cost uses the ST fallback-style token approximation (UTF-8/3.35 approximation rather than character length), and budget caps follow the context budget percentage. Probability gates and random paths use injected seedrandom so golden harness and engine-core stay deterministic for fixtures. The current world-info set is 4/4 byte-perfect, but that covers the existing fixtures rather than claiming every WI edge case is fully implemented.

### Frontend surfaces

YdlTavern provides its own Tavern UI: chat, message rendering, world books, presets, extension management, and settings panels. These live in `@ydltavern/surface`, not `clients/desktop` or a standalone SPA. Yggdrasil only places the surfaces inside platform containers such as Home / Play / Forge / Assistant. The current surface has moved from diagnostics to a product UI skeleton: `react-virtuoso` virtualized chat list, dark/light/parchment theme system, Connection/Sampler/Persona/Theme settings tabs, ExtensionsDrawer driven by loader-st state, QuickReplyBar, and mobile responsive layout.

Surface descriptors use a dual-manifest pattern: `packages/ydltavern-surface/manifest.yaml` is the Yggdrasil package manifest consumed by the host and exposed through `kernel.surface.contribution.list` for `ydltavern/play`, `ydltavern/settings`, and `ydltavern/extensions`; `packages/ydltavern-surface/surface.manifest.json` is the React bundle descriptor with framework hints such as export name, wrapper class, fonts, fixtures, and sample props for SurfaceHost when mounting the React bundle.

### Golden harness

`golden-harness/` is a Node + jsdom fixture generator. It treats SillyTavern source as a read-only sibling (via `YDLTAVERN_ST_PATH`), loads ST ESM modules, and uses shims for DOM, fetch, randomness, and time to extract chat, world-info, macro, instruct, and tokenizer fixtures. Those fixtures are the alignment baseline for YdlTavern deep-port modules. After the Round 4 U-track, compare covers 20 scenarios (16 perfect, 4 cosmetic, 0 structural, 0 unverifiable, 0 errors): world-info, macro, instruct, and tokenizer are byte-perfect for the current scenarios, while chat remains cosmetic-only.

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

YdlTavern's main development surface has completed a systematic pass, a deep-port pass, Round 3 T-track tightening, and Round 4 U-track closure: asset import/export, ST compatibility runtime, STScript runtime, 70 slash commands, engine core (PromptManager, World Info, chat/text completion adapters, instruct mode, tokenizer registry + HF runtime fetcher, deep macro engine), built-in extension logic, ESM-capable sandbox extension loader, live model call / realtime boundary, product surface shell, and diagnostic inspectors are all in tested code. Deep-port modules are ported function-by-function from ST source with file/line references baked in. Current status is still `partial`: real tokenizer coverage exists for OpenAI/GPT-2/Llama/Llama3/Claude/HF families, extension JS can run in the QuickJS sandbox and can opt into real ESM extension loading, live model calls can opt into Yggdrasil outbound, the surface descriptor has a Yggdrasil-compliant `manifest.yaml`, and golden harness `compare.mjs` runs across 20 scenarios (16 perfect, 4 cosmetic, 0 structural, 0 unverifiable, 0 errors). None of this claims full byte-level ST alignment across all domains; provider-specific I/O, DOM-heavy extensions, full BME functionality, and more fixture scenarios still need to be filled in.
