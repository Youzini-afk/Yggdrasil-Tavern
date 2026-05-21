# YdlTavern Charter

> [English](./CHARTER.en.md) · [中文](./CHARTER.md)

YdlTavern is the next-generation SillyTavern. It runs on top of [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) and absorbs SillyTavern's users, extensions, content, and UI habits.

This charter defines what YdlTavern is, what it isn't, and the principles that don't change.

## Identity

YdlTavern is:

- an integration project on top of Yggdrasil;
- the next stop after SillyTavern — inheriting six years of community resources and user habits, while moving forward to a modern engine, storage, and agent layer;
- a product, not a platform.

YdlTavern is not:

- a SillyTavern fork;
- a Yggdrasil official package;
- a new platform;
- a monolithic framework with conversation, characters, worlds, and prompts baked into the kernel.

## Principles that don't change

### 1. Platform and product stay separate

YdlTavern lives in a different repo from Yggdrasil. It always will. It consumes the platform through the public protocol. Yggdrasil never adds a privileged path for YdlTavern, and YdlTavern never reads Yggdrasil internals.

### 2. Inherit from SillyTavern, don't replace it

Character cards, world books, presets, chat history, the extension API, UI habits — the goal is near-complete coverage so SillyTavern users can move all their luggage over.

This isn't about shutting SillyTavern down. SillyTavern is the previous generation; YdlTavern is the next one.

### 3. Swap the engine, keep the experience

The parts that fell behind — storage, variables, tool calls, MCP, skills, multi-agent — all move to Yggdrasil's native approach.

What users see — UI structure, palette, interaction flow — stays familiar.

### 4. Shared extension ecosystem

Old SillyTavern extensions: the goal is to run them directly through a compatibility layer where possible. The exact API surface and how it's covered live in [`COMPATIBILITY.md`](COMPATIBILITY.en.md).

### 5. Don't pollute upstream

Any SillyTavern-shaped special handling stays inside YdlTavern. Yggdrasil's kernel won't get special treatment for YdlTavern, no matter how big YdlTavern grows.

## Non-goals

YdlTavern won't:

- build its own platform substrate (Yggdrasil is enough);
- write its own model-provider layer (use Yggdrasil's capability packages);
- reimplement permissions, audit, streaming lifecycle (use Yggdrasil's);
- become a kitchen sink — memory, agents, tool calls all live in ordinary Yggdrasil capability packages where possible.

## Stance toward the SillyTavern community

Inheritance, not replacement, not appropriation.

Existing users get a smooth move: old content imports directly, old extensions run directly within the compatibility layer's coverage. New users see a modern engine from day one, with no awareness of the two layers underneath.

## Stability promise

This charter changes only by explicit revision. The product shape, UI, and extension compatibility matrix will evolve. Identity, the boundary with Yggdrasil, and the stance toward SillyTavern won't.
