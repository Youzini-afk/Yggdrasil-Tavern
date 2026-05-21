import { buildOpenAIChatRequest, buildPrompt, normalizeSamplerSettings, type PromptBlock } from "@ydltavern/engine-core";
import type { Chat } from "@ydltavern/types";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, isRecord, stringField, type HandlerRecord } from "../types.js";

const CAPABILITY_ID = `${PACKAGE_ID}/preset.compile`;

type CompileMode = "openai_chat" | "text";

export const compilePreset = (input: unknown) => {
  const record = inputRecord(input);
  const chat = readChat(record["chat"]);
  const promptBlocks = readPromptBlocks(record["prompt_blocks"]);
  const mode = readMode(record["mode"]);
  const promptMode = mode === "text" ? "text" : "chat";
  const prompt = buildPrompt(promptBlocks, chat, { mode: promptMode });
  const sampler = normalizeSamplerSettings(record["sampler"]);
  const model = stringField(record, "model", "ydltavern-fake-model");
  const requestShape = mode === "openai_chat"
    ? buildOpenAIChatRequest({ model, messages: prompt.messages, sampler, stream: false })
    : undefined;

  return {
    prompt,
    request_shape: requestShape,
    diagnostics: prompt.diagnostics,
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

function readChat(value: unknown): Chat {
  if (isRecord(value) && Array.isArray(value["turns"])) {
    return value as unknown as Chat;
  }

  return {
    id: "chat_empty",
    meta: {},
    turns: [],
  };
}

function readPromptBlocks(value: unknown): readonly PromptBlock[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index): PromptBlock[] => {
    if (!isRecord(item)) {
      return [];
    }

    const content = item["content"];
    if (typeof content !== "string") {
      return [];
    }

    return [{
      identifier: typeof item["identifier"] === "string" ? item["identifier"] : `block_${index}`,
      role: readPromptRole(item["role"]),
      content,
      enabled: typeof item["enabled"] === "boolean" ? item["enabled"] : undefined,
      position: typeof item["position"] === "number" ? item["position"] : undefined,
      order: typeof item["order"] === "number" ? item["order"] : undefined,
    }];
  });
}

function readPromptRole(value: unknown): PromptBlock["role"] {
  return value === "system" || value === "user" || value === "assistant" || value === "tool" ? value : undefined;
}
