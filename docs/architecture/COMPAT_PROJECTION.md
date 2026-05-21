# SillyTavern 兼容投影

> [English](./COMPAT_PROJECTION.en.md) · [中文](./COMPAT_PROJECTION.md)

老 SillyTavern 扩展看到的世界是 `chat[]`、`eventSource`、`getContext()`、`event_types`、各种全局函数。它们不知道 YdlTavern 内部用的是 Turn 模型。这份文档定义把 Turn 模型投影成 ST 兼容外接面的规则。

字节级对齐是目标，不是承诺。下面的规则尽量复刻 ST 当前行为；最终覆盖范围由 [`../COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md) 透明展示。

## 三个投影面

1. `chat[]`——`getContext().chat` 是从当前 active turns 派生的扁平视图
2. `eventSource`——YdlTavern 内部事件按规则映射到 ST `event_types`
3. `getContext()`——整个 context 对象按规则从 YdlTavern 状态派生

## chat[] 投影

每个未隐藏、未删除的 Turn 投影成 1 个或多个 chat entry。

### 基础形状

```js
chat[i] = {
  is_user: turn.role === 'user',
  is_system: turn.hidden || turn.role === 'system',
  name: resolveSpeakerName(turn),
  send_date: formatSTDate(variant.created_at),
  mes: composeMainText(variant),
  swipe_id: turn.active_variant,
  swipes: turn.variants.map(composeMainText),
  swipes_info: turn.variants.map(composeSwipeInfo),
  extra: composeExtra(turn, variant),
  // ...
}
```

字段级别的清单见 [`../inventory/CORE_EVENTS_AND_COMMANDS.raw.md`](../inventory/CORE_EVENTS_AND_COMMANDS.raw.md) 的 CHAT_MESSAGE_SHAPE 段。

### `mes` 字段

`mes` 是 ST 期望的"这条消息的主文本"。从 active variant 合成：

| sub kind | 进入 `mes` | 备选投影 |
|---|---|---|
| `text` | 是，按顺序拼接，中间换行 | — |
| `thinking` | 否 | `extra.reasoning`（ST 后来加的字段） |
| `tool_call` | 否 | `extra.tool_invocations[]` |
| `tool_result` | 否 | `extra.tool_invocations[*].result` |
| `image` | 否 | `extra.image` / `extra.images[]` |
| `audio` | 否 | `extra.audio` |
| `attachment` / `file_embed` | 否 | `extra.file` / `extra.files[]` |
| `note` | 否 | `extra.notes[]` |

老扩展若通过 ST 风格 API 改 `chat[i].mes`，兼容层把它解析回当前 variant 的 main text subs 集合，做 variant fork 重写。

### `extra` 字段

ST 把所有特殊数据塞进 `extra`。这是兼容入口，必须保留。常见字段（机械扫出来的列表见 inventory）：

```text
extra.reasoning                 思考
extra.tool_invocations[]        工具调用
extra.api / extra.model         哪个 API / 模型
extra.token_count
extra.image / extra.images[]
extra.audio
extra.file / extra.files[]
extra.bias
extra.gen_id
extra.regex_evaluations
extra.translated
extra.tts_audio
extra.image_swipes[]
extra.is_internal_step          YdlTavern 私有：sub 投影成独立 entry 时的标记
... 还有 ST 内置扩展自己加的字段
```

未识别的 `extra.*` 字段一律原样存留——以 `extra` 为通信通道的扩展互不冲突。

### Swipe

```js
chat[i].swipe_id      // 当前 active_variant 索引
chat[i].swipes        // 每个 variant 的 main text
chat[i].swipes_info   // 每个 variant 的元数据
```

老扩展调用 swipe API → 兼容层切 `active_variant` → 重新投影。

### Multi-sub-as-multi-entry 模式

某些扩展（vectors、tts、translate）通过 `MESSAGE_*` 事件假设每条消息都是独立 chat entry。如果一个 Turn 有多段独立 thinking + tool_call + final response 需要被这些扩展独立观察，兼容层支持把它们投影成连续的 chat entries，标 `extra.is_internal_step`，前端不重复显示。

对老扩展：看起来像 push 了多条消息。
对 YdlTavern：还是同一个 Turn。

## eventSource 映射

YdlTavern 内部事件 → ST `event_types` 单向映射，一对一或一对多。完整 ST event 清单（约 90+ 个）见 inventory。下面是关键映射，剩下的随实现展开补：

| YdlTavern 内部事件 | ST `event_types` |
|---|---|
| `turn.user_input.submitted` | `MESSAGE_SENT` + `USER_MESSAGE_RENDERED` |
| `turn.generation.started` | `GENERATION_STARTED` |
| `turn.generation.streaming_token` | `STREAM_TOKEN_RECEIVED` |
| `turn.generation.completed` | `MESSAGE_RECEIVED` + `CHARACTER_MESSAGE_RENDERED` + `GENERATION_ENDED` |
| `turn.swipe.changed` | `MESSAGE_SWIPED` |
| `turn.swipe.deleted` | `MESSAGE_SWIPE_DELETED` |
| `turn.text_edited` | `MESSAGE_EDITED` + `MESSAGE_UPDATED` |
| `turn.deleted` | `MESSAGE_DELETED` |
| `turn.thinking.edited` | `MESSAGE_REASONING_EDITED` |
| `turn.thinking.deleted` | `MESSAGE_REASONING_DELETED` |
| `chat.changed` | `CHAT_CHANGED` |
| `chat.created` | `CHAT_CREATED` |
| `chat.deleted` | `CHAT_DELETED` |
| `chat.renamed` | `CHAT_RENAMED` |
| `worldinfo.activated` | `WORLD_INFO_ACTIVATED` |
| `worldinfo.scan_done` | `WORLDINFO_SCAN_DONE` |
| `tool_call.performed` | `TOOL_CALLS_PERFORMED` |
| `tool_call.rendered` | `TOOL_CALLS_RENDERED` |
| `prompt.combined.before` | `GENERATE_BEFORE_COMBINE_PROMPTS` |
| `prompt.combined.after` | `GENERATE_AFTER_COMBINE_PROMPTS` |
| `prompt.ready.chat_completion` | `CHAT_COMPLETION_PROMPT_READY` |

派发顺序保持 ST 习惯（vectors、translate、regex 等扩展依赖具体顺序）。

老扩展继续 `eventSource.on('xxx', handler)`，handler 收到的 payload 跟 ST 在等价时机派发的形状相同。新扩展可选择走 Yggdrasil 公开协议订阅事件流，拿完整结构化事件。

## getContext() 投影

老扩展期望 `getContext()` 返回的对象大致包含：

```text
chat, characters, groups, groupId, characterId, chatId
name1, name2, extensionSettings, saveSettingsDebounced
addOneMessage, saveChat, saveChatConditional, scrollOnMediaLoad
power_user, oai_settings, textgenerationwebui_settings, kai_settings, nai_settings
substituteParams, Generate, getRequestHeaders, getTokenCountAsync
... 以及一长串 helper
```

兼容层提供这个对象。每个字段从 YdlTavern 状态投影：

- `chat` —— Lazy Proxy，封装当前 branch 的 active turns 扁平视图
- `characters` —— YdlTavern 角色库的 ST V1/V2/V3 兼容形态
- `extensionSettings` —— 桥到 YdlTavern 的扩展设置存储
- 函数类（`Generate` / `addOneMessage` / `saveChat` / `substituteParams`）—— 兼容层重写实现，内部走 YdlTavern engine + Yggdrasil 协议

完整 `getContext()` 字段清单按机械扫描结果维护——M2 阶段补一份独立的 `inventory/GLOBAL_API.md`。

## chat[] 写入路径

老扩展会做：

| 操作 | 兼容层处理 |
|---|---|
| `chat.push(message)` | 拦截，转成新增 Turn |
| `chat[i].mes = '...'` | Proxy setter，转成 variant fork |
| `chat.pop()` | 删除最后一个 turn（软删） |
| `chat.splice(i, 1)` | 删除 turn i（软删） |
| `chat.length` | 投影后的扁平长度 |
| 直接遍历 chat[] | 走 lazy proxy，不预先全量物化 |

JavaScript Proxy 是关键。`chat` 不是真数组，是 Proxy。读时 lazy 投影、写时拦截路由。

## prompt 构造对齐

ST 老扩展通过 `eventSource` 听 `GENERATE_BEFORE_COMBINE_PROMPTS` / `GENERATE_AFTER_COMBINE_PROMPTS` / `CHAT_COMPLETION_PROMPT_READY` 等事件，可能修改即将发出的 prompt。

YdlTavern 在 generate 流程里也派发这些事件，提供跟 ST 一致的可修改 prompt payload。改完后再走真实模型调用。

prompt 构造的内部顺序（preset prompt manager + char description + persona + scenario + dialogue examples + chat history + author's note + world info + post-history-instructions）保持跟 ST 字节级对齐。具体 identifier 与 injection point 见 inventory 里的 `PROMPT_MANAGER_IDENTIFIERS`。这块由 C 引擎核心轨道负责。

## 不投影的 ST 行为

下面这些 ST 内部细节不映射，由 YdlTavern 用现代实现替代：

- `chat_metadata`：直接存到 chat 级 meta，老扩展通过 `getContext()` 看到的是 ST 风格 proxy
- ST 的 jQuery 事件 / DOM 选择器：前端是新代码，DOM 结构有兼容声明但不保证逐选择器一致
- ST 的全局 `settings` 对象内部分组：YdlTavern 用自己的设置 schema，给老扩展看到 ST 风格 proxy 视图

直接依赖 ST DOM 结构（jQuery 选择器查 specific div）的扩展列入"需适配"，在 `COMPATIBILITY_MATRIX.md` 单独标。

## 不在范围内

- ST 当前未文档化的内部时序行为复刻——只复刻官方稳定的事件 / API 顺序
- ST 历史 bug 的复刻——按 inventory 标 `bug_compat=false`
- ST 那些只在某个特定 commit 范围内存在的临时 API
