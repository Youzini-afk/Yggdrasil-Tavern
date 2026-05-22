# YdlTavern docs

> [English](./README.en.md) · [中文](./README.md)

Documentation grouped by topic. Every doc has a Chinese and an English version; the bilingual blockquote at the top of each file switches between them.

## Stance and status

- [`CHARTER.md`](CHARTER.en.md) — principles that don't change
- [`COMPATIBILITY.md`](COMPATIBILITY.en.md) — SillyTavern resource and extension compatibility scope (overview)
- [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.en.md) — coverage radar by domain; after Round 8 it records same-window ST extension compatibility, 199/199 slash-command canonical coverage, and @fontsource font bundling
- [`ARCHITECTURE.md`](ARCHITECTURE.en.md) — how YdlTavern relates to Yggdrasil, including the extension hosting model, A-N slash registration, plan-only/unsupported sentinels, and font bundling

## Internal architecture

- [`architecture/TURN_MODEL.md`](architecture/TURN_MODEL.en.md) — internal Turn model specification
- [`architecture/COMPAT_PROJECTION.md`](architecture/COMPAT_PROJECTION.en.md) — rules for projecting Turn to ST `chat[]` / `eventSource` / `getContext()`

## Roadmap

- [`roadmap/NEXT_STEPS.md`](roadmap/NEXT_STEPS.en.md) — current follow-up work queue; Y-track is complete and only Round 9 production extension hosting, Activity Drawer, performance baseline, and Phase B work remains

## Guides

- [`guides/GOLDEN_HARNESS.md`](guides/GOLDEN_HARNESS.en.md) — generate ST-alignment fixtures with the Node + jsdom golden harness
- [`guides/LIVE_MODEL_CALLS.md`](guides/LIVE_MODEL_CALLS.en.md) — make opt-in live model calls through the Yggdrasil outbound executor
- [`guides/REALTIME_MODELS.md`](guides/REALTIME_MODELS.en.md) — use OpenAI Realtime / Gemini Live stub through Yggdrasil WebSocket outbound
- [`guides/REAL_EXTENSION_LOADING.md`](guides/REAL_EXTENSION_LOADING.en.md) — opt into loading real SillyTavern ESM extensions in the QuickJS sandbox
- [`guides/EXTENSION_COMPATIBILITY.md`](guides/EXTENSION_COMPATIBILITY.en.md) — Round 8 same-window ST extension compatibility promise, DOM contract, globals, and URL layout
- [`guides/UI_FORK_GUIDE.md`](guides/UI_FORK_GUIDE.en.md) — SillyTavern UI/layout fork, 9 drawers, themes, messages, composer, and mobile parity
- [`guides/E2E_INTEGRATION.md`](guides/E2E_INTEGRATION.en.md) — how Yggdrasil clients/web resolves, iframe-mounts, and RPC-bridges the YdlTavern surface bundle


## Research archives

- [`research/round8/EXTENSION_FORK_RESEARCH.md`](research/round8/EXTENSION_FORK_RESEARCH.en.md) — Round 8 same-window ST DOM fork decision archive
- [`research/round8/ST_DOM_CONTRACT.md`](research/round8/ST_DOM_CONTRACT.en.md) — ST DOM IDs/classes, messageFormatting, DOMPurify hooks, ESM/globals ledger
- [`research/round8/MESSAGE_FORMATTING_PIPELINE.md`](research/round8/MESSAGE_FORMATTING_PIPELINE.en.md) — YdlTavern messageFormatting implementation notes

## ST source inventory (mechanical scan, ground truth)

Mechanical per-domain scans of the SillyTavern source, used as the alignment baseline for future implementation. These are English files (dominated by literal ST source identifiers); no Chinese mirror.

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
| [H extension loading / ST DOM fork](tracks/H_EXTENSION_LOADER.en.md) | Same-window ST extension compatibility + Yggdrasil package channel |
| [I advanced](tracks/I_ADVANCED.en.md) | world info trigger engine / group chat rotation / persona locks / instruct mode |

## Shortest read paths

| You want to | Start with |
|---|---|
| Understand the project's stance | [`CHARTER.md`](CHARTER.en.md) → [`ARCHITECTURE.md`](ARCHITECTURE.en.md) |
| Understand compatibility scope | [`COMPATIBILITY.md`](COMPATIBILITY.en.md) → [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.en.md) |
| Understand the internal data model | [`architecture/TURN_MODEL.md`](architecture/TURN_MODEL.en.md) → [`architecture/COMPAT_PROJECTION.md`](architecture/COMPAT_PROJECTION.en.md) |
| Generate ST-alignment fixtures | [`guides/GOLDEN_HARNESS.md`](guides/GOLDEN_HARNESS.en.md) |
| Configure live model calls | [`guides/LIVE_MODEL_CALLS.md`](guides/LIVE_MODEL_CALLS.en.md) |
| Configure Realtime WebSocket models | [`guides/REALTIME_MODELS.md`](guides/REALTIME_MODELS.en.md) |
| Load real ST extensions | [`guides/EXTENSION_COMPATIBILITY.md`](guides/EXTENSION_COMPATIBILITY.en.md) → [`guides/REAL_EXTENSION_LOADING.md`](guides/REAL_EXTENSION_LOADING.en.md) |
| Understand the UI fork / ST parity | [`guides/UI_FORK_GUIDE.md`](guides/UI_FORK_GUIDE.en.md) |
| Mount the YdlTavern surface bundle locally | [`guides/E2E_INTEGRATION.md`](guides/E2E_INTEGRATION.en.md) |
| Find a specific ST API/event/command | the matching `inventory/*.raw.md` |
| Learn what a track is about | [`tracks/README.md`](tracks/README.en.md) → specific track doc |
