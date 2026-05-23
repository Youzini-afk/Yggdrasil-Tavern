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

Current stage: deep-port complete, with Round 3 T-track tightening, Round 4 U-track closure, Round 5 V-track UI parity, Round 6 W-track convergence, Round 7 X-track slash/font closure, and Round 8 Y-track ST extension same-window compatibility complete. ST source remains the ground truth; B/C/D/E/F/G/H/I now have runnable code paths, and PromptManager / World Info / STScript / macro engine / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader have one-to-one algorithm ports, but no full-domain byte-level alignment is claimed unless explicitly stated. The current golden diff covers 20/20 scenarios: 20 perfect, 0 cosmetic, 0 structural, 0 unverifiable, 0 errors.

## Round 3 T-track summary (May 2026)

After T-track tightening (T1-T4):
- Golden harness: 20 scenarios, 9 perfect, 3 cosmetic, 8 structural, 0 unverifiable, 0 error
- Instruct ChatML/Llama3 templates: byte-perfect against ST
- Tokenizer self-baseline (5 families): byte-perfect across runs
- World Info evaluator: structural deltas documented; ST shim now executes real `checkWorldInfo`
- Macros: env-basic byte-perfect; remaining structural deltas documented
- Surface descriptor: now Yggdrasil package-manifest compliant (`manifest.yaml`); React bundle descriptor (`surface.manifest.json`) retained for SurfaceHost

See `golden-harness/diff/_summary.json` for the canonical breakdown.

## Round 4 U-track summary (May 2026)

After U1-U5 and the U6 documentation pass:

- Golden harness at Round 4 close: 20 scenarios, 16 perfect, 4 cosmetic, 0 structural, 0 unverifiable, 0 error.
- Chat scenarios at Round 4 close: 4/4 cosmetic-only; the previous tools/tool_choice structural delta was closed.
- World Info scenarios: 4/4 byte-perfect after token-approximation budget alignment and seeded probability controls.
- Macro scenarios: 4/4 byte-perfect after moving the deep ST-compatible macro implementation into engine-core and making st-compat re-export it.
- Instruct scenarios: 2/2 byte-perfect; tokenizer scenarios: 6/6 byte-perfect self-baseline.
- Real extension loading: the QuickJS sandbox can load ESM-shaped extensions with relative imports, virtual ST host module mappings, audited browser stubs, and the `realExtensionLoad` permission gate. Synthetic micro-BME is always-on in tests; real BME is opt-in via `YGG_BME_TEST_PATH` and still stops before full functional boot on unsupported import/stub paths.

## Round 5 V-track summary (May 2026)

After V1-V7 UI parity work:

- UI parity: 9/9 ST drawers are represented in the React shell (AI Config, API Connections, Advanced Formatting, World Info, User Settings, Backgrounds, Extensions, Persona, Characters).
- Visual tokens: ST-aligned with 29 new scoped `--tavern-*` variables and scoped text-shadow under `.tavern-themed-root`.
- Themes: 3 ST classic presets are available (Dark V 1.0, Azure, Celestial Macaron), alongside 3 YdlTavern native themes.
- Theme system: ST flat JSON import/export is implemented through `st-theme-importer.ts`.
- Message bubble: ST `.mes` DOM structure parity for avatar, IDs, timers, token counter, name/timestamp, buttons, swipe controls, reasoning, media, and bias blocks.
- Mobile: 1000px primary and 768px secondary breakpoints; drawers become full-screen sheets with larger touch targets, safe-area spacing, reduced-motion, and forced-colors handling.
- Surface manifest: `manifest.yaml` and `surface.manifest.json` now expose 9 contributions (3 original + 6 drawer-specific entries).

## Round 6 W-track summary (May 2026)

After W1-W7 fork completion work:

- Golden harness: 20 scenarios, 20 perfect, 0 cosmetic, 0 structural, 0 unverifiable, 0 error.
- Chat scenarios: 4/4 implemented and golden-harness verified after provider body field ordering was aligned.
- TavernProvider: full settings slices, library collections, CRUD/message operations, schema-versioned localStorage persistence, and v1→v2 migration now back all 9 drawers.
- Surface bundle: Vite emits browser-ready `dist/bundle.mjs`; 9 mount adapters are exported and referenced by manifests.
- Surface assets: `copy-assets.mjs` copies CSS and fonts; `surface.css` declares self-hosted Noto Sans / Noto Sans Mono with system fallback.
- E2E integration: Yggdrasil `clients/web` can resolve the YdlTavern demo bundle and mount it in the sandboxed SurfaceHost development path.

## Round 7 X-track summary (May 2026)

X-track closed the remaining slash-command and font-packaging work:

- Slash command registry: 14 batches (A-N) are registered through `createSTContextDeep`; batches H-N add variables/control/math, chat/message extras, character/group/persona/tag, world-info/lorebook, preset/settings, extension/tools, and debug/dev/secret coverage.
- Canonical command coverage: ~150 implemented/plan-only registrations plus ~40 explicit unsupported sentinels cover 199/199 ST canonical commands. Plan-only descriptors return JSON `{ planned: true, action, fields }`; unsupported sentinels throw `SlashCommandUnsupportedError` with a reason.
- Fonts: surface builds bundle Noto Sans + Noto Sans Mono via @fontsource (Latin subset, 4 woff2 files, ~50KB) rather than relying on manually supplied production font files.
- Golden harness remains 20/20 perfect after all 8 W-track structural diffs were closed.

Batch breakdown:

| Batch | Category | Coverage |
|---|---|---|
| H | Variables/Control/Math | 24 commands, all real |
| I | Chat/Messages Extras | 21 commands: 8 real + 6 plan-only + 7 unsupported |
| J | Characters/Group/Persona/Tags | 17 commands: 11 real + 6 plan-only |
| K | World Info/Lorebook | 11 commands: 7 real + 4 plan-only |
| L | Preset/Settings | 21 commands: 14 real + 1 plan-only + 6 unsupported |
| M | Extension/Tools | 36 commands: 2 real + 4 plan-only + 30 unsupported |
| N | Debug/Dev/Secret | 8 commands: 3 real + 5 plan-only |

## Round 8 Y-track summary (May 2026)

Y-track completed the same-window ST extension host:

- `.mes_text` now renders sanitized HTML through `formatMessage()` rather than plain React text.
- React renders ST DOM anchors and cedes explicit jQuery territories: `#chat`, `#extensions_settings`, `#extensions_settings2`, `#extensionsMenu`, `#movingDivs`, `#leftSendForm`, `#rightSendForm`, and `.mes_buttons_extra`.
- `mountSTGlobals()` installs `SillyTavern`, `eventSource`, `chat`, `characters`, settings, slash helpers, formatting helpers, and legacy libraries on `globalThis`.
- ST-standard ESM shim URLs exist at `/script.js` plus six `/scripts/` modules.
- The messageFormatting pipeline uses showdown + DOMPurify + hooks.
- Real extension smoke tests verify BME and shujuku bootstrap chains.
- Round 8 close counts: `ydltavern-surface` 88 tests passing; `ydltavern-st-compat` 703 tests passing.

| Capability | Before R8 | After R8 |
|---|---|---|
| `.mes_text` rendering | Plain text via React children | `dangerouslySetInnerHTML` via `formatMessage()` |
| Extension DOM IDs | Missing | All audited ST IDs rendered |
| ST globals | sandbox-only | Real `globalThis` via `mountSTGlobals` |
| ESM compat shims | Missing | `/script.js` + 6 `scripts/` shim files |
| messageFormatting pipeline | None | Full ST pipeline with hooks |
| Real extension smoke | Sandbox-only | Bootstrap chain verified |

## Overview

| Domain | Denominator | Implemented | Status | Source inventory | Main track |
|---|---:|---:|---|---|---|
| event_types | 104 | constants + 104 ST canonical types | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| built-in slash commands | 199 canonical | ~150 implemented/plan-only commands across batches A-N + ~40 unsupported sentinels; STScript runtime: scope/closure/pipe/abort/break + parser flags + command registry | 199/199 canonical coverage, partial behavior | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| macros / macros | 80+ | registry-based deep engine with full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState; golden harness currently has 4/4 perfect (env/nested/random/time are all byte-identical) | implemented for current golden macro scenarios — `golden-harness/diff/macro-*.json` | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 25 source request shapes ported with provider-specific overrides; golden harness currently has 4/4 perfect, 0 cosmetic, and 0 structural | implemented for current golden chat scenarios — `golden-harness/diff/chat-*.json` | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 15 source request shapes ported with backend-specific samplers | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers (including aliases) | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + 4 selectiveLogic modes + decorators + recursion gates + sticky/cooldown/delay | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema fields | 50+ | full schema fields including character_filter, triggers, group, sticky/cooldown/delay, scanDepth, decorators, etc. | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info evaluation pipeline steps | 39 | scan source assembly + decorator → activation precedence → selectiveLogic → recursion + delay/sticky/cooldown + token-approximation budget + seeded probability + 8-bucket routing with AN patch + atDepth (depth, role) merge; golden harness currently has 4/4 perfect | implemented for current golden WI scenarios — `golden-harness/diff/world-info-*.json` | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| character card V1 fields | 16 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V2 fields | 33 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| character card V3 fields | 14 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema fields | 75 | PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager identifiers | 13 typed | 12 default prompts + RELATIVE/ABSOLUTE injection_position + injection_depth/order + injection_trigger + forbid_overrides + main/jailbreak override with {{original}} | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| instruct mode templates | ST templates | ChatML / Llama3 golden scenarios are 2/2 perfect; other templates remain partial | implemented for current golden instruct scenarios | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: OPENAI/GPT2/LLAMA/LLAMA3/CLAUDE | 5 families | real local adapters; Claude is a local text approximation; golden harness is 6/6 perfect | implemented for current golden tokenizer scenarios | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: HF families | 9 families | `@huggingface/tokenizers` path for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A; `fetchHuggingFaceTokenizer` can runtime-fetch `tokenizer.json` through Yggdrasil `kernel.outbound.execute`, with SHA-256 pinning and an LRU cache | partial-real | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| built-in extensions | 14 | 5/14 partial: regex real; memory/vectors/quick-reply/token-counter executable logic; caption/tts/translate/expressions/attachments/connection-manager/stable-diffusion mostly approximation/plan | 5/14 partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| extension JS execution | ST extension JS | Same-window ST DOM fork for browser extensions: DOM anchors, `globalThis` bootstrap, ST ESM URL shims, full page APIs; QuickJS sandbox remains available for constrained synthetic tests | partial-real / same-window implemented for Round 8 smoke | `inventory/BUILTIN_EXTENSIONS.raw.md` | H |
| real model calls | provider HTTPS / WebSocket | `model.live_call` / `.stream` bridge to Yggdrasil `kernel.outbound.execute` / `.stream`; `model.live_realtime` bridge to `kernel.outbound.websocket.*` (OpenAI Realtime real; Gemini Live best-effort stub); requires live profile + env secrets | partial-opt-in | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| Product UI | qualitative | SillyTavern parity shell: 9/9 drawers, 50vw Sheld, ST `.mes`/`.mes_text` HTML message DOM, extension anchors, SendForm/StreamingIndicator/BackgroundLayer, 1000px + 768px responsive layout, provider-backed drawers | implemented for Round 8 extension DOM scope | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |
| Benchmark coverage | 5 packages / 37 scenarios | `engine-core` 12, `importers` 6, `st-compat` 9, `extensions` 5, `surface` 5; the root baseline is committed at `perf/baseline.json` | implemented baseline reference | `docs/guides/PERFORMANCE_BASELINE.en.md` | B-track |
| Persona schema fields | 20 | personaDescription block subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Group chat schema fields | 25 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| group chat rotation strategies | 4 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Quick reply schema fields | recorded | importer + extension wrapper subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | F |
| theme schema | recorded | ST flat JSON importer/exporter + 3 ST classic presets + 3 native themes | implemented for UI theme import/export scope | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |

## UI parity rows (Round 5 V-track)

| UI domain | ST target | YdlTavern coverage | Status |
|---|---|---|---|
| Theme system | ST flat theme JSON + SmartTheme-style values | `importSTTheme` / `exportSTTheme` flat JSON round-trip; 29 `--tavern-*` tokens; Dark V 1.0 / Azure / Celestial Macaron | implemented |
| Settings panel / drawers | 9 ST top-drawer entries | TopBar + DrawerShell + 9 drawers; 8 on the left, Characters on the right; `useDrawers` mutual exclusion | implemented |
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
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy, Turn store, full `getContext()` shape (`context-st.ts`), `eventSource`, `Generate`, macro re-exports (the deep implementation lives in engine-core), STScript runtime (`stscript-st.ts`: scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution), slash registry + batches A-N (~150 implemented/plan-only + ~40 unsupported, 199/199 canonical coverage) | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders, stream chunk state machine, token budget, PromptManager, World Info (token-approximation budget + seeded probability), instruct mode, deep macro engine, tokenizer registry + `countTokens(text, options)` real adapters (OpenAI/GPT2/Llama/Llama3/Claude/HF-source) + HF runtime fetcher + guesstimate, golden harness fixtures, stream frames, model-boundary plans | partial |
| `@ydltavern/surface` | G | Tavern-like product UI shell + `react-virtuoso` virtualized chat list + 9 wired drawers + TavernProvider settings/library state + browser-ready `dist/bundle.mjs` + 9 mount adapters + CSS/font asset copy + mobile responsive + diagnostic inspectors | implemented for Round 6 surface scope |
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
