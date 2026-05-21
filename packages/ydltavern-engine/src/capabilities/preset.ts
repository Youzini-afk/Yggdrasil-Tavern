import { buildOpenAIChatRequest, buildPrompt, normalizeSamplerSettings } from "@ydltavern/engine-core";

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
  const requestShape = mode === "openai_chat"
    ? buildOpenAIChatRequest({ model, messages: prompt.messages, sampler, stream: false })
    : undefined;

  return {
    prompt,
    request_shape: requestShape,
    diagnostics: {
      ...prompt.diagnostics,
      prompt_critical: promptCritical.promptCritical.diagnostics,
      world_info: promptCritical.worldInfo.diagnostics,
    },
    prompt_critical: promptCritical.promptCritical.diagnostics,
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
