import { PACKAGE_ID, createStubMeta, textField, type HandlerRecord } from "../types.js";

const CAPABILITY_ID = `${PACKAGE_ID}/script.eval`;

export const scriptHandlers: HandlerRecord = {
  [CAPABILITY_ID]: (input: unknown) => ({
    meta: createStubMeta(CAPABILITY_ID),
    executed: false,
    echo: {
      stscript: textField(input, "stscript") || textField(input, "script"),
      output: "Stub STScript evaluation result.",
    },
  }),
};
