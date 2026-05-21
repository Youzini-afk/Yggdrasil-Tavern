# Prompt-critical I + E Core Plan (temporary)

> Temporary execution plan. Delete after completion and fold durable content into `docs/tracks/`, `docs/COMPATIBILITY_MATRIX.en.md`, README, and architecture docs.

## Goal

Move YdlTavern from a runnable contract slice toward an ST-shaped pre-generation context.

This round implements only the prompt-critical minimum path:

- core World Info / lorebook scanning and injection;
- persona, character description / personality / scenario, author's note, instruct, and post-history fields;
- legacy `substituteParams` common macros;
- a minimal slash command execution framework;
- `/gen`, `/continue`, `/swipe`, variable read/write, and simple conditionals;
- surface diagnostics only, not a full product UI.

This round does not implement a full PromptManager clone, real model calls, third-party extension loading, or heavy provider extensions.

## ST ground truth

### World Info

- `public/scripts/world-info.js:892`: `getWorldInfoPrompt()` is the generation-time WI entry point.
- `public/scripts/world-info.js:4597`: `checkWorldInfo()` is the main scan loop.
- `public/scripts/world-info.js:337`: regex / case-sensitive / whole-word matching.
- `public/scripts/world-info.js:4826`: secondary key logic: `AND_ANY` / `NOT_ALL` / `NOT_ANY` / `AND_ALL`.
- `public/scripts/world-info.js:5084`, `5093`: sort by `order` and distribute by position.
- `public/scripts/world-info.js:4977`: recursive scan.
- `public/scripts/world-info.js:4624`: token budget calculation.

### Prompt-critical fields

- `public/script.js:4401`: `getCharacterCardFields()` reads character prompt fields.
- `public/script.js:4567`: WI scan input includes persona / description / personality / scenario / creator notes.
- `public/scripts/openai.js:1367`: chat completion system prompt sources.
- `public/scripts/openai.js:1388`: author's note extension prompt.
- `public/scripts/openai.js:1423`: persona description enters the prompt.
- `public/scripts/openai.js:1496`: post-history / jailbreak prompt override.
- `public/scripts/instruct-mode.js:387`, `478`: instruct message and story string formatting.

### Macro / slash

- `public/script.js:2772`, `2922`: `substituteParams()` legacy / new signature.
- `public/script.js:2865`, `2889`: legacy character/name macros.
- `public/scripts/macros/definitions/*.js`: core/env/chat/time/variable macros.
- `public/scripts/slash-commands.js:103`, `106`, `225`: slash command API, global parser, default registration.
- `public/scripts/slash-commands.js:2210`, `4486`: `/gen`.
- `public/scripts/slash-commands.js:1489`, `5609`: `/continue`.
- `public/scripts/slash-commands.js:1553`, `5674`: `/swipe`.
- `public/scripts/variables.js:933`, `982`, `1298`: `/setvar`, `/getvar`, `/if`.

## Phases

### P0: plan and boundary lock

Deliverable: this plan committed and pushed.

Acceptance: the plan states ST source evidence, implementation points, phases, boundaries, and deletion rules.

### P1: engine-core prompt-critical spine

Scope: only `packages/ydltavern-engine-core`.

Add:

- `world-info.ts`: core WI evaluator;
- `prompt-critical.ts`: persona / character / author note / instruct / post-history blocks;
- `macros.ts`: legacy macro subset for prompt-critical fields and WI content;
- fixtures for world book, chat, prompt-critical inputs, expected evaluation/request.

Minimum behavior:

- primary / secondary keys;
- regex / case-sensitive / whole-word;
- scan depth;
- before / after / atDepth / author_note_top / author_note_bottom;
- order;
- recursive scan beyond one pass;
- macro expansion trace;
- prompt block injection into `buildPrompt`.

Acceptance: engine-core typecheck/build/test pass; fixture tests cover WI activation and prompt assembly.

### P2: ydltavern-engine capability integration

Scope: only `packages/ydltavern-engine`.

Add:

- `world_info.evaluate` calls the engine-core WI evaluator;
- `preset.compile` accepts prompt-critical input and injects blocks;
- `turn.generate` frames include prompt-critical diagnostics;
- JSON-RPC invoke tests.

Acceptance: engine package typecheck/build/test pass; still no network and no secrets.

### P3: st-compat slash/macro core

Scope: only `packages/ydltavern-st-compat`.

Add:

- macro registry and expanded `substituteParams`;
- slash command registry / parser / executor;
- built-in `/gen`, `/continue`, `/swipe`, `/setvar`, `/getvar`, `/if`, `/run` minimum behavior;
- slash host exposed from `createSTContext()`.

Acceptance: st-compat typecheck/build/test pass; slash can trigger fake Generate / continue / swipe and variables can be read/written.

### P4: surface diagnostics slice

Scope: only `packages/ydltavern-surface`.

Add:

- Prompt-critical diagnostics panel;
- Slash/macro diagnostics panel;
- display activated/skipped WI, prompt blocks, macro trace, and slash result.

Acceptance: surface typecheck/build pass; no independent app shell is restored.

### P5: documentation convergence and plan deletion

Scope: docs and matrix.

Actions:

- delete this temporary plan and its Chinese mirror;
- update README, ARCHITECTURE, COMPATIBILITY_MATRIX;
- update C/E/I/G track docs;
- full package validation;
- commit/push.

## Explicit non-goals

- no real model networking;
- no raw secrets;
- no imports from Yggdrasil internals;
- no independent desktop/web/app shell;
- no full third-party extension loader;
- no claim of byte-level ST PromptManager alignment;
- no vector WI, sticky/cooldown/delay, full MacroEngine, slash autocomplete/debugger.
