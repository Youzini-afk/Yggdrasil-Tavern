# Round 8 扩展 Fork 调研

> [English](./EXTENSION_FORK_RESEARCH.en.md) · [中文](./EXTENSION_FORK_RESEARCH.md)

本文归档 Round 8 调研结论。临时报告曾写在 `/tmp/opencode` 下；此长期版本根据 plan、实现 commits 与兼容文档整理最终决策。

## 范围

Round 8 要回答的问题是：YdlTavern 应继续把 ST 扩展当成不可信 sandbox script，还是成为真正的 ST DOM fork。答案是：无需修改运行 ST 扩展，需要 same-window host。

## 三个 Audit 维度

调研合并了三个维度：

1. **ST 源码契约 audit** —— SillyTavern 实际向扩展暴露什么。
2. **YdlTavern surface gap audit** —— Round 8 前 React shell 缺什么。
3. **Library 与 rendering landscape** —— 哪些 markdown/sanitizer/runtime 选择能保持 ST 行为。

结果形成了 Y-track 工作：formatting pipeline、DOM territory cession、window globals bootstrap、ESM URL shims、Vite middleware 与真实扩展 smoke tests。

## ST 源码契约

ST 源码 audit 发现，扩展依赖的是广义 ambient environment，而不是窄 plugin API：

- `script.js` 中的 `messageFormatting()` 执行 regex hooks、引号/代码保护、showdown render、DOMPurify sanitize 与后处理。
- `chats.js` 配置 DOMPurify hooks，修改 links、class names、media elements 与 custom style blocks。
- 扩展代码从 `script.js`、`scripts/extensions.js`、`scripts/events.js` 等文件 import 顶层值。
- 扩展代码也读取 `window.SillyTavern`、`eventSource`、`chat`、`characters`、`extension_settings`、jQuery 与 legacy libraries。
- 扩展 UI 假设存在 `#chat`、`#extensions_settings`、`#extensionsMenu`、`#movingDivs` 等具体 DOM IDs。

重要结论：契约不只是 TypeScript 形状的 API 调用，而是由 globals、DOM、import paths 与开放访问组成的页面级契约。

## YdlTavern Gap Audit

Round 8 前，YdlTavern 已有大量 ST runtime 深移植：`getContext()`、`eventSource`、slash commands、macro engine、loader planning 与 QuickJS sandbox tests。但 React surface 还没有呈现与 ST 相同的页面形状。

主要缺口包括：

- `.mes_text` 以普通 React text 渲染，而不是 ST-formatted sanitized HTML。
- 缺少 `#chat` 和若干 extension anchors。
- extension settings panels 仍由 React 拥有，而不是让给 jQuery-style mutation。
- ST globals 存在于 compatibility modules 或 sandbox bridges 中，而不是挂在真实 `globalThis` 页面上。
- `/script.js`、`/scripts/extensions.js` 等标准 ST ESM URLs 缺失。
- smoke tests 更偏 synthetic sandbox loading，而不是真实 same-window bootstrap 行为。

Round 8 为 Y-track 关闭了这些缺口。

## Library 与 Rendering Landscape

Rendering audit 比较了 markdown 与 sanitizer 选择。ST 的可观察行为来自 `showdown` 加 DOMPurify hooks，而不是通用 markdown renderer。

因此 YdlTavern 使用：

- 带 ST-aligned options 与 extensions 的 `showdown`；
- 带 ST-shaped hook behavior 的 DOMPurify；
- 必要时显式处理 style-tag encode/decode；
- markdown 前、sanitize 前与 render 后的 formatting hooks。

`marked`、`markdown-it` 或 React markdown components 等替代方案没有用于 Round 8，因为它们会产出不同 HTML tree，并迫使我们维护不断增长的兼容 patch 层。

## 为什么选择 Same-window React + DOM Cession

Iframe sandboxing 不是 ST 扩展兼容的正确默认。许多社区扩展假设：

- 同步访问 `window` globals；
- 直接对 host document 做 jQuery selectors；
- 修改 extension settings panels 与 message button slots；
- 在 page runtime 中使用 localStorage、IndexedDB、Worker、WASM 与 fetch；
- relative ESM imports 能解析到 ST 的 URL layout。

如果每个扩展放进 iframe，几乎所有操作都需要 async bridge，扩展也必须重写或包裹。这会创造一个新的扩展平台，而不是 fork-compatible host。

最终模型是：

- React 渲染产品 shell 与 ST anchors；
- 明确 DOM territories 让给 extension mutation；
- React 继续拥有 `#send_textarea`、`#send_but` 等有状态产品 controls；
- extension callbacks 做错误隔离，而不是权限隔离。

这匹配 ST 的信任模型，也最大化兼容。

## 为什么直接集成 Showdown + DOMPurify

`messageFormatting()` 是高频兼容边界。扩展和用户会注意到很小的 HTML 差异。

选择直接集成的原因：

- ST 使用的 showdown options 会影响 underscores、tables、image dimensions、emoji 与 line breaks；
- ST 的 DOMPurify hooks 实现 link target/rel、class prefixing、media allow-list 与 custom style handling；
- React markdown renderer 会把 markdown 转成 React element tree，而不是相同 HTML string contract；
- sanitizer 差异同时可能是安全差异与兼容差异；
- 测试可以断言 YdlTavern pipeline 的精确 HTML 输出。

这不表示每个 ST 边角都已全域证明，但实现走的是同一条架构路径。

## 为什么在标准 URL 放 ESM Shim 文件

曾考虑 runtime injection，但它不能作为主要机制。ST 扩展常包含静态 imports：

```js
import { eventSource } from '../../../script.js';
import { extension_settings } from '../../extensions.js';
```

浏览器会在扩展代码执行前解析这些 imports。运行时注入 global 不能满足缺失的 module URL。

标准 URL shim 文件直接解决问题：

- `/script.js` 从 `globalThis` 导出 live values；
- `/scripts/extensions.js` 导出 extension manager values；
- `/scripts/events.js`、`/scripts/st-context.js`、`/scripts/group-chats.js`、`/scripts/secrets.js`、`/scripts/power-user.js` 补齐常见 import targets；
- extension-relative imports 保持不变。

开发期使用 Vite middleware。生产期使用 host static route。

## 信任模型决策

Round 8 有意采用 ST 的 same-window extension 信任模型：

- 无每扩展权限弹窗；
- 无 capability 授予 manifest；
- 无 iframe boundary；
- 社区策展与用户自行判断；
- 未来 Activity Drawer 提供诊断透明性。

这不比 ST 更弱；它就是同一模型。它也是不重写社区扩展即可兼容的唯一模型。

## 已实现的 Y-track 输出

调研落地为以下长期输出：

- 使用 showdown + DOMPurify + hooks 的 ST-compatible formatting pipeline。
- React shell 渲染 ST DOM anchors。
- 对 extension-owned containers 明确 jQuery let-go zones。
- 用 `mountSTGlobals()` 挂载页面级 globals。
- 在标准 ST URL layout 提供 ESM shim files。
- Vite middleware 在开发期提供这些 URL。
- BME 与 shujuku bootstrap 路径的真实扩展 smoke tests。

## 后续工作

Round 9 应在不改变兼容承诺的前提下继续推进：

- `/scripts/extensions/<id>/` 的生产 extension hosting route；
- Activity Drawer 展示透明 extension audit signals；
- 随真实扩展暴露继续补 legacy library shims；
- 为具体社区扩展维护兼容记录。
