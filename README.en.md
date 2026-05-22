# YdlTavern

> [English](./README.en.md) · [中文](./README.md)

**A conversation and roleplay project running on [Yggdrasil](https://github.com/Youzini-afk/Yggdrasil), compatible with SillyTavern's character cards, world books, presets, chats, and extensions.**

YdlTavern brings the content formats and extension ecosystem the SillyTavern community has built up over the years onto the Yggdrasil platform substrate. The frontend stays familiar; the engine layer uses Yggdrasil's modern implementation.

## What it does

- Imports SillyTavern character cards (V1 / V2 / V3), world books, prompt presets, and chat history directly.
- Supports SillyTavern's extension API (`getContext()`, `eventSource`, slash commands, etc.) so existing extensions can run.
- Keeps the UI structure and interaction flow familiar to longtime SillyTavern users, with the frontend rewritten from scratch.
- Uses Yggdrasil for the engine layer: model integration, `secret_ref`, streaming lifecycle, proposal approval, outbound audit, memory / retrieval, and agent infrastructure all come from the platform.

## Relationship to Yggdrasil

YdlTavern is an integration project on top of Yggdrasil. It consumes the platform through the public protocol (HTTP `/rpc` plus SSE), and provides its own Tavern frontend as a surface bundle for Yggdrasil to host. Yggdrasil owns the platform shell; YdlTavern owns the product UI.

- It does not live in the Yggdrasil repo. Platform and product stay separate.
- It gets the same treatment as any third-party project: same manifest, same permissions, same audit boundary.
- It uses what Yggdrasil already provides: model integration, `secret_ref`, streaming and cancel lifecycle, proposals and approval, memory, sharing, outbound audit, git package install.

For Yggdrasil's side of the boundary, see [Yggdrasil/docs/tavern/TAVERN_COMPAT.md](https://github.com/Youzini-afk/Yggdrasil/blob/main/docs/tavern/TAVERN_COMPAT.en.md).

## Status

The main development surface has completed a systematic pass and a deep-port pass. YdlTavern now has one-to-one algorithm ports of ST core runtime: PromptManager, World Info, STScript, macro engine, chat/text completion adapters (25/15 providers), instruct mode, tokenizer registry, extension logic, ST API surface, and extension loader. Algorithms are ported function-by-function from ST source with file/line references baked in.

- **Mechanical inventory of ST source**: 99 event_types, 153 slash commands, 80+ macros, 26 chat completion sources, 17 text completion sources, 80+ sampler parameters, 32 world info triggers, 14 built-in extensions. Under [`docs/inventory/`](docs/inventory/).
- **Internal data model and compatibility projection**: the Turn model plus the projection rules for ST `chat[]` / `eventSource` / `getContext()`. Under [`docs/architecture/`](docs/architecture/).
- **Eight parallel implementation tracks**: B assets / C engine core / D ST API / E STScript / F built-in extensions / G UI / H extension loader / I advanced. Under [`docs/tracks/`](docs/tracks/).
- **Shared types package**: [`packages/ydltavern-types/`](packages/ydltavern-types/) — Turn model plus ST event/slash/macro/connector/sampler/world-info/prompt-manager constants.
- **Asset importers**: [`packages/ydltavern-importers/`](packages/ydltavern-importers/) — character JSON/PNG, world book, JSONL chat, preset, persona, theme, quick reply, regex, and instruct import/export skeletons backed by ST-like fixture tests.
- **ST compatibility runtime**: [`packages/ydltavern-st-compat/`](packages/ydltavern-st-compat/) — live `chat[]` Proxy, Turn store, full `getContext()` shape (state / bridges / functions / legacy aliases / symbols / deprecated stubs), `eventSource`, `Generate`, macro engine (full ST registry covering core/env/time/state/instruct/chat/variable + recursive expansion + PickState), STScript runtime (scope chain / closure / abort+break+debug / pipe injection / lintPipeValue / compareValues / registry + alias resolution).
- **Engine core**: [`packages/ydltavern-engine-core/`](packages/ydltavern-engine-core/) — sampler normalization, 25 chat completion request shapes (with provider-specific overrides: O1/GPT-5 max_completion_tokens + system→user + tool stripping, Claude assistant_prefill on continue, Gemini stop≤5×16chars, Cohere top_p clamp, OpenRouter middleout/quantizations, DeepSeek reasoning_effort auto→omit, Grok-3-mini penalties strip, Workers AI top_k cap 50, etc.), 15 text completion request shapes (with backend-specific samplers + Horde polling), stream chunk state machine (OpenAI/Claude/Gemini/Mistral/OpenRouter/DeepSeek delta merge + reasoning + tool_calls + multi-swipe), PromptManager (12 default prompts + RELATIVE/ABSOLUTE injection routing + injection_trigger filtering + main/jailbreak override with `{{original}}` + group nudge + squash with named/excluded id rules + ChatCompletion `tokenBudget = context - response`), World Info (8-bucket routing + WI_ANCHOR_POSITION + 4 selectiveLogic modes + regex parsing + matchKeys boundary logic + decorator parsing `@@activate`/`@@dont_activate`/`@@@` escape + activation precedence + timed effects state machine sticky/cooldown/delay + routeActivatedEntries sort-desc→unshift bucket assembly + AN patch + atDepth merge by (depth,role) + outlets by name), instruct mode (full InstructTemplate schema + formatInstructModeChat with prefix/suffix selection + formatInstructModeStoryString/Examples + getInstructStoppingSequences + built-in templates ChatML/Alpaca/Vicuna/Mistral/Llama 3), tokenizer registry (TOKENIZER enum 20 variants + ENCODE_TOKENIZERS set + TOKENIZER_URLS endpoint table + getTokenizerBestMatch heuristics across novel/kobold/textgen/openai/openrouter/cohere/electronhub/chutes/workers_ai/perplexity/groq + guesstimate + planCountTokensOpenAI + TokenCountCache LRU).
- **Built-in extensions package**: [`packages/ydltavern-extensions/`](packages/ydltavern-extensions/) — regex (full engine: REGEX_PLACEMENT 5 positions + getRegexedString + depth gating + capture groups + trimStrings + RegexProvider LRU), memory (full settings + shouldSummarize triggers + formatMemoryValue), vectors (18 sources + chunkText size+overlap + planVectorsInjection), quick-reply (9 auto-execute hook events + autoExecuteCandidates), token-counter, caption (4 sources + planCaption with template substitution), TTS (27 providers + selectTtsSegments + planTtsNarration), translate (9 providers + shouldTranslateMessage auto_mode), expressions (classify endpoint + sprite cache), attachments (3 scopes + 14 slash commands + DataBankStore CRUD), connection-manager (18 ConnectionProfile fields + snapshot/apply), stable-diffusion (trigger processor with character/scenery patterns + 10 backends), extension loader (ST manifest schema parsing + validation + warnings + isActivationEligible + sortByActivationOrder + buildLoadPlan 6 step kinds + planActivateAll progressive dependency tracking + STDisabledExtensionsStore).
- **Compatibility matrix**: [`docs/COMPATIBILITY_MATRIX.md`](docs/COMPATIBILITY_MATRIX.en.md) — B/C/D/E/F/G/H/I are `partial`; deep-port covers PromptManager / World Info / STScript / macros / chat+text completion / instruct / tokenizer / extensions / ST API / extension loader; no byte-level alignment claimed yet.
- **YdlTavern frontend surface**: [`packages/ydltavern-surface/`](packages/ydltavern-surface/) — React surface bundle; `TavernPlaySurface` now defaults to a Tavern-like product shell with chat, settings/assets/extensions/dev drawers, and 5 diagnostic inspectors (PromptManager / World Info / STScript / Extensions / Connector) wired into DevDiagnosticsPanel. It does not include an independent desktop/web/app shell.
- **Engine package**: [`packages/ydltavern-engine/`](packages/ydltavern-engine/) — Yggdrasil subprocess capability package with 20 deep-port JSON-RPC capabilities (`prompt.manager.compile`, `world_info.route`, `world_info.match_keys`, `provider.chat.build_request`, `provider.text.build_request`, `provider.text.plan_horde`, `instruct.format_chat`, `instruct.stopping_sequences`, `tokenizer.best_match`, `tokenizer.guesstimate`, `script.macro.expand`, `extension.regex.apply_st`, `extension.loader.parse_manifest`, `extension.loader.plan_activate_all`, `extension.caption.plan`, `extension.tts.plan_narration`, `extension.translate.plan`, `extension.connection_profile.snapshot`, `extension.connection_profile.apply_plan`, `extension.sd.process_triggers`), plus existing `world_info.evaluate`, `preset.compile`, `turn.generate`, asset import/export, script.eval, extension registry, model.plan_call. Still no real network calls, no raw secrets.

Next: byte-level golden harnesses, real tokenizer binaries via wasm, real extension-JS sandbox, live model calls through Yggdrasil host outbound, then return to Yggdrasil for Web/Desktop/App shells. Full documentation index in [`docs/`](docs/README.en.md).

## Acknowledgements

The character cards, world books, presets, chat history, and extension APIs are the work of the SillyTavern team and community over many years. YdlTavern does compatibility work on top of that — credit goes to them.

## License

YdlTavern is licensed under the GNU Affero General Public License v3.0 (AGPLv3). See [`LICENSE`](LICENSE).
