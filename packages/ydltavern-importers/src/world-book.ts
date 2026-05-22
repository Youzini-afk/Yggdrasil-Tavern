import type { JsonObject, STPreservedPayload } from '@ydltavern/types';

import type { ImportDiagnostic } from './common/diagnostics.js';
import { booleanProp, isJsonObject, isRecord, numberProp, objectProp, parseJsonInput, splitKeys, stringArrayProp, stringProp } from './common/json.js';

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
