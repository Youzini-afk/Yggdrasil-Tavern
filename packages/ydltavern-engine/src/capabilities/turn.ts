import { buildOpenAIChatRequest, buildPrompt, normalizeSamplerSettings } from "@ydltavern/engine-core";
import { projectTurnToSTChatMessage } from "@ydltavern/st-compat";
import type { Turn } from "@ydltavern/types";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, stableInputRef, stringField, type HandlerRecord } from "../types.js";

import { readChat, readPromptBlocks, readPromptCriticalInput } from "./prompt-critical.js";

const GENERATE_ID = `${PACKAGE_ID}/turn.generate`;
const SWIPE_ID = `${PACKAGE_ID}/turn.swipe`;
const REGENERATE_ID = `${PACKAGE_ID}/turn.regenerate`;
const CONTINUE_ID = `${PACKAGE_ID}/turn.continue`;

export async function* generateTurnFrames(input: unknown): AsyncGenerator<unknown> {
  for (const frame of generateTurnSnapshot(input).frames) {
    yield frame;
  }
}

export const generateTurnSnapshot = (input: unknown) => {
  const record = inputRecord(input);
  const chat = readChat(record["chat"]);
  const promptBlocks = readPromptBlocks(record["prompt_blocks"]);
  const sampler = normalizeSamplerSettings(record["sampler"]);
  const model = stringField(record, "model", "ydltavern-fake-model");
  const promptCritical = readPromptCriticalInput(record, chat, model);
  const prompt = buildPrompt([...promptCritical.blocks, ...promptBlocks], chat, { mode: "chat" });
  const requestShape = buildOpenAIChatRequest({ model, messages: prompt.messages, sampler, stream: false });
  const text = deterministicGenerationText(record, prompt.text || prompt.messages.map((message) => message.content).join("\n"));
  const createdAt = 0;
  const turn: Turn = {
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
      activated_world_info: promptCritical.worldInfo.activated.length,
    },
    { type: "token", text },
    { type: "completed", finish_reason: "deterministic_fake" },
  ];

  return {
    meta: createCapabilityMeta(GENERATE_ID, { deterministic: true, fake_generation: true, model }),
    prompt,
    request_shape: requestShape,
    prompt_critical: promptCritical.promptCritical.diagnostics,
    world_info: promptCritical.worldInfo,
    frames,
    turn,
    message: projectTurnToSTChatMessage(turn),
  };
};

const nextVariant = (capabilityId: string, input: unknown, operation: "swipe" | "regenerate") => {
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

export const turnHandlers: HandlerRecord = {
  [GENERATE_ID]: (input: unknown) => generateTurnSnapshot(input),
  [SWIPE_ID]: (input: unknown) => nextVariant(SWIPE_ID, input, "swipe"),
  [REGENERATE_ID]: (input: unknown) => nextVariant(REGENERATE_ID, input, "regenerate"),
  [CONTINUE_ID]: (input: unknown) => {
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

function deterministicGenerationText(record: Record<string, unknown>, promptText: string): string {
  if (typeof record["text"] === "string" && record["text"].trim().length > 0) {
    return `[ydltavern fake generation] ${record["text"].trim()}`;
  }

  const seed = promptText.trim().replace(/\s+/gu, " ").slice(0, 80);
  return seed.length > 0 ? `[ydltavern fake generation] ${seed}` : "[ydltavern fake generation]";
}

function readVariantIndex(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : fallback;
}
