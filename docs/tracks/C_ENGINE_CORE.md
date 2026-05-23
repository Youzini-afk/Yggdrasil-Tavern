# C 轨道：引擎核心

> [English](./C_ENGINE_CORE.en.md) · [中文](./C_ENGINE_CORE.md)

## 范围

把 SillyTavern 的 generation pipeline 在 YdlTavern 重新实现，行为字节级对齐。

包括：

- 26 个 chat completion sources（OpenAI / Claude / Gemini / Mistral / OpenRouter / DeepSeek / xAI / Groq / Cohere / Perplexity / Fireworks / ...）
- 17 个 text completion sources（Ooba / KoboldCpp / vLLM / Aphrodite / Tabby / llama.cpp / Ollama / Mancer / TogetherAI / Featherless / HuggingFace / Generic / ...）
- 80+ 采样参数（含 alias）
- prompt manager 拼装顺序（26 个标识符）
- 上下文构造：preset → 角色描述 → persona → 场景 → 对话示例 → 聊天历史 → author's note → world info → post-history-instructions
- streaming 处理 + 解析每家 backend 不同的流式 chunk 格式
- swipe / regenerate / continue / impersonate / multi-gen / quiet generation
- token 计数（每家 tokenizer）

## ground truth

- `docs/inventory/CONNECTORS_AND_SAMPLERS.raw.md`（连接器 / 采样器 / 流式处理器）
- `docs/inventory/WORLD_INFO_AND_ASSETS.raw.md` 中的 `PRESET_SCHEMA_OPENAI` 和 `PROMPT_MANAGER_IDENTIFIERS`
- `docs/inventory/CORE_EVENTS_AND_COMMANDS.raw.md` 中的 `GENERATE_PIPELINE`

## 交付

- `engine/connectors/` —— 每个 connector 一个适配器，能从 ST preset + Turn 模型构造请求体
- `engine/samplers/` —— 采样参数处理 + per-connector 字段重命名 / 字段裁剪 / 字段限值
- `engine/prompt-builder/` —— 按 ST PromptManager 顺序构造最终 messages 数组
- `engine/streaming/` —— 每家流式 chunk 解析器
- `engine/generate/` —— 高层 Generate 函数，跟 ST 行为对齐
- alignment fixture：拿 ST 真实 preset + 角色卡 + 聊天历史，比对最终 prompt（fake provider 不真出网）

## 对齐策略

最关键的对齐测试：

```text
input:  V2 character card + OpenAI preset + chat history (10 turns) + persona + world info book
output: prompt JSON 字节级 = ST 同版本同输入产出
```

prompt 拼装顺序错一点 ST 用户立刻能感觉到——他们调过的预设按字节顺序敏感。这一项必须严格。

## 依赖

- 模型连接走 Yggdrasil 公开协议（`kernel.v1.outbound.execute` + `official/model-provider-lab`）
- `secret_ref`、HTTPS-only、出站审计、流式生命周期都来自 Yggdrasil
- C 轨道不重写 HTTP 层、不存 API key、不做权限审计

YdlTavern 自己只负责：把 ST preset + Turn 模型翻译成“哪个 provider、什么请求体、怎么解析流”。

## 当前状态

`packages/ydltavern-engine-core` 已有 ST-faithful PromptManager + ChatCompletion + chat/text completion 适配器 + instruct mode + tokenizer registry：

- `prompt-manager-st.ts` —— `Prompt`/`PromptCollection`/`Message`/`MessageCollection`/`ChatCompletion` classes；`preparePromptsForChatCompletion`、`populationInjectionPrompts`、`populateChatHistory`、`populateDialogueExamples`、`squashSystemMessages`；`INJECTION_POSITION` (RELATIVE/ABSOLUTE)、`NAMES_BEHAVIOR`、`EXTENSION_PROMPT_TYPES`、`EXTENSION_PROMPT_ROLES`；12 default prompts (main → worldInfoBefore → personaDescription → charDescription → charPersonality → scenario → enhanceDefinitions → nsfw → worldInfoAfter → dialogueExamples → chatHistory → jailbreak)；injection_trigger filtering；main/jailbreak override with `{{original}}`；group nudge；squash with named/excluded id rules；ChatCompletion `tokenBudget = context - response`。
- `chat-completion-providers.ts` —— `buildChatRequest` 覆盖 25 个 sources，含 provider-specific overrides（O1/GPT-5 max_completion_tokens + system→user + tool stripping、Claude assistant_prefill on continue、Gemini stop≤5×16chars、Cohere top_p clamp、OpenRouter middleout/quantizations、DeepSeek reasoning_effort auto→omit、Grok-3-mini penalties strip、Workers AI top_k cap 50 等）；`applyStreamChunk` 状态机覆盖 OpenAI/Claude/Gemini/Mistral/OpenRouter/DeepSeek delta merge + reasoning + tool_calls + multi-swipe。
- `text-completion-providers.ts` —— `resolveTextGenServer` (mancer/togetherai/infermaticai/dreamgen/openrouter/featherless fixed bases)；15 个 sources（ooba, mancer, vllm, aphrodite, tabby, koboldcpp, togetherai, llamacpp, ollama, infermaticai, dreamgen, openrouter, featherless, huggingface, generic）；ooba/llamacpp/ollama/vllm/aphrodite/mancer-specific samplers；llamacpp/ollama aliasing；HuggingFace top_p clamp；mancer epsilon/eta_cutoff/1000；`applyTextStreamChunk`；Horde polling (MIN_LENGTH=16, MAX_RETRIES=480)。
- `instruct.ts` —— full `InstructTemplate` schema；`formatInstructModeChat` with prefix/suffix selection (first/last variants, system_same_as_user, names_behavior)；`formatInstructModeStoryString`、`formatInstructModeExamples`、`getInstructStoppingSequences` (sequences_as_stop_strings + dedupe + wrap newline prefix)；built-in templates ChatML, Alpaca, Vicuna, Mistral, Llama 3。
- `tokenizers-st.ts` —— `TOKENIZER` enum (NONE/GPT2/OPENAI/LLAMA/NERD/NERD2/MISTRAL/YI/CLAUDE/LLAMA3/GEMMA/JAMBA/QWEN2/COMMAND_R/NEMO/DEEPSEEK/COMMAND_A + API_TEXTGENERATIONWEBUI/API_KOBOLD/BEST_MATCH)；`ENCODE_TOKENIZERS` set；`TOKENIZER_URLS` endpoint table；`getTokenizerBestMatch` heuristics across novel/kobold/textgen/openai/openrouter/cohere/electronhub/chutes/workers_ai/perplexity/groq；`guesstimate` (UTF-8 byte length / 3.35)；`planCountTokensOpenAI`；`TokenCountCache` LRU。
- 仍包含原有 sampler alias normalization、token budget、golden harness、stream frame normalization 与 model boundary plan。

`packages/ydltavern-engine` 的 `preset.compile` 和 `turn.generate` 会透传 PromptManager diagnostics、WI advanced diagnostics、nextState 和 frames；新增 20 个 deep-port JSON-RPC capability。`model.live_call` / `model.live_call.stream` 可在 Yggdrasil live outbound profile 下通过 `kernel.v1.outbound.execute` / `kernel.v1.outbound.stream` 发起 opt-in 真实 provider HTTPS；`model.live_realtime` 可通过 `kernel.v1.outbound.websocket.*` 发起 OpenAI Realtime WebSocket（Gemini Live 为 best-effort stub）。默认 fake generation 仍不出网、不用 raw secret。

仍待完成：扩大 golden harness 覆盖、补更多 tokenizer/source fixture、补齐 provider-specific smoke tests，并把更多 Generate 分支接到 live-call path。

## 不在范围内

- 真自建模型推理引擎（用 Yggdrasil model-provider-lab）
- 自建模型管理 / 计费 / 余额（不做）
- 多模态（图像 / 音频）的 inline 上传——可以走，但作为 sub kind，不污染 prompt builder

## 完成判据

- 每个 connector 在 alignment fixture 下字节级对齐
- 每个采样参数在 `COMPATIBILITY_MATRIX` 升级到 `implemented`
- 流式 token 速度跟 ST 同 backend 不慢
- swipe / regenerate / continue / impersonate 行为跟 ST 一致
