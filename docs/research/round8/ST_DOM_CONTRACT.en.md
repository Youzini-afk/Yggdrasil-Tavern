# ST DOM Contract Ledger

> [English](./ST_DOM_CONTRACT.en.md) · [中文](./ST_DOM_CONTRACT.md)

This ledger records the SillyTavern page contract that Round 8 mirrored. It is reference material for future compatibility fixes.

## Message Formatting Entry Point

ST's `messageFormatting()` pipeline is located in `script.js:1753-1911` in the audited source. YdlTavern treats that function as the observable message HTML contract.

Pipeline order:

1. receive raw message text and formatting options;
2. run extension regex / pre-formatting behavior where applicable;
3. protect code and quote-like regions that should not be transformed incorrectly;
4. run showdown markdown conversion;
5. sanitize the HTML through DOMPurify;
6. apply DOMPurify hooks for links, classes, media, and custom style behavior;
7. prefix or normalize extension-facing classes where ST does;
8. return HTML for insertion into `.mes_text`.

The important output is an HTML string, not a React element tree.

## Showdown Configuration

ST configures showdown in `script.js:520-537`. The audited options were:

```text
emoji: true
literalMidWordUnderscores: true
parseImgDimensions: true
tables: true
underline: true
simpleLineBreaks: true
strikethrough: true
disableForced4SpacesIndentedSublists: true
```

ST also installs markdown extensions equivalent to:

- `markdownUnderscoreExt()`;
- `markdownExclusionExt()`.

YdlTavern's converter should preserve those observable behaviors before adding any YdlTavern-specific rendering feature.

## DOMPurify Hooks

ST's DOMPurify hook behavior was audited from `chats.js:1901-2009`.

Relevant behavior:

- allow the custom `custom-style` tag path used by ST style-tag handling;
- `afterSanitizeAttributes` sets external link safety attributes such as `target="_blank"` and `rel="noopener"` / `noreferrer` where appropriate;
- `uponSanitizeAttribute` prefixes ordinary classes with `custom-` while preserving known exceptions such as `fa-`, `note-`, and `monospace`;
- `uponSanitizeElement` enforces media allow-lists and line-break behavior;
- style tags are encoded before sanitize and decoded after sanitize;
- CSS selectors inside custom style blocks are scoped to `.mes_text`.

The purpose is both compatibility and safety: extensions expect ST's class names and users expect script-like payloads to be stripped.

## Core Extension DOM Anchors

The following anchors are part of the page contract.

| Selector | ST role | YdlTavern Round 8 role |
|---|---|---|
| `#chat` | chat message list | rendered by React as the message list root |
| `.mes` | message item | rendered by React |
| `.mes_block` | message content block | rendered by React |
| `.mes_text` | message HTML body | rendered by `formatMessage()` + `dangerouslySetInnerHTML` |
| `.mes_buttons` | message action area | rendered by React with extension slot |
| `.mes_buttons_extra` | extension message buttons | child territory ceded to extensions |
| `#extensions_settings` | primary extension settings | empty container ceded to extensions |
| `#extensions_settings2` | secondary extension settings | empty container ceded to extensions |
| `#extensionsMenu` | top-bar extension menu | empty container ceded to extensions |
| `#movingDivs` | movable/floating popups | empty container ceded to extensions |
| `#leftSendForm` | left composer button region | ceded extension area |
| `#rightSendForm` | right composer button region | ceded extension area |
| `#send_textarea` | input textarea | React-owned control |
| `#send_but` | send button | React-owned control |

The cession rule is simple: React may create the node, but it must not reconcile children inside extension-owned anchors.

## Globals on `globalThis`

ST exposes much of its runtime as globals or effectively-global ESM exports. Round 8 mirrors the commonly used values onto `globalThis` / `window` with `mountSTGlobals()`.

Expected page globals include:

- `SillyTavern` with `libs` and `getContext()`;
- `eventSource` and `event_types`;
- `chat`, `characters`, `this_chid`, `chat_metadata`;
- `extension_settings`, `extension_prompt_types`, `extension_prompt_roles`;
- `groups`, `selected_group`, `name1`, `name2`;
- slash command parser and registration helpers;
- save/reload/chat metadata helper functions;
- message formatting and substitution helpers;
- generation helpers;
- jQuery and legacy libraries where mounted.

These globals should be installed before extension modules run.

## ESM Exports

Many ST extensions import named exports rather than reading `window` directly. Round 8 serves shims that re-export live values from `globalThis`.

Common modules:

| Module URL | Expected role |
|---|---|
| `/script.js` | top-level chat/context/generation globals |
| `/scripts/extensions.js` | extension settings and manager helpers |
| `/scripts/events.js` | event bus and event type constants |
| `/scripts/st-context.js` | `getContext()` facade |
| `/scripts/group-chats.js` | group chat state |
| `/scripts/secrets.js` | safe secret facade |
| `/scripts/power-user.js` | power-user settings object |

The shim files exist so static browser ESM resolution succeeds before extension code executes.

## Ownership Boundaries

Round 8 uses three ownership categories:

1. **React-owned** — React controls value and children; extensions may observe but should not rely on mutations persisting.
2. **React-rendered / extension-ceded** — React creates a stable empty node and does not reconcile children.
3. **Cooperative** — React renders a wrapper and default controls, while a named child slot is ceded.

`.mes_buttons_extra` is cooperative. `#extensions_settings` is ceded. `#send_textarea` is React-owned.

## Compatibility Notes

- If a new extension expects another ST DOM ID, add it as a stable anchor rather than asking the extension to patch itself.
- If a new extension imports another ST module URL, prefer adding a shim at that URL.
- If a new extension expects a legacy library global, audit the dependency and add an AGPL-compatible shim or document the gap.
- Do not move back to iframe-only hosting for ST compatibility; that breaks the page contract.
