# Tracks

> [English](./README.en.md) · [中文](./README.md)

YdlTavern implementation moves in parallel by track, not by linear milestone. Each track has its own scope document, can progress independently, and exposes progress through [`../COMPATIBILITY_MATRIX.en.md`](../COMPATIBILITY_MATRIX.en.md).

## Track list

| Track | Scope | Main inventory |
|---|---|---|
| [B Asset Layer](./B_ASSET_LAYER.en.md) | character cards / world books / presets / chats / persona / theme import and export | WORLD_INFO_AND_ASSETS |
| [C Engine Core](./C_ENGINE_CORE.en.md) | model connections / samplers / Generate pipeline / context construction | CONNECTORS_AND_SAMPLERS, CORE_EVENTS_AND_COMMANDS |
| [D ST API Surface](./D_ST_API_SURFACE.en.md) | `getContext()` / `eventSource` / `event_types` / global functions | CORE_EVENTS_AND_COMMANDS |
| [E STScript & slash](./E_STSCRIPT_AND_SLASH.en.md) | built-in slash commands / macros / STScript parser / variable domains | CORE_EVENTS_AND_COMMANDS |
| [F Built-in Extensions](./F_BUILTIN_EXTENSIONS.en.md) | 14 built-in extensions, one YdlTavern package each | BUILTIN_EXTENSIONS |
| [G UI Rewrite](./G_UI_REWRITE.en.md) | frontend layout / operation flow / theme system / render pipeline | (uses D contracts) |
| [H Extension Loader](./H_EXTENSION_LOADER.en.md) | dual-track ST-style extension loader + Yggdrasil package channel | (independent) |
| [I Advanced Features](./I_ADVANCED.en.md) | World info trigger engine / group chat rotation / persona lock / instruct mode | WORLD_INFO_AND_ASSETS |

## Progress principles

- Each track has independent progress and can be released independently.
- Not serial — while B builds importers, C can align request/prompt behavior and G only consumes the D contract as a surface.
- Cross-track dependencies are decoupled through D: D is the contract, and all UI and extensions consume it.
- Every item implemented by each track must update [`../COMPATIBILITY_MATRIX.en.md`](../COMPATIBILITY_MATRIX.en.md).
- Inventory is ground truth, not a source of guesses.
