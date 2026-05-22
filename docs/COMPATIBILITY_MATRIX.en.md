# SillyTavern Compatibility Matrix

> [English](./COMPATIBILITY_MATRIX.en.md) · [中文](./COMPATIBILITY_MATRIX.md)

This document is the public radar for YdlTavern's SillyTavern compatibility coverage. It has a mechanically generated baseline (ground truth comes from ST source scans), and implementation status is maintained by hand. Update this document as each track progresses.

Number meaning:

```text
denominator = actual item count scanned from ST source
numerator = items YdlTavern has implemented and passed alignment tests for
```

Implementation status:

- `inventoried` — scanned and recorded in inventory, not implemented
- `stubbed` — compatibility layer has a placeholder, behavior is not aligned
- `partial` — partially aligned
- `implemented` — byte-level aligned, with regression tests
- `deferred` — intentionally not implemented by internal decision
- `blocked` — waiting on another track

Current stage: deep-port complete. ST source remains the ground truth; B/C/D/E/F/G/H/I now have runnable code paths, and PromptManager / World Info / STScript / macro engine / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader have one-to-one algorithm ports, but nothing is claimed as byte-level aligned unless explicitly stated.

## Overview

| Domain | Denominator | Implemented | Status | Source inventory | Main track |
|---|---:|---:|---|---|---|
| event_types | 104 | constants + 104 ST canonical types | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| built-in slash commands | 153 | STScript runtime: scope/closure/pipe/abort/break + parser flags + command registry; commands implemented = the ST core subset emitted as registry metadata | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| macros / macros | 80+ | registry-based engine with full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 25 source request shapes ported with provider-specific overrides | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 15 source request shapes ported with backend-specific samplers | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers (including aliases) | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + 4 selectiveLogic modes + decorators + recursion gates + sticky/cooldown/delay | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema fields | 50+ | full schema fields including character_filter, triggers, group, sticky/cooldown/delay, scanDepth, decorators, etc. | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info evaluation pipeline steps | 39 | scan source assembly + decorator → activation precedence → selectiveLogic → recursion + delay/sticky/cooldown + budget + 8-bucket routing with AN patch + atDepth (depth, role) merge | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| character card V1 fields | 16 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V2 fields | 33 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V3 fields | 14 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema fields | 75 | PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager identifiers | 13 typed | 12 default prompts + RELATIVE/ABSOLUTE injection_position + injection_depth/order + injection_trigger + forbid_overrides + main/jailbreak override with {{original}} | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| built-in extensions | 14 | regex (full engine) + memory (settings + triggers + format) + vectors (settings + chunkText + injection plan) + quick-reply (auto-execute hook map) + token-counter + caption + tts + translate + expressions + attachments DataBank + connection-manager profiles + stable-diffusion trigger processor (plan-only for non-pure-logic ones) | partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| Persona schema fields | 20 | personaDescription block subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Group chat schema fields | 25 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| group chat rotation strategies | 4 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Quick reply schema fields | recorded | importer + extension wrapper subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | F |
| theme schema | recorded | importer + product surface settings slot subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |

The numbers are approximate. The inventory files and `@ydltavern/types` constants are the source of truth. `stubbed` means the API surface exists but behavior is not fully aligned; `partial` means tested code paths exist but no byte-level compatibility is claimed yet.

## Code paths now present

| Package | Track | Coverage | Status |
|---|---|---|---|
| `@ydltavern/types` | all | Turn model and ST event/slash/macro/connector/sampler/world-info/prompt-manager constants | stubbed foundation |
| `@ydltavern/importers` | B | character JSON/PNG, world book, JSONL chat, preset, persona, theme, quick reply, regex, instruct import/export skeleton + fixtures | partial |
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy, Turn store, full `getContext()` shape (`context-st.ts`), `eventSource`, `Generate`, macro engine (`macros-st.ts`: full ST registry + recursive expansion + PickState), STScript runtime (`stscript-st.ts`: scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution), slash registry | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders (`chat-completion-providers.ts` 25 sources + `text-completion-providers.ts` 15 sources), stream chunk state machine (`chat-completion-providers.ts`), token budget, PromptManager (`prompt-manager-st.ts`: 12 default prompts + RELATIVE/ABSOLUTE injection + injection_trigger + main/jailbreak override + squash + ChatCompletion tokenBudget), World Info (`world-info-st.ts`: 8-bucket routing + 4 selectiveLogic + regex + matchKeys + decorators + activation precedence + timed effects sticky/cooldown/delay + routeActivatedEntries), instruct mode (`instruct.ts`: full InstructTemplate schema + formatInstructModeChat + stoppingSequences + built-in templates), tokenizer registry (`tokenizers-st.ts`: 20 variants + bestMatch heuristics + guesstimate + TokenCountCache), golden harnesses, stream frames, model-boundary plans | partial |
| `@ydltavern/surface` | G | Tavern-like product shell + 5 diagnostic inspectors (PromptManager / World Info / STScript / Extensions / Connector) wired into DevDiagnosticsPanel, still a surface bundle | partial |
| `@ydltavern/extensions` | F + H | regex (`extensions-st.ts`: full engine + depth gating + capture groups + RegexProvider LRU), memory (settings + triggers + format), vectors (18 sources + chunkText + injection plan), quick-reply (9 auto-execute hooks), token-counter, caption (4 sources + plan), TTS (27 providers + plan), translate (9 providers + plan), expressions (classify + sprite cache), attachments (3 scopes + DataBank), connection-manager (18 profile fields + snapshot/apply), stable-diffusion (trigger processor + 10 backends), extension loader (`loader-st.ts`: manifest parse + validation + warnings + activation eligibility + sort + buildLoadPlan 6 step kinds + planActivateAll + STDisabledExtensionsStore) | partial |

## Built-in extension coverage (track F)

| extension | LoC | listens | emits | slash | API | Implementation status |
|---|---:|---:|---:|---:|---:|---|
| assets | 598 | 1 | 0 | 0 | 3 | inventoried |
| attachments | 410 | 3 | 0 | 8 | 0 | partial — 3 scopes + 14 slash commands + DataBankStore CRUD |
| caption | 813 | 2 | 2 | 1 | 2 | partial — 4 sources + planCaption |
| connection-manager | 1158 | 0 | 13 | 6 | 0 | partial — 18 profile fields + snapshot/apply |
| expressions | 2576 | 3 | 0 | 7 | 4 | partial — classify endpoint + sprite cache |
| gallery | 853 | 3 | 0 | 2 | 2 | inventoried |
| memory | 1131 | 1 | 0 | 1 | 0 | partial — full settings + shouldSummarize triggers + formatMemoryValue |
| quick-reply | 321 | 9 | 0 | 0 | 1 | partial — 9 auto-execute hook events + autoExecuteCandidates |
| regex | 2157 | 6 | 0 | 4 | 0 | partial — full engine: REGEX_PLACEMENT + getRegexedString + depth gating + capture groups + RegexProvider LRU |
| stable-diffusion | 5998 | 3 | 4 | 4 | 67 | partial — trigger processor with character/scenery patterns + 10 backends (plan-only) |
| token-counter | 118 | 0 | 0 | 1 | 0 | partial — tokenCounterPlan |
| translate | 804 | 5 | 0 | 1 | 8 | partial — 9 providers + shouldTranslateMessage auto_mode |
| tts | 1622 | 6 | 3 | 1 | 0 | partial — 27 providers + selectTtsSegments + planTtsNarration |
| vectors | 2358 | 9 | 1 | 9 | 9 | partial — 18 sources + chunkText + planVectorsInjection |
| **Total** | 20925 | 51 | 23 | 45 | 96 | — |

## Outside compatibility scope

The following are **inventoried but intentionally `deferred`**:

- Experimental ST APIs that the community has abandoned and that have not been maintained for a long time
- DOM selectors coupled to specific versions of ST UI libraries (jQuery/Bootstrap)
- ST internal bug behavior (marked as `bug_compat=false`)
- Temporary APIs that existed only in a specific commit range

The concrete list will be filled in while implementing inventory items.

## Third-party extension compatibility matrix

Third-party ST extensions are not in this matrix. They are not part of ST core. Compatibility grades for third-party extensions (runs directly / needs small changes / unsupported) will be maintained in a separate document when implementation reaches track H.

## How to read this matrix

- **Want to know whether YdlTavern is really 1:1**: check the numerator/denominator ratio for each domain. The denominator is the actual number of ST items.
- **Want to know whether a specific extension can run**: check track F extension coverage. The APIs each extension depends on are listed in its corresponding inventory section.
- **Want to know whether your preset runs the same in YdlTavern as in ST**: check the implemented progress for OpenAI preset schema, prompt manager identifiers, and samplers. Only when all three are implemented does prompt byte-level alignment hold.
- **Want to know whether your world book will trigger**: check world info trigger types, entry schema, and evaluation pipeline steps. Only when all three are implemented does WI behavior align.

## Update rules

- After an inventory item is implemented in YdlTavern, upgrade its status from `inventoried` to `partial` or `implemented`, with a link to the alignment test.
- Items that fail byte-level alignment stay `partial`, with a `delta` attached to the entry.
- Items actively marked `deferred` must include a `reason`.
- Matrix updates go through normal PRs. No special process is needed.
