# @ydltavern/engine-core

Pure TypeScript engine core for YdlTavern: provider request builders, PromptManager, World Info, instruct mode, stream chunk merge, tokenizer registry, and related logic. This package does not perform network requests directly and does not hold raw secrets.

## Recent additions

- High-level tokenizer API: `countTokens(text, options)`.
- OpenAI/GPT-2 adapter: `gpt-tokenizer`, covering cl100k/o200k/p50k/r50k families.
- Llama adapters: `llama-tokenizer-js` for Llama 1/2 and `llama3-tokenizer-js` for Llama 3.
- Claude adapter: local `@anthropic-ai/tokenizer` approximation, reported as `approximation`.
- HuggingFace generic adapter: `@huggingface/tokenizers` for Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A; callers can supply tokenizer source directly or use `fetchHuggingFaceTokenizer` to runtime-fetch it.
- `fetchHuggingFaceTokenizer(options)`: uses a caller-provided Yggdrasil `kernelClient` to call `kernel.outbound.execute` and download `tokenizer.json` from Hugging Face Hub or a specified URL; supports `expectedSha256` integrity pins, source=url, hf-hub model/revision paths, and an in-memory LRU cache.
- The fetcher never networks directly, never writes the filesystem, and never holds raw secrets; private HF repos must be accessed through a host-resolved `secret_ref` declared in the manifest.
- ST-style UTF-8/3.35 guesstimate fallback remains when no real tokenizer source is available.
- Golden harness tokenizer fixtures cover basic adapter regressions.

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
