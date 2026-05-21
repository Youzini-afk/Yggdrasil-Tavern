# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**The next-generation SillyTavern, running on top of [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil).**

YdlTavern aims to carry SillyTavern's users, extensions, character cards, world books, presets, chat history, and UI shape forward — while replacing the engine underneath. Modern storage, variables, tool calls, MCP, skills, multi-agent — all rebuilt on a current foundation.

## Why this project exists

SillyTavern has built a deep community around roleplay, creative writing, and character work. But the engine underneath is showing its age: performance, the database layer, variable access, tool calls, MCP, agent frameworks — all behind today's curve.

YdlTavern doesn't fork SillyTavern, and it doesn't try to replace SillyTavern. It's the next stop for SillyTavern users:

- **Inherit**: near-complete coverage of the SillyTavern API, extensions, character cards, world books, presets, chats, and UI habits.
- **Move forward**: the engine, storage, and agent layer become Yggdrasil. The users, content, and extension ecosystem stay the same.

## Relationship to Yggdrasil

YdlTavern is an integration project on top of Yggdrasil. It consumes the platform through the public protocol (HTTP `/rpc` plus SSE).

- It does not live in the Yggdrasil repo. Platform and product stay separate.
- It gets the same treatment as any third-party project: same manifest, same permissions, same audit boundary.
- It uses what Yggdrasil already provides: model integration (OpenAI, Anthropic, Gemini, OpenAI-compatible, OpenRouter, DeepSeek, xAI, Fireworks), `secret_ref`, streaming and cancel lifecycle, proposals and approval, memory, sharing, outbound audit.
- It will use what Yggdrasil is about to add: installing capability packages from a GitHub address — the prerequisite for YdlTavern's extension ecosystem.

For Yggdrasil's side of the boundary, see [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.en.md).

## Status

Skeleton stage. The repo currently holds the stance documents and direction notes only. No code yet.

For details, see [`docs/`](docs/README.en.md):

- [`docs/CHARTER.md`](docs/CHARTER.en.md) — principles that don't change
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.en.md) — what we inherit from SillyTavern, and how
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.en.md) — how YdlTavern relates to Yggdrasil

## License

YdlTavern is licensed under the GNU Affero General Public License v3.0 (AGPLv3), matching SillyTavern and Yggdrasil. See [`LICENSE`](LICENSE).
