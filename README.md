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

主要开发面已完成一轮系统推进。YdlTavern 现在已有可运行的复刻+升级骨架：ST `chat[]` / `eventSource` / `getContext()` 能真实改写 Turn store；资产层覆盖角色卡、世界书、聊天、预设、persona、theme、quick reply、regex、instruct 的导入/导出骨架；引擎核心覆盖 chat/text request、token budget、PromptManager、World Info advanced、golden harness、stream frame 与模型调用边界计划；surface 已从诊断 demo 升级为可挂载的 Tavern-like 产品 UI。

- **机械扫描的 ST 源码 inventory**：99 个 event_types、153 个 slash commands、80+ 个宏、26 个 chat completion source、17 个 text completion source、80+ 个采样参数、32 个 world info trigger、14 个内置扩展。位于 [`docs/inventory/`](docs/inventory/)。
- **内部数据模型与兼容投影**：Turn 模型 + ST `chat[]` / `eventSource` / `getContext()` 投影规范。位于 [`docs/architecture/`](docs/architecture/)。
- **8 条并行实现轨道**：B 资产 / C 引擎核心 / D ST API / E STScript / F 内置扩展 / G UI / H 扩展加载 / I 高级特性。位于 [`docs/tracks/`](docs/tracks/)。
- **共享类型包**：[`packages/ydltavern-types/`](packages/ydltavern-types/) —— Turn 模型与 ST event/slash/macro/connector/sampler/world-info 常量。
- **资产导入器**：[`packages/ydltavern-importers/`](packages/ydltavern-importers/) —— 角色卡 JSON/PNG、世界书、JSONL chat、preset、persona、theme、quick reply、regex、instruct importer/exporter 骨架，并有 ST-like fixture 测试。
- **ST 兼容运行时**：[`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) —— live `chat[]` Proxy、Turn store、`getContext()`、`eventSource`、`Generate`、宏替换、slash command registry 与 STScript parser/evaluator skeleton。
- **引擎核心**：[`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) —— sampler normalization、chat/text request builder、token budget、PromptManager marker fills、World Info advanced、golden harness、stream frame normalization、model boundary plan（无网络）。
- **兼容矩阵**：[`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.md) —— B/C/D/E/F/G/H/I 进入 `partial`，主要能力面已有 fixture-aligned / plan-only / product-shell 骨架，未宣称字节级对齐。
- **YdlTavern 前端 surface**：[`packages/ydltavern-surface/`](packages/ydltavern-surface/) —— React surface bundle，`TavernPlaySurface` 现在默认展示 Tavern-like product shell（聊天主面板、设置/资产/扩展/开发抽屉），仍不包含独立桌面/Web/App 壳。
- **引擎包**：[`packages/ydltavern-engine/`](packages/ydltavern-engine/) —— Yggdrasil 子进程能力包，`world_info.evaluate`、`preset.compile`、`turn.generate`、asset import/export、script.eval、extension registry/loader plan、model.plan_call 可调用当前本地 contract；仍无真实网络调用。

下一步：进入精细对齐与真实接入阶段：PromptManager/tokenizer 字节级 golden harness、更多 slash commands、真实扩展 JS 沙箱、真实模型调用、以及回到 Yggdrasil 做 Web/Desktop/App shell。详细文档导航见 [`docs/`](docs/README.md)。

## 致谢

SillyTavern 的角色卡、世界书、预设、聊天历史和扩展 API，都是 SillyTavern 团队和社区多年的工作。YdlTavern 在此之上做兼容工作，归功于他们。

## 协议

YdlTavern 以 GNU Affero General Public License v3.0（AGPLv3）发布。详见 [`LICENSE`](LICENSE)。
