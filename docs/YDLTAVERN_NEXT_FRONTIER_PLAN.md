# YdlTavern + Yggdrasil 协同进化深度推进计划

> [English](./YDLTAVERN_NEXT_FRONTIER_PLAN.en.md) · [中文](./YDLTAVERN_NEXT_FRONTIER_PLAN.md)
>
> 临时文档。每完成一阶段更新；全部完成后整体删除并合并到长期文档。

## 立场

YdlTavern 现有 ST 算法移植完成度约 55%。再扩算法面只能再加几个百分点，封顶 65-70%。剩下的 30-35% 是硬骨头：真实尺子（golden harness）、真实 tokenizer、真实模型调用、真实扩展 JS 沙箱、完整产品 UI。

这一轮把 YdlTavern 与 Yggdrasil 当作一对协同进化的项目处理：YdlTavern 是 Yggdrasil 的第一个真实使用者，YdlTavern 的需求会暴露 Yggdrasil 的真实缺口；Yggdrasil 的扩展会反过来支撑 YdlTavern 跨过对齐瓶颈。

## 设计决策（已确认）

```text
Golden harness 位置:   YdlTavern 仓库内独立目录 /golden-harness/
                       commit fixtures + harness code
                       不 commit ST 源码（License: AGPL-3.0）
                       ST 作为 sibling /workspace/Yggdrasil/SillyTavern 只读引用

Tokenizer 加载策略:    lazy per-family
                       不一次性 bundle
                       Web Worker 隔离（适用浏览器场景）

Live model calls:      等 Yggdrasil 改造完，不抢跑、不直连
                       YdlTavern 严格走 kernel.outbound.execute / stream
                       通过 secret_ref 走 host 端 secret resolver
                       流式作为 kernel 能力之一（kernel.outbound.stream）

第三方扩展沙箱:        QuickJS wasm
                       跨 Node + 浏览器
                       消息端口桥接 ST API 表面
                       不依赖 iframe / VM2 / native bindings

技术取向:              前沿稳定栈
                       优选当前 maintained + AGPL 兼容包
                       不为兼容旧浏览器牺牲架构清洁
```

## 阶段总览

| 阶段 | 仓库 | 内容 | 依赖 |
|---|---|---|---|
| P0 | YdlTavern | 计划提交 | - |
| P1 | YdlTavern | Golden Harness v0 | - |
| P3.1 | Yggdrasil | HostProfile outbound.execute schema | - |
| P3.2 | Yggdrasil | kernel.outbound.stream 协议方法 + LiveHttpStreamingExecutor | P3.1 |
| P3.3 | Yggdrasil | manifest permissions.secret_refs 声明 | - |
| P3.4 | Yggdrasil | TypeScript subprocess SDK outbound 助手 | P3.1, P3.2 |
| P3.5 | YdlTavern | engine model.live_call capability | P3.4 |
| P2.1 | YdlTavern | gpt-tokenizer 接入 (OpenAI/GPT2 family) | - |
| P2.2 | YdlTavern | llama-tokenizer-js 系列 (Llama 1/2/3) | - |
| P2.3 | YdlTavern | @anthropic-ai/tokenizer (Claude 本地近似) | - |
| P2.4 | YdlTavern | @huggingface/tokenizers 通用 (HF 家族) | - |
| P2.5 | YdlTavern | tokenizer registry runtime 调度 + golden 验证 | P1, P2.1-2.4 |
| P4 | YdlTavern | QuickJS wasm 扩展沙箱 | - |
| P5 | YdlTavern | Slash 命令批量补全 | - |
| P6 | YdlTavern | 完整 Tavern 产品 UI | P2 |
| P7 | Yggdrasil | Web/Desktop/App shell + 发布 pipeline | P3, P4, P6 |
| N14 | Both | 删除临时计划 + 长期文档收敛 | 全部 |

每阶段独立验证 + commit + push。

## P0: 计划提交（当前）

本文件 + 英文版提交并 push。

## P1: Golden Harness v0

**位置**: `/workspace/Yggdrasil/YdlTavern/golden-harness/`

**目的**: 建立"真实尺子"。能拿真实 ST source 同输入跑出真实 fixture，YdlTavern dep-port 模块 diff 之，把 delta 写进矩阵。

### 目录结构

```text
golden-harness/
├── package.json              jsdom + node:test + 子模块依赖
├── README.md                 用法 + ST commit pin
├── shims/
│   ├── dom.mjs               jsdom + window/document/localStorage
│   ├── jquery.mjs            最小 $ stub（only methods ST touches）
│   ├── toastr.mjs            no-op
│   ├── popup.mjs             reject all
│   ├── domPurify.mjs         passthrough
│   ├── fetch.mjs             拦截器，捕获 body 转 fixtures
│   ├── time.mjs              freeze Date/moment
│   ├── rng.mjs               seedrandom 替换 Math.random
│   ├── uuid.mjs              确定性 uuid
│   └── globals.mjs           install all globals before importing ST
├── runner/
│   ├── run.mjs               主入口
│   ├── load-st.mjs           动态 import ST modules（path 通过 env）
│   ├── extract-macro.mjs     evaluateMacros 路径
│   ├── extract-wi.mjs        getWorldInfoPrompt 路径
│   ├── extract-prompt.mjs    sendOpenAIRequest 路径（fetch 拦截）
│   └── extract-instruct.mjs  formatInstructModeChat 路径
├── scenarios/
│   ├── chat/
│   │   ├── openai-basic.json
│   │   ├── openai-tools.json
│   │   ├── openai-multimodal.json
│   │   ├── claude-prefill.json
│   │   ├── deepseek-reasoning.json
│   │   └── openrouter-fallback.json
│   ├── world-info/
│   │   ├── keyword-basic.json
│   │   ├── secondary-and-any.json
│   │   ├── recursion-chain.json
│   │   ├── probability-seeded.json
│   │   ├── character-filter.json
│   │   └── sticky-cooldown.json
│   ├── macro/
│   │   ├── env-basic.json
│   │   ├── time-frozen.json
│   │   ├── random-seeded.json
│   │   ├── nested-recursive.json
│   │   └── legacy-marker.json
│   └── instruct/
│       ├── chatml.json
│       ├── llama3.json
│       └── alpaca.json
├── fixtures/
│   └── (per scenario: expected ST output JSON)
├── diff/
│   └── (per run: YdlTavern output vs fixture diff)
└── compare.mjs                 跑 YdlTavern dep-port 同输入 + diff
```

### 关键确定性 fixes

```text
Date/time:    Date.now → 固定 epoch (2026-05-22T12:00:00Z)
              moment.now → 同
RNG:          Math.random → seedrandom('ydltavern-fixture-v1')
              seedrandom 第三方包同一种子
              droll 替换为 deterministic dice
UUID:         uuidv4 → 固定序列 ['00000000-0000-0000-0000-000000000001', ...]
Network:      fetch → throw（除非测试拦截路径）
              所有外部资源加载 → reject
DOM:          jsdom 提供，jQuery 最小 stub
Settings:     oai_settings/power_user/textgenerationwebui_settings 全 pin
Persona:      固定 user_avatar/character_id/group_id
```

### 验证

```text
1. node golden-harness/runner/run.mjs --scenario scenarios/chat/openai-basic.json
   → 跑两次得到 byte-identical fixture
2. node golden-harness/compare.mjs --scenario scenarios/chat/openai-basic.json
   → YdlTavern dep-port 同输入跑，diff 报告写到 diff/
3. 矩阵: COMPATIBILITY_MATRIX 增加 "golden delta" 列
4. 不 commit ST 源码；ST 通过 env YDLTAVERN_ST_PATH 解析
```

### 边界

```text
不做完整 ST runtime 复现 - 只覆盖目标路径
不真出网 - fetch 一律拦截
不依赖 ST 自身的 tests/ 目录代码 - 它们 inline literal 不是 file fixtures
不试图 100% 覆盖 - v0 锁 18 个 scenario
ST 升级时 fixture 要重生成（README 说明流程）
```

## P3.1: Yggdrasil HostProfile outbound.execute schema

**位置**: `/workspace/Yggdrasil/Yggdrasil/`

**目的**: 让 forge-alpha.yaml 能配置 live HTTP outbound executor，今天只配 git，缺 execute。

### 改动

```text
crates/ygg-cli/src/cli.rs (HostProfile)
  新增字段:
    outbound.execute:
      enabled: bool (default false)
      executor: 'deny_all' | 'fake' | 'live' (default deny_all)
      allowed_hosts: string[] (allowlist, exact + *.wildcard)
      https_only: bool (default true)
      timeout_ms: u64 (default 30000)
      allow_redirects: bool (default false)
      allow_insecure_loopback_for_tests: bool (default false)

crates/ygg-cli/src/commands/host.rs
  新增 fn build_outbound_execute_executor(config) -> Box<dyn OutboundExecutor>
  根据 executor 字段选 DenyAllOutboundExecutor / FakeOutboundExecutor / LiveHttpOutboundExecutor
  传入 Runtime::with_outbound_executor

crates/ygg-runtime/src/runtime/outbound.rs
  LiveHttpOutboundExecutor 已有 - 仅做 host 配置注入

profiles/
  新增 forge-with-live-models.example.yaml
    包含 outbound.execute live + secret_refs allowlist 例子

docs/
  guides/MODEL_PROVIDER_INTEGRATION.md/.en.md 增加 host profile 配置段
  protocol/PROTOCOL_V0.md/.en.md 增加 outbound 章节
```

### 验证

```text
cargo check -p ygg-cli --features postgres
cargo test -p ygg-cli
ygg conformance (新增 outbound_execute_profile_*)
forge-with-live-models.example.yaml 通过 schema 验证
默认 forge-alpha.yaml 仍然不配 execute（保持 deny_all 默认）
```

## P3.2: Yggdrasil kernel.outbound.stream 协议方法

**位置**: `/workspace/Yggdrasil/Yggdrasil/`

**目的**: 真实模型调用必然有 SSE/chunked 流式。`kernel.outbound.execute` 是 unary，需要新增流式协议方法。

### 设计

```text
新增公开协议方法:
  kernel.outbound.stream
    params: 同 kernel.outbound.execute, 加 stream_options
    return: stream_id (uuid)
    然后通过 kernel/stream.* 事件推送帧

帧 envelope（复用 kernel/stream.*）:
  kernel/stream.started   { stream_id, capability_id, executor_kind, redaction_state }
  kernel/stream.chunk     { stream_id, frame_index, chunk_shape }
                          chunk_shape 是 redacted - 不含 raw bytes
                          subprocess client 通过 transport 拿到 raw chunk
  kernel/stream.ended     { stream_id, status, usage, cost, redaction_state }
  kernel/stream.error     { stream_id, code, message }
  kernel/stream.cancelled { stream_id, reason }
  kernel/stream.timeout   { stream_id, timeout_ms }

kernel.capability.cancel 复用 - 接 stream_id

LiveHttpStreamingExecutor:
  reqwest 流式响应 (response.bytes_stream())
  chunk 通过 mpsc/tokio channel 转发给 kernel streaming subsystem
  cancel 触发 abort + emit cancelled event
  timeout 触发 emit timeout event
```

### 改动文件

```text
crates/ygg-runtime/src/protocol.rs
  KernelMethod::OutboundStream 新增
  注册到协议表

crates/ygg-runtime/src/runtime/protocol_dispatch.rs
  dispatch_outbound_stream 新增
  shape 与 outbound.execute 一致 + stream lifecycle

crates/ygg-runtime/src/runtime/outbound.rs
  OutboundExecutor trait 新增 execute_stream 方法（默认实现：返回 unsupported）
  LiveHttpOutboundExecutor 实现 execute_stream
  FakeOutboundExecutor 实现 execute_stream（emit deterministic chunks）
  DenyAllOutboundExecutor 拒绝

crates/ygg-runtime/src/runtime/streaming.rs
  整合 outbound stream lifecycle
  redaction policy 应用到 chunk_shape

docs/
  protocol/PROTOCOL_V0.md - 新增 outbound stream 段
  guides/MODEL_PROVIDER_INTEGRATION.md - 新增 streaming 章节
```

### 验证

```text
cargo test -p ygg-runtime (新增 outbound_stream_*)
ygg conformance (新增 outbound_stream_lifecycle / cancel / timeout / fake_emits_chunks)
公开协议契约文档同步
```

## P3.3: Yggdrasil manifest permissions.secret_refs

**位置**: `/workspace/Yggdrasil/Yggdrasil/crates/ygg-core/src/manifest.rs`

**目的**: 让 package 在 manifest 里声明它会用哪些 secret_ref，host policy 检查时 fail-closed 拒绝未声明的。

### 改动

```text
manifest.yaml 新字段:
  permissions:
    secret_refs:
      - 'secret_ref:env:OPENAI_API_KEY'
      - 'secret_ref:env:ANTHROPIC_API_KEY'

crates/ygg-core/src/manifest.rs
  PermissionsManifest::secret_refs: Vec<String>
  validate_secret_ref_form (复用 secret.rs::parse_secret_ref)

crates/ygg-runtime/src/runtime/protocol_dispatch.rs
  dispatch_outbound_execute / _stream
  对每个 secret_headers[k].secret_ref 检查是否在 caller package 的 manifest 声明里
  未声明 → fail-closed permission_denied

conformance:
  outbound_secret_ref_undeclared_fails
  outbound_secret_ref_declared_resolves
```

### 验证

```text
cargo test -p ygg-core
cargo test -p ygg-runtime
ygg conformance (new cases pass)
现有 packages/official/* manifest 无需改动（它们不用 secret_ref）
```

## P3.4: TypeScript subprocess SDK outbound 助手

**位置**: `/workspace/Yggdrasil/Yggdrasil/sdk/typescript/subprocess/`

**目的**: subprocess package 现在只有 package.handshake / capability.invoke，需要提供 helper 让它们能反向调用 kernel.outbound.execute / stream。

### 设计

```text
现状:
  subprocess 通过 stdin 收 capability.invoke
  通过 stdout 写 capability.invoke response
  没有发起 kernel.outbound.* 的路径

方案:
  subprocess SDK 新增 outbound 客户端
  通过 stdout 发 outbound JSON-RPC envelope
  通过 stdin 收 outbound response（runtime 端识别请求类型并 dispatch）

或:
  扩展 subprocess.rs: kernel 收到 subprocess 的 outbound JSON-RPC 时，
  把它当作公开协议请求转发到 ProtocolRegistry
  这样 SDK 端只需 sendKernelRequest('kernel.outbound.execute', params)

推荐方案 B（更接近公开协议本质）
```

### 改动文件

```text
sdk/typescript/subprocess/src/
  kernel-client.ts (新增)
    sendKernelRequest<T>(method: string, params: unknown): Promise<T>
    streamKernelRequest(method: string, params: unknown, callbacks): Cancel
  outbound.ts (新增)
    executeOutbound(params): Promise<OutboundResponse>
    streamOutbound(params, callbacks): Cancel
  index.ts 导出

crates/ygg-runtime/src/subprocess.rs
  新增对子进程发出的 kernel.* 请求的转发处理
  与现有 capability.invoke 区分
  通过 ProtocolRegistry::dispatch
```

### 验证

```text
sdk/typescript/subprocess 自身 typecheck/build
新增小例子 examples/packages/subprocess-outbound-canary/
  manifest 声明 network + secret_refs
  通过 SDK 调 kernel.outbound.execute (FakeExecutor)
  验证 response 结构
ygg conformance subprocess_outbound_through_kernel_*
```

## P3.5: YdlTavern engine model.live_call capability

**位置**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-engine/`

**目的**: 把 YdlTavern dep-port 的 buildChatRequest 输出和 Yggdrasil 公开协议 outbound 衔接起来，做出 YdlTavern 第一个真实的 model 调用 capability。

### 设计

```text
新增 capability: model.live_call

input:
  source: ChatCompletionSource (e.g. 'openai' | 'deepseek' | 'anthropic')
  model: string
  messages: ChatCompletionMessage[]
  settings: BaseSettings
  generationType?: GenerationType
  bias?: string
  tools?: Tool[]
  stream: boolean
  secret_ref: string  // 'secret_ref:env:OPENAI_API_KEY'
  destination_host_override?: string  // 默认按 source 推断

output:
  unary 模式:
    body_shape: redacted response shape
    text: assembled assistant text
    reasoning?: string
    tool_calls?: ToolCall[]
    usage?: { prompt_tokens, completion_tokens, total_tokens }
  stream 模式:
    使用 capability stream（kernel.capability.stream-style frames）
    每帧 chunk: { delta_text, delta_reasoning, tool_calls, swipe_index }
    最后一帧 final: { text, reasoning, tool_calls, usage }

实现:
  1. dep-port buildChatRequest(input) → request body
  2. resolve destination_host (per source)
  3. resolve API path (per source)
  4. 构造 secret_headers (Authorization Bearer / x-api-key 等 per source)
  5. 通过 SDK kernelClient.executeOutbound / streamOutbound
  6. 收到响应后 dep-port applyStreamChunk → normalized output

manifest 新增声明:
  permissions:
    network:
      declarations:
        - host: 'api.openai.com'
          methods: ['POST']
        - host: 'api.deepseek.com'
          methods: ['POST']
        - host: 'api.anthropic.com'
          methods: ['POST']
    secret_refs:
      - 'secret_ref:env:OPENAI_API_KEY'
      - 'secret_ref:env:DEEPSEEK_API_KEY'
      - 'secret_ref:env:ANTHROPIC_API_KEY'
```

### 验证

```text
单元测试用 FakeOutboundExecutor:
  输入 openai-basic 配置 → 期望 request body 形状（用 P1 fixture diff）
  fake 返回固定 SSE 序列 → 期望 stream chunks
  cancel 触发 → 收到 stream.cancelled
  timeout → 收到 stream.timeout

LIVE smoke test (opt-in env YGG_LIVE_MODEL_TESTS=1 + OPENAI_API_KEY):
  真实调 OpenAI gpt-4o-mini "say 'pong'"
  断言 response 含 'pong' (不字面比较)
  audit 事件 redacted

不 commit 真实 API key
```

## P2.1: gpt-tokenizer 接入

**位置**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-engine-core/src/tokenizers-runtime/`

### 改动

```text
package.json:
  dependencies:
    gpt-tokenizer: ^3.4.0

src/tokenizers-runtime/
  index.ts                   getTokenizer(id): Promise<TokenizerAdapter>
  openai.ts                  动态 import gpt-tokenizer per encoding
                             cl100k_base / o200k_base / p50k_base / r50k_base
  fallback.ts                guesstimate 兜底

src/tokenizers-st.ts
  整合: planCount 调用真实 tokenizer 时（async opt-in）
  默认仍 guesstimate（保 sync API）

test/tokenizers-runtime.test.mjs
  对 ST tiktoken 已知输入断言相同 token 数
  golden harness 通过 P1 验证字节对齐
```

## P2.2-2.5: 其他 tokenizer 系列

类似 P2.1 模式：每加一个 family 加一个 lazy loader 模块 + 测试。

```text
P2.2: llama-tokenizer-js@1.2.2 + llama3-tokenizer-js@1.2.0
P2.3: @anthropic-ai/tokenizer@0.0.4 (本地近似)
P2.4: @huggingface/tokenizers@0.1.3 通用 + tokenizer.json runtime fetcher
P2.5: registry 整合 + 通过 golden harness 验证全 family
```

## P4: QuickJS wasm 扩展沙箱

**位置**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-extensions/src/sandbox/`

### 设计

```text
依赖: quickjs-emscripten@latest (Apache-2.0)

src/sandbox/
  runtime.ts                 创建 QuickJS context per extension
  bridge.ts                  暴露 ST API 表面通过 message 端口
                             - getContext / eventSource / extension_settings
                             - registerSlashCommand
                             - setExtensionPrompt
                             - 任何 ST 扩展用到的全局
  loader.ts                  把 loader-st.ts 的 buildLoadPlan 真实执行
                             读取 extension JS 字符串
                             在 sandbox 里 evaluate
                             桥接 ES module imports 到 host bridge
  permissions.ts             host 决定哪些 API 可以暴露
  audit.ts                   记录 sandbox 调用 host API 的事件

tests:
  跑 ST 一个真实小扩展（regex 或 token-counter）
  断言 它能 register slash command, 能 read settings, 能 setExtensionPrompt
```

### 边界

```text
QuickJS 单线程 - 长任务可能阻塞，加 timeout
没有 fetch / XMLHttpRequest 默认 - 所有网络通过 bridge → kernel.outbound.*
没有 DOM - 扩展不能直接 DOM 操作（surface 通过事件订阅）
没有 require/import 真实文件 - 模块解析通过 bridge
```

## P5: Slash 命令批量补全

**位置**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-st-compat/src/slash-commands/`

按 ST `slash-commands.js` 的注册顺序，分批移植到 ~80 个：

```text
批 A (Session/Chat ops):     /api /model /tokenizer /stop /closechat /tempchat / etc
批 B (Messaging):             /sendas /send /sys /comment /continue /regenerate /swipe / etc
批 C (Variables/Control):     已有 /setvar /getvar /if /while /run; 补 /addvar /flushvar /listvar /global变体 /closure-serialize / etc
批 D (Characters/Group):      /char-find /char-update /member-add / etc
批 E (Messages/Visibility):   /message-role /hide /unhide /delname / etc
批 F (WI/Injections):         /inject /listinjects /flushinject /getpromptentry / etc
批 G (Utilities):             /echo /popup /input /delay /trim* /upper /lower /substr /replace / etc
```

每批一个 PR/commit + 配套 fixture 验证。

## P6: 完整 Tavern 产品 UI

**位置**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-surface/`

### 改动

```text
依赖加入:
  react-virtuoso@^4 (虚拟列表)
  其他必要的成熟库（按 designer 评估）

src/components/product/
  ChatList.tsx              react-virtuoso 5K+ 楼层
  ThemedRoot.tsx             CSS variables 加载 ST 主题文件
  Settings/
    ConnectionForm.tsx
    SamplerForm.tsx
    PersonaForm.tsx
    ThemeForm.tsx
  ExtensionsDrawer.tsx       loader-st 真实状态 + 扩展面板
  QuickReplyBar.tsx          Quick Reply 集合 UI
  MobileShell.tsx            响应式

性能目标:
  10K Turn 列表滚动 60 FPS
  流式 token 接收 200+ token/s 不掉帧
  WI 触发在 1K 条目级 < 50ms
```

@designer 主导。

## P7: Yggdrasil shell + 发布（本轮 plan only，不实现）

```text
Web client 性能打磨
Tauri desktop wrapping
PWA / 原生壳
Surface descriptor loader
GitHub Actions release pipeline
签名 + 商店上架
```

下个 round 单独立项。

## N14: 删除临时计划 + 文档收敛

```text
删除:
  YdlTavern/docs/YDLTAVERN_NEXT_FRONTIER_PLAN.md/.en.md
  Yggdrasil/docs/YGGDRASIL_OUTBOUND_EVOLUTION_PLAN.md/.en.md (如果新建过)

更新:
  README / ARCHITECTURE / COMPATIBILITY_MATRIX
  新增 GOLDEN_HARNESS guide
  新增 LIVE_MODEL_CALLS guide
  Yggdrasil docs 同步 outbound stream + secret_ref + sdk helper
```

## 边界（贯穿全程）

```text
不直连 provider - YdlTavern 永远走 Yggdrasil 公开协议
不存 raw API key - 全部 secret_ref
不绕过 audit / redaction
不污染 kernel namespace（chat/turn/agent 等概念不进 kernel）
不为兼容性牺牲架构清洁
不引入未维护或 license 不兼容的依赖
```

## 完成判据

```text
每阶段:
  typecheck/build/test 通过
  fixture / conformance 验证通过
  commit + push origin/main
  不破坏前阶段产物

总完成:
  P0 → P5 全 push
  P6 至少 product shell 真实化（虚拟列表 + 主题加载）
  N14 临时计划删除 + 文档收敛
  golden harness 第一批 fixture 跑通
  至少一个真实模型调用 smoke 通过（opt-in）
  对齐度提升到 65-75%
```
