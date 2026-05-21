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

The contract slice is in place. YdlTavern now has a runnable thin vertical path: ST `chat[]` / `eventSource` / `getContext()` can mutate a Turn store, asset importers and prompt/request builders have fixture-backed tests, the engine subprocess package can perform deterministic fake generation, and the surface consumes the same contract.

- **Mechanical inventory of ST source**: 99 event_types, 153 slash commands, 80+ macros, 26 chat completion sources, 17 text completion sources, 80+ sampler parameters, 32 world info triggers, 14 built-in extensions. Under [`docs/inventory/`](docs/inventory/).
- **Internal data model and compatibility projection**: the Turn model plus the projection rules for ST `chat[]` / `eventSource` / `getContext()`. Under [`docs/architecture/`](docs/architecture/).
- **Eight parallel implementation tracks**: B assets / C engine core / D ST API / E STScript / F built-in extensions / G UI / H extension loader / I advanced. Under [`docs/tracks/`](docs/tracks/).
- **Shared types package**: [`packages/ydltavern-types/`](packages/ydltavern-types/) — Turn model plus ST event/slash/macro/connector/sampler/world-info constants.
- **Asset importers**: [`packages/ydltavern-importers/`](packages/ydltavern-importers/) — character JSON/PNG, world book, and JSONL chat importer v0, backed by ST-like fixture tests.
- **ST compatibility runtime**: [`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) — live `chat[]` Proxy, Turn store, `getContext()`, `eventSource`, `addOneMessage`, `Generate`, expanded macros, and slash command core.
- **Engine core**: [`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) — sampler normalization, prompt builder, and OpenAI request builder (no network), plus a World Info / persona / author note / instruct / macro prompt-critical spine.
- **Compatibility matrix**: [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.en.md) — B/C/D/G are now `partial` / contract-slice; byte-level alignment is not claimed yet.
- **YdlTavern frontend surface**: [`packages/ydltavern-surface/`](packages/ydltavern-surface/) — React surface bundle; `TavernPlaySurface` can send, edit, fake-generate, and show event, prompt-critical, and slash/macro diagnostics through the same ST contract. It does not include an independent desktop/web/app shell.
- **Engine package**: [`packages/ydltavern-engine/`](packages/ydltavern-engine/) — Yggdrasil subprocess capability package; `world_info.evaluate`, `preset.compile`, `turn.generate`, and asset import call the current local contracts. Still no real model calls and no network.

Next: build from the current prompt-critical and slash/macro core toward full ST PromptManager alignment, advanced World Info behavior, STScript control flow, and third-party extension loading. Full documentation index in [`docs/`](docs/README.en.md).

## Acknowledgements

The character cards, world books, presets, chat history, and extension APIs are the work of the SillyTavern team and community over many years. YdlTavern does compatibility work on top of that — credit goes to them.

## License

YdlTavern is licensed under the GNU Affero General Public License v3.0 (AGPLv3). See [`LICENSE`](LICENSE).
