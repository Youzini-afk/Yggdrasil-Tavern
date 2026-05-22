# YdlTavern Remaining Work Plan (temporary)

> Temporary execution plan. Delete after all phases complete, then fold durable content into README, architecture docs, compatibility matrix, and track docs.

## Goal

Move YdlTavern from a compatibility contract / fixture-aligned subset toward the main capability surface needed to recreate and upgrade SillyTavern. This is still a development stage: release, real-user operation, and live model calls are not the immediate priority.

Principles:

- YdlTavern stays an independent integration project, not a Yggdrasil official package.
- YdlTavern provides the Tavern frontend surface and engine capabilities; Yggdrasil later provides Web / Desktop / App shells.
- YdlTavern may recreate ST behavior and APIs, but must not force Tavern semantics into the Yggdrasil kernel.
- Real model calls must go through Yggdrasil public protocol, `secret_ref`, and outbound audit. YdlTavern must not connect directly or store keys.
- Finish the development surface for data, engine, scripts, extensions, and UI first; return to Yggdrasil shells and release later.

## Research basis

### Engine / generation

- `SillyTavern/public/script.js`: `generateRawData`, `generateRaw`, `Generate`, streaming dispatch, non-stream dispatch.
- `SillyTavern/src/endpoints/backends/text-completions.js`: text completion backend router.
- `SillyTavern/src/endpoints/backends/chat-completions.js`: chat completion backend router.
- `SillyTavern/src/endpoints/tokenizers.js` and `public/scripts/tokenizers.js`: tokenizer registry and token counting API.
- `SillyTavern/public/scripts/PromptManager.js`: Prompt, PromptCollection, PromptManager, token handler, prompt order.
- `SillyTavern/src/prompt-converters.js`: provider prompt conversion.

### Assets

- `SillyTavern/src/character-card-parser.js`, `src/validator/TavernCardValidator.js`, `src/charx.js`, `src/png/encode.js`.
- `SillyTavern/src/endpoints/presets.js`, `public/scripts/preset-manager.js`, `public/scripts/sysprompt.js`.
- `SillyTavern/src/endpoints/themes.js`, `public/scripts/power-user.js`, `public/scripts/util/ThemeGenerator.js`.
- `SillyTavern/public/scripts/extensions/quick-reply/**` and `regex/**`.

### STScript / slash

- `SillyTavern/public/scripts/slash-commands.js`.
- `SillyTavern/public/scripts/slash-commands/SlashCommandParser.js`.
- `SlashCommand.js`, `SlashCommandArgument.js`, `SlashCommandExecutor.js`, `SlashCommandScope.js`, `SlashCommandClosure.js`.

### Extensions / UI

- `SillyTavern/public/scripts/extensions.js` and `src/endpoints/extensions.js`.
- `SillyTavern/public/index.html`, `public/style.css`, `public/css/extensions-panel.css`, `public/css/world-info.css`, `public/css/mobile-styles.css`.

## Current baseline

- `@ydltavern/types`: Turn, assets, ST constants, slash command names.
- `@ydltavern/importers`: character/worldbook/chat/PNG metadata importer, but still incomplete and single-file.
- `@ydltavern/engine-core`: OpenAI chat request, PromptManager subset, World Info advanced subset, prompt-critical marker fills.
- `@ydltavern/st-compat`: eventSource, chat[] Proxy, getContext, macro subset, minimal slash core.
- `ydltavern-engine`: subprocess capability package with deterministic fake generation.
- `@ydltavern/surface`: surface bundle + diagnostics UI, not a product Tavern UI.

## Phases

### M1: Engine Core byte-alignment foundation

Deliver:

- text completion request builder: generic/textgen/kobold/ollama-style shapes.
- tokenizer abstraction: approx tokenizer, message/text token count, budget diagnostics.
- prompt routing: explainable output for WI atDepth/EM/outlet/AN and text/chat routing.
- golden harness: unified fixture runner, initially whitespace-normalized / structure-level compare.
- stream frame contract: start/delta/reasoning/tool/progress/error/end/cancelled normalized frames.
- engine package passes through request/token/golden/stream diagnostics.

Acceptance:

- New text/token/golden/stream tests in `@ydltavern/engine-core`.
- `ydltavern-engine` tests cover text completion build, budget diagnostics, and stream frame shape.
- No live network and no secret storage.

### M2: Asset Layer completion and importer split

Deliver:

- Split `@ydltavern/importers/src/index.ts` into character/world-book/chat/preset/persona/theme/quick-reply/regex/instruct/exporter modules.
- import/export: character, worldbook, chat, preset.
- import: persona, theme, quick reply, regex scripts, instruct/context/sysprompt.
- Conservative raw payload preservation and diagnostics.
- engine asset capabilities for the new asset types.

### M3: STScript / Slash Runtime Core

Deliver:

- Split `st-compat/src/slash.ts` into `slash/` and `stscript/`.
- lexer/parser/AST/evaluator/state/pipeline/closures.
- scoped variables, global variables, pipe, closures.
- minimum `/let`, `/var`, `/while`, enhanced `/if`, `/run`, `/break` behavior.
- command metadata registry: aliases, help, named/unnamed args, returns, enum hints.
- `ydltavern-engine` `script.eval` calls the st-compat evaluator.

### M4: Built-in extensions, first batch

Deliver:

- New package `@ydltavern/extensions`: manifest, registry, settings, hooks, diagnostics.
- token-counter: token chunks / count diagnostics through tokenizer API.
- regex: GLOBAL/PRESET/SCOPED schema, execution engine, debug diagnostics.
- quick-reply: sets, links, slash integration, auto-execute trigger skeleton.
- memory: summary prompt settings and extension-prompt insertion skeleton.
- vectors: vector settings, index/query/injection plan skeleton; no live embedding/network.

### M5: Product Surface

Deliver:

- `app/TavernShell`, `TavernProvider`.
- chat features: MessageList, MessageComposer, GenerationControls, SwipeControls.
- settings features: Connection/Sampler/Persona/Theme/Preset panels.
- assets features: Character/WorldBook/Preset import-export panels.
- extensions features: ExtensionList, ExtensionDetails, InstallDialog, PermissionsPanel.
- dev-panels: move current diagnostics out of the product flow.

### M6: Extension Loader

Deliver:

- manifest discovery / parse / loading-order sort.
- installed/enabled registry.
- ST extension compatibility adapter.
- extension settings/template registry.
- hooks: slash, prompt, events, UI panels.
- loader diagnostics and permission-gate skeleton.
- engine capabilities: extension.list/load/enable/disable dry-run shapes.

### M7: Model Boundary Integration Prep

Deliver:

- `ydltavern-engine` model call plan / request envelope shape.
- Explicit path through Ygg public protocol, `kernel.outbound.execute`, `secret_ref`, audit.
- stream adapter can consume normalized frames.
- fake local path remains testable.

### M8: Documentation convergence and cleanup

Deliver:

- Delete `docs/YDLTAVERN_REMAINING_WORK_PLAN*.md`.
- Update README / ARCHITECTURE / COMPATIBILITY_MATRIX / tracks / package READMEs.
- Full package typecheck/build/tests and markdown links pass.

## Parallelization

- M1 and M2 can run in parallel, but engine asset capabilities should land after importer split.
- M3 can overlap with parts of M2.
- M4 depends on M1 tokenizer and M3 slash runtime; token-counter/regex can start first, quick-reply/memory/vectors follow.
- M5 can use a designer in parallel, but final integration should wait for M1-M4 APIs.
- M6 depends on M3/M4 compatibility APIs.
- M7 depends on the M1 stream frame contract.

## Non-goals

- Do not make YdlTavern an independent desktop/web app.
- Do not put Tavern semantics into the Yggdrasil kernel.
- Do not store raw API keys in YdlTavern.
- Do not bypass Yggdrasil outbound for network access.
- Do not claim byte-level compatibility unless golden harness proves it.
