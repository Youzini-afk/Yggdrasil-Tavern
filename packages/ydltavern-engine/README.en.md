# YdlTavern Engine（Yggdrasil subprocess capability package）

This is the Yggdrasil subprocess capability package for the YdlTavern engine.

Current phase: PromptManager / World Info advanced contract slice. `world_info.evaluate`, `preset.compile`, `turn.generate`, `turn.swipe/regenerate/continue`, and character/world-book imports call this repo's types, engine-core, importers, and st-compat packages, passing through prompt_manager, world_info routing, nextState, and frame diagnostics. There are still no real model calls, no network, and no secrets.

## Usage

- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Test: `npm test`
- Load into a Yggdrasil host: autoload this manifest from the host profile: `packages/ydltavern-engine/manifest.yaml`

## Next

Next: fill in tokenizer budgeting, text-completion routing, provider-specific streaming, and the real model-call boundary. Current fake generation only verifies the contract lifecycle.

- [Track C: Engine Core](../../docs/tracks/C_ENGINE_CORE.md)
