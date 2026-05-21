# D Track: ST API Surface

> [English](./D_ST_API_SURFACE.en.md) · [中文](./D_ST_API_SURFACE.md)

## Scope

Provide the ST global API surface (`getContext()`, `eventSource`, `event_types`, `SlashCommandParser`, and various helpers) at the YdlTavern layer as a unified contract.

YdlTavern's own UI also consumes the same contract. This is key — the core team and extension developers use the same API set, avoiding an old ST problem.

## Ground truth

- All sections in `docs/inventory/CORE_EVENTS_AND_COMMANDS.raw.md`
- `docs/architecture/COMPAT_PROJECTION.en.md` (projection rules)
- Add `docs/inventory/GLOBAL_API.md` during implementation, mechanically scanning ST `script.js` + `extensions.js` export / window globals

## Deliverables

- `compat/getContext.ts` — returns an ST-compatible context object, with all fields projected from YdlTavern state
- `compat/eventSource.ts` — ST-style event bus. YdlTavern internal events are mapped by the rules in `COMPAT_PROJECTION.en.md`
- `compat/event_types.ts` — 99+ ST event constants, with names and string values exactly matching ST
- `compat/chat-proxy.ts` — Proxy implementation for `chat[]`: lazy projection + write interception routed to the Turn model
- `compat/globals.ts` — `window.SillyTavern` / `getRequestHeaders` / `addOneMessage` / `saveChat` / `Generate` / `substituteParams`, etc.
- Full inventory + status table + alignment fixture

## Alignment strategy

One independent alignment fixture per API:

```text
extension shape:  eventSource.on('MESSAGE_RECEIVED', handler)
alignment target: after YdlTavern completes generation, the payload shape received by handler matches the same ST version
```

```text
extension shape:  getContext().chat[5].mes = 'rewrite'
alignment target: internal YdlTavern Turn[5]'s active variant is forked, and the new variant's main text = 'rewrite'
```

Every track D item in `COMPATIBILITY_MATRIX.en.md` corresponds to a fixture.

## Dependencies

- Turn model ([`../architecture/TURN_MODEL.en.md`](../architecture/TURN_MODEL.en.md)) ✓
- Projection rules ([`../architecture/COMPAT_PROJECTION.en.md`](../architecture/COMPAT_PROJECTION.en.md)) ✓
- Does not depend on other tracks; all other tracks depend on it in reverse

## Out of scope

- Inventing a whole new modern API — new extensions can directly use the Yggdrasil public protocol and are not forced through D
- Providing convenience APIs that ST does not have — track D only carries existing ST APIs and does not invent new ones

## Completion criteria

- All stable ST API surfaces used by the community have aligned implementations in D
- All 99+ event_types are mapped and alignment fixtures pass
- Initialization code for a set of the top N popular old extensions can run (verified during track H)
