# YdlTavern docs

> [English](./README.en.md) · [中文](./README.md)

Documentation grouped by topic. Every doc has a Chinese and an English version; the bilingual blockquote at the top of each file switches between them.

## Newcomer 1 / 2 / 3 path

1. Read [`CHARTER.md`](CHARTER.en.md) → [`COMPATIBILITY.md`](COMPATIBILITY.en.md) for the project stance and compatibility scope.
2. Read [`ARCHITECTURE.md`](ARCHITECTURE.en.md) → [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.en.md) for the relationship to Yggdrasil, the extension hosting model, and current coverage.
3. Then dive into `guides/`, the internal data model under `architecture/`, or the current tracks under `tracks/` as needed.

## Stance and status

- [`CHARTER.md`](CHARTER.en.md) — principles that don't change
- [`COMPATIBILITY.md`](COMPATIBILITY.en.md) — SillyTavern resource and extension compatibility scope (overview)
- [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.en.md) — current compatibility coverage
- [`ARCHITECTURE.md`](ARCHITECTURE.en.md) — relationship to Yggdrasil, the extension hosting model, and key mechanisms

## Internal architecture

- [`architecture/TURN_MODEL.md`](architecture/TURN_MODEL.en.md) — internal Turn model specification
- [`architecture/COMPAT_PROJECTION.md`](architecture/COMPAT_PROJECTION.en.md) — rules for projecting Turn to ST `chat[]` / `eventSource` / `getContext()`

## Roadmap

- [`roadmap/NEXT_STEPS.md`](roadmap/NEXT_STEPS.en.md) — follow-up work queue

## Guides

- [`guides/GOLDEN_HARNESS.md`](guides/GOLDEN_HARNESS.en.md) — generate ST-alignment fixtures with the Node + jsdom golden harness
- [`guides/LIVE_MODEL_CALLS.md`](guides/LIVE_MODEL_CALLS.en.md) — make opt-in live model calls through the Yggdrasil outbound executor
- [`guides/REALTIME_MODELS.md`](guides/REALTIME_MODELS.en.md) — use OpenAI Realtime / Gemini Live stub through Yggdrasil WebSocket outbound
- [Yggdrasil `SECRET_MANAGEMENT.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.en.md) — API Connections writes pasted keys into `official/secret-store-lab`, profiles keep only `secret_ref:store:*`, and env remains a fallback
- [`guides/REAL_EXTENSION_LOADING.md`](guides/REAL_EXTENSION_LOADING.en.md) — opt into loading real SillyTavern ESM extensions in the QuickJS sandbox
- [`guides/EXTENSION_COMPATIBILITY.md`](guides/EXTENSION_COMPATIBILITY.en.md) — same-window ST extension compatibility promise, DOM contract, globals, and URL layout
- [`guides/PERFORMANCE_BASELINE.md`](guides/PERFORMANCE_BASELINE.en.md) — run the 5-package, 37-scenario tinybench baseline and use `perf/baseline.json` as the regression reference
- [`guides/UI_FORK_GUIDE.md`](guides/UI_FORK_GUIDE.en.md) — SillyTavern UI/layout fork, 9 drawers, themes, messages, composer, and mobile parity
- [`guides/E2E_INTEGRATION.md`](guides/E2E_INTEGRATION.en.md) — how Yggdrasil clients/web resolves, iframe-mounts, and RPC-bridges the YdlTavern surface bundle

## ST source inventory (machine-read / maintainer reference)

Mechanical per-domain scans of the SillyTavern source, used as the alignment baseline for further implementation. These are English files (dominated by literal ST source identifiers); no Chinese mirror, and they are not part of the main reading path — they exist for maintainers and alignment validation.

- [`inventory/CORE_EVENTS_AND_COMMANDS.raw.md`](inventory/CORE_EVENTS_AND_COMMANDS.raw.md) — event_types, slash commands, macros, Generate pipeline, chat message shape
- [`inventory/CONNECTORS_AND_SAMPLERS.raw.md`](inventory/CONNECTORS_AND_SAMPLERS.raw.md) — chat / text completion sources, sampler parameters, preset schema, streaming handlers
- [`inventory/WORLD_INFO_AND_ASSETS.raw.md`](inventory/WORLD_INFO_AND_ASSETS.raw.md) — world info triggers and pipeline, character cards V1/V2/V3, presets, persona, group chat, quick reply, theme, instruct templates
- [`inventory/BUILTIN_EXTENSIONS.raw.md`](inventory/BUILTIN_EXTENSIONS.raw.md) — 14 built-in extensions: each manifest, listened events, slash registrations, API calls, `chat[]` mutations, `getContext()` field reads

## Implementation tracks

Parallel work by domain, not linear milestones. See [`tracks/README.md`](tracks/README.en.md).

| Track | Scope |
|---|---|
| [B asset layer](tracks/B_ASSET_LAYER.en.md) | character cards / world books / presets / chats / persona / theme import-export |
| [C engine core](tracks/C_ENGINE_CORE.en.md) | model connectors / samplers / Generate pipeline / context build |
| [D ST API surface](tracks/D_ST_API_SURFACE.en.md) | `getContext()` / `eventSource` / `event_types` / globals |
| [E STScript & slash](tracks/E_STSCRIPT_AND_SLASH.en.md) | built-in slash commands / macros / STScript parser / variable scopes |
| [F built-in extensions](tracks/F_BUILTIN_EXTENSIONS.en.md) | 14 built-in extensions, one YdlTavern package each |
| [G UI rewrite](tracks/G_UI_REWRITE.en.md) | frontend layout / interactions / theme system / render pipeline |
| [H extension loading / ST DOM fork](tracks/H_EXTENSION_LOADER.en.md) | same-window ST extension compatibility + Yggdrasil package channel |
| [I advanced](tracks/I_ADVANCED.en.md) | world info trigger engine / group chat rotation / persona locks / instruct mode |

## Shortest read paths

| You want to | Start with |
|---|---|
| Understand the project's stance | [`CHARTER.md`](CHARTER.en.md) → [`ARCHITECTURE.md`](ARCHITECTURE.en.md) |
| Understand compatibility scope | [`COMPATIBILITY.md`](COMPATIBILITY.en.md) → [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.en.md) |
| Understand the internal data model | [`architecture/TURN_MODEL.md`](architecture/TURN_MODEL.en.md) → [`architecture/COMPAT_PROJECTION.md`](architecture/COMPAT_PROJECTION.en.md) |
| Generate ST-alignment fixtures | [`guides/GOLDEN_HARNESS.md`](guides/GOLDEN_HARNESS.en.md) |
| Configure live model calls | [`guides/LIVE_MODEL_CALLS.md`](guides/LIVE_MODEL_CALLS.en.md) |
| Manage API keys | [Yggdrasil `SECRET_MANAGEMENT.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.en.md) |
| Configure Realtime WebSocket models | [`guides/REALTIME_MODELS.md`](guides/REALTIME_MODELS.en.md) |
| Load real ST extensions | [`guides/EXTENSION_COMPATIBILITY.md`](guides/EXTENSION_COMPATIBILITY.en.md) → [`guides/REAL_EXTENSION_LOADING.md`](guides/REAL_EXTENSION_LOADING.en.md) |
| Run the performance baseline | [`guides/PERFORMANCE_BASELINE.md`](guides/PERFORMANCE_BASELINE.en.md) |
| Understand the UI fork / ST parity | [`guides/UI_FORK_GUIDE.md`](guides/UI_FORK_GUIDE.en.md) |
| Mount the YdlTavern surface bundle locally | [`guides/E2E_INTEGRATION.md`](guides/E2E_INTEGRATION.en.md) |
| Find a specific ST API/event/command | the matching `inventory/*.raw.md` (machine-read) |
| Learn what a track is about | [`tracks/README.md`](tracks/README.en.md) → specific track doc |
