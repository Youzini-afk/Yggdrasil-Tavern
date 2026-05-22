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

Current stage: first pass across the main capability surface is complete. ST source remains the ground truth; B/C/D/E/F/G/H/I now have runnable code paths, but nothing is claimed as byte-level aligned unless explicitly stated.

## Overview

| Domain | Denominator | Implemented | Status | Source inventory | Main track |
|---|---:|---:|---|---|---|
| event_types | 104 | constants + core event dispatch | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| built-in slash commands | 153 | core commands + STScript parser/evaluator skeleton | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| macros / macros | 80+ | core/env/time subset + trace | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 1 request builder | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | generic/textgen/kobold/ollama request-shape subset | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers (including aliases) | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + deterministic filters | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema fields | 50+ | core + routing/group/probability/timed fields | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info evaluation pipeline steps | 39 | scan/routing/deterministic filters/seeded group/probability/timed state subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| character card V1 fields | 16 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V2 fields | 33 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V3 fields | 14 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema fields | 75 | fixture request shape + prompt_order + token budget/golden harness subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager identifiers | 13 typed | prompt_order/marker/effective collection subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| built-in extensions | 14 | token-counter/regex/quick-reply/memory/vectors wrapper subset | partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
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
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy, Turn store, `getContext()`, `eventSource`, `Generate`, macros, slash registry, STScript parser/evaluator skeleton | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders, token budget, PromptManager, advanced World Info, golden harness, stream frames, model-boundary plan | partial |
| `@ydltavern/surface` | G | Tavern-like product shell: chat main, settings/assets/extensions/dev drawers, still a surface bundle | partial |
| `@ydltavern/extensions` | F + H | built-in extension wrappers, extension registry, ST-style manifest loader plan, permission gate, hook registry | partial |

## Built-in extension coverage (track F)

| extension | LoC | listens | emits | slash | API | Implementation status |
|---|---:|---:|---:|---:|---:|---|
| assets | 598 | 1 | 0 | 0 | 3 | inventoried |
| attachments | 410 | 3 | 0 | 8 | 0 | inventoried |
| caption | 813 | 2 | 2 | 1 | 2 | inventoried |
| connection-manager | 1158 | 0 | 13 | 6 | 0 | inventoried |
| expressions | 2576 | 3 | 0 | 7 | 4 | inventoried |
| gallery | 853 | 3 | 0 | 2 | 2 | inventoried |
| memory | 1131 | 1 | 0 | 1 | 0 | inventoried |
| quick-reply | 321 | 9 | 0 | 0 | 1 | inventoried |
| regex | 2157 | 6 | 0 | 4 | 0 | inventoried |
| stable-diffusion | 5998 | 3 | 4 | 4 | 67 | inventoried |
| token-counter | 118 | 0 | 0 | 1 | 0 | inventoried |
| translate | 804 | 5 | 0 | 1 | 8 | inventoried |
| tts | 1622 | 6 | 3 | 1 | 0 | inventoried |
| vectors | 2358 | 9 | 1 | 9 | 9 | inventoried |
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
