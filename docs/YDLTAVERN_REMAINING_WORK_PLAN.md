# YdlTavern Remaining Work 总计划（临时）

> 临时执行计划。全部阶段完成后删除，并把长期内容合并到 README、架构文档、兼容矩阵和各轨道文档。

## 目标

把 YdlTavern 从“兼容 contract / fixture-aligned subset”推进到“复刻并升级 SillyTavern 的主要能力面”。当前阶段仍是开发阶段，不以发布、真实用户运营、真实模型出网为优先目标。

核心原则：

- YdlTavern 继续作为独立接入项目，不进入 Yggdrasil 官方包。
- YdlTavern 提供 Tavern frontend surface 与引擎能力；Yggdrasil 以后提供 Web / Desktop / App shell。
- YdlTavern 可复刻 ST 能力和 API，但不能要求 Yggdrasil kernel 增加 Tavern 专属语义。
- 真实模型调用只通过 Yggdrasil 公开协议、`secret_ref`、outbound audit，不直连、不存 key。
- 先把数据、引擎、脚本、扩展、UI 的开发面做完整，再回到 Yggdrasil 做 shell 和发布链路。

## 调研依据

### Engine / generation

- `SillyTavern/public/script.js`：`generateRawData`、`generateRaw`、`Generate`、streaming dispatch、non-stream dispatch。
- `SillyTavern/src/endpoints/backends/text-completions.js`：text completion backend router。
- `SillyTavern/src/endpoints/backends/chat-completions.js`：chat completion backend router。
- `SillyTavern/src/endpoints/tokenizers.js` 与 `public/scripts/tokenizers.js`：tokenizer registry、token counting API。
- `SillyTavern/public/scripts/PromptManager.js`：Prompt、PromptCollection、PromptManager、token handler、prompt order。
- `SillyTavern/src/prompt-converters.js`：provider prompt conversion。

### Assets

- `SillyTavern/src/character-card-parser.js`、`src/validator/TavernCardValidator.js`、`src/charx.js`、`src/png/encode.js`。
- `SillyTavern/src/endpoints/presets.js`、`public/scripts/preset-manager.js`、`public/scripts/sysprompt.js`。
- `SillyTavern/src/endpoints/themes.js`、`public/scripts/power-user.js`、`public/scripts/util/ThemeGenerator.js`。
- `SillyTavern/public/scripts/extensions/quick-reply/**` 与 `regex/**`。

### STScript / slash

- `SillyTavern/public/scripts/slash-commands.js`。
- `SillyTavern/public/scripts/slash-commands/SlashCommandParser.js`。
- `SlashCommand.js`、`SlashCommandArgument.js`、`SlashCommandExecutor.js`、`SlashCommandScope.js`、`SlashCommandClosure.js`。

### Extensions / UI

- `SillyTavern/public/scripts/extensions.js` 与 `src/endpoints/extensions.js`。
- `SillyTavern/public/index.html`、`public/style.css`、`public/css/extensions-panel.css`、`public/css/world-info.css`、`public/css/mobile-styles.css`。

## 当前实现基线

- `@ydltavern/types`：Turn、资产、ST 常量与 slash command 名称表。
- `@ydltavern/importers`：character/worldbook/chat/PNG metadata importer，但仍是单文件实现，资产类型不完整。
- `@ydltavern/engine-core`：OpenAI chat request、PromptManager subset、World Info advanced subset、prompt-critical marker fills。
- `@ydltavern/st-compat`：eventSource、chat[] Proxy、getContext、macro subset、slash minimal core。
- `ydltavern-engine`：subprocess capability package，当前为 deterministic fake generation。
- `@ydltavern/surface`：surface bundle + diagnostics UI，不是产品级 Tavern UI。

## 阶段总览

### M1：Engine Core 字节级化基础

目标：补齐生成核心的可对齐地基。

交付：

- text completion request builder：generic/textgen/kobold/ollama 风格 shape。
- tokenizer abstraction：approx tokenizer、message/text token count、budget diagnostics。
- prompt routing：WI atDepth/EM/outlet/AN 与 text/chat prompt routing 的可解释输出。
- golden harness：统一 fixture runner，先做 whitespace-normalized / structure-level compare。
- stream frame contract：start/delta/reasoning/tool/progress/error/end/cancelled normalized frames。
- engine package 透传新增 request/token/golden/stream diagnostics。

验收：

- `@ydltavern/engine-core` 新增 text/token/golden/stream tests。
- `ydltavern-engine` tests 覆盖 text completion build、budget diagnostics、stream frame shape。
- 不真出网、不存 secret。

### M2：Asset Layer 补全与 importer 重组

目标：把 ST 主要内容资产格式纳入 YdlTavern 数据层。

交付：

- 拆分 `@ydltavern/importers/src/index.ts` 为 character/world-book/chat/preset/persona/theme/quick-reply/regex/instruct/exporter 模块。
- import/export：character、worldbook、chat、preset。
- import：persona、theme、quick reply、regex scripts、instruct/context/sysprompt。
- 保守 raw payload preservation 与 diagnostics。
- engine asset capabilities 扩展到新增资产类型。

验收：

- importers 包新增 fixtures/tests。
- public exports 保持兼容。

### M3：STScript / Slash Runtime Core

目标：从行级 slash executor 升级为 STScript runtime skeleton。

交付：

- 拆分 `st-compat/src/slash.ts` 到 `slash/` 与 `stscript/`。
- lexer/parser/AST/evaluator/state/pipeline/closures。
- scoped variables、global variables、pipe、closures。
- `/let`、`/var`、`/while`、增强 `/if`、`/run`、`/break` 最小行为。
- command metadata registry：aliases、help、named/unnamed args、returns、enum hints。
- `ydltavern-engine` 的 `script.eval` 接入 st-compat evaluator。

验收：

- st-compat tests 覆盖 parser/evaluator/scope/pipe/closure/control flow。
- engine tests 覆盖 `script.eval`。

### M4：Built-in Extensions 第一批

目标：做第一批用户高度依赖的内置扩展能力。

交付：

- 新包 `@ydltavern/extensions`：manifest、registry、settings、hooks、diagnostics。
- token-counter：使用 tokenizer API，输出 token chunks / count diagnostics。
- regex：GLOBAL/PRESET/SCOPED schema、execution engine、debug diagnostics。
- quick-reply：sets、links、slash integration、auto-execute triggers skeleton。
- memory：summary prompt settings、extension prompt insertion skeleton。
- vectors：vector settings、index/query/injection plan skeleton，不真嵌入不出网。

验收：

- extensions 包 typecheck/build/test。
- st-compat / engine 回归通过。

### M5：Product Surface

目标：把 surface 从 diagnostics demo 升级为 Tavern-like 产品 UI surface。

交付：

- `app/TavernShell`、`TavernProvider`。
- chat features：MessageList、MessageComposer、GenerationControls、SwipeControls。
- settings features：Connection/Sampler/Persona/Theme/Preset panels。
- assets features：Character/WorldBook/Preset import-export panels。
- extensions features：ExtensionList、ExtensionDetails、InstallDialog、PermissionsPanel。
- dev-panels：把现有 diagnostics 移入 dev panels，不占主产品流。

验收：

- surface typecheck/build。
- 不恢复独立 app，不创建 Tauri/Web shell。

### M6：Extension Loader

目标：开始承载 ST-style 扩展生态。

交付：

- manifest discovery / parse / sort by loading order。
- installed/enabled registry。
- ST extension compatibility adapter。
- extension settings/template registry。
- hooks：slash、prompt、events、UI panels。
- loader diagnostics 与 permission gate skeleton。
- engine capabilities：extension.list/load/enable/disable dry-run shapes。

验收：

- extensions tests 覆盖 manifest/registry/loader/hooks。
- surface extensions panel 消费 registry。

### M7：Model Boundary Integration Prep

目标：为后续真实模型调用准备边界，但不在本轮要求真实出网。

交付：

- `ydltavern-engine` 新增 model call plan / request envelope shape。
- 明确通过 Ygg public protocol、`kernel.outbound.execute`、`secret_ref`、audit。
- stream adapter 可消费 normalized frames。
- fake local path 保持可测。

验收：

- engine tests 覆盖 model-call plan shape 与“不直连、不存 key” diagnostics。

### M8：文档收敛与清理

目标：删除本临时计划并更新长期文档。

交付：

- 删除 `docs/YDLTAVERN_REMAINING_WORK_PLAN*.md`。
- 更新 README / ARCHITECTURE / COMPATIBILITY_MATRIX / tracks / package READMEs。
- markdown links、package tests、typecheck/build 全量通过。

## 并行策略

- M1 与 M2 可由不同 fixer 并行，但 importer 拆分完成后再统一接 engine assets。
- M3 依赖 st-compat 当前 runtime，但可与 M2 部分并行。
- M4 依赖 M1 tokenizer 和 M3 slash runtime，token-counter/regex 可先行，quick-reply/memory/vectors 后接。
- M5 可由 designer 并行，但必须等 M1-M4 的公开 API 稳定后做最终整合。
- M6 依赖 M3/M4 的 compatibility API。
- M7 依赖 M1 stream frame contract。

## 非目标

- 不把 YdlTavern 做成独立 desktop/web app。
- 不把 Tavern 语义写进 Yggdrasil kernel。
- 不在 YdlTavern 中存 raw API key。
- 不直接绕过 Yggdrasil outbound 体系出网。
- 不宣称全部字节级兼容，除非有 golden harness 证明。
