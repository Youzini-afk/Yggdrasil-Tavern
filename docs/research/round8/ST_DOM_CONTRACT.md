# ST DOM 契约台账

> [English](./ST_DOM_CONTRACT.en.md) · [中文](./ST_DOM_CONTRACT.md)

本文记录 Round 8 镜像的 SillyTavern 页面契约，作为后续兼容修复的参考材料。

## Message Formatting 入口

ST 的 `messageFormatting()` 管线位于审计源码的 `script.js:1753-1911`。YdlTavern 把该函数视为可观察消息 HTML 契约。

管线顺序：

1. 接收 raw message text 与 formatting options；
2. 在适用位置运行 extension regex / pre-formatting 行为；
3. 保护不应被错误转换的 code 与 quote-like regions；
4. 运行 showdown markdown conversion；
5. 通过 DOMPurify sanitize HTML；
6. 应用 DOMPurify hooks，处理 links、classes、media 与 custom style 行为；
7. 在 ST 会做的位置 prefix 或 normalize extension-facing classes；
8. 返回用于插入 `.mes_text` 的 HTML。

重要输出是 HTML string，而不是 React element tree。

## Showdown 配置

ST 在 `script.js:520-537` 配置 showdown。审计到的 options 为：

```text
emoji: true
literalMidWordUnderscores: true
parseImgDimensions: true
tables: true
underline: true
simpleLineBreaks: true
strikethrough: true
disableForced4SpacesIndentedSublists: true
```

ST 还安装等价于以下内容的 markdown extensions：

- `markdownUnderscoreExt()`；
- `markdownExclusionExt()`。

YdlTavern 的 converter 应先保留这些可观察行为，再添加任何 YdlTavern 专属渲染特性。

## DOMPurify Hooks

ST 的 DOMPurify hook 行为审计自 `chats.js:1901-2009`。

相关行为：

- 允许 ST style-tag 处理使用的 `custom-style` 路径；
- `afterSanitizeAttributes` 设置外部链接安全属性，例如必要时的 `target="_blank"` 与 `rel="noopener"` / `noreferrer`；
- `uponSanitizeAttribute` 给普通 classes 加 `custom-` 前缀，同时保留 `fa-`、`note-`、`monospace` 等已知例外；
- `uponSanitizeElement` 执行 media allow-lists 与换行行为；
- style tags 在 sanitize 前 encode，在 sanitize 后 decode；
- custom style blocks 中的 CSS selectors scoped 到 `.mes_text`。

目的同时是兼容和安全：扩展期待 ST class names，用户期待 script-like payloads 被剥离。

## 核心扩展 DOM Anchors

以下 anchors 属于页面契约。

| Selector | ST 角色 | YdlTavern Round 8 角色 |
|---|---|---|
| `#chat` | chat message list | React 渲染为 message list root |
| `.mes` | message item | React 渲染 |
| `.mes_block` | message content block | React 渲染 |
| `.mes_text` | message HTML body | `formatMessage()` + `dangerouslySetInnerHTML` 渲染 |
| `.mes_buttons` | message action area | React 渲染并带 extension slot |
| `.mes_buttons_extra` | extension message buttons | 子树让给 extensions |
| `#extensions_settings` | primary extension settings | empty container 让给 extensions |
| `#extensions_settings2` | secondary extension settings | empty container 让给 extensions |
| `#extensionsMenu` | top-bar extension menu | empty container 让给 extensions |
| `#movingDivs` | movable/floating popups | empty container 让给 extensions |
| `#leftSendForm` | left composer button region | 让出的 extension area |
| `#rightSendForm` | right composer button region | 让出的 extension area |
| `#send_textarea` | input textarea | React-owned control |
| `#send_but` | send button | React-owned control |

让出规则很简单：React 可以创建节点，但不得在 extension-owned anchors 内 reconcile children。

## `globalThis` 上的 Globals

ST 把大量 runtime 作为 globals 或近似 global 的 ESM exports 暴露。Round 8 用 `mountSTGlobals()` 把常用值镜像到 `globalThis` / `window`。

预期页面 globals 包括：

- 带 `libs` 与 `getContext()` 的 `SillyTavern`；
- `eventSource` 与 `event_types`；
- `chat`、`characters`、`this_chid`、`chat_metadata`；
- `extension_settings`、`extension_prompt_types`、`extension_prompt_roles`；
- `groups`、`selected_group`、`name1`、`name2`；
- slash command parser 与 registration helpers；
- save/reload/chat metadata helper functions；
- message formatting 与 substitution helpers；
- generation helpers；
- 已挂载时的 jQuery 与 legacy libraries。

这些 globals 应在 extension modules 运行前安装。

## ESM Exports

许多 ST 扩展 import named exports，而不是直接读 `window`。Round 8 提供 shims，从 `globalThis` re-export live values。

常见模块：

| Module URL | 预期角色 |
|---|---|
| `/script.js` | top-level chat/context/generation globals |
| `/scripts/extensions.js` | extension settings 与 manager helpers |
| `/scripts/events.js` | event bus 与 event type constants |
| `/scripts/st-context.js` | `getContext()` facade |
| `/scripts/group-chats.js` | group chat state |
| `/scripts/secrets.js` | safe secret facade |
| `/scripts/power-user.js` | power-user settings object |

shim files 存在的原因是让浏览器静态 ESM resolution 在扩展代码执行前成功。

## Ownership Boundaries

Round 8 使用三类 ownership：

1. **React-owned** —— React 控制 value 与 children；扩展可以观察，但不应依赖 mutation 持久存在。
2. **React-rendered / extension-ceded** —— React 创建稳定空节点，之后不 reconcile children。
3. **Cooperative** —— React 渲染 wrapper 与默认 controls，同时让出命名 child slot。

`.mes_buttons_extra` 是 cooperative。`#extensions_settings` 是 ceded。`#send_textarea` 是 React-owned。

## 兼容备注

- 如果新扩展期待另一个 ST DOM ID，应把它加成 stable anchor，而不是要求扩展 patch 自己。
- 如果新扩展 import 另一个 ST module URL，优先在该 URL 增加 shim。
- 如果新扩展期待某个 legacy library global，先 audit 依赖，再添加 AGPL-compatible shim 或记录 gap。
- 不要为了 ST 兼容回到 iframe-only hosting；那会破坏页面契约。
