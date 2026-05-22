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

The main development surface has completed a systematic pass. YdlTavern now has a runnable recreate-and-upgrade skeleton: ST `chat[]` / `eventSource` / `getContext()` can mutate a Turn store; the asset layer covers character cards, world books, chats, presets, personas, themes, quick replies, regex scripts, and instruct presets through import/export skeletons; engine core covers chat/text requests, token budgeting, PromptManager, advanced World Info, golden harnesses, stream frames, and model-call boundary planning; the surface has moved from a diagnostics demo to a hostable Tavern-like product UI.

- **Mechanical inventory of ST source**: 99 event_types, 153 slash commands, 80+ macros, 26 chat completion sources, 17 text completion sources, 80+ sampler parameters, 32 world info triggers, 14 built-in extensions. Under [`docs/inventory/`](docs/inventory/).
- **Internal data model and compatibility projection**: the Turn model plus the projection rules for ST `chat[]` / `eventSource` / `getContext()`. Under [`docs/architecture/`](docs/architecture/).
- **Eight parallel implementation tracks**: B assets / C engine core / D ST API / E STScript / F built-in extensions / G UI / H extension loader / I advanced. Under [`docs/tracks/`](docs/tracks/).
- **Shared types package**: [`packages/ydltavern-types/`](packages/ydltavern-types/) — Turn model plus ST event/slash/macro/connector/sampler/world-info constants.
- **Asset importers**: [`packages/ydltavern-importers/`](packages/ydltavern-importers/) — character JSON/PNG, world book, JSONL chat, preset, persona, theme, quick reply, regex, and instruct import/export skeletons backed by ST-like fixture tests.
- **ST compatibility runtime**: [`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) — live `chat[]` Proxy, Turn store, `getContext()`, `eventSource`, `Generate`, macro substitution, slash command registry, and STScript parser/evaluator skeleton.
- **Engine core**: [`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) — sampler normalization, chat/text request builders, token budgeting, PromptManager marker fills, advanced World Info, golden harnesses, stream frame normalization, and model boundary planning (no network).
- **Compatibility matrix**: [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.en.md) — B/C/D/E/F/G/H/I are now `partial`; the main capability surface has fixture-aligned / plan-only / product-shell skeletons, with no byte-level alignment claim yet.
- **YdlTavern frontend surface**: [`packages/ydltavern-surface/`](packages/ydltavern-surface/) — React surface bundle; `TavernPlaySurface` now defaults to a Tavern-like product shell with chat, settings/assets/extensions/dev drawers, and the same ST contract underneath. It does not include an independent desktop/web/app shell.
- **Engine package**: [`packages/ydltavern-engine/`](packages/ydltavern-engine/) — Yggdrasil subprocess capability package; `world_info.evaluate`, `preset.compile`, `turn.generate`, asset import/export, script.eval, extension registry/loader plans, and model.plan_call call the current local contracts. Still no real network calls.

Next: move into precision alignment and real integration: byte-level PromptManager/tokenizer golden harnesses, more slash commands, real extension-JS sandboxing, real model calls, then return to Yggdrasil for Web/Desktop/App shells. Full documentation index in [`docs/`](docs/README.en.md).

## Acknowledgements

The character cards, world books, presets, chat history, and extension APIs are the work of the SillyTavern team and community over many years. YdlTavern does compatibility work on top of that — credit goes to them.

## License

YdlTavern is licensed under the GNU Affero General Public License v3.0 (AGPLv3). See [`LICENSE`](LICENSE).
