# PromptManager Alignment + WI Advanced Plan (temporary)

> Temporary execution plan. Delete after completion and fold durable content into track docs, compatibility matrix, README, and architecture docs.

## Goal

Move YdlTavern from “prompt-critical + slash core” toward ST-like preset/worldbook behavior.

This round does not claim byte-level compatibility. Completed items may only move to `partial` / `fixture-aligned subset` unless a golden ST harness proves byte-level equality.

## ST ground truth summary

### PromptManager

- `PromptManager.js:37`: injection position is `RELATIVE=0` / `ABSOLUTE=1`.
- `PromptManager.js:80-163`: Prompt fields include `role`, `injection_position`, `injection_depth`, `injection_order`, `injection_trigger`, `forbid_overrides`, and `marker`.
- `PromptManager.js:201-294`: `PromptCollection` provides ordered add/get/index/override.
- `PromptManager.js:1516-1549`: `getPromptCollection(generationType)` builds a collection from prompt_order, enabled, and triggers; disabled main still leaves an empty anchor.
- `PromptManager.js:2001-2135`: default Chat Completion prompts and order.
- `openai.js:1358-1499`: system prompt and PromptManager marker merge; markers may override role/depth/order/position; character main/jailbreak overrides use `{{original}}`.
- `openai.js:801-857`: chat completion absolute injection routes by depth, injection_order, and role.
- `script.js:4641-4686`, `5569-5607`: text completion extension prompts and IN_CHAT depth injection.

### World Info advanced

- `world-info.js:479-730`: sticky/cooldown/delay timed effects.
- `world-info.js:4893-4928`: probability check.
- `world-info.js:5173-5355`: group scoring / inclusion group / override / weighted random.
- `world-info.js:4938-4995`: budget overflow, recursive scan, min activations.
- `world-info.js:5072-5162`: before/after/EM/AN/atDepth/outlet buckets; ANTop/ANBottom patch Author’s Note.
- `script.js:8866`, `3242-3267`: extension prompt write/read ordering; key sorting affects byte-level output.

## Boundaries

This round does:

- structured reading of ST OpenAI preset `prompts` / `prompt_order` and effective order diagnostics;
- prompt-critical field filling through PromptManager markers instead of hard-coded order;
- WI position routing closer to ST, including EM / AN / depth / outlet;
- deterministic WI filters;
- seeded group/probability harness;
- sticky/cooldown/delay sequence state;
- engine and surface diagnostics for these traces.

This round does not do:

- real model networking;
- raw secrets;
- third-party extension loading;
- full STScript;
- vector DB querying;
- tokenizer-level budget alignment;
- byte-level compatibility claims.

## Phases

### A0: plan and boundary lock

Commit this plan. Acceptance: the plan includes ST source evidence, phases, explicit non-goals, and deletion rules.

### A1: PromptManager alignment spine

Scope: `packages/ydltavern-engine-core`.

Add `prompt-manager.ts`:

- `PromptManagerPrompt`, `PromptOrderEntry`, `PromptCollection`;
- default Chat Completion prompt identifiers/order;
- `compilePromptCollection(input)`:
  - reads `prompts` / `prompt_order`;
  - handles `enabled` and `injection_trigger`;
  - preserves disabled main as an empty anchor;
  - detects marker prompts;
  - carries role/depth/order/position metadata;
  - emits main/jailbreak override diagnostics (structure first, not byte-level);
  - returns effective collection + diagnostics.

Acceptance: engine-core tests cover prompt_order, disabled, trigger, marker, custom prompt, and override diagnostics.

### A2: Prompt-critical marker integration

Scope: `packages/ydltavern-engine-core`.

Goal: feed current `buildPromptCriticalBlocks()` content into A1 collection markers.

- worldInfoBefore/worldInfoAfter/personaDescription/charDescription/charPersonality/scenario/dialogueExamples/chatHistory/jailbreak are marker fills;
- authorNote/instruct/postHistory are marked internal / diagnostic if they are not ST markers;
- output block -> marker mapping and known deltas.

Acceptance: fixtures prove prompt-critical content appears at PromptManager marker positions, not hard-coded order.

### A3: World Info routing pass

Scope: `packages/ydltavern-engine-core`.

Goal: align “where activated entries route”.

- positions: before/after/ANTop/ANBottom/atDepth/EMTop/EMBottom/outlet;
- buckets close to ST: before, after, examples/EM, depthEntries, anTop/anBottom, outlets;
- bucket ordering preserves ST sort + unshift semantics;
- `atDepth` preserves depth/role/order/source;
- `anPatch` expresses ANTop + original AN + ANBottom;
- positions not actually inserted must have diagnostics.

Acceptance: fixtures cover all positions and ordering.

### A4: World Info deterministic filters

Scope: `packages/ydltavern-engine-core`.

Goal: implement high-value WI behavior without randomness or cross-generation state.

- generation triggers: normal / continue / impersonate / swipe / regenerate / quiet;
- characterFilter names/tags;
- decorators: `@@activate` / `@@dont_activate`;
- scan data flags: persona, character description/personality/depth prompt, scenario, creator notes;
- min activations scan advance;
- delayUntilRecursion / excludeRecursion basics.

Acceptance: each field has fixtures and skipped/activated reasons.

### A5: World Info seeded group/probability

Scope: `packages/ydltavern-engine-core`.

Goal: implement random behavior under a deterministic test harness.

- deterministic RNG injection for compat/tests only;
- `useProbability` / `probability`;
- inclusion group;
- `groupOverride`;
- `groupWeight` weighted random;
- `useGroupScoring`.

Acceptance: fixtures use fixed random sequences; docs say seeded behavioral alignment, not byte-level.

### A6: World Info timed effects

Scope: `packages/ydltavern-engine-core`.

Goal: implement sticky/cooldown/delay as stateful behavior.

- `WorldInfoRuntimeState`;
- sticky/cooldown metadata;
- delay gate;
- dry-run behavior;
- chat length advancement;
- sequence fixture proving sticky/cooldown/delay transitions across evaluations.

Acceptance: multi-generation sequence tests pass and diagnostics show timed state transitions.

### A7: engine/surface diagnostics integration + docs convergence

Scope: engine package, surface, docs.

- `ydltavern-engine` outputs PromptManager/WI advanced diagnostics;
- surface panels show effective prompt order, marker fills, WI routing/group/probability/timed traces;
- delete this temporary plan and its Chinese mirror;
- update README, ARCHITECTURE, COMPATIBILITY_MATRIX, C/I/G tracks, engine README;
- full package validation and push.

## Completion criteria

- all phases are pushed;
- temporary plans are deleted;
- docs/matrix have no stale status;
- all package typecheck/build/test pass;
- still no real networking/secrets/independent app shell;
- no byte-level ST compatibility claim.
