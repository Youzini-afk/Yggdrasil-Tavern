# YdlTavern + Yggdrasil Co-evolution Deep Push Plan

> [English](./YDLTAVERN_NEXT_FRONTIER_PLAN.en.md) · [中文](./YDLTAVERN_NEXT_FRONTIER_PLAN.md)
>
> Temporary document. Update after each phase; delete entirely and merge into long-term docs once all phases complete.

## Positioning

YdlTavern's current ST algorithm port completion sits at roughly 55%. Expanding algorithm coverage further yields only a few more percentage points, capping around 65–70%. The remaining 30–35% is the hard stuff: a real ruler (golden harness), a real tokenizer, real model calls, a real extension JS sandbox, and a complete product UI.

This round treats YdlTavern and Yggdrasil as a co-evolving pair: YdlTavern is Yggdrasil's first real user, and its needs will expose Yggdrasil's actual gaps; Yggdrasil's expansions will in turn support YdlTavern in crossing the alignment bottleneck.

## Design decisions (confirmed)

```text
Golden harness location:  Standalone directory /golden-harness/ inside the YdlTavern repo
                          commit fixtures + harness code
                          do NOT commit ST source (License: AGPL-3.0)
                          ST as a sibling /workspace/Yggdrasil/SillyTavern read-only reference

Tokenizer loading:        lazy per-family
                          no upfront bundling
                          Web Worker isolation (browser scenario)

Live model calls:         wait for Yggdrasil to be ready — no jumping the gun, no direct connections
                          YdlTavern strictly routes through kernel.outbound.execute / stream
                          secret_ref routes through the host-side secret resolver
                          streaming as a kernel capability (kernel.outbound.stream)

Third-party extension sandbox:
                          QuickJS wasm
                          cross Node + browser
                          message-port bridge to the ST API surface
                          no dependency on iframe / VM2 / native bindings

Technical orientation:    cutting-edge stable stack
                          prefer currently maintained + AGPL-compatible packages
                          don't sacrifice architectural cleanliness for legacy browser compat
```

## Phase overview

| Phase | Repo | Content | Depends on |
|---|---|---|---|
| P0 | YdlTavern | Plan submission | - |
| P1 | YdlTavern | Golden Harness v0 | - |
| P3.1 | Yggdrasil | HostProfile outbound.execute schema | - |
| P3.2 | Yggdrasil | kernel.outbound.stream protocol method + LiveHttpStreamingExecutor | P3.1 |
| P3.3 | Yggdrasil | manifest permissions.secret_refs declaration | - |
| P3.4 | Yggdrasil | TypeScript subprocess SDK outbound helpers | P3.1, P3.2 |
| P3.5 | YdlTavern | engine model.live_call capability | P3.4 |
| P2.1 | YdlTavern | gpt-tokenizer integration (OpenAI/GPT2 family) | - |
| P2.2 | YdlTavern | llama-tokenizer-js series (Llama 1/2/3) | - |
| P2.3 | YdlTavern | @anthropic-ai/tokenizer (Claude local approximation) | - |
| P2.4 | YdlTavern | @huggingface/tokenizers general-purpose (HF family) | - |
| P2.5 | YdlTavern | tokenizer registry runtime dispatch + golden validation | P1, P2.1-2.4 |
| P4 | YdlTavern | QuickJS wasm extension sandbox | - |
| P5 | YdlTavern | Slash command bulk completion | - |
| P6 | YdlTavern | Full Tavern product UI | P2 |
| P7 | Yggdrasil | Web/Desktop/App shell + release pipeline | P3, P4, P6 |
| N14 | Both | Delete temporary plans + long-term doc convergence | All |

Each phase is independently verified + committed + pushed.

## P0: Plan submission (current)

This file + English version committed and pushed.

## P1: Golden Harness v0

**Location**: `/workspace/Yggdrasil/YdlTavern/golden-harness/`

**Purpose**: Establish the "real ruler". Run real ST source with the same inputs to produce real fixtures; YdlTavern's dep-port modules diff against them and write the delta into the matrix.

### Directory structure

```text
golden-harness/
├── package.json              jsdom + node:test + submodule deps
├── README.md                 usage + ST commit pin
├── shims/
│   ├── dom.mjs               jsdom + window/document/localStorage
│   ├── jquery.mjs            minimal $ stub (only methods ST touches)
│   ├── toastr.mjs            no-op
│   ├── popup.mjs             reject all
│   ├── domPurify.mjs         passthrough
│   ├── fetch.mjs             interceptor, captures body → fixtures
│   ├── time.mjs              freeze Date/moment
│   ├── rng.mjs               seedrandom replaces Math.random
│   ├── uuid.mjs              deterministic uuid
│   └── globals.mjs           install all globals before importing ST
├── runner/
│   ├── run.mjs               main entry
│   ├── load-st.mjs           dynamic import ST modules (path via env)
│   ├── extract-macro.mjs     evaluateMacros path
│   ├── extract-wi.mjs        getWorldInfoPrompt path
│   ├── extract-prompt.mjs    sendOpenAIRequest path (fetch intercept)
│   └── extract-instruct.mjs  formatInstructModeChat path
├── scenarios/
│   ├── chat/
│   │   ├── openai-basic.json
│   │   ├── openai-tools.json
│   │   ├── openai-multimodal.json
│   │   ├── claude-prefill.json
│   │   ├── deepseek-reasoning.json
│   │   └── openrouter-fallback.json
│   ├── world-info/
│   │   ├── keyword-basic.json
│   │   ├── secondary-and-any.json
│   │   ├── recursion-chain.json
│   │   ├── probability-seeded.json
│   │   ├── character-filter.json
│   │   └── sticky-cooldown.json
│   ├── macro/
│   │   ├── env-basic.json
│   │   ├── time-frozen.json
│   │   ├── random-seeded.json
│   │   ├── nested-recursive.json
│   │   └── legacy-marker.json
│   └── instruct/
│       ├── chatml.json
│       ├── llama3.json
│       └── alpaca.json
├── fixtures/
│   └── (per scenario: expected ST output JSON)
├── diff/
│   └── (per run: YdlTavern output vs fixture diff)
└── compare.mjs                 run YdlTavern dep-port with same input + diff
```

### Key determinism fixes

```text
Date/time:    Date.now → fixed epoch (2026-05-22T12:00:00Z)
              moment.now → same
RNG:          Math.random → seedrandom('ydltavern-fixture-v1')
              seedrandom third-party package same seed
              droll replaced with deterministic dice
UUID:         uuidv4 → fixed sequence ['00000000-0000-0000-0000-000000000001', ...]
Network:      fetch → throw (unless test intercept path)
              all external resource loads → reject
DOM:          jsdom provides, jQuery minimal stub
Settings:     oai_settings/power_user/textgenerationwebui_settings all pinned
Persona:      fixed user_avatar/character_id/group_id
```

### Verification

```text
1. node golden-harness/runner/run.mjs --scenario scenarios/chat/openai-basic.json
   → run twice → byte-identical fixture
2. node golden-harness/compare.mjs --scenario scenarios/chat/openai-basic.json
   → YdlTavern dep-port same input run, diff report written to diff/
3. Matrix: COMPATIBILITY_MATRIX gains "golden delta" column
4. Do NOT commit ST source; ST resolved via env YDLTAVERN_ST_PATH
```

### Boundaries

```text
No full ST runtime reproduction — only cover target paths
No real network — fetch always intercepted
No dependency on ST's own tests/ directory code — those are inline literals, not file fixtures
No attempt at 100% coverage — v0 locks to 18 scenarios
When ST upgrades, fixtures must be regenerated (README documents the workflow)
```

## P3.1: Yggdrasil HostProfile outbound.execute schema

**Location**: `/workspace/Yggdrasil/Yggdrasil/`

**Purpose**: Enable forge-alpha.yaml to configure a live HTTP outbound executor; today it only configures git, missing execute.

### Changes

```text
crates/ygg-cli/src/cli.rs (HostProfile)
  New fields:
    outbound.execute:
      enabled: bool (default false)
      executor: 'deny_all' | 'fake' | 'live' (default deny_all)
      allowed_hosts: string[] (allowlist, exact + *.wildcard)
      https_only: bool (default true)
      timeout_ms: u64 (default 30000)
      allow_redirects: bool (default false)
      allow_insecure_loopback_for_tests: bool (default false)

crates/ygg-cli/src/commands/host.rs
  New fn build_outbound_execute_executor(config) -> Box<dyn OutboundExecutor>
  Select DenyAllOutboundExecutor / FakeOutboundExecutor / LiveHttpOutboundExecutor based on executor field
  Pass into Runtime::with_outbound_executor

crates/ygg-runtime/src/runtime/outbound.rs
  LiveHttpOutboundExecutor already exists — only inject host config

profiles/
  New forge-with-live-models.example.yaml
    includes outbound.execute live + secret_refs allowlist example

docs/
  guides/MODEL_PROVIDER_INTEGRATION.md/.en.md add host profile config section
  protocol/PROTOCOL_V0.md/.en.md add outbound chapter
```

### Verification

```text
cargo check -p ygg-cli --features postgres
cargo test -p ygg-cli
ygg conformance (new outbound_execute_profile_*)
forge-with-live-models.example.yaml passes schema validation
Default forge-alpha.yaml still omits execute (keeps deny_all default)
```

## P3.2: Yggdrasil kernel.outbound.stream protocol method

**Location**: `/workspace/Yggdrasil/Yggdrasil/`

**Purpose**: Real model calls inevitably involve SSE/chunked streaming. `kernel.outbound.execute` is unary; a streaming protocol method is needed.

### Design

```text
New public protocol method:
  kernel.outbound.stream
    params: same as kernel.outbound.execute, plus stream_options
    return: stream_id (uuid)
    then push frames via kernel/stream.* events

Frame envelope (reuses kernel/stream.*):
  kernel/stream.started   { stream_id, capability_id, executor_kind, redaction_state }
  kernel/stream.chunk     { stream_id, frame_index, chunk_shape }
                          chunk_shape is redacted — does not contain raw bytes
                          subprocess client receives raw chunk via transport
  kernel/stream.ended     { stream_id, status, usage, cost, redaction_state }
  kernel/stream.error     { stream_id, code, message }
  kernel/stream.cancelled { stream_id, reason }
  kernel/stream.timeout   { stream_id, timeout_ms }

kernel.capability.cancel reused — accepts stream_id

LiveHttpStreamingExecutor:
  reqwest streaming response (response.bytes_stream())
  chunks forwarded via mpsc/tokio channel to kernel streaming subsystem
  cancel triggers abort + emit cancelled event
  timeout triggers emit timeout event
```

### Files changed

```text
crates/ygg-runtime/src/protocol.rs
  KernelMethod::OutboundStream added
  register in protocol table

crates/ygg-runtime/src/runtime/protocol_dispatch.rs
  dispatch_outbound_stream added
  shape consistent with outbound.execute + stream lifecycle

crates/ygg-runtime/src/runtime/outbound.rs
  OutboundExecutor trait gains execute_stream method (default impl: return unsupported)
  LiveHttpOutboundExecutor implements execute_stream
  FakeOutboundExecutor implements execute_stream (emit deterministic chunks)
  DenyAllOutboundExecutor rejects

crates/ygg-runtime/src/runtime/streaming.rs
  integrate outbound stream lifecycle
  redaction policy applied to chunk_shape

docs/
  protocol/PROTOCOL_V0.md - new outbound stream section
  guides/MODEL_PROVIDER_INTEGRATION.md - new streaming chapter
```

### Verification

```text
cargo test -p ygg-runtime (new outbound_stream_*)
ygg conformance (new outbound_stream_lifecycle / cancel / timeout / fake_emits_chunks)
Public protocol contract docs synced
```

## P3.3: Yggdrasil manifest permissions.secret_refs

**Location**: `/workspace/Yggdrasil/Yggdrasil/crates/ygg-core/src/manifest.rs`

**Purpose**: Allow a package to declare in its manifest which secret_refs it will use; host policy enforcement fail-closed rejects undeclared ones.

### Changes

```text
manifest.yaml new field:
  permissions:
    secret_refs:
      - 'secret_ref:env:OPENAI_API_KEY'
      - 'secret_ref:env:ANTHROPIC_API_KEY'

crates/ygg-core/src/manifest.rs
  PermissionsManifest::secret_refs: Vec<String>
  validate_secret_ref_form (reuse secret.rs::parse_secret_ref)

crates/ygg-runtime/src/runtime/protocol_dispatch.rs
  dispatch_outbound_execute / _stream
  for each secret_headers[k].secret_ref, check it is in the caller package's manifest declaration
  undeclared → fail-closed permission_denied

conformance:
  outbound_secret_ref_undeclared_fails
  outbound_secret_ref_declared_resolves
```

### Verification

```text
cargo test -p ygg-core
cargo test -p ygg-runtime
ygg conformance (new cases pass)
Existing packages/official/* manifests need no changes (they don't use secret_ref)
```

## P3.4: TypeScript subprocess SDK outbound helpers

**Location**: `/workspace/Yggdrasil/Yggdrasil/sdk/typescript/subprocess/`

**Purpose**: subprocess packages currently only have package.handshake / capability.invoke; helpers are needed so they can call back into kernel.outbound.execute / stream.

### Design

```text
Current state:
  subprocess receives capability.invoke via stdin
  writes capability.invoke response via stdout
  no path to initiate kernel.outbound.* calls

Option A:
  subprocess SDK adds outbound client
  sends outbound JSON-RPC envelope via stdout
  receives outbound response via stdin (runtime recognizes request type and dispatches)

Option B:
  extend subprocess.rs: when kernel receives an outbound JSON-RPC from a subprocess,
  forward it as a public protocol request to ProtocolRegistry
  SDK side only needs sendKernelRequest('kernel.outbound.execute', params)

Recommended: Option B (closer to the public protocol's essence)
```

### Files changed

```text
sdk/typescript/subprocess/src/
  kernel-client.ts (new)
    sendKernelRequest<T>(method: string, params: unknown): Promise<T>
    streamKernelRequest(method: string, params: unknown, callbacks): Cancel
  outbound.ts (new)
    executeOutbound(params): Promise<OutboundResponse>
    streamOutbound(params, callbacks): Cancel
  index.ts exports

crates/ygg-runtime/src/subprocess.rs
  add forwarding for kernel.* requests issued by subprocess
  distinguish from existing capability.invoke
  via ProtocolRegistry::dispatch
```

### Verification

```text
sdk/typescript/subprocess typecheck/build passes
New small example examples/packages/subprocess-outbound-canary/
  manifest declares network + secret_refs
  calls kernel.outbound.execute via SDK (FakeExecutor)
  verifies response structure
ygg conformance subprocess_outbound_through_kernel_*
```

## P3.5: YdlTavern engine model.live_call capability

**Location**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-engine/`

**Purpose**: Bridge the output of YdlTavern dep-port's buildChatRequest with Yggdrasil's public protocol outbound, producing YdlTavern's first real model call capability.

### Design

```text
New capability: model.live_call

input:
  source: ChatCompletionSource (e.g. 'openai' | 'deepseek' | 'anthropic')
  model: string
  messages: ChatCompletionMessage[]
  settings: BaseSettings
  generationType?: GenerationType
  bias?: string
  tools?: Tool[]
  stream: boolean
  secret_ref: string  // 'secret_ref:env:OPENAI_API_KEY'
  destination_host_override?: string  // default inferred from source

output:
  unary mode:
    body_shape: redacted response shape
    text: assembled assistant text
    reasoning?: string
    tool_calls?: ToolCall[]
    usage?: { prompt_tokens, completion_tokens, total_tokens }
  stream mode:
    uses capability stream (kernel.capability.stream-style frames)
    per-frame chunk: { delta_text, delta_reasoning, tool_calls, swipe_index }
    final frame final: { text, reasoning, tool_calls, usage }

implementation:
  1. dep-port buildChatRequest(input) → request body
  2. resolve destination_host (per source)
  3. resolve API path (per source)
  4. construct secret_headers (Authorization Bearer / x-api-key etc per source)
  5. via SDK kernelClient.executeOutbound / streamOutbound
  6. on response, dep-port applyStreamChunk → normalized output

manifest new declarations:
  permissions:
    network:
      declarations:
        - host: 'api.openai.com'
          methods: ['POST']
        - host: 'api.deepseek.com'
          methods: ['POST']
        - host: 'api.anthropic.com'
          methods: ['POST']
    secret_refs:
      - 'secret_ref:env:OPENAI_API_KEY'
      - 'secret_ref:env:DEEPSEEK_API_KEY'
      - 'secret_ref:env:ANTHROPIC_API_KEY'
```

### Verification

```text
Unit tests using FakeOutboundExecutor:
  input openai-basic config → expect request body shape (using P1 fixture diff)
  fake returns fixed SSE sequence → expect stream chunks
  cancel triggered → receive stream.cancelled
  timeout → receive stream.timeout

LIVE smoke test (opt-in env YGG_LIVE_MODEL_TESTS=1 + OPENAI_API_KEY):
  real call to OpenAI gpt-4o-mini "say 'pong'"
  assert response contains 'pong' (not literal comparison)
  audit events redacted

Do NOT commit real API keys
```

## P2.1: gpt-tokenizer integration

**Location**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-engine-core/src/tokenizers-runtime/`

### Changes

```text
package.json:
  dependencies:
    gpt-tokenizer: ^3.4.0

src/tokenizers-runtime/
  index.ts                   getTokenizer(id): Promise<TokenizerAdapter>
  openai.ts                  dynamic import gpt-tokenizer per encoding
                             cl100k_base / o200k_base / p50k_base / r50k_base
  fallback.ts                guesstimate fallback

src/tokenizers-st.ts
  integration: planCount calls real tokenizer (async opt-in)
  default still guesstimate (preserves sync API)

test/tokenizers-runtime.test.mjs
  assert same token count as ST tiktoken for known inputs
  golden harness passes P1 byte-alignment verification
```

## P2.2–2.5: Other tokenizer families

Same pattern as P2.1: each added family gets a lazy loader module + tests.

```text
P2.2: llama-tokenizer-js@1.2.2 + llama3-tokenizer-js@1.2.0
P2.3: @anthropic-ai/tokenizer@0.0.4 (local approximation)
P2.4: @huggingface/tokenizers@0.1.3 general-purpose + tokenizer.json runtime fetcher
P2.5: registry integration + golden harness validation across all families
```

## P4: QuickJS wasm extension sandbox

**Location**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-extensions/src/sandbox/`

### Design

```text
Dependency: quickjs-emscripten@latest (Apache-2.0)

src/sandbox/
  runtime.ts                 create QuickJS context per extension
  bridge.ts                  expose ST API surface via message ports
                             - getContext / eventSource / extension_settings
                             - registerSlashCommand
                             - setExtensionPrompt
                             - any global that ST extensions use
  loader.ts                  execute loader-st.ts buildLoadPlan for real
                             read extension JS string
                             evaluate inside sandbox
                             bridge ES module imports to host bridge
  permissions.ts             host decides which APIs may be exposed
  audit.ts                   record sandbox→host API call events

tests:
  run a real small ST extension (regex or token-counter)
  assert it can registerSlashCommand, read settings, setExtensionPrompt
```

### Boundaries

```text
QuickJS is single-threaded — long tasks may block, add timeout
No fetch / XMLHttpRequest by default — all networking via bridge → kernel.outbound.*
No DOM — extensions cannot directly manipulate DOM (surface via event subscription)
No require/import of real files — module resolution goes through bridge
```

## P5: Slash command bulk completion

**Location**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-st-compat/src/slash-commands/`

Port in batches following ST `slash-commands.js` registration order, up to ~80 commands:

```text
Batch A (Session/Chat ops):  /api /model /tokenizer /stop /closechat /tempchat / etc
Batch B (Messaging):          /sendas /send /sys /comment /continue /regenerate /swipe / etc
Batch C (Variables/Control):  existing /setvar /getvar /if /while /run; add /addvar /flushvar /listvar /global variants /closure-serialize / etc
Batch D (Characters/Group):   /char-find /char-update /member-add / etc
Batch E (Messages/Visibility): /message-role /hide /unhide /delname / etc
Batch F (WI/Injections):      /inject /listinjects /flushinject /getpromptentry / etc
Batch G (Utilities):          /echo /popup /input /delay /trim* /upper /lower /substr /replace / etc
```

One PR/commit per batch + companion fixture validation.

## P6: Full Tavern product UI

**Location**: `/workspace/Yggdrasil/YdlTavern/packages/ydltavern-surface/`

### Changes

```text
Add dependencies:
  react-virtuoso@^4 (virtual list)
  other mature libraries as needed (per designer evaluation)

src/components/product/
  ChatList.tsx              react-virtuoso 5K+ turns
  ThemedRoot.tsx            CSS variables load ST theme files
  Settings/
    ConnectionForm.tsx
    SamplerForm.tsx
    PersonaForm.tsx
    ThemeForm.tsx
  ExtensionsDrawer.tsx       loader-st real state + extension panel
  QuickReplyBar.tsx          Quick Reply collection UI
  MobileShell.tsx            responsive

Performance targets:
  10K-turn list scroll at 60 FPS
  streaming token reception 200+ token/s without frame drops
  WI trigger across 1K entries < 50ms
```

Led by @designer.

## P7: Yggdrasil shell + release (plan only this round, no implementation)

```text
Web client performance polish
Tauri desktop wrapping
PWA / native shell
Surface descriptor loader
GitHub Actions release pipeline
Signing + store submission
```

Separate initiative in the next round.

## N14: Delete temporary plans + doc convergence

```text
Delete:
  YdlTavern/docs/YDLTAVERN_NEXT_FRONTIER_PLAN.md/.en.md
  Yggdrasil/docs/YGGDRASIL_OUTBOUND_EVOLUTION_PLAN.md/.en.md (if created)

Update:
  README / ARCHITECTURE / COMPATIBILITY_MATRIX
  New GOLDEN_HARNESS guide
  New LIVE_MODEL_CALLS guide
  Yggdrasil docs sync outbound stream + secret_ref + SDK helper
```

## Boundaries (cross-cutting)

```text
No direct provider connections — YdlTavern always routes through Yggdrasil public protocol
No storing raw API keys — all via secret_ref
No bypassing audit / redaction
No polluting the kernel namespace (chat/turn/agent concepts stay out of kernel)
No sacrificing architectural cleanliness for compatibility
No introducing unmaintained or license-incompatible dependencies
```

## Completion criteria

```text
Per phase:
  typecheck/build/test passes
  fixture / conformance verification passes
  commit + push origin/main
  no breakage of prior phase artifacts

Overall completion:
  P0 → P5 all pushed
  P6 at least product shell materialized (virtual list + theme loading)
  N14 temporary plans deleted + docs converged
  golden harness first batch of fixtures passing
  at least one real model call smoke test passing (opt-in)
  alignment improves to 65–75%
```
