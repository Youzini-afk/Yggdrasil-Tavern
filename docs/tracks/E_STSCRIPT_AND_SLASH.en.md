# E Track: STScript and Slash Commands

> [English](./E_STSCRIPT_AND_SLASH.en.md) · [中文](./E_STSCRIPT_AND_SLASH.md)

## Scope

Reimplement ST's slash command parser, built-in commands, macro engine, variable domains, and control flow (`/if` / `/while` / `/times` / `/run` / `/let` / `/closure-*`) in YdlTavern.

Includes:

- 153+ built-in slash commands (including variables, math, world books, tags, tools, sysprompt, quick reply)
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

## Out of scope

- Replacing STScript with another language — keep STScript compatibility
- Adding syntax sugar that ST does not have to STScript — keep pure compatibility

## Completion criteria

- All 153+ slash commands are upgraded to `implemented` in `COMPATIBILITY_MATRIX.en.md`
- All 80+ macros are upgraded to `implemented` in the matrix
- Mainstream STScript libraries from the ST community (quick reply collections, etc.) can run
