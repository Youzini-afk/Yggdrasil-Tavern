# I Track: Advanced Features

> [English](./I_ADVANCED.en.md) · [中文](./I_ADVANCED.md)

## Scope

ST features that are hard to build but heavily relied on by users are their own track:

- **World Info / Lorebook engine** — 32+ trigger types, 39-step evaluation pipeline, sticky / cooldown / delay timing, recursive scanning, inclusion group, probability roll
- **Group chat** — 4 rotation strategies (NATURAL / LIST / MANUAL / POOLED), 3 generation modes (SWAP / APPEND / APPEND_DISABLED), group nudge prompt
- **Persona** — persona description injection positions (IN_PROMPT / TOP_AN / BOTTOM_AN / AT_DEPTH / NONE), three-layer character / chat / group lock, persona-specific lorebook
- **Instruct mode** — template system, context templates, character / user prefixes
- **Author's Note** — injected by depth / interval

## Ground truth

All sections in `docs/inventory/WORLD_INFO_AND_ASSETS.raw.md`.

## Key performance points

WI engine performance under large character cards + large world books (1K+ entries):

- Current ST state: JS string contains loops + full rescan on each generate
- YdlTavern goal: trigger evaluation through a wasm module (Rust), under 50ms for 1K-entry scale
- Cache: scan results are cached by chat state hash

NATURAL group chat rotation involves probability + talkativeness + mention detection. It must match ST exactly, or users will notice.

## Alignment strategy

```text
input:  ST world info JSON + given chat state + given generate config
output: triggered entry set + injection positions + injected text, exactly matching ST
```

Group chat:

```text
input:  group + character set + current chat state
output: next speaker selection exactly matches ST with the same seed
```

## Dependencies

- Track B (asset layer provides WI / character book / persona data)
- Track C (routes WI injection by position during prompt assembly)
- Track E (`/world` `/createentry`, etc. slash commands)

## Current status

`packages/ydltavern-engine-core` now has the minimum prompt-critical I-track core:

- World Info keyword / regex / constant activation;
- secondary logic: `AND_ANY` / `NOT_ALL` / `NOT_ANY` / `AND_ALL`;
- case-sensitive, whole-word, scan depth, order, and position buckets;
- recursive scan and basic budget diagnostics;
- persona, character description / personality / scenario, author note, post-history, and instruct blocks;
- macro expansion trace.

`packages/ydltavern-engine` consumes these results through `world_info.evaluate`, `preset.compile`, and `turn.generate`. `@ydltavern/surface` displays activated/skipped entries, buckets, blocks, and macro trace.

This is still `partial`. Sticky/cooldown/delay, inclusion groups, probability rolls, vector WI, full persona lock, group rotation, and byte-level instruct template alignment are not implemented yet.

## Out of scope

- Adding WI trigger types that ST does not have — compatibility comes first
- Redesigning the group chat architecture — keep the ST model

## Completion criteria

- All 32 WI trigger types + 39 pipeline steps are upgraded to `implemented` in `COMPATIBILITY_MATRIX.en.md`
- 4 group chat rotation strategies are aligned
- Persona injection positions are aligned
- Instruct mode template is aligned
- Performance goals are met
