# 消息格式化管线

> [English](./MESSAGE_FORMATTING_PIPELINE.en.md) · [中文](./MESSAGE_FORMATTING_PIPELINE.md)

本文记录 YdlTavern Round 8 对 ST-style `messageFormatting()` 的实现。

## 目标

SillyTavern 扩展和主题期待消息正文是 `.mes_text` 内的 HTML。Round 8 前，YdlTavern 主要把消息作为 React text 渲染。Round 8 把 surface 移到与 ST 对齐的 formatted HTML pipeline。

## 源码位置

实现位于：

```text
packages/ydltavern-surface/src/formatting/
  converter.ts
  sanitize.ts
  style-tags.ts
  message-formatting.ts
  hooks.ts
  index.ts
```

React 在 message bubble 渲染路径消费它：`.mes_text` 使用 `formatMessage()` 产物通过 `dangerouslySetInnerHTML` 填充。

## 管线

YdlTavern 管线遵循 ST 顺序：

```text
input text
  → preMarkdown hooks
  → ST markdown preparation
  → showdown conversion
  → preSanitize hooks
  → DOMPurify sanitize and hooks
  → style tag decode / class normalization
  → 返回 HTML string
  → React 插入 .mes_text
  → postRender hooks 以 DOM node 运行
```

重要契约是扩展观察到与 ST 同类的输出：稳定 `.mes_text` 节点中的 sanitized HTML。

## Showdown 层

Converter 使用 showdown，因为 ST 使用 showdown。配置镜像审计到的 ST options：

- emoji；
- literal mid-word underscores；
- image dimensions；
- tables；
- underline；
- simple line breaks；
- strikethrough；
- disabled forced four-space indented sublists。

YdlTavern 还保留 ST-compatible markdown exclusion 与 underscore 行为。未来 markdown 行为变更应先与 ST 输出比较，再接受。

## Sanitizer 层

Sanitizer 使用 DOMPurify，因为 ST 使用 DOMPurify。Sanitizer 不是通用后处理；它的 hooks 是兼容性的一部分。

关键行为：

- 剥离 script-like payloads 与 unsafe attributes；
- 保持与 ST 安全属性一致的 link 行为；
- 用 ST `custom-` 行为 prefix 普通 CSS classes，同时保留已知 class families；
- 允许受控 custom style 路径；
- 把 decoded style selectors scoped 到 `.mes_text`；
- 只通过审计 allow-list 保留 media。

安全敏感的 sanitizer 变更应同时按安全变更和兼容变更 review。

## Hooks

Round 8 在主要阶段周围暴露 formatting hooks：

- `preMarkdown`：markdown 前的 text-level extension transformations；
- `preSanitize`：DOMPurify 前的 HTML-level transformations；
- `postRender`：React 插入消息正文后的 DOM-level callbacks。

Hook failure 不应破坏整个 render path。应捕获并报告。

## 与 ST 的差异

预期差异应尽量少。已知差异主要是实现形态而不是策略：

- YdlTavern 在 React shell 中运行，因此插入由 React 通过 `dangerouslySetInnerHTML` 完成。
- Formatting 实现被拆成 TypeScript 模块，而不是放在一个大型 `script.js` 中。
- 某些罕见 ST legacy library interactions 可能仍需在真实扩展暴露后补 shim。
- 测试覆盖是显式 package-local 测试，而不是依赖手工 UI 检查。

用户可见契约应保持 ST-like：markdown 输入，sanitized `.mes_text` HTML 输出。

## React 边界

React 拥有 HTML string 插入的时刻。插入后：

- `.mes_text` 带 ST-compatible classes 存在；
- post-render hooks 可以检查或修改该节点；
- `.mes_buttons_extra` 等 extension-owned sibling slots 不被 React reconcile；
- 如果 YdlTavern state 变化，React 可能重渲该消息，因此持久 extension UI 应使用让出的 slots，而不是无协调地修改 core text content。

## 测试

Round 8 增加了 surface tests，覆盖：

- showdown configuration；
- sanitizer XSS vectors；
- style tag prefixing；
- end-to-end message formatting；
- hook registration and removal；
- `.mes_text` 内 HTML rendering。

Round 8 收尾记录的 `ydltavern-surface` 测试数为 88 passing tests。

## 维护规则

- 优先匹配 ST 源码行为，而不是发明更干净的 markdown abstraction。
- Sanitizer hooks 保持接近审计到的 ST 行为。
- 对任何扩展报告的 formatting 差异增加 regression tests。
- 把 `.mes_text` 当作 extension-facing ABI。
- 除非兼容层证明输出等价，否则不要用 React markdown 替换此路径。
