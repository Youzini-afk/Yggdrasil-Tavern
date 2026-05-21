# YdlTavern Charter

> [English](./CHARTER.en.md) · [中文](./CHARTER.md)

YdlTavern is a conversation and roleplay project running on the [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) platform, compatible with SillyTavern's character cards, world books, presets, chats, and extensions.

This charter defines what YdlTavern is and the principles that don't change.

## Identity

YdlTavern is:

- an integration project on top of Yggdrasil;
- an independent product on a SillyTavern-compatible path — it runs old character cards, world books, presets, chats, and extensions;
- a project that brings a mature set of content formats and an extension ecosystem onto a modern platform substrate.

YdlTavern is not:

- a SillyTavern fork;
- a Yggdrasil official package;
- a new platform.

## Principles that don't change

### 1. Platform and product stay separate

YdlTavern lives in a different repo from Yggdrasil. It always will. It consumes the platform through the public protocol. Yggdrasil never adds a privileged path for YdlTavern, and YdlTavern never reads Yggdrasil internals.

### 2. Modern substrate, familiar experience

Storage, variables, tool calls, MCP, skills, multi-agent, vector memory — these go through Yggdrasil's native approach. No reinvention.

UI structure, interactions, palette — kept friendly to longtime SillyTavern users. The frontend is freshly written, but the learning curve is close to zero.

### 3. Reuse the extension ecosystem where possible

For existing SillyTavern extensions, the goal is to run as many as possible directly through a compatibility layer. The exact API surface and the way it's covered live in [`COMPATIBILITY.md`](COMPATIBILITY.en.md). The promise stays realistic — no pressure-shaped numbers like "100%".

### 4. Don't pollute upstream

Any SillyTavern-shaped special handling stays inside YdlTavern. Yggdrasil's kernel won't get special treatment for YdlTavern, no matter how big YdlTavern grows.

## Non-goals

YdlTavern won't:

- build its own platform substrate (Yggdrasil is enough);
- write its own model-provider layer (use Yggdrasil's capability packages);
- reimplement permissions, audit, streaming lifecycle (use Yggdrasil's);
- become a kitchen sink — memory, agents, tool calls all live in ordinary Yggdrasil capability packages where possible.

## Acknowledgements

The content formats YdlTavern is compatible with (character cards, world books, presets, chat history) and the extension API are the work of the SillyTavern team and community over many years. Credit goes to them.

## Stability promise

This charter changes only by explicit revision. The product shape, UI, and extension compatibility matrix will evolve. Identity and the boundary with Yggdrasil won't.
