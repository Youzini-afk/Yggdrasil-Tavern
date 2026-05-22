import type { JsonObject, STPreservedPayload } from '@ydltavern/types';

import type { ImportDiagnostic } from './common/diagnostics.js';
import { asJsonObject, decodeBase64, looksLikeBase64, looksLikeJson, numberProp, objectProp, parseJsonInput, parseJsonObjectCandidate, stringArrayProp, stringProp } from './common/json.js';

export type CharacterCardFormat = 'st_v1' | 'st_v2' | 'st_v3' | 'png_st' | 'unknown_json';

export interface ImportedCharacterCardVersion {
  readonly spec?: string;
  readonly spec_version?: string;
}

export interface ImportedCharacterCard {
  readonly kind: 'character_card';
  readonly format: CharacterCardFormat;
  readonly version?: ImportedCharacterCardVersion;
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

export function normalizeCharacterCard(payload: JsonObject, format: CharacterCardFormat, diagnostics: ImportDiagnostic[]): ImportedCharacterCard {
  const data = objectProp(payload, 'data') ?? payload;
  const extensions = objectProp(data, 'extensions') ?? objectProp(payload, 'extensions');
  const name = stringProp(data, 'name') ?? stringProp(payload, 'name');
  if (name === undefined || name.length === 0) {
    diagnostics.push({ severity: 'warning', message: 'Character card is missing a name; using Untitled Character.', path: 'name' });
  }

  return {
    kind: 'character_card',
    format,
    version: extractCharacterVersion(payload, data),
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
  const data = objectProp(payload, 'data');
  const specVersion = stringProp(payload, 'spec_version') ?? numberProp(payload, 'spec_version')?.toString() ?? (data === undefined ? undefined : stringProp(data, 'spec_version') ?? numberProp(data, 'spec_version')?.toString());
  if (spec?.toLowerCase().includes('chara_card_v3') || specVersion === '3' || specVersion?.startsWith('3.')) return 'st_v3';
  if (spec?.toLowerCase().includes('chara_card_v2') || specVersion === '2' || specVersion?.startsWith('2.') || objectProp(payload, 'data') !== undefined) return 'st_v2';
  if (stringProp(payload, 'char_name') !== undefined || stringProp(payload, 'name') !== undefined) return 'st_v1';
  return 'unknown_json';
}

function extractCharacterVersion(payload: JsonObject, data: JsonObject): ImportedCharacterCardVersion | undefined {
  const spec = stringProp(payload, 'spec') ?? stringProp(data, 'spec');
  const specVersion = stringProp(payload, 'spec_version') ?? numberProp(payload, 'spec_version')?.toString() ?? stringProp(data, 'spec_version') ?? numberProp(data, 'spec_version')?.toString();
  if (spec === undefined && specVersion === undefined) return undefined;
  return { spec, spec_version: specVersion };
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
