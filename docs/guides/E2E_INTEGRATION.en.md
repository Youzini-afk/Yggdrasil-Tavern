# YdlTavern E2E Integration Guide

> [English](./E2E_INTEGRATION.en.md) · [中文](./E2E_INTEGRATION.md)

This guide documents how the YdlTavern surface bundle is consumed by Yggdrasil `clients/web` after Round 6 W6. It covers the development path, bundle URL resolution, iframe mount flow, and current limitations.

## Overview

YdlTavern does not ship an independent web app. `packages/ydltavern-surface` builds a browser-ready ESM bundle, while Yggdrasil `clients/web` discovers the surface on the Play page, resolves the bundle URL, creates a sandboxed iframe, and exposes the public RPC bridge to the surface.

```text
Yggdrasil host (Rust)         clients/web (TS)              YdlTavern surface bundle
┌──────────────────┐         ┌──────────────────┐          ┌──────────────────────┐
│ kernel.surface.* │ ←HTTP→ │ surface-host.ts  │ ←iframe→ │ bundle.mjs           │
│ /rpc /kernel/*   │         │ + bundle resolver│          │ (mount adapters)      │
│ /surface-bundles │ ←──────┘                  │          │                       │
└──────────────────┘ static  └──────────────────┘          └──────────────────────┘
```

## Build steps

The YdlTavern surface release build is produced by the package script:

```bash
npm run build --prefix packages/ydltavern-surface
```

The build outputs are:

- `dist/index.js`: tsc output for type consumers and the package entry.
- `dist/bundle.mjs`: Vite library-mode output that browser iframes can `import()`.
- `dist/styles/surface.css` and `dist/styles/mobile.css`: copied by `copy-assets.mjs`.
- `dist/fonts/`: copied by `copy-assets.mjs` from `.woff2` files in `public/fonts/`. In a development environment without local Noto Sans source files, this directory may be empty, but the CSS paths and copy step are fixed.

## Bundle URL resolution

`clients/web` does not guess filesystem paths directly. It uses the bundle resolver to map `(packageId, surfaceId)` plus manifest metadata to:

- a bundle URL, for example `/surface-bundles/ydltavern/bundle.mjs`;
- a mount export, for example `mountTavernPlaySurface`.

The Round 6 demo mapping is still hardcoded and only covers the YdlTavern bundle:

```text
ydltavern/surface → /surface-bundles/ydltavern/bundle.mjs
```

Each contribution's `metadata.export_name` in the manifest points at its mount adapter.

## Vite dev middleware

During development, the `clients/web` Vite server exposes a static route:

```text
/surface-bundles/ydltavern/bundle.mjs
```

The route reads files from the sibling YdlTavern repository at `packages/ydltavern-surface/dist/`. Build the surface package in the YdlTavern repo before starting local integration testing.

## Production

Production still needs a real Yggdrasil host static route that exposes installed package bundles, styles, and fonts as same-origin URLs. That host static route is deferred to Phase C; W6 only proves the `clients/web` development path can mount the demo bundle.

## Mount flow

1. The user clicks **Mount surface** on a YdlTavern surface card in the Play page.
2. `main.ts` resolves the bundle URL and export name from package / surface metadata, then calls `mountSurface()`.
3. `SurfaceHost` creates an iframe with `sandbox="allow-scripts"`.
4. The frame bootstrap loads stylesheets, dynamically imports `bundle.mjs`, and reads the selected mount adapter.
5. The mount adapter renders the React surface; the surface calls `window.yggHost.callRpc` for RPC.
6. The iframe sends `postMessage` to the host frame controller; the host forwards the call to `/rpc`.

## Security boundaries

- The iframe sandbox only grants `allow-scripts`; it does not grant same-origin, forms, or popups.
- The frame CSP uses `default-src 'self'; script-src 'self'`.
- The bundle must use a same-origin URL; the Vite middleware provides that URL during development.
- postMessage RPC is limited to the public protocol surface and does not expose privileged host methods.
- YdlTavern passes only `secret_ref`; raw keys and outbound execution remain owned by the Yggdrasil host.

## Available mount adapters

`@ydltavern/surface` currently exports 9 mount adapters:

1. `mountTavernPlaySurface`
2. `mountTavernSettingsSurface`
3. `mountTavernExtensionsSurface`
4. `mountTavernCharactersSurface`
5. `mountTavernWorldInfoSurface`
6. `mountTavernPersonaSurface`
7. `mountTavernAIResponseConfigSurface`
8. `mountTavernUserSettingsSurface`
9. `mountTavernBackgroundsSurface`

Each adapter receives the iframe root element plus props and returns an unmount function for SurfaceHost cleanup.

## Trying it locally

Assume `Yggdrasil/` and `YdlTavern/` are sibling repositories.

1. Start the Yggdrasil host:

   ```bash
   cargo run -p ygg-cli -- host serve --http 127.0.0.1:8787 --profile profiles/forge-alpha.yaml
   ```

2. Build the YdlTavern surface:

   ```bash
   npm run build --prefix packages/ydltavern-surface
   ```

3. Start the web client from the Yggdrasil repo:

   ```bash
   npm run dev --prefix clients/web
   ```

4. Open:

   ```text
   http://127.0.0.1:1420
   ```

5. Navigate to Play and click **Mount surface** on a YdlTavern surface card.

If successful, the iframe loads the YdlTavern surface bundle and renders the Tavern UI.

## Limitations (v0)

- The demo bundle mapping is hardcoded rather than a full package registry resolver.
- Production needs a Yggdrasil host package static-fileserver route.
- Only one surface outlet is supported; multiple simultaneously mounted surfaces are not supported yet.
- If the development environment does not have real Noto Sans `.woff2` files, CSS declares the self-hosted paths and falls back to Inter / system fonts; offline production bundles must add the font files under `public/fonts/`.
