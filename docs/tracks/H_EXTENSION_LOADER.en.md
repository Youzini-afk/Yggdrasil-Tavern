# H Track: Extension Loading

> [English](./H_EXTENSION_LOADER.en.md) · [中文](./H_EXTENSION_LOADER.md)

## Scope

Third-party extension loading and runtime environment. Two parallel channels:

1. **ST-style channel** — old ST extensions (`manifest.json` + `index.js`) can be dropped in directly.
2. **Yggdrasil package channel** — new extensions aware of the Yggdrasil public protocol use ordinary Yggdrasil capability packages and get all platform capabilities.

## ST-style channel

Loading is the same as ST:

- Extensions live in the `extensions/<name>/` directory
- `manifest.json` declares dependencies
- `index.js` ES module entry
- Global environment provides the track D ST-compatible APIs (`getContext`, `eventSource`, `SlashCommandParser`, `window.SillyTavern`)
- Extensions are enabled / disabled through the YdlTavern UI

Security:

- Extensions run in the same JS context as the YdlTavern main process (compatibility decided by D comes first)
- Network requests sent by extensions through the compatibility layer still go through the Yggdrasil public protocol → host outbound audit + redaction + HTTPS-only
- Installation warns the user, and the user decides the trust level (same as ST)

## Yggdrasil package channel

New extensions can choose:

- Ordinary Yggdrasil subprocess package (manifest + capabilities + surface descriptor)
- Directly consume sessions, proposals, streaming, memory, and outbound through the Yggdrasil public protocol
- Avoid the limits of the ST compatibility layer

YdlTavern exposes these package surfaces in the main panel (following Yggdrasil surface descriptor), the same as other Yggdrasil clients.

## Installation channels

Depends on Yggdrasil's git installation capability:

- ST-style extensions: YdlTavern pulls git / zip itself and stores them in `extensions/`
- Yggdrasil packages: use `kernel.outbound.git_fetch` + `official/package-installer-lab`, writing to the host profile lockfile (already implemented in Yggdrasil)

## Dependencies

- Track D (ST-style extensions use the compatibility layer)
- Yggdrasil git installation channel (already exists)
- Track C (extension generate hooks)
- Track E (extensions register slash commands / macros)

## Current status

`@ydltavern/extensions` now has an ST-style loader skeleton: manifest parse, bundle discovery, loading_order sort, compatibility adapter, permission gate, hook registry, and non-executing load plans. `ydltavern-engine` exposes loader discover/plan/compat/hooks capabilities. This is still `partial`: extension JavaScript is not executed, real files/zip/git are not read, and there is no real sandbox yet.

## Out of scope

- Central extension marketplace / ratings / popularity ranking — not doing it
- Extension signing network — deferred
- Moving all old ST extensions into the YdlTavern repo — not doing it; extensions are maintained by the community

## Completion criteria

- ST-style extension loading flow works
- Yggdrasil package channel works
- A set of 30+ top old ST extensions can be installed directly and can run (concrete list decided during implementation)
- Third-party compatibility matrix is maintained publicly
