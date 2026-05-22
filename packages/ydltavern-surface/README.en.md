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

## Manifests

This package keeps two manifests for two host layers:

- `manifest.yaml` is the Yggdrasil-compliant package manifest used by the Yggdrasil host and exposed through `kernel.surface.contribution.list` for `ydltavern/play`, `ydltavern/settings`, and `ydltavern/extensions`.
- `surface.manifest.json` is the React-host-side bundle descriptor. It keeps framework hints such as export name, wrapper class, fonts, fixtures, and sample props needed by SurfaceHost when mounting React components.
- Both files coexist for now; they may be merged once Yggdrasil surface-loader semantics settle.
- Each surface contribution in `manifest.yaml` uses `metadata` for React-specific hints needed by SurfaceHost, such as `framework`, `export_name`, and `wrapper_class`.

```yaml
# manifest.yaml — Yggdrasil package manifest
contributes:
  surfaces:
    - id: ydltavern/play
      slot: experience_entry
      ...
```

```json
// surface.manifest.json — React bundle descriptor
{
  "manifest_version": "0.1-draft",
  "surfaces": [...]
}
```
