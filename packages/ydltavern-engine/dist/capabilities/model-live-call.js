import { applyStreamChunk, buildChatRequest, emptyStreamState, assertValidSecretRef, } from "@ydltavern/engine-core";
import { PACKAGE_ID, createCapabilityMeta } from "../types.js";
export const MODEL_LIVE_CALL_ID = `${PACKAGE_ID}/model.live_call`;
export const MODEL_LIVE_CALL_STREAM_ID = `${PACKAGE_ID}/model.live_call.stream`;
const DESTINATION_HOSTS = {
    openai: "api.openai.com",
    deepseek: "api.deepseek.com",
    claude: "api.anthropic.com",
    anthropic: "api.anthropic.com",
    openrouter: "openrouter.ai",
};
const API_PATHS = {
    openai: "/v1/chat/completions",
    deepseek: "/v1/chat/completions",
    claude: "/v1/messages",
    anthropic: "/v1/messages",
    openrouter: "/api/v1/chat/completions",
};
const SUPPORTED_LIVE_SOURCES = new Set(["openai", "deepseek", "openrouter", "claude", "anthropic"]);
const OPENAI_COMPATIBLE_BODY_FIELDS = [
    "model",
    "messages",
    "temperature",
    "top_p",
    "frequency_penalty",
    "presence_penalty",
    "max_tokens",
    "max_completion_tokens",
    "stop",
    "stream",
    "tools",
    "tool_choice",
    "response_format",
    "reasoning_effort",
    "seed",
    "logprobs",
    "top_logprobs",
];
function assertSupportedSource(source) {
    if (!SUPPORTED_LIVE_SOURCES.has(source)) {
        throw new Error(`Unsupported live_call source=${source}`);
    }
}
function buildSource(source) {
    return source === "anthropic" ? "claude" : source;
}
function secretHeaderForSource(source, secret_ref) {
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
function staticHeadersForSource(source) {
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
function buildProviderFinalBody(input, stream) {
    assertSupportedSource(input.source);
    const unifiedRequest = buildChatRequest({
        source: buildSource(input.source),
        model: input.model,
        messages: input.messages,
        settings: { ...input.settings, stream_openai: stream },
        generationType: input.generationType,
        bias: input.bias,
        tools: input.tools,
        includeTools: Array.isArray(input.tools) && input.tools.length > 0,
    });
    const unifiedBody = unifiedRequest.body;
    return input.source === "anthropic" || input.source === "claude"
        ? buildAnthropicFinalBody(unifiedBody, input, stream)
        : buildOpenAICompatibleFinalBody(unifiedBody, stream);
}
function buildOpenAICompatibleFinalBody(unifiedBody, stream) {
    const finalBody = {};
    for (const key of OPENAI_COMPATIBLE_BODY_FIELDS) {
        if (unifiedBody[key] !== undefined)
            finalBody[key] = unifiedBody[key];
    }
    finalBody.stream = stream;
    return finalBody;
}
function buildAnthropicFinalBody(unifiedBody, input, stream) {
    const messages = Array.isArray(unifiedBody["messages"])
        ? unifiedBody["messages"]
        : input.messages;
    const systemMessages = messages.filter((message) => message.role === "system").map((message) => message.content).filter((content) => content.length > 0);
    const providerMessages = messages
        .filter((message) => message.role !== "system")
        .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
    }));
    const finalBody = {
        model: typeof unifiedBody["model"] === "string" ? unifiedBody["model"] : input.model,
        messages: providerMessages,
        max_tokens: readPositiveInteger(unifiedBody["max_tokens"]) ?? readPositiveInteger(unifiedBody["max_completion_tokens"]) ?? 300,
        stream,
    };
    if (systemMessages.length === 1) {
        finalBody.system = systemMessages[0];
    }
    else if (systemMessages.length > 1) {
        finalBody.system = systemMessages.map((text) => ({ type: "text", text }));
    }
    copyIfPresent(unifiedBody, finalBody, "temperature");
    copyIfPresent(unifiedBody, finalBody, "top_p");
    if (unifiedBody["stop"] !== undefined)
        finalBody.stop_sequences = unifiedBody["stop"];
    copyIfPresent(unifiedBody, finalBody, "tools");
    copyIfPresent(unifiedBody, finalBody, "tool_choice");
    return finalBody;
}
function copyIfPresent(source, target, key) {
    if (source[key] !== undefined)
        target[key] = source[key];
}
function readPositiveInteger(value) {
    return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
}
export async function modelLiveCallUnary(input, kernel, capabilityId = MODEL_LIVE_CALL_ID) {
    if (input.stream) {
        throw new Error("modelLiveCallUnary called with stream=true; use modelLiveCallStream");
    }
    const secretRef = assertValidSecretRef(input.secret_ref, "input.secret_ref");
    assertSupportedSource(input.source);
    const destinationHost = DESTINATION_HOSTS[input.source];
    if (!destinationHost) {
        throw new Error(`Unsupported live_call source=${input.source}`);
    }
    const path = API_PATHS[input.source] ?? "/v1/chat/completions";
    const finalBody = buildProviderFinalBody(input, false);
    const { name: secretHeaderName, spec: secretHeaderSpec } = secretHeaderForSource(input.source, secretRef);
    const params = {
        capability_id: capabilityId,
        destination_host: destinationHost,
        method: "POST",
        path,
        purpose: `ydltavern.model.live_call:${input.source}`,
        secret_refs: [secretRef],
        secret_headers: { [secretHeaderName]: secretHeaderSpec },
        static_headers: staticHeadersForSource(input.source),
        body_shape: finalBody,
        timeout_ms: input.timeout_ms ?? 60_000,
    };
    const response = await kernel.sendKernelRequest("kernel.v1.outbound.execute", params);
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
export function modelLiveCallStream(input, kernel, capabilityId = MODEL_LIVE_CALL_STREAM_ID, onFrame) {
    if (!input.stream) {
        throw new Error("modelLiveCallStream called with stream=false; use modelLiveCallUnary");
    }
    const secretRef = assertValidSecretRef(input.secret_ref, "input.secret_ref");
    assertSupportedSource(input.source);
    const destinationHost = DESTINATION_HOSTS[input.source];
    if (!destinationHost) {
        throw new Error(`Unsupported live_call source=${input.source}`);
    }
    const path = API_PATHS[input.source] ?? "/v1/chat/completions";
    const finalBody = buildProviderFinalBody(input, true);
    const { name: secretHeaderName, spec: secretHeaderSpec } = secretHeaderForSource(input.source, secretRef);
    const params = {
        capability_id: capabilityId,
        destination_host: destinationHost,
        method: "POST",
        path,
        purpose: `ydltavern.model.live_call.stream:${input.source}`,
        secret_refs: [secretRef],
        secret_headers: { [secretHeaderName]: secretHeaderSpec },
        static_headers: staticHeadersForSource(input.source),
        body_shape: finalBody,
        timeout_ms: input.timeout_ms ?? 120_000,
        stream_format: "sse",
    };
    const state = emptyStreamState();
    let usage;
    const handle = kernel.streamKernelRequest("kernel.v1.outbound.stream", params, {
        onChunk(chunk) {
            const parsed = parseOutboundStreamChunk(chunk);
            if (parsed === undefined)
                return;
            usage = extractUsage(input.source, parsed) ?? usage;
            const frame = applyParsedStreamChunk(state, input.source, parsed);
            if (frame)
                onFrame(frame);
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
export const modelLiveCallHandlers = {
    [MODEL_LIVE_CALL_ID]: async (input, context) => {
        const output = await modelLiveCallUnary(input, readKernelClient(context), MODEL_LIVE_CALL_ID);
        return {
            meta: createCapabilityMeta(MODEL_LIVE_CALL_ID, { deterministic: false, model_boundary: true, network_via_kernel: true }),
            ...output,
        };
    },
    [MODEL_LIVE_CALL_STREAM_ID]: (input, context) => {
        const kernel = readKernelClient(context);
        const frames = [];
        return new Promise((resolve) => {
            let terminal = false;
            const finish = (frame) => {
                if (terminal)
                    return;
                terminal = true;
                resolve({
                    meta: createCapabilityMeta(MODEL_LIVE_CALL_STREAM_ID, { deterministic: false, model_boundary: true, network_via_kernel: true }),
                    frames,
                    final: frame,
                });
            };
            modelLiveCallStream(input, kernel, MODEL_LIVE_CALL_STREAM_ID, (frame) => {
                context?.emitFrame?.(frame);
                frames.push(frame);
                if (frame.kind !== "chunk")
                    finish(frame);
            });
        });
    },
};
function readKernelClient(context) {
    const maybeKernel = context?.kernelClient;
    if (maybeKernel &&
        typeof maybeKernel === "object" &&
        typeof maybeKernel.sendKernelRequest === "function" &&
        typeof maybeKernel.streamKernelRequest === "function") {
        return maybeKernel;
    }
    throw new Error("model.live_call requires a Yggdrasil kernelClient context");
}
function applyParsedStreamChunk(state, source, parsed) {
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
    if (!deltaText && !deltaReasoning && !toolCallsChanged && swipeIndex < 0)
        return undefined;
    return {
        kind: "chunk",
        delta_text: deltaText || undefined,
        delta_reasoning: deltaReasoning || undefined,
        tool_calls: toolCallsChanged ? state.toolCalls : undefined,
        swipe_index: swipeIndex >= 0 ? swipeIndex + 1 : undefined,
    };
}
function parseOutboundStreamChunk(chunk) {
    const value = unwrapChunkShape(chunk);
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.length === 0 || trimmed === "[DONE]")
            return undefined;
        return parseJsonMaybe(trimmed);
    }
    if (value && typeof value === "object") {
        const data = value.data ?? value.chunk_shape;
        if (typeof data === "string") {
            const trimmed = data.trim();
            if (trimmed.length === 0 || trimmed === "[DONE]")
                return undefined;
            return parseJsonMaybe(trimmed);
        }
        return data ?? value;
    }
    return undefined;
}
function unwrapChunkShape(chunk) {
    if (chunk && typeof chunk === "object" && "chunk_shape" in chunk) {
        return chunk.chunk_shape;
    }
    return chunk;
}
function parseJsonMaybe(value) {
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
}
function applyAnthropicSemanticChunk(state, parsed) {
    if (!parsed || typeof parsed !== "object")
        return;
    const data = parsed;
    const delta = data["delta"];
    if (!delta || typeof delta !== "object")
        return;
    if (typeof delta["text"] === "string")
        state.text += delta["text"];
    if (typeof delta["thinking"] === "string")
        state.reasoning += delta["thinking"];
}
function extractUnaryFields(source, body) {
    if (!body || typeof body !== "object")
        return {};
    const b = body;
    if (source === "anthropic" || source === "claude") {
        const out = {};
        const content = b["content"];
        if (Array.isArray(content)) {
            const text = content
                .filter((c) => typeof c === "object" && c !== null)
                .filter((c) => c.type === "text")
                .map((c) => (typeof c.text === "string" ? c.text : ""))
                .join("");
            if (text)
                out.text = text;
            const tools = content.filter((c) => typeof c === "object" && c !== null && c.type === "tool_use");
            if (tools.length > 0)
                out.tool_calls = tools;
        }
        out.usage = extractUsage(source, b);
        return out;
    }
    const choice = Array.isArray(b["choices"]) ? b["choices"][0] : undefined;
    const message = choice?.["message"];
    return {
        text: typeof message?.["content"] === "string" ? message["content"] : undefined,
        reasoning: typeof message?.["reasoning_content"] === "string" ? message["reasoning_content"] : undefined,
        tool_calls: Array.isArray(message?.["tool_calls"]) ? message["tool_calls"] : undefined,
        usage: extractUsage(source, b),
    };
}
function extractUsage(source, value) {
    if (!value || typeof value !== "object")
        return undefined;
    const b = value;
    const usage = b["usage"];
    if (!usage || typeof usage !== "object")
        return undefined;
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
function readNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function readStatus(status) {
    return status === "ok" || status === "denied" || status === "timeout" || status === "error" ? status : "error";
}
function stringifyRedactionState(value) {
    if (typeof value === "string")
        return value;
    if (value === undefined || value === null)
        return "not_captured";
    return JSON.stringify(value);
}
function stringifyError(error) {
    if (error instanceof Error)
        return error.message;
    if (typeof error === "string")
        return error;
    return JSON.stringify(error);
}
//# sourceMappingURL=model-live-call.js.map