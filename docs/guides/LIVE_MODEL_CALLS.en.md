# Live Model Calls Guide

> [English](./LIVE_MODEL_CALLS.en.md) · [中文](./LIVE_MODEL_CALLS.md)

## Concept

Live model calls are YdlTavern's opt-in path for real provider HTTPS requests through a Yggdrasil host. The YdlTavern engine converts Tavern/ST-style settings into a provider request body; the Yggdrasil host owns networking, secrets, audit, cancel, and timeout behavior.

The boundary is strict: the YdlTavern engine never directly `fetch`es a provider and never reads a raw API key. Every real outbound call must go through `kernel.outbound.execute` or `kernel.outbound.stream`.

## Call path

Unary:

```text
YdlTavern model.live_call
  -> buildChatRequest(...)
  -> subprocess kernelClient.sendKernelRequest("kernel.outbound.execute", ...)
  -> Yggdrasil host outbound executor
  -> provider HTTPS
```

Streaming:

```text
YdlTavern model.live_call.stream
  -> buildChatRequest(... stream=true)
  -> kernelClient.streamKernelRequest("kernel.outbound.stream", ...)
  -> provider SSE
  -> normalized stream frames via callbacks
```

## Required Yggdrasil profile

Use a Yggdrasil host profile that enables live outbound execution. The example profile is in the sibling platform repository:

```text
Yggdrasil/profiles/forge-with-live-models.example.yaml
```

The runtime profile must enable:

```yaml
outbound:
  execute:
    executor: live
```

Exact host CLI commands belong in Yggdrasil docs; this guide documents only the YdlTavern side of the boundary.

## Required environment variables

Set provider keys in the Yggdrasil host environment, not in YdlTavern source or docs examples with real values. Common refs:

- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENROUTER_API_KEY`

Provider smoke tests also require explicit opt-in:

```bash
YGG_LIVE_MODEL_TESTS=1
```

Without that flag, tests should stay offline or use deterministic mocks.

## secret_ref rules

YdlTavern receives and forwards only a ref string such as:

```text
secret_ref:env:OPENAI_API_KEY
```

The raw key never enters YdlTavern code, manifest, request logs, fixture files, or audit details. The Yggdrasil host resolves the ref, injects the header, redacts it in logs, and records the outbound event.

## Manifest declarations

The engine manifest must declare both network destinations and accepted secret refs. Current provider hosts include:

- `api.openai.com`
- `api.deepseek.com`
- `api.anthropic.com`
- `openrouter.ai`

Current secret refs include:

- `secret_ref:env:OPENAI_API_KEY`
- `secret_ref:env:DEEPSEEK_API_KEY`
- `secret_ref:env:ANTHROPIC_API_KEY`
- `secret_ref:env:OPENROUTER_API_KEY`

Adding a provider means updating the manifest and the live-call source mapping together. Do not rely on arbitrary destination host overrides for normal use.

## Capability surface

- `ydltavern/engine/model.live_call`: unary request/response path. Returns status, body shape, extracted text/reasoning/tool calls/usage when available, redaction state, network flag, and executor kind.
- `ydltavern/engine/model.live_call.stream`: streaming path. Uses `kernel.outbound.stream` with `stream_format: "sse"` and emits normalized frames through callbacks.

Both capabilities are marked non-deterministic and model-boundary crossing.

## Streaming model

Provider SSE chunks are parsed by the outbound stream callback. YdlTavern then applies the same stream merge machinery used by provider preview code, producing frames such as:

- `chunk` with `delta_text`, `delta_reasoning`, `tool_calls`, or `swipe_index`;
- `final` with accumulated text/reasoning/tool calls and usage;
- `error` with a normalized error string;
- `cancelled` when the host stream is cancelled;
- `timeout` when the host reports timeout.

Callers should treat chunks as incremental and the final frame as authoritative for accumulated text.

## Audit and redaction

All live calls are Yggdrasil outbound events. The recorded purpose uses `ydltavern.model.live_call:<source>` or `ydltavern.model.live_call.stream:<source>`. Body shapes may be recorded according to host policy; raw secrets must never be logged. Redaction state comes back from the host and is surfaced in unary output.

## Cancel and timeout

Unary calls pass `timeout_ms` to `kernel.outbound.execute`; if omitted, YdlTavern uses a conservative default. Streaming calls pass `timeout_ms` to `kernel.outbound.stream` and return a handle with `cancel()`. Host cancellation produces a `cancelled` frame; host timeout produces a `timeout` frame.

Callers should wire UI stop buttons to `cancel()` for streaming generation. A cancelled stream is not an error; it is a terminal user action.

## Current limits

This path is `partial-opt-in`. It covers the bridge from YdlTavern request builders to Yggdrasil outbound for supported provider hosts, but it is not a claim that every ST provider, sampler, retry mode, proxy mode, or provider-specific streaming edge case is implemented. Keep offline tests as the default and gate real smoke tests behind `YGG_LIVE_MODEL_TESTS=1`.
