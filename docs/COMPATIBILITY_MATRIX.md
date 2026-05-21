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

当前阶段：prompt-critical + slash core 完成。ST 源码仍是 ground truth；B/C/D/E/G/I 已有可运行纵切片，但除明确说明外还不是字节级对齐。

## 总览

| 域 | 分母 | 实现 | 状态 | 来源 inventory | 主要轨道 |
|---|---:|---:|---|---|---|
| event_types | 104 | 常量 + 核心事件派发 | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | D |
| 内置 slash commands | 153 | 7 core commands | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| 宏 / macros | 80+ | core/env/time subset + trace | partial | `inventory/CORE_EVENTS_AND_COMMANDS.raw.md` | E |
| chat completion sources | 26 | 1 request builder | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| text completion sources | 17 | 0 | inventoried | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| samplers（含 alias） | 151 | 151 normalized/passthrough | partial | `inventory/CONNECTORS_AND_SAMPLERS.raw.md` | C |
| world info trigger types | 32 | keyword/regex/constant subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info entry schema 字段 | 50+ | core fields preserved/evaluated | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| world info 评估流水线步骤 | 39 | scan/order/position/recursive/budget subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I + C |
| 角色卡 V1 字段 | 16 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| 角色卡 V2 字段 | 33 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| 角色卡 V3 字段 | 14 | fixture importer | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B |
| OpenAI preset schema 字段 | 75 | fixture request shape | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | B + C |
| prompt manager 标识符 | 13 typed | prompt-critical blocks + v0 builder | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | C |
| 内置扩展 | 14 | 0 | inventoried | `inventory/BUILTIN_EXTENSIONS.raw.md` | F |
| Persona schema 字段 | 20 | personaDescription block subset | partial | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Group chat schema 字段 | 25 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| 群聊轮换策略 | 4 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | I |
| Quick reply schema 字段 | 已记录 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | F |
| 主题 schema | 已记录 | 0 | inventoried | `inventory/WORLD_INFO_AND_ASSETS.raw.md` | G |

数字大致计数。准确数字以 inventory 和 `@ydltavern/types` 常量为准。`stubbed` 表示 API 表面存在但行为未完整对齐；`partial` 表示已有可测试代码路径但还没宣称字节级兼容。

## 已落地代码路径

| 包 | 轨道 | 覆盖 | 状态 |
|---|---|---|---|
| `@ydltavern/types` | 全部 | Turn 模型、ST event/slash/macro/connector/sampler/world-info/prompt-manager 常量 | stubbed 基础 |
| `@ydltavern/importers` | B | 角色卡 JSON/PNG、世界书、JSONL chat importer + ST-like fixtures | partial |
| `@ydltavern/st-compat` | D + E | live `chat[]` Proxy、Turn store、`getContext()`、`eventSource`、`Generate`、扩展宏、slash command core | partial |
| `@ydltavern/engine-core` | C + I | sampler/request builder、World Info evaluator、prompt-critical blocks、macro trace | partial |
| `@ydltavern/surface` | G | TavernPlaySurface contract slice：send/edit/fake generate/event log/prompt-critical/slash diagnostics；Settings/Extensions slots | partial |

## 内置扩展覆盖度（F 轨道）

| extension | LoC | listens | emits | slash | API | 实现状态 |
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
