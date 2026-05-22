# SillyTavern UI Fork Guide

> [English](./UI_FORK_GUIDE.en.md) · [中文](./UI_FORK_GUIDE.md)

本指南说明 Round 6 W-track 后 `@ydltavern/surface` 如何复刻 SillyTavern 的 UI / layout，以及哪些地方有意分叉。YdlTavern 目标是“熟悉的 Tavern 操作流 + Yggdrasil surface hosting”，不是复制 ST 的 jQuery 单体应用。

## 总览

YdlTavern 的 UI fork 覆盖 ST 的主要壳层、抽屉、消息、输入框、背景和移动端布局。已对齐的部分包括：9 个顶部图标抽屉、居中 `Sheld` 主列、左右抽屉轨、ST `.mes` 消息 DOM 结构、send form、streaming stop、`#bg1` 背景层、ST classic theme JSON import/export、TavernProvider-backed drawer state，以及 1000px / 768px 移动断点。

有意分叉的部分：React/TypeScript component model、Yggdrasil iframe SurfaceHost、`--tavern-*` token 命名、权限门控的真实扩展加载，以及没有 jQuery / Bootstrap 运行时依赖。

## Design tokens

样式入口在 `packages/ydltavern-surface/src/styles/surface.css`。Round 5 增加 29 个 ST-aligned CSS variables，全部用 `--tavern-*` 命名并限制在 `.ydltavern-surface` / `.tavern-themed-root` 范围内，不写入 host `:root`。

这些 token 覆盖背景、文字、accent、chat tint、user/bot message tint、shadow、border、font scale、animation、Sheld width、avatar size 和 top/bottom icon sizing。ST 的 `SmartTheme*` / flat JSON 字段通过 `packages/ydltavern-surface/src/components/product/themes/st-theme-importer.ts` 映射到这些 token。

## ST classic themes

`built-in-themes.ts` 现在有 6 个内置主题：

- YdlTavern native：`dark`、`light`、`parchment`。这些是产品原生 palette，强调 Yggdrasil 风格和可读性。
- ST classic：Dark V 1.0、Azure、Celestial Macaron。它们通过 ST Theme JSON Importer 导入，保留 ST 的 tint、font scale、chat width、avatar style、timer 等 flags。

Theme picker 可展示 native 与 classic 两类主题。classic themes 用来提供 ST 用户熟悉的视觉起点；native themes 仍是 YdlTavern 自己的默认设计语言。

## Theme JSON shape

Importer 接受 SillyTavern 的 flat JSON shape，例如 `main_text_color`、`italics_text_color`、`blur_tint_color`、`chat_tint_color`、`user_mes_blur_tint_color`、`bot_mes_blur_tint_color`、`shadow_color`、`border_color`、`font_scale`、`chat_width`。

Exporter 会把 `TavernTheme` 尽量转回相同 flat shape。用途：

- 导入社区 ST themes 到 YdlTavern。
- 从 YdlTavern 导出主题，再给 ST 或其他 ST-compatible 工具使用。
- 用同一个 JSON 形状做 theme regression fixtures。

## Shell architecture

壳层在 `packages/ydltavern-surface/src/components/shell/`：

- `TopBar`：9 个 Font Awesome 图标按钮，对应 ST 顶部设置栏。
- `DrawerShell`：统一抽屉容器，包含 backdrop click-to-close。
- `Sheld`：居中的 50vw 主聊天列，对齐 ST `#sheld` 视觉比例。
- `drawer-rail` layout：左侧 8 个抽屉，右侧 Characters。
- `useDrawers`：单一 `openId` 状态，保证抽屉 mutual exclusion；再次点击同一图标关闭。

Yggdrasil 的 `clients/web` / Desktop / App shell 仍拥有 iframe SurfaceHost、导航、安装、权限和平台生命周期。`@ydltavern/surface` 是 React component library，不是 standalone app。

## 9 drawer surfaces

Round 6 后 9 个 ST-aligned drawer 都是真实表单/列表，并读写同一个 `TavernProvider`：

1. **AI Response Configuration**：preset、sampler matrix、banned tokens、logit bias、streaming。
2. **API Connections**：19 providers、profile management、status indicator。
3. **Advanced Formatting**：context template、instruct mode、system prompt、stop strings、reasoning、macros。
4. **World Info**：world book list、entry editor（key / secondary key / content / position / depth / probability / order）、activation diagnostics。
5. **User Settings**：theme picker、UI preferences、font scale、chat width、persistence。
6. **Backgrounds**：image browser、folders、search、fit mode、auto-select。
7. **Extensions**：installed list、install / refresh。
8. **Persona**：multi-persona list、edit form、settings toggles。
9. **Characters**：library search、group chat hint、create / import / edit / duplicate / export / delete。

状态来源：sampler、connection、formatting、background display、characters、personas、world books、backgrounds 与 selection state 都在 `TavernProvider` 中维护，并通过 schema-versioned localStorage 持久化。抽屉不再使用临时占位常量或 deferred handler；刷新页面后，provider-backed settings 与 library entries 会按各自 key 恢复。

## Mount adapters

`@ydltavern/surface` 导出 9 个 mount adapters，供 Yggdrasil `SurfaceHost` dynamic import 后调用：

1. `mountTavernPlaySurface`
2. `mountTavernSettingsSurface`
3. `mountTavernExtensionsSurface`
4. `mountTavernCharactersSurface`
5. `mountTavernWorldInfoSurface`
6. `mountTavernPersonaSurface`
7. `mountTavernAIResponseConfigSurface`
8. `mountTavernUserSettingsSurface`
9. `mountTavernBackgroundsSurface`

每个 adapter 渲染对应 React surface，并返回 unmount 函数。`manifest.yaml` 与 `surface.manifest.json` 的 `export_name` / `entry.export` 均指向这些 adapter，而不是裸 React component。Vite build 会输出 browser-ready `dist/bundle.mjs`，使 iframe 可以直接 `import()`。

## Message bubble parity

消息组件在 `components/product/Message/`。`MessageBubble` 的 DOM structure 复刻 ST `#message_template` / `.mes`：

- `.mes` root + `data-mesid` / `data-is-user` / `data-is-system`。
- `mesAvatarWrapper`、`avatar`、`mesIDDisplay`、`mes_timer`、`tokenCounterDisplay`。
- `ch_name`、`name_text`、`timestamp`、`mes_buttons`、`extraMesButtons`。
- `swipe_left`、right swipe controls、`mes_text`、`mes_reasoning_details`、`mes_media_wrapper`、`mes_bias`。

Edit toolbar 提供 done / copy / delete / up / down / cancel。Action menu 提供 copy / edit / delete-ish affordances、translate、narrate、branch、checkpoint、hide / unhide。所有按钮使用 `type="button"` 和 `aria-label`。

## Composer parity

Composer 在 `components/product/Composer/`：

- `SendForm`：options、continue、impersonate、textarea、send button；Enter 发送，Shift+Enter 换行。
- `StreamingIndicator`：animated dots、`#mes_stop` stop button、`aria-live` status。
- `BackgroundLayer`：fixed `#bg1` equivalent，支持 cover / contain / tile 与 overlay。

## Mobile responsive

`src/styles/mobile.css` 由 `surface.css` 通过 `@import` 引入。它以 ST `mobile-styles.css` 为参照：

- 1000px primary breakpoint，匹配 ST mobile breakpoint。
- 768px secondary breakpoint，匹配 ST 更窄竖屏处理。
- Drawer 变 full-screen sheets，backdrop 更明显。
- Drawer icons 36×36+，message buttons 32×32+，composer buttons 40×40+。
- drag handles / pin handles 在移动端隐藏。
- `send_textarea` 使用 16px，避免 iOS focus zoom。
- 使用 `env(safe-area-inset-bottom)` 保留安全区。

## Accessibility additions

YdlTavern 在 ST parity 外增加了几项 accessibility hardening：

- `prefers-reduced-motion: reduce` 禁用 transitions / animations。
- `forced-colors: active` 增加显式 border / outline。
- 所有抽屉、消息、composer 图标按钮都有 `aria-label` 和明确 `type`。
- `StreamingIndicator` 使用 `role="status"` / `aria-live="polite"`。

## What diverges from ST

- Token naming：使用 `--tavern-*`，而不是把 ST 的 `--SmartTheme*` 直接搬进来。
- Component model：JSX / React components；ST 使用 jQuery + HTML templates。
- Bundle shape：Vite browser-ready ESM surface bundle；无 jQuery、无 Bootstrap。
- Hosting：通过 Yggdrasil iframe SurfaceHost 挂载；ST 是 monolithic SPA。
- Extension safety：真实扩展加载需要 `realExtensionLoad` permission gate；ST 扩展默认无条件加载。

## Surface manifest exposure

`packages/ydltavern-surface/manifest.yaml` 与 `surface.manifest.json` 现在都声明 9 个 surface contributions：原有 `ydltavern/play`、`ydltavern/settings`、`ydltavern/extensions`，加上 `ydltavern/character`、`ydltavern/world-info`、`ydltavern/persona`、`ydltavern/ai-response-config`、`ydltavern/user-settings`、`ydltavern/backgrounds`。

Yggdrasil host 可通过 `kernel.surface.contribution.list` 发现这些 surface，并由 SurfaceHost 挂载任意一个。`settings` 保持 generic catch-all；新增 6 个 surface 是 V5 drawers 的具体入口。
