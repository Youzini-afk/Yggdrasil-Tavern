# YdlTavern Engine（Yggdrasil subprocess capability package）

This is the Yggdrasil subprocess capability package for the YdlTavern engine.

Current phase: contract slice. `preset.compile`, `turn.generate`, `turn.swipe/regenerate/continue`, and character/world-book imports call this repo's types, engine-core, importers, and st-compat packages. There are still no real model calls, no network, and no secrets.

## Usage

- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Test: `npm test`
- Load into a Yggdrasil host: autoload this manifest from the host profile: `packages/ydltavern-engine/manifest.yaml`

## Next

Next: bring world info / persona / instruct into the prompt-critical path. Current fake generation only verifies the contract lifecycle.

- [Track C: Engine Core](../../docs/tracks/C_ENGINE_CORE.md)
