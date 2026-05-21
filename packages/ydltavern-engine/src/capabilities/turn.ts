import { PACKAGE_ID, createStubMeta, stableInputRef, type HandlerRecord } from "../types.js";

const GENERATE_ID = `${PACKAGE_ID}/turn.generate`;
const SWIPE_ID = `${PACKAGE_ID}/turn.swipe`;
const REGENERATE_ID = `${PACKAGE_ID}/turn.regenerate`;
const CONTINUE_ID = `${PACKAGE_ID}/turn.continue`;

export async function* generateTurnFrames(input: unknown): AsyncGenerator<unknown> {
  yield generateTurnSnapshot(input);
}

const generateTurnSnapshot = (input: unknown) => ({
  meta: createStubMeta(GENERATE_ID),
  // TODO: streaming when SDK is reachable.
  streaming: {
    mode: "snapshot",
    frames: [
      {
        type: "final",
        text: "Stub assistant response from YdlTavern Engine.",
      },
    ],
  },
  turn: {
    id: `stub-assistant-turn-for-${stableInputRef(input)}`,
    role: "assistant",
    active_variant_index: 0,
    variants: [
      {
        index: 0,
        text: "Stub assistant response from YdlTavern Engine.",
        finish_reason: "stub",
      },
    ],
  },
});

const nextVariant = (capabilityId: string, input: unknown, mode: "swipe" | "regenerate") => ({
  meta: createStubMeta(capabilityId),
  turn_id: stableInputRef(input),
  mode,
  variant: {
    index: 1,
    text: `Stub ${mode} assistant response from YdlTavern Engine.`,
    finish_reason: "stub",
  },
});

export const turnHandlers: HandlerRecord = {
  [GENERATE_ID]: (input: unknown) => generateTurnSnapshot(input),
  [SWIPE_ID]: (input: unknown) => nextVariant(SWIPE_ID, input, "swipe"),
  [REGENERATE_ID]: (input: unknown) => nextVariant(REGENERATE_ID, input, "regenerate"),
  [CONTINUE_ID]: (input: unknown) => ({
    meta: createStubMeta(CONTINUE_ID),
    turn_id: stableInputRef(input),
    append: {
      target: "last_variant.text",
      text: " Stub continuation from YdlTavern Engine.",
    },
  }),
};
