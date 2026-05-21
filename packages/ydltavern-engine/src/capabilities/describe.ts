import { ENGINE_VERSION, PACKAGE_ID, createStubMeta, type HandlerRecord } from "../types.js";

const CAPABILITY_ID = `${PACKAGE_ID}/describe`;

export const describeHandlers: HandlerRecord = {
  [CAPABILITY_ID]: () => ({
    meta: createStubMeta(CAPABILITY_ID),
    engine: {
      id: PACKAGE_ID,
      version: ENGINE_VERSION,
      status: "skeleton",
    },
    supported_connectors: [
      { id: "stub/chat-completion", kind: "chat_completion", streaming: false },
      { id: "stub/text-completion", kind: "text_completion", streaming: false },
    ],
    supported_features: [
      "preset.compile.stub",
      "world_info.evaluate.stub",
      "turn.generate.stub",
      "turn.swipe.stub",
      "turn.regenerate.stub",
      "turn.continue.stub",
      "asset.import_character_v2.stub",
      "asset.import_world_book.stub",
      "script.eval.stub",
    ],
  }),
};
