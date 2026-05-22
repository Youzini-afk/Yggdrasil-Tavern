# C Track: Engine Core

> [English](./C_ENGINE_CORE.en.md) · [中文](./C_ENGINE_CORE.md)

## Scope

Reimplement SillyTavern's generation pipeline in YdlTavern with byte-level behavior alignment.

Includes:

- 26 chat completion sources (OpenAI / Claude / Gemini / Mistral / OpenRouter / DeepSeek / xAI / Groq / Cohere / Perplexity / Fireworks / ...)
- 17 text completion sources (Ooba / KoboldCpp / vLLM / Aphrodite / Tabby / llama.cpp / Ollama / Mancer / TogetherAI / Featherless / HuggingFace / Generic / ...)
- 80+ sampling parameters (including aliases)
- prompt manager assembly order (26 identifiers)
- Context construction: preset → character description → persona → scenario → dialogue examples → chat history → author's note → world info → post-history-instructions
- Streaming handling + parsing each backend's different streaming chunk format
- swipe / regenerate / continue / impersonate / multi-gen / quiet generation
- Token counting (each provider's tokenizer)

## Ground truth

- `docs/inventory/CONNECTORS_AND_SAMPLERS.raw.md` (connectors / samplers / streaming handlers)
- `PRESET_SCHEMA_OPENAI` and `PROMPT_MANAGER_IDENTIFIERS` in `docs/inventory/WORLD_INFO_AND_ASSETS.raw.md`
- `GENERATE_PIPELINE` in `docs/inventory/CORE_EVENTS_AND_COMMANDS.raw.md`

## Deliverables

- `engine/connectors/` — one adapter per connector, able to construct request bodies from ST preset + Turn model
- `engine/samplers/` — sampling parameter handling + per-connector field renaming / field trimming / field limits
- `engine/prompt-builder/` — construct final messages array in ST PromptManager order
- `engine/streaming/` — streaming chunk parser for each provider
- `engine/generate/` — high-level Generate function aligned with ST behavior
- Alignment fixture: use real ST preset + character card + chat history, compare final prompt (fake provider, no real network)

## Alignment strategy

The most important alignment test:

```text
input:  V2 character card + OpenAI preset + chat history (10 turns) + persona + world info book
output: prompt JSON byte-level = output from the same ST version with the same input
```

If prompt assembly order is slightly wrong, ST users will feel it immediately. Their tuned presets are sensitive to byte order. This item must be strict.

## Dependencies

- Model connections go through the Yggdrasil public protocol (`kernel.outbound.execute` + `official/model-provider-lab`)
- `secret_ref`, HTTPS-only, outbound audit, and streaming lifecycle all come from Yggdrasil
- Track C does not rewrite the HTTP layer, does not store API keys, and does not do permission audit

YdlTavern only handles: translate ST preset + Turn model into "which provider, what request body, how to parse the stream".

## Current status

`packages/ydltavern-engine-core` now has ST-faithful PromptManager + ChatCompletion + chat/text completion adapters + instruct mode + tokenizer registry:

- `prompt-manager-st.ts` — `Prompt`/`PromptCollection`/`Message`/`MessageCollection`/`ChatCompletion` classes; `preparePromptsForChatCompletion`, `populationInjectionPrompts`, `populateChatHistory`, `populateDialogueExamples`, `squashSystemMessages`; `INJECTION_POSITION` (RELATIVE/ABSOLUTE), `NAMES_BEHAVIOR`, `EXTENSION_PROMPT_TYPES`, `EXTENSION_PROMPT_ROLES`; 12 default prompts (main → worldInfoBefore → personaDescription → charDescription → charPersonality → scenario → enhanceDefinitions → nsfw → worldInfoAfter → dialogueExamples → chatHistory → jailbreak); `injection_trigger` filtering; main/jailbreak override with `{{original}}`; group nudge; squash with named/excluded id rules; ChatCompletion `tokenBudget = context - response`.
- `chat-completion-providers.ts` — `buildChatRequest` covering 25 sources with provider-specific overrides (O1/GPT-5 max_completion_tokens + system→user + tool stripping, Claude assistant_prefill on continue, Gemini stop≤5×16chars, Cohere top_p clamp, OpenRouter middleout/quantizations, DeepSeek reasoning_effort auto→omit, Grok-3-mini penalties strip, Workers AI top_k cap 50, etc.); `applyStreamChunk` state machine for OpenAI/Claude/Gemini/Mistral/OpenRouter/DeepSeek delta merge with reasoning + tool_calls + multi-swipe.
- `text-completion-providers.ts` — `resolveTextGenServer` (mancer/togetherai/infermaticai/dreamgen/openrouter/featherless fixed bases); 15 sources (ooba, mancer, vllm, aphrodite, tabby, koboldcpp, togetherai, llamacpp, ollama, infermaticai, dreamgen, openrouter, featherless, huggingface, generic); ooba/llamacpp/ollama/vllm/aphrodite/mancer-specific samplers; llamacpp/ollama aliasing; HuggingFace top_p clamp; mancer epsilon/eta_cutoff/1000; `applyTextStreamChunk`; Horde polling (MIN_LENGTH=16, MAX_RETRIES=480).
- `instruct.ts` — full `InstructTemplate` schema; `formatInstructModeChat` with prefix/suffix selection (first/last variants, system_same_as_user, names_behavior); `formatInstructModeStoryString`, `formatInstructModeExamples`, `getInstructStoppingSequences` (sequences_as_stop_strings + dedupe + wrap newline prefix); built-in templates ChatML, Alpaca, Vicuna, Mistral, Llama 3.
- `tokenizers-st.ts` — `TOKENIZER` enum (NONE/GPT2/OPENAI/LLAMA/NERD/NERD2/MISTRAL/YI/CLAUDE/LLAMA3/GEMMA/JAMBA/QWEN2/COMMAND_R/NEMO/DEEPSEEK/COMMAND_A + API_TEXTGENERATIONWEBUI/API_KOBOLD/BEST_MATCH); `ENCODE_TOKENIZERS` set; `TOKENIZER_URLS` endpoint table; `getTokenizerBestMatch` heuristics across novel/kobold/textgen/openai/openrouter/cohere/electronhub/chutes/workers_ai/perplexity/groq; `guesstimate` (UTF-8 byte length / 3.35); `planCountTokensOpenAI`; `TokenCountCache` LRU.
- Still includes pre-existing sampler alias normalization, token budgeting, golden harnesses, stream frame normalization, and model-boundary plans.

`packages/ydltavern-engine` passes PromptManager diagnostics, WI advanced diagnostics, nextState, and frames through `preset.compile` and `turn.generate`; 20 new deep-port JSON-RPC capabilities added. `model.live_call` / `model.live_call.stream` can make opt-in real provider HTTPS calls through `kernel.outbound.execute` / `kernel.outbound.stream` when the Yggdrasil host uses a live outbound profile; default fake generation still performs no network and uses no raw secrets.

Still pending: expand golden harness coverage, add more tokenizer/source fixtures, add provider-specific smoke tests, and connect more Generate branches to the live-call path.

## Out of scope

- A real self-built model inference engine (use Yggdrasil model-provider-lab)
- Self-built model management / billing / balance (not doing it)
- Inline upload for multimodal content (image / audio) — possible, but as sub kinds, without polluting prompt builder

## Completion criteria

- Every connector has byte-level alignment under alignment fixtures
- Every sampling parameter is upgraded to `implemented` in `COMPATIBILITY_MATRIX.en.md`
- Streaming token speed is not slower than ST with the same backend
- swipe / regenerate / continue / impersonate behavior matches ST
