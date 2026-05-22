import {
  analyzePromptChunks,
  applyRegexScripts,
  buildMemoryPromptInsertion,
  createExtensionRegistry,
  normalizeMemorySettings,
  normalizeQuickReplySets,
  normalizeVectorSettings,
  planMemoryUpdate,
  planQuickReplyAutoExecute,
  planVectorIndex,
  planVectorInjection,
  planVectorQuery,
} from "@ydltavern/extensions";
import type { Chat } from "@ydltavern/types";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, textField, type HandlerRecord } from "../types.js";

const REGISTRY_ID = `${PACKAGE_ID}/extension.registry.snapshot`;
const TOKEN_COUNTER_ID = `${PACKAGE_ID}/extension.token_counter.analyze`;
const REGEX_ID = `${PACKAGE_ID}/extension.regex.apply`;
const QUICK_REPLY_ID = `${PACKAGE_ID}/extension.quick_reply.plan`;
const MEMORY_ID = `${PACKAGE_ID}/extension.memory.plan`;
const VECTORS_ID = `${PACKAGE_ID}/extension.vectors.plan`;

export const extensionHandlers: HandlerRecord = {
  [REGISTRY_ID]: (input: unknown) => {
    const record = inputRecord(input);
    const registry = createExtensionRegistry(readArray(record["manifests"]) as never);
    for (const id of readStringArray(record["disabled"] ?? record["disabledIds"])) {
      try { registry.setEnabled(id, false); } catch { /* diagnostic is enough at caller level */ }
    }
    return {
      meta: createCapabilityMeta(REGISTRY_ID, { deterministic: true }),
      ...registry.snapshot(),
    };
  },
  [TOKEN_COUNTER_ID]: (input: unknown) => {
    const record = inputRecord(input);
    return {
      meta: createCapabilityMeta(TOKEN_COUNTER_ID, { deterministic: true }),
      ...analyzePromptChunks(readArray(record["chunks"]) as never),
    };
  },
  [REGEX_ID]: (input: unknown) => {
    const record = inputRecord(input);
    return {
      meta: createCapabilityMeta(REGEX_ID, { deterministic: true }),
      ...applyRegexScripts(textField(input, "text"), readArray(record["scripts"]) as never, {
        placement: readPlacement(record["placement"]),
        scopeId: typeof record["scopeId"] === "string" ? record["scopeId"] : undefined,
        enabledScopes: readOptionalStringArray(record["enabledScopes"]) as never,
      }),
    };
  },
  [QUICK_REPLY_ID]: (input: unknown) => {
    const record = inputRecord(input);
    const normalized = normalizeQuickReplySets(readArray(record["sets"]) as never);
    return {
      meta: createCapabilityMeta(QUICK_REPLY_ID, { deterministic: true }),
      ...normalized,
      auto_execute: planQuickReplyAutoExecute(normalized.sets, textField(input, "input")),
    };
  },
  [MEMORY_ID]: (input: unknown) => {
    const record = inputRecord(input);
    const settings = normalizeMemorySettings(readObject(record["settings"]));
    return {
      meta: createCapabilityMeta(MEMORY_ID, { deterministic: true, plan_only: true }),
      settings,
      insertion: buildMemoryPromptInsertion(textField(input, "summary"), settings),
      update: planMemoryUpdate(readChat(record["chat"]), settings),
    };
  },
  [VECTORS_ID]: (input: unknown) => {
    const record = inputRecord(input);
    const settings = normalizeVectorSettings(readObject(record["settings"]));
    const mode = typeof record["mode"] === "string" ? record["mode"] : "query";
    return {
      meta: createCapabilityMeta(VECTORS_ID, { deterministic: true, plan_only: true }),
      settings,
      plan: mode === "index"
        ? planVectorIndex(readChat(record["chat"]), settings)
        : mode === "inject"
          ? planVectorInjection(readStringArray(record["matches"]), settings)
          : planVectorQuery(textField(input, "query"), settings),
    };
  },
};

function readArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function readStringArray(value: unknown): readonly string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function readOptionalStringArray(value: unknown): readonly string[] | undefined {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : undefined;
}

function readObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readPlacement(value: unknown): "beforePrompt" | "afterPrompt" | "response" | "userInput" {
  return value === "afterPrompt" || value === "response" || value === "userInput" ? value : "beforePrompt";
}

function readChat(value: unknown): Chat {
  return value && typeof value === "object" && Array.isArray((value as { turns?: unknown }).turns)
    ? value as Chat
    : { id: "extension_plan_chat", meta: { title: "Extension plan" }, turns: [] };
}
