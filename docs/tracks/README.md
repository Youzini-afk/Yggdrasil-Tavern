# 轨道

> [English](./README.en.md) · [中文](./README.md)

YdlTavern 实现按轨道并行推进，不按线性 milestone。每条轨道一份范围文档，独立可推进，对外用 [`../COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md) 透明展示进度。

## 轨道列表

| 轨道 | 范围 | 主要 inventory |
|---|---|---|
| [B 资产层](./B_ASSET_LAYER.md) | 角色卡 / 世界书 / 预设 / 聊天 / persona / theme 导入导出 | WORLD_INFO_AND_ASSETS |
| [C 引擎核心](./C_ENGINE_CORE.md) | 模型连接 / 采样器 / Generate 流水线 / 上下文构造 | CONNECTORS_AND_SAMPLERS, CORE_EVENTS_AND_COMMANDS |
| [D ST API 表面](./D_ST_API_SURFACE.md) | `getContext()` / `eventSource` / `event_types` / 全局函数 | CORE_EVENTS_AND_COMMANDS |
| [E STScript & slash](./E_STSCRIPT_AND_SLASH.md) | 内置 slash commands / 宏 / STScript 解析器 / 变量域 | CORE_EVENTS_AND_COMMANDS |
| [F 内置扩展](./F_BUILTIN_EXTENSIONS.md) | 14 个内置扩展，每个一个 YdlTavern 包 | BUILTIN_EXTENSIONS |
| [G UI 重写](./G_UI_REWRITE.md) | 前端布局 / 操作流 / 主题系统 / 渲染管线 | （走 D 的 contract） |
| [H 扩展加载](./H_EXTENSION_LOADER.md) | ST 风格扩展加载器 + Yggdrasil 包通道双轨 | （独立） |
| [I 高级特性](./I_ADVANCED.md) | World info 触发引擎 / 群聊轮换 / persona 锁 / instruct mode | WORLD_INFO_AND_ASSETS |

## 推进原则

- 每条轨道独立有进度，独立可发布。
- 不串行——B 在做 importer 时 C 同步做 request/prompt 对齐，G 只作为 D contract 的 surface 消费者。
- 跨轨道依赖通过 D 解耦：D 是 contract，所有 UI 与扩展都消费它。
- 每条轨道实现的每一项都要更新 [`../COMPATIBILITY_MATRIX.md`](../COMPATIBILITY_MATRIX.md)。
- inventory 是 ground truth，不是猜测来源。
