import type { Chat, JsonObject, JsonValue, STPreservedPayload, Turn, TurnRole, TurnVariant } from '@ydltavern/types';

export type ImportDiagnosticSeverity = 'warning';

export interface ImportDiagnostic {
  readonly severity: ImportDiagnosticSeverity;
  readonly message: string;
  readonly path?: string;
}

export type CharacterCardFormat = 'st_v1' | 'st_v2' | 'st_v3' | 'png_st' | 'unknown_json';

export interface ImportedCharacterCard {
  readonly kind: 'character_card';
  readonly format: CharacterCardFormat;
  readonly name: string;
  readonly description?: string;
  readonly personality?: string;
  readonly scenario?: string;
  readonly first_mes?: string;
  readonly mes_example?: string;
  readonly creator_notes?: string;
  readonly tags?: readonly string[];
  readonly extensions?: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedWorldBookEntry {
  readonly keys: readonly string[];
  readonly comment?: string;
  readonly content: string;
  readonly enabled: boolean;
  readonly position?: number | string;
  readonly order?: number;
  readonly probability?: number;
  readonly depth?: number;
  readonly selective?: boolean;
  readonly constant?: boolean;
  readonly extensions?: JsonObject;
  readonly preserved: STPreservedPayload;
}

export interface ImportedWorldBook {
  readonly kind: 'world_book';
  readonly name?: string;
  readonly entries: readonly ImportedWorldBookEntry[];
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedChatHistory {
  readonly kind: 'chat_history';
  readonly chat: Chat;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

type MutableJsonObject = { [key: string]: JsonValue };
type UnknownRecord = Record<string, unknown>;

const PNG_SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10] as const;

export function importCharacterCard(input: string | JsonObject | Uint8Array): ImportedCharacterCard {
  const diagnostics: ImportDiagnostic[] = [];
  if (input instanceof Uint8Array) {
    const extracted = extractPngCharacterPayload(input, diagnostics);
    const imported = normalizeCharacterCard(extracted.payload, extracted.format, diagnostics);
    return {
      ...imported,
      preserved: { format: extracted.format, payload: extracted.payload },
      diagnostics,
    };
  }

  const payload = parseJsonInput(input, 'character card JSON');
  const format = detectCharacterFormat(payload);
  return normalizeCharacterCard(payload, format, diagnostics);
}

export function importWorldBook(input: string | JsonObject): ImportedWorldBook {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'world book JSON');
  const entriesPayload = extractWorldBookEntries(payload, diagnostics);
  const entries = entriesPayload.map((entry, index) => normalizeWorldBookEntry(entry, index, diagnostics));

  return {
    kind: 'world_book',
    name: stringProp(payload, 'name') ?? stringProp(payload, 'world') ?? stringProp(payload, 'book_name'),
    entries,
    preserved: { format: 'sillytavern_world_info', payload },
    diagnostics,
  };
}

export function importChatHistory(input: string | readonly unknown[] | JsonObject): ImportedChatHistory {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = typeof input === 'string' ? parseJsonlInput(input) : input;
  const messages = extractChatMessages(payload, diagnostics);
  const turns = messages
    .filter((message) => !booleanProp(message, 'is_deleted') && !booleanProp(message, 'deleted'))
    .map((message, index) => normalizeChatTurn(message, index, diagnostics));

  const chat: Chat = {
    id: stableId('chat', 0),
    meta: {
      title: isRecord(payload) ? stringProp(payload, 'name') ?? stringProp(payload, 'title') : undefined,
      character_id: isRecord(payload) ? stringProp(payload, 'character_id') : undefined,
      group_id: isRecord(payload) ? stringProp(payload, 'group_id') : undefined,
      persona_id: isRecord(payload) ? stringProp(payload, 'persona_id') : undefined,
      source_format: 'sillytavern_jsonl',
    },
    turns,
  };

  return {
    kind: 'chat_history',
    chat,
    preserved: { format: 'sillytavern_chat', payload: toJsonPreserved(payload) },
    diagnostics,
  };
}

function normalizeCharacterCard(payload: JsonObject, format: CharacterCardFormat, diagnostics: ImportDiagnostic[]): ImportedCharacterCard {
  const data = objectProp(payload, 'data') ?? payload;
  const extensions = objectProp(data, 'extensions') ?? objectProp(payload, 'extensions');
  const name = stringProp(data, 'name') ?? stringProp(payload, 'name');
  if (name === undefined || name.length === 0) {
    diagnostics.push({ severity: 'warning', message: 'Character card is missing a name; using Untitled Character.', path: 'name' });
  }

  return {
    kind: 'character_card',
    format,
    name: name && name.length > 0 ? name : 'Untitled Character',
    description: stringProp(data, 'description') ?? stringProp(payload, 'description'),
    personality: stringProp(data, 'personality') ?? stringProp(payload, 'personality'),
    scenario: stringProp(data, 'scenario') ?? stringProp(payload, 'scenario'),
    first_mes: stringProp(data, 'first_mes') ?? stringProp(payload, 'first_mes') ?? stringProp(data, 'first_message'),
    mes_example: stringProp(data, 'mes_example') ?? stringProp(payload, 'mes_example') ?? stringProp(data, 'example_dialogue'),
    creator_notes: stringProp(data, 'creator_notes') ?? stringProp(payload, 'creator_notes') ?? stringProp(data, 'creatorcomment'),
    tags: stringArrayProp(data, 'tags') ?? stringArrayProp(payload, 'tags'),
    extensions,
    preserved: { format, payload },
    diagnostics,
  };
}

function detectCharacterFormat(payload: JsonObject): CharacterCardFormat {
  const spec = stringProp(payload, 'spec');
  const specVersion = stringProp(payload, 'spec_version') ?? numberProp(payload, 'spec_version')?.toString();
  if (spec?.toLowerCase().includes('chara_card_v3') || specVersion === '3') return 'st_v3';
  if (spec?.toLowerCase().includes('chara_card_v2') || specVersion === '2' || objectProp(payload, 'data') !== undefined) return 'st_v2';
  if (stringProp(payload, 'char_name') !== undefined || stringProp(payload, 'name') !== undefined) return 'st_v1';
  return 'unknown_json';
}

function extractPngCharacterPayload(input: Uint8Array, diagnostics: ImportDiagnostic[]): { readonly payload: JsonObject; readonly format: 'png_st' } {
  const textChunks = extractPngTextChunks(input);
  for (const chunk of textChunks) {
    const candidates = pngTextCandidates(chunk);
    for (const candidate of candidates) {
      const parsed = parseJsonCandidate(candidate);
      if (parsed !== undefined) return { payload: parsed, format: 'png_st' };
    }
  }
  diagnostics.push({ severity: 'warning', message: 'PNG parsed successfully but no supported character metadata chunk was found.' });
  throw new Error('Invalid character card PNG: no SillyTavern metadata found');
}

export interface PngTextChunk {
  readonly type: 'tEXt' | 'iTXt' | 'zTXt';
  readonly keyword?: string;
  readonly text: string;
}

export function extractPngTextChunks(input: Uint8Array): readonly PngTextChunk[] {
  assertPng(input);
  const chunks: PngTextChunk[] = [];
  let offset: number = PNG_SIGNATURE.length;
  while (offset + 8 <= input.length) {
    const length = readUint32(input, offset);
    const type = ascii(input, offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    const nextOffset: number = dataEnd + 4;
    if (dataEnd > input.length || nextOffset > input.length) {
      throw new Error('Invalid PNG: chunk length exceeds input size');
    }
    const data = input.subarray(dataStart, dataEnd);
    if (type === 'tEXt') {
      const parsed = parseTextChunk(data);
      chunks.push({ type, keyword: parsed.keyword, text: parsed.text });
    } else if (type === 'iTXt') {
      const parsed = parseInternationalTextChunk(data);
      if (parsed.compressionFlag !== 0) {
        chunks.push({ type, keyword: parsed.keyword, text: '' });
      } else {
        chunks.push({ type, keyword: parsed.keyword, text: parsed.text });
      }
    } else if (type === 'zTXt') {
      chunks.push({ type, keyword: parseNullTerminatedLatin1(data).value, text: '' });
    }
    offset = nextOffset;
    if (type === 'IEND') break;
  }
  return chunks;
}

function pngTextCandidates(chunk: PngTextChunk): readonly string[] {
  const values: string[] = [];
  const keyword = chunk.keyword?.toLowerCase();
  if (keyword === 'chara' || keyword === 'ccv3' || keyword === 'character' || keyword === 'metadata') {
    values.push(chunk.text);
  }
  const trimmed = chunk.text.trim();
  if (looksLikeJson(trimmed) || looksLikeBase64(trimmed)) {
    values.push(trimmed);
  }
  return values;
}

function parseJsonCandidate(candidate: string): JsonObject | undefined {
  const direct = parseJsonObjectCandidate(candidate);
  if (direct !== undefined) return direct;
  if (looksLikeBase64(candidate)) {
    const decoded = decodeBase64(candidate);
    if (decoded !== undefined) return parseJsonObjectCandidate(decoded);
  }
  return undefined;
}

function parseJsonObjectCandidate(candidate: string): JsonObject | undefined {
  try {
    const parsed: unknown = JSON.parse(candidate);
    return asJsonObject(parsed);
  } catch {
    return undefined;
  }
}

function extractWorldBookEntries(payload: JsonObject, diagnostics: ImportDiagnostic[]): readonly JsonObject[] {
  const entries = payload.entries ?? payload.entry ?? payload.data;
  if (Array.isArray(entries)) {
    return entries.filter((entry, index): entry is JsonObject => {
      const valid = isJsonObject(entry);
      if (!valid) diagnostics.push({ severity: 'warning', message: 'Skipping non-object world book entry.', path: `entries.${index}` });
      return valid;
    });
  }
  if (isRecord(entries)) {
    return Object.values(entries).filter((entry, index): entry is JsonObject => {
      const valid = isJsonObject(entry);
      if (!valid) diagnostics.push({ severity: 'warning', message: 'Skipping non-object world book entry.', path: `entries.${index}` });
      return valid;
    });
  }
  diagnostics.push({ severity: 'warning', message: 'World book has no entries array/object; returning empty entries.' });
  return [];
}

function normalizeWorldBookEntry(entry: JsonObject, index: number, diagnostics: ImportDiagnostic[]): ImportedWorldBookEntry {
  const keys = stringArrayProp(entry, 'keys') ?? stringArrayProp(entry, 'key') ?? splitKeys(stringProp(entry, 'key'));
  const content = stringProp(entry, 'content') ?? '';
  if (content.length === 0) {
    diagnostics.push({ severity: 'warning', message: 'World book entry has empty content.', path: `entries.${index}.content` });
  }
  return {
    keys,
    comment: stringProp(entry, 'comment'),
    content,
    enabled: !(booleanProp(entry, 'disable') ?? false) && (booleanProp(entry, 'enabled') ?? true),
    position: numberProp(entry, 'position') ?? stringProp(entry, 'position'),
    order: numberProp(entry, 'order'),
    probability: numberProp(entry, 'probability'),
    depth: numberProp(entry, 'depth'),
    selective: booleanProp(entry, 'selective'),
    constant: booleanProp(entry, 'constant'),
    extensions: objectProp(entry, 'extensions'),
    preserved: { format: 'sillytavern_world_info_entry', payload: entry },
  };
}

function extractChatMessages(payload: readonly unknown[] | JsonObject, diagnostics: ImportDiagnostic[]): readonly JsonObject[] {
  let candidate: unknown;
  if (!isJsonObject(payload)) candidate = payload;
  else candidate = payload.messages ?? payload.chat ?? payload.data;
  if (!Array.isArray(candidate)) {
    diagnostics.push({ severity: 'warning', message: 'Chat payload has no message array; returning empty chat.' });
    return [];
  }
  return candidate.filter((message, index): message is JsonObject => {
    const valid = isJsonObject(message);
    if (!valid) diagnostics.push({ severity: 'warning', message: 'Skipping non-object chat message.', path: `messages.${index}` });
    return valid;
  });
}

function normalizeChatTurn(message: JsonObject, index: number, diagnostics: ImportDiagnostic[]): Turn {
  const isUser = booleanProp(message, 'is_user') ?? false;
  const isSystem = booleanProp(message, 'is_system') ?? false;
  const role: TurnRole = isSystem ? 'system' : isUser ? 'user' : 'assistant';
  const text = stringProp(message, 'mes') ?? stringProp(message, 'text') ?? stringProp(message, 'content') ?? '';
  if (text.length === 0) {
    diagnostics.push({ severity: 'warning', message: 'Chat message has empty text.', path: `messages.${index}.mes` });
  }
  const createdAt = parseDateToUnixMillis(stringProp(message, 'send_date')) ?? 0;
  const variant: TurnVariant = {
    id: stableId('variant', index),
    subs: [{ kind: 'text', text }],
    meta: { raw: entryRawWithout(message, ['mes', 'text', 'content']) },
    created_at: createdAt,
  };
  return {
    id: stableId('turn', index),
    index,
    role,
    speaker: { name: stringProp(message, 'name') ?? role, kind: role === 'assistant' ? 'character' : role === 'user' ? 'user' : 'system' },
    variants: [variant],
    active_variant: 0,
    source: 'imported',
    hidden: booleanProp(message, 'is_hidden') ?? booleanProp(message, 'hidden'),
    created_at: createdAt,
    deleted: booleanProp(message, 'deleted') ?? booleanProp(message, 'is_deleted'),
  };
}

function parseJsonInput(input: string | JsonObject, label: string): JsonObject {
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

function parseJsonlInput(input: string): readonly JsonObject[] | JsonObject {
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

function assertPng(input: Uint8Array): void {
  if (input.length < PNG_SIGNATURE.length) throw new Error('Invalid PNG: input is too short');
  for (let index = 0; index < PNG_SIGNATURE.length; index += 1) {
    if (input[index] !== PNG_SIGNATURE[index]) throw new Error('Invalid PNG: bad signature');
  }
}

function readUint32(input: Uint8Array, offset: number): number {
  return ((input[offset] ?? 0) * 0x1000000) + ((input[offset + 1] ?? 0) << 16) + ((input[offset + 2] ?? 0) << 8) + (input[offset + 3] ?? 0);
}

function ascii(input: Uint8Array, start: number, end: number): string {
  return String.fromCharCode(...input.subarray(start, end));
}

function parseTextChunk(data: Uint8Array): { readonly keyword?: string; readonly text: string } {
  const parsed = parseNullTerminatedLatin1(data);
  return { keyword: parsed.value, text: latin1(data.subarray(parsed.nextOffset)) };
}

function parseInternationalTextChunk(data: Uint8Array): { readonly keyword?: string; readonly compressionFlag: number; readonly text: string } {
  const keyword = parseNullTerminatedLatin1(data);
  const compressionFlag = data[keyword.nextOffset] ?? 0;
  let offset = keyword.nextOffset + 2;
  const language = parseNullTerminatedLatin1(data.subarray(offset));
  offset += language.nextOffset;
  const translatedKeyword = parseNullTerminatedUtf8(data.subarray(offset));
  offset += translatedKeyword.nextOffset;
  return { keyword: keyword.value, compressionFlag, text: utf8(data.subarray(offset)) };
}

function parseNullTerminatedLatin1(data: Uint8Array): { readonly value: string; readonly nextOffset: number } {
  const terminator = data.indexOf(0);
  const end = terminator === -1 ? data.length : terminator;
  return { value: latin1(data.subarray(0, end)), nextOffset: terminator === -1 ? data.length : terminator + 1 };
}

function parseNullTerminatedUtf8(data: Uint8Array): { readonly value: string; readonly nextOffset: number } {
  const terminator = data.indexOf(0);
  const end = terminator === -1 ? data.length : terminator;
  return { value: utf8(data.subarray(0, end)), nextOffset: terminator === -1 ? data.length : terminator + 1 };
}

function latin1(data: Uint8Array): string {
  return new TextDecoder('latin1').decode(data);
}

function utf8(data: Uint8Array): string {
  return new TextDecoder().decode(data);
}

function decodeBase64(value: string): string | undefined {
  try {
    if (typeof Buffer !== 'undefined') return Buffer.from(value, 'base64').toString('utf8');
  } catch {
    return undefined;
  }
  return undefined;
}

function looksLikeJson(value: string): boolean {
  return (value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'));
}

function looksLikeBase64(value: string): boolean {
  return value.length > 0 && value.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/u.test(value);
}

function stringProp(record: JsonObject, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' ? value : undefined;
}

function numberProp(record: JsonObject, key: string): number | undefined {
  const value = record[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function booleanProp(record: JsonObject, key: string): boolean | undefined {
  const value = record[key];
  return typeof value === 'boolean' ? value : undefined;
}

function objectProp(record: JsonObject, key: string): JsonObject | undefined {
  return asJsonObject(record[key]);
}

function stringArrayProp(record: JsonObject, key: string): readonly string[] | undefined {
  const value = record[key];
  if (!Array.isArray(value)) return undefined;
  const strings = value.filter((item): item is string => typeof item === 'string');
  return strings.length === value.length ? strings : undefined;
}

function splitKeys(value: string | undefined): readonly string[] {
  if (value === undefined) return [];
  return value.split(',').map((key) => key.trim()).filter((key) => key.length > 0);
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isJsonObject(value: unknown): value is JsonObject {
  if (!isRecord(value)) return false;
  return Object.values(value).every(isJsonValue);
}

function isJsonValue(value: unknown): value is JsonValue {
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(isJsonValue);
  return isJsonObject(value);
}

function asJsonObject(value: unknown): JsonObject | undefined {
  return isJsonObject(value) ? value : undefined;
}

function toJsonPreserved(value: unknown): JsonValue {
  if (isJsonValue(value)) return value;
  return null;
}

function entryRawWithout(entry: JsonObject, omittedKeys: readonly string[]): JsonObject {
  const raw: MutableJsonObject = {};
  for (const [key, value] of Object.entries(entry)) {
    if (!omittedKeys.includes(key)) raw[key] = value;
  }
  return raw;
}

function parseDateToUnixMillis(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function stableId(prefix: string, index: number): string {
  return `${prefix}_${index.toString().padStart(6, '0')}`;
}
