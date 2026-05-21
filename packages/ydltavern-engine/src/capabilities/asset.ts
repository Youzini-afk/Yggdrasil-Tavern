import { importCharacterCard, importWorldBook } from "@ydltavern/importers";
import type { JsonObject } from "@ydltavern/types";

import { PACKAGE_ID, createCapabilityMeta, inputRecord, type HandlerRecord } from "../types.js";

const CHARACTER_ID = `${PACKAGE_ID}/asset.import_character_v2`;
const WORLD_BOOK_ID = `${PACKAGE_ID}/asset.import_world_book`;

export const assetHandlers: HandlerRecord = {
  [CHARACTER_ID]: (input: unknown) => importCharacterCard(readImporterPayload(input)),
  [WORLD_BOOK_ID]: (input: unknown) => importWorldBook(readTextOrObjectPayload(input)),
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
