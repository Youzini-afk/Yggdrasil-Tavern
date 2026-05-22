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

`packages/ydltavern-engine-core` now has a PromptManager / generation-prompt fixture-aligned subset:

- sampler alias normalization and OpenAI request shape builder;
- `compilePromptCollection()` supports ST-like `prompts` / `prompt_order`, enabled state, triggers, markers, custom prompts, and main/jailbreak override diagnostics;
- `buildPromptCriticalBlocks()` can fill worldInfoBefore/worldInfoAfter/persona/character/scenario/chatHistory/jailbreak through PromptManager markers;
- `buildPrompt()` still owns the current messages/text output and preserves block metadata.

`packages/ydltavern-engine` passes PromptManager diagnostics, WI advanced diagnostics, nextState, and frames through `preset.compile` and `turn.generate`; generation is still deterministic fake behavior with no network and no secrets.

This is still `partial`. Text-completion request shapes, approx tokenizer/token budgeting, golden harnesses, stream frame normalization, and model-boundary plans are now present. Provider-specific streaming, real tokenizers, a full byte-level ST PromptManager golden harness, and live model calls are not complete yet.

## Out of scope

- A real self-built model inference engine (use Yggdrasil model-provider-lab)
- Self-built model management / billing / balance (not doing it)
- Inline upload for multimodal content (image / audio) — possible, but as sub kinds, without polluting prompt builder

## Completion criteria

- Every connector has byte-level alignment under alignment fixtures
- Every sampling parameter is upgraded to `implemented` in `COMPATIBILITY_MATRIX.en.md`
- Streaming token speed is not slower than ST with the same backend
- swipe / regenerate / continue / impersonate behavior matches ST
