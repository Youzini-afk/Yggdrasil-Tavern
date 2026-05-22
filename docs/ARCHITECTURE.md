# YdlTavern 与 Yggdrasil 的关系

> [English](./ARCHITECTURE.en.md) · [中文](./ARCHITECTURE.md)

YdlTavern 是一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 之上的产品。它通过 Yggdrasil 的公开协议消费平台，跟其他第三方项目享有同样待遇。

```text
┌──────────────────────────────────────────────┐
│  YdlTavern 包族                                 │
│  · Tavern 前端 surface（聊天 / 设置 / 扩展面板）│
│  · ST 扩展兼容层（getContext / eventSource 等） │
│  · 引擎与资产 importer（角色卡 / 世界书 / 预设）│
└──────────────────────────────────────────────┘
                    ▲
                    │ HTTP /rpc + SSE
                    │（公开协议）
                    ▼
┌──────────────────────────────────────────────┐
│  Yggdrasil 平台                                │
│  · 模型 provider（OpenAI / Anthropic / ...）   │
│  · persona-lab / knowledge-lab / context-lab   │
│  · memory-lab / sharing-lab / outbound 审计    │
│  · 流式与取消生命周期、提案与审批              │
│  · 内核：会话、事件、权限                       │
└──────────────────────────────────────────────┘
```

## 边界

YdlTavern 这边管：

- 产品定位、UI 设计语言、操作流；
- Tavern 产品前端 surface（聊天界面、角色卡面板、世界书面板、预设编辑器、扩展管理、设置 UI）；
- SillyTavern 资产 importer；
- SillyTavern 扩展兼容层（API 表面、加载器、运行时桥）；
- 跟 SillyTavern 社区直接对接的所有内容（迁移指南、扩展兼容矩阵、社区频道）；
- YdlTavern 自己的产品决策（默认主题、营销、版本节奏）。

Yggdrasil 那边管：

- 平台底座、内核、公开协议；
- 桌面壳、Web 壳、App 壳、Home / Play / Forge / Assistant 容器，以及 surface hosting；
- 通用能力包（模型接入、persona、knowledge、context、memory、sharing 等）；
- 安全执行（`secret_ref`、网络声明、外发审计、流式生命周期）；
- 平台规范、conformance 用例、跨项目纪律。

边界划清楚的好处：YdlTavern 怎么演化都不会把 Tavern 形态渗进 Yggdrasil 内核；Yggdrasil 演化也不会因为顾及 YdlTavern 而扭曲。Yggdrasil 不写 YdlTavern 的聊天 UI；YdlTavern 不写独立桌面/Web/App 壳。

## 依赖方式

### 开发期

开发者通常会把两个仓库 clone 到同级目录：

```text
some-parent/
├── Yggdrasil/      （平台仓库）
└── YdlTavern/      （本仓库）
```

YdlTavern 调用 Yggdrasil 时走本地 host：用 Yggdrasil 的 CLI 起一个 `ygg host serve --http 127.0.0.1:8787`。YdlTavern 的 engine 包通过 `/rpc` + SSE 消费平台；YdlTavern 的 frontend 以 `@ydltavern/surface` 形式交给 Yggdrasil shell 挂载。

YdlTavern 不依赖 Yggdrasil 的源码路径，也不直接 import Yggdrasil 的内部模块——只通过协议。

### 呈现方式

YdlTavern 前端不是一个独立 app。它是 surface bundle：

- `packages/ydltavern-surface` 提供 React components、样式和 surface descriptor 草案。
- Yggdrasil 的 Web / Desktop / App shell 负责发现、加载、挂载这些 surface。
- YdlTavern surface 负责 Tavern 产品 UI；Yggdrasil shell 负责导航、窗口、权限弹窗、安装、审计和平台生命周期。

未来的本地一体安装可以把 Yggdrasil host 与 YdlTavern 包族打在同一个发行包里，但壳仍归 Yggdrasil，产品前端仍归 YdlTavern。

### 发行期

最终用户可以通过 Yggdrasil 的安装/加载机制获得 YdlTavern 包族。无论本地还是远端 host，YdlTavern 都只通过公开协议和 surface contract 与 Yggdrasil 交互。

## 关键机制

### 模型调用

YdlTavern 不自己接 OpenAI / Anthropic / Gemini。真实模型调用通过 `ydltavern/engine/model.live_call` 和 `ydltavern/engine/model.live_call.stream` 进入 Yggdrasil：YdlTavern engine 用 `buildChatRequest` 组 provider 请求体，经 subprocess SDK `kernelClient` 调用 `kernel.outbound.execute` 或 `kernel.outbound.stream`，再由 host 的 live outbound executor 访问 provider HTTPS。YdlTavern 只传 `secret_ref` 字符串和 manifest 声明，不读取 raw key；审计、脱敏、取消和超时由 Yggdrasil outbound 事件链负责。

### Tokenizer runtime

`@ydltavern/engine-core` 的 tokenizer registry 保留 ST 的 `TOKENIZER` / best-match 规则，并在运行时按 family lazy load adapter。OpenAI/GPT-2 使用 `gpt-tokenizer`（cl100k/o200k/p50k/r50k），Llama 1/2 使用 `llama-tokenizer-js`，Llama 3 使用 `llama3-tokenizer-js`，Claude 使用 `@anthropic-ai/tokenizer` 的本地近似，Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A 走 `@huggingface/tokenizers` 且需要调用方提供 tokenizer source。没有真实 source 时回落到 ST 风格 UTF-8/3.35 guesstimate。

### QuickJS 扩展 sandbox

`@ydltavern/extensions` 新增 `src/sandbox/`：QuickJS runtime、host bridge、loader、permissions 和 audit。ST extension JS 在独立 QuickJS context 内执行，v0 暴露受限 `getContext`、extension prompt、event、slash、settings bridge；默认阻断 network/fetch/XHR，并记录 host API 调用的参数形状。sandbox 有激活超时、内存/CPU 配额由 host profile 继续收紧；DOM/style/i18n 注入仍是后续工作。

### 前端 surface

YdlTavern 自己提供 Tavern UI：聊天界面、消息渲染、世界书、预设、扩展管理和设置面板。这些 UI 放在 `@ydltavern/surface`，不是 `clients/desktop` 或独立 SPA。Yggdrasil 只负责把 surface 放进 Home / Play / Forge / Assistant 等平台容器。当前 surface 已从诊断页升级为产品 UI skeleton：`react-virtuoso` 虚拟聊天列表、dark/light/parchment 主题系统、Connection/Sampler/Persona/Theme 分页设置、loader-st 状态驱动的 ExtensionsDrawer、QuickReplyBar 和移动响应式布局。

### Golden harness

`golden-harness/` 是 Node + jsdom fixture generator。它把 SillyTavern 源码作为只读 sibling（通过 `YDLTAVERN_ST_PATH`）加载，用 shims 拦住 DOM、fetch、随机数和时间，从 ST ESM 模块提取 chat、world-info、macro、instruct、tokenizer fixtures。fixture 作为 YdlTavern 深度移植模块的对齐基准；v0 有 shim/fallback 限制，不表示所有域已字节级实现。

### 扩展生态分发

未来的关键能力：「从 GitHub 地址安装能力包」。Yggdrasil 那边会做成 host 的一条受控 git fetch / 校验 / 沙箱安装路径。YdlTavern 的扩展也走这条路，不自己实现分发逻辑。

详情见 Yggdrasil 的 [`docs/roadmap/NEXT_STEPS.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/roadmap/NEXT_STEPS.md)。

### 数据所属

- 用户的角色卡、世界书、预设、聊天等内容数据，由 YdlTavern 管理，存在 YdlTavern 自己的存储中（具体形态在实现阶段定）。
- 平台层面的事件、权限授权、提案审计、外发审计，由 Yggdrasil 管理，存在 Yggdrasil 的事件日志里。
- 两层数据可以互相引用（YdlTavern 里的角色 → Yggdrasil 资产 id），但不混在一起。

### 老扩展跑在哪里

兼容层运行在 YdlTavern 内部。老扩展看到的全局 API 由 YdlTavern 提供。当扩展的 API 调用涉及到模型推理、记忆、外发请求时，YdlTavern 把它转换成 Yggdrasil 公开协议调用。

老扩展不知道有 Yggdrasil 存在——它们以为自己还跑在 SillyTavern 里。

## 不变量

不论 YdlTavern 怎么演化：

- 永远跑在 Yggdrasil 公开协议上，不读内部；
- 永远跟 Yggdrasil 在不同仓库；
- 永远不要求 Yggdrasil 加 Tavern 专属 API；
- 永远自己提供 Tavern 产品 UI surface，但不自己拥有平台壳；
- SillyTavern 资产、UI 结构、扩展 API 的兼容覆盖范围只会扩大，不会缩。

## 当前状态

YdlTavern 的主要开发面已完成一轮系统推进和一轮深度移植：资产导入/导出、ST 兼容运行时、STScript 运行时、引擎核心（PromptManager、World Info、chat/text completion 适配器、instruct mode、tokenizer registry）、内置扩展逻辑、sandbox-enabled extension loader、live model call boundary、产品 surface shell 和诊断 inspector 都已落到可测试代码。深度移植模块从 ST 源码逐函数移植，内嵌文件/行号引用。当前状态仍是 `partial`：真实 tokenizer 覆盖已有 OpenAI/GPT-2/Llama/Llama3/Claude/HF-source families，扩展 JS 已能在 QuickJS sandbox v0 受限执行，真实模型调用已能 opt-in 走 Yggdrasil outbound，golden harness 已生成首批 fixtures；但这些都还不是全域字节级 ST 对齐，provider-specific I/O、DOM 型扩展和更多 fixture 场景仍需继续补齐。
