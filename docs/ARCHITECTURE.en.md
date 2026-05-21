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

YdlTavern doesn't connect to OpenAI / Anthropic / Gemini directly. It calls them through Yggdrasil's `model-provider-lab` and friends, picking up `secret_ref`, network declarations, outbound audit, and the HTTPS-only outbound executor for free.

### Frontend surfaces

YdlTavern provides its own Tavern UI: chat, message rendering, world books, presets, extension management, and settings panels. These live in `@ydltavern/surface`, not `clients/desktop` or a standalone SPA. Yggdrasil only places the surfaces inside platform containers such as Home / Play / Forge / Assistant.

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

M2 foundation is in place. The repo contains shared types, asset importers, the ST compatibility runtime, engine core, a Yggdrasil subprocess package skeleton, and the `@ydltavern/surface` bundle. Behavior is still `stubbed` / `partial`; the compatibility matrix is the source of truth.
