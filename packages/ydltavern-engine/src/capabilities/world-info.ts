import { PACKAGE_ID, createStubMeta, stableInputRef, type HandlerRecord } from "../types.js";

const CAPABILITY_ID = `${PACKAGE_ID}/world_info.evaluate`;

export const worldInfoHandlers: HandlerRecord = {
  [CAPABILITY_ID]: (input: unknown) => ({
    meta: createStubMeta(CAPABILITY_ID),
    chat_state_ref: stableInputRef(input),
    wi_evaluation_plan: {
      strategy: "stub-no-op",
      activated_entries: [],
      skipped_entries: [],
      insertion_points: [],
    },
  }),
};
