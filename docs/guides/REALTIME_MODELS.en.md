# Realtime Models Guide

> [English](./REALTIME_MODELS.en.md) · [中文](./REALTIME_MODELS.md)

## Concept

The Realtime model path is for bidirectional, low-latency text/voice interaction. It is not a normal chat completion and not an SSE text stream; it uses WebSocket to send client events and receive server events within one session.

The YdlTavern capability is `ydltavern/engine/model.live_realtime`. The boundary is the same as other live calls: YdlTavern does not open provider WebSockets directly, does not read raw keys, and passes only `secret_ref`, destination host, path, and frames to the Yggdrasil host.

## Call path

```text
YdlTavern model.live_realtime
  -> kernelClient.openWebSocket(...)
  -> kernel.v1.outbound.websocket.open
  -> Yggdrasil host live ws executor
  -> provider wss endpoint
```

Session lifecycle: open → `onOpen` → many `onFrame` → `onClose`. Callers own the session handle at the UI or extension layer and must close it on cancel, character switch, or unload.

## OpenAI Realtime

OpenAI Realtime uses the real WebSocket path:

```text
wss://api.openai.com/v1/realtime?model=<model>
```

The host must inject headers:

- `Authorization: Bearer <OPENAI_API_KEY>` (resolved from `secret_ref`)
- `openai-beta: realtime=v1`

YdlTavern passes only `secret_ref:env:OPENAI_API_KEY`, never the raw key. After the session is created, the engine builds session update / conversation item / audio buffer frames from input and normalizes provider events into YdlTavern server events.

## Gemini Live

Gemini Live is currently a best-effort stub. The manifest and host allowed-host path reserve `generativelanguage.googleapis.com`, but documentation should not describe it as equally complete with OpenAI Realtime. Real smoke tests should be gated separately, and failures should be treated as stub limitations rather than generic realtime-boundary failures.

## Required Yggdrasil profile

The host profile must enable the live WebSocket executor and allow the provider hosts:

```yaml
outbound:
  websocket:
    executor: live
    allowed_hosts:
      - api.openai.com
      - generativelanguage.googleapis.com
```

The HTTP/SSE live-call settings `outbound.execute.executor: live` / `outbound.stream.executor: live` do not automatically enable WebSocket live. Confirm `outbound.websocket.executor: live` before realtime smoke tests.

## Environment and opt-in

Provider keys live in the Yggdrasil host environment:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY` (Gemini stub / future smoke only)

Realtime smoke tests stay offline by default. Real smoke requires explicit opt-in:

```bash
YGG_LIVE_REALTIME_TESTS=1
```

The profile must also enable the live ws executor; an env var without profile permission should fail closed.

## secret_ref rules

Inputs carry only a ref string, for example:

```text
secret_ref:env:OPENAI_API_KEY
```

Raw keys never enter YdlTavern source, tests, fixtures, logs, or docs. The host resolves the ref, injects headers, applies redaction, and records lifecycle events in outbound audit.

## Manifest declarations

`packages/ydltavern-engine/manifest.yaml` must declare network methods and secret refs:

```yaml
permissions:
  network:
    declarations:
      - host: api.openai.com
        methods: [POST, WEBSOCKET]
      - host: generativelanguage.googleapis.com
        methods: [POST, WEBSOCKET]
  secret_refs:
    - secret_ref:env:OPENAI_API_KEY
    - secret_ref:env:GEMINI_API_KEY
```

If the host, method, or secret ref is not declared, the host should reject the WebSocket open.

## Audit and redaction

WebSocket audit records lifecycle: open attempt, open accepted/denied, close, error, timeout, and cancel. Frame payloads are not written to audit; implementations should record only required metadata such as host, path shape, capability id, secret_ref id, close code, and error class.

This is the same security model used by HTTP/SSE live calls for secret and host enforcement.

## Cancel and timeout

`model.live_realtime` supports timeout / close semantics. Open timeout returns a host error; in-session cancel should call session `close()`, after which the host closes the socket and triggers `onClose`. Cancel is not a protocol error; it is a terminal state. Callers should close on UI stop, page unload, character switch, or profile switch.

## Server event types

YdlTavern normalizes provider events into these server events:

- `session_created`
- `audio_delta`
- `audio_done`
- `text_delta`
- `text_done`
- `function_call`
- `response_done`
- `error`

Provider-specific raw fields may remain in metadata, but consumers should not depend on unstable fields.

## Client event types

Consumers can send these client events:

- `audio_append`
- `audio_commit`
- `text_send`
- `function_call_response`
- `session_update`

The engine maps them to OpenAI Realtime frame shapes; Gemini Live mapping remains stub / best-effort.

## Limitations

YdlTavern currently provides no audio codec, recording, playback, VAD UI, or device management. `audio_delta` is only a data event; consumers own PCM/G.711 codec handling, playback queues, microphone capture, and output. Realtime support also does not mean every ST provider streaming edge case is aligned.
