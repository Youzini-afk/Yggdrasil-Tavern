export const PACKAGE_ID = "ydltavern/engine";
export const ENGINE_VERSION = "0.0.1";
export const PROTOCOL_VERSION = "0.1.0";
export const createStubMeta = (capabilityId) => ({
    capability_id: capabilityId,
    package_id: PACKAGE_ID,
    engine_version: ENGINE_VERSION,
    stub: true,
    side_effects: "none",
});
export const createCapabilityMeta = (capabilityId, details = {}) => ({
    capability_id: capabilityId,
    package_id: PACKAGE_ID,
    engine_version: ENGINE_VERSION,
    side_effects: "none",
    ...details,
});
export const isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
export const inputRecord = (input) => (isRecord(input) ? input : {});
export const stringField = (input, fieldName, fallback) => {
    const value = input[fieldName];
    return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};
export const stableInputRef = (input) => {
    if (isRecord(input)) {
        const record = input;
        const explicitId = record["id"] ?? record["turn_id"] ?? record["preset_id"] ?? record["chat_state_ref"];
        if (typeof explicitId === "string" && explicitId.length > 0) {
            return explicitId;
        }
    }
    return "stub-input";
};
export const textField = (input, fieldName) => {
    if (input && typeof input === "object") {
        const value = input[fieldName];
        if (typeof value === "string") {
            return value;
        }
    }
    return "";
};
//# sourceMappingURL=types.js.map