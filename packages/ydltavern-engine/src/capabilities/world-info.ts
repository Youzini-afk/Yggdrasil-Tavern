import { PACKAGE_ID, createCapabilityMeta, stableInputRef, type HandlerRecord } from "../types.js";

import { evaluateWorldInfoFromInput } from "./prompt-critical.js";

const CAPABILITY_ID = `${PACKAGE_ID}/world_info.evaluate`;

export const worldInfoHandlers: HandlerRecord = {
  [CAPABILITY_ID]: (input: unknown) => ({
    meta: createCapabilityMeta(CAPABILITY_ID, { deterministic: true }),
    chat_state_ref: stableInputRef(input),
    ...evaluateWorldInfoFromInput(input),
  }),
};
