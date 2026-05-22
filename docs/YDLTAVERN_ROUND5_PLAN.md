# YdlTavern Round 5 — Perfect Fork UI/Layout (V-track)

> 临时计划文件。每阶段完成后 push。全部完成后由 V7 删除并并入长期文档。

## 目的

把 YdlTavern surface 从"功能等价、外观自有"升级到"视觉与布局对齐 SillyTavern"。包括色板、字体、间距、玻璃拟态、阴影、阴影与背景层、抽屉系统、消息气泡结构、设置面板组织、移动端响应行为。

不做：
- 痛点解决（多 agent / MCP / 向量记忆等延后到 Phase B）
- 真实 live model smoke
- 153 slash 命令补全到 100%

## 调研基础

来自三份调研报告（已 review）：

**ST 实际结构**（explorer）：
- 中央 `#sheld` 50vw 主列 + 左右抽屉 gutters
- 9 个顶级抽屉（AI Config / API / Advanced Formatting / World Info / User Settings / Backgrounds / Extensions / Persona / Character）
- 消息模板 33 个 DOM 元素（avatar / name / timer / token counter / reasoning / actions / edit / swipe / media / bias）
- 主题系统：SmartTheme* CSS 变量 + 扁平 JSON
- 1000px mobile 断点 + 全屏抽屉行为
- 6563 行 CSS / 33 个文件

**当前 YdlTavern surface 差距**（explorer）：
- 4 文本 tabs vs ST 9+ 图标驱动抽屉
- 消息气泡缺 avatar / swipe arrows / edit toolbar / reasoning / message actions
- 设置仅 4 tabs（Connection / Sampler / Persona / Theme）vs ST 9+
- 主题 3 vs ST 5+ + 无 import/edit
- 移动端只有 1 个 980px 断点

**视觉设计差距**（designer）：
- 暖暗色调（#DCDCD2 on #171717）+ 玻璃拟态 + 全局 text-shadow + 金色/琥珀色强调
- 缺 blur_strength / shadow / per-role chat tint / fontScale / animation duration token
- 推荐：保留 `--tavern-*` 命名，加 ST 主题 JSON 翻译器 + 3 ST 经典预设

## 阶段

### V0 — 计划 push

本文件。

### V1 — 设计 tokens 对齐 + ST 主题 JSON 导入

**位置**：`packages/ydltavern-surface/src/styles/`、`src/components/product/themes/`

**新增 token**：
```css
:root {
  /* 新增（对齐 ST） */
  --tavern-blur-strength: 10px;
  --tavern-glass-opacity: 0.7;
  --tavern-text-shadow-spread: 2px;
  --tavern-text-shadow-color: rgba(0, 0, 0, 0.5);
  --tavern-user-mes-tint: rgba(0, 0, 0, 0.3);
  --tavern-bot-mes-tint: rgba(60, 60, 60, 0.3);
  --tavern-chat-tint: rgba(23, 23, 23, 1);
  --tavern-quote-color: #E18A24;
  --tavern-em-color: #919191;
  --tavern-underline-color: #BCE7CF;
  --tavern-active: #58B600;
  --tavern-golden: #F8D300;
  --tavern-warning: rgba(255, 0, 0, 0.9);
  --tavern-font-scale: 1;
  --tavern-main-font-size: calc(var(--tavern-font-scale) * 15px);
  --tavern-animation-duration: 125ms;
  --tavern-sheld-width: 50vw;
  --tavern-avatar-size: 50px;
  --tavern-avatar-radius: 2px;
  --tavern-avatar-radius-rounded: 10px;
  --tavern-avatar-radius-round: 50%;
  --tavern-blur-tint: rgba(23, 23, 23, 0.85);
}

/* 全局 text-shadow */
* {
  text-shadow: 0 0 var(--tavern-text-shadow-spread) var(--tavern-text-shadow-color);
}
```

**字体改为 Noto Sans + Noto Sans Mono**（对齐 ST），保留 Inter 作为 fallback。

**3 个 ST 经典预设**（新增 `built-in-themes.ts` 条目）：
- `Dark V 1.0` — 默认 ST 暗色
- `Azure` — 蓝色调
- `Celestial Macaron` — 浅色甜美调

通过翻译器从 ST `themes/*.json` 字段（`main_text_color`, `blur_tint_color`, etc.）映射到 `--tavern-*` token。

**新增 `themes/st-theme-importer.ts`**：
```ts
export interface STThemeJson { /* ST 主题 JSON shape */ }
export function importSTTheme(stJson: STThemeJson): TavernTheme;
export function exportSTTheme(theme: TavernTheme): STThemeJson;
```

**测试**：现有 surface typecheck/build 通过；新增 importer 单元测试。

### V2 — Shell 架构（TopBar + DrawerShell + 50vw sheld）

**位置**：`packages/ydltavern-surface/src/app/`、`src/components/shell/`

**重构 TavernShell**：
- 移除 4-tab 文本导航
- 新增 `TopBar.tsx`：8-9 个 Font Awesome 图标驱动按钮（sliders / plug / font / book-atlas / user-cog / panorama / cubes / address-card）
- 新增 `DrawerRail.tsx`：抽屉容器系统（左侧 fillLeft / 右侧 fillRight / 顶部 top-row）
- 新增 `Sheld.tsx`：中央 50vw 主列容器（chat 区 + send_form）
- 抽屉行为：图标点击 toggle，多抽屉互斥关闭，移动端全屏

**抽屉骨架**（V2 只建空壳，V5 填内容）：
- AIConfigDrawer — 左侧 fillLeft
- APIConnectionsDrawer
- AdvancedFormattingDrawer
- WorldInfoDrawer
- UserSettingsDrawer
- BackgroundsDrawer
- ExtensionsDrawer
- PersonaManagementDrawer
- CharactersDrawer — 右侧 fillRight

每个抽屉都是占位组件，标题正确，内容用 "Coming in V5" 占位。

**移除**：现有 SettingsPanel 4-tab、Assist drawer 改为图标按钮、AssetsPanel 整合到 BackgroundsDrawer。

### V3 — 消息气泡 parity

**位置**：`packages/ydltavern-surface/src/components/product/Message/`

**新组件**：
- `MessageBubble.tsx` — 替换当前 TurnView，对齐 ST `.mes` 结构
- `MessageAvatar.tsx` — 50px 头像 + token counter + timer + IDDisplay
- `MessageActions.tsx` — copy/edit/delete/translate/narrate/branch/checkpoint/hide 按钮组（ellipsis 触发）
- `MessageEditToolbar.tsx` — 编辑模式：done/copy/add-reasoning/delete/up/down/cancel
- `SwipeControls.tsx` — 左右箭头 + swipes-counter
- `ReasoningBlock.tsx` — `<details>` 折叠 + reasoning 头部 + 操作按钮
- `MessageMediaWrapper.tsx` — 图片/文件/bias 容器

**DOM 结构对齐**（参考 ST `index.html:7377-7455`）：
```jsx
<div className="mes" data-mesid="..." data-isUser="...">
  <div className="mesAvatarWrapper">
    <div className="avatar"><img /></div>
    <div className="mesIDDisplay" />
    <div className="mes_timer" />
    <div className="tokenCounterDisplay" />
  </div>
  <div className="swipe_left" />
  <div className="mes_block">
    <div className="ch_name">
      <span className="name_text" />
      <small className="timestamp" />
      <MessageActions />
    </div>
    <ReasoningBlock />
    <div className="mes_text" />
    <MessageMediaWrapper />
    <div className="mes_bias" />
  </div>
  <div className="swipeRightBlock">
    <div className="swipe_right" />
    <div className="swipes-counter" />
  </div>
</div>
```

**CSS 严格对齐 ST**：avatar 50×50 / 2px radius / 各按钮 hover / system message 特殊样式。

**TavernProvider 扩展**：实装 swipe / edit / regenerate / branch（之前是 stub）。

### V4 — Composer + 背景层

**位置**：`packages/ydltavern-surface/src/components/product/Composer/`

**新组件**：
- `SendForm.tsx` — 整合 textarea + 操作按钮（对齐 ST `#form_sheld`）
- `ComposerToolbar.tsx` — options / impersonate / continue / stop / send 按钮（与 ST `#nonQRFormItems` 对齐）
- `BackgroundLayer.tsx` — `#bg1` 等价背景图层（fixed, behind everything, 支持 image url / fit mode）
- `StreamingIndicator.tsx` — 生成中 + abort 控制

**移除**：现有 MessageComposer.tsx 简化版。

**背景配置**：暂不实装 backgrounds 浏览器（V5 BackgroundsDrawer），但 BackgroundLayer 接受 `imageUrl` prop 以备后用。

### V5 — Settings 抽屉填充（核心功能）

**位置**：`packages/ydltavern-surface/src/components/product/drawers/`

填充 V2 创建的 9 个空壳抽屉：

**AIConfigDrawer**：
- 完整 sampler 矩阵（temp / topP / topK / minP / topA / TFS / typicalP / mirostat / freq/pres penalty / repPenaltyRange / etc.）
- 预设管理（import / export / save / delete / rename）
- 流式开关 / preamble / banned tokens / logit bias

**APIConnectionsDrawer**：
- Provider 选择器（OpenAI / Anthropic / Claude / Mistral / Gemini / DeepSeek / OpenRouter / Custom / Llama / Kobold / Horde / NovelAI / TextGen WebUI）
- 每个 provider 的 baseURL / model / secret_ref / 高级选项

**AdvancedFormattingDrawer**：
- 三列布局：ContextSettings / InstructSettingsColumn / SystemPromptColumn
- Story String / 角色定义模板 / Instruct 模式（input/output/system 序列）
- Stop strings / Reasoning prefix-suffix / Macros 配置

**WorldInfoDrawer**：
- World book 列表 + 启用切换
- Entry 编辑器（key / secondary keys / content / position / depth / scan / probability / order）
- 路由诊断面板

**UserSettingsDrawer**：
- 主题选择器（含 import / export / delete / 编辑）
- UI 偏好（fast_ui_mode / no_blur / waifuMode / chat_display / chat_width）
- Font scale / 头像样式

**BackgroundsDrawer**：
- 背景图浏览器（folders / search / sort / fit mode / auto-select）
- 上传 / 删除

**ExtensionsDrawer**：
- 已安装扩展列表（合并现有 ExtensionsPanel）
- 安装通知 / hooks / 启用/禁用切换

**PersonaManagementDrawer**：
- 现有 PersonaForm 升级 + 多 persona 支持 + 头像

**CharactersDrawer**（右侧）：
- 角色列表 + 选择器 + 创建/编辑/导入/导出/删除
- 群聊成员管理

每个 form 用 ST 的 `range-block` / `neo-range-input` / `text_pole` / `textarea_compact` / `checkbox_label` 模式。

### V6 — 移动端 parity

**位置**：`packages/ydltavern-surface/src/styles/mobile.css`

**1000px 断点**（替换现有 980px）：
- `body` 固定 + `touch-action: none`
- `#top-bar` / `.drawer-content` 全宽 + 顶部 offset
- 抽屉变全屏 sheet（dvh 高度 + 圆角底部）
- `pin-button` / drag handle 隐藏
- 抽屉 icons 30×30 触摸区
- 消息 action icons 增大
- 底部 send_form 触摸优化

**768px 断点**（额外）：
- 模型卡布局调整
- waifuMode 适配

### V7 — 最终收敛

**位置**：repo root

**任务**：
- 删除 `docs/YDLTAVERN_ROUND5_PLAN.md`
- 更新 `surface.manifest.json` 和 `manifest.yaml`：新增 6 个 surface 暴露
  - ydltavern/character
  - ydltavern/world-info
  - ydltavern/persona
  - ydltavern/ai-response-config
  - ydltavern/user-settings
  - ydltavern/backgrounds
- 更新 `README.md` / `.en.md`：UI 完美 fork 段落
- 更新 `docs/COMPATIBILITY_MATRIX.md` / `.en.md`：UI 各项推到 implemented
- 更新 `docs/ARCHITECTURE.md` / `.en.md`：shell 架构章节
- 新增 `docs/guides/UI_FORK_GUIDE.md` / `.en.md`：ST UI 等价对照表
- 验证所有包 typecheck / build / test 通过；surface build 输出验证

## 完成判据

- 各包 typecheck / build / test 通过
- surface build 输出 dist 包含所有新组件
- ST 主题 JSON 可导入并正确渲染
- 所有 9 个抽屉可点击图标打开
- 消息气泡显示 avatar + name + timestamp + actions + swipes
- 移动端 1000px 断点行为正确（手动验证或 viewport 测试）
- 临时计划删除
- 长期文档同步

## 不变量

- YdlTavern 永远不直连网络
- 内核 content-free 不变
- 现有 922+ tests 不破
- golden harness 16/20 perfect 保持
- iframe SurfaceHost 边界不变
- AGPLv3 兼容（ST 是 AGPL，复用其 CSS 命名/结构 OK；不直接复制 ST 源码）
