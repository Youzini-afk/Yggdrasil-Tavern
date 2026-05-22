import {
  applyStreamChunk,
  buildChatRequest,
  emptyStreamState,
  type ChatBaseSettings,
  type ChatCompletionMessage,
  type ChatCompletionSource,
  type ChatGenerationType,
  type StreamMergeState,
} from "@ydltavern/engine-core";

import { PACKAGE_ID, createCapabilityMeta, type HandlerContext, type HandlerRecord, type KernelClient } from "../types.js";

export const MODEL_LIVE_CALL_ID = `${PACKAGE_ID}/model.live_call`;
export const MODEL_LIVE_CALL_STREAM_ID = `${PACKAGE_ID}/model.live_call.stream`;

type LiveChatCompletionSource = ChatCompletionSource | "anthropic";
type Tool = Record<string, unknown>;

export interface ModelLiveCallInput {
  source: LiveChatCompletionSource;
  model: string;
  messages: ChatCompletionMessage[];
  settings: ChatBaseSettings;
  generationType?: ChatGenerationType;
  bias?: string;
  tools?: Tool[];
  stream: boolean;
  secret_ref: string;
  destination_host_override?: string;
  api_path_override?: string;
  timeout_ms?: number;
}

export interface ModelLiveCallUnaryOutput {
  status: "ok" | "denied" | "error" | "timeout";
  body_shape: unknown;
  text?: string;
  reasoning?: string;
  tool_calls?: unknown[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  redaction_state: string;
  network_performed: boolean;
  executor_kind: string;
}

export interface ModelLiveCallStreamFrame {
  kind: "chunk" | "final" | "error" | "cancelled" | "timeout";
  delta_text?: string;
  delta_reasoning?: string;
  tool_calls?: unknown[];
  swipe_index?: number;
  text?: string;
  reasoning?: string;
  usage?: ModelLiveCallUnaryOutput["usage"];
  error?: string;
}

export interface ModelLiveCallStreamHandle {
  cancel(): void;
}

const DESTINATION_HOSTS: Partial<Record<LiveChatCompletionSource, string>> = {
  openai: "api.openai.com",
  deepseek: "api.deepseek.com",
  claude: "api.anthropic.com",
  anthropic: "api.anthropic.com",
  openrouter: "openrouter.ai",
};

const API_PATHS: Partial<Record<LiveChatCompletionSource, string>> = {
  openai: "/v1/chat/completions",
  deepseek: "/v1/chat/completions",
  claude: "/v1/messages",
  anthropic: "/v1/messages",
  openrouter: "/api/v1/chat/completions",
};

function buildSource(source: LiveChatCompletionSource): ChatCompletionSource {
  return source === "anthropic" ? "claude" : source;
}

function secretHeaderForSource(source: LiveChatCompletionSource, secret_ref: string): {
  name: string;
  spec: { secret_ref: string; scheme?: string };
} {
  switch (source) {
    case "anthropic":
    case "claude":
      return { name: "x-api-key", spec: { secret_ref } };
    case "openai":
    case "deepseek":
    case "openrouter":
    default:
      return { name: "Authorization", spec: { secret_ref, scheme: "bearer" } };
  }
}

function staticHeadersForSource(source: LiveChatCompletionSource): Record<string, string> {
  switch (source) {
    case "anthropic":
    case "claude":
      return {
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
      };
    default:
      return { "content-type": "application/json" };
  }
}

export async function modelLiveCallUnary(
  input: ModelLiveCallInput,
  kernel: KernelClient,
  capabilityId: string = MODEL_LIVE_CALL_ID,
): Promise<ModelLiveCallUnaryOutput> {
  if (input.stream) {
    throw new Error("modelLiveCallUnary called with stream=true; use modelLiveCallStream");
  }

  const destinationHost = input.destination_host_override ?? DESTINATION_HOSTS[input.source];
  if (!destinationHost) {
    throw new Error(`No destination_host mapping for source=${input.source}`);
  }
  const path = input.api_path_override ?? API_PATHS[input.source] ?? "/v1/chat/completions";

  const requestBody = buildChatRequest({
    source: buildSource(input.source),
    model: input.model,
    messages: input.messages,
    settings: { ...input.settings, stream_openai: false },
    generationType: input.generationType,
    bias: input.bias,
    tools: input.tools,
  });

  const { name: secretHeaderName, spec: secretHeaderSpec } = secretHeaderForSource(input.source, input.secret_ref);
  const params = {
    capability_id: capabilityId,
    destination_host: destinationHost,
    method: "POST",
    path,
    purpose: `ydltavern.model.live_call:${input.source}`,
    secret_refs: [input.secret_ref],
    secret_headers: { [secretHeaderName]: secretHeaderSpec },
    static_headers: staticHeadersForSource(input.source),
    body_shape: requestBody.body,
    timeout_ms: input.timeout_ms ?? 60_000,
  };

  const response = await kernel.sendKernelRequest<{
    status?: string;
    body_shape?: unknown;
    redaction_state?: string | Record<string, unknown>;
    network_performed?: boolean;
    executor_kind?: string;
  }>("kernel.outbound.execute", params);

  const extracted = extractUnaryFields(input.source, response.body_shape ?? {});
  return {
    status: readStatus(response.status),
    body_shape: response.body_shape ?? null,
    ...extracted,
    redaction_state: stringifyRedactionState(response.redaction_state),
    network_performed: response.network_performed ?? false,
    executor_kind: response.executor_kind ?? "unknown",
  };
}

export function modelLiveCallStream(
  input: ModelLiveCallInput,
  kernel: KernelClient,
  capabilityId: string = MODEL_LIVE_CALL_STREAM_ID,
  onFrame: (frame: ModelLiveCallStreamFrame) => void,
): ModelLiveCallStreamHandle {
  if (!input.stream) {
    throw new Error("modelLiveCallStream called with stream=false; use modelLiveCallUnary");
  }

  const destinationHost = input.destination_host_override ?? DESTINATION_HOSTS[input.source];
  if (!destinationHost) {
    throw new Error(`No destination_host mapping for source=${input.source}`);
  }
  const path = input.api_path_override ?? API_PATHS[input.source] ?? "/v1/chat/completions";

  const requestBody = buildChatRequest({
    source: buildSource(input.source),
    model: input.model,
    messages: input.messages,
    settings: { ...input.settings, stream_openai: true },
    generationType: input.generationType,
    bias: input.bias,
    tools: input.tools,
  });

  const { name: secretHeaderName, spec: secretHeaderSpec } = secretHeaderForSource(input.source, input.secret_ref);
  const params = {
    capability_id: capabilityId,
    destination_host: destinationHost,
    method: "POST",
    path,
    purpose: `ydltavern.model.live_call.stream:${input.source}`,
    secret_refs: [input.secret_ref],
    secret_headers: { [secretHeaderName]: secretHeaderSpec },
    static_headers: staticHeadersForSource(input.source),
    body_shape: requestBody.body,
    timeout_ms: input.timeout_ms ?? 120_000,
    stream_format: "sse",
  };

  const state = emptyStreamState();
  let usage: ModelLiveCallUnaryOutput["usage"] | undefined;

  const handle = kernel.streamKernelRequest("kernel.outbound.stream", params, {
    onChunk(chunk) {
      const parsed = parseOutboundStreamChunk(chunk);
      if (parsed === undefined) return;
      usage = extractUsage(input.source, parsed) ?? usage;
      const frame = applyParsedStreamChunk(state, input.source, parsed);
      if (frame) onFrame(frame);
    },
    onEnd(summary) {
      usage = extractUsage(input.source, summary) ?? usage;
      onFrame({ kind: "final", text: state.text, reasoning: state.reasoning, tool_calls: state.toolCalls, usage });
    },
    onError(error) {
      onFrame({ kind: "error", error: stringifyError(error) });
    },
    onCancelled() {
      onFrame({ kind: "cancelled" });
    },
    onTimeout() {
      onFrame({ kind: "timeout" });
    },
  });

  return { cancel: () => handle.cancel() };
}

export const modelLiveCallHandlers: HandlerRecord = {
  [MODEL_LIVE_CALL_ID]: async (input: unknown, context?: HandlerContext) => {
    const output = await modelLiveCallUnary(input as ModelLiveCallInput, readKernelClient(context), MODEL_LIVE_CALL_ID);
    return {
      meta: createCapabilityMeta(MODEL_LIVE_CALL_ID, { deterministic: false, model_boundary: true, network_via_kernel: true }),
      ...output,
    };
  },
  [MODEL_LIVE_CALL_STREAM_ID]: (input: unknown, context?: HandlerContext) => {
    const kernel = readKernelClient(context);
    const frames: ModelLiveCallStreamFrame[] = [];
    return new Promise((resolve) => {
      let terminal = false;
      const finish = (frame: ModelLiveCallStreamFrame) => {
        if (terminal) return;
        terminal = true;
        resolve({
          meta: createCapabilityMeta(MODEL_LIVE_CALL_STREAM_ID, { deterministic: false, model_boundary: true, network_via_kernel: true }),
          frames,
          final: frame,
        });
      };
      modelLiveCallStream(input as ModelLiveCallInput, kernel, MODEL_LIVE_CALL_STREAM_ID, (frame) => {
        context?.emitFrame?.(frame);
        frames.push(frame);
        if (frame.kind !== "chunk") finish(frame);
      });
    });
  },
};

function readKernelClient(context: HandlerContext | undefined): KernelClient {
  const maybeKernel = context?.kernelClient;
  if (
    maybeKernel &&
    typeof maybeKernel === "object" &&
    typeof (maybeKernel as KernelClient).sendKernelRequest === "function" &&
    typeof (maybeKernel as KernelClient).streamKernelRequest === "function"
  ) {
    return maybeKernel as KernelClient;
  }
  throw new Error("model.live_call requires a Yggdrasil kernelClient context");
}

function applyParsedStreamChunk(
  state: StreamMergeState,
  source: LiveChatCompletionSource,
  parsed: unknown,
): ModelLiveCallStreamFrame | undefined {
  const beforeText = state.text;
  const beforeReasoning = state.reasoning;
  const beforeToolCalls = JSON.stringify(state.toolCalls);
  const beforeSwipes = [...state.swipes];

  applyAnthropicSemanticChunk(state, parsed);
  applyStreamChunk(state, buildSource(source), parsed);

  const deltaText = state.text.slice(beforeText.length);
  const deltaReasoning = state.reasoning.slice(beforeReasoning.length);
  const toolCallsChanged = JSON.stringify(state.toolCalls) !== beforeToolCalls;
  const swipeIndex = state.swipes.findIndex((value, index) => value !== beforeSwipes[index]);
  if (!deltaText && !deltaReasoning && !toolCallsChanged && swipeIndex < 0) return undefined;
  return {
    kind: "chunk",
    delta_text: deltaText || undefined,
    delta_reasoning: deltaReasoning || undefined,
    tool_calls: toolCallsChanged ? state.toolCalls : undefined,
    swipe_index: swipeIndex >= 0 ? swipeIndex + 1 : undefined,
  };
}

function parseOutboundStreamChunk(chunk: unknown): unknown | undefined {
  const value = unwrapChunkShape(chunk);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed === "[DONE]") return undefined;
    return parseJsonMaybe(trimmed);
  }
  if (value && typeof value === "object") {
    const data = (value as { data?: unknown; chunk_shape?: unknown }).data ?? (value as { chunk_shape?: unknown }).chunk_shape;
    if (typeof data === "string") {
      const trimmed = data.trim();
      if (trimmed.length === 0 || trimmed === "[DONE]") return undefined;
      return parseJsonMaybe(trimmed);
    }
    return data ?? value;
  }
  return undefined;
}

function unwrapChunkShape(chunk: unknown): unknown {
  if (chunk && typeof chunk === "object" && "chunk_shape" in chunk) {
    return (chunk as { chunk_shape?: unknown }).chunk_shape;
  }
  return chunk;
}

function parseJsonMaybe(value: string): unknown | undefined {
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return undefined;
  }
}

function applyAnthropicSemanticChunk(state: StreamMergeState, parsed: unknown): void {
  if (!parsed || typeof parsed !== "object") return;
  const data = parsed as Record<string, unknown>;
  const delta = data["delta"] as Record<string, unknown> | undefined;
  if (!delta || typeof delta !== "object") return;
  if (typeof delta["text"] === "string") state.text += delta["text"];
  if (typeof delta["thinking"] === "string") state.reasoning += delta["thinking"];
}

function extractUnaryFields(source: LiveChatCompletionSource, body: unknown): {
  text?: string;
  reasoning?: string;
  tool_calls?: unknown[];
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
} {
  if (!body || typeof body !== "object") return {};
  const b = body as Record<string, unknown>;
  if (source === "anthropic" || source === "claude") {
    const out: ReturnType<typeof extractUnaryFields> = {};
    const content = b["content"];
    if (Array.isArray(content)) {
      const text = content
        .filter((c): c is { type?: unknown; text?: unknown } => typeof c === "object" && c !== null)
        .filter((c) => c.type === "text")
        .map((c) => (typeof c.text === "string" ? c.text : ""))
        .join("");
      if (text) out.text = text;
      const tools = content.filter((c) => typeof c === "object" && c !== null && (c as { type?: unknown }).type === "tool_use");
      if (tools.length > 0) out.tool_calls = tools;
    }
    out.usage = extractUsage(source, b);
    return out;
  }
  const choice = Array.isArray(b["choices"]) ? (b["choices"][0] as Record<string, unknown> | undefined) : undefined;
  const message = choice?.["message"] as Record<string, unknown> | undefined;
  return {
    text: typeof message?.["content"] === "string" ? message["content"] : undefined,
    reasoning: typeof message?.["reasoning_content"] === "string" ? message["reasoning_content"] : undefined,
    tool_calls: Array.isArray(message?.["tool_calls"]) ? message["tool_calls"] : undefined,
    usage: extractUsage(source, b),
  };
}

function extractUsage(source: LiveChatCompletionSource, value: unknown): ModelLiveCallUnaryOutput["usage"] | undefined {
  if (!value || typeof value !== "object") return undefined;
  const b = value as Record<string, unknown>;
  const usage = b["usage"] as Record<string, unknown> | undefined;
  if (!usage || typeof usage !== "object") return undefined;
  if (source === "anthropic" || source === "claude") {
    const promptTokens = readNumber(usage["input_tokens"]);
    const completionTokens = readNumber(usage["output_tokens"]);
    return {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens !== undefined || completionTokens !== undefined ? (promptTokens ?? 0) + (completionTokens ?? 0) : undefined,
    };
  }
  return {
    prompt_tokens: readNumber(usage["prompt_tokens"]),
    completion_tokens: readNumber(usage["completion_tokens"]),
    total_tokens: readNumber(usage["total_tokens"]),
  };
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readStatus(status: unknown): ModelLiveCallUnaryOutput["status"] {
  return status === "ok" || status === "denied" || status === "timeout" || status === "error" ? status : "error";
}

function stringifyRedactionState(value: unknown): string {
  if (typeof value === "string") return value;
  if (value === undefined || value === null) return "not_captured";
  return JSON.stringify(value);
}

function stringifyError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return JSON.stringify(error);
}
