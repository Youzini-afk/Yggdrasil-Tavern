import { PACKAGE_ID, createStubMeta, stableInputRef, type HandlerRecord } from "../types.js";

const CAPABILITY_ID = `${PACKAGE_ID}/preset.compile`;

export const presetHandlers: HandlerRecord = {
  [CAPABILITY_ID]: (input: unknown) => ({
    meta: createStubMeta(CAPABILITY_ID),
    preset_id: stableInputRef(input),
    compiled_prompt_manager_plan: {
      order: [
        "main",
        "persona",
        "char_description",
        "scenario",
        "world_info_before",
        "chat_history",
        "world_info_after",
        "post_history_instructions",
      ],
      connector: "stub/chat-completion",
      token_budget: {
        mode: "stub",
        max_context_tokens: 0,
      },
    },
  }),
};
