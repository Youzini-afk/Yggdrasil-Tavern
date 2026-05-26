import { assertValidSecretRef } from "@ydltavern/engine-core";
import { PACKAGE_ID, createCapabilityMeta, type HandlerContext, type HandlerRecord, type KernelClient, type KernelWebSocketFrame, type KernelWebSocketHandle } from "../types.js";

export const MODEL_LIVE_REALTIME_ID = `${PACKAGE_ID}/model.live_realtime`;

export type RealtimeSource = "openai-realtime" | "gemini-live";

export interface RealtimeOpenInput {
  source: RealtimeSource;
  model: string;
  secret_ref: string;
  voice?: string;
  instructions?: string;
  modalities?: ("audio" | "text")[];
  input_audio_format?: "pcm16" | "g711_ulaw" | "g711_alaw";
  output_audio_format?: "pcm16" | "g711_ulaw" | "g711_alaw";
  max_response_tokens?: number;
}

export type RealtimeClientEvent =
  | { type: "audio_append"; data: Uint8Array }
  | { type: "audio_commit" }
  | { type: "text_send"; content: string }
  | { type: "function_call_response"; call_id: string; output: string }
  | { type: "session_update"; partial: Partial<RealtimeOpenInput> };

export type RealtimeServerEvent =
  | { type: "session_created"; session: unknown }
  | { type: "audio_delta"; data: Uint8Array }
  | { type: "audio_done" }
  | { type: "text_delta"; delta: string }
  | { type: "text_done"; text: string }
  | { type: "function_call"; call_id: string; name: string; arguments: unknown }
  | { type: "response_done"; usage?: unknown }
  | { type: "error"; code: string; message: string };

export interface RealtimeSession {
  readonly sessionId: string;
  readonly handle: KernelWebSocketHandle;
  send(event: RealtimeClientEvent): Promise<void>;
  close(): Promise<void>;
}

const DESTINATION_HOSTS: Record<RealtimeSource, string> = {
  "openai-realtime": "api.openai.com",
  "gemini-live": "generativelanguage.googleapis.com",
};

const PATHS: Record<RealtimeSource, (model: string) => string> = {
  "openai-realtime": (model) => `/v1/realtime?model=${encodeURIComponent(model)}`,
  // Best-effort Gemini Live path. The engine intentionally keeps Gemini frame
  // parser/serializer branches stubbed until the host websocket executor and
  // upstream Live protocol shape are validated together.
  "gemini-live": (model) => `/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
};

export async function openRealtimeSession(
  input: RealtimeOpenInput,
  kernel: KernelClient,
  capabilityId: string = MODEL_LIVE_REALTIME_ID,
  callbacks: {
    onServerEvent: (event: RealtimeServerEvent) => void;
    onError?: (err: { code: string; message: string }) => void;
    onClose?: (info: { code: number; reason: string }) => void;
  },
): Promise<RealtimeSession> {
  const secretRef = assertValidSecretRef(input.secret_ref, "input.secret_ref");
  const destinationHost = DESTINATION_HOSTS[input.source];
  const path = PATHS[input.source](input.model);
  const secretHeaders: Record<string, { secret_ref: string; scheme?: string }> = {};
  const staticHeaders: Record<string, string> = {};

  if (input.source === "openai-realtime") {
    secretHeaders["Authorization"] = { secret_ref: secretRef, scheme: "bearer" };
    staticHeaders["openai-beta"] = "realtime=v1";
  } else {
    secretHeaders["x-goog-api-key"] = { secret_ref: secretRef };
  }

  const params = {
    capability_id: capabilityId,
    destination_host: destinationHost,
    path,
    purpose: `ydltavern.realtime:${input.source}`,
    secret_refs: [secretRef],
    secret_headers: secretHeaders,
    static_headers: staticHeaders,
    metadata: { source: input.source, model: input.model },
    max_idle_ms: 30_000,
    max_duration_ms: 1_800_000,
    max_frame_bytes: 1_048_576,
  };

  const sessionId = `rt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  let resolveHandleReady!: (handle: KernelWebSocketHandle) => void;
  const handleReady = new Promise<KernelWebSocketHandle>((resolve) => {
    resolveHandleReady = resolve;
  });

  const handle = await kernel.openWebSocket(params, {
    onOpen: () => {
      if (input.source !== "openai-realtime") return;
      const update = buildOpenAISessionUpdate(input);
      void handleReady
        .then((readyHandle) => readyHandle.send({ kind: "text", data: JSON.stringify(update) }))
        .catch((err: unknown) => {
          callbacks.onError?.({ code: "session_update_failed", message: stringifyError(err) });
        });
    },
    onFrame: (frame) => {
      const event = parseRealtimeServerFrame(input.source, frame);
      if (event) callbacks.onServerEvent(event);
    },
    onClose: callbacks.onClose,
    onError: callbacks.onError,
  });
  resolveHandleReady(handle);

  return {
    sessionId,
    handle,
    async send(event) {
      await handle.send(serializeRealtimeClientEvent(input.source, event));
    },
    async close() {
      await handle.close(1000, "client_done");
    },
  };
}

export const modelLiveRealtimeHandlers: HandlerRecord = {
  [MODEL_LIVE_REALTIME_ID]: async (input: unknown, context?: HandlerContext) => {
    const kernel = readRealtimeKernelClient(context);
    const frames: unknown[] = [];
    const session = await openRealtimeSession(input as RealtimeOpenInput, kernel, MODEL_LIVE_REALTIME_ID, {
      onServerEvent(event) {
        const frame = { kind: "event", event };
        frames.push(frame);
        context?.emitFrame?.(frame);
      },
      onError(err) {
        const frame = { kind: "error", error: err };
        frames.push(frame);
        context?.emitFrame?.(frame);
      },
      onClose(info) {
        const frame = { kind: "close", ...info };
        frames.push(frame);
        context?.emitFrame?.(frame);
      },
    });

    return {
      meta: createCapabilityMeta(MODEL_LIVE_REALTIME_ID, { deterministic: false, model_boundary: true, network_via_kernel: true }),
      session_id: session.sessionId,
      connection_id: session.handle.connectionId,
      subprotocol: session.handle.subprotocol,
      source: (input as RealtimeOpenInput).source,
      model: (input as RealtimeOpenInput).model,
      frames,
    };
  },
};

function readRealtimeKernelClient(context: HandlerContext | undefined): KernelClient {
  const maybeKernel = context?.kernelClient;
  if (maybeKernel && typeof maybeKernel === "object" && typeof (maybeKernel as KernelClient).openWebSocket === "function") {
    return maybeKernel as KernelClient;
  }
  throw new Error("model.live_realtime requires a Yggdrasil kernelClient context with openWebSocket");
}

function buildOpenAISessionUpdate(input: RealtimeOpenInput) {
  return {
    type: "session.update",
    session: {
      modalities: input.modalities ?? ["audio", "text"],
      instructions: input.instructions ?? "",
      voice: input.voice ?? "alloy",
      input_audio_format: input.input_audio_format ?? "pcm16",
      output_audio_format: input.output_audio_format ?? "pcm16",
      ...(input.max_response_tokens ? { max_response_output_tokens: input.max_response_tokens } : {}),
    },
  };
}

export function parseRealtimeServerFrame(source: RealtimeSource, frame: KernelWebSocketFrame): RealtimeServerEvent | undefined {
  if (frame.kind === "binary") {
    return { type: "audio_delta", data: frame.data instanceof Uint8Array ? frame.data : new TextEncoder().encode(String(frame.data)) };
  }

  try {
    const raw = typeof frame.data === "string" ? frame.data : new TextDecoder().decode(frame.data);
    return mapServerJsonToEvent(source, JSON.parse(raw) as unknown);
  } catch (err) {
    return { type: "error", code: "parse_failed", message: stringifyError(err) };
  }
}

function mapServerJsonToEvent(source: RealtimeSource, payload: unknown): RealtimeServerEvent | undefined {
  if (source !== "openai-realtime") {
    return undefined;
  }
  if (!payload || typeof payload !== "object") return undefined;
  const data = payload as Record<string, unknown>;
  switch (data["type"]) {
    case "session.created":
      return { type: "session_created", session: data["session"] };
    case "response.audio.delta":
      return { type: "audio_delta", data: typeof data["delta"] === "string" ? Uint8Array.from(Buffer.from(data["delta"], "base64")) : new Uint8Array() };
    case "response.audio.done":
      return { type: "audio_done" };
    case "response.text.delta":
      return { type: "text_delta", delta: typeof data["delta"] === "string" ? data["delta"] : "" };
    case "response.text.done":
      return { type: "text_done", text: typeof data["text"] === "string" ? data["text"] : "" };
    case "response.function_call_arguments.done":
      return {
        type: "function_call",
        call_id: typeof data["call_id"] === "string" ? data["call_id"] : "",
        name: typeof data["name"] === "string" ? data["name"] : "",
        arguments: data["arguments"],
      };
    case "response.done":
      return { type: "response_done", usage: readUsage(data["response"]) };
    case "error": {
      const error = data["error"] && typeof data["error"] === "object" ? (data["error"] as Record<string, unknown>) : {};
      return {
        type: "error",
        code: typeof error["code"] === "string" ? error["code"] : "unknown",
        message: typeof error["message"] === "string" ? error["message"] : "unknown",
      };
    }
    default:
      return undefined;
  }
}

export function serializeRealtimeClientEvent(source: RealtimeSource, event: RealtimeClientEvent): KernelWebSocketFrame {
  if (source !== "openai-realtime") {
    throw new Error(`Realtime client event serialization not implemented for ${source}`);
  }

  switch (event.type) {
    case "audio_append":
      return { kind: "text", data: JSON.stringify({ type: "input_audio_buffer.append", audio: Buffer.from(event.data).toString("base64") }) };
    case "audio_commit":
      return { kind: "text", data: JSON.stringify({ type: "input_audio_buffer.commit" }) };
    case "text_send":
      return {
        kind: "text",
        data: JSON.stringify({ type: "conversation.item.create", item: { type: "message", role: "user", content: [{ type: "input_text", text: event.content }] } }),
      };
    case "function_call_response":
      return { kind: "text", data: JSON.stringify({ type: "conversation.item.create", item: { type: "function_call_output", call_id: event.call_id, output: event.output } }) };
    case "session_update":
      return { kind: "text", data: JSON.stringify({ type: "session.update", session: event.partial }) };
  }
}

function readUsage(response: unknown): unknown {
  if (!response || typeof response !== "object") return undefined;
  return (response as Record<string, unknown>)["usage"];
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return JSON.stringify(error);
}
