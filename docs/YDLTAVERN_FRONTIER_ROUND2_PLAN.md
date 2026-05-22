# YdlTavern Frontier Round 2 Plan

> 临时计划文件，每阶段完成后 push；全部完成后由 R8 阶段删除并并入长期文档。

## 目的

把 Round 1（P1-P6）落地后还停在 partial 的几条线推到 implemented，并打通两个真实场景：

1. **ST 字节级对齐验证** — 上轮 fixture 已就绪，缺 YdlTavern 端的对照执行 + 矩阵推进
2. **Realtime API 模型调用** — 依赖 Yggdrasil Z（WebSocket outbound）落地

同步把对齐度从 ~70-75% 推到 ~80%+。

## 不做的事

- 不做语音 UI（另立项）
- 不真实加载第三方 ST 扩展 zip（loader plan 仍 plan-only，沙箱执行已就绪）
- 不再扩 tokenizer family（HF runtime fetcher 是补足而非新增）
- 不替换已实装的 partial slash 命令（只补不改）
- 不真实跑 live 模型调用（本轮限于 mock + 形状验证；真实 smoke 由用户 opt-in）

## 并行策略

| 范围 | 依赖 | 何时启动 |
|------|------|----------|
| R1 ST golden diff | 无 | 立即可启动 |
| R2-R5 slash batches C/D/E/F | 无 | 立即可启动 |
| R6 HF tokenizer fetcher | 无 | 立即可启动 |
| R7 Realtime via WS | Yggdrasil Z 完成 | 等 Yggdrasil Z6+Z7 完成 |
| R8 文档收敛 + 删除临时 plan | R1-R7 全部完成 | 最后 |

R1, R2-5, R6 三条线之间互不冲突，可并行委派。

## 阶段

### R0: 计划 push（本文件 + 英文版）

### R1: 真实 ST golden diff 执行

当前 `golden-harness/compare.mjs` 对 14 个 base scenarios 全部输出 `NO_YDLTAVERN_PORT`。把它真实跑起来。

#### 实现

每个 scenario 用 YdlTavern dep-port 模块跑相同输入，与 ST fixture 字节比对：

| 类别 | YdlTavern dep-port 调用 |
|------|-------------------------|
| `chat/*.json` | `engine-core.buildChatRequest` |
| `world-info/*.json` | `engine-core.evaluateWorldInfo` |
| `macro/*.json` | `engine-core.substituteMacros` 或 `st-compat.substituteParams`（看 scenario） |
| `instruct/*.json` | `engine-core.formatInstructModeChat` |
| `tokenizer/*.json` | 已经在 P2.5 跑通，此处仅追加 ST 真实 token count 对照（如果 ST 端可提取） |

差异写入 `golden-harness/diff/<category>-<name>.json`，结构：

```json
{
  "scenario": "...",
  "matches": false,
  "delta": [
    { "path": "messages[1].content", "expected": "...", "actual": "..." }
  ],
  "classification": "perfect | cosmetic | structural | unverifiable",
  "notes": "ST shim fallback used for macros, not full evaluator..."
}
```

#### 矩阵更新

`docs/COMPATIBILITY_MATRIX.md` / `.en.md`：

- `matches: true` 的项 partial → **implemented**
- `cosmetic` 差异（空白/字段顺序）保持 partial 但标 near-perfect
- `structural` 差异保持 partial，diff 报告记录差异点
- `unverifiable` 项保持 partial 并附原因

预期至少 5 项推到 implemented。

#### 验证

- `cd golden-harness && node compare.mjs --all`
- diff 报告全部生成
- 矩阵更新与实际 diff 一致

### R2: Slash batch C — 变量与控制扩展（~12 命令）

参考 `/workspace/Yggdrasil/SillyTavern/public/scripts/slash-commands.js` 与 `slash-commands/`：

```text
/addvar          为变量添加（数值则求和，字符串则拼接）
/flushvar        清空局部变量
/flushglobalvar  清空全局变量
/listvar         列出所有变量
/globalsetvar    设置全局变量
/globalgetvar    读取全局变量
/globaladdvar    添加到全局变量
/closure-serialize    序列化闭包到字符串
/closure-deserialize  反序列化字符串到闭包
/pass / /noop    pipe 透传
/yes / /no       条件辅助常量
```

新文件：`packages/ydltavern-st-compat/src/slash-commands-batch-c.ts`
测试：`packages/ydltavern-st-compat/test/slash-commands-batch-c.test.ts`

每命令 3-4 测试，含 ST source 行号引用。

### R3: Slash batch D — 角色 / 群聊（~10 命令）

```text
/char-find name=X         查找角色（按名/标签）
/char-update name=X ...   更新已加载角色字段
/char-create              创建新角色（plan-only：不写文件，仅返回 descriptor）
/char-delete              声明 unsupported（不破坏数据）
/member-add               群成员加入
/member-remove            群成员移出
/member-disable           暂时禁用某成员
/member-enable
/group-create             plan-only
/trigger / /go            触发群轮换（如已存在）
```

策略：危险操作（删除）显式 unsupported；写入操作 plan-only 返回 descriptor，由 host 决定是否执行。

新文件：`slash-commands-batch-d.ts` + 测试

### R4: Slash batch E — 消息可见性与编辑（~10 命令）

```text
/message-role index=N role=user|assistant|system
/delfirst                    删除首条
/dellast                     删除末条
/delname name=X              删除指定 name 的消息
/cut start=A end=B           删除区间
/hide-all                    全部隐藏
/unhide-all                  全部显示
/buttons                     注入快捷回复按钮 UI hint
/reply-buttons               同上但回复区
/messageedit (alias /setmessage from R5 if dup, skip)
```

新文件：`slash-commands-batch-e.ts` + 测试

### R5: Slash batch F — World Info 注入（~10 命令）

```text
/inject id=X position=Y depth=Z scan=A role=B content=...
/listinjects                 列出所有注入项
/flushinject id=X            清除指定注入
/flushinjects                清除全部
/getpromptentry id=X
/setpromptentry id=X ...
/worldenable name=X          启用世界书
/worlddisable name=X
/world-add (asset only, plan-only)
```

新文件：`slash-commands-batch-f.ts` + 测试

四个 batch 完成后 ydltavern-st-compat 测试数从 213 增到 ~290。

### R6: HuggingFace tokenizer runtime fetcher

当前 `HuggingFaceTokenizerAdapter` 要求 caller 提供 tokenizerJson 对象，硬。

#### 新模块 `packages/ydltavern-engine-core/src/tokenizers-runtime/huggingface-fetcher.ts`

```typescript
export interface FetchHFTokenizerOptions {
  source: 'hf-hub' | 'url';
  modelId?: string;        // 'mistralai/Mistral-7B-Instruct-v0.3' for hf-hub
  revision?: string;        // 'main' or commit sha (default 'main')
  url?: string;             // for source=url
  expectedSha256?: string;  // optional integrity pin
  // 网络通过调用方提供的 KernelClient（Yggdrasil host）
  kernelClient: { sendKernelRequest<T>(method: string, params: unknown): Promise<T> };
  capabilityId: string;
  // 内存 LRU cache key（默认 modelId+revision）
  cacheKey?: string;
}

export async function fetchHuggingFaceTokenizer(
  options: FetchHFTokenizerOptions,
): Promise<HuggingFaceTokenizerSource>;
```

#### 行为

- `source='hf-hub'`：构造 `https://huggingface.co/{modelId}/resolve/{revision}/tokenizer.json`，调用 `kernel.outbound.execute`
- `source='url'`：直接用提供 URL（仍走 host）
- 拿到 body 后 SHA256 校验（如有 `expectedSha256`）
- JSON.parse → tokenizerJson
- 内存 LRU cache（容量 16 项）按 cacheKey 缓存
- 错误 fail-closed：网络失败/校验失败/解析失败 → 抛出明确错误

#### 边界

- 不写文件系统（YdlTavern 永远不写盘）
- 网络必须走 KernelClient（无直连）
- manifest 必须声明 `huggingface.co` host + `secret_ref:env:HF_TOKEN`（如果是私有 repo）

#### 测试

- mock kernelClient，返回固定 tokenizer.json
- 校验 cache 命中
- 校验 SHA256 不匹配时抛错
- 校验 source=url 路径
- 校验 真实 mistral tokenizer.json 形状（用 fixture 文件）

新文件：`huggingface-fetcher.ts` + `huggingface-fetcher.test.mjs`

### R7: Realtime model capability（依赖 Yggdrasil Z 完成）

#### 新增 capability `model.live_realtime`

```typescript
export interface RealtimeOpenInput {
  source: 'openai-realtime' | 'gemini-live';
  model: string;
  secret_ref: string;
  // session config
  voice?: string;
  instructions?: string;
  modalities?: ('audio' | 'text')[];
  input_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
  output_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
  // limits
  max_response_tokens?: number;
}

export interface RealtimeSession {
  readonly sessionId: string;
  send(event: RealtimeClientEvent): Promise<void>;
  close(): Promise<void>;
}

export type RealtimeClientEvent =
  | { type: 'audio_append'; data: Uint8Array }
  | { type: 'audio_commit' }
  | { type: 'text_send'; content: string }
  | { type: 'function_call_response'; call_id: string; output: string }
  | { type: 'session_update'; partial: Partial<RealtimeOpenInput> };

export type RealtimeServerEvent =
  | { type: 'session_created'; session: unknown }
  | { type: 'audio_delta'; data: Uint8Array }
  | { type: 'audio_done' }
  | { type: 'text_delta'; delta: string }
  | { type: 'text_done'; text: string }
  | { type: 'function_call'; call_id: string; name: string; arguments: unknown }
  | { type: 'response_done'; usage?: unknown }
  | { type: 'error'; code: string; message: string };
```

#### 实现

```text
src/capabilities/model-live-realtime.ts:
  按 source 选 destination_host + path:
    openai-realtime: api.openai.com / /v1/realtime?model=<model>
    gemini-live:     generativelanguage.googleapis.com / /v1beta/.../streamGenerateContent
  
  按 source 构造握手帧（OpenAI Realtime: session.update）
  
  调用 kernelClient.openWebSocket(...)
    secret_headers: Authorization Bearer (OpenAI) / x-goog-api-key (Gemini)
    static_headers: content-type, openai-beta=realtime=v1 (OpenAI)
  
  onFrame：
    text frame → 解析 JSON 事件，按类型路由
    binary frame → 当作 audio_delta 路由
  
  send：
    audio_append → JSON 包装 { type: "input_audio_buffer.append", audio: base64(data) }
    text_send → { type: "conversation.item.create", item: { type: "message", ... } }
    其他事件按 OpenAI Realtime / Gemini 协议构造
```

#### Manifest 更新

```yaml
permissions:
  network:
    declarations:
      # existing
      - host: api.openai.com
        methods: [POST, WEBSOCKET]
      - host: generativelanguage.googleapis.com
        methods: [POST, WEBSOCKET]
  secret_refs:
    # existing
    - secret_ref:env:OPENAI_API_KEY
    - secret_ref:env:GEMINI_API_KEY
```

#### 测试

- mock kernelClient（提供 fake `openWebSocket`）
- 模拟收到 OpenAI Realtime `session.created` 事件 → onFrame 路由到 RealtimeServerEvent.session_created
- 模拟 audio_delta 帧序列 → 累积到回调
- 模拟 text_delta 序列 → 流式聚合
- send audio_append → 验证发出帧形状
- send text_send → 验证发出帧形状
- close → handle.close 被调用
- 不引入真实网络

新文件：`model-live-realtime.ts` + 测试

#### 真实 smoke（opt-in，默认 skip）

`live-realtime-smoke.test.mjs`：
- gate by `YGG_LIVE_REALTIME_TESTS=1` + `YGG_LIVE_KERNEL_CLIENT_MODULE` + `OPENAI_API_KEY`
- 跑一次 Realtime 短对话："say 'pong' once and end"
- 断言收到 audio_done 或 text_done

### R8: 文档收敛 + 删除临时 plan

- 删除 `docs/YDLTAVERN_FRONTIER_ROUND2_PLAN.md` / `.en.md`
- 更新 `README.md` / `.en.md`：
  - 命令数 ~30 → ~80
  - HF tokenizer 路径变化（runtime fetch）
  - Realtime capability 上线
- 更新 `docs/ARCHITECTURE.md` / `.en.md`：
  - Realtime 通过 Yggdrasil ws outbound 的链路图
- 更新 `docs/COMPATIBILITY_MATRIX.md` / `.en.md`：
  - slash 命令分类：~80
  - 真实模型调用：增加 ws/realtime 行
  - golden diff R1 推进的项标记 implemented
- 新增 `docs/guides/REALTIME_MODELS.md` / `.en.md`
- 更新 `docs/guides/LIVE_MODEL_CALLS.md` / `.en.md`：在三种模式（unary / SSE / WS）章节加 ws 路径
- 更新 `packages/ydltavern-engine/README.md` / `.en.md`：补 model.live_realtime
- 更新 `packages/ydltavern-engine-core/README.md` / `.en.md`：补 HF fetcher
- 更新 `golden-harness/README.md`：compare.mjs 真实差异工作流

## 完成判据

- 各包 typecheck/build/test 通过
- ST golden diff 跑通；至少 5 项 partial → implemented
- slash 命令总数 ~80
- HF tokenizer fetcher mock 测试通过；真实 fetch 走 host
- model.live_realtime mock 测试通过（依赖 R7 前置 Yggdrasil Z）
- 真实 smoke 仅 opt-in
- 删除临时 plan 文件，长期文档同步

## 与 Yggdrasil Z 的同步点

| YdlTavern 阶段 | 等待 Yggdrasil 阶段 |
|---------------|---------------------|
| R1-R6 | 无 |
| R7 实现 | Z2 + Z5 完成（live executor + SDK helper 至少 fake 可用） |
| R7 真实 smoke | Z 全部完成 + Yggdrasil 测试通过 |

R7 之前可以先用 mock kernelClient（实现 openWebSocket 的 fake 版本）写好测试与代码骨架，等 Yggdrasil Z 落地后切到真实 SDK。
