# YdlTavern E2E Integration Guide

> [English](./E2E_INTEGRATION.en.md) · [中文](./E2E_INTEGRATION.md)

This guide documents how the YdlTavern surface bundle is consumed by Yggdrasil `clients/web`. It covers the development path, installed-project path, bundle URL resolution, iframe mount flow, and current limitations.

## Overview

YdlTavern does not ship an independent web app. `packages/ydltavern-surface` builds a browser-ready ESM bundle, while Yggdrasil `clients/web` discovers the surface on the Play page, resolves the bundle URL, creates a sandboxed iframe, and exposes the public RPC bridge to the surface.

```text
Yggdrasil host (Rust)         clients/web (TS)              YdlTavern surface bundle
┌──────────────────┐         ┌──────────────────┐          ┌──────────────────────┐
│ kernel.v1.surface.* │ ←HTTP→ │ surface-host.ts  │ ←iframe→ │ bundle.mjs           │
│ /rpc /kernel/v1/*   │         │ + bundle resolver│          │ (mount adapters)      │
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
- `dist/fonts/`: copied by `copy-assets.mjs` from `@fontsource/noto-sans@5.2.10` and `@fontsource/noto-sans-mono@5.2.10` as 4 Latin-subset `.woff2` font files (~50KB).

## Bundle URL resolution

`clients/web` does not guess filesystem paths directly. It uses the bundle resolver to map `(packageId, surfaceId)` plus manifest metadata to:

- a bundle URL, for example development `/surface-bundles/ydltavern/bundle.mjs`, or installed-project `/surface-bundles/projects/<project_id>/bundle.mjs`;
- a mount export, for example `mountTavernPlaySurface`.

The sibling-repo development path usually resolves to:

```text
ydltavern/surface → /surface-bundles/ydltavern/bundle.mjs
```

After `yg install` installs YdlTavern as a native project, the host serves static bundle files from the project dist and the resolved URL uses the project namespace:

```text
ydltavern/play → /surface-bundles/projects/<project_id>/bundle.mjs
```

Each contribution's `metadata.export_name` in the manifest points at its mount adapter.

## Vite dev middleware

During development, the `clients/web` Vite server exposes a static route:

```text
/surface-bundles/ydltavern/bundle.mjs
```

The route reads files from the sibling YdlTavern repository at `packages/ydltavern-surface/dist/`. Build the surface package in the YdlTavern repo before starting local integration testing.

## Installed project path

Installed YdlTavern is a `yggdrasil_native` project. `yg install` copies source into the store, resolves engine/surface package manifests, writes profile autoload entries, registers the project, and copies surface dist. After `host serve --profile <data-dir>/profiles/<profile>.yaml` loads those manifests, it exposes the project bundle, styles, and fonts as same-origin static URLs:

```text
/surface-bundles/projects/<project_id>/bundle.mjs
/surface-bundles/projects/<project_id>/styles/surface.css
/surface-bundles/projects/<project_id>/fonts/...
```

`surface_bundle` is a static browser bundle. It is not the engine execution entry and does not use the wasm sentinel.

## Mount flow

1. The user clicks **Play** on the installed YdlTavern project in Home; development pages may also mount a surface card manually.
2. `main.ts` resolves the bundle URL and export name from package / surface metadata, then calls `mountSurface()`.
3. `SurfaceHost` creates an iframe with `sandbox="allow-scripts"`.
4. The frame bootstrap loads stylesheets, dynamically imports `bundle.mjs`, and reads the selected mount adapter.
5. The mount adapter renders the React surface; the surface calls `window.yggHost.callRpc` for RPC.
6. The iframe sends `postMessage` to the host frame controller; the host forwards the call to `/rpc`.

## Security boundaries

- The iframe sandbox only grants `allow-scripts`; it does not grant same-origin, forms, or popups.
- The frame CSP uses `default-src 'self'; script-src 'self'`.
- The bundle must use a same-origin URL; the Vite middleware provides that URL during development.
- postMessage RPC is limited to the public protocol surface and does not expose privileged host methods; callable capabilities are constrained precisely by typed `allowed_capability_ids` in manifest/metadata plus the host allowlist.
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

5. Click **Play** on the YdlTavern project in Home; development pages may also click **Mount surface** on a surface card.

If successful, the iframe loads the YdlTavern surface bundle and renders the Tavern UI.

## Limitations

- Only one surface outlet is supported; multiple simultaneously mounted surfaces are not supported yet.
- The current bundle includes only the Noto Sans / Noto Sans Mono Latin subset; CJK/emoji/broader Unicode coverage still needs a future font-subset strategy.
- Cross-origin marketplace bundles still need allowlists, integrity pins, version pins, and audit metadata; the default path remains same-origin.
