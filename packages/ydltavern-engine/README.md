# YdlTavern Engine（Yggdrasil 子进程能力包）

这是 YdlTavern 引擎的 Yggdrasil 子进程能力包。

当前阶段：深度移植完成，并新增 opt-in 真实模型调用通道。除已有 `world_info.evaluate`、`preset.compile`、`turn.generate`、`turn.swipe/regenerate/continue`、asset import/export、script.eval、extension registry、model.plan_call 之外，新增 20 个深度移植 JSON-RPC capability：

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

## Recent additions

- `model.live_call`：用 ST unified builder 收集设置，再转换成 OpenAI-compatible 或 Anthropic provider-final body，然后通过 subprocess `kernelClient` 调用 Yggdrasil `kernel.v1.outbound.execute`。
- `model.live_call.stream`：用 provider-final streaming body 调用 `kernel.v1.outbound.stream` 读取 SSE chunk，并归一化为 stream frames（delta text、reasoning、tool_calls、final/error/cancelled/timeout）。
- `model.live_realtime`：通过 `kernelClient.openWebSocket` / Yggdrasil `kernel.v1.outbound.websocket.*` 打开 provider WebSocket；OpenAI Realtime 是真实路径，Gemini Live 是 best-effort stub。
- `manifest.yaml` 声明 provider network hosts（OpenAI、DeepSeek、Anthropic、OpenRouter、Gemini）、WEBSOCKET method（OpenAI/Gemini）和 `secret_refs`。
- raw key 不进入 YdlTavern；输入只携带 `secret_ref:store:*`、`secret_ref:project:*` 或 `secret_ref:env:*`，由 Yggdrasil host 解析、脱敏、审计。
- 需要 Yggdrasil live outbound profile（例如 `profiles/forge-with-live-models.example.yaml`）和环境变量（如 `OPENAI_API_KEY`、`DEEPSEEK_API_KEY`、`GEMINI_API_KEY`）；Realtime 还需要 host profile 启用 `outbound.websocket.executor: live`。

WebSocket 边界与 HTTP/SSE 一样严格：YdlTavern 绝不直接 `new WebSocket(...)` 到 provider，必须经 host `openWebSocket` 边界；host 负责 allowed host、`secret_ref` 解析、审计、脱敏、取消和超时。

这仍是 `partial-opt-in`：默认不直接联网，真实 HTTPS 只在 host profile 启用 live outbound 且 secrets 存在时发生。所有 capability 均声明在 `manifest.yaml`。

## 使用

- 构建：`npm run build`
- 类型检查：`npm run typecheck`
- 测试：`npm test`
- 挂到 Yggdrasil host：在 host profile 里 autoload 这个 manifest：`packages/ydltavern-engine/manifest.yaml`

## 后续

下一步是扩大 golden harness 场景、补更多 provider smoke tests，并继续补齐更多 provider-final adapters。

- [C 轨道：引擎核心](../../docs/tracks/C_ENGINE_CORE.md)
