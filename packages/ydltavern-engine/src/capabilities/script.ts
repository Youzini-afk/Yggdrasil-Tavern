import { createSTContext } from "@ydltavern/st-compat";
import type { Chat } from "@ydltavern/types";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, textField, type HandlerRecord } from "../types.js";

const CAPABILITY_ID = `${PACKAGE_ID}/script.eval`;

export const scriptHandlers: HandlerRecord = {
  [CAPABILITY_ID]: (input: unknown) => evaluateScript(input),
};

function evaluateScript(input: unknown) {
  const record = inputRecord(input);
  const script = textField(input, "stscript") || textField(input, "script");
  const runtime = createSTContext({
    chat: readChat(record["chat"]),
    name1: readString(record["name1"], "User"),
    name2: readString(record["name2"], "Assistant"),
    persona: readString(record["persona"], undefined),
    description: readString(record["description"], undefined),
    personality: readString(record["personality"], undefined),
    scenario: readString(record["scenario"], undefined),
    extensionSettings: readObject(record["extensionSettings"] ?? record["extension_settings"]),
  });
  const ctx = runtime.getContext();
  const variables = readVariables(record["variables"]);
  for (const [key, value] of Object.entries(variables)) {
    ctx.variables.set(key, value);
  }

  const result = ctx.executeSlashCommands(script, { stopOnError: record["stopOnError"] === true });
  return {
    meta: createCapabilityMeta(CAPABILITY_ID, {
      deterministic: true,
      stscript_runtime: "skeleton",
    }),
    executed: true,
    input: script,
    output: result.output,
    ok: result.ok,
    executions: result.executions,
    diagnostics: result.diagnostics,
    variables: result.variables,
    chat_length: ctx.chat.length,
    command_registry: ctx.slashCommands(),
  };
}

function readChat(value: unknown): Chat {
  if (value && typeof value === "object" && Array.isArray((value as { turns?: unknown }).turns)) {
    return value as Chat;
  }
  return { id: "script_eval_chat", meta: { title: "Script eval" }, turns: [] };
}

function readString(value: unknown, fallback: string): string;
function readString(value: unknown, fallback: undefined): string | undefined;
function readString(value: unknown, fallback: string | undefined): string | undefined {
  return typeof value === "string" ? value : fallback;
}

function readObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function readVariables(value: unknown): Record<string, string> {
  const record = readObject(value);
  return Object.fromEntries(Object.entries(record).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}
