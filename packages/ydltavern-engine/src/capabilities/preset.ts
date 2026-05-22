import {
  applyPromptBudget,
  buildOpenAIChatRequest,
  buildPrompt,
  buildTextCompletionRequest,
  compareGolden,
  createApproxTokenizer,
  normalizeSamplerSettings,
  routePromptMessages,
  type TextCompletionProviderFamily,
} from "@ydltavern/engine-core";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, stringField, type HandlerRecord } from "../types.js";

import { readChat, readPromptBlocks, readPromptCriticalInput } from "./prompt-critical.js";

const CAPABILITY_ID = `${PACKAGE_ID}/preset.compile`;

type CompileMode = "openai_chat" | "text";

export const compilePreset = (input: unknown) => {
  const record = inputRecord(input);
  const chat = readChat(record["chat"]);
  const promptBlocks = readPromptBlocks(record["prompt_blocks"]);
  const mode = readMode(record["mode"]);
  const promptMode = mode === "text" ? "text" : "chat";
  const sampler = normalizeSamplerSettings(record["sampler"]);
  const model = stringField(record, "model", "ydltavern-fake-model");
  const promptCritical = readPromptCriticalInput(record, chat, model);
  const prompt = buildPrompt([...promptCritical.blocks, ...promptBlocks], chat, { mode: promptMode });
  const tokenBudget = readTokenBudget(record, promptCritical.blocks, chat);
  const routedPrompt = routePromptMessages(prompt.messages, promptCritical.worldInfo.buckets);
  const requestShape = mode === "openai_chat"
    ? buildOpenAIChatRequest({ model, messages: prompt.messages, sampler, stream: false })
    : undefined;
  const textRequestShape = mode === "text"
    ? buildTextCompletionRequest({
        provider: readTextProvider(record["text_provider"] ?? record["provider"]),
        prompt: prompt.text,
        model,
        sampler,
        stopStrings: readStringArray(record["stop_strings"] ?? record["stop"]),
        maxContext: readNumber(record["max_context"] ?? record["maxContext"]),
        maxResponse: readNumber(record["max_response"] ?? record["maxResponse"]),
        stream: readBoolean(record["stream"]),
      })
    : undefined;
  const golden = record["golden_expected"] !== undefined || record["goldenExpected"] !== undefined
    ? compareGolden(promptMode === "text" ? prompt.text : prompt.messages, record["golden_expected"] ?? record["goldenExpected"], readGoldenMode(record["golden_mode"] ?? record["goldenMode"]))
    : undefined;
  const promptManager = {
    diagnostics: promptCritical.promptCritical.diagnostics.promptManager,
    mapping: promptCritical.promptCritical.diagnostics.markerMapping,
  };
  const worldInfoDiagnostics = {
    ...promptCritical.worldInfo.diagnostics,
    nextState: promptCritical.worldInfo.nextState,
    buckets: promptCritical.worldInfo.buckets,
    anPatch: promptCritical.worldInfo.buckets.anPatch,
    depthEntries: promptCritical.worldInfo.buckets.depthEntries,
    outlets: promptCritical.worldInfo.buckets.outlets,
  };

  return {
    prompt,
    request_shape: requestShape,
    diagnostics: {
      ...prompt.diagnostics,
      prompt_critical: promptCritical.promptCritical.diagnostics,
      prompt_manager: promptManager,
      world_info: worldInfoDiagnostics,
      token_budget: tokenBudget,
      prompt_routing: routedPrompt.diagnostics,
      golden,
      text_completion: textRequestShape?.diagnostics,
      knownDeltas: promptCritical.promptCritical.diagnostics.knownDeltas,
      unsupported: [
        ...promptCritical.promptCritical.diagnostics.unsupported,
        ...promptCritical.worldInfo.diagnostics.unsupported,
      ],
    },
    token_budget: tokenBudget,
    prompt_routing: routedPrompt,
    text_request_shape: textRequestShape?.request,
    text_request_diagnostics: textRequestShape?.diagnostics,
    golden,
    prompt_critical: promptCritical.promptCritical.diagnostics,
    prompt_manager: promptManager,
    knownDeltas: promptCritical.promptCritical.diagnostics.knownDeltas,
    unsupported: [
      ...promptCritical.promptCritical.diagnostics.unsupported,
      ...promptCritical.worldInfo.diagnostics.unsupported,
    ],
    world_info: promptCritical.worldInfo,
    meta: createCapabilityMeta(CAPABILITY_ID, {
      deterministic: true,
      mode,
      model,
    }),
  };
};

export const presetHandlers: HandlerRecord = {
  [CAPABILITY_ID]: compilePreset,
};

function readMode(value: unknown): CompileMode {
  return value === "text" ? "text" : "openai_chat";
}

function readTextProvider(value: unknown): TextCompletionProviderFamily {
  return value === "textgen" || value === "kobold" || value === "ollama" || value === "generic" ? value : "generic";
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}

function readStringArray(value: unknown): readonly string[] | undefined {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    const strings = value.filter((item): item is string => typeof item === "string");
    return strings.length > 0 ? strings : undefined;
  }
  return undefined;
}

function readGoldenMode(value: unknown): "exact" | "whitespace" | "structure" {
  return value === "whitespace" || value === "structure" || value === "exact" ? value : "structure";
}

function readTokenBudget(record: Record<string, unknown>, blocks: Parameters<typeof applyPromptBudget>[0], chat: Parameters<typeof applyPromptBudget>[1]) {
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
