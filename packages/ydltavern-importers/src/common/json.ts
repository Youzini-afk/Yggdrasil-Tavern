import type { JsonObject, JsonValue } from '@ydltavern/types';

type MutableJsonObject = { [key: string]: JsonValue };
type UnknownRecord = Record<string, unknown>;

export function parseJsonInput(input: string | JsonObject, label: string): JsonObject {
  if (typeof input !== 'string') return input;
  try {
    const parsed: unknown = JSON.parse(input);
    const object = asJsonObject(parsed);
    if (object === undefined) throw new Error(`${label} must be a JSON object`);
    return object;
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Invalid ${label}: ${error.message}`);
    throw error;
  }
}

export function parseJsonlInput(input: string): readonly JsonObject[] | JsonObject {
  const trimmed = input.trim();
  if (trimmed.length === 0) return [];
  if (!trimmed.includes('\n') && looksLikeJson(trimmed)) {
    const parsed: unknown = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter(isJsonObject);
    const object = asJsonObject(parsed);
    if (object === undefined) throw new Error('Invalid chat history JSON: top-level value must be an object or array');
    return object;
  }
  return trimmed.split(/\r?\n/u).map((line, index) => {
    try {
      const parsed: unknown = JSON.parse(line);
      const object = asJsonObject(parsed);
      if (object === undefined) throw new Error('line is not an object');
      return object;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown parse error';
      throw new Error(`Invalid chat history JSONL at line ${index + 1}: ${message}`);
    }
  });
}

export function parseJsonObjectCandidate(candidate: string): JsonObject | undefined {
  try {
    const parsed: unknown = JSON.parse(candidate);
    return asJsonObject(parsed);
  } catch {
    return undefined;
  }
}

export function looksLikeJson(value: string): boolean {
  return (value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'));
}

export function looksLikeBase64(value: string): boolean {
  return value.length > 0 && value.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/u.test(value);
}

export function decodeBase64(value: string): string | undefined {
  try {
    if (typeof Buffer !== 'undefined') return Buffer.from(value, 'base64').toString('utf8');
  } catch {
    return undefined;
  }
  return undefined;
}

export function stringProp(record: JsonObject, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

export function numberProp(record: JsonObject, key: string): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

export function booleanProp(record: JsonObject, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === 'boolean' ? value : undefined;
}

export function objectProp(record: JsonObject, key: string): JsonObject | undefined {
  return asJsonObject(record[key]);
}

export function stringArrayProp(record: JsonObject, key: string): readonly string[] | undefined {
  const value = record[key];
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item): item is string => typeof item === 'string');
  return strings.length === value.length ? strings : undefined;
}

export function jsonObjectArrayProp(record: JsonObject, key: string): readonly JsonObject[] | undefined {
  const value = record[key];
  if (!Array.isArray(value)) return undefined;
  return value.filter(isJsonObject);
}

export function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isJsonObject(value: unknown): value is JsonObject {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isJsonValue);
}

export function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isJsonObject(value);
}

export function asJsonObject(value: unknown): JsonObject | undefined {
  return isJsonObject(value) ? value : undefined;
}

export function toJsonPreserved(value: unknown): JsonValue {
  if (isJsonValue(value)) return value;
  return null;
}

export function entryRawWithout(entry: JsonObject, omittedKeys: readonly string[]): JsonObject {
  const raw: MutableJsonObject = {};
  for (const [key, value] of Object.entries(entry)) {
    if (!omittedKeys.includes(key)) raw[key] = value;
  }
  return raw;
}

export function splitKeys(value: string | undefined): readonly string[] {
  if (value === undefined) return [];
  return value.split(',').map((key) => key.trim()).filter((key) => key.length > 0);
}

export function pickFirstString(record: JsonObject, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = stringProp(record, key);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function pickFirstObject(record: JsonObject, keys: readonly string[]): JsonObject | undefined {
  for (const key of keys) {
    const value = objectProp(record, key);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function pickFirstStringArray(record: JsonObject, keys: readonly string[]): readonly string[] | undefined {
  for (const key of keys) {
    const value = stringArrayProp(record, key);
    if (value !== undefined) return value;
  }
  return undefined;
}
