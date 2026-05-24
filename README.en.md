# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**A conversation and roleplay project running on [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil), compatible with SillyTavern's character cards, world books, presets, chats, and extensions.**

YdlTavern brings the content formats and extension ecosystem the SillyTavern community has built up over the years onto the Yggdrasil platform substrate. The frontend stays familiar; the engine layer uses Yggdrasil's modern implementation.

## Installation

YdlTavern installs through Yggdrasil's project mechanism:

```bash
yg install github.com/Youzini-afk/Yggdrasil-Tavern
```

For local dogfood:

```bash
yg install ../YdlTavern --data-dir <data-dir> --profile <profile> -y
```

After installation, YdlTavern appears on Home as a `yggdrasil_native` project. Click Play to enter the chat surface. API keys are saved through Yggdrasil's secret store — paste once in the API Connections drawer. See the [Yggdrasil secret management guide](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.en.md).

The project id uses the stable shape `youzini-afk__YdlTavern__d2a47e5c`: the prefix comes from publisher and project name, and the suffix is the first 8 characters of the SHA-256 of the canonical name `Youzini-afk/Yggdrasil-Tavern`.

## What it does

- Imports SillyTavern character cards (V1 / V2 / V3), world books, prompt presets, and chat history directly.
- Supports SillyTavern's extension API (`getContext()`, `eventSource`, slash commands, etc.) so existing extensions can run.
- SendForm actually invokes engine `model.live_call` / `model.live_call.stream`, which can call OpenAI / Anthropic / Gemini and other provider APIs through Yggdrasil host outbound and stream responses in the chat UI; Stop cancels the active generation.
- Keeps the UI structure and interaction flow familiar to longtime SillyTavern users, with the frontend rewritten from scratch.
- Uses Yggdrasil for the engine layer: model integration, `secret_ref`, streaming lifecycle, proposal approval, outbound audit, memory / retrieval, and agent infrastructure all come from the platform.

## Relationship to Yggdrasil

YdlTavern is an integration project on top of Yggdrasil. It consumes the platform through the public protocol (HTTP `/rpc` plus SSE) and provides its own Tavern frontend as a static `surface_bundle` for Yggdrasil to host. After install, the host exposes the bundle under `/surface-bundles/projects/<project_id>/...`; Yggdrasil owns the platform shell, and YdlTavern owns the product UI.

- It does not live in the Yggdrasil repo. Platform and product stay separate.
- It gets the same treatment as any third-party project: same manifest, same permissions, same audit boundary.
- It uses what Yggdrasil already provides: model integration, `secret_ref`, streaming and cancel lifecycle, proposals and approval, memory, sharing, outbound audit, git package install.
- It runs as a kernel v1 Path A package (`entry.contract: "v1"`) and calls platform authority through bindings / the subprocess SDK; the generated `@yggdrasil/kernel-sdk` can be consumed from npm or a sibling workspace path (`file:../Yggdrasil/sdk/typescript/kernel-sdk`).

For the boundary in detail, see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.en.md); for Yggdrasil's side, see [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.en.md).

## Status

YdlTavern has one-to-one algorithm ports of ST's core runtime: PromptManager, World Info, STScript, the macro engine, chat/text completion adapters (25/15 providers), instruct mode, the tokenizer registry, built-in extension logic, the ST API surface, and the extension loader. Algorithms are ported function-by-function from ST source with file/line references baked in. Same-window ST extension compatibility is in: `messageFormatting()` (showdown + DOMPurify + hooks), React DOM territory cession, `mountSTGlobals()`, ST URL layout shims, and BME/shujuku real-extension smoke all run. The golden harness is currently 20/20 perfect; slash commands cover all 199 ST canonical commands.

For the full compatibility matrix and current state, see [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.en.md); for what's next, see [`docs/roadmap/NEXT_STEPS.md`](docs/roadmap/NEXT_STEPS.en.md).

## Documentation

- [`docs/CHARTER.md`](docs/CHARTER.en.md) — permanent principles
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.en.md) — SillyTavern resource and extension compatibility scope
- [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.en.md) — current compatibility coverage
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.en.md) — relationship to Yggdrasil, the extension hosting model, and key mechanisms
- [`docs/architecture/`](docs/architecture/) — internal Turn model and ST compat projection
- [`docs/guides/`](docs/guides/) — live model calls, Realtime, extension compatibility, UI fork, performance baseline, E2E integration
- [`docs/tracks/`](docs/tracks/) — 8 parallel implementation tracks (B assets / C engine / D ST API / E STScript / F built-in extensions / G UI / H extension loader / I advanced)
- [`docs/inventory/`](docs/inventory/) — mechanical scans of the ST source (machine-read / maintainer reference)

## Acknowledgements

The character cards, world books, presets, chat history, and extension APIs are the work of the SillyTavern team and community over many years. YdlTavern does compatibility work on top of that — credit goes to them.

## License

YdlTavern is licensed under the GNU Affero General Public License v3.0 (AGPLv3). See [`LICENSE`](LICENSE).
