import { applyPromptBudget, buildModelCallPlan, buildOpenAIChatRequest, buildPrompt, buildTextCompletionRequest, cancelledStreamFrame, createApproxTokenizer, normalizeOpenAIChatStreamFrame, normalizeOllamaStreamFrame, normalizeSamplerSettings, normalizeTextCompletionStreamFrame, routePromptMessages, } from "@ydltavern/engine-core";
import { projectTurnToSTChatMessage } from "@ydltavern/st-compat";
import { PACKAGE_ID, createCapabilityMeta, inputRecord, stableInputRef, stringField } from "../types.js";
import { readChat, readPromptBlocks, readPromptCriticalInput } from "./prompt-critical.js";
import { readModelProfile } from "./model.js";
const GENERATE_ID = `${PACKAGE_ID}/turn.generate`;
const SWIPE_ID = `${PACKAGE_ID}/turn.swipe`;
const REGENERATE_ID = `${PACKAGE_ID}/turn.regenerate`;
const CONTINUE_ID = `${PACKAGE_ID}/turn.continue`;
export async function* generateTurnFrames(input) {
    for (const frame of generateTurnSnapshot(input).frames) {
        yield frame;
    }
}
export const generateTurnSnapshot = (input) => {
    const record = inputRecord(input);
    const chat = readChat(record["chat"]);
    const promptBlocks = readPromptBlocks(record["prompt_blocks"]);
    const sampler = normalizeSamplerSettings(record["sampler"]);
    const model = stringField(record, "model", "ydltavern-fake-model");
    const mode = record["mode"] === "text" ? "text" : "chat";
    const promptCritical = readPromptCriticalInput(record, chat, model);
    const blocks = [...promptCritical.blocks, ...promptBlocks];
    const prompt = buildPrompt(blocks, chat, { mode });
    const tokenBudget = readTokenBudget(record, promptCritical.blocks, chat);
    const promptRouting = routePromptMessages(prompt.messages, promptCritical.worldInfo.buckets);
    const textProvider = readTextProvider(record["text_provider"] ?? record["provider"]);
    const requestShape = mode === "text"
        ? buildTextCompletionRequest({
            provider: textProvider,
            prompt: prompt.text,
            model,
            sampler,
            stopStrings: readStringArray(record["stop_strings"] ?? record["stop"]),
            maxContext: readNumber(record["max_context"] ?? record["maxContext"]),
            maxResponse: readNumber(record["max_response"] ?? record["maxResponse"]),
            stream: readBoolean(record["stream"]),
        })
        : buildOpenAIChatRequest({ model, messages: prompt.messages, sampler, stream: false });
    const requestPayload = "request" in requestShape ? requestShape.request : requestShape;
    const modelCallPlan = record["model_profile"] !== undefined || record["modelProfile"] !== undefined
        ? buildModelCallPlan({
            profile: readModelProfile(record["model_profile"] ?? record["modelProfile"]),
            requestShape: requestPayload,
            stream: readBoolean(record["stream"]),
        })
        : undefined;
    const normalizedStreamPreview = normalizeStreamPreview(record["stream_preview"] ?? record["streamPreview"], mode, textProvider);
    const text = deterministicGenerationText(record, prompt.text || prompt.messages.map((message) => message.content).join("\n"));
    const createdAt = 0;
    const turn = {
        id: `fake_turn_${stableInputRef(input)}`,
        index: chat.turns.length,
        role: "assistant",
        speaker: { name: "Assistant", kind: "character" },
        variants: [
            {
                id: `fake_variant_${stableInputRef(input)}_0`,
                generation_id: `fake_generation_${stableInputRef(input)}`,
                model,
                subs: [{ kind: "text", text }],
                meta: { finish_reason: "deterministic_fake", provider: "ydltavern-engine", model },
                created_at: createdAt,
            },
        ],
        active_variant: 0,
        source: "generation",
        created_at: createdAt,
    };
    const frames = [
        { type: "started", generation_id: `fake_generation_${stableInputRef(input)}`, model },
        {
            type: "prompt_critical",
            diagnostics: promptCritical.promptCritical.diagnostics,
            world_info: promptCritical.worldInfo.diagnostics,
            full_world_info: promptCritical.worldInfo,
            prompt_manager: promptCritical.promptCritical.diagnostics.promptManager,
            prompt_manager_mapping: promptCritical.promptCritical.diagnostics.markerMapping,
            activated_world_info: promptCritical.worldInfo.activated.length,
            token_budget: tokenBudget,
            prompt_routing: promptRouting.diagnostics,
        },
        {
            type: "world_info_evaluated",
            world_info: promptCritical.worldInfo,
            diagnostics: promptCritical.worldInfo.diagnostics,
            nextState: promptCritical.worldInfo.nextState,
            buckets: promptCritical.worldInfo.buckets,
        },
        {
            type: "prompt_manager_compiled",
            diagnostics: promptCritical.promptCritical.diagnostics.promptManager,
            mapping: promptCritical.promptCritical.diagnostics.markerMapping,
            knownDeltas: promptCritical.promptCritical.diagnostics.knownDeltas,
            unsupported: promptCritical.promptCritical.diagnostics.unsupported,
        },
        {
            type: "request_built",
            mode,
            request_shape: requestPayload,
            diagnostics: "diagnostics" in requestShape ? requestShape.diagnostics : undefined,
            token_budget: tokenBudget,
            prompt_routing: promptRouting.diagnostics,
            model_call_plan: modelCallPlan,
        },
        { type: "stream_preview", frames: normalizedStreamPreview },
        { type: "token", text },
        { type: "completed", finish_reason: "deterministic_fake" },
    ];
    return {
        meta: createCapabilityMeta(GENERATE_ID, { deterministic: true, fake_generation: true, model }),
        prompt,
        request_shape: requestShape,
        model_call_plan: modelCallPlan,
        token_budget: tokenBudget,
        prompt_routing: promptRouting,
        normalized_stream_preview: normalizedStreamPreview,
        prompt_critical: promptCritical.promptCritical.diagnostics,
        world_info: promptCritical.worldInfo,
        frames,
        turn,
        message: projectTurnToSTChatMessage(turn),
    };
};
const nextVariant = (capabilityId, input, operation) => {
    const record = inputRecord(input);
    const turnId = stableInputRef(input);
    const baseText = typeof record["text"] === "string" && record["text"].trim().length > 0 ? record["text"].trim() : "assistant response";
    return {
        meta: createCapabilityMeta(capabilityId, { deterministic: true, fake_generation: true }),
        operation,
        turn_id: turnId,
        variant: {
            id: `fake_${operation}_variant_${turnId}`,
            index: readVariantIndex(record["variant_index"], 1),
            text: `[ydltavern fake ${operation}] ${baseText}`,
            finish_reason: "deterministic_fake",
        },
    };
};
export const turnHandlers = {
    [GENERATE_ID]: (input) => generateTurnSnapshot(input),
    [SWIPE_ID]: (input) => nextVariant(SWIPE_ID, input, "swipe"),
    [REGENERATE_ID]: (input) => nextVariant(REGENERATE_ID, input, "regenerate"),
    [CONTINUE_ID]: (input) => {
        const record = inputRecord(input);
        const turnId = stableInputRef(input);
        const baseText = typeof record["text"] === "string" && record["text"].trim().length > 0 ? record["text"].trim() : "assistant response";
        return {
            meta: createCapabilityMeta(CONTINUE_ID, { deterministic: true, fake_generation: true }),
            operation: "continue",
            turn_id: turnId,
            continuation: {
                text: `[ydltavern fake continuation] ${baseText}`,
                target: "last_variant.text",
                finish_reason: "deterministic_fake",
            },
        };
    },
};
function deterministicGenerationText(record, promptText) {
    if (typeof record["text"] === "string" && record["text"].trim().length > 0) {
        return `[ydltavern fake generation] ${record["text"].trim()}`;
    }
    const seed = promptText.trim().replace(/\s+/gu, " ").slice(0, 80);
    return seed.length > 0 ? `[ydltavern fake generation] ${seed}` : "[ydltavern fake generation]";
}
function readTextProvider(value) {
    return value === "textgen" || value === "kobold" || value === "ollama" || value === "generic" ? value : "generic";
}
function readNumber(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
function readBoolean(value) {
    return typeof value === "boolean" ? value : undefined;
}
function readStringArray(value) {
    if (typeof value === "string") {
        return [value];
    }
    if (Array.isArray(value)) {
        const strings = value.filter((item) => typeof item === "string");
        return strings.length > 0 ? strings : undefined;
    }
    return undefined;
}
function readTokenBudget(record, blocks, chat) {
    const maxTokens = readNumber(record["max_prompt_tokens"] ?? record["maxPromptTokens"] ?? record["token_budget"] ?? record["tokenBudget"]);
    if (maxTokens === undefined) {
        return undefined;
    }
    return applyPromptBudget(blocks, chat, {
        maxTokens,
        reserveTokens: readNumber(record["reserve_tokens"] ?? record["reserveTokens"]),
        tokenizer: createApproxTokenizer(),
    });
}
function normalizeStreamPreview(value, mode, provider) {
    if (!Array.isArray(value)) {
        return [cancelledStreamFrame("no stream preview input")];
    }
    return value.flatMap((chunk) => {
        if (mode === "chat") {
            return normalizeOpenAIChatStreamFrame(chunk);
        }
        return provider === "ollama" ? normalizeOllamaStreamFrame(chunk) : normalizeTextCompletionStreamFrame(chunk);
    });
}
function readVariantIndex(value, fallback) {
    return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : fallback;
}
//# sourceMappingURL=turn.js.map