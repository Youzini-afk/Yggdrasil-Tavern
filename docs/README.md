# YdlTavern 文档

> [English](./README.en.md) · [中文](./README.md)

按主题分组的文档导航。每篇都同时提供中文与英文版本，文件顶部的双语 blockquote 可在两种语言间切换。

## 新人 1 / 2 / 3 路径

1. 读 [`CHARTER.md`](CHARTER.md) → [`COMPATIBILITY.md`](COMPATIBILITY.md)，理解项目立场与兼容范围。
2. 读 [`ARCHITECTURE.md`](ARCHITECTURE.md) → [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.md)，理解与 Yggdrasil 的关系、扩展托管模型与当前覆盖率。
3. 按需要读 `guides/`、`architecture/` 内部数据模型，或 `tracks/` 当前推进面。

## 立场与现状

- [`CHARTER.md`](CHARTER.md) — 不变的根本原则
- [`COMPATIBILITY.md`](COMPATIBILITY.md) — SillyTavern 资源与扩展的兼容范围（总图）
- [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.md) — 当前兼容覆盖率
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — 与 Yggdrasil 的关系、扩展托管模型、关键机制

## 内部架构

- [`architecture/TURN_MODEL.md`](architecture/TURN_MODEL.md) — 内部 Turn 模型规范
- [`architecture/COMPAT_PROJECTION.md`](architecture/COMPAT_PROJECTION.md) — 把 Turn 投影成 ST `chat[]` / `eventSource` / `getContext()` 的规则

## 路线图

- [`roadmap/NEXT_STEPS.md`](roadmap/NEXT_STEPS.md) — 后续工作队列

## Guides

- [`guides/GOLDEN_HARNESS.md`](guides/GOLDEN_HARNESS.md) — 使用 Node + jsdom golden harness 生成 ST 对齐 fixtures
- [`guides/LIVE_MODEL_CALLS.md`](guides/LIVE_MODEL_CALLS.md) — 通过 Yggdrasil outbound executor 发起 opt-in 真实模型调用
- [`guides/REALTIME_MODELS.md`](guides/REALTIME_MODELS.md) — 通过 Yggdrasil WebSocket outbound 使用 OpenAI Realtime / Gemini Live stub
- [Yggdrasil `SECRET_MANAGEMENT.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.md) — API Connections 粘贴 key 后写入 `official/secret-store-lab`，profile 只保留 `secret_ref:store:*`；env 路径仍可 fallback
- [`guides/REAL_EXTENSION_LOADING.md`](guides/REAL_EXTENSION_LOADING.md) — 在 QuickJS sandbox 中 opt-in 加载真实 SillyTavern ESM 扩展
- [`guides/EXTENSION_COMPATIBILITY.md`](guides/EXTENSION_COMPATIBILITY.md) — 同窗口 ST 扩展兼容承诺、DOM 契约、globals 与 URL layout
- [`guides/PERFORMANCE_BASELINE.md`](guides/PERFORMANCE_BASELINE.md) — 运行 5 包 37 场景 tinybench baseline，并使用 `perf/baseline.json` 做回归参考
- [`guides/UI_FORK_GUIDE.md`](guides/UI_FORK_GUIDE.md) — SillyTavern UI/layout fork、9 抽屉、主题、消息、composer 与移动端 parity
- [`guides/E2E_INTEGRATION.md`](guides/E2E_INTEGRATION.md) — Yggdrasil clients/web 如何解析、iframe 挂载并通过 RPC bridge 运行 YdlTavern surface bundle

## ST 源码 inventory（机器读 / 维护者参考）

按域机械扫 SillyTavern 源码产出，作为后续实现的对齐基准。这些是英文文件（以 ST 源码字面量为主），不做中文镜像，也不在主叙事中阅读——仅供维护者与对齐校验使用。

- [`inventory/CORE_EVENTS_AND_COMMANDS.raw.md`](inventory/CORE_EVENTS_AND_COMMANDS.raw.md) — event_types、slash commands、宏、Generate 流水线、chat 消息形状
- [`inventory/CONNECTORS_AND_SAMPLERS.raw.md`](inventory/CONNECTORS_AND_SAMPLERS.raw.md) — chat / text completion sources、采样参数、preset schema、流式处理器
- [`inventory/WORLD_INFO_AND_ASSETS.raw.md`](inventory/WORLD_INFO_AND_ASSETS.raw.md) — world info 触发与流水线、角色卡 V1/V2/V3、preset、persona、群组、quick reply、theme、instruct 模板
- [`inventory/BUILTIN_EXTENSIONS.raw.md`](inventory/BUILTIN_EXTENSIONS.raw.md) — 14 个内置扩展逐个的 manifest、监听事件、slash 注册、API 调用、`chat[]` 改写、`getContext()` 字段读取

## 实现轨道

按域并行推进，不按线性 milestone。详见 [`tracks/README.md`](tracks/README.md)。

| 轨道 | 范围 |
|---|---|
| [B 资产层](tracks/B_ASSET_LAYER.md) | 角色卡 / 世界书 / 预设 / 聊天 / persona / theme 导入导出 |
| [C 引擎核心](tracks/C_ENGINE_CORE.md) | 模型连接 / 采样器 / Generate 流水线 / 上下文构造 |
| [D ST API 表面](tracks/D_ST_API_SURFACE.md) | `getContext()` / `eventSource` / `event_types` / 全局函数 |
| [E STScript & slash](tracks/E_STSCRIPT_AND_SLASH.md) | 内置 slash commands / 宏 / STScript 解析器 / 变量域 |
| [F 内置扩展](tracks/F_BUILTIN_EXTENSIONS.md) | 14 个内置扩展，每个一个 YdlTavern 包 |
| [G UI 重写](tracks/G_UI_REWRITE.md) | 前端布局 / 操作流 / 主题系统 / 渲染管线 |
| [H 扩展加载 / ST DOM Fork](tracks/H_EXTENSION_LOADER.md) | 同窗口 ST 扩展兼容 + Yggdrasil 包通道双轨 |
| [I 高级特性](tracks/I_ADVANCED.md) | World info 触发引擎 / 群聊轮换 / persona 锁 / instruct mode |

## 最短读路径

| 你想 | 先读 |
|---|---|
| 理解项目立场 | [`CHARTER.md`](CHARTER.md) → [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| 理解兼容范围 | [`COMPATIBILITY.md`](COMPATIBILITY.md) → [`COMPATIBILITY_MATRIX.md`](COMPATIBILITY_MATRIX.md) |
| 理解内部数据模型 | [`architecture/TURN_MODEL.md`](architecture/TURN_MODEL.md) → [`architecture/COMPAT_PROJECTION.md`](architecture/COMPAT_PROJECTION.md) |
| 生成 ST 对齐 fixture | [`guides/GOLDEN_HARNESS.md`](guides/GOLDEN_HARNESS.md) |
| 配置真实模型调用 | [`guides/LIVE_MODEL_CALLS.md`](guides/LIVE_MODEL_CALLS.md) |
| 管理 API key | [Yggdrasil `SECRET_MANAGEMENT.md`](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/guides/SECRET_MANAGEMENT.md) |
| 配置 Realtime WebSocket 模型 | [`guides/REALTIME_MODELS.md`](guides/REALTIME_MODELS.md) |
| 加载真实 ST 扩展 | [`guides/EXTENSION_COMPATIBILITY.md`](guides/EXTENSION_COMPATIBILITY.md) → [`guides/REAL_EXTENSION_LOADING.md`](guides/REAL_EXTENSION_LOADING.md) |
| 运行性能 baseline | [`guides/PERFORMANCE_BASELINE.md`](guides/PERFORMANCE_BASELINE.md) |
| 理解 UI fork / ST parity | [`guides/UI_FORK_GUIDE.md`](guides/UI_FORK_GUIDE.md) |
| 本地挂载 YdlTavern surface bundle | [`guides/E2E_INTEGRATION.md`](guides/E2E_INTEGRATION.md) |
| 找 ST 源码里某个 API/事件/命令 | 对应的 `inventory/*.raw.md`（机器读） |
| 看某条轨道做什么 | [`tracks/README.md`](tracks/README.md) → 具体轨道文档 |
