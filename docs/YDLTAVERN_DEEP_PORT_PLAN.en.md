# YdlTavern Deep Port Plan

> [English](./YDLTAVERN_DEEP_PORT_PLAN.en.md) · [中文](./YDLTAVERN_DEEP_PORT_PLAN.md)
>
> Temporary document. Updated as each phase lands; deleted at the end and folded into README, ARCHITECTURE, COMPATIBILITY_MATRIX, and tracks/* long-term docs.

## Recalibration

Earlier rounds were too cautious. Every capability surface stopped at a fixture-aligned subset, leaving the matrix stuck at `partial` forever. This pass abandons "minimum implementation" and instead **deep-ports the algorithms straight from ST source**: branches, edge cases, enums, state machines, and field shapes.

We still do not call live networks, store real secrets, or execute third-party extension JS — those belong to Yggdrasil host work later. But prompt shapes, the WI pipeline, STScript behavior, connector request bodies, tokenizer selection, and extension registration are ported one-for-one from ST.

## Research basis

Four explorer agents have completed deep reads of the ST source and produced portable algorithms with file/line references and pseudocode covering:

- `PromptManager.js` + `openai.js` chat-completion prompt construction
- `world-info.js` 39-step pipeline
- `slash-commands/` + `macros.js` + the new macro engine
- `openai.js` + `textgen-settings.js` + `instruct-mode.js` + `tokenizers.js` + `horde.js`
- `extensions.js` + the 14 built-in extensions

## Phase split

Each phase has a clear scope and stands on its own. After each phase: validate, commit, push to `origin/main`, then move on. **Only when all 14 phases complete** do we delete this plan and merge into long-term docs.

### N0: Plan commit (current)

This file plus the Chinese version, committed and pushed.

### N1: PromptManager deep port (engine-core)

File: `packages/ydltavern-engine-core/src/prompt-manager.ts` rewritten.

Ported per ST `preparePromptsForChatCompletion`. (See PromptManager research notes for full field, default-set, and override semantics. Covers RELATIVE/ABSOLUTE injection, `injection_trigger`, `forbid_overrides`, marker fills for worldInfoBefore/After/charDescription/Personality/scenario/personaDescription/dialogueExamples/chatHistory/groupNudge/impersonate/quietPrompt/bias/summary/authorsNote/vectorsMemory/vectorsDataBank/smartContext, ChatCompletion `tokenBudget = context - response`, and reservations for newChat/groupNudge/continue.)

### N2: World Info 39-step pipeline (engine-core)

File: `packages/ydltavern-engine-core/src/world-info.ts` rewritten.

Ported per ST `world-info.js`. Full entry schema, position enum (before/after/ANTop/ANBottom/atDepth/EMTop/EMBottom/outlet), decorator parsing (`@@activate` / `@@dont_activate` plus `@@@` escape), scan source assembly with all match flags, regex key parsing (`/.../gimsuy`), four `selectiveLogic` modes, recursion with leveled `delayUntilRecursion`, min activations with depth advance, inclusion groups (filterByTimedEffects → filterByScoring → winner select), probability with sticky bypass, timed effects state machine (sticky/cooldown/delay) with `chat_metadata.timedWorldInfo` shape, character filter (names + tags + isExclude), generation triggers, macro substitution timing, budget calculation/cap, routing buckets, AN patch, atDepth (depth, role) merge.

### N3: STScript runtime deep port (st-compat)

Files: `packages/ydltavern-st-compat/src/macros.ts`, `slash.ts`, plus new `script-parser.ts` / `script-runtime.ts` / `script-scope.ts`.

Ported per ST `slash-commands/`. Full parser, parser flags (`STRICT_ESCAPING`, `REPLACE_GETVAR`), closure model with scope chain and abort/break/debug controllers, scope variable lookup with numeric coercion + JSON-index, pipe injection rules including `||` skip, control flow `/if /while /times /break /run /abort /pass`, complete variable command set (local/global/scope), `/closure-serialize` and `/closure-deserialize`, error model (parser error / execution error / abort / break / quiet abort), command metadata (name/aliases/helpString/returns/namedArgumentList/unnamedArgumentList/splitUnnamedArgument/rawQuotes/typeList/enumList/enumProvider/forceEnum).

Slash command registrations from research section 7 are stubbed with real metadata schemas.

### N4: Macro engine deep port (st-compat)

File: `packages/ydltavern-st-compat/src/macros.ts` rewritten plus a `macros/` subdir mirroring ST `definitions/`.

Ported per ST `macros/definitions/*` — core/env/time/state/instruct/chat/variable macros (60+ entries with aliases). Pre-processors normalize `<USER>` `<BOT>` `<GROUP>` `<CHARIFNOTGROUP>`. Post-processors unescape braces and handle legacy `{{trim}}`. Recursive expansion with frozen env. `{{random}}` re-rolls every eval; `{{pick}}` is stable per chat with `/reroll-pick`. Full `{{datetimeformat}}`, `{{time_UTC±N}}`, `{{getvar::}}` `{{setvar::}}` `{{var::}}` parameterized forms.

### N5: Chat completion adapters (engine-core)

File: `packages/ydltavern-engine-core/src/chat-completion-providers.ts`.

Ported per ST `openai.js`. Adapter shapes per provider (no live network — shape-only). Covers OpenAI/Azure (with O1/O3/GPT-5 special rules), Claude (assistant_prefill, sysprompt), Gemini/Vertex (parts/thoughts/inlineData), Mistral, Cohere, OpenRouter (reasoning_details, providers, quantizations, allow_fallbacks, middleout), Perplexity, Groq, DeepSeek (reasoning_content), xAI (Grok-3-mini/Grok-4 special rules), Custom OpenAI-compatible, AI21, NanoGPT, ElectronHub, Chutes, Z.ai, SiliconFlow, MiniMax, Workers AI, Moonshot, Fireworks, CometAPI, Pollinations, AIMLAPI. Stream merging state machine. Tool calling with `tool_choice='auto'`, `tool_call_id`, model-specific tool stripping. Reasoning effort mapping per provider/model.

Provider matrix fixtures: input → expected request body deep equal per provider.

### N6: Text completion adapters (engine-core)

File: `packages/ydltavern-engine-core/src/text-completion-providers.ts`.

Ported per ST `textgen-settings.js`. Source enum (ooba/mancer/vllm/aphrodite/tabby/koboldcpp/togetherai/llamacpp/ollama/infermaticai/dreamgen/openrouter/featherless/huggingface/generic). Server resolution. Common samplers, ooba extras, llamacpp/ollama aliases, vLLM, aphrodite full set, OpenRouter text extras, KoboldCpp grammar/dry, Mancer scaling. Stream parser handling `data.index`/`choices[0].index` swipes plus reasoning/thinking. Horde polling (MIN_LENGTH=16, MAX_RETRIES=480).

### N7: Instruct mode (engine-core)

File: `packages/ydltavern-engine-core/src/instruct.ts`.

Ported per ST `instruct-mode.js`. Template fields complete. `formatInstructModeChat` selecting prefix/suffix with first/last variants and `system_same_as_user`, name prefix policy, `{{name}}` substitution, `wrap=true` newline. `formatInstructModeStoryString`, `formatInstructModeExamples` (group-aware), `getInstructStoppingSequences` covering all sequence sources plus dedupe. Built-in templates: ChatML, Alpaca, Vicuna, Mistral, Llama 3.

### N8: Tokenizer (engine-core)

File: `packages/ydltavern-engine-core/src/tokenizers.ts`.

Ported per ST `tokenizers.js`. Full enum, ENCODE_TOKENIZERS, TOKENIZER_URLS placeholder map, `getTokenizerBestMatch` heuristics across novel/kobold/textgen/openrouter/electronhub/chutes/workers_ai/perplexity/groq/cohere, `countTokensOpenAIAsync` semantics, `guesstimate` fallback (bytes / 3.35), caching by tokenizer + string hash + model hash + padding.

### N9: Built-in extensions deep port batch 1 (logic)

Files split into per-extension folders: `regex/` `memory/` `vectors/` `token-counter/` `quick-reply/`.

Per ST research:

- **regex** — placement enum, script schema, `getRegexedString`, `runRegexScript` with `RegexProvider` LRU(1000), capture groups, `{{match}}→$0`, trimStrings, `substituteRegex`.
- **token-counter** — friendly tokenizer name, count via N8.
- **memory** — full source/template/position/depth/role/scan/promptWords/promptInterval/promptForceWords/maxMessagesPerRequest/prompt_builder/memoryFrozen/SkipWIAN. Trigger conditions. `setExtensionPrompt(MODULE_NAME, …)` calls without live model.
- **vectors** — full source list, chat/files/databank settings, `synchronizeChat`, `splitByChunks`, `processFiles`, `ingestDataBankAttachments`, `injectDataBankChunks` plan-only.
- **quick-reply** — full object model, auto-execute hook list, automation fields, deferred queue.

### N10: Built-in extensions deep port batch 2 (provider patterns)

- **caption** — source/multimodal_api/multimodal_model/prompt/template/refine_mode flow.
- **tts** — provider registry pattern (System/Edge/ElevenLabs/Silero/GPT-SoVITS/Coqui/Novel/OpenAI/OpenAI-Compatible/XTTS/VITS/GSVI/SBVITS2/AllTalk/CosyVoice/SpeechT5/Azure/Google Translate/Google Native/Chatterbox/Kokoro/TTS WebUI/Pollinations/MiniMax/Electron Hub/Chutes/Volcengine), narration settings, message queue scheduler.
- **translate** — provider list (deepl/google/libre/lingva/oneringtranslator/bingtranslator/deeplx/yandex/claude), event hooks, two-way translate plan.
- **expressions** — classify → label → sprite folder cache + VN layer.
- **attachments / data bank** — three scopes, full slash command surface.
- **connection-manager** — `ConnectionProfile` schema, `CC_COMMANDS`/`TC_COMMANDS`, apply/update/delete, `/profile-genstream` flow.
- **stable-diffusion** — trigger processor + provider matrix skeleton (67-endpoint backend deferred).
- **gallery / assets** — placeholders.

### N11: ST API surface deep port (st-compat)

File: `packages/ydltavern-st-compat/src/context.ts` rewritten.

Ported per ST `st-context.js`. Full state, function, namespace, and legacy alias surface so unmodified ST extensions can find every property they expect.

### N12: Extension manifest + loader deep port (extensions)

Files: `packages/ydltavern-extensions/src/manifest.ts` + `loader.ts` rewritten.

Per research §3–§4. Manifest schema (display_name/loading_order/requires/optional/dependencies/minimum_client_version/js/css/author/version/homePage/hooks{install/update/delete/clean/enable/disable/activate}/i18n/auto_update/generate_interceptor). Discovery → manifest fetch → optional auto-update → activation in (loading_order asc, display_name asc) order with requires/dependencies/minimum-client-version checks, locale add, script and style injection, hook dispatch. Errors aggregated, never blocking. `disabledExtensions` array. `generate_interceptor` injection point.

Still plan-only — no real JS execution, no real zip/git read, no real network.

### N13: Engine integration + surface deepening

`packages/ydltavern-engine/src/capabilities/*.ts` rewires onto N1–N12 implementations. New surface inspectors for PromptManager, World Info, STScript, Extensions loader, and Connectors.

### N14: Delete plan + docs convergence + final validation

Delete this plan (CN + EN). Update long-term docs to "deep-ported subset (no live network / no live model / no live extension JS / no byte-level prompt golden harness)". Refresh COMPATIBILITY_MATRIX. Update each track and each package README. Validate the entire repo.

## Boundaries (unchanged)

- No live network (Yggdrasil host owns outbound).
- No real secrets (only `secret_ref`).
- No live third-party extension JS execution (deferred until Yggdrasil sandbox).
- No real tokenizer binaries (wasm later).
- No real Stable Diffusion 67-endpoint dispatch (trigger processor only).
- Still a surface bundle — no app shell.

## Completion criteria

Per phase: typecheck/build/test pass, fixtures deep-equal, prior fixtures preserved, no Yggdrasil-internal private references, commit + push.

Final: all phases done, plan deleted, long-term docs converged, matrix reflects new coverage, full link/diff checks pass.
