# H 轨道：扩展加载

> [English](./H_EXTENSION_LOADER.en.md) · [中文](./H_EXTENSION_LOADER.md)

## 范围

第三方扩展加载与运行环境。两条平行通道：

1. **ST 风格通道**——老 ST 扩展（`manifest.json` + `index.js`）直接放进来即可。
2. **Yggdrasil 包通道**——能感知 Yggdrasil 公开协议的新扩展走 Yggdrasil 普通能力包，享受平台所有能力。

## ST 风格通道

加载方式跟 ST 一致：

- 扩展放在 `extensions/<name>/` 目录
- `manifest.json` 声明依赖
- `index.js` ES module 入口
- 全局环境提供 D 轨道的 ST 兼容 API（`getContext`、`eventSource`、`SlashCommandParser`、`window.SillyTavern`）
- 扩展启用 / 停用通过 YdlTavern UI

安全：

- ST-style JS 默认跑在 QuickJS sandbox，不与 YdlTavern 主进程共享 JS context。
- 真实多文件 ESM 扩展加载需要 `realExtensionLoad: true` permission opt-in。
- `fetch` / XHR / WebSocket / Worker / IndexedDB 当前阻断；未来只能通过 Yggdrasil capability bridge 开放受审计路径。
- 扩展通过兼容层触发的 host API 调用进入 audit log，记录调用名与脱敏参数形状。
- 扩展安装时给警告，信任级别由用户决定（跟 ST 一样）。

## Yggdrasil 包通道

新写的扩展可以选：

- 普通 Yggdrasil 子进程包（manifest + capabilities + surface descriptor）
- 走 Yggdrasil 公开协议直接消费会话、提案、流式、记忆、出站
- 不走 ST 兼容层的限制

YdlTavern 在主面板暴露这些包的 surface（按 Yggdrasil surface descriptor），跟其他 Yggdrasil 客户端一样。

## 安装通道

依赖 Yggdrasil 的 git 安装能力：

- ST 风格扩展：YdlTavern 自己拉 git / zip，存到 `extensions/`
- Yggdrasil 包：走 `kernel.outbound.git_fetch` + `official/package-installer-lab`，写到 host profile lockfile（Yggdrasil 已实现）

## 依赖

- D 轨道（ST 风格扩展用兼容层）
- Yggdrasil git 安装通道（已有）
- C 轨道（扩展 generate hook）
- E 轨道（扩展注册 slash commands / 宏）

## 当前状态

当前 H 轨道已有 ESM-capable sandbox loader：`loader-st.ts` 仍负责 ST manifest 解析、启用资格和加载计划；`src/sandbox/` 可按计划执行扩展 JS，提供受限 host bridge、权限合并、激活超时、浏览器 stub 和审计。状态为 `partial-sandboxed / partial-opt-in`：synthetic micro-BME smoke always-on，真实 BME smoke 通过 `YGG_BME_TEST_PATH` opt-in；不支持 extension network/fetch/XHR，真实 DOM/style/i18n 注入不完整，真实 git/zip 安装仍未落地。

Round 4 U-track 新增的 loader 能力：

- ESM module mode 执行，支持入口文件的静态 relative imports 并递归预加载同包文件。
- ST host import 路径映射到虚拟 host module，例如 `../../../../script.js`、`../../../extensions.js`、`../../../../openai.js`。
- 虚拟 host module 暴露 U0 baseline（`getContext`、event on/emit、slash command、extension prompt、settings）以及扩展 API：`event_types`、`extension_prompt_types`、`extension_prompt_roles`、`getRequestHeaders`、`saveSettingsDebounced`、`saveMetadata`、`saveMetadataDebounced`、`reloadCurrentChat`、`updateChatMetadata`、`getExtensionPrompt`、`substituteParams`、`getTokenCountAsync`。
- browser stubs 覆盖 `document`、`window`、`localStorage`、`sessionStorage`、`performance`、`crypto`、`AbortController`、`DOMException`、`matchMedia`、`requestAnimationFrame`；`fetch`、`indexedDB`、`Worker`、`WebSocket` 抛 blocked error。

`@ydltavern/extensions` 已有 ST-style loader 深度移植（`loader-st.ts`）：

- `STExtensionManifest` schema（display_name/loading_order/requires/optional/dependencies/minimum_client_version/js/css/author/version/homePage/hooks/i18n/auto_update/generate_interceptor）；
- `parseSTManifest` with required/type validation + unknown-field warnings；
- `isActivationEligible` checking disabled/extras/dependencies/minimum_client_version；
- `sortByActivationOrder` (loading_order asc, display_name asc)；
- `buildLoadPlan` emitting add_locale/add_script/add_style/register_interceptor/call_hook/mark_active steps in order；
- `STDisabledExtensionsStore`；
- `planActivateAll` with progressive dependency tracking。
- loader plan 可交给 QuickJS sandbox 执行；多文件 ESM 包内读取已支持，真实 zip/git 安装仍未落地。

`ydltavern-engine` 暴露 `extension.loader.parse_manifest` 和 `extension.loader.plan_activate_all` capability。仍是 `partial-sandboxed`：可执行受限 JS，可在 permission opt-in 下读真实 extension package 文件，但不做 zip/git 安装，DOM/网络能力不完整。

## 不在范围内

- 中央扩展市场 / 评分 / 热度排行——不做
- 扩展签名网络——延后
- 把所有 ST 老扩展都搬进 YdlTavern 仓库——不做，扩展由社区维护

## 完成判据

- ST 风格扩展加载流程跑通
- Yggdrasil 包通道跑通
- 一组前 30+ ST 老扩展能直接装且能跑（具体名单实施时定）
- 第三方兼容矩阵公开维护
