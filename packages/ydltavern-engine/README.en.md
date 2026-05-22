# YdlTavern Engine (Yggdrasil subprocess capability package)

This is the Yggdrasil subprocess capability package for the YdlTavern engine.

Current phase: deep-port complete. In addition to existing `world_info.evaluate`, `preset.compile`, `turn.generate`, `turn.swipe/regenerate/continue`, asset import/export, `script.eval`, extension registry, and `model.plan_call`, 20 deep-port JSON-RPC capabilities have been added:

- `prompt.manager.compile` — PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages
- `world_info.route` — 8-bucket routing + AN patch + atDepth merge + outlets
- `world_info.match_keys` — regex/keyword boundary matching + selectiveLogic
- `provider.chat.build_request` — 25 chat completion source request shapes with provider-specific overrides
- `provider.text.build_request` — 15 text completion source request shapes with backend-specific samplers
- `provider.text.plan_horde` — Horde polling plan (MIN_LENGTH=16, MAX_RETRIES=480)
- `instruct.format_chat` — full InstructTemplate + formatInstructModeChat + prefix/suffix selection
- `instruct.stopping_sequences` — sequences_as_stop_strings + dedupe + newline prefix wrap
- `tokenizer.best_match` — getTokenizerBestMatch heuristics across 10+ provider families
- `tokenizer.guesstimate` — UTF-8 byte length / 3.35 approximation
- `script.macro.expand` — substituteSTMacrosDeep with full ST macro registry + recursive expansion + PickState
- `extension.regex.apply_st` — getRegexedString with placement filter + depth gating + capture groups + RegexProvider LRU
- `extension.loader.parse_manifest` — ST manifest schema parsing with validation + unknown-field warnings
- `extension.loader.plan_activate_all` — isActivationEligible + sortByActivationOrder + buildLoadPlan + progressive dependency tracking
- `extension.caption.plan` — 4 caption sources + planCaption with template substitution
- `extension.tts.plan_narration` — 27 TTS providers + selectTtsSegments + planTtsNarration
- `extension.translate.plan` — 9 translate providers + shouldTranslateMessage auto_mode
- `extension.connection_profile.snapshot` — 18 ConnectionProfile fields snapshot
- `extension.connection_profile.apply_plan` — applyConnectionProfilePlan
- `extension.sd.process_triggers` — stable-diffusion trigger processor with character/scenery patterns

There are still no real model calls, no network, and no raw secrets. All capabilities are declared in `manifest.yaml`.

## Usage

- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Test: `npm test`
- Load into a Yggdrasil host: autoload this manifest from the host profile: `packages/ydltavern-engine/manifest.yaml`

## Next

Next: byte-level golden harnesses, real tokenizer binaries via wasm, real extension-JS sandboxing, and live model calls through Yggdrasil public protocol. Current fake generation only verifies the contract lifecycle.

- [Track C: Engine Core](../../docs/tracks/C_ENGINE_CORE.en.md)
