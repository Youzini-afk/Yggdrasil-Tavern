# How YdlTavern relates to Yggdrasil

> [English](./ARCHITECTURE.en.md) · [中文](./ARCHITECTURE.md)

YdlTavern is a product that runs on top of [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil). It consumes the platform through Yggdrasil's public protocol, on equal footing with any other third-party project.

```text
┌──────────────────────────────────────────────┐
│  YdlTavern frontend                            │
│  · SillyTavern-shaped UI structure & flow      │
│  · ST extension compat layer (getContext, etc) │
│  · Asset importer (cards / worlds / presets)   │
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
- SillyTavern asset importers;
- the SillyTavern extension compatibility layer (API surface, loader, runtime bridge);
- everything that interfaces directly with the SillyTavern community (migration guides, extension compatibility matrix, community channels);
- YdlTavern's own product decisions (default theme, marketing, release cadence).

Yggdrasil owns:

- the platform substrate, kernel, public protocol;
- generic capability packages (model integration, persona, knowledge, context, memory, sharing, etc.);
- secure execution (`secret_ref`, network declarations, outbound audit, streaming lifecycle);
- platform discipline, conformance, cross-project rules.

The clean split means YdlTavern can evolve however it needs without leaking Tavern shape into the Yggdrasil kernel, and Yggdrasil can evolve without contorting itself for YdlTavern.

## How the two depend on each other

### During development

Developers usually clone the two repos as siblings:

```text
some-parent/
├── Yggdrasil/      (the platform repo)
└── YdlTavern/      (this repo)
```

YdlTavern talks to Yggdrasil through a local host: start one with `ygg host serve --http 127.0.0.1:8787`, then point YdlTavern's frontend and backend at `127.0.0.1:8787` for `/rpc` and SSE.

YdlTavern doesn't depend on the Yggdrasil source path or import Yggdrasil internals — only the protocol.

### In distribution

Two end-user shapes are supported:

- **Bundled local install**: a single installer ships the Yggdrasil host and the YdlTavern frontend together; they connect internally on launch.
- **Connect to a separate host**: YdlTavern acts as a client to an already-running Yggdrasil host (local or remote).

Either way, YdlTavern only speaks to Yggdrasil through the public protocol.

## Key mechanisms

### Model calls

YdlTavern doesn't connect to OpenAI / Anthropic / Gemini directly. It calls them through Yggdrasil's `model-provider-lab` and friends, picking up `secret_ref`, network declarations, outbound audit, and the HTTPS-only outbound executor for free.

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
- the inheritance baseline for old SillyTavern assets, UI structure, and extension APIs only goes up, not down.

## Status

Skeleton stage. No code yet — the docs only fix stance. The implementation roadmap, UI design language, extension compatibility matrix, and migration tooling all land as implementation rolls out.
