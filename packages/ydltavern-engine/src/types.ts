export const PACKAGE_ID = "ydltavern/engine";
export const ENGINE_VERSION = "0.0.1";
export const PROTOCOL_VERSION = "0.1.0";

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export type Handler = (input: unknown) => unknown | Promise<unknown>;
export type HandlerRecord = Record<string, Handler>;

export interface InvocationCounters {
  total: number;
  byCapability: Record<string, number>;
}

export const createStubMeta = (capabilityId: string) => ({
  capability_id: capabilityId,
  package_id: PACKAGE_ID,
  engine_version: ENGINE_VERSION,
  stub: true,
  side_effects: "none",
});

export const stableInputRef = (input: unknown): string => {
  if (input && typeof input === "object") {
    const record = input as Record<string, unknown>;
    const explicitId = record["id"] ?? record["turn_id"] ?? record["preset_id"] ?? record["chat_state_ref"];
    if (typeof explicitId === "string" && explicitId.length > 0) {
      return explicitId;
    }
  }

  return "stub-input";
};

export const textField = (input: unknown, fieldName: string): string => {
  if (input && typeof input === "object") {
    const value = (input as Record<string, unknown>)[fieldName];
    if (typeof value === "string") {
      return value;
    }
  }

  return "";
};
