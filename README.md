# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 平台上的对话与角色扮演项目，兼容 SillyTavern 的角色卡、世界书、预设、聊天与扩展。**

YdlTavern 把 SillyTavern 社区多年沉淀下来的内容格式和扩展生态接进 Yggdrasil 平台底座。前端体验保持熟悉，引擎层走 Yggdrasil 的现代实现。

## 它做什么

- 直接导入 SillyTavern 的角色卡（V1 / V2 / V3）、世界书、提示词预设、聊天历史。
- 兼容 SillyTavern 扩展 API（`getContext()`、`eventSource`、slash commands 等），让大量扩展能直接跑起来。
- UI 结构和操作流程对老用户保持熟悉，前端代码全新写一遍。
- 引擎层走 Yggdrasil：模型接入、`secret_ref`、流式生命周期、提案审批、外发审计、记忆/检索、agent 框架，都来自平台。

## 跟 Yggdrasil 的关系

YdlTavern 是 Yggdrasil 上的接入项目，通过公开协议（HTTP `/rpc` + SSE）消费平台，并通过 surface bundle 向 Yggdrasil 提供自己的 Tavern 前端。Yggdrasil 负责平台壳，YdlTavern 负责产品 UI。

- 它不在 Yggdrasil 仓库里。平台与产品分开。
- 它跟其他第三方项目享有同样的待遇：同一份清单、同一套权限、同一道审计闸门。
- 它会用上 Yggdrasil 已经做好的：模型接入、`secret_ref`、流式与取消生命周期、提案与审批、记忆、分享、外发审计、git 安装能力包。

Yggdrasil 那边的相关入口见 [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.md)。

## 项目状态

主要开发面已完成一轮系统推进和一轮深度移植。YdlTavern 已有 ST 核心运行时的一对一算法移植：PromptManager、World Info、STScript、宏引擎、chat/text completion 适配器（25/15 providers）、instruct mode、tokenizer registry、extensions 逻辑、ST API surface 和 extension loader。算法从 ST 源码逐函数移植，内嵌文件/行号引用。

- **机械扫描的 ST 源码 inventory**：99 个 event_types、153 个 slash commands、80+ 个宏、26 个 chat completion source、17 个 text completion source、80+ 个采样参数、32 个 world info trigger、14 个内置扩展。位于 [`docs/inventory/`](docs/inventory/)。
- **内部数据模型与兼容投影**：Turn 模型 + ST `chat[]` / `eventSource` / `getContext()` 投影规范。位于 [`docs/architecture/`](docs/architecture/)。
- **8 条并行实现轨道**：B 资产 / C 引擎核心 / D ST API / E STScript / F 内置扩展 / G UI / H 扩展加载 / I 高级特性。位于 [`docs/tracks/`](docs/tracks/)。
- **共享类型包**：[`packages/ydltavern-types/`](packages/ydltavern-types/) —— Turn 模型与 ST event/slash/macro/connector/sampler/world-info/prompt-manager 常量。
- **资产导入器**：[`packages/ydltavern-importers/`](packages/ydltavern-importers/) —— 角色卡 JSON/PNG、世界书、JSONL chat、preset、persona、theme、quick reply、regex、instruct importer/exporter 骨架，并有 ST-like fixture 测试。
- **ST 兼容运行时**：[`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) —— live `chat[]` Proxy、Turn store、完整 `getContext()` shape（state / bridges / functions / legacy aliases / symbols / deprecated stubs）、`eventSource`、`Generate`、宏引擎（完整 ST registry 覆盖 core/env/time/state/instruct/chat/variable + 递归展开 + PickState）、STScript 运行时（scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution）。
- **引擎核心**：[`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) —— sampler normalization、25 个 chat completion request shapes、15 个 text completion request shapes、stream chunk 状态机、PromptManager、World Info、instruct mode，以及 tokenizer registry。tokenizer 现在有 `countTokens(text, options)` 高层 API：OpenAI/GPT-2（`gpt-tokenizer`，cl100k/o200k/p50k/r50k）、Llama 1/2（`llama-tokenizer-js`）、Llama 3（`llama3-tokenizer-js`）、Claude（`@anthropic-ai/tokenizer`，本地近似）、HF generic（`@huggingface/tokenizers`，Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A，调用方提供 tokenizer source）和 UTF-8/3.35 guesstimate fallback。
- **内置扩展包**：[`packages/ydltavern-extensions/`](packages/ydltavern-extensions/) —— regex（完整引擎）、memory、vectors、quick-reply、token-counter、caption、TTS、translate、expressions、attachments、connection-manager、stable-diffusion、extension loader，并新增 QuickJS sandbox（`src/sandbox/` runtime / bridge / loader / permissions / audit）。sandbox v0 支持 ST extension JS 的受限执行、host bridge、超时/内存/权限约束和审计；网络、fetch、XHR 在 v0 阻断。
- **兼容矩阵**：[`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.md) —— B/C/D/E/F/G/H/I 进入 `partial`，深度移植覆盖 PromptManager / World Info / STScript / macros / chat/text completion / instruct / tokenizer / extensions / ST API / extension loader；未宣称字节级对齐。
- **Golden harness**：[`golden-harness/`](golden-harness/) —— Node + jsdom 提取 harness，用只读 sibling SillyTavern 源码生成 chat / world-info / macro / instruct / tokenizer canonical fixtures，用于 ST byte-level / fixture-level 对比。详见 [`docs/guides/GOLDEN_HARNESS.md`](docs/guides/GOLDEN_HARNESS.md)。
- **YdlTavern 前端 surface**：[`packages/ydltavern-surface/`](packages/ydltavern-surface/) —— React surface bundle，`TavernPlaySurface` 现在默认展示 Tavern-like product UI：`react-virtuoso` 虚拟聊天列表、dark/light/parchment 主题系统、Connection/Sampler/Persona/Theme 分页设置、真实 loader-st 状态的 ExtensionsDrawer、QuickReplyBar 和移动端响应式布局；仍不包含独立桌面/Web/App 壳。
- **引擎包**：[`packages/ydltavern-engine/`](packages/ydltavern-engine/) —— Yggdrasil 子进程能力包，除深度移植 JSON-RPC capability 与已有 `world_info.evaluate`、`preset.compile`、`turn.generate`、asset import/export、script.eval、extension registry、model.plan_call 外，新增 `model.live_call` / `model.live_call.stream`。真实模型调用通过 Yggdrasil 公开协议进入 host outbound executor：`buildChatRequest` → subprocess `kernelClient` → `kernel.outbound.execute` / `kernel.outbound.stream` → provider HTTPS。需要 Yggdrasil host 使用 `profiles/forge-with-live-models.example.yaml`、配置 `OPENAI_API_KEY` / `DEEPSEEK_API_KEY` 等环境变量，并启用 live outbound；YdlTavern 只传 `secret_ref`，不接触 raw key。详见 [`docs/guides/LIVE_MODEL_CALLS.md`](docs/guides/LIVE_MODEL_CALLS.md)。

下一步：扩大 golden harness 覆盖、补齐 slash commands C/D/E/F 批次、把更多扩展从 plan-only 推进到可执行，并继续用字节级 fixtures 收紧 ST 对齐。详细文档导航见 [`docs/`](docs/README.md)。

## 致谢

SillyTavern 的角色卡、世界书、预设、聊天历史和扩展 API，都是 SillyTavern 团队和社区多年的工作。YdlTavern 在此之上做兼容工作，归功于他们。

## 协议

YdlTavern 以 GNU Affero General Public License v3.0（AGPLv3）发布。详见 [`LICENSE`](LICENSE)。
