import {
  buildPromptCriticalBlocks,
  evaluateWorldInfo,
  type BuildPromptCriticalBlocksResult,
  type EvaluateWorldInfoInput,
  type EvaluateWorldInfoResult,
  type MacroContext,
  type PromptBlock,
  type PromptCriticalAuthorNote,
  type PromptCriticalCharacterFields,
  type WorldInfoBook,
} from "@ydltavern/engine-core";
import type { Chat } from "@ydltavern/types";

import { inputRecord, isRecord, type UnknownRecord } from "../types.js";

export interface PromptCriticalReadResult {
  readonly worldInfo: EvaluateWorldInfoResult;
  readonly promptCritical: BuildPromptCriticalBlocksResult;
  readonly blocks: readonly PromptBlock[];
}

export function readChat(value: unknown): Chat {
  if (isRecord(value) && Array.isArray(value["turns"])) {
    return value as unknown as Chat;
  }

  return {
    id: "chat_empty",
    meta: {},
    turns: [],
  };
}

export function readPromptBlocks(value: unknown): readonly PromptBlock[] {
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

export function evaluateWorldInfoFromInput(input: unknown, chat?: Chat): EvaluateWorldInfoResult {
  const record = inputRecord(input);
  return evaluateWorldInfo(readWorldInfoInput(record, chat ?? readChat(record["chat"])));
}

export function readPromptCriticalInput(record: UnknownRecord, chat: Chat, model: string): PromptCriticalReadResult {
  const worldInfo = evaluateWorldInfoFromInput(record, chat);
  const promptContext = readPromptContext(record);
  const promptCritical = buildPromptCriticalBlocks({
    userName: readString(promptContext, record, ["user_name", "userName", "user"]),
    model,
    persona: readString(promptContext, record, ["persona"]),
    character: readCharacter(promptContext["character"] ?? record["character"]),
    authorNote: readAuthorNote(promptContext["author_note"] ?? promptContext["authorNote"] ?? record["author_note"] ?? record["authorNote"]),
    instruct: readString(promptContext, record, ["instruct", "system_prompt", "systemPrompt"]),
    postHistory: readString(promptContext, record, ["post_history", "postHistory"]),
    worldInfo,
    macroContext: readMacroContext(promptContext["macro_context"] ?? promptContext["macroContext"] ?? record["macro_context"] ?? record["macroContext"]),
    baseOrder: readNumber(promptContext["base_order"] ?? promptContext["baseOrder"] ?? record["prompt_critical_base_order"] ?? record["promptCriticalBaseOrder"]),
  });

  return {
    worldInfo,
    promptCritical,
    blocks: promptCritical.blocks,
  };
}

function readPromptRole(value: unknown): PromptBlock["role"] {
  return value === "system" || value === "user" || value === "assistant" || value === "tool" ? value : undefined;
}

function readWorldInfoInput(record: UnknownRecord, chat: Chat): EvaluateWorldInfoInput {
  const worldInfoValue = record["world_info"] ?? record["worldInfo"];
  const worldInfoRecord = isRecord(worldInfoValue) ? worldInfoValue : {};
  const books = [
    ...readWorldBooks(record["world_books"] ?? record["worldBooks"] ?? record["books"]),
    ...readWorldBooks(worldInfoRecord["world_books"] ?? worldInfoRecord["worldBooks"] ?? worldInfoRecord["books"]),
  ];
  const directWorldInfoBook = readWorldBook(worldInfoValue);
  const book = readWorldBook(record["world_book"] ?? record["worldBook"] ?? record["book"])
    ?? readWorldBook(worldInfoRecord["world_book"] ?? worldInfoRecord["worldBook"] ?? worldInfoRecord["book"])
    ?? directWorldInfoBook;

  return {
    chat,
    book,
    books,
    scanData: readScanData(record["scan_data"] ?? record["scanData"] ?? worldInfoRecord["scan_data"] ?? worldInfoRecord["scanData"]),
    scanDepth: readNumber(record["scan_depth"] ?? record["scanDepth"] ?? worldInfoRecord["scan_depth"] ?? worldInfoRecord["scanDepth"]),
    recursiveScanDepth: readNumber(record["recursive_scan_depth"] ?? record["recursiveScanDepth"] ?? worldInfoRecord["recursive_scan_depth"] ?? worldInfoRecord["recursiveScanDepth"]),
    budget: readBudget(record["budget"] ?? worldInfoRecord["budget"]),
    macroContext: readMacroContext(record["macro_context"] ?? record["macroContext"] ?? worldInfoRecord["macro_context"] ?? worldInfoRecord["macroContext"]),
  };
}

function readPromptContext(record: UnknownRecord): UnknownRecord {
  const value = record["prompt_context"] ?? record["promptContext"];
  return isRecord(value) ? value : {};
}

function readWorldBooks(value: unknown): readonly WorldInfoBook[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item): WorldInfoBook[] => {
    const book = readWorldBook(item);
    return book === undefined ? [] : [book];
  });
}

function readWorldBook(value: unknown): WorldInfoBook | undefined {
  if (!isRecord(value) || !Array.isArray(value["entries"])) {
    return undefined;
  }

  return value as unknown as WorldInfoBook;
}

function readBudget(value: unknown): EvaluateWorldInfoInput["budget"] {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    max: readNumber(value["max"]),
    type: value["type"] === "approxTokens" || value["type"] === "characters" ? value["type"] : undefined,
  };
}

function readScanData(value: unknown): EvaluateWorldInfoInput["scanData"] {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && value.every((item) => typeof item === "string")) {
    return value;
  }

  return undefined;
}

function readMacroContext(value: unknown): MacroContext | undefined {
  return isRecord(value) ? value as unknown as MacroContext : undefined;
}

function readCharacter(value: unknown): PromptCriticalCharacterFields | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return {
    name: readStringField(value, "name"),
    description: readStringField(value, "description"),
    personality: readStringField(value, "personality"),
    scenario: readStringField(value, "scenario"),
    creatorNotes: readStringField(value, "creatorNotes") ?? readStringField(value, "creator_notes"),
    mesExamples: readStringField(value, "mesExamples") ?? readStringField(value, "mes_examples"),
    charDepthPrompt: readStringField(value, "charDepthPrompt") ?? readStringField(value, "char_depth_prompt"),
  };
}

function readAuthorNote(value: unknown): string | PromptCriticalAuthorNote | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (!isRecord(value) || typeof value["content"] !== "string") {
    return undefined;
  }

  return {
    content: value["content"],
    position: value["position"] === "top" || value["position"] === "bottom" ? value["position"] : undefined,
  };
}

function readString(primary: UnknownRecord, fallback: UnknownRecord, fieldNames: readonly string[]): string | undefined {
  for (const fieldName of fieldNames) {
    const value = readStringField(primary, fieldName) ?? readStringField(fallback, fieldName);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
}

function readStringField(record: UnknownRecord, fieldName: string): string | undefined {
  const value = record[fieldName];
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}
