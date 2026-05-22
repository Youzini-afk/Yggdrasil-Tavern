# @ydltavern/engine-core

YdlTavern 的纯 TypeScript 引擎核心：provider request builder、PromptManager、World Info、instruct mode、stream chunk merge、tokenizer registry 等。这里不直接做网络请求，也不持有 raw secret。

## Recent additions

- `countTokens(text, options)` 高层 tokenizer API。
- OpenAI/GPT-2 adapter：`gpt-tokenizer`，支持 cl100k/o200k/p50k/r50k 系列。
- Llama adapter：`llama-tokenizer-js`（Llama 1/2）和 `llama3-tokenizer-js`（Llama 3）。
- Claude adapter：`@anthropic-ai/tokenizer` 本地近似，标记为 `approximation`。
- HuggingFace generic adapter：`@huggingface/tokenizers`，用于 Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A；调用方必须提供 tokenizer source。
- 无真实 tokenizer source 时保留 ST 风格 UTF-8/3.35 guesstimate fallback。
- Golden harness tokenizer fixtures 会覆盖这些 adapter 的基础回归。

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
