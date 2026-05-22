# YdlTavern Engine (Yggdrasil subprocess capability package)

This is the Yggdrasil subprocess capability package for the YdlTavern engine.

Current phase: deep-port complete, with an opt-in live model call path added. In addition to existing `world_info.evaluate`, `preset.compile`, `turn.generate`, `turn.swipe/regenerate/continue`, asset import/export, `script.eval`, extension registry, and `model.plan_call`, 20 deep-port JSON-RPC capabilities have been added:

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

## Recent additions

- `model.live_call`: builds the provider request body with `buildChatRequest`, then calls Yggdrasil `kernel.outbound.execute` through the subprocess `kernelClient`.
- `model.live_call.stream`: reads SSE chunks through `kernel.outbound.stream` and normalizes them into stream frames (delta text, reasoning, tool_calls, final/error/cancelled/timeout).
- `model.live_realtime`: opens provider WebSockets through `kernelClient.openWebSocket` / Yggdrasil `kernel.outbound.websocket.*`; OpenAI Realtime is the real path, while Gemini Live is a best-effort stub.
- `manifest.yaml` declares provider network hosts (OpenAI, DeepSeek, Anthropic, OpenRouter, Gemini), WEBSOCKET methods (OpenAI/Gemini), and `secret_refs`.
- Raw keys never enter YdlTavern; inputs carry only `secret_ref`, resolved/redacted/audited by the Yggdrasil host.
- Requires a Yggdrasil live outbound profile (for example `profiles/forge-with-live-models.example.yaml`) and environment variables such as `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, and `GEMINI_API_KEY`; Realtime also requires the host profile to enable `outbound.websocket.executor: live`.

The WebSocket boundary is as strict as HTTP/SSE: YdlTavern never opens a direct provider `new WebSocket(...)`; it must use the host `openWebSocket` boundary. The host owns allowed hosts, `secret_ref` resolution, audit, redaction, cancel, and timeout behavior.

This is still `partial-opt-in`: the package does not directly network by default, and real HTTPS only happens when the host profile enables live outbound and secrets exist. All capabilities are declared in `manifest.yaml`.

## Usage

- Build: `npm run build`
- Typecheck: `npm run typecheck`
- Test: `npm test`
- Load into a Yggdrasil host: autoload this manifest from the host profile: `packages/ydltavern-engine/manifest.yaml`

## Next

Next: expand golden harness scenarios, add more provider smoke tests, and continue converging fake generation lifecycle with the real live-call path.

- [Track C: Engine Core](../../docs/tracks/C_ENGINE_CORE.en.md)
