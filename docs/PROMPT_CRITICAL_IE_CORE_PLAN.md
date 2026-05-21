# Prompt-critical I + E Core 计划（临时）

> 临时执行计划。完成后删除，长期内容并入 `docs/tracks/`、`docs/COMPATIBILITY_MATRIX.md`、README 与架构文档。

## 目标

把 YdlTavern 从“可运行 contract slice”推进到“生成前上下文形态更接近 ST”的阶段。

本轮只做 prompt-critical 的最小闭环：

- World Info / lorebook 核心扫描与注入；
- persona、character description / personality / scenario、author's note、instruct、post-history 等 prompt-critical 字段；
- legacy `substituteParams` 常用宏；
- slash command 最小执行框架；
- `/gen`、`/continue`、`/swipe`、变量读写与简单条件；
- surface 只展示诊断，不扩成完整产品 UI。

本轮不做完整 PromptManager 复刻、不做真实模型调用、不做第三方扩展 loader、不做 heavy provider 扩展。

## ST ground truth

### World Info

- `public/scripts/world-info.js:892`：`getWorldInfoPrompt()` 是生成时的 WI 入口。
- `public/scripts/world-info.js:4597`：`checkWorldInfo()` 是主扫描循环。
- `public/scripts/world-info.js:337`：regex / case-sensitive / whole-word 匹配。
- `public/scripts/world-info.js:4826`：secondary key logic：`AND_ANY` / `NOT_ALL` / `NOT_ANY` / `AND_ALL`。
- `public/scripts/world-info.js:5084`、`5093`：按 `order` 排序并按 position 分发。
- `public/scripts/world-info.js:4977`：recursive scan。
- `public/scripts/world-info.js:4624`：token budget 计算。

### Prompt-critical fields

- `public/script.js:4401`：`getCharacterCardFields()` 取 character prompt fields。
- `public/script.js:4567`：WI 扫描输入包含 persona / description / personality / scenario / creator notes。
- `public/scripts/openai.js:1367`：chat completion system prompt sources。
- `public/scripts/openai.js:1388`：Author's Note extension prompt。
- `public/scripts/openai.js:1423`：persona description 进入 prompt。
- `public/scripts/openai.js:1496`：post-history / jailbreak prompt override。
- `public/scripts/instruct-mode.js:387`、`478`：instruct message 与 story string formatting。

### Macro / slash

- `public/script.js:2772`、`2922`：`substituteParams()` legacy / new signature。
- `public/script.js:2865`、`2889`：legacy character/name macros。
- `public/scripts/macros/definitions/*.js`：core/env/chat/time/variable macros。
- `public/scripts/slash-commands.js:103`、`106`、`225`：slash command API、global parser、默认注册。
- `public/scripts/slash-commands.js:2210`、`4486`：`/gen`。
- `public/scripts/slash-commands.js:1489`、`5609`：`/continue`。
- `public/scripts/slash-commands.js:1553`、`5674`：`/swipe`。
- `public/scripts/variables.js:933`、`982`、`1298`：`/setvar`、`/getvar`、`/if`。

## Phases

### P0：计划与边界锁定

交付：本计划提交并推送。

验收：计划明确 ST 源码依据、落点、分阶段、边界和删除规则。

### P1：engine-core prompt-critical spine

范围：只改 `packages/ydltavern-engine-core`。

新增：

- `world-info.ts`：核心 WI evaluate。
- `prompt-critical.ts`：persona / character / author note / instruct / post-history blocks。
- `macros.ts`：legacy macro subset，用于 prompt-critical 字段与 WI content。
- fixtures：world book、chat、prompt-critical inputs、expected evaluation/request。

最小行为：

- primary / secondary keys；
- regex / case-sensitive / whole-word；
- scan depth；
- before / after / atDepth / author_note_top / author_note_bottom；
- order；
- recursive 一层以上；
- macro expansion trace；
- prompt block 注入到 `buildPrompt`。

验收：engine-core typecheck/build/test 通过；新增 fixture tests 覆盖 WI activation 与 prompt assembly。

### P2：ydltavern-engine capability integration

范围：只改 `packages/ydltavern-engine`。

新增：

- `world_info.evaluate` 调 engine-core WI evaluator；
- `preset.compile` 接收 prompt-critical 输入并注入 blocks；
- `turn.generate` frames 附带 prompt-critical diagnostics；
- tests 覆盖 JSON-RPC invoke。

验收：engine package typecheck/build/test 通过；仍无网络、无 secret。

### P3：st-compat slash/macro core

范围：只改 `packages/ydltavern-st-compat`。

新增：

- macro registry / `substituteParams` 扩展；
- slash command registry / parser / executor；
- 内置 `/gen`、`/continue`、`/swipe`、`/setvar`、`/getvar`、`/if`、`/run` 最小行为；
- `createSTContext()` 暴露 slash host。

验收：st-compat typecheck/build/test 通过；slash 能触发 fake Generate / continue / swipe，变量可读写。

### P4：surface diagnostics slice

范围：只改 `packages/ydltavern-surface`。

新增：

- Prompt-critical diagnostics panel；
- Slash/macro diagnostics panel；
- 通过 surface 展示 WI activated/skipped、prompt blocks、macro trace、slash result。

验收：surface typecheck/build 通过；仍不恢复独立 app shell。

### P5：文档收敛与计划删除

范围：文档与矩阵。

动作：

- 删除本临时计划与英文镜像；
- 更新 README、ARCHITECTURE、COMPATIBILITY_MATRIX；
- 更新 C/E/I/G tracks；
- 全包验证；
- commit/push。

## 明确不做

- 不做真实模型出网；
- 不存 raw secrets；
- 不 import Yggdrasil 内部；
- 不建独立 desktop/web/app shell；
- 不实现完整第三方扩展 loader；
- 不宣称字节级 ST PromptManager 对齐；
- 不实现 vector WI、sticky/cooldown/delay、完整 MacroEngine、slash autocomplete/debugger。
