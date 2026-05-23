# YdlTavern 端到端集成指南

> [English](./E2E_INTEGRATION.en.md) · [中文](./E2E_INTEGRATION.md)

本指南记录 Round 6 W6 后 YdlTavern surface bundle 如何被 Yggdrasil `clients/web` 消费。它覆盖开发期路径、bundle URL 解析、iframe mount 流程与当前限制。

## Overview

YdlTavern 不提供独立 Web app。`packages/ydltavern-surface` 构建出 browser-ready ESM bundle，Yggdrasil `clients/web` 负责在 Play 页面发现 surface、解析 bundle URL、创建 sandboxed iframe，并通过 public RPC bridge 让 surface 调用 host。

```text
Yggdrasil host (Rust)         clients/web (TS)              YdlTavern surface bundle
┌──────────────────┐         ┌──────────────────┐          ┌──────────────────────┐
│ kernel.v1.surface.* │ ←HTTP→ │ surface-host.ts  │ ←iframe→ │ bundle.mjs           │
│ /rpc /kernel/v1/*   │         │ + bundle resolver│          │ (mount adapters)      │
│ /surface-bundles │ ←──────┘                  │          │                       │
└──────────────────┘ static  └──────────────────┘          └──────────────────────┘
```

## Build steps

YdlTavern surface 的发布构建由 package 内脚本完成：

```bash
npm run build --prefix packages/ydltavern-surface
```

构建产物包括：

- `dist/index.js`：tsc 输出，供类型消费者和 package entry 使用。
- `dist/bundle.mjs`：Vite library mode 输出，浏览器 iframe 可 `import()`。
- `dist/styles/surface.css` 与 `dist/styles/mobile.css`：由 `copy-assets.mjs` 复制。
- `dist/fonts/`：由 `copy-assets.mjs` 从 `@fontsource/noto-sans@5.2.10` 与 `@fontsource/noto-sans-mono@5.2.10` 复制 4 个 Latin subset `.woff2` 字体文件（约 50KB）。

## Bundle URL resolution

`clients/web` 不直接猜测文件系统路径。它通过 bundle resolver 把 `(packageId, surfaceId)` 和 manifest metadata 映射为：

- bundle URL，例如 `/surface-bundles/ydltavern/bundle.mjs`；
- mount export，例如 `mountTavernPlaySurface`。

Round 6 的 demo mapping 仍是硬编码，只覆盖 YdlTavern bundle：

```text
ydltavern/surface → /surface-bundles/ydltavern/bundle.mjs
```

manifest 中每个 contribution 的 `metadata.export_name` 指向对应 mount adapter。

## Vite dev middleware

开发期 `clients/web` 的 Vite server 提供静态路由：

```text
/surface-bundles/ydltavern/bundle.mjs
```

该路由从 sibling YdlTavern 仓库的 `packages/ydltavern-surface/dist/` 读取文件。因此本地调试前必须先在 YdlTavern 仓库运行 surface build。

## Production

生产期还需要 Yggdrasil host 提供真实静态文件路由，把已安装 package 的 bundle、styles 和 fonts 暴露成 same-origin URLs。这个 host static route 属于 Phase C；当前 W6 只证明 `clients/web` 开发路径能挂载 demo bundle。

## Mount flow

1. 用户在 Play 页面点击 YdlTavern surface card 的 **Mount surface**。
2. `main.ts` 根据 package / surface metadata 解析 bundle URL 和 export name，然后调用 `mountSurface()`。
3. `SurfaceHost` 创建 iframe，sandbox 使用 `allow-scripts`。
4. frame bootstrap 加载 stylesheets，dynamic import `bundle.mjs`，读取指定 mount adapter。
5. mount adapter 渲染 React surface；surface 通过 `window.yggHost.callRpc` 发起 RPC。
6. iframe `postMessage` 到 host frame controller；host 转发到 `/rpc`。

## Security boundaries

- iframe sandbox 只允许 `allow-scripts`；不授予 same-origin、forms 或 popups。
- frame CSP 使用 `default-src 'self'; script-src 'self'`。
- bundle 必须是 same-origin URL；开发期由 Vite middleware 提供。
- postMessage RPC 只暴露 public protocol surface，不开放 host privileged methods。
- YdlTavern 只传 `secret_ref`；raw keys 和 outbound 执行仍归 Yggdrasil host 管理。

## Available mount adapters

`@ydltavern/surface` 当前导出 9 个 mount adapter：

1. `mountTavernPlaySurface`
2. `mountTavernSettingsSurface`
3. `mountTavernExtensionsSurface`
4. `mountTavernCharactersSurface`
5. `mountTavernWorldInfoSurface`
6. `mountTavernPersonaSurface`
7. `mountTavernAIResponseConfigSurface`
8. `mountTavernUserSettingsSurface`
9. `mountTavernBackgroundsSurface`

每个 adapter 接收 iframe root element 与 props，返回 unmount 函数，供 SurfaceHost 清理。

## Trying it locally

假设 `Yggdrasil/` 与 `YdlTavern/` 是 sibling 仓库。

1. 启动 Yggdrasil host：

   ```bash
   cargo run -p ygg-cli -- host serve --http 127.0.0.1:8787 --profile profiles/forge-alpha.yaml
   ```

2. 构建 YdlTavern surface：

   ```bash
   npm run build --prefix packages/ydltavern-surface
   ```

3. 在 Yggdrasil 仓库启动 web client：

   ```bash
   npm run dev --prefix clients/web
   ```

4. 打开：

   ```text
   http://127.0.0.1:1420
   ```

5. 进入 Play 页面，在 YdlTavern surface card 上点击 **Mount surface**。

成功后，iframe 中会加载 YdlTavern surface bundle，并显示 Tavern UI。

## Limitations (v0)

- Demo bundle mapping 是硬编码，不是完整 package registry resolver。
- Production 需要 Yggdrasil host 的 package static fileserver route。
- 当前只支持单个 surface outlet；不支持多个 surface 同时挂载。
- 当前 bundle 只包含 Noto Sans / Noto Sans Mono Latin subset；CJK/emoji/更完整 Unicode 覆盖仍需后续字体 subset 策略。
