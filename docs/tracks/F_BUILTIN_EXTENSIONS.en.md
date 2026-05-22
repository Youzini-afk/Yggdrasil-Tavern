# F Track: Built-in Extensions

> [English](./F_BUILTIN_EXTENSIONS.en.md) · [中文](./F_BUILTIN_EXTENSIONS.md)

## Scope

Provide equivalent capabilities in YdlTavern for SillyTavern's 14 built-in extensions, about 20K LoC. Each built-in extension can be either:

1. A native extension rewritten by YdlTavern, or
2. An adapter to existing Yggdrasil capability packages (such as `memory-lab`, `storage-lab`)

## Ground truth

`docs/inventory/BUILTIN_EXTENSIONS.raw.md`.

## Handling strategy for the 14 extensions

| Extension | Strategy | Notes |
|---|---|---|
| `assets` | rewrite native body | Asset management UI |
| `attachments` | rewrite native body | Data Bank, connected to the YdlTavern filesystem |
| `caption` | rewrite native body | Backend goes through Yggdrasil model-provider-lab |
| `connection-manager` | rewrite native body | Connection configuration profiles |
| `expressions` | rewrite native body | Character portraits + classification |
| `gallery` | rewrite native body | Image gallery |
| `memory` | connect to Yggdrasil `memory-lab` | Long-term memory already has a platform substrate |
| `quick-reply` | rewrite native body | quick reply collections |
| `regex` | rewrite native body | Text regex scripts |
| `stable-diffusion` | rewrite native body | 67 endpoints, with its own backend dispatcher |
| `token-counter` | rewrite native body | Backend uses the YdlTavern engine tokenizer |
| `translate` | rewrite native body | 8 translation providers |
| `tts` | rewrite native body | Multiple TTS providers |
| `vectors` | connect to Yggdrasil `tdb-retrieval-lab` | Vector retrieval already has a platform substrate |

The two extensions connected to existing Yggdrasil capability packages (`memory`, `vectors`) use compatibility-layer wrappers: old ST user settings and data are migrated automatically to Yggdrasil packages, and old APIs continue to work.

## Alignment strategy

Each extension aligns two surfaces:

1. **API surface**: slash commands, events, and settings registered by the extension itself are compatible with the same ST names.
2. **Data surface**: extension state accumulated by users in ST (such as vectors indexes and memory summary history) can be migrated.

## Dependencies

- Track D contract (extensions register themselves through ST-style APIs)
- Each extension backend goes through the Yggdrasil protocol (outbound, filesystem, memory, vectors)
- The 67 `stable-diffusion` endpoints go through Yggdrasil model-provider-lab or a custom outbound package

## Current status

`@ydltavern/extensions` now has deep-ported logic for 5+8 built-in extensions:

- `extensions-st.ts` — regex: `REGEX_PLACEMENT` (USER_INPUT=1/AI_OUTPUT=2/SLASH_COMMAND=3/WORLD_INFO=5/REASONING=6) + `getRegexedString` with placement filter, depth gating, capture groups $1..$N, `{{match}}→$0`, trimStrings, substituteParams, RegexProvider LRU(1000); memory: full settings (source extras/main/webllm, prompt/template/position/depth/role/scan/promptWords/promptInterval/promptForceWords/maxMessagesPerRequest/prompt_builder/memoryFrozen/SkipWIAN), `shouldSummarize` triggers, `formatMemoryValue`; vectors: 18 sources, chat/files/databank settings, `chunkText` size+overlap, `planVectorsInjection`; quick-reply: 9 auto-execute hook events, `autoExecuteCandidates` event flag mapping; token-counter: `tokenCounterPlan`.
- `extensions-st-providers.ts` — caption: 4 sources (extras/local/horde/multimodal), `planCaption` with template substitution; TTS: 27 providers, `selectTtsSegments` (paragraphs/dialogues_only/quoted_only filters), `planTtsNarration`; translate: 9 providers, `shouldTranslateMessage` auto_mode logic; expressions: classify endpoint, sprite cache; attachments: 3 scopes (global/character/chat), 14 slash commands, `DataBankStore` CRUD; connection-manager: 18 ConnectionProfile fields, `snapshotConnectionProfile`/`applyConnectionProfilePlan`; stable-diffusion: trigger processor with character/scenery patterns, 10 backends; gallery defaults.
- `ydltavern-engine` exposes matching extension capabilities.

This is still `partial`: heavy provider-specific I/O (real API calls, real TTS/translate/caption backends, real SD generation) is still deferred.

## Out of scope

- Third-party extensions (handled by track H)
- Experimental built-in extensions recently added in ST commits but not yet stable (if any; scan as needed)

## Completion criteria

- All 14 built-in extensions are upgraded to `implemented` or `partial` in `COMPATIBILITY_MATRIX.en.md`
- There is documented migration path for old ST users' extension data
