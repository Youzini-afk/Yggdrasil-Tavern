# @ydltavern/surface

Yggdrasil-hosted React surface bundle for YdlTavern. It is not an independent Web/Desktop/App shell; the Yggdrasil shell owns discovery, mounting, permissions, and platform lifecycle.

## Recent additions

- Product UI skeleton: top bar, character rail, chat main area, composer, generation controls, and settings/assets/extensions/dev drawers.
- `react-virtuoso` virtualized chat list instead of diagnostics-style full rendering.
- Built-in dark / light / parchment themes and CSS-variable theme system.
- SettingsPanel tabs: Connection, Sampler, Persona, Theme.
- ExtensionsDrawer displays real loader-st state for enabled/disabled/dependency information.
- QuickReplyBar and mobile responsive layout.

Still partial: complete ST operation flows, theme-file import, screenshot alignment, and performance target validation are not finished.

## Commands

- Typecheck: `npm run typecheck`
- Build: `npm run build`
