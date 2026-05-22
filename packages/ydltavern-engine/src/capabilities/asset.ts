import {
  exportCharacterCard,
  exportChatHistory,
  exportPreset,
  exportWorldBook,
  importCharacterCard,
  importChatHistory,
  importInstructPreset,
  importPersona,
  importPreset,
  importQuickReplies,
  importRegexScripts,
  importTheme,
  importWorldBook,
} from "@ydltavern/importers";
import type { JsonObject } from "@ydltavern/types";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, type HandlerRecord } from "../types.js";

const CHARACTER_ID = `${PACKAGE_ID}/asset.import_character_v2`;
const WORLD_BOOK_ID = `${PACKAGE_ID}/asset.import_world_book`;
const CHAT_ID = `${PACKAGE_ID}/asset.import_chat_history`;
const PRESET_ID = `${PACKAGE_ID}/asset.import_preset`;
const PERSONA_ID = `${PACKAGE_ID}/asset.import_persona`;
const THEME_ID = `${PACKAGE_ID}/asset.import_theme`;
const QUICK_REPLY_ID = `${PACKAGE_ID}/asset.import_quick_replies`;
const REGEX_ID = `${PACKAGE_ID}/asset.import_regex_scripts`;
const INSTRUCT_ID = `${PACKAGE_ID}/asset.import_instruct_preset`;
const EXPORT_CHARACTER_ID = `${PACKAGE_ID}/asset.export_character_v2`;
const EXPORT_WORLD_BOOK_ID = `${PACKAGE_ID}/asset.export_world_book`;
const EXPORT_CHAT_ID = `${PACKAGE_ID}/asset.export_chat_history`;
const EXPORT_PRESET_ID = `${PACKAGE_ID}/asset.export_preset`;

export const assetHandlers: HandlerRecord = {
  [CHARACTER_ID]: (input: unknown) => importCharacterCard(readImporterPayload(input)),
  [WORLD_BOOK_ID]: (input: unknown) => importWorldBook(readTextOrObjectPayload(input)),
  [CHAT_ID]: (input: unknown) => importChatHistory(readTextOrObjectPayload(input)),
  [PRESET_ID]: (input: unknown) => importPreset(readTextOrObjectPayload(input)),
  [PERSONA_ID]: (input: unknown) => importPersona(readTextOrObjectPayload(input)),
  [THEME_ID]: (input: unknown) => importTheme(readTextOrObjectPayload(input)),
  [QUICK_REPLY_ID]: (input: unknown) => importQuickReplies(readTextOrObjectPayload(input)),
  [REGEX_ID]: (input: unknown) => importRegexScripts(readTextOrObjectPayload(input)),
  [INSTRUCT_ID]: (input: unknown) => importInstructPreset(readTextOrObjectPayload(input)),
  [EXPORT_CHARACTER_ID]: (input: unknown) => exportCharacterCard(importCharacterCard(readImporterPayload(input))),
  [EXPORT_WORLD_BOOK_ID]: (input: unknown) => exportWorldBook(importWorldBook(readTextOrObjectPayload(input))),
  [EXPORT_CHAT_ID]: (input: unknown) => exportChatHistory(importChatHistory(readTextOrObjectPayload(input))),
  [EXPORT_PRESET_ID]: (input: unknown) => exportPreset(importPreset(readTextOrObjectPayload(input))),
};

function readImporterPayload(input: unknown): string | JsonObject | Uint8Array {
  const record = inputRecord(input);
  const payload = record["payload"] ?? record["source"] ?? input;
  if (payload instanceof Uint8Array) {
    return payload;
  }
  if (typeof payload === "string" || (typeof payload === "object" && payload !== null && !Array.isArray(payload))) {
    return payload as string | JsonObject;
  }

  return {
    meta: createCapabilityMeta(`${PACKAGE_ID}/asset.invalid_input`),
  };
}

function readTextOrObjectPayload(input: unknown): string | JsonObject {
  const payload = readImporterPayload(input);
  if (payload instanceof Uint8Array) {
    throw new TypeError("world book import does not accept binary payloads");
  }
  return payload;
}
