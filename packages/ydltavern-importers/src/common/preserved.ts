import type { JsonObject, JsonValue, STPreservedPayload } from '@ydltavern/types';

import { isJsonObject, toJsonPreserved } from './json.js';

export function preservedPayload<T extends JsonValue>(format: string, payload: T): STPreservedPayload<T> {
  return { format, payload };
}

export function preservedJson(format: string, payload: unknown): STPreservedPayload<JsonValue> {
  return { format, payload: toJsonPreserved(payload) };
}

export function preservedObjectOrUndefined(preserved: STPreservedPayload | undefined): JsonObject | undefined {
  return isJsonObject(preserved?.payload) ? preserved.payload : undefined;
}
