export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  readonly [key: string]: JsonValue;
}

export type UnixMillis = number;

export type Ulid = string;

export type MimeType = string;

export interface SourceLocation {
  readonly file: string;
  readonly line?: number;
}
