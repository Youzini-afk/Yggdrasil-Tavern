import { PACKAGE_ID, createStubMeta, stableInputRef, type HandlerRecord } from "../types.js";

const CHARACTER_ID = `${PACKAGE_ID}/asset.import_character_v2`;
const WORLD_BOOK_ID = `${PACKAGE_ID}/asset.import_world_book`;

export const assetHandlers: HandlerRecord = {
  [CHARACTER_ID]: (input: unknown) => ({
    meta: createStubMeta(CHARACTER_ID),
    source_ref: stableInputRef(input),
    character: {
      id: "stub-character-v2",
      name: "Stub Character",
      format: "sillytavern_character_card_v2",
      parsed: false,
      persisted: false,
    },
  }),
  [WORLD_BOOK_ID]: (input: unknown) => ({
    meta: createStubMeta(WORLD_BOOK_ID),
    source_ref: stableInputRef(input),
    world_book: {
      id: "stub-world-book",
      name: "Stub World Book",
      entries: [],
      parsed: false,
      persisted: false,
    },
  }),
};
