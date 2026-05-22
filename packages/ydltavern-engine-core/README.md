# @ydltavern/engine-core

YdlTavern 的纯 TypeScript 引擎核心：provider request builder、PromptManager、World Info、instruct mode、stream chunk merge、tokenizer registry 等。这里不直接做网络请求，也不持有 raw secret。

## Recent additions

- `countTokens(text, options)` 高层 tokenizer API。
- OpenAI/GPT-2 adapter：`gpt-tokenizer`，支持 cl100k/o200k/p50k/r50k 系列。
- Llama adapter：`llama-tokenizer-js`（Llama 1/2）和 `llama3-tokenizer-js`（Llama 3）。
- Claude adapter：`@anthropic-ai/tokenizer` 本地近似，标记为 `approximation`。
- HuggingFace generic adapter：`@huggingface/tokenizers`，用于 Mistral/Gemma/Qwen2/DeepSeek/Yi/Jamba/Nemo/Command R/A；调用方可直接提供 tokenizer source，或使用 `fetchHuggingFaceTokenizer` runtime-fetch。
- `fetchHuggingFaceTokenizer(options)`：通过调用方提供的 Yggdrasil `kernelClient` 发起 `kernel.outbound.execute`，下载 Hugging Face Hub 或指定 URL 的 `tokenizer.json`；支持 `expectedSha256` 完整性 pin、source=url、hf-hub model/revision 路径，以及内存 LRU cache。
- fetcher 不直接联网、不写文件系统、不持有 raw secret；私有 HF repo 只通过 host 解析 manifest 允许的 `secret_ref`。
- 无真实 tokenizer source 时保留 ST 风格 UTF-8/3.35 guesstimate fallback。
- Golden harness tokenizer fixtures 会覆盖这些 adapter 的基础回归。
- 宏引擎深实现现在位于本包，覆盖 ST-style recursive expansion、comment macro、trim/newline 后处理、random/pick/roll、isodate/weekday/datetimeformat 等路径；`@ydltavern/st-compat` 从这里 re-export 兼容入口。当前 macro golden scenarios 为 4/4 perfect。
- World Info 预算对齐 ST fallback token approximation（UTF-8/3.35 近似而非字符长度），概率路径使用 seedrandom 注入；当前 WI golden scenarios 为 4/4 perfect。

## Commands

- Typecheck: `npm run typecheck`
- Test: `npm test`
- Build: `npm run build`
