# Turn 模型

> [English](./TURN_MODEL.en.md) · [中文](./TURN_MODEL.md)

YdlTavern 内部不直接用 SillyTavern 的 `chat[]` flat 数组。我们用 Turn 模型作为内部数据结构，把 ST 的 `chat[]` 留作给老扩展看的兼容投影面。

这份文档定义内部 Turn 模型。投影规则见 [`COMPAT_PROJECTION.md`](./COMPAT_PROJECTION.md)。

## 为什么不直接抄 chat[]

ST 的 `chat[]` 一份数据要扛四种角色：渲染单位、存储记录、prompt 输入、扩展 API 形态。一动就全乱。

代价是它撑不住 agent 时代的事：

- 思考一个楼层、调用工具一个楼层、工具结果一个楼层——一次 agent run 把对话撑成一片碎屑。
- swipe 只能换最后一个楼层，没法换"这一轮里 agent 的整段尝试"。
- 多步 agent 没地方存中间状态，只能塞 `extra` 字段或硬 push 多条 chat[]。
- `chat[i].extra` 成了所有特殊数据的垃圾桶。

YdlTavern 把渲染/存储/prompt/兼容 API 这四件事拆开。内部跟 agent 时代对齐，外部跟 ST 老扩展兼容。

## 形状

```typescript
interface Chat {
  id: string;
  meta: ChatMeta;
  turns: Turn[];
}

interface Turn {
  id: string;                    // ulid
  index: number;                 // chat 内 0-based 位置
  role: 'user' | 'assistant' | 'system' | 'tool';
  speaker?: SpeakerRef;          // 群聊里指明哪个角色
  variants: TurnVariant[];       // swipe 在这一层
  active_variant: number;
  source: TurnSource;            // user_input | generation | imported | tool | system
  hidden?: boolean;              // 不进 prompt（ST 的 hide）
  memory_summary?: string;       // 这一 turn 的压缩摘要，可选
  created_at: number;
  edited_at?: number;
  deleted?: boolean;             // 软删
}

interface TurnVariant {
  id: string;
  generation_id?: string;        // 哪一次 generate 产生的
  model?: string;
  subs: SubMessage[];
  meta: VariantMeta;             // tokens / cost / latency / finish_reason
  created_at: number;
}

type SubMessage =
  | { kind: 'text'; text: string; segment_role?: 'main' | 'narration' | 'speech' }
  | { kind: 'thinking'; text: string; collapsed_by_default?: boolean; hide_from_prompt?: boolean }
  | { kind: 'tool_call'; tool: ToolRef; arguments: unknown; call_id: string }
  | { kind: 'tool_result'; call_id: string; result: unknown; status: 'ok' | 'error' | 'cancelled' }
  | { kind: 'skill_invoke'; skill: SkillRef; input: unknown }
  | { kind: 'agent_step'; step: AgentStepDescriptor }
  | { kind: 'image'; image_ref: AssetRef; prompt?: string; alt?: string }
  | { kind: 'audio'; audio_ref: AssetRef; transcript?: string }
  | { kind: 'attachment'; attachment_ref: AttachmentRef }
  | { kind: 'file_embed'; file_ref: AssetRef; mime: string }
  | { kind: 'note'; text: string };
```

## 关键决定

### Swipe 在 Turn 层

整个 Turn 是被 swipe 替换的单位，包括其中所有思考、工具调用、最终回复。一次 swipe 产生一个新的 `TurnVariant`。用户在 variants 间切换，等于切换"这一轮 agent 的整条尝试"。

### Sub 是有序、结构化、可分别折叠的

不靠 markdown 标记符号在一坨字符串里区分思考和回复。`thinking` / `tool_call` / `tool_result` / `text` 是平级的 sub kind，前端各自渲染、各自折叠。

### tool_call 与 tool_result 通过 call_id 配对

二者可以挨在一起（同步工具），也可以中间夹其他 sub（异步、流式、外部回调）。前端按 call_id 把它们关联展示。

### 思考是一等公民

ST 后来加 reasoning 字段是因为 chat[] 没地方放。Turn 模型直接给 `thinking` sub kind，跟 `text` 平级。默认折叠。

### Attachments / images / audio 是 sub，不是 extra

不塞到 `extra` 里。是 turn 内一等条目，用资产引用。

### Hidden 在 Turn 层

ST 的 `is_system` / hide 是"不进 prompt 但显示在 UI"。`Turn.hidden` 直接表达。需要 sub 级粒度时（"这条 thinking 不进 prompt"），sub 上加 `hide_from_prompt`。

## Edit / Delete

- **Edit text sub**：copy-on-write。复制原 variant 全部 sub，把目标 text sub 内容替换，作为新 variant 加入 `variants[]`，原 variant 保留。
- **Delete turn**：标 `deleted: true`，不真物理删。事件日志留痕。
- **Hide turn**：切 `hidden`，存储原样不动。

不直接改 `chat[i].mes` 这一点是有意的。能支持分支、回放、审计。

## Branching

Yggdrasil 自带 branch 机制。在 YdlTavern 这层：

- 用户可以从任意 Turn 开 fork
- 每个 branch 自己维护 turns
- branch 之间通过共同祖先 turn 链接
- 老扩展看到的 chat[] 是当前 branch 的扁平投影

ST 没有 branch。老扩展看不见。

## ID 与排序

- `Turn.id` / `TurnVariant.id` 用 ulid，时间排序友好。
- `Turn.index` 0-based，删除/隐藏不重排。
- `SubMessage` 没有独立 id，用 `(variant_id, position)` 定位。inline edit 走 variant fork。

## 存储

- 内容数据由 YdlTavern 拥有。具体载体在实现阶段定，倾向 IndexedDB 做前端缓存 + 文件系统/SQLite 持久化。
- 平台事件（generate / tool call / approve / fork / 出站请求）走 Yggdrasil 公开协议落到 Yggdrasil 事件日志。
- 资产（角色卡、世界书、图片）由 YdlTavern 拥有；可选择性 mirror 到 Yggdrasil 资产做分享。

## 与 prompt 构造的关系

prompt 构造从 Turn 模型读，按 `active_variant` 走，把每个 sub 按 ST 兼容规则展开成 OpenAI / Anthropic / textgen 期望的 messages。preset injection 顺序、world info 触发、author's note、character description——保持跟 ST 字节级对齐。规则在 [`COMPAT_PROJECTION.md`](./COMPAT_PROJECTION.md)。

## 与 chat[] 的关系

老扩展通过 `getContext().chat` 看到的是 Turn 模型的扁平投影。`mes` 从 active variant 的 text subs 拼出，thinking / tool_call / tool_result 落到 `extra` 字段。swipe API 操作 `active_variant`。`chat[i].mes = ...` 触发 variant fork。详细映射在 [`COMPAT_PROJECTION.md`](./COMPAT_PROJECTION.md)。

## 不变量

- 每个 Turn 至少一个 variant
- 每个 variant 至少一个非空 sub（除非整 Turn `hidden`）
- 每个 `tool_call` 终态有对应 `tool_result`（除非 cancelled / pending）
- variant 一旦持久化不可原地改（edit = new variant）
- `Turn.index` 单调递增
- `deleted: true` 的 turn 不进 prompt、不进 chat[] 投影

## 不在范围内

- ST 早被社区抛弃的 message 字段——按 inventory 的 deferred 标注处理
- 视频帧、3D 资产等超过 image / audio / file 的多模态形态——走扩展机制
- 同 Turn 多人实时协作——通过 branch 处理，不在 Turn 模型内做
