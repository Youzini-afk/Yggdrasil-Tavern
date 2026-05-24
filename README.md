# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**一个跑在 [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil) 平台上的对话与角色扮演项目，兼容 SillyTavern 的角色卡、世界书、预设、聊天与扩展。**

YdlTavern 把 SillyTavern 社区多年沉淀下来的内容格式和扩展生态接进 Yggdrasil 平台底座。前端体验保持熟悉，引擎层走 Yggdrasil 的现代实现。

## 安装

YdlTavern 通过 Yggdrasil 的项目机制安装：

```bash
yg install github.com/Youzini-afk/Yggdrasil-Tavern
```

安装后，YdlTavern 会作为 `yggdrasil_native` 项目出现在 Home 屏幕上，点击 Play 进入聊天界面。API key 配置走 Yggdrasil 的密钥存储——在 API Connections 抽屉里粘贴一次即可。详见 [Yggdrasil 密钥管理指南](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.md)。

项目 id 使用稳定形态 `youzini-afk__YdlTavern__d2a47e5c`：前缀来自发布者与项目名，后缀是 canonical name `Youzini-afk/Yggdrasil-Tavern` 的 SHA-256 前 8 位。

## 它做什么

- 直接导入 SillyTavern 的角色卡（V1 / V2 / V3）、世界书、提示词预设、聊天历史。
- 兼容 SillyTavern 扩展 API（`getContext()`、`eventSource`、slash commands 等），让现有扩展能直接跑起来。
- SendForm 真实调用 engine `model.live_call` / `model.live_call.stream`，可经 Yggdrasil host outbound 调 OpenAI / Anthropic / Gemini 等 provider API，并在聊天 UI 中流式显示响应；Stop 可取消当前生成。
- UI 结构和操作流程对老用户保持熟悉，前端代码全新写一遍。
- 引擎层走 Yggdrasil：模型接入、`secret_ref`、流式生命周期、提案审批、外发审计、记忆/检索、agent 框架，都来自平台。

## 跟 Yggdrasil 的关系

YdlTavern 是 Yggdrasil 上的接入项目，通过公开协议（HTTP `/rpc` + SSE）消费平台，并通过 surface bundle 向 Yggdrasil 提供自己的 Tavern 前端。Yggdrasil 负责平台壳，YdlTavern 负责产品 UI。

- 它不在 Yggdrasil 仓库里。平台与产品分开。
- 它跟其他第三方项目享有同样的待遇：同一份清单、同一套权限、同一道审计闸门。
- 它会用上 Yggdrasil 已经做好的：模型接入、`secret_ref`、流式与取消生命周期、提案与审批、记忆、分享、外发审计、git 安装能力包。
- 它按内核 v1 契约作为路径 A 包运行（`entry.contract: "v1"`），通过 bindings / subprocess SDK 调用平台能力；生成的 `@yggdrasil/kernel-sdk` 可通过 npm 或 sibling workspace path（`file:../Yggdrasil/sdk/typescript/kernel-sdk`）消费。

详细边界见 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)；Yggdrasil 那边的相关入口见 [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.md)。

## 当前状态

YdlTavern 已经完成 ST 核心运行时的一对一算法移植：PromptManager、World Info、STScript、宏引擎、chat/text completion 适配器（25/15 providers）、instruct mode、tokenizer registry、内置扩展逻辑、ST API surface 与扩展加载器。算法从 ST 源码逐函数移植，内嵌文件/行号引用。同窗口 ST 扩展兼容已落地：`messageFormatting()`（showdown + DOMPurify + hooks）、React DOM territory cession、`mountSTGlobals()`、ST URL layout shims、BME/shujuku 真实扩展 smoke 都已可跑。golden harness 当前 20/20 perfect；slash commands 覆盖全部 199 个 ST canonical commands。

详细兼容矩阵与现状见 [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.md)；下一步见 [`docs/roadmap/NEXT_STEPS.md`](docs/roadmap/NEXT_STEPS.md)。

## 文档导航

- [`docs/CHARTER.md`](docs/CHARTER.md) — 不变的根本原则
- [`docs/COMPATIBILITY.md`](docs/COMPATIBILITY.md) — SillyTavern 资源与扩展的兼容范围
- [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.md) — 当前兼容覆盖率
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — 与 Yggdrasil 的关系、扩展托管模型、关键机制
- [`docs/architecture/`](docs/architecture/) — 内部 Turn 模型与 ST 兼容投影
- [`docs/guides/`](docs/guides/) — 真实模型调用、Realtime、扩展兼容、UI fork、性能基线、E2E 集成
- [`docs/tracks/`](docs/tracks/) — 8 条并行实现轨道（B 资产 / C 引擎 / D ST API / E STScript / F 内置扩展 / G UI / H 扩展加载 / I 高级特性）
- [`docs/inventory/`](docs/inventory/) — 机械扫描的 ST 源码 inventory（机器读 / 维护者参考）

## 致谢

SillyTavern 的角色卡、世界书、预设、聊天历史和扩展 API，都是 SillyTavern 团队和社区多年的工作。YdlTavern 在此之上做兼容工作，归功于他们。

## 协议

YdlTavern 以 GNU Affero General Public License v3.0（AGPLv3）发布。详见 [`LICENSE`](LICENSE)。
