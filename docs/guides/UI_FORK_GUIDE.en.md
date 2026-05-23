# SillyTavern UI Fork Guide

> [English](./UI_FORK_GUIDE.en.md) · [中文](./UI_FORK_GUIDE.md)

This guide documents how `@ydltavern/surface` forks the SillyTavern UI / layout after Round 6 W-track, and where it intentionally diverges. YdlTavern aims for a familiar Tavern interaction model hosted as Yggdrasil surfaces, not a copy of ST's jQuery monolith.

## Overview

The UI fork covers ST's main shell, drawers, messages, composer, background, and mobile layout. Parity work includes 9 top-bar icon drawers, a centered `Sheld` main column, left/right drawer rails, ST `.mes` message DOM structure, send form, streaming stop button, `#bg1` background layer, ST classic theme JSON import/export, TavernProvider-backed drawer state, and 1000px / 768px mobile breakpoints.

Intentional divergence: React/TypeScript components, Yggdrasil iframe SurfaceHost, `--tavern-*` token names, permission-gated real extension loading, and no jQuery / Bootstrap runtime dependency.

## Slash command coverage

After Round 7, `@ydltavern/st-compat` registers 14 slash-command batches (A-N) in `createSTContextDeep`, with ~150+ command registrations covering 199 ST canonical commands through real implementations, plan-only descriptors, or explicit unsupported sentinels. The added batches are:

- Batch H — Variables/Control/Math (24 commands, all real)
- Batch I — Chat/Messages Extras (21 commands: 8 real + 6 plan-only + 7 unsupported)
- Batch J — Characters/Group/Persona/Tags (17 commands: 11 real + 6 plan-only)
- Batch K — World Info/Lorebook (11 commands: 7 real + 4 plan-only)
- Batch L — Preset/Settings (21 commands: 14 real + 1 plan-only + 6 unsupported)
- Batch M — Extension/Tools (36 commands: 2 real + 4 plan-only + 30 unsupported)
- Batch N — Debug/Dev/Secret (8 commands: 3 real + 5 plan-only)

Plan-only commands return `{ planned: true, action, fields }`; unsupported commands throw `SlashCommandUnsupportedError` with a reason; `/secret-write` accepts only `secret_ref:env:NAME`.

## Design tokens

Styles start in `packages/ydltavern-surface/src/styles/surface.css`. Round 5 added 29 ST-aligned CSS variables, all named `--tavern-*` and scoped under `.ydltavern-surface` / `.tavern-themed-root`; the package does not write to host `:root`.

The tokens cover backgrounds, text, accent colors, chat tint, user/bot message tint, shadow, border, font scale, animation, Sheld width, avatar size, and top/bottom icon sizing. ST `SmartTheme*` / flat JSON fields map to these tokens through `packages/ydltavern-surface/src/components/product/themes/st-theme-importer.ts`.

## ST classic themes

`built-in-themes.ts` now exposes 6 built-in themes:

- YdlTavern native: `dark`, `light`, `parchment`. These are product-native palettes focused on Yggdrasil-style readability.
- ST classic: Dark V 1.0, Azure, Celestial Macaron. They are imported through the ST Theme JSON Importer and preserve ST tint, font scale, chat width, avatar style, timer, and related flags.

The theme picker can show both native and classic themes. Classic themes give longtime ST users a familiar starting point; native themes remain YdlTavern's own design language.

## Theme JSON shape

The importer accepts SillyTavern's flat JSON shape, including `main_text_color`, `italics_text_color`, `blur_tint_color`, `chat_tint_color`, `user_mes_blur_tint_color`, `bot_mes_blur_tint_color`, `shadow_color`, `border_color`, `font_scale`, and `chat_width`.

The exporter converts a `TavernTheme` back to the same flat shape on a best-effort basis. Use cases:

- Import community ST themes into YdlTavern.
- Export YdlTavern themes for ST or other ST-compatible tools.
- Use one JSON shape for theme regression fixtures.

## Shell architecture

Shell code lives in `packages/ydltavern-surface/src/components/shell/`:

- `TopBar`: 9 Font Awesome icon buttons matching ST's top settings bar.
- `DrawerShell`: shared drawer container with backdrop click-to-close.
- `Sheld`: centered 50vw main chat column, matching ST `#sheld` proportions.
- `drawer-rail` layout: 8 drawers on the left, Characters on the right.
- `useDrawers`: a single `openId` state that enforces drawer mutual exclusion; clicking the open icon closes it.

Yggdrasil `clients/web` / Desktop / App shells still own iframe SurfaceHost, navigation, install, permissions, and platform lifecycle. `@ydltavern/surface` is a React component library, not a standalone app.

## 9 drawer surfaces

After Round 6, all 9 ST-aligned drawers are real forms/lists that read and write the same `TavernProvider`:

1. **AI Response Configuration**: presets, sampler matrix, banned tokens, logit bias, streaming.
2. **API Connections**: 19 providers, profile management, status indicator.
3. **Advanced Formatting**: context template, instruct mode, system prompt, stop strings, reasoning, macros.
4. **World Info**: world book list, entry editor (key / secondary key / content / position / depth / probability / order), activation diagnostics.
5. **User Settings**: theme picker, UI preferences, font scale, chat width, persistence.
6. **Backgrounds**: image browser, folders, search, fit mode, auto-select.
7. **Extensions**: installed list, install / refresh.
8. **Persona**: multi-persona list, edit form, settings toggles.
9. **Characters**: library search, group chat hint, create / import / edit / duplicate / export / delete.

State source: sampler, connection, formatting, background display, characters, personas, world books, backgrounds, and selection state all live in `TavernProvider` and persist through schema-versioned localStorage. Drawers no longer use temporary placeholder constants or deferred handlers; provider-backed settings and library entries restore from their own keys after refresh.

## Mount adapters

`@ydltavern/surface` exports 9 mount adapters for Yggdrasil `SurfaceHost` to call after dynamic import:

1. `mountTavernPlaySurface`
2. `mountTavernSettingsSurface`
3. `mountTavernExtensionsSurface`
4. `mountTavernCharactersSurface`
5. `mountTavernWorldInfoSurface`
6. `mountTavernPersonaSurface`
7. `mountTavernAIResponseConfigSurface`
8. `mountTavernUserSettingsSurface`
9. `mountTavernBackgroundsSurface`

Each adapter renders its React surface and returns an unmount function. The `export_name` / `entry.export` fields in `manifest.yaml` and `surface.manifest.json` point at these adapters rather than bare React components. The Vite build emits browser-ready `dist/bundle.mjs`, so an iframe can import it directly.

## Message bubble parity

Message components live in `components/product/Message/`. `MessageBubble` mirrors ST `#message_template` / `.mes` structure:

- `.mes` root with `data-mesid` / `data-is-user` / `data-is-system`.
- `mesAvatarWrapper`, `avatar`, `mesIDDisplay`, `mes_timer`, `tokenCounterDisplay`.
- `ch_name`, `name_text`, `timestamp`, `mes_buttons`, `extraMesButtons`.
- `swipe_left`, right swipe controls, `mes_text`, `mes_reasoning_details`, `mes_media_wrapper`, `mes_bias`.

The edit toolbar provides done / copy / delete / up / down / cancel. The action menu provides copy / edit / delete-like affordances, translate, narrate, branch, checkpoint, hide / unhide. All buttons use `type="button"` and `aria-label`.

## Composer parity

Composer code lives in `components/product/Composer/`:

- `SendForm`: options, continue, impersonate, textarea, send button; Enter sends and Shift+Enter inserts a newline.
- `StreamingIndicator`: animated dots, `#mes_stop` stop button, `aria-live` status.
- `BackgroundLayer`: fixed `#bg1` equivalent with cover / contain / tile and overlay support.

## Mobile responsive

`src/styles/mobile.css` is imported from `surface.css`. It follows ST `mobile-styles.css`:

- 1000px primary breakpoint, matching ST mobile behavior.
- 768px secondary breakpoint for narrower portrait phones.
- Drawers become full-screen sheets, with a stronger backdrop.
- Drawer icons are 36×36+, message buttons 32×32+, composer buttons 40×40+.
- Drag handles / pin handles are hidden on mobile.
- `send_textarea` uses 16px to avoid iOS focus zoom.
- `env(safe-area-inset-bottom)` preserves safe-area spacing.

## Accessibility additions

YdlTavern adds accessibility hardening beyond ST parity:

- `prefers-reduced-motion: reduce` disables transitions / animations.
- `forced-colors: active` adds explicit borders / outlines.
- Drawer, message, and composer icon buttons have `aria-label` and explicit `type`.
- `StreamingIndicator` uses `role="status"` / `aria-live="polite"`.

## What diverges from ST

- Token naming: `--tavern-*`, instead of copying ST `--SmartTheme*` directly.
- Component model: JSX / React components; ST uses jQuery + HTML templates.
- Bundle shape: Vite browser-ready ESM surface bundle; no jQuery, no Bootstrap.
- Hosting: mounted through Yggdrasil iframe SurfaceHost; ST is a monolithic SPA.
- Extension safety: real extension loading requires the `realExtensionLoad` permission gate; ST loads extensions unconditionally.

## Surface manifest exposure

`packages/ydltavern-surface/manifest.yaml` and `surface.manifest.json` now declare 9 surface contributions: the original `ydltavern/play`, `ydltavern/settings`, `ydltavern/extensions`, plus `ydltavern/character`, `ydltavern/world-info`, `ydltavern/persona`, `ydltavern/ai-response-config`, `ydltavern/user-settings`, and `ydltavern/backgrounds`.

The Yggdrasil host can discover these through `kernel.v1.surface.contribution.list` and mount any of them via SurfaceHost. `settings` remains a generic catch-all; the 6 new surfaces are specific entries for V5 drawers.
