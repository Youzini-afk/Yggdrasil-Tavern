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
- `partial-real` — a real local adapter / execution path exists, but full byte-level coverage is not claimed
- `partial-source-required` — a real execution path exists, but the caller must supply external tokenizer/source/config
- `partial-sandboxed` — execution works inside a constrained sandbox; DOM/network/etc. remain incomplete
- `partial-opt-in` — a real path exists only when the host/profile/env explicitly enable it

Current stage: deep-port complete and Round 3 T-track tightening complete. ST source remains the ground truth; B/C/D/E/F/G/H/I now have runnable code paths, and PromptManager / World Info / STScript / macro engine / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader have one-to-one algorithm ports, but nothing is claimed as byte-level aligned unless explicitly stated. Round 3 golden diff now covers 20/20 scenarios: 9 perfect, 3 cosmetic, 8 structural, 0 unverifiable, 0 errors.

## Round 3 T-track summary (May 2026)

After T-track tightening (T1-T4):
- Golden harness: 20 scenarios, 9 perfect, 3 cosmetic, 8 structural, 0 unverifiable, 0 error
- Instruct ChatML/Llama3 templates: byte-perfect against ST
- Tokenizer self-baseline (5 families): byte-perfect across runs
- World Info evaluator: structural deltas documented; ST shim now executes real `checkWorldInfo`
- Macros: env-basic byte-perfect; remaining structural deltas documented
- Surface descriptor: now Yggdrasil package-manifest compliant (`manifest.yaml`); React bundle descriptor (`surface.manifest.json`) retained for SurfaceHost

See `golden-harness/diff/_summary.json` for the canonical breakdown.

## Overview

| Domain | Denominator | Implemented | Status | Source inventory | Main track |
|---|---:|---:|---|---|---|
| event_types | 104 | constants + 104 ST canonical types | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| built-in slash commands | 153 | 70 commands implemented across batches A-G; STScript runtime: scope/closure/pipe/abort/break + parser flags + command registry | 70/153 partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| macros / macros | 80+ | registry-based engine with full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState; golden harness currently has 1/4 perfect and 3/4 structural (env-basic is byte-perfect; nested/random/time still have structural deltas) | partial (env macros perfect; nested/random/time macros have structural deltas documented) — `golden-harness/diff/macro-*.json` | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 25 source request shapes ported with provider-specific overrides; golden harness currently has 0/4 perfect, 3/4 cosmetic, and 1/4 structural (the OpenAI shape is closer to ST but not byte-perfect) | partial (golden harness shows cosmetic-only deltas for 3/4 and one remaining structural delta; still not byte-perfect) — `golden-harness/diff/chat-*.json` | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 15 source request shapes ported with backend-specific samplers | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers (including aliases) | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + 4 selectiveLogic modes + decorators + recursion gates + sticky/cooldown/delay | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema fields | 50+ | full schema fields including character_filter, triggers, group, sticky/cooldown/delay, scanDepth, decorators, etc. | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info evaluation pipeline steps | 39 | scan source assembly + decorator → activation precedence → selectiveLogic → recursion + delay/sticky/cooldown + budget + 8-bucket routing with AN patch + atDepth (depth, role) merge; golden harness currently has 0/4 perfect and 4/4 structural (the ST shim now executes real `checkWorldInfo` and emits comparable activation results) | partial (golden harness diffs documented; ST shim now drives real WI activation) — `golden-harness/diff/world-info-*.json` | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| character card V1 fields | 16 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V2 fields | 33 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V3 fields | 14 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema fields | 75 | PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager identifiers | 13 typed | 12 default prompts + RELATIVE/ABSOLUTE injection_position + injection_depth/order + injection_trigger + forbid_overrides + main/jailbreak override with {{original}} | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| instruct mode templates | ST templates | ChatML / Llama3 golden scenarios are 2/2 perfect; other templates remain partial | partial — ChatML/Llama3 implemented (golden harness verified) | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: OPENAI/GPT2/LLAMA/LLAMA3/CLAUDE | 5 families | real local adapters; Claude is a local text approximation; golden harness is 6/6 perfect | implemented (golden harness verified) | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: HF families | 9 families | `@huggingface/tokenizers` path for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A; `fetchHuggingFaceTokenizer` can runtime-fetch `tokenizer.json` through Yggdrasil `kernel.outbound.execute`, with SHA-256 pinning and an LRU cache | partial-real | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| built-in extensions | 14 | 5/14 partial: regex real; memory/vectors/quick-reply/token-counter executable logic; caption/tts/translate/expressions/attachments/connection-manager/stable-diffusion mostly approximation/plan | 5/14 partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| extension JS execution | ST extension JS | QuickJS sandbox v0 + host bridge + permissions/audit; no network/fetch/XHR; DOM/style/i18n incomplete | partial-sandboxed | `inventory/BUILTIN_EXTENSIONS.raw.md` | H |
| real model calls | provider HTTPS / WebSocket | `model.live_call` / `.stream` bridge to Yggdrasil `kernel.outbound.execute` / `.stream`; `model.live_realtime` bridge to `kernel.outbound.websocket.*` (OpenAI Realtime real; Gemini Live best-effort stub); requires live profile + env secrets | partial-opt-in | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| Product UI | qualitative | product shell with virtualized chat list, themes, settings tabs, extension drawer, quick reply, mobile responsive | partial-shell-with-virtualization-and-themes | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |
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
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy, Turn store, full `getContext()` shape (`context-st.ts`), `eventSource`, `Generate`, macro engine (`macros-st.ts`: full ST registry + recursive expansion + PickState), STScript runtime (`stscript-st.ts`: scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution), slash registry + 70 batches A-G commands | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders, stream chunk state machine, token budget, PromptManager, World Info, instruct mode, tokenizer registry + `countTokens(text, options)` real adapters (OpenAI/GPT2/Llama/Llama3/Claude/HF-source) + HF runtime fetcher + guesstimate, golden harness fixtures, stream frames, model-boundary plans | partial |
| `@ydltavern/surface` | G | Tavern-like product UI shell + `react-virtuoso` virtualized chat list + dark/light/parchment themes + Connection/Sampler/Persona/Theme settings tabs + loader-st ExtensionsDrawer + QuickReplyBar + mobile responsive + diagnostic inspectors | partial-shell-with-virtualization-and-themes |
| `@ydltavern/extensions` | F + H | regex real engine, memory/vectors/quick-reply/token-counter executable logic, provider/IO-heavy extensions as plan/approximation, extension loader (manifest parse + validation + activation plan), QuickJS sandbox runtime/bridge/loader/permissions/audit | partial-sandboxed |
| `@ydltavern/engine` | C | deep-port capabilities plus `model.live_call` / `model.live_call.stream` through Yggdrasil outbound execute/stream and `model.live_realtime` through outbound websocket; manifest declares provider hosts, WEBSOCKET methods, and `secret_refs` | partial-opt-in |

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
