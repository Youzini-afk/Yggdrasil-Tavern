# G 轨道：UI 重写

> [English](./G_UI_REWRITE.en.md) · [中文](./G_UI_REWRITE.md)

## 范围

YdlTavern 前端用 React + TypeScript 作为 Yggdrasil-hosted surface 全新写。视觉与操作流对老 ST 用户保持熟悉，性能与可维护性彻底改造。YdlTavern 不提供独立桌面/Web/App 壳；平台壳由 Yggdrasil 负责。

包括：

- 顶部菜单（Character / Persona / Settings / Extensions / World Info / 等）
- 主聊天面板（消息渲染 / 思考折叠 / 工具调用 / swipe / edit / branch）
- 设置抽屉（Connection / Sampler / Preset / Persona / Theme / WorldInfo / Extensions）
- 扩展抽屉（Quick Reply / Caption / Gallery / TTS / Translate / Memory / Vectors / 等）
- 主题系统（CSS variable，兼容 ST 主题文件）
- 移动响应式
- 软件级性能：虚拟列表 / 增量渲染 / 流式 token 不卡

## 关键决定

- **Turn 渲染单位**：UI 直接渲染 Turn，不渲染 chat[]。chat[] 只是给老扩展看的投影。
- **思考折叠**：`thinking` sub 默认折叠，可展开。多个工具调用以一个 Turn 内可折叠子条目展示。
- **swipe 在 Turn 层**：左右切换的是整个 Turn 的 variant，不是单条消息。
- **同 contract**：UI 通过 D 轨道的 ST API 表面拿数据 / 触发 generate / 监听事件。UI 没有"私有 API 直通后端"。
- **热路径走 wasm**：tokenization、WI 触发评估、宏展开、regex 应用——都用 wasm 模块（C / I 轨道提供）。

## 对齐策略

跟字节级对齐不一样，UI 对齐靠真实老用户回访 + 截图对比。`COMPATIBILITY_MATRIX` 这部分用定性描述：

- "聊天面板 +0%" `inventoried`
- "聊天面板基础布局" `partial`
- "swipe / edit / branch / 群聊轮换 UI" `implemented`

## 性能目标

ST 现在的痛点：

- 长聊天（5K+ 楼层）DOM 全量渲染卡顿
- jQuery 全文档监听
- 流式输出每个 token 触发整条消息重渲染
- WI 触发用 JS 字符串 contains 循环慢

YdlTavern surface 目标（由 Yggdrasil 壳承载 + 普通 i5）：

- 10K Turn 列表滚动 60 FPS
- 流式 token 接收 200+ token/s 不掉帧
- WI 触发在 1K 条目级 < 50ms

## 依赖

- D 轨道 contract（UI 是 ST API 的消费者）
- C 轨道（生成、流式）
- B 轨道（资产显示）
- I 轨道（WI 触发引擎）

## 当前状态

`@ydltavern/surface` 仍是 Yggdrasil-hosted surface bundle，不是独立 app。`TavernPlaySurface` 当前提供薄纵切片：

- live ST contract 的发送、编辑、fake generate、event log；
- engine request preview；
- importer preview；
- prompt-critical diagnostics：WI activated/skipped、buckets、blocks、macro trace；
- slash diagnostics：输入命令、执行结果、变量、registered commands、diagnostics。

这仍是诊断 UI，不是最终 Tavern 产品界面。后续要做真实 ST-like layout、虚拟列表、主题、设置抽屉、扩展抽屉和性能目标。

## 不在范围内

- 完全重新设计的"创新 UI"——保持熟悉度优先
- 把 ST 的 jQuery DOM 结构原样抄过来——保持视觉熟悉但代码新写

## 完成判据

- 主要操作流跟 ST 一致（用户从 ST 切过来零学习成本）
- 性能目标达成
- 主题文件能正确加载并应用
- 移动端可用
