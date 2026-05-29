import { PACKAGE_ID, createCapabilityMeta, stableInputRef } from "../types.js";
import { evaluateWorldInfoFromInput } from "./prompt-critical.js";
const CAPABILITY_ID = `${PACKAGE_ID}/world_info.evaluate`;
export const worldInfoHandlers = {
    [CAPABILITY_ID]: (input) => ({
        meta: createCapabilityMeta(CAPABILITY_ID, { deterministic: true }),
        chat_state_ref: stableInputRef(input),
        ...evaluateWorldInfoFromInput(input),
    }),
};
//# sourceMappingURL=world-info.js.map