# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 平台上的对话与角色扮演项目，兼容 SillyTavern 的角色卡、世界书、预设、聊天与扩展。**

YdlTavern 把 SillyTavern 社区多年沉淀下来的内容格式和扩展生态接进 Yggdrasil 平台底座。前端体验保持熟悉，引擎层走 Yggdrasil 的现代实现。

## 安装

YdlTavern 通过 Yggdrasil 的项目机制安装：

```bash
yg install github.com/Youzini-afk/Yggdrasil-Tavern
```

安装后，YdlTavern 会作为 `yggdrasil_native` 项目出现在 Home 屏幕上。
点击 Play 进入聊天界面。

API key 配置走 Yggdrasil 的密钥存储 — 在 API Connections 抽屉里粘贴一次即可。
详见 [Yggdrasil 密钥管理指南](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.md)。

SendForm 已接到 Yggdrasil engine：点 Send 会调用 `ydltavern/engine/model.live_call`，再由 Yggdrasil host 通过 live outbound executor 访问真实 provider API。API key 可以保存为平台级或项目级 `secret_ref`。

项目 id 使用稳定形态 `youzini-afk__YdlTavern__d2a47e5c`：前缀来自发布者与项目名，后缀是 canonical name `Youzini-afk/Yggdrasil-Tavern` 的 SHA-256 前 8 位。

## 它做什么

- 直接导入 SillyTavern 的角色卡（V1 / V2 / V3）、世界书、提示词预设、聊天历史。
- 兼容 SillyTavern 扩展 API（`getContext()`、`eventSource`、slash commands 等），让大量扩展能直接跑起来。
- SendForm 真实调用 engine `model.live_call`，可经 Yggdrasil host outbound 调 OpenAI / Anthropic / Gemini 等 provider API。
- UI 结构和操作流程对老用户保持熟悉，前端代码全新写一遍。
- 引擎层走 Yggdrasil：模型接入、`secret_ref`、流式生命周期、提案审批、外发审计、记忆/检索、agent 框架，都来自平台。

## 跟 Yggdrasil 的关系

YdlTavern 是 Yggdrasil 上的接入项目，通过公开协议（HTTP `/rpc` + SSE）消费平台，并通过 surface bundle 向 Yggdrasil 提供自己的 Tavern 前端。Yggdrasil 负责平台壳，YdlTavern 负责产品 UI。

- 它不在 Yggdrasil 仓库里。平台与产品分开。
- 它跟其他第三方项目享有同样的待遇：同一份清单、同一套权限、同一道审计闸门。
- 它会用上 Yggdrasil 已经做好的：模型接入、`secret_ref`、流式与取消生命周期、提案与审批、记忆、分享、外发审计、git 安装能力包。
- 它按内核 v1 契约作为路径 A 包运行（`entry.contract: "v1"`），通过 bindings / subprocess SDK 调用平台能力；生成的 `@yggdrasil/kernel-sdk` 可通过 npm 或 sibling workspace path（`file:../Yggdrasil/sdk/typescript/kernel-sdk`）消费。
- 发布后可通过 `yg install github.com/Youzini-afk/Yggdrasil-Tavern` 安装。

Yggdrasil 那边的相关入口见 [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.md)。

## 项目状态

主要开发面已完成一轮系统推进和一轮深度移植。YdlTavern 已有 ST 核心运行时的一对一算法移植：PromptManager、World Info、STScript、宏引擎、chat/text completion 适配器（25/15 providers）、instruct mode、tokenizer registry、extensions 逻辑、ST API surface 和 extension loader。算法从 ST 源码逐函数移植，内嵌文件/行号引用。

- **机械扫描的 ST 源码 inventory**：99 个 event_types、199 个 ST canonical slash commands、80+ 个宏、26 个 chat completion source、17 个 text completion source、80+ 个采样参数、32 个 world info trigger、14 个内置扩展。位于 [`docs/inventory/`](docs/inventory/)。
- **内部数据模型与兼容投影**：Turn 模型 + ST `chat[]` / `eventSource` / `getContext()` 投影规范。位于 [`docs/architecture/`](docs/architecture/)。
- **8 条并行实现轨道**：B 资产 / C 引擎核心 / D ST API / E STScript / F 内置扩展 / G UI / H 扩展加载 / I 高级特性。位于 [`docs/tracks/`](docs/tracks/)。
- **共享类型包**：[`packages/ydltavern-types/`](packages/ydltavern-types/) —— Turn 模型与 ST event/slash/macro/connector/sampler/world-info/prompt-manager 常量。
- **资产导入器**：[`packages/ydltavern-importers/`](packages/ydltavern-importers/) —— 角色卡 JSON/PNG、世界书、JSONL chat、preset、persona、theme、quick reply、regex、instruct importer/exporter 骨架，并有 ST-like fixture 测试。
- **ST 兼容运行时**：[`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) —— live `chat[]` Proxy、Turn store、完整 `getContext()` shape（state / bridges / functions / legacy aliases / symbols / deprecated stubs）、`eventSource`、`Generate`、宏引擎 re-export（深实现现在位于 engine-core）、STScript 运行时（scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution）以及约 150+ 个 batches A-N slash commands；199 个 ST canonical commands 均有真实实现、plan-only descriptor 或明确 unsupported sentinel 覆盖。
- **引擎核心**：[`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) —— sampler normalization、25 个 chat completion request shapes、15 个 text completion request shapes、stream chunk 状态机、PromptManager、World Info、instruct mode、深宏引擎，以及 tokenizer registry。World Info 已使用 token-approximation 预算与 seedrandom 概率门；tokenizer 现在有 `countTokens(text, options)` 高层 API：OpenAI/GPT-2（`gpt-tokenizer`，cl100k/o200k/p50k/r50k）、Llama 1/2（`llama-tokenizer-js`）、Llama 3（`llama3-tokenizer-js`）、Claude（`@anthropic-ai/tokenizer`，本地近似）、HF generic（`@huggingface/tokenizers`，Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A），并可通过 `fetchHuggingFaceTokenizer` 经 Yggdrasil host runtime-fetch `tokenizer.json`；无真实 source 时保留 UTF-8/3.35 guesstimate fallback。
- **内置扩展包**：[`packages/ydltavern-extensions/`](packages/ydltavern-extensions/) —— regex（完整引擎）、memory、vectors、quick-reply、token-counter、caption、TTS、translate、expressions、attachments、connection-manager、stable-diffusion、extension loader，并新增 QuickJS sandbox（`src/sandbox/` runtime / bridge / loader / permissions / audit）。sandbox 支持受限执行 ST extension JS、ESM relative imports、虚拟 ST host module 映射、浏览器 stub、host bridge、超时/内存/权限约束和审计；真实扩展加载需 `realExtensionLoad` permission flag opt-in，网络/fetch/XHR 仍阻断。详见 [`docs/guides/REAL_EXTENSION_LOADING.md`](docs/guides/REAL_EXTENSION_LOADING.md)。
- **兼容矩阵**：[`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.md) —— B/C/D/E/F/G/H/I 进入 `partial`，深度移植覆盖 PromptManager / World Info / STScript / macros / chat/text completion / instruct / tokenizer / extensions / ST API / extension loader；Round 6 W-track 后 8 个结构性 diff 已关闭，golden harness 维持 20/20 perfect；Round 7 X-track 后 slash commands 覆盖全部 199 个 ST canonical commands。

- **Round 8 complete：ST 扩展无需修改即可运行**
  - Message formatting pipeline（showdown + DOMPurify + hooks）与 ST 路径对齐。
  - DOM territory cession：`#chat`、`#extensions_settings`、`#extensionsMenu`、`#movingDivs` 等均由 React 渲染，并明确 jQuery 让出区。
  - Window globals bootstrap：`mountSTGlobals()` 将 `SillyTavern`、`eventSource`、`chat` 等挂到 `globalThis`。
  - ESM compatibility shims：`/script.js`、`/scripts/extensions.js` 等路径让扩展 relative imports 保持不变。
  - Real extension smoke tests 覆盖 BME 与 shujuku bootstrap。
- **Golden harness**：[`golden-harness/`](golden-harness/) —— Node + jsdom 提取 harness，用只读 sibling SillyTavern 源码生成 chat / world-info / macro / instruct / tokenizer canonical fixtures；真实 `compare.mjs` diff workflow 已可运行，当前 20 个 scenarios 为 20 perfect、0 cosmetic、0 structural、0 unverifiable、0 error；全仓测试规模约 1290+；Round 8 收尾时 `ydltavern-surface` 为 88 tests passing，`ydltavern-st-compat` 为 703 tests passing。详见 [`docs/guides/GOLDEN_HARNESS.md`](docs/guides/GOLDEN_HARNESS.md)。
- **YdlTavern 前端 surface**：[`packages/ydltavern-surface/`](packages/ydltavern-surface/) —— React surface bundle，`TavernPlaySurface` 现在默认展示 SillyTavern parity product UI：9 个顶部图标抽屉 surface、50vw `Sheld` 主列、ST `.mes` 消息 DOM 结构、SendForm/StreamingIndicator/BackgroundLayer、ST theme JSON import/export、3 个 YdlTavern native themes + 3 个 ST classic presets（Dark V 1.0 / Azure / Celestial Macaron），以及 1000px + 768px 移动响应式断点。Round 6 已补齐 TavernProvider 的 sampler / connection / formatting / backgrounds settings slices、characters / personas / world books / backgrounds library collections、CRUD/message operations、schema-versioned localStorage persistence 与 v1→v2 migration；9 个 drawer surfaces 均读写同一 provider state。Vite library build 输出 browser-ready `dist/bundle.mjs`，9 个 mount adapters 全部导出，并通过 `clients/web` E2E demo 路径挂载；styles 与通过 @fontsource@5.2.10 打包的 Noto Sans / Noto Sans Mono Latin subset 随 bundle 发布（4 个 woff2，约 50KB）。详见 [`docs/guides/UI_FORK_GUIDE.md`](docs/guides/UI_FORK_GUIDE.md) 与 [`docs/guides/E2E_INTEGRATION.md`](docs/guides/E2E_INTEGRATION.md)。
- **API Connections 抽屉**：已可实际保存 API key；用户粘贴 key 后，surface 通过 Yggdrasil host RPC 写入 `official/secret-store-lab` 加密 store，profile 只保存 `secret_ref:store:*`。环境变量路径仍可作为 fallback。Yggdrasil 侧说明见 [Yggdrasil/docs/guides/SECRET_MANAGEMENT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.md)。
- **引擎包**：[`packages/ydltavern-engine/`](packages/ydltavern-engine/) —— Yggdrasil 子进程能力包，除深度移植 JSON-RPC capability 与已有 `world_info.evaluate`、`preset.compile`、`turn.generate`、asset import/export、script.eval、extension registry、model.plan_call 外，新增 `model.live_call` / `model.live_call.stream` / `model.live_realtime`。真实模型调用通过 Yggdrasil 公开协议进入 host outbound executor：HTTP unary 走 `kernel.v1.outbound.execute`，SSE 走 `kernel.v1.outbound.stream`，Realtime WebSocket 走 `kernel.v1.outbound.websocket.*` / `kernelClient.openWebSocket`。需要 Yggdrasil host 使用 live outbound profile；Realtime 还需要 `outbound.websocket.executor: live`、允许 `api.openai.com`（Gemini 还需 `generativelanguage.googleapis.com`）。API key 推荐通过 API Connections 保存为 `secret_ref:store:*`；`OPENAI_API_KEY` / `GEMINI_API_KEY` 等 `secret_ref:env:*` 路径仍可 fallback。YdlTavern 只传 `secret_ref`，不接触 raw key。详见 [`docs/guides/LIVE_MODEL_CALLS.md`](docs/guides/LIVE_MODEL_CALLS.md) 与 [`docs/guides/REALTIME_MODELS.md`](docs/guides/REALTIME_MODELS.md)。
- **性能基线**：已提交 [`perf/baseline.json`](perf/baseline.json)，覆盖 5 个包的 37 个场景；运行与 schema 见 [`docs/guides/PERFORMANCE_BASELINE.md`](docs/guides/PERFORMANCE_BASELINE.md)。

下一步：补齐生产扩展 hosting（`/scripts/extensions/<id>/` host static route）、Activity Drawer 透明扩展审计，并以 `perf/baseline.json` 作为 regression reference 推进 Phase B 痛点（multi-agent orchestration、MCP protocol surface、vector RAG、ToolManager full registration）。详细文档导航见 [`docs/`](docs/README.md)。

## 致谢

SillyTavern 的角色卡、世界书、预设、聊天历史和扩展 API，都是 SillyTavern 团队和社区多年的工作。YdlTavern 在此之上做兼容工作，归功于他们。

## 协议

YdlTavern 以 GNU Affero General Public License v3.0（AGPLv3）发布。详见 [`LICENSE`](LICENSE)。
