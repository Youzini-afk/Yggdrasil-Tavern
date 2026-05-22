# @ydltavern/engine-core

Pure TypeScript engine core for YdlTavern: provider request builders, PromptManager, World Info, instruct mode, stream chunk merge, tokenizer registry, and related logic. This package does not perform network requests directly and does not hold raw secrets.

## Recent additions

- High-level tokenizer API: `countTokens(text, options)`.
- OpenAI/GPT-2 adapter: `gpt-tokenizer`, covering cl100k/o200k/p50k/r50k families.
- Llama adapters: `llama-tokenizer-js` for Llama 1/2 and `llama3-tokenizer-js` for Llama 3.
- Claude adapter: local `@anthropic-ai/tokenizer` approximation, reported as `approximation`.
- HuggingFace generic adapter: `@huggingface/tokenizers` for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A; callers must supply tokenizer source.
- ST-style UTF-8/3.35 guesstimate fallback remains when no real tokenizer source is available.
- Golden harness tokenizer fixtures cover basic adapter regressions.

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
