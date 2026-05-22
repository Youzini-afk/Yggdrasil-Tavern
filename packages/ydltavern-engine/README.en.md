# YdlTavern Engine（Yggdrasil subprocess capability package）

This is the Yggdrasil subprocess capability package for the YdlTavern engine.

Current phase: main capability-surface contract slice. `world_info.evaluate`, `preset.compile`, `turn.generate`, `turn.swipe/regenerate/continue`, asset import/export, script.eval, extension registry/loader plans, and model.plan_call call this repo's types, engine-core, importers, st-compat, and extensions packages, passing through prompt, WI, token, stream, extension, and model-boundary diagnostics. There are still no real model calls, no network, and no raw secrets.

## Usage

- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Test: `npm test`
- Load into a Yggdrasil host: autoload this manifest from the host profile: `packages/ydltavern-engine/manifest.yaml`

## Next

Next: fill in real tokenizer/golden harnesses, more slash commands, real extension-JS sandboxing, and live model calls through Yggdrasil public protocol. Current fake generation only verifies the contract lifecycle.

- [Track C: Engine Core](../../docs/tracks/C_ENGINE_CORE.md)
