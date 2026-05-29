import { buildModelCallPlan, consumeModelStreamFrames } from "@ydltavern/engine-core";
import { PACKAGE_ID, createCapabilityMeta, inputRecord, stringField } from "../types.js";
const PLAN_CALL_ID = `${PACKAGE_ID}/model.plan_call`;
const CONSUME_STREAM_ID = `${PACKAGE_ID}/model.consume_stream`;
export const modelHandlers = {
    [PLAN_CALL_ID]: (input) => {
        const record = inputRecord(input);
        const plan = buildModelCallPlan({
            profile: readModelProfile(record["profile"] ?? record["model_profile"] ?? record),
            requestShape: record["requestShape"] ?? record["request_shape"] ?? record["request"] ?? {},
            stream: readBoolean(record["stream"]),
        });
        return {
            meta: createCapabilityMeta(PLAN_CALL_ID, { deterministic: true, fake_generation: true, model_boundary: true }),
            plan,
        };
    },
    [CONSUME_STREAM_ID]: (input) => {
        const record = inputRecord(input);
        const frames = Array.isArray(record["frames"]) ? record["frames"] : [];
        return {
            meta: createCapabilityMeta(CONSUME_STREAM_ID, { deterministic: true, model_boundary: true }),
            consumed: consumeModelStreamFrames(frames),
        };
    },
};
export function readModelProfile(input) {
    const record = inputRecord(input);
    const mode = record["mode"] === "text" ? "text" : "chat";
    const provider = stringField(record, "provider", "fake-local");
    return {
        provider,
        model: stringField(record, "model", "ydltavern-fake-model"),
        endpoint: readOptionalString(record["endpoint"]),
        secretRef: readOptionalString(record["secretRef"] ?? record["secret_ref"]) ?? defaultSecretRef(provider),
        mode,
        stream: readBoolean(record["stream"]),
    };
}
function defaultSecretRef(provider) {
    return provider === "fake-local" ? undefined : "secret_ref:store:OPENAI_API_KEY";
}
function readOptionalString(value) {
    return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
function readBoolean(value) {
    return typeof value === "boolean" ? value : undefined;
}
//# sourceMappingURL=model.js.map