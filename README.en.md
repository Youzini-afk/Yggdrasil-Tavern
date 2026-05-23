# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**A conversation and roleplay project running on [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil), compatible with SillyTavern's character cards, world books, presets, chats, and extensions.**

YdlTavern brings the content formats and extension ecosystem the SillyTavern community has built up over the years onto the Yggdrasil platform substrate. The frontend stays familiar; the engine layer uses Yggdrasil's modern implementation.

## What it does

- Imports SillyTavern character cards (V1 / V2 / V3), world books, prompt presets, and chat history directly.
- Supports SillyTavern's extension API (`getContext()`, `eventSource`, slash commands, etc.) so existing extensions can run.
- Keeps the UI structure and interaction flow familiar to longtime SillyTavern users, with the frontend rewritten from scratch.
- Uses Yggdrasil for the engine layer: model integration, `secret_ref`, streaming lifecycle, proposal approval, outbound audit, memory / retrieval, and agent infrastructure all come from the platform.

## Relationship to Yggdrasil

YdlTavern is an integration project on top of Yggdrasil. It consumes the platform through the public protocol (HTTP `/rpc` plus SSE), and provides its own Tavern frontend as a surface bundle for Yggdrasil to host. Yggdrasil owns the platform shell; YdlTavern owns the product UI.

- It does not live in the Yggdrasil repo. Platform and product stay separate.
- It gets the same treatment as any third-party project: same manifest, same permissions, same audit boundary.
- It uses what Yggdrasil already provides: model integration, `secret_ref`, streaming and cancel lifecycle, proposals and approval, memory, sharing, outbound audit, git package install.

For Yggdrasil's side of the boundary, see [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.en.md).

## Status

The main development surface has completed a systematic pass and a deep-port pass. YdlTavern now has one-to-one algorithm ports of ST core runtime: PromptManager, World Info, STScript, macro engine, chat/text completion adapters (25/15 providers), instruct mode, tokenizer registry, extension logic, ST API surface, and extension loader. Algorithms are ported function-by-function from ST source with file/line references baked in.

- **Mechanical inventory of ST source**: 99 event_types, 199 ST canonical slash commands, 80+ macros, 26 chat completion sources, 17 text completion sources, 80+ sampler parameters, 32 world info triggers, 14 built-in extensions. Under [`docs/inventory/`](docs/inventory/).
- **Internal data model and compatibility projection**: the Turn model plus the projection rules for ST `chat[]` / `eventSource` / `getContext()`. Under [`docs/architecture/`](docs/architecture/).
- **Eight parallel implementation tracks**: B assets / C engine core / D ST API / E STScript / F built-in extensions / G UI / H extension loader / I advanced. Under [`docs/tracks/`](docs/tracks/).
- **Shared types package**: [`packages/ydltavern-types/`](packages/ydltavern-types/) — Turn model plus ST event/slash/macro/connector/sampler/world-info/prompt-manager constants.
- **Asset importers**: [`packages/ydltavern-importers/`](packages/ydltavern-importers/) — character JSON/PNG, world book, JSONL chat, preset, persona, theme, quick reply, regex, and instruct import/export skeletons backed by ST-like fixture tests.
- **ST compatibility runtime**: [`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) — live `chat[]` Proxy, Turn store, full `getContext()` shape (state / bridges / functions / legacy aliases / symbols / deprecated stubs), `eventSource`, `Generate`, macro re-exports (the deep implementation now lives in engine-core), STScript runtime (scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution), and ~150+ batches A-N slash commands; all 199 ST canonical commands are covered by real implementations, plan-only descriptors, or explicit unsupported sentinels.
- **Engine core**: [`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) — sampler normalization, 25 chat completion request shapes, 15 text completion request shapes, stream chunk state machine, PromptManager, World Info, instruct mode, the deep macro engine, and tokenizer registry. World Info now uses token-approximation budget accounting and seeded probability gates. The tokenizer runtime exposes `countTokens(text, options)` with OpenAI/GPT-2 (`gpt-tokenizer`, cl100k/o200k/p50k/r50k), Llama 1/2 (`llama-tokenizer-js`), Llama 3 (`llama3-tokenizer-js`), Claude (`@anthropic-ai/tokenizer`, local approximation), HF generic (`@huggingface/tokenizers` for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A), and `fetchHuggingFaceTokenizer` to runtime-fetch `tokenizer.json` through the Yggdrasil host; UTF-8/3.35 guesstimate remains as fallback when no real source is available.
- **Built-in extensions package**: [`packages/ydltavern-extensions/`](packages/ydltavern-extensions/) — regex (full engine), memory, vectors, quick-reply, token-counter, caption, TTS, translate, expressions, attachments, connection-manager, stable-diffusion, extension loader, and the QuickJS sandbox (`src/sandbox/` runtime / bridge / loader / permissions / audit). The sandbox supports constrained ST extension JS execution, ESM relative imports, virtual ST host module mapping, browser stubs, a host bridge, timeout/memory/permission limits, and audit. Real extension loading is gated by the `realExtensionLoad` permission flag; network/fetch/XHR remain blocked. See [`docs/guides/REAL_EXTENSION_LOADING.md`](docs/guides/REAL_EXTENSION_LOADING.en.md).
- **Compatibility matrix**: [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.en.md) — B/C/D/E/F/G/H/I are `partial`; deep-port covers PromptManager / World Info / STScript / macros / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader. After Round 6 W-track, all 8 structural diffs are closed and the golden harness remains 20/20 perfect; after Round 7 X-track, slash commands cover all 199 ST canonical commands.

- **Round 8 complete: ST extensions run unmodified**
  - Message formatting pipeline (showdown + DOMPurify + hooks) is aligned with the ST path.
  - DOM territory cession: `#chat`, `#extensions_settings`, `#extensionsMenu`, `#movingDivs`, and related anchors are rendered by React with explicit jQuery let-go zones.
  - Window globals bootstrap: `mountSTGlobals()` puts `SillyTavern`, `eventSource`, `chat`, and related values on `globalThis`.
  - ESM compatibility shims at `/script.js`, `/scripts/extensions.js`, and related URLs let extensions keep relative imports unchanged.
  - Real extension smoke tests cover BME and shujuku bootstrap.
- **Golden harness**: [`golden-harness/`](golden-harness/) — Node + jsdom extraction harness that runs read-only sibling SillyTavern source and generates canonical chat / world-info / macro / instruct / tokenizer fixtures. The real `compare.mjs` diff workflow is operational: 20 scenarios currently produce 20 perfect, 0 cosmetic, 0 structural, 0 unverifiable, and 0 errors; the full test suite is roughly 1290+ tests; at Round 8 close `ydltavern-surface` has 88 passing tests and `ydltavern-st-compat` has 703 passing tests. See [`docs/guides/GOLDEN_HARNESS.md`](docs/guides/GOLDEN_HARNESS.en.md).
- **YdlTavern frontend surface**: [`packages/ydltavern-surface/`](packages/ydltavern-surface/) — React surface bundle; `TavernPlaySurface` now defaults to a SillyTavern parity product UI with 9 top-bar drawer surfaces, a 50vw `Sheld` main column, ST `.mes` message DOM structure, SendForm/StreamingIndicator/BackgroundLayer, ST theme JSON import/export, 3 YdlTavern native themes + 3 ST classic presets (Dark V 1.0 / Azure / Celestial Macaron), and 1000px + 768px mobile breakpoints. Round 6 completed TavernProvider state slices for sampler / connection / formatting / backgrounds, library collections for characters / personas / world books / backgrounds, CRUD/message operations, schema-versioned localStorage persistence, and v1→v2 migration; all 9 drawer surfaces read/write the same provider state. The Vite library build emits browser-ready `dist/bundle.mjs`, all 9 mount adapters are exported, and the bundle mounts through the `clients/web` E2E demo path; styles and Noto Sans / Noto Sans Mono Latin-subset fonts bundled through @fontsource@5.2.10 ship with the bundle (4 woff2 files, ~50KB). See [`docs/guides/UI_FORK_GUIDE.md`](docs/guides/UI_FORK_GUIDE.en.md) and [`docs/guides/E2E_INTEGRATION.md`](docs/guides/E2E_INTEGRATION.en.md).
- **Engine package**: [`packages/ydltavern-engine/`](packages/ydltavern-engine/) — Yggdrasil subprocess capability package. In addition to the deep-port JSON-RPC capabilities and existing `world_info.evaluate`, `preset.compile`, `turn.generate`, asset import/export, `script.eval`, extension registry, and `model.plan_call`, it now exposes `model.live_call` / `model.live_call.stream` / `model.live_realtime`. Live model calls go through the Yggdrasil public protocol and host outbound executor: HTTP unary uses `kernel.v1.outbound.execute`, SSE uses `kernel.v1.outbound.stream`, and Realtime WebSocket uses `kernel.v1.outbound.websocket.*` / `kernelClient.openWebSocket`. Realtime requires a live host profile with `outbound.websocket.executor: live`, allowed hosts such as `api.openai.com` (plus `generativelanguage.googleapis.com` for Gemini), and environment variables such as `OPENAI_API_KEY` / `GEMINI_API_KEY`; YdlTavern passes only `secret_ref`, never raw keys. See [`docs/guides/LIVE_MODEL_CALLS.md`](docs/guides/LIVE_MODEL_CALLS.en.md) and [`docs/guides/REALTIME_MODELS.md`](docs/guides/REALTIME_MODELS.en.md).
- **Performance baseline**: [`perf/baseline.json`](perf/baseline.json) is committed, covering 37 scenarios across 5 packages; run commands and schema are documented in [`docs/guides/PERFORMANCE_BASELINE.md`](docs/guides/PERFORMANCE_BASELINE.en.md).

Next: complete production extension hosting (`/scripts/extensions/<id>/` host static route), add an Activity Drawer for transparent extension audit, and use `perf/baseline.json` as the regression reference while advancing Phase B pain points (multi-agent orchestration, MCP protocol surface, vector RAG, ToolManager full registration). Full documentation index in [`docs/`](docs/README.en.md).

## Acknowledgements

The character cards, world books, presets, chat history, and extension APIs are the work of the SillyTavern team and community over many years. YdlTavern does compatibility work on top of that — credit goes to them.

## License

YdlTavern is licensed under the GNU Affero General Public License v3.0 (AGPLv3). See [`LICENSE`](LICENSE).
