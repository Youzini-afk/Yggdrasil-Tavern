# YdlTavern Engine（Yggdrasil 子进程能力包）

这是 YdlTavern 引擎的 Yggdrasil 子进程能力包。

当前阶段：深度移植完成。除已有 `world_info.evaluate`、`preset.compile`、`turn.generate`、`turn.swipe/regenerate/continue`、asset import/export、script.eval、extension registry、model.plan_call 之外，新增 20 个深度移植 JSON-RPC capability：

- `prompt.manager.compile` —— PromptManager preparePrompts + ChatCompletion budget + populationInjection + populateChatHistory + populateDialogueExamples + squashSystemMessages
- `world_info.route` —— 8 bucket routing + AN patch + atDepth merge + outlets
- `world_info.match_keys` —— regex/keyword boundary matching + selectiveLogic
- `provider.chat.build_request` —— 25 chat completion source request shapes with provider-specific overrides
- `provider.text.build_request` —— 15 text completion source request shapes with backend-specific samplers
- `provider.text.plan_horde` —— Horde polling plan (MIN_LENGTH=16, MAX_RETRIES=480)
- `instruct.format_chat` —— full InstructTemplate + formatInstructModeChat + prefix/suffix selection
- `instruct.stopping_sequences` —— sequences_as_stop_strings + dedupe + newline prefix wrap
- `tokenizer.best_match` —— getTokenizerBestMatch heuristics across 10+ provider families
- `tokenizer.guesstimate` —— UTF-8 byte length / 3.35 approximation
- `script.macro.expand` —— substituteSTMacrosDeep with full ST macro registry + recursive expansion + PickState
- `extension.regex.apply_st` —— getRegexedString with placement filter + depth gating + capture groups + RegexProvider LRU
- `extension.loader.parse_manifest` —— ST manifest schema parsing with validation + unknown-field warnings
- `extension.loader.plan_activate_all` —— isActivationEligible + sortByActivationOrder + buildLoadPlan + progressive dependency tracking
- `extension.caption.plan` —— 4 caption sources + planCaption with template substitution
- `extension.tts.plan_narration` —— 27 TTS providers + selectTtsSegments + planTtsNarration
- `extension.translate.plan` —— 9 translate providers + shouldTranslateMessage auto_mode
- `extension.connection_profile.snapshot` —— 18 ConnectionProfile fields snapshot
- `extension.connection_profile.apply_plan` —— applyConnectionProfilePlan
- `extension.sd.process_triggers` —— stable-diffusion trigger processor with character/scenery patterns

仍无真实模型调用、无网络、无 raw secret。所有 capability 均声明在 `manifest.yaml`。

## 使用

- 构建：`npm run build`
- 类型检查：`npm run typecheck`
- 测试：`npm test`
- 挂到 Yggdrasil host：在 host profile 里 autoload 这个 manifest：`packages/ydltavern-engine/manifest.yaml`

## 后续

下一步是字节级 golden harness、真实 tokenizer binaries via wasm、真实扩展 JS sandbox 和通过 Yggdrasil public protocol 的真实模型调用；当前 fake generation 只验证 contract 生命周期。

- [C 轨道：引擎核心](../../docs/tracks/C_ENGINE_CORE.md)
