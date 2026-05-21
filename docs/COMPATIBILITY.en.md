# Inheriting from SillyTavern

> [English](./COMPATIBILITY.en.md) · [中文](./COMPATIBILITY.md)

YdlTavern aims for near-complete coverage of SillyTavern. This document is the high-level map. The detailed compatibility matrix, extension API surface, and migration paths fill in as implementation rolls out.

## Three layers of inheritance

Coverage isn't one-size-fits-all. It splits cleanly into three layers.

### 1. Assets — direct import

Anything that's just a format gets imported as-is:

- Character cards: V1, V2, V3, including PNG-embedded metadata.
- World books / lorebooks.
- Prompt presets.
- Chat history JSONL.
- Personas, groups, quick replies.
- Theme CSS.

How: YdlTavern reads the old formats directly, lands them in internal storage, and calls Yggdrasil's generic capability packages (`persona-lab` / `knowledge-lab` / `context-lab`) for normalization. The original payload is preserved.

### 2. UI — fully rewritten but familiar

The frontend code is new, but the look and feel stays familiar to longtime users:

- Top menu, main chat panel, settings drawer, extensions drawer keep the same overall layout.
- The CSS variable theming system stays compatible with old theme files.
- Interactions (swipe / regenerate / continue / branch / group rotation / quick reply / slash commands) match.
- Palette, spacing, and typography are tunable; defaults stay close to SillyTavern.

This isn't copy-paste from SillyTavern's HTML. It's a rewrite informed by its structure — done that way to fix performance, accessibility, and state management at the same time.

### 3. Extensions — covered through a compatibility layer

Old SillyTavern extensions, sorted by the runtime shape they assume:

| Kind | How it's covered |
|---|---|
| Use ST global APIs (`getContext()`, `eventSource`, `saveSettingsDebounced`, etc.) | Compatibility layer provides matching objects; underneath it forwards to Yggdrasil's public protocol |
| Slash commands / STScript macros | Compatibility layer takes over parsing and execution |
| Quick replies, themes, UI panel-style frontend extensions | Compatibility layer offers ST-shaped hooks |
| Extensions that touch the DOM directly | Most still run; a few that depend on specific DOM structure need adaptation |
| Extensions that bring third-party deps or long runtimes | Run inside the compatibility layer + Yggdrasil sandbox without breaking isolation |

Loading: the old extension layout (`manifest.json` + `index.js`) is supported directly — drop it in and it loads.

## What YdlTavern brings that's new

While inheriting from the old, the engine underneath is modern. These come from Yggdrasil — YdlTavern doesn't reinvent them:

- Modern database / variable storage (not cramming everything into one JSON read-write cycle).
- Modern tool calls and function calling.
- MCP (Model Context Protocol).
- Skills.
- Multi-agent frameworks.
- Vector retrieval / long-term memory.
- Streaming lifecycle, cancellation, timeouts.
- Outbound audit, `secret_ref`, network declarations.

Old extensions don't see any of this — they keep using the ST-shaped API. New extensions get to choose: stay on the ST API for compatibility, or talk directly to Yggdrasil's public protocol for the full modern toolkit.

## What's not in scope

Be honest about the limits:

- Extensions tightly coupled to a specific SillyTavern implementation detail (a UI library version, an exact DOM structure, an internal state format) need adaptation — 100% drop-in is not realistic for those.
- Experimental APIs the SillyTavern community already abandoned and stopped maintaining are not part of the compatibility layer.
- Old SillyTavern bug behavior (edge-case side effects) won't be copied — but the migration guide will call out the differences.

## Compatibility matrix

The exact API surfaces, extensions, and asset formats covered will be tracked in a living document as implementation progresses. No pre-implementation coverage number is promised.

## Verification

Every claim of coverage gets a verification path:

- Assets: regression imports against real SillyTavern character cards, world books, presets, and chat histories.
- UI: side-by-side screenshots plus walkthroughs with longtime users.
- Extensions: run a curated set of popular community extensions and grade them (drop-in / minor adaptation / unsupported).

The execution plan lands when implementation starts.
