# SillyTavern 兼容矩阵

> [English](./COMPATIBILITY_MATRIX.en.md) · [中文](./COMPATIBILITY_MATRIX.md)

这份文档是 YdlTavern 跟 SillyTavern 兼容覆盖率的对外雷达。它机械生成基线（ground truth 来自 ST 源码扫描），人工维护实现状态。每条轨道推进时更新这一份。

数字含义：

```text
分母 = ST 源码扫描出的实际项数
分子 = YdlTavern 已实现并通过对齐测试的项数
```

实现状态：

- `inventoried` —— 已扫到、记录在 inventory，未实现
- `stubbed` —— 兼容层有占位，行为不对齐
- `partial` —— 部分对齐
- `implemented` —— 字节级对齐，有回归测试
- `deferred` —— 内部决定不做
- `blocked` —— 等其他轨道
- `partial-real` —— 有真实本地 adapter / 执行路径，但尚未声明全域字节级对齐
- `partial-source-required` —— 有真实执行路径，但需要调用方提供外部 tokenizer/source/config
- `partial-sandboxed` —— 能在受限 sandbox 中执行，DOM/网络等能力仍不完整
- `partial-opt-in` —— 需要 host/profile/env 显式启用的真实路径

当前阶段：深度移植完成，Round 3 T-track tightening、Round 4 U-track closure、Round 5 V-track UI parity、Round 6 W-track 收敛、Round 7 X-track slash/font 收尾与 Round 8 Y-track ST extension same-window compatibility 已完成。ST 源码仍是 ground truth；B/C/D/E/F/G/H/I 均已有可运行代码路径，PromptManager / World Info / STScript / 宏引擎 / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader 已有一对一算法移植，但除明确说明外还不是全域字节级对齐。当前 golden diff 覆盖 20/20 scenarios：20 perfect、0 cosmetic、0 structural、0 unverifiable、0 error。

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
- Real extension loading: QuickJS sandbox can load ESM-shaped extensions with relative imports, virtual ST host module mappings, audited browser stubs, and the `realExtensionLoad` permission gate. Synthetic micro-BME is always-on in tests; real BME is opt-in via `YGG_BME_TEST_PATH` and still stops before full functional boot on unsupported import/stub paths.

## Round 5 V-track summary (May 2026)

After V1-V7 UI parity work:

- UI parity: 9/9 ST drawers represented in the React shell (AI Config, API Connections, Advanced Formatting, World Info, User Settings, Backgrounds, Extensions, Persona, Characters).
- Visual tokens: ST-aligned with 29 new scoped `--tavern-*` variables and scoped text-shadow under `.tavern-themed-root`.
- Themes: 3 ST classic presets available (Dark V 1.0, Azure, Celestial Macaron), alongside 3 YdlTavern native themes.
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

Y-track 完成 same-window ST extension host：

- `.mes_text` 现在通过 `formatMessage()` 渲染 sanitized HTML，而不是 React plain text。
- React 渲染 ST DOM anchors，并明确让出 jQuery territories：`#chat`、`#extensions_settings`、`#extensions_settings2`、`#extensionsMenu`、`#movingDivs`、`#leftSendForm`、`#rightSendForm` 与 `.mes_buttons_extra`。
- `mountSTGlobals()` 将 `SillyTavern`、`eventSource`、`chat`、`characters`、settings、slash helpers、formatting helpers 与 legacy libraries 安装到 `globalThis`。
- ST 标准 ESM shim URLs 已存在：`/script.js` 加六个 `/scripts/` modules。
- messageFormatting pipeline 使用 showdown + DOMPurify + hooks。
- 真实扩展 smoke tests 验证 BME 与 shujuku bootstrap chains。
- Round 8 收尾测试数：`ydltavern-surface` 88 tests passing；`ydltavern-st-compat` 703 tests passing。

| Capability | Before R8 | After R8 |
|---|---|---|
| `.mes_text` rendering | Plain text via React children | `dangerouslySetInnerHTML` via `formatMessage()` |
| Extension DOM IDs | Missing | All audited ST IDs rendered |
| ST globals | sandbox-only | Real `globalThis` via `mountSTGlobals` |
| ESM compat shims | Missing | `/script.js` + 6 `scripts/` shim files |
| messageFormatting pipeline | None | Full ST pipeline with hooks |
| Real extension smoke | Sandbox-only | Bootstrap chain verified |

## 总览

| 域 | 分母 | 实现 | 状态 | 来源 inventory | 主要轨道 |
|---|---:|---:|---|---|---|
| event_types | 104 | 常量 + 104 ST canonical types | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| 内置 slash commands | 199 canonical | ~150 implemented/plan-only commands across batches A-N + ~40 unsupported sentinels; STScript runtime: scope/closure/pipe/abort/break + parser flags + command registry | 199/199 canonical coverage, partial behavior | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| 宏 / macros | 80+ | registry-based deep engine with full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState；golden harness 当前 4/4 perfect（env/nested/random/time 全部字节级对齐） | implemented for current golden macro scenarios — `golden-harness/diff/macro-*.json` | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 25 source request shapes ported with provider-specific overrides；golden harness 当前 4/4 perfect、0 cosmetic、0 structural | implemented for current golden chat scenarios — `golden-harness/diff/chat-*.json` | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 15 source request shapes ported with backend-specific samplers | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers（含 alias） | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + 4 selectiveLogic modes + decorators + recursion gates + sticky/cooldown/delay | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema 字段 | 50+ | full schema fields including character_filter, triggers, group, sticky/cooldown/delay, scanDepth, decorators, etc. | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info 评估流水线步骤 | 39 | scan source assembly + decorator → activation precedence → selectiveLogic → recursion + delay/sticky/cooldown + token-approximation budget + seeded probability + 8-bucket routing with AN patch + atDepth (depth, role) merge；golden harness 当前 4/4 perfect | implemented for current golden WI scenarios — `golden-harness/diff/world-info-*.json` | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| 角色卡 V1 字段 | 16 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| 角色卡 V2 字段 | 33 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| 角色卡 V3 字段 | 14 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema 字段 | 75 | PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager 标识符 | 13 typed | 12 default prompts + RELATIVE/ABSOLUTE injection_position + injection_depth/order + injection_trigger + forbid_overrides + main/jailbreak override with {{original}} | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| instruct mode templates | ST templates | ChatML / Llama3 golden scenarios 2/2 perfect；其它模板仍保持 partial 覆盖 | implemented for current golden instruct scenarios | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: OPENAI/GPT2/LLAMA/LLAMA3/CLAUDE | 5 families | real local adapters; Claude is local text approximation；golden harness 6/6 perfect | implemented for current golden tokenizer scenarios | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: HF families | 9 families | `@huggingface/tokenizers` path for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A；`fetchHuggingFaceTokenizer` 可经 Yggdrasil `kernel.v1.outbound.execute` runtime-fetch `tokenizer.json`，支持 SHA-256 pin 与 LRU cache | partial-real | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| 内置扩展 | 14 | 5/14 partial: regex real; memory/vectors/quick-reply/token-counter executable logic; caption/tts/translate/expressions/attachments/connection-manager/stable-diffusion mostly approximation/plan | 5/14 partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| 扩展 JS 执行 | ST extension JS | Same-window ST DOM fork for browser extensions: DOM anchors, `globalThis` bootstrap, ST ESM URL shims, full page APIs; QuickJS sandbox remains available for constrained synthetic tests | partial-real / same-window implemented for Round 8 smoke | `inventory/BUILTIN_EXTENSIONS.raw.md` | H |
| 真实模型调用 | provider HTTPS / WebSocket | `model.live_call` / `.stream` bridge to Yggdrasil `kernel.v1.outbound.execute` / `.stream`；`model.live_realtime` bridge to `kernel.v1.outbound.websocket.*`（OpenAI Realtime real；Gemini Live best-effort stub）；API Connections 可通过 `official/secret-store-lab` 加密保存 key，profile 默认只保存 `secret_ref:store:*` | partial-opt-in | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| Product UI | qualitative | SillyTavern parity shell: 9/9 drawers, 50vw Sheld, ST `.mes`/`.mes_text` HTML message DOM, extension anchors, SendForm/StreamingIndicator/BackgroundLayer, 1000px + 768px responsive layout, provider-backed drawers | implemented for Round 8 extension DOM scope | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |
| Benchmark coverage | 5 packages / 37 scenarios | `engine-core` 12、`importers` 6、`st-compat` 9、`extensions` 5、`surface` 5；根基线已提交到 `perf/baseline.json` | implemented baseline reference | `docs/guides/PERFORMANCE_BASELINE.md` | B-track |
| Persona schema 字段 | 20 | personaDescription block subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Group chat schema 字段 | 25 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| 群聊轮换策略 | 4 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Quick reply schema 字段 | 已记录 | importer + extension wrapper subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | F |
| 主题 schema | 已记录 | ST flat JSON importer/exporter + 3 ST classic presets + 3 native themes | implemented for UI theme import/export scope | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |

## UI parity rows（Round 5 V-track）

| UI 域 | ST 目标 | YdlTavern 覆盖 | 状态 |
|---|---|---|---|
| Theme system | ST flat theme JSON + SmartTheme-style values | `importSTTheme` / `exportSTTheme` flat JSON round-trip；29 个 `--tavern-*` token；Dark V 1.0 / Azure / Celestial Macaron | implemented |
| Settings panel / drawers | 9 个 ST 顶部抽屉入口 | TopBar + DrawerShell + 9 drawers；左侧 8 个，右侧 Characters；`useDrawers` mutual exclusion | implemented |
| API Connections drawer | Provider/model/base URL/profile 选择 + API keys | 功能可用：paste + save 通过 Yggdrasil host RPC 把 raw key 保存到加密的 `official/secret-store-lab`，profiles 只保存 `secret_ref:store:NAME`，显示 secret-store 状态；env `secret_ref:env:*` 仍可 fallback | implemented |
| Mobile responsive | ST 1000px mobile breakpoint + 768px tighter breakpoint | `mobile.css`：1000px primary、768px secondary、full-screen sheets、touch target、safe-area、iOS 16px textarea | implemented |
| Message rendering | ST `.mes` template structure | `MessageBubble` / Avatar / Actions / EditToolbar / SwipeControls / ReasoningBlock / MediaWrapper 复刻 `.mes` 结构 | implemented |
| Settings forms / drawers | ST drawer forms backed by shared state | Sampler, connection, formatting, persona, characters, world books, backgrounds, user settings all read/write TavernProvider; schema-versioned localStorage persists state | implemented |
| Surface bundle | Browser-loadable ESM surface package | tsc emits `dist/index.js`; Vite emits browser-ready `dist/bundle.mjs`; CSS and font assets copied into `dist/styles/` and `dist/fonts/` | implemented |
| Fonts | Noto Sans + Noto Sans Mono | bundled via @fontsource (Noto Sans + Mono Latin subset, 4 woff2 files, ~50KB) | implemented |

数字大致计数。准确数字以 inventory 和 `@ydltavern/types` 常量为准。`stubbed` 表示 API 表面存在但行为未完整对齐；`partial` 表示已有可测试代码路径但还没宣称字节级兼容。

## 已落地代码路径

| 包 | 轨道 | 覆盖 | 状态 |
|---|---|---|---|
| `@ydltavern/types` | 全部 | Turn 模型、ST event/slash/macro/connector/sampler/world-info/prompt-manager 常量 | stubbed 基础 |
| `@ydltavern/importers` | B | 角色卡 JSON/PNG、世界书、JSONL chat importer + ST-like fixtures | partial |
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy、Turn store、完整 `getContext()` shape（`context-st.ts`）、`eventSource`、`Generate`、宏 re-export（深实现位于 engine-core）、STScript 运行时（`stscript-st.ts`：scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution）、slash registry + batches A-N（~150 implemented/plan-only + ~40 unsupported，199/199 canonical coverage） | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders、stream chunk 状态机、token budget、PromptManager、World Info（token-approximation budget + seeded probability）、instruct mode、deep macro engine、tokenizer registry + `countTokens(text, options)` real adapters（OpenAI/GPT2/Llama/Llama3/Claude/HF-source）+ HF runtime fetcher + guesstimate、golden harness fixtures、stream frames、model boundary plan | partial |
| `@ydltavern/surface` | G | Tavern-like product UI shell + `react-virtuoso` 虚拟聊天列表 + 9 wired drawers + TavernProvider settings/library state + browser-ready `dist/bundle.mjs` + 9 mount adapters + CSS/font asset copy + mobile responsive + diagnostic inspectors | implemented for Round 6 surface scope |
| `@ydltavern/extensions` | F + H | regex real engine、memory/vectors/quick-reply/token-counter executable logic、provider/IO-heavy extensions as plan/approximation、extension loader（manifest parse + validation + activation plan）、QuickJS sandbox runtime/bridge/ESM loader/permissions/audit/browser stubs；`realExtensionLoad` opt-in supports synthetic micro-BME and env-gated real BME smoke | partial-sandboxed / partial-opt-in |
| `@ydltavern/engine` | C | deep-port capabilities plus `model.live_call` / `model.live_call.stream` through Yggdrasil outbound execute/stream and `model.live_realtime` through outbound websocket; manifest declares provider hosts, WEBSOCKET methods, and `secret_refs` | partial-opt-in |

## 内置扩展覆盖度（F 轨道）

| extension | LoC | listens | emits | slash | API | 实现状态 |
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
| **共计** | 20925 | 51 | 23 | 45 | 96 | — |

## 兼容范围之外

下面这些 **inventoried 但故意 `deferred`**：

- ST 已被社区放弃、长期不维护的实验性 API
- 跟 ST UI 库（jQuery/Bootstrap）特定版本耦合的 DOM 选择器
- ST 内部 bug 行为（按 `bug_compat=false` 标记）
- 仅在某个 commit 范围内存在的临时 API

具体清单按 inventory 实施时填。

## 第三方扩展兼容矩阵

第三方 ST 扩展不在本矩阵——它们不属于 ST 核心。第三方扩展的兼容性等级（直接跑 / 需要小改 / 不支持）在实现进入 H 轨道时另设独立文档。

## 怎么读这份矩阵

- **想知道 YdlTavern 是不是真的 1:1**：看每个域的分子分母比；分母是 ST 实际项数。
- **想知道某个具体扩展能不能跑**：看 F 轨道扩展覆盖度；具体扩展依赖的 API 列在它对应的 inventory 段。
- **想知道我的 preset 在 YdlTavern 跑出来跟 ST 一样不一样**：看 OpenAI preset schema、prompt manager 标识符、samplers 三项的 implemented 进度——这三项全 implemented 才意味着 prompt 字节级对齐。
- **想知道我的世界书会不会触发**：看 world info trigger types、entry schema、评估流水线步骤——这三项全 implemented 才意味着 WI 行为对齐。

## 更新规则

- 某条 inventory 项被 YdlTavern 实现后，把状态从 `inventoried` 升级到 `partial` 或 `implemented`，附对齐测试链接。
- 字节级对齐失败的项保持 `partial`，并在条目里附 `delta`（差异说明）。
- 主动 `deferred` 的项必须附 `reason`。
- 矩阵更新通过普通 PR，不需要专门流程。
