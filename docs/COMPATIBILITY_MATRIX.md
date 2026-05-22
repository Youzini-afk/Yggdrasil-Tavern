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

当前阶段：深度移植完成。ST 源码仍是 ground truth；B/C/D/E/F/G/H/I 均已有可运行代码路径，PromptManager / World Info / STScript / 宏引擎 / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader 已有一对一算法移植，但除明确说明外还不是字节级对齐。Round 2 R1 golden diff 已覆盖 20/20 scenarios：6 perfect、0 cosmetic、6 structural、8 unverifiable、0 error；只有 tokenizer self-baseline 达到全量 perfect。

## 总览

| 域 | 分母 | 实现 | 状态 | 来源 inventory | 主要轨道 |
|---|---:|---:|---|---|---|
| event_types | 104 | 常量 + 104 ST canonical types | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| 内置 slash commands | 153 | 30 commands implemented; STScript runtime: scope/closure/pipe/abort/break + parser flags + command registry | 30/153 partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| 宏 / macros | 80+ | registry-based engine with full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState；golden harness 当前 0/4 perfect、4/4 unverifiable（ST fixture 使用 fallback env substitution） | partial — `golden-harness/diff/macro-*.json` | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 25 source request shapes ported with provider-specific overrides；golden harness 当前 0/4 perfect、4/4 structural（ST fixture 默认设置/模型与 scenario 设置存在结构差异） | partial — `golden-harness/diff/chat-*.json` | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 15 source request shapes ported with backend-specific samplers | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers（含 alias） | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant + 4 selectiveLogic modes + decorators + recursion gates + sticky/cooldown/delay | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema 字段 | 50+ | full schema fields including character_filter, triggers, group, sticky/cooldown/delay, scanDepth, decorators, etc. | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info 评估流水线步骤 | 39 | scan source assembly + decorator → activation precedence → selectiveLogic → recursion + delay/sticky/cooldown + budget + 8-bucket routing with AN patch + atDepth (depth, role) merge；golden harness 当前 0/4 perfect、4/4 unverifiable（ST WI shim 返回空激活） | partial — `golden-harness/diff/world-info-*.json` | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| 角色卡 V1 字段 | 16 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| 角色卡 V2 字段 | 33 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| 角色卡 V3 字段 | 14 | fixture importer (existing) | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema 字段 | 75 | PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager 标识符 | 13 typed | 12 default prompts + RELATIVE/ABSOLUTE injection_position + injection_depth/order + injection_trigger + forbid_overrides + main/jailbreak override with {{original}} | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| tokenizers: OPENAI/GPT2/LLAMA/LLAMA3/CLAUDE | 5 families | real local adapters; Claude is local text approximation；golden harness self-baseline 6/6 perfect | implemented (golden harness verified self-baseline) | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| tokenizers: HF families | 9 families | `@huggingface/tokenizers` path for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A when caller supplies source | partial-source-required | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| 内置扩展 | 14 | 5/14 partial: regex real; memory/vectors/quick-reply/token-counter executable logic; caption/tts/translate/expressions/attachments/connection-manager/stable-diffusion mostly approximation/plan | 5/14 partial | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| 扩展 JS 执行 | ST extension JS | QuickJS sandbox v0 + host bridge + permissions/audit; no network/fetch/XHR; DOM/style/i18n incomplete | partial-sandboxed | `inventory/BUILTIN_EXTENSIONS.raw.md` | H |
| 真实模型调用 | provider HTTPS | `model.live_call` / `.stream` bridge to Yggdrasil `kernel.outbound.execute` / `.stream`; requires live profile + env secrets | partial-opt-in | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| Product UI | qualitative | product shell with virtualized chat list, themes, settings tabs, extension drawer, quick reply, mobile responsive | partial-shell-with-virtualization-and-themes | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |
| Persona schema 字段 | 20 | personaDescription block subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Group chat schema 字段 | 25 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| 群聊轮换策略 | 4 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Quick reply schema 字段 | 已记录 | importer + extension wrapper subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | F |
| 主题 schema | 已记录 | importer + product surface settings slot subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |

数字大致计数。准确数字以 inventory 和 `@ydltavern/types` 常量为准。`stubbed` 表示 API 表面存在但行为未完整对齐；`partial` 表示已有可测试代码路径但还没宣称字节级兼容。

## 已落地代码路径

| 包 | 轨道 | 覆盖 | 状态 |
|---|---|---|---|
| `@ydltavern/types` | 全部 | Turn 模型、ST event/slash/macro/connector/sampler/world-info/prompt-manager 常量 | stubbed 基础 |
| `@ydltavern/importers` | B | 角色卡 JSON/PNG、世界书、JSONL chat importer + ST-like fixtures | partial |
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy、Turn store、完整 `getContext()` shape（`context-st.ts`）、`eventSource`、`Generate`、宏引擎（`macros-st.ts`：完整 ST registry + 递归展开 + PickState）、STScript 运行时（`stscript-st.ts`：scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution）、slash registry | partial |
| `@ydltavern/engine-core` | C + I | chat/text request builders、stream chunk 状态机、token budget、PromptManager、World Info、instruct mode、tokenizer registry + `countTokens(text, options)` real adapters（OpenAI/GPT2/Llama/Llama3/Claude/HF-source）+ guesstimate、golden harness fixtures、stream frames、model boundary plan | partial |
| `@ydltavern/surface` | G | Tavern-like product UI shell + `react-virtuoso` 虚拟聊天列表 + dark/light/parchment themes + Connection/Sampler/Persona/Theme 设置 tabs + loader-st ExtensionsDrawer + QuickReplyBar + mobile responsive + diagnostic inspectors | partial-shell-with-virtualization-and-themes |
| `@ydltavern/extensions` | F + H | regex real engine、memory/vectors/quick-reply/token-counter executable logic、provider/IO-heavy extensions as plan/approximation、extension loader（manifest parse + validation + activation plan）、QuickJS sandbox runtime/bridge/loader/permissions/audit | partial-sandboxed |
| `@ydltavern/engine` | C | deep-port capabilities plus `model.live_call` and `model.live_call.stream` through Yggdrasil outbound execute/stream; manifest declares provider hosts and `secret_refs` | partial-opt-in |

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
