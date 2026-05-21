# Turn Model

> [English](./TURN_MODEL.en.md) · [中文](./TURN_MODEL.md)

YdlTavern does not use SillyTavern's flat `chat[]` array directly internally. We use the Turn model as the internal data structure, and leave ST's `chat[]` as a compatibility projection for old extensions.

This document defines the internal Turn model. See [`COMPAT_PROJECTION.en.md`](./COMPAT_PROJECTION.en.md) for projection rules.

## Why not copy chat[] directly

In ST, one `chat[]` data structure has to carry four roles: render unit, storage record, prompt input, and extension API shape. Touching one part disturbs all of it.

The cost is that it cannot hold up in the agent era:

- Thinking takes one message, tool call takes one message, tool result takes one message — one agent run scatters the conversation into fragments.
- Swipe can only replace the last message. It cannot replace "the whole agent attempt in this turn".
- Multi-step agents have nowhere to store intermediate state, so it has to be stuffed into `extra` or hard-pushed as multiple `chat[]` entries.
- `chat[i].extra` becomes the trash bin for all special data.

YdlTavern separates rendering, storage, prompt construction, and compatibility API. Internally it aligns with the agent era. Externally it stays compatible with old ST extensions.

## Shape

```typescript
interface Chat {
  id: string;
  meta: ChatMeta;
  turns: Turn[];
}

interface Turn {
  id: string;                    // ulid
  index: number;                 // 0-based position in chat
  role: 'user' | 'assistant' | 'system' | 'tool';
  speaker?: SpeakerRef;          // specifies which character in group chat
  variants: TurnVariant[];       // swipe is at this layer
  active_variant: number;
  source: TurnSource;            // user_input | generation | imported | tool | system
  hidden?: boolean;              // does not enter prompt (ST hide)
  memory_summary?: string;       // compressed summary for this turn, optional
  created_at: number;
  edited_at?: number;
  deleted?: boolean;             // soft delete
}

interface TurnVariant {
  id: string;
  generation_id?: string;        // which generate produced it
  model?: string;
  subs: SubMessage[];
  meta: VariantMeta;             // tokens / cost / latency / finish_reason
  created_at: number;
}

type SubMessage =
  | { kind: 'text'; text: string; segment_role?: 'main' | 'narration' | 'speech' }
  | { kind: 'thinking'; text: string; collapsed_by_default?: boolean; hide_from_prompt?: boolean }
  | { kind: 'tool_call'; tool: ToolRef; arguments: unknown; call_id: string }
  | { kind: 'tool_result'; call_id: string; result: unknown; status: 'ok' | 'error' | 'cancelled' }
  | { kind: 'skill_invoke'; skill: SkillRef; input: unknown }
  | { kind: 'agent_step'; step: AgentStepDescriptor }
  | { kind: 'image'; image_ref: AssetRef; prompt?: string; alt?: string }
  | { kind: 'audio'; audio_ref: AssetRef; transcript?: string }
  | { kind: 'attachment'; attachment_ref: AttachmentRef }
  | { kind: 'file_embed'; file_ref: AssetRef; mime: string }
  | { kind: 'note'; text: string };
```

## Key decisions

### Swipe is at the Turn layer

The whole Turn is the unit replaced by swipe, including all thinking, tool calls, and final reply inside it. One swipe creates a new `TurnVariant`. When the user switches between variants, they switch "the whole agent attempt for this turn".

### Sub messages are ordered, structured, and separately collapsible

We do not rely on markdown markers inside one string to distinguish thinking from replies. `thinking` / `tool_call` / `tool_result` / `text` are sibling sub kinds. The frontend renders and collapses each kind separately.

### tool_call and tool_result are paired by call_id

They may be adjacent (synchronous tool), or other subs may appear between them (async, streaming, external callback). The frontend uses call_id to display them as related items.

### Thinking is first-class

ST later added the reasoning field because `chat[]` had nowhere to put it. The Turn model directly provides the `thinking` sub kind, as a sibling of `text`. It is collapsed by default.

### Attachments / images / audio are subs, not extra

They are not stuffed into `extra`. They are first-class entries inside a turn, using asset references.

### Hidden is at the Turn layer

ST's `is_system` / hide means "do not enter the prompt, but show in the UI". `Turn.hidden` expresses this directly. When sub-level granularity is needed ("this thinking item does not enter the prompt"), add `hide_from_prompt` on the sub.

## Edit / Delete

- **Edit text sub**: copy-on-write. Copy all subs from the original variant, replace the target text sub content, and add it to `variants[]` as a new variant. Keep the original variant.
- **Delete turn**: mark `deleted: true`. Do not physically delete it. Keep the event log trace.
- **Hide turn**: toggle `hidden`. Storage stays unchanged.

Not directly modifying `chat[i].mes` is intentional. It supports branches, replay, and audit.

## Branching

Yggdrasil has a built-in branch mechanism. At the YdlTavern layer:

- Users can fork from any Turn
- Each branch maintains its own turns
- Branches are linked by a shared ancestor turn
- Old extensions see `chat[]` as the flat projection of the current branch

ST has no branch. Old extensions cannot see it.

## IDs and ordering

- `Turn.id` / `TurnVariant.id` use ulid, which is friendly to time ordering.
- `Turn.index` is 0-based. Deleting or hiding does not reorder it.
- `SubMessage` has no independent id. It is located by `(variant_id, position)`. Inline edit goes through a variant fork.

## Storage

- Content data is owned by YdlTavern. The concrete carrier is decided during implementation. The current preference is IndexedDB as frontend cache plus filesystem/SQLite persistence.
- Platform events (generate / tool call / approve / fork / outbound request) go through Yggdrasil's public protocol into the Yggdrasil event log.
- Assets (character cards, world books, images) are owned by YdlTavern. They can optionally be mirrored to Yggdrasil assets for sharing.

## Relationship to prompt construction

Prompt construction reads from the Turn model, follows `active_variant`, and expands each sub into the messages expected by OpenAI / Anthropic / textgen according to ST compatibility rules. Preset injection order, world info triggering, author's note, character description — all stay byte-aligned with ST. Rules are in [`COMPAT_PROJECTION.en.md`](./COMPAT_PROJECTION.en.md).

## Relationship to chat[]

Old extensions see a flat projection of the Turn model through `getContext().chat`. `mes` is composed from the active variant's text subs. thinking / tool_call / tool_result land in the `extra` field. The swipe API operates on `active_variant`. `chat[i].mes = ...` triggers a variant fork. Detailed mapping is in [`COMPAT_PROJECTION.en.md`](./COMPAT_PROJECTION.en.md).

## Invariants

- Every Turn has at least one variant
- Every variant has at least one non-empty sub, unless the whole Turn is `hidden`
- Every terminal `tool_call` has a corresponding `tool_result`, unless cancelled / pending
- Once persisted, a variant is never modified in place (edit = new variant)
- `Turn.index` is monotonically increasing
- A turn with `deleted: true` does not enter prompts or the `chat[]` projection

## Out of scope

- ST message fields that the community abandoned long ago — handled according to the deferred marks in inventory
- Video frames, 3D assets, and other multimodal forms beyond image / audio / file — handled through extensions
- Real-time collaboration by multiple users on the same Turn — handled through branches, not inside the Turn model
