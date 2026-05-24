# SillyTavern Compatibility Matrix

> [English](./COMPATIBILITY_MATRIX.en.md) · [中文](./COMPATIBILITY_MATRIX.md)

This document is the public radar for YdlTavern's SillyTavern compatibility coverage. It has a mechanically generated baseline (ground truth comes from ST source scans), and implementation status is maintained by hand.

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

## Current coverage

ST core runtime has one-to-one algorithm ports: PromptManager, World Info, STScript, the macro engine, chat/text completion adapters, instruct mode, the tokenizer registry, built-in extension logic, ST API surface, and the extension loader all have runnable code paths, but no full-domain byte-level alignment is claimed unless explicitly stated. Same-window ST extension compatibility is in: `messageFormatting()` (showdown + DOMPurify + hooks), React DOM territory cession, `mountSTGlobals()`, ST URL layout shims, and BME/shujuku real-extension smoke. The current golden diff covers 20/20 scenarios: 20 perfect, 0 cosmetic, 0 structural, 0 unverifiable, 0 errors.

ST source remains the ground truth; any "full-domain byte-level ST alignment" claim must be backed by fixtures and alignment tests.

## Overview

| Domain | Denominator | Implemented | Status | Source inventory | Main track |
|---|---:|---:|---|---|---|
| event_types | 104 | constants + 104 ST canonical types | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| built-in slash commands | 199 canonical | ~150 implemented/plan-only commands across batches A-N + ~40 unsupported sentinels; STScript runtime: scope/closure/pipe/abort/break + parser flags + command registry | 199/199 canonical coverage, partial behavior | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| macros | 80+ | registry-based deep engine with full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState; golden harness currently has 4/4 perfect | implemented for current golden macro scenarios — `golden-harness/diff/macro-*.json` | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 25 source request shapes ported with provider-specific overrides; golden harness currently has 4/4 perfect | implemented for current golden chat scenarios — `golden-harness/diff/chat-*.json` | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 15 source request shapes ported with backend-specific samplers | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers (including aliases) | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + 4 selectiveLogic modes + decorators + recursion gates + sticky/cooldown/delay | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema fields | 50+ | full schema fields including character_filter, triggers, group, sticky/cooldown/delay, scanDepth, decorators, etc. | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info evaluation pipeline steps | 39 | scan source assembly + decorator → activation precedence → selectiveLogic → recursion + delay/sticky/cooldown + token-approximation budget + seeded probability + 8-bucket routing with AN patch + atDepth (depth, role) merge; golden harness currently has 4/4 perfect | implemented for current golden WI scenarios — `golden-harness/diff/world-info-*.json` | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| character card V1 fields | 16 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V2 fields | 33 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V3 fields | 14 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema fields | 75 | PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager identifiers | 13 typed | 12 default prompts + RELATIVE/ABSOLUTE injection_position + injection_depth/order + injection_trigger + forbid_overrides + main/jailbreak override with {{original}} | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| instruct mode templates | ST templates | ChatML / Llama3 golden scenarios are 2/2 perfect; other templates remain partial | implemented for current golden instruct scenarios | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: OPENAI/GPT2/LLAMA/LLAMA3/CLAUDE | 5 families | real local adapters; Claude is a local text approximation; golden harness is 6/6 perfect | implemented for current golden tokenizer scenarios | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: HF families | 9 families | `@huggingface/tokenizers` path for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A; `fetchHuggingFaceTokenizer` can runtime-fetch `tokenizer.json` through Yggdrasil `kernel.v1.outbound.execute`, with SHA-256 pinning and an LRU cache | partial-real | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| built-in extensions | 14 | 5/14 partial: regex real; memory/vectors/quick-reply/token-counter executable logic; caption/tts/translate/expressions/attachments/connection-manager/stable-diffusion mostly approximation/plan | 5/14 partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| extension JS execution | ST extension JS | Same-window ST DOM fork: DOM anchors, `globalThis` bootstrap, ST ESM URL shims, full page APIs; the QuickJS sandbox remains available for constrained synthetic tests | partial-real / same-window for real-extension smoke | `inventory/BUILTIN_EXTENSIONS.raw.md` | H |
| real model calls | provider HTTPS / WebSocket | `model.live_call` / `.stream` bridge to Yggdrasil `kernel.v1.outbound.execute` / `.stream`; `model.live_realtime` bridge to `kernel.v1.outbound.websocket.*` (OpenAI Realtime real; Gemini Live best-effort stub); API Connections can save encrypted keys through `official/secret-store-lab` and profiles use `secret_ref:store:*` by default | partial-opt-in | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| Product UI | qualitative | SillyTavern parity shell: 9/9 drawers, 50vw Sheld, ST `.mes`/`.mes_text` HTML message DOM, extension anchors, SendForm/StreamingIndicator/BackgroundLayer, 1000px + 768px responsive layout, provider-backed drawers | implemented for extension DOM scope | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |
| Benchmark coverage | 5 packages / 37 scenarios | `engine-core` 12, `importers` 6, `st-compat` 9, `extensions` 5, `surface` 5; the root baseline is committed at `perf/baseline.json` | implemented baseline reference | `docs/guides/PERFORMANCE_BASELINE.en.md` | B-track |
| Yggdrasil project install | Yggdrasil `project.yaml` + Home project card | Root `project.yaml` declares `type: yggdrasil_native`, `entry_surface_id: ydltavern/play`, engine/surface packages, and required surfaces; after `yg install` it appears as a first-class Home project with Play launch support | implemented | `project.yaml` / `packages/ydltavern-surface/manifest.yaml` | platform |
| Persona schema fields | 20 | personaDescription block subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Group chat schema fields | 25 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| group chat rotation strategies | 4 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Quick reply schema fields | recorded | importer + extension wrapper subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | F |
| theme schema | recorded | ST flat JSON importer/exporter + 3 ST classic presets + 3 native themes | implemented for UI theme import/export scope | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |

## UI parity

| UI domain | ST target | YdlTavern coverage | Status |
|---|---|---|---|
| Theme system | ST flat theme JSON + SmartTheme-style values | `importSTTheme` / `exportSTTheme` flat JSON round-trip; 29 `--tavern-*` tokens; Dark V 1.0 / Azure / Celestial Macaron | implemented |
| Settings panel / drawers | 9 ST top-drawer entries | TopBar + DrawerShell + 9 drawers; 8 on the left, Characters on the right; `useDrawers` mutual exclusion | implemented |
| API Connections drawer | Provider/model/base URL/profile selection + API keys | paste + save through Yggdrasil host RPC into encrypted `official/secret-store-lab`; profiles store only `secret_ref:store:NAME`; env `secret_ref:env:*` remains a fallback | implemented |
| Mobile responsive | ST 1000px mobile breakpoint + 768px tighter breakpoint | `mobile.css`: 1000px primary, 768px secondary, full-screen sheets, touch targets, safe-area, iOS 16px textarea | implemented |
| Message rendering | ST `.mes` template structure | `MessageBubble` / Avatar / Actions / EditToolbar / SwipeControls / ReasoningBlock / MediaWrapper mirror `.mes` structure | implemented |
| Settings forms / drawers | ST drawer forms backed by shared state | Sampler, connection, formatting, persona, characters, world books, backgrounds, and user settings all read/write TavernProvider; schema-versioned localStorage persists state | implemented |
| Surface bundle | Browser-loadable ESM surface package | tsc emits `dist/index.js`; Vite emits browser-ready `dist/bundle.mjs`; CSS and font assets are copied into `dist/styles/` and `dist/fonts/` | implemented |
| Fonts | Noto Sans + Noto Sans Mono | bundled via @fontsource (Noto Sans + Mono Latin subset, 4 woff2 files, ~50KB) | implemented |

The numbers are approximate. The inventory files and `@ydltavern/types` constants are the source of truth. `stubbed` means the API surface exists but behavior is not fully aligned; `partial` means tested code paths exist but no byte-level compatibility is claimed yet.

## Code paths now present

| Package | Track | Coverage | Status |
|---|---|---|---|
| `@ydltavern/types` | all | Turn model and ST event/slash/macro/connector/sampler/world-info/prompt-manager constants | stubbed foundation |
| `@ydltavern/importers` | B | character JSON/PNG, world book, JSONL chat, preset, persona, theme, quick reply, regex, instruct import/export skeleton + fixtures | partial |
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy, Turn store, full `getContext()` shape (`context-st.ts`), `eventSource`, `Generate`, macro re-exports (the deep implementation lives in engine-core), STScript runtime (`stscript-st.ts`), slash registry + batches A-N (~150 implemented/plan-only + ~40 unsupported, 199/199 canonical coverage) | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders, stream chunk state machine, token budget, PromptManager, World Info (token-approximation budget + seeded probability), instruct mode, deep macro engine, tokenizer registry + `countTokens(text, options)` real adapters + HF runtime fetcher + guesstimate, golden harness fixtures, stream frames, model-boundary plans | partial |
| `@ydltavern/surface` | G | Tavern-like product UI shell + `react-virtuoso` virtualized chat list + 9 wired drawers + TavernProvider settings/library state + browser-ready `dist/bundle.mjs` + 9 mount adapters + CSS/font asset copy + mobile responsive + diagnostic inspectors | implemented for current surface scope |
| `@ydltavern/extensions` | F + H | regex real engine, memory/vectors/quick-reply/token-counter executable logic, provider/IO-heavy extensions as plan/approximation, extension loader (manifest parse + validation + activation plan), QuickJS sandbox runtime/bridge/ESM loader/permissions/audit/browser stubs; `realExtensionLoad` opt-in supports synthetic micro-BME and env-gated real BME smoke | partial-sandboxed / partial-opt-in |
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

## Slash command batch coverage

| Batch | Category | Coverage |
|---|---|---|
| A-G | Earlier batches (chat / messages / WI / persona / etc.) | combined ~50+ implemented |
| H | Variables / Control / Math | 24 commands, all real |
| I | Chat / Messages Extras | 21 commands: 8 real + 6 plan-only + 7 unsupported |
| J | Characters / Group / Persona / Tags | 17 commands: 11 real + 6 plan-only |
| K | World Info / Lorebook | 11 commands: 7 real + 4 plan-only |
| L | Preset / Settings | 21 commands: 14 real + 1 plan-only + 6 unsupported |
| M | Extension / Tools | 36 commands: 2 real + 4 plan-only + 30 unsupported |
| N | Debug / Dev / Secret | 8 commands: 3 real + 5 plan-only |

Together: ~150+ slash command registrations + ~40 explicit unsupported sentinels = 199/199 ST canonical commands. Plan-only descriptors return JSON `{ planned: true, action, fields }`; unsupported sentinels throw `SlashCommandUnsupportedError`.

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
