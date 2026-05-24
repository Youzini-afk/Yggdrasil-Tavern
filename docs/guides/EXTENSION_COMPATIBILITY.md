# 扩展兼容性（ST 扩展无需修改即可运行）

> [English](./EXTENSION_COMPATIBILITY.en.md) · [中文](./EXTENSION_COMPATIBILITY.md)

YdlTavern 的 Round 8 Y-track 把扩展兼容从“受限 sandbox 近似”调整成“同窗口 SillyTavern DOM fork”。现有 ST 扩展应能保留原文件、原 import、原 globals、原 DOM selectors 与原 storage 假设直接加载。

## 兼容承诺

YdlTavern 托管 SillyTavern 扩展时不要求扩展修改。托管模型镜像 ST：

- 扩展与 YdlTavern 在同一个 window 内执行。
- 所有 ST DOM ID 都存在：`#chat`、`#extensions_settings`、`#extensionsMenu`、`#movingDivs`、`#leftSendForm`、`#rightSendForm`、`.mes`、`.mes_text`、`.mes_buttons`。
- 所有 ST globals 都已挂载：`window.SillyTavern`、`eventSource`、`chat`、`characters` 以及相关 context 字段。
- 对 `../../../script.js` 和 `../../extensions.js` 的 ESM import 会解析到兼容 shim。
- 扩展在页面运行时获得完整 DOM、`fetch`、IndexedDB、WASM、Worker 与 `localStorage` 访问。
- 信任模型与 ST 相同：社区策展 + 用户自行判断。

## 安装

扩展通过 Yggdrasil 的 git package 通道安装：

```bash
ygg-cli install <github-url>
```

Host 会把仓库解压到受管理的扩展目录，并暴露为：

```text
/scripts/extensions/<id>/
```

已经使用 ST-style relative imports 的扩展继续从原位置 import，不需要 YdlTavern 专属 manifest 或重写步骤。

## 运行时形状

YdlTavern 在同一个浏览器 window 中运行 React shell、ST 兼容层与第三方 ST 扩展。这是有意匹配 ST，而不是创建每扩展一个 iframe 的 runtime。

直接后果也是有意的：

- 扩展可以使用普通 DOM API 和 jQuery 选择器；
- 扩展可以读写 ST 形状的 globals；
- 扩展可以把控件 append 到 ST DOM anchors；
- 扩展错误通过 callback 层 `try/catch` 隔离，而不是通过硬安全 sandbox 隔离；
- 恶意扩展拥有页面级能力，和 ST 一样。

## DOM 契约

YdlTavern 的 React shell 渲染以下稳定 DOM anchors：

| ID/Selector | 用途 | 所有者 |
|---|---|---|
| `#chat` | 消息列表容器 | React（扩展只读） |
| `.mes` / `.mes_block` | 单条消息 wrapper | React 渲染 |
| `.mes_text` | 格式化 HTML 消息正文 | React + `dangerouslySetInnerHTML` |
| `.mes_buttons_extra` | 单条消息扩展按钮挂载槽 | React 让出 |
| `#extensions_settings` | 主扩展设置面板 | React 让出 |
| `#extensions_settings2` | 次扩展设置面板 | React 让出 |
| `#extensionsMenu` | 顶栏扩展弹出菜单 | React 让出 |
| `#movingDivs` | 浮动弹窗容器 | React 让出 |
| `#leftSendForm` | 发送表单左侧按钮区 | React 让出 |
| `#rightSendForm` | 发送表单右侧按钮区 | React 让出 |
| `#send_textarea` | 聊天输入 textarea | React 拥有 |
| `#send_but` | 发送按钮 | React 拥有 |

“React 让出”表示 React 只渲染一次空容器，之后不再更新它的子节点。扩展可以自由 append children，React 下次 render 不会擦掉它们。

## 消息 HTML

消息正文渲染为 sanitize 过的 HTML，而不是普通 React text children。管线是 ST-compatible `messageFormatting()` 路径：

```text
raw text
  → extension pre-markdown hooks
  → 引号/代码保护
  → showdown markdown conversion
  → DOMPurify sanitization and hooks
  → style tag decode / class prefixing
  → extension post-render hooks
```

`.mes_text` 是稳定交接点。React 拥有初始格式化 HTML。扩展可以检查它、在其它位置加按钮，或修改明确让出的子区域。

## Global API Surface

执行 `mountSTGlobals` 后，以下内容可在 `globalThis` / `window` 上访问：

- `SillyTavern.{libs, getContext}`
- `eventSource`, `event_types`
- `chat`, `characters`, `this_chid`, `chat_metadata`
- `extension_settings`, `extension_prompt_types`, `extension_prompt_roles`
- `groups`, `selected_group`, `name1`, `name2`
- `SlashCommandParser`, `registerSlashCommand`
- `getRequestHeaders`, `saveSettingsDebounced`, `saveMetadata`, `saveMetadataDebounced`
- `reloadCurrentChat`, `saveChat`, `updateChatMetadata`, `addOneMessage`, `deleteLastMessage`
- `substituteParams`, `messageFormatting`, `callPopup`
- `setExtensionPrompt`, `getExtensionPrompt`, `getCurrentChatId`, `getTokenCountAsync`
- `generate`, `generateRaw`, `generateQuietPrompt`
- 挂载 jQuery 时的 `$` / jQuery，以及 `showdown`、`DOMPurify`、`hljs`、`Handlebars`、`moment` 和其它可用 legacy libs

ST 期望 live value 的位置保持 live。例如 `chat` 是 context projection 中同一个 live array/proxy。

## ESM Import 契约

ST 扩展常从自身目录相对路径 import：

```js
import { chat, eventSource } from '../../../script.js';
import { extension_settings } from '../../extensions.js';
```

YdlTavern 通过在 ST 标准 URL 上提供兼容模块来保留该布局。

## URL 布局

扩展通过以下 URL 解析 relative imports：

| URL | 用途 |
|---|---|
| `/script.js` | 顶层 ST core globals shim |
| `/scripts/extensions.js` | extension manager shim |
| `/scripts/events.js` | `eventSource` 与 `event_types` |
| `/scripts/st-context.js` | `getContext()` |
| `/scripts/group-chats.js` | group chat exports |
| `/scripts/secrets.js` | 安全 secrets shim；始终返回空值 |
| `/scripts/power-user.js` | `power_user` object |
| `/scripts/extensions/<id>/...` | 已安装扩展文件 |

开发期这些路径由 Vite middleware 提供。生产期由 host static route 提供。

## 信任模型

YdlTavern 使用与 ST 相同的信任模型：

- 100% 开放访问：无权限弹窗，无 capability 授予系统。
- 通过 git URL 与可信来源进行社区策展。
- 用户自行判断安装什么。
- 扩展 callbacks 会被包装，避免一个扩展失败就故意拖垮整个 host page。

扩展和 host page 之间没有 sandbox。如果安装恶意扩展，它可以在页面里做任何事。这是 ST 模型，也是无需修改兼容所必需的模型。

## 错误处理

兼容不表示扩展一定没有 bug。YdlTavern 仍应在集成点隔离错误：

- event listener dispatch 捕获 callback 异常；
- hook runner 捕获并报告失败；
- smoke test 验证 bootstrap 不会让 surface 崩溃；
- 未来诊断面板应展示扩展活动和失败。

目标是运行韧性，不是权限 enforcement。

## Activity Drawer（Round 9 工作）

未来调试面板会展示扩展正在做什么，但不拦截它们。候选信号包括：

- fetch URL hash 与 method；
- 写入的 localStorage key；
- slash command 注册；
- event listener 注册；
- extension prompt 写入；
- 触碰的 DOM mount target。

这是透明性，不是 enforcement。它帮助用户和维护者调试扩展行为，同时保持 ST 的开放兼容模型。

## 已知与 ST 的差异

YdlTavern 有而 ST 没有的部分：

- 原生 React shell，长聊天滚动更快；
- 经 Yggdrasil outbound 进行真实模型调用，使用 HTTPS-only providers 与 `secret_ref`；
- 通过 Yggdrasil 平台壳提供 Tauri 桌面 wrapper；
- 基于 Vite 的开发工作流；
- 未来 Activity Drawer 透明性。

ST 已有而 YdlTavern 尚未完全镜像的部分：

- 一些 niche legacy library shims 仍在 audit；
- 完整 `/api/extensions/*` HTTP backend，这里由 Yggdrasil git install 与 host capabilities 替代；
- 审计扩展中尚未观察到的部分 DOM IDs；如果扩展依赖某个缺失 ID，请提交 issue。

## 本地尝试

```bash
# Build YdlTavern surface
cd /workspace/Yggdrasil/YdlTavern
npm run build --prefix packages/ydltavern-surface

# Start Yggdrasil host
cd ../Yggdrasil
cargo run -p ygg-cli -- host serve --http 127.0.0.1:8787 --profile profiles/forge-alpha.yaml &

# Start clients/web
npm run dev --prefix clients/web

# Open http://127.0.0.1:1420
# Verify ST URL layout:
curl http://127.0.0.1:1420/script.js | head -10
```

## 给扩展作者的兼容检查表

大多数 ST 扩展不需要改动。如果扩展失败，先检查：

1. 是否只 import ST-relative modules 或 vendored local files？
2. 是否依赖上表未列出的非常新的 ST DOM ID？
3. 是否调用 `/api/extensions/*` 下的 server endpoint，而 YdlTavern 已用 host capabilities 替代？
4. 是否假设某个特定旧 jQuery plugin 或 global library？
5. 是否需要未通过 Yggdrasil package channel 安装的外部服务或本地文件？

提交 issue 时请带上扩展 URL、失败的 import、缺失的 DOM selector 和 console error。

## 参考

见：

- `docs/ARCHITECTURE.md` 与 `docs/COMPATIBILITY_MATRIX.md`：扩展兼容的体系结构与覆盖矩阵；
- `packages/ydltavern-surface/src/formatting/`：messageFormatting pipeline；
- `packages/ydltavern-st-compat/src/window-bootstrap.ts`：global mounting；
- `packages/ydltavern-surface/public/st-compat/`：ESM shim files。
