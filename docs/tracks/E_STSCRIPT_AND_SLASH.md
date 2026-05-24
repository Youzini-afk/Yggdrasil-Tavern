# E 轨道：STScript 与 slash 命令

> [English](./E_STSCRIPT_AND_SLASH.en.md) · [中文](./E_STSCRIPT_AND_SLASH.md)

## 范围

把 ST 的 slash command 解析器、内置命令、宏引擎、变量域、控制流 (`/if` / `/while` / `/times` / `/run` / `/let` / `/closure-*`) 在 YdlTavern 重新实现。

包括：

- 199 个 ST canonical 内置 slash commands（含变量、数学、世界书、tags、tools、sysprompt、quick reply）
- 80+ 个宏（含遗留非花括号 macros 和新引擎花括号 macros）
- STScript 解析器：闭包、scope、named/unnamed args、parser flags、break/breakpoint
- 变量域：local（chat）/ global / scoped / closure-serialized

## ground truth

`docs/inventory/CORE_EVENTS_AND_COMMANDS.raw.md` 的 `SLASH_COMMANDS` 和 `MACROS` 段。

## 交付

- `script/parser/` —— STScript 解析器，跟 `SlashCommandParser.js` 行为对齐
- `script/commands/` —— 全部内置命令实现，按 ST 文件结构分组
- `script/macros/` —— 宏引擎 + 全部内置宏定义
- `script/variables/` —— local / global / scoped / closure variable store
- alignment fixture：跑 ST 同一段 script，输出对比

## 对齐策略

```text
input:  STScript 文本（含闭包、宏、变量、控制流）
output: 执行 trace 跟 ST 完全一致（命令调用顺序、变量值变化、最终输出）
```

注意 ST 命令的 `/echo` `/inject` `/listinjects` 等行为副作用都要严格复刻。

## 依赖

- D 轨道 contract（命令注册走 ST `SlashCommandParser` 风格 API）
- C 轨道（`/gen` `/genraw` `/continue` `/regenerate` `/swipe` 直接调 generate）
- B 轨道（`/world` `/getchatbook` 等读资产）

## 当前状态

`packages/ydltavern-st-compat` 已有 E 轨深度移植：

- `macros-st.ts` —— `substituteSTMacrosDeep` with PRE_PROCESSORS normalizing `<USER>`/`<BOT>`/`<GROUP>`/`<CHARIFNOTGROUP>`/legacy `{{time_UTC±N}}`；comment macros `{{// ...}}`；full env macro registry (user/char/description/personality/scenario/persona/group/groupNotMuted/charPrompt/charInstruction/charDepthPrompt/charCreatorNotes/mesExamples/charFirstMessage/charVersion/model/original/isMobile + aliases)；time macros (time/date/weekday/isotime/isodate/datetimeformat/idleDuration/timeDiff/time::UTC±N)；variable macros (getvar/setvar/addvar/incvar/decvar/hasvar/deletevar + global versions)；state (lastGenerationType/hasExtension)；instruct prefixes/suffixes；chat (lastMessage/lastUserMessage/etc)；core (newline/space/noop/trim/random/pick/roll)；recursive expansion with frozen env；`PickState` for stable per-chat picks。
- `stscript-st.ts` —— `PARSER_FLAG.STRICT_ESCAPING`/`REPLACE_GETVAR`；`ParserFlags` with clone；`ARGUMENT_TYPE` enum；`SlashCommandParserError`/`SlashCommandExecutionError`/`SlashCommandAbortError`；`SlashCommandScope` with parent chain, pipe fallback, getVariable numeric coercion + JSON index, setVariable nearest-owner mutation, letVariable throw on duplicate；`AbortController_`/`BreakController` (shared between closure and getCopy)；`SlashCommandClosure` with executor list, abort/break/debug controllers, executeNow flag, `executeDirect` returning `{ pipe, isBreak, isAborted, isQuietlyAborted, abortReason }`；`lintPipeValue` normalizing types per ST `#lintPipe`；pipe injection rules (single `|` injects, `||` skips)；`compareValues` for if/while (eq/neq/in/nin/gt/gte/lt/lte/not)；`GlobalVariables`；`SlashCommandRegistry` with alias resolution。
- `createSTContext()` 暴露 `registerSlashCommand`、`executeSlashCommands`、`slashCommands`、`slashDiagnostics`、variables。
- 扩展 `substituteParams`，支持 user/char、character fields、persona、time/date、dynamic overrides 和 trace；
- slash registry / parser / executor；
- 内置 `/gen`、`/continue`、`/swipe`、`/setvar`、`/getvar`、`/if`、`/run` 最小行为。
- 早期工作补齐 batches C/D/E/F，后续工作又补齐 H-N。连同既有 A/B/G，当前 14 个 batches（A-N）约 150+ 个 slash command registrations 覆盖 199 个 ST canonical commands：真实实现、plan-only descriptor 与明确 unsupported sentinel 三类并存。

这仍是 `partial`。当前已有完整的 STScript runtime（scope chain、closure、pipe injection、abort/break、compareValues、registry + alias resolution）、完整的宏引擎和 batches A-N canonical command 覆盖。仍待完成：把 plan-only / unsupported commands 推到可执行（如安全策略允许）、autocomplete/debugger、字节级 STScript 行为对齐。

## 不在范围内

- 把 STScript 替换成另一种语言——保持 STScript 兼容
- 给 STScript 加 ST 没有的语法糖——保持纯兼容

## 完成判据

- 全部 199 ST canonical slash commands 在 `COMPATIBILITY_MATRIX` 至少有 real / plan-only / unsupported 覆盖；逐步把安全的 plan-only / unsupported 项升级到 executable / implemented
- 全部 80+ 宏在矩阵升级到 `implemented`
- ST 社区主流 STScript 库（quick reply 集合等）能跑通
