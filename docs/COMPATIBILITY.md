# 与 SillyTavern 的承接

> [English](./COMPATIBILITY.en.md) · [中文](./COMPATIBILITY.md)

YdlTavern 的目标是基本 100% 承接 SillyTavern。本文是承接范围的总图，具体兼容矩阵、扩展 API 表面、迁移路径会随实现展开持续填充。

## 三层承接

承接不是一刀切，要分层处理。

### 1. 资产层 —— 直接迁移

格式层面的事，全部支持原样导入：

- 角色卡：V1 / V2 / V3，含 PNG 内嵌元数据。
- 世界书 / lorebook。
- 提示词预设。
- 聊天历史 JSONL。
- Persona、群组、quick reply。
- 主题 CSS。

迁移方式：YdlTavern 直接读老格式，落到内部存储；同时调用 Yggdrasil 的通用能力包（`persona-lab` / `knowledge-lab` / `context-lab`）做 normalization。原始 payload 保留，不被破坏。

### 2. UI 层 —— 全面重写但保持熟悉

前端代码全部新写，但视觉与操作对老用户保持熟悉：

- 顶部菜单、主聊天面板、设置抽屉、扩展抽屉的整体布局保持一致；
- CSS variable 主题系统兼容老主题文件；
- 操作流（swipe / regenerate / continue / branch / 群聊轮换 / quick reply / slash commands）保持一致；
- 配色、间距、字体可调，默认值贴近 SillyTavern。

不是把 SillyTavern 的 HTML 抄过来，而是参照它的结构重写一遍——为的是把性能、可访问性、状态管理这些底层问题一并解决。

### 3. 扩展层 —— 通过兼容层承接

老 SillyTavern 扩展按它们假设的 runtime 形态分类：

| 类型 | 承接方式 |
|---|---|
| 调用 ST 全局 API（`getContext()`、`eventSource`、`saveSettingsDebounced` 等） | 兼容层提供同名对象；底下转发到 Yggdrasil 公开协议 |
| Slash commands / STScript 宏 | 兼容层接管解析与执行 |
| Quick reply、theme、UI panel 类纯前端扩展 | 兼容层通过 ST 风格的 hook 接入 |
| 直接操作 DOM 的扩展 | 大多数能跑，少数依赖具体 DOM 结构的需要适配 |
| 引入第三方依赖、长 runtime 的扩展 | 在兼容层 + Yggdrasil 沙箱里跑，不破坏隔离 |

加载方式：兼容老扩展的 `manifest.json` + `index.js` 结构，直接放进来即可。

## YdlTavern 自带的现代化能力

承接老的同时，引擎层换成现代实现。这些能力来自 Yggdrasil，不是 YdlTavern 自己造的：

- 现代数据库 / 变量存储（不是塞进单个 JSON 里全量读写）；
- 现代工具调用与 function calling；
- MCP（Model Context Protocol）；
- Skills；
- 多 agent 框架；
- 向量检索 / 长期记忆；
- 流式生命周期、取消、超时；
- 出站审计、`secret_ref`、网络声明。

老扩展看不到这些——它们继续用 ST 风格的 API。新扩展可以选择：用 ST 风格 API（保持兼容性），或者直接用 Yggdrasil 公开协议（拿到全部新能力）。

## 不在承接范围内的

承诺现实一些：

- 跟某个 SillyTavern 内部实现细节耦合的扩展（依赖 ST 的 UI 库版本、依赖 ST 的具体 DOM 结构、依赖 ST 的内部状态格式）需要适配，不可能 100% 直接跑。
- SillyTavern 那些已经被社区放弃、长期不维护的实验性 API，不进入兼容层。
- 老 SillyTavern 的 bug 行为（比如某些边界条件的副作用）不复制——但会在迁移指南里指出差异。

## 兼容矩阵

具体哪些 API 表面、哪些扩展、哪些资产格式被覆盖——会在实现展开后用一份独立文档持续维护。当前阶段不预判覆盖率数字。

## 怎么验证

每一条承接都要有验证手段：

- 资产：用真实 SillyTavern 角色卡、世界书、预设、聊天历史做导入回归。
- UI：截图对比 + 真实老用户体验回访。
- 扩展：挑社区前列的扩展跑一遍，给出兼容性等级（直接跑 / 需要小改 / 不支持）。

具体执行计划在实现阶段定。
