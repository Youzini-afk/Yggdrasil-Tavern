# G Track: UI Rewrite

> [English](./G_UI_REWRITE.en.md) · [中文](./G_UI_REWRITE.md)

## Scope

The YdlTavern frontend is newly written with React + TypeScript + Vite + Tauri. The visual design and operation flow stay familiar to old ST users, while performance and maintainability are rebuilt.

Includes:

- Top menu (Character / Persona / Settings / Extensions / World Info / etc.)
- Main chat panel (message rendering / thinking collapse / tool calls / swipe / edit / branch)
- Settings drawer (Connection / Sampler / Preset / Persona / Theme / WorldInfo / Extensions)
- Extension drawer (Quick Reply / Caption / Gallery / TTS / Translate / Memory / Vectors / etc.)
- Theme system (CSS variable, compatible with ST theme files)
- Mobile responsive layout
- Software-level performance: virtual list / incremental rendering / streaming tokens without freezes

## Key decisions

- **Turn render unit**: UI renders Turns directly, not chat[]. chat[] is only the projection seen by old extensions.
- **Thinking collapse**: `thinking` subs are collapsed by default and can be expanded. Multiple tool calls are shown as collapsible child items inside one Turn.
- **Swipe at the Turn layer**: left/right switching changes the whole Turn variant, not a single message.
- **Same contract**: UI gets data, triggers generate, and listens for events through the track D ST API surface. UI has no "private API straight to backend" path.
- **Hot paths use wasm**: tokenization, WI trigger evaluation, macro expansion, regex application — all use wasm modules (provided by tracks C / I).

## Alignment strategy

Unlike byte-level alignment, UI alignment uses real old-user follow-up plus screenshot comparison. This part of `COMPATIBILITY_MATRIX.en.md` uses qualitative descriptions:

- "chat panel +0%" `inventoried`
- "chat panel base layout" `partial`
- "swipe / edit / branch / group chat rotation UI" `implemented`

## Performance goals

Current ST pain points:

- Long chats (5K+ messages) stutter because the DOM is fully rendered
- jQuery whole-document listeners
- Streaming output rerenders the whole message on each token
- WI triggers are slow because they use JS string contains loops

YdlTavern goals (Tauri desktop + ordinary i5):

- 10K Turn list scrolls at 60 FPS
- Streaming token receive at 200+ token/s without dropped frames
- WI trigger under 50ms for 1K-entry scale

## Dependencies

- Track D contract (UI is a consumer of the ST API)
- Track C (generation, streaming)
- Track B (asset display)
- Track I (WI trigger engine)

## Out of scope

- A fully redesigned "innovative UI" — familiarity comes first
- Copying ST's jQuery DOM structure verbatim — keep visual familiarity, but write new code

## Completion criteria

- Main operation flows match ST (users can switch from ST with zero learning cost)
- Performance goals are met
- Theme files can be loaded and applied correctly
- Mobile is usable
