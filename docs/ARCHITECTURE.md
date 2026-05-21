# YdlTavern 与 Yggdrasil 的关系

> [English](./ARCHITECTURE.en.md) · [中文](./ARCHITECTURE.md)

YdlTavern 是一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 之上的产品。它通过 Yggdrasil 的公开协议消费平台，跟其他第三方项目享有同样待遇。

```text
┌──────────────────────────────────────────────┐
│  YdlTavern 前端                                │
│  · 仿 SillyTavern UI 结构与操作                 │
│  · ST 扩展兼容层（getContext / eventSource 等）│
│  · 资产 importer（角色卡 / 世界书 / 预设 / 聊天）│
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
- SillyTavern 资产 importer；
- SillyTavern 扩展兼容层（API 表面、加载器、运行时桥）；
- 跟 SillyTavern 社区直接对接的所有内容（迁移指南、扩展兼容矩阵、社区频道）；
- YdlTavern 自己的产品决策（默认主题、营销、版本节奏）。

Yggdrasil 那边管：

- 平台底座、内核、公开协议；
- 通用能力包（模型接入、persona、knowledge、context、memory、sharing 等）；
- 安全执行（`secret_ref`、网络声明、外发审计、流式生命周期）；
- 平台规范、conformance 用例、跨项目纪律。

边界划清楚的好处：YdlTavern 怎么演化都不会把 Tavern 形态渗进 Yggdrasil 内核；Yggdrasil 演化也不会因为顾及 YdlTavern 而扭曲。

## 依赖方式

### 开发期

开发者通常会把两个仓库 clone 到同级目录：

```text
some-parent/
├── Yggdrasil/      （平台仓库）
└── YdlTavern/      （本仓库）
```

YdlTavern 调用 Yggdrasil 时走本地 host：用 Yggdrasil 的 CLI 起一个 `ygg host serve --http 127.0.0.1:8787`，YdlTavern 前端和后端通过 `127.0.0.1:8787` 上的 `/rpc` + SSE 跟它说话。

YdlTavern 不依赖 Yggdrasil 的源码路径，也不直接 import Yggdrasil 的内部模块——只通过协议。

### 发行期

最终用户两种用法都支持：

- **本地一体安装**：单个安装包同时带上 Yggdrasil host 和 YdlTavern 前端，启动后内部互连。
- **连接独立 host**：YdlTavern 作为客户端，连接已经在跑的 Yggdrasil host（本地或远端）。

不论哪种用法，YdlTavern 都只通过公开协议跟 Yggdrasil 说话。

## 关键机制

### 模型调用

YdlTavern 不自己接 OpenAI / Anthropic / Gemini。它通过 Yggdrasil 的 `model-provider-lab` 等能力包发起调用，享受 Yggdrasil 的 `secret_ref`、网络声明、外发审计、HTTPS-only 出站执行器。

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
- SillyTavern 资产、UI 结构、扩展 API 的兼容覆盖范围只会扩大，不会缩。

## 当前状态

骨架阶段。代码尚未开始，文档只固定立场。具体实现路线、UI 设计语言、扩展兼容矩阵、迁移工具，会随实现展开陆续加入。
