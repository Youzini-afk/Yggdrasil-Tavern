# Live Model Calls 使用指南

> [English](./LIVE_MODEL_CALLS.en.md) · [中文](./LIVE_MODEL_CALLS.md)

## 概念

Live model calls 是 YdlTavern 通过 Yggdrasil host 发起真实 provider HTTPS 请求的 opt-in 通道。YdlTavern engine 负责把 Tavern/ST 风格设置转换成 provider-final request body；Yggdrasil host 负责网络、secret、审计、取消和超时。

边界很明确：YdlTavern engine 永远不直接 `fetch` provider，也不读取 raw API key。所有真实外发都必须走 `kernel.v1.outbound.execute` 或 `kernel.v1.outbound.stream`。

## 调用路径

Unary：

```text
YdlTavern model.live_call
  -> 生成 provider-final body（OpenAI-compatible 或 Anthropic）
  -> subprocess kernelClient.sendKernelRequest("kernel.v1.outbound.execute", ...)
  -> Yggdrasil host outbound executor
  -> provider HTTPS
```

Streaming：

```text
YdlTavern model.live_call.stream
  -> 生成 stream=true 的 provider-final body
  -> kernelClient.streamKernelRequest("kernel.v1.outbound.stream", ...)
  -> provider SSE
  -> normalized stream frames via callbacks
```

WebSocket realtime：

```text
YdlTavern model.live_realtime
  -> kernelClient.openWebSocket(...)
  -> kernel.v1.outbound.websocket.open / send / close
  -> provider WSS (OpenAI Realtime; Gemini Live best-effort stub)
```

WebSocket realtime 与 unary / SSE 使用同一套 `secret_ref`、manifest host、namespace、audit/redaction、cancel/timeout enforcement；区别只是 outbound method 为 `WEBSOCKET`，host profile 需要启用 `outbound.websocket.executor: live`。完整细节见 [`REALTIME_MODELS.md`](REALTIME_MODELS.md)。

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

Exact host CLI commands belong to Yggdrasil docs; this guide only documents the YdlTavern side of the boundary.

## Required environment variables

Set provider keys in the Yggdrasil host environment, not in YdlTavern source or docs examples with real values. Common refs:

- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENROUTER_API_KEY`

Provider smoke tests also require an explicit opt-in:

```bash
YGG_LIVE_MODEL_TESTS=1
```

Without that flag, tests should stay offline or use deterministic mocks.

## secret_ref rules

YdlTavern 只接收和转发 host-owned refs：

```text
secret_ref:store:OPENAI_API_KEY
secret_ref:project:OPENAI_API_KEY
secret_ref:env:OPENAI_API_KEY
```

`secret_ref:inline:*`、`secret_ref:file:*`、未知 prefix 和 raw-looking value 会在 outbound 前被拒绝。

The raw key never enters YdlTavern code, manifest, request logs, fixture files, or audit details. The Yggdrasil host resolves the ref, injects the header, redacts it in logs, and records the outbound event.

## Manifest declarations

Engine manifest 必须声明网络目标和可接受的 secret refs。当前 live HTTP provider hosts 故意固定为：

- `api.openai.com`
- `api.deepseek.com`
- `api.anthropic.com`
- `openrouter.ai`

Current secret refs include:

- `secret_ref:env:OPENAI_API_KEY`
- `secret_ref:env:DEEPSEEK_API_KEY`
- `secret_ref:env:ANTHROPIC_API_KEY`
- `secret_ref:env:OPENROUTER_API_KEY`

新增 provider 必须同时更新 manifest、final-body adapter、source mapping、UI provider list 和测试。surface 可以保存 base URL 作为 profile metadata，但不会把它静默变成 live call outbound host override。

## Capability surface

- `ydltavern/engine/model.live_call`：unary request/response path. Returns status, body shape, extracted text/reasoning/tool calls/usage when available, redaction state, network flag, and executor kind.
- `ydltavern/engine/model.live_call.stream`：streaming path. Uses `kernel.v1.outbound.stream` with `stream_format: "sse"` and emits normalized frames through callbacks.
- `ydltavern/engine/model.live_realtime`：WebSocket realtime path. Uses `kernel.v1.outbound.websocket.*`; OpenAI Realtime is real, Gemini Live is currently best-effort stub.

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

Unary calls pass `timeout_ms` to `kernel.v1.outbound.execute`; if omitted, YdlTavern uses a conservative default. Streaming calls pass `timeout_ms` to `kernel.v1.outbound.stream` and return a handle with `cancel()`. Host cancellation produces a `cancelled` frame; host timeout produces a `timeout` frame.

Callers should wire UI stop buttons to `cancel()` for streaming generation. A cancelled stream is not an error; it is a terminal user action.

## Current limits

这条路径仍是 `partial-opt-in`。它覆盖从 YdlTavern provider-final request body 到 Yggdrasil outbound 的桥接，目前限 OpenAI-compatible 与 Anthropic provider hosts；这不是对所有 ST provider、sampler、retry mode、proxy mode 或 provider-specific streaming edge case 的完整实现声明。默认测试仍应保持离线，真实 smoke test 必须显式使用 `YGG_LIVE_MODEL_TESTS=1` 打开。
