# SillyTavern Compatibility Projection

> [English](./COMPAT_PROJECTION.en.md) · [中文](./COMPAT_PROJECTION.md)

Old SillyTavern extensions see the world as `chat[]`, `eventSource`, `getContext()`, `event_types`, and various global functions. They do not know that YdlTavern uses the Turn model internally. This document defines the rules for projecting the Turn model into an ST-compatible external surface.

Byte-level alignment is the goal, not a promise. The rules below try to reproduce current ST behavior. Final coverage is shown transparently in [`../COMPATIBILITY_MATRIX.en.md`](../COMPATIBILITY_MATRIX.en.md).

## Three projection surfaces

1. `chat[]` — `getContext().chat` is a flat view derived from the current active turns
2. `eventSource` — YdlTavern internal events are mapped to ST `event_types` by rule
3. `getContext()` — the whole context object is derived from YdlTavern state by rule

## chat[] projection

Each non-hidden, non-deleted Turn projects into one or more chat entries.

### Base shape

```js
chat[i] = {
  is_user: turn.role === 'user',
  is_system: turn.hidden || turn.role === 'system',
  name: resolveSpeakerName(turn),
  send_date: formatSTDate(variant.created_at),
  mes: composeMainText(variant),
  swipe_id: turn.active_variant,
  swipes: turn.variants.map(composeMainText),
  swipes_info: turn.variants.map(composeSwipeInfo),
  extra: composeExtra(turn, variant),
  // ...
}
```

For a field-level list, see the CHAT_MESSAGE_SHAPE section in [`../inventory/CORE_EVENTS_AND_COMMANDS.raw.md`](../inventory/CORE_EVENTS_AND_COMMANDS.raw.md).

### The `mes` field

`mes` is the "main text of this message" expected by ST. It is composed from the active variant:

| sub kind | Enters `mes` | Alternative projection |
|---|---|---|
| `text` | Yes, concatenated in order with line breaks | — |
| `thinking` | No | `extra.reasoning` (field added by ST later) |
| `tool_call` | No | `extra.tool_invocations[]` |
| `tool_result` | No | `extra.tool_invocations[*].result` |
| `image` | No | `extra.image` / `extra.images[]` |
| `audio` | No | `extra.audio` |
| `attachment` / `file_embed` | No | `extra.file` / `extra.files[]` |
| `note` | No | `extra.notes[]` |

If an old extension changes `chat[i].mes` through an ST-style API, the compatibility layer parses it back into the current variant's main text subs and rewrites it with a variant fork.

### The `extra` field

ST stuffs all special data into `extra`. This is the compatibility entry point and must be kept. Common fields (see inventory for the mechanically scanned list):

```text
extra.reasoning                 thinking
extra.tool_invocations[]        tool calls
extra.api / extra.model         which API / model
extra.token_count
extra.image / extra.images[]
extra.audio
extra.file / extra.files[]
extra.bias
extra.gen_id
extra.regex_evaluations
extra.translated
extra.tts_audio
extra.image_swipes[]
extra.is_internal_step          YdlTavern private: marker when a sub is projected as an independent entry
... and fields added by ST built-in extensions themselves
```

Unrecognized `extra.*` fields are all preserved as-is. Extensions that use `extra` as a communication channel do not conflict with each other.

### Swipe

```js
chat[i].swipe_id      // current active_variant index
chat[i].swipes        // main text for each variant
chat[i].swipes_info   // metadata for each variant
```

Old extension calls swipe API → compatibility layer switches `active_variant` → projection is rebuilt.

### Multi-sub-as-multi-entry mode

Some extensions (vectors, tts, translate) assume through `MESSAGE_*` events that each message is an independent chat entry. If one Turn has multiple independent thinking + tool_call + final response segments that need to be observed independently by these extensions, the compatibility layer can project them into consecutive chat entries, marked with `extra.is_internal_step`. The frontend does not display them again.

For old extensions: it looks like multiple messages were pushed.
For YdlTavern: it is still the same Turn.

## eventSource mapping

YdlTavern internal events → ST `event_types` one-way mapping, one-to-one or one-to-many. See inventory for the full ST event list, about 90+ events. Key mappings are below. The rest will be filled in during implementation:

| YdlTavern internal event | ST `event_types` |
|---|---|
| `turn.user_input.submitted` | `MESSAGE_SENT` + `USER_MESSAGE_RENDERED` |
| `turn.generation.started` | `GENERATION_STARTED` |
| `turn.generation.streaming_token` | `STREAM_TOKEN_RECEIVED` |
| `turn.generation.completed` | `MESSAGE_RECEIVED` + `CHARACTER_MESSAGE_RENDERED` + `GENERATION_ENDED` |
| `turn.swipe.changed` | `MESSAGE_SWIPED` |
| `turn.swipe.deleted` | `MESSAGE_SWIPE_DELETED` |
| `turn.text_edited` | `MESSAGE_EDITED` + `MESSAGE_UPDATED` |
| `turn.deleted` | `MESSAGE_DELETED` |
| `turn.thinking.edited` | `MESSAGE_REASONING_EDITED` |
| `turn.thinking.deleted` | `MESSAGE_REASONING_DELETED` |
| `chat.changed` | `CHAT_CHANGED` |
| `chat.created` | `CHAT_CREATED` |
| `chat.deleted` | `CHAT_DELETED` |
| `chat.renamed` | `CHAT_RENAMED` |
| `worldinfo.activated` | `WORLD_INFO_ACTIVATED` |
| `worldinfo.scan_done` | `WORLDINFO_SCAN_DONE` |
| `tool_call.performed` | `TOOL_CALLS_PERFORMED` |
| `tool_call.rendered` | `TOOL_CALLS_RENDERED` |
| `prompt.combined.before` | `GENERATE_BEFORE_COMBINE_PROMPTS` |
| `prompt.combined.after` | `GENERATE_AFTER_COMBINE_PROMPTS` |
| `prompt.ready.chat_completion` | `CHAT_COMPLETION_PROMPT_READY` |

Dispatch order follows ST habits. Extensions such as vectors, translate, and regex depend on specific ordering.

Old extensions continue to use `eventSource.on('xxx', handler)`. The handler receives a payload with the same shape ST would dispatch at the equivalent point. New extensions may instead subscribe to the event stream through the Yggdrasil public protocol and receive fully structured events.

## getContext() projection

Old extensions expect the object returned by `getContext()` to roughly contain:

```text
chat, characters, groups, groupId, characterId, chatId
name1, name2, extensionSettings, saveSettingsDebounced
addOneMessage, saveChat, saveChatConditional, scrollOnMediaLoad
power_user, oai_settings, textgenerationwebui_settings, kai_settings, nai_settings
substituteParams, Generate, getRequestHeaders, getTokenCountAsync
... and a long list of helpers
```

The compatibility layer provides this object. Each field is projected from YdlTavern state:

- `chat` — Lazy Proxy, wrapping the flat view of the current branch's active turns
- `characters` — ST V1/V2/V3-compatible shape of the YdlTavern character library
- `extensionSettings` — bridge to YdlTavern's extension settings storage
- Functions (`Generate` / `addOneMessage` / `saveChat` / `substituteParams`) — reimplemented by the compatibility layer, internally using the YdlTavern engine + Yggdrasil protocol

The full `getContext()` field list is maintained from mechanical scan results. M2 will add a standalone `inventory/GLOBAL_API.md`.

## chat[] write paths

Old extensions will do:

| Operation | Compatibility layer handling |
|---|---|
| `chat.push(message)` | Intercept and convert to a new Turn |
| `chat[i].mes = '...'` | Proxy setter, convert to variant fork |
| `chat.pop()` | Delete the last turn (soft delete) |
| `chat.splice(i, 1)` | Delete turn i (soft delete) |
| `chat.length` | Flat length after projection |
| Directly iterate chat[] | Use lazy proxy, without materializing everything up front |

JavaScript Proxy is the key. `chat` is not a real array. It is a Proxy. Reads are lazy projections. Writes are intercepted and routed.

## Prompt construction alignment

Old ST extensions listen through `eventSource` for events such as `GENERATE_BEFORE_COMBINE_PROMPTS` / `GENERATE_AFTER_COMBINE_PROMPTS` / `CHAT_COMPLETION_PROMPT_READY`, and may modify the prompt about to be sent.

YdlTavern also dispatches these events in the generate flow, providing a modifiable prompt payload consistent with ST. After changes are applied, the real model call happens.

The internal prompt construction order (preset prompt manager + char description + persona + scenario + dialogue examples + chat history + author's note + world info + post-history-instructions) stays byte-aligned with ST. See `PROMPT_MANAGER_IDENTIFIERS` in inventory for concrete identifiers and injection points. This is owned by track C, engine core.

## ST behavior not projected

The following ST internals are not mapped. YdlTavern replaces them with modern implementations:

- `chat_metadata`: stored directly in chat-level meta. Old extensions see an ST-style proxy through `getContext()`.
- ST jQuery events / DOM selectors: the frontend is new code. The DOM structure has compatibility declarations, but selector-by-selector parity is not guaranteed.
- ST global `settings` object's internal grouping: YdlTavern uses its own settings schema and gives old extensions an ST-style proxy view.

Extensions that directly depend on the ST DOM structure (jQuery selectors looking for a specific div) are listed as "requires adaptation" and marked separately in `COMPATIBILITY_MATRIX.en.md`.

## Out of scope

- Reproducing current undocumented ST internal timing behavior — only officially stable event / API order is reproduced
- Reproducing historical ST bugs — marked in inventory as `bug_compat=false`
- Temporary APIs that existed only in a specific commit range of ST
