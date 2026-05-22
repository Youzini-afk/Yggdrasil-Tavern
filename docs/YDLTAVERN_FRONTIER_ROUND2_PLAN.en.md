# YdlTavern Frontier Round 2 Plan (English)

> Temporary plan file. Push after each phase. Delete in R8 once durable docs absorb its content.

## Purpose

Push the partial-state lines from Round 1 (P1-P6) to implemented, and unlock two real scenarios:

1. **Byte-level ST alignment verification** — Round 1 produced fixtures; this round runs the YdlTavern side and updates the matrix
2. **Realtime API model calls** — depends on Yggdrasil Z (WebSocket outbound)

Target alignment: ~70-75% → ~80%+.

## Out of scope

- Voice UI (separate workstream)
- Real third-party ST extension zip loading (loader plan stays plan-only; sandbox runtime is ready)
- More tokenizer families (HF runtime fetcher rounds out P2.4, no new families)
- Re-implementing already-partial slash commands
- Real live model smoke (mocked in this round; user opt-in for real)

## Parallel strategy

| Range | Depends on | Start when |
|-------|-----------|-----------|
| R1 ST golden diff | none | immediate |
| R2-R5 slash batches C/D/E/F | none | immediate |
| R6 HF tokenizer fetcher | none | immediate |
| R7 Realtime via WS | Yggdrasil Z complete | after Z6+Z7 |
| R8 Doc convergence + delete temp plan | R1-R7 done | last |

R1, R2-R5, R6 are independent and can be delegated in parallel.

## Phases

### R0: Plan push (this file + Chinese)

### R1: Real ST golden diff execution

`golden-harness/compare.mjs` currently outputs `NO_YDLTAVERN_PORT` for all 14 base scenarios. Make it real.

#### Implementation

For each scenario, run YdlTavern's deep-port modules with the same input and byte-compare against ST fixture:

| Category | YdlTavern deep-port call |
|----------|--------------------------|
| `chat/*.json` | `engine-core.buildChatRequest` |
| `world-info/*.json` | `engine-core.evaluateWorldInfo` |
| `macro/*.json` | `engine-core.substituteMacros` or `st-compat.substituteParams` |
| `instruct/*.json` | `engine-core.formatInstructModeChat` |
| `tokenizer/*.json` | already done in P2.5; add ST real-token-count cross-check if extractable |

Diffs go to `golden-harness/diff/<category>-<name>.json`:

```json
{
  "scenario": "...",
  "matches": false,
  "delta": [
    { "path": "messages[1].content", "expected": "...", "actual": "..." }
  ],
  "classification": "perfect | cosmetic | structural | unverifiable",
  "notes": "ST shim fallback used for macros, not full evaluator..."
}
```

#### Matrix update

`docs/COMPATIBILITY_MATRIX.md`/`.en.md`:

- `matches: true` → partial **→ implemented**
- `cosmetic` differences (whitespace/field order) stay partial, near-perfect tag
- `structural` stays partial, diff report records points
- `unverifiable` stays partial with reason

Expect at least 5 items moved to implemented.

#### Validation

- `cd golden-harness && node compare.mjs --all`
- All diff reports generated
- Matrix update consistent with actual diff

### R2: Slash batch C — Variables/Control extras (~12 commands)

Reference `/workspace/Yggdrasil/SillyTavern/public/scripts/slash-commands.js` and `slash-commands/`:

```text
/addvar          add to var (numeric → sum, string → concat)
/flushvar        clear local vars
/flushglobalvar  clear global vars
/listvar         list all vars
/globalsetvar    set global var
/globalgetvar    get global var
/globaladdvar    add to global var
/closure-serialize    serialize closure
/closure-deserialize  deserialize closure
/pass | /noop    pipe passthrough
/yes | /no       conditional helpers
```

New: `packages/ydltavern-st-compat/src/slash-commands-batch-c.ts` + tests, with ST source line refs.

### R3: Slash batch D — Characters/Group (~10 commands)

```text
/char-find name=X         find character (by name/tag)
/char-update name=X ...   update loaded char fields
/char-create              create new (plan-only: returns descriptor; no file write)
/char-delete              declared unsupported (no destructive ops)
/member-add               group member join
/member-remove
/member-disable
/member-enable
/group-create             plan-only
/trigger | /go            trigger group rotation if exists
```

Strategy: destructive ops → unsupported; write ops → plan-only descriptor for host.

### R4: Slash batch E — Message visibility/edit (~10 commands)

```text
/message-role index=N role=user|assistant|system
/delfirst | /dellast
/delname name=X
/cut start=A end=B
/hide-all | /unhide-all
/buttons                     UI hint inject
/reply-buttons
```

### R5: Slash batch F — World Info injection (~10 commands)

```text
/inject id=X position=Y depth=Z scan=A role=B content=...
/listinjects | /flushinject id=X | /flushinjects
/getpromptentry id=X | /setpromptentry id=X ...
/worldenable name=X | /worlddisable name=X
/world-add (asset only, plan-only)
```

After 4 batches, st-compat tests grow 213 → ~290.

### R6: HuggingFace tokenizer runtime fetcher

Current `HuggingFaceTokenizerAdapter` requires caller-supplied `tokenizerJson`. Hard.

#### New module `packages/ydltavern-engine-core/src/tokenizers-runtime/huggingface-fetcher.ts`

```typescript
export interface FetchHFTokenizerOptions {
  source: 'hf-hub' | 'url';
  modelId?: string;        // 'mistralai/Mistral-7B-Instruct-v0.3'
  revision?: string;        // 'main' or commit sha
  url?: string;
  expectedSha256?: string;
  kernelClient: { sendKernelRequest<T>(method: string, params: unknown): Promise<T> };
  capabilityId: string;
  cacheKey?: string;
}

export async function fetchHuggingFaceTokenizer(
  options: FetchHFTokenizerOptions,
): Promise<HuggingFaceTokenizerSource>;
```

#### Behavior

- `source='hf-hub'` → URL `https://huggingface.co/{modelId}/resolve/{revision}/tokenizer.json`, via `kernel.outbound.execute`
- `source='url'` → direct URL, still via host
- SHA256 verify if `expectedSha256` provided
- Parse JSON
- In-memory LRU cache (16 entries) by cacheKey
- Errors fail-closed: network/verify/parse failure → clear error

#### Boundary

- No filesystem writes (YdlTavern never writes disk)
- Network must go via KernelClient (no direct fetch)
- Manifest must declare `huggingface.co` host + `secret_ref:env:HF_TOKEN` if private

#### Tests

- mock kernelClient returns fixed tokenizer.json
- cache hit verified
- SHA256 mismatch raises error
- source='url' path verified
- realistic Mistral tokenizer.json shape (fixture file)

### R7: Realtime model capability (depends on Yggdrasil Z)

#### New capability `model.live_realtime`

```typescript
export interface RealtimeOpenInput {
  source: 'openai-realtime' | 'gemini-live';
  model: string;
  secret_ref: string;
  voice?: string;
  instructions?: string;
  modalities?: ('audio' | 'text')[];
  input_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
  output_audio_format?: 'pcm16' | 'g711_ulaw' | 'g711_alaw';
  max_response_tokens?: number;
}

export interface RealtimeSession {
  readonly sessionId: string;
  send(event: RealtimeClientEvent): Promise<void>;
  close(): Promise<void>;
}

// Server events: session_created | audio_delta | audio_done | text_delta |
//                text_done | function_call | response_done | error
// Client events: audio_append | audio_commit | text_send |
//                function_call_response | session_update
```

#### Implementation

```text
src/capabilities/model-live-realtime.ts:
  source → destination_host + path:
    openai-realtime: api.openai.com / /v1/realtime?model=<model>
    gemini-live:     generativelanguage.googleapis.com / /v1beta/...
  
  source → handshake frame (OpenAI Realtime: session.update)
  
  call kernelClient.openWebSocket(...)
    secret_headers: Authorization Bearer (OpenAI) / x-goog-api-key (Gemini)
    static_headers: content-type, openai-beta=realtime=v1 (OpenAI)
  
  onFrame:
    text frame → JSON parse, route by event type
    binary frame → audio_delta route
  
  send:
    audio_append → JSON wrap { type: "input_audio_buffer.append", audio: base64(data) }
    text_send → conversation.item.create
    others per OpenAI Realtime / Gemini Live protocol
```

#### Manifest update

```yaml
permissions:
  network:
    declarations:
      # existing
      - host: api.openai.com
        methods: [POST, WEBSOCKET]
      - host: generativelanguage.googleapis.com
        methods: [POST, WEBSOCKET]
  secret_refs:
    # existing
    - secret_ref:env:OPENAI_API_KEY
    - secret_ref:env:GEMINI_API_KEY
```

#### Tests

- mock kernelClient (fake `openWebSocket`)
- simulate OpenAI Realtime `session.created` → onFrame routes to `RealtimeServerEvent.session_created`
- simulate audio_delta sequence → callback accumulates
- simulate text_delta sequence → stream aggregates
- send audio_append → verify outgoing frame shape
- send text_send → verify outgoing frame shape
- close → handle.close called
- no real network

#### Real smoke (opt-in, default skip)

`live-realtime-smoke.test.mjs`:
- gated by `YGG_LIVE_REALTIME_TESTS=1` + `YGG_LIVE_KERNEL_CLIENT_MODULE` + `OPENAI_API_KEY`
- run a short Realtime conversation: "say 'pong' once and end"
- assert audio_done or text_done received

### R8: Doc convergence + delete temp plan

- Delete `docs/YDLTAVERN_FRONTIER_ROUND2_PLAN.md`/`.en.md`
- Update `README.md`/`.en.md`:
  - Slash command count ~30 → ~80
  - HF tokenizer path change (runtime fetch)
  - Realtime capability online
- Update `docs/ARCHITECTURE.md`/`.en.md`:
  - Realtime path through Yggdrasil ws outbound
- Update `docs/COMPATIBILITY_MATRIX.md`/`.en.md`:
  - Slash commands taxonomy: ~80
  - Real model calls: ws/realtime row
  - R1 promoted items marked implemented
- New `docs/guides/REALTIME_MODELS.md`/`.en.md`
- Update `docs/guides/LIVE_MODEL_CALLS.md`/`.en.md` to add ws section (unary / SSE / WS)
- Update `packages/ydltavern-engine/README.md`/`.en.md`: model.live_realtime
- Update `packages/ydltavern-engine-core/README.md`/`.en.md`: HF fetcher
- Update `golden-harness/README.md`: real diff workflow

## Done criteria

- All packages typecheck/build/test pass
- ST golden diff runs; at least 5 items partial → implemented
- Slash command total ~80
- HF tokenizer fetcher mock tests pass; real fetch via host
- model.live_realtime mock tests pass (depends on Yggdrasil Z)
- Real smoke is opt-in only
- Temp plan deleted; durable docs updated

## Yggdrasil Z synchronization points

| YdlTavern phase | Wait for Yggdrasil phase |
|-----------------|--------------------------|
| R1-R6 | none |
| R7 implementation | Z2 + Z5 (live executor + SDK helper, fake at minimum) |
| R7 real smoke | Z fully complete |

R7 can use a mock kernelClient (fake `openWebSocket`) to write tests/code skeleton; switch to real SDK after Yggdrasil Z lands.
