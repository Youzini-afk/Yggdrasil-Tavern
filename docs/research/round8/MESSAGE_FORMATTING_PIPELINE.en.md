# Message Formatting Pipeline

> [English](./MESSAGE_FORMATTING_PIPELINE.en.md) · [中文](./MESSAGE_FORMATTING_PIPELINE.md)

This document records the YdlTavern Round 8 implementation of ST-style `messageFormatting()`.

## Goal

SillyTavern extensions and themes expect message bodies to be HTML inside `.mes_text`. Before Round 8, YdlTavern rendered message text mostly as React text. Round 8 moved the surface to a formatted HTML pipeline aligned with ST.

## Source Locations

Implementation lives under:

```text
packages/ydltavern-surface/src/formatting/
  converter.ts
  sanitize.ts
  style-tags.ts
  message-formatting.ts
  hooks.ts
  index.ts
```

React consumption happens in the message bubble rendering path, where `.mes_text` is populated with `dangerouslySetInnerHTML` from `formatMessage()`.

## Pipeline

The YdlTavern pipeline follows the ST order:

```text
input text
  → preMarkdown hooks
  → ST markdown preparation
  → showdown conversion
  → preSanitize hooks
  → DOMPurify sanitize and hooks
  → style tag decode / class normalization
  → HTML string returned
  → React inserts into .mes_text
  → postRender hooks run with the DOM node
```

The important contract is that extensions observe the same kind of output ST produces: sanitized HTML in a stable `.mes_text` node.

## Showdown Layer

The converter uses showdown because ST uses showdown. The configuration mirrors audited ST options:

- emoji;
- literal mid-word underscores;
- image dimensions;
- tables;
- underline;
- simple line breaks;
- strikethrough;
- disabled forced four-space indented sublists.

YdlTavern also carries ST-compatible markdown exclusion and underscore behavior. If future markdown behavior changes, it should be compared against ST output before being accepted.

## Sanitizer Layer

The sanitizer uses DOMPurify because ST uses DOMPurify. The sanitizer is not a generic afterthought; its hooks are part of compatibility.

Key behavior:

- strip script-like payloads and unsafe attributes;
- keep link behavior compatible with ST safety attributes;
- prefix regular CSS classes with the ST `custom-` behavior while preserving known class families;
- allow the controlled custom style path;
- scope decoded style selectors to `.mes_text`;
- preserve media only through the audited allow-list.

Security-sensitive sanitizer changes should be reviewed as both security changes and compatibility changes.

## Hooks

Round 8 exposes formatting hooks around the major stages:

- `preMarkdown` for text-level extension transformations before markdown;
- `preSanitize` for HTML-level transformations before DOMPurify;
- `postRender` for DOM-level callbacks after React inserts the message body.

Hook failures should not break the entire render path. They should be caught and reported.

## Divergence from ST

The intended divergence is minimal. Known differences are implementation-bound rather than policy-bound:

- YdlTavern runs inside a React shell, so insertion is done by React through `dangerouslySetInnerHTML`.
- The formatting implementation is modularized into TypeScript files rather than living in one large `script.js`.
- Some rare ST legacy library interactions may still need additional shims when real extensions expose them.
- Test coverage is explicit and package-local rather than relying on manual UI inspection.

The user-visible contract should remain ST-like: markdown in, sanitized `.mes_text` HTML out.

## React Boundary

React owns the moment when the HTML string is inserted. After insertion:

- `.mes_text` exists with ST-compatible classes;
- post-render hooks can inspect or modify the node;
- extension-owned sibling slots such as `.mes_buttons_extra` are not reconciled by React;
- React may rerender the message if YdlTavern state changes, so persistent extension UI should use ceded slots rather than mutating core text content without coordination.

## Tests

Round 8 added surface tests around:

- showdown configuration;
- sanitizer XSS vectors;
- style tag prefixing;
- end-to-end message formatting;
- hook registration and removal;
- HTML rendering inside `.mes_text`.

The documented Round 8 close count is 88 passing tests in `ydltavern-surface`.

## Maintenance Rules

- Prefer matching ST source behavior over inventing a cleaner markdown abstraction.
- Keep sanitizer hooks close to the audited ST behavior.
- Add regression tests for any extension-reported formatting difference.
- Treat `.mes_text` as an extension-facing ABI.
- Do not replace this path with React markdown unless a compatibility layer proves equivalent output.
