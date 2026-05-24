# E Track: STScript and Slash Commands

> [English](./E_STSCRIPT_AND_SLASH.en.md) · [中文](./E_STSCRIPT_AND_SLASH.md)

## Scope

Reimplement ST's slash command parser, built-in commands, macro engine, variable domains, and control flow (`/if` / `/while` / `/times` / `/run` / `/let` / `/closure-*`) in YdlTavern.

Includes:

- 199 ST canonical built-in slash commands (including variables, math, world books, tags, tools, sysprompt, quick reply)
- 80+ macros (including legacy non-brace macros and new engine brace macros)
- STScript parser: closures, scope, named/unnamed args, parser flags, break/breakpoint
- Variable domains: local (chat) / global / scoped / closure-serialized

## Ground truth

The `SLASH_COMMANDS` and `MACROS` sections in `docs/inventory/CORE_EVENTS_AND_COMMANDS.raw.md`.

## Deliverables

- `script/parser/` — STScript parser aligned with `SlashCommandParser.js` behavior
- `script/commands/` — all built-in command implementations, grouped by ST file structure
- `script/macros/` — macro engine + all built-in macro definitions
- `script/variables/` — local / global / scoped / closure variable store
- Alignment fixture: run the same ST script and compare output

## Alignment strategy

```text
input:  STScript text (including closures, macros, variables, control flow)
output: execution trace exactly matches ST (command call order, variable value changes, final output)
```

Side effects of ST commands such as `/echo`, `/inject`, and `/listinjects` must also be reproduced strictly.

## Dependencies

- Track D contract (command registration uses ST `SlashCommandParser`-style API)
- Track C (`/gen` `/genraw` `/continue` `/regenerate` `/swipe` directly call generate)
- Track B (`/world` `/getchatbook`, etc. read assets)

## Current status

`packages/ydltavern-st-compat` now has the deep-ported E-track modules:

- `macros-st.ts` — `substituteSTMacrosDeep` with PRE_PROCESSORS normalizing `<USER>`/`<BOT>`/`<GROUP>`/`<CHARIFNOTGROUP>`/legacy `{{time_UTC±N}}`; comment macros `{{// ...}}`; full env macro registry (user/char/description/personality/scenario/persona/group/groupNotMuted/charPrompt/charInstruction/charDepthPrompt/charCreatorNotes/mesExamples/charFirstMessage/charVersion/model/original/isMobile + aliases); time macros (time/date/weekday/isotime/isodate/datetimeformat/idleDuration/timeDiff/time::UTC±N); variable macros (getvar/setvar/addvar/incvar/decvar/hasvar/deletevar + global versions); state (lastGenerationType/hasExtension); instruct prefixes/suffixes; chat (lastMessage/lastUserMessage/etc); core (newline/space/noop/trim/random/pick/roll); recursive expansion with frozen env; `PickState` for stable per-chat picks.
- `stscript-st.ts` — `PARSER_FLAG.STRICT_ESCAPING`/`REPLACE_GETVAR`; `ParserFlags` with clone; `ARGUMENT_TYPE` enum; `SlashCommandParserError`/`SlashCommandExecutionError`/`SlashCommandAbortError`; `SlashCommandScope` with parent chain, pipe fallback, getVariable numeric coercion + JSON index, setVariable nearest-owner mutation, letVariable throw on duplicate; `AbortController_`/`BreakController` (shared between closure and getCopy); `SlashCommandClosure` with executor list, abort/break/debug controllers, executeNow flag, `executeDirect` returning `{ pipe, isBreak, isAborted, isQuietlyAborted, abortReason }`; `lintPipeValue` normalizing types per ST `#lintPipe`; pipe injection rules (single `|` injects, `||` skips); `compareValues` for if/while (eq/neq/in/nin/gt/gte/lt/lte/not); `GlobalVariables`; `SlashCommandRegistry` with alias resolution.
- `createSTContext()` exposes `registerSlashCommand`, `executeSlashCommands`, `slashCommands`, `slashDiagnostics`, and variables.
- expanded `substituteParams` for user/char, character fields, persona, time/date, dynamic overrides, and trace;
- slash registry / parser / executor;
- built-in `/gen`, `/continue`, `/swipe`, `/setvar`, `/getvar`, `/if`, and `/run` minimum behavior.
- Earlier batches added C/D/E/F; later work added H-N. Together with the existing A/B/G batches, 14 batches (A-N) now provide ~150+ slash command registrations covering 199 ST canonical commands through real implementations, plan-only descriptors, and explicit unsupported sentinels.

This is still `partial`. The full STScript runtime (scope chain, closures, pipe injection, abort/break, compareValues, registry + alias resolution), full macro engine, and batches A-N canonical command coverage are now in place. Still pending: moving plan-only / unsupported commands to executable paths when safe, autocomplete/debugger, and byte-level STScript behavior alignment.

## Out of scope

- Replacing STScript with another language — keep STScript compatibility
- Adding syntax sugar that ST does not have to STScript — keep pure compatibility

## Completion criteria

- All 199 ST canonical slash commands have real / plan-only / unsupported coverage in `COMPATIBILITY_MATRIX.en.md`; safe plan-only / unsupported items are gradually upgraded to executable / implemented
- All 80+ macros are upgraded to `implemented` in the matrix
- Mainstream STScript libraries from the ST community (quick reply collections, etc.) can run
