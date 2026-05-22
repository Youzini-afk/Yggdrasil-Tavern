# Realtime Models 使用指南

> [English](./REALTIME_MODELS.en.md) · [中文](./REALTIME_MODELS.md)

## 概念

Realtime 模型通道用于双向、低延迟的文字/语音交互。它不是普通 chat completion，也不是 SSE 文本流，而是通过 WebSocket 在一个会话中发送 client events、接收 server events。

YdlTavern 的能力名是 `ydltavern/engine/model.live_realtime`。边界与其他 live calls 一致：YdlTavern 不直接打开 provider WebSocket，不读取 raw key，只把 `secret_ref`、目的 host、路径和帧交给 Yggdrasil host。

## 调用路径

```text
YdlTavern model.live_realtime
  -> kernelClient.openWebSocket(...)
  -> kernel.outbound.websocket.open
  -> Yggdrasil host live ws executor
  -> provider wss endpoint
```

Session lifecycle：open → `onOpen` → many `onFrame` → `onClose`。调用方负责在 UI 或扩展层保存 session handle，并在取消、切换角色或卸载时 close。

## OpenAI Realtime

OpenAI Realtime 使用真实 WebSocket 路径：

```text
wss://api.openai.com/v1/realtime?model=<model>
```

必须通过 host 注入 header：

- `Authorization: Bearer <OPENAI_API_KEY>`（由 `secret_ref` 解析）
- `openai-beta: realtime=v1`

YdlTavern 只传 `secret_ref:env:OPENAI_API_KEY`，不传 raw key。会话创建后，engine 会按输入构造 session update / conversation item / audio buffer 相关帧，并把 provider event 归一化为 YdlTavern server events。

## Gemini Live

Gemini Live 路径目前是 best-effort stub。manifest 与 host allowed host 已预留 `generativelanguage.googleapis.com`，但该路径不应被文档描述成与 OpenAI Realtime 同等完整。真实 smoke 应单独 gate，并把失败视为 stub 限制而非通用 realtime 边界失败。

## Required Yggdrasil profile

Host profile 必须启用 live WebSocket executor，并允许 provider host：

```yaml
outbound:
  websocket:
    executor: live
    allowed_hosts:
      - api.openai.com
      - generativelanguage.googleapis.com
```

HTTP/SSE live calls 的 `outbound.execute.executor: live` / `outbound.stream.executor: live` 不自动等于 WebSocket live。Realtime smoke 前必须确认 `outbound.websocket.executor: live` 已启用。

## Environment and opt-in

Provider key 放在 Yggdrasil host 环境中：

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`（仅 Gemini stub / future smoke）

Realtime smoke 默认离线。真实 smoke 需要显式 opt-in：

```bash
YGG_LIVE_REALTIME_TESTS=1
```

同时 profile 必须启用 live ws executor；只有 env var 而没有 profile 权限时应 fail closed。

## secret_ref rules

输入只携带 ref 字符串，例如：

```text
secret_ref:env:OPENAI_API_KEY
```

raw key 不进入 YdlTavern source、tests、fixtures、logs 或 docs。host 解析 ref、注入 header、做 redaction，并在 outbound audit 中记录生命周期事件。

## Manifest declarations

`packages/ydltavern-engine/manifest.yaml` 必须声明 network methods 与 secret refs：

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

未声明 host、method 或 secret ref 时，host 应拒绝打开 WebSocket。

## Audit and redaction

WebSocket audit 记录 lifecycle：open attempt、open accepted/denied、close、error、timeout、cancel。frame payload 不进入 audit；实现只记录必要的元数据（host、path shape、capability id、secret_ref id、close code、error class）。

这与 HTTP/SSE live calls 的 secret 和 host enforcement 是同一安全模型。

## Cancel and timeout

`model.live_realtime` 接受 timeout / close 语义。打开超时由 host 返回 error；会话中取消应调用 session `close()`，host 关闭 socket 并触发 `onClose`。取消不是协议错误；它是终止状态。调用方应在 UI stop、页面卸载、角色切换、profile 切换时 close。

## Server event types

YdlTavern 将 provider event 归一化为以下 server events：

- `session_created`
- `audio_delta`
- `audio_done`
- `text_delta`
- `text_done`
- `function_call`
- `response_done`
- `error`

Provider-specific 原始字段可保留在 metadata，但 consumer 不应依赖未稳定字段。

## Client event types

Consumer 可发送以下 client events：

- `audio_append`
- `audio_commit`
- `text_send`
- `function_call_response`
- `session_update`

Engine 负责把它们映射到 OpenAI Realtime frame shape；Gemini Live 映射仍是 stub / best-effort。

## Limitations

YdlTavern 当前不提供音频 codec、录音、播放、VAD UI 或设备管理。`audio_delta` 只是数据事件；consumer 负责 PCM/G.711 编解码、播放队列、麦克风采集和回放。Realtime 也不代表所有 ST provider streaming edge cases 已对齐。
