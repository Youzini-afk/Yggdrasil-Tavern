import type { Chat, JsonObject, STPreservedPayload, Turn, TurnRole, TurnVariant } from '@ydltavern/types';

import type { ImportDiagnostic } from './common/diagnostics.js';
import { booleanProp, entryRawWithout, isJsonObject, numberProp, parseJsonlInput, stringProp, toJsonPreserved } from './common/json.js';

export interface ImportedChatHistory {
  readonly kind: 'chat_history';
  readonly chat: Chat;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
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
      title: isJsonObject(payload) ? stringProp(payload, 'name') ?? stringProp(payload, 'title') : undefined,
      character_id: isJsonObject(payload) ? stringProp(payload, 'character_id') : undefined,
      group_id: isJsonObject(payload) ? stringProp(payload, 'group_id') : undefined,
      persona_id: isJsonObject(payload) ? stringProp(payload, 'persona_id') : undefined,
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
  const createdAt = parseDateToUnixMillis(stringProp(message, 'send_date')) ?? numberProp(message, 'created_at') ?? 0;
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

function parseDateToUnixMillis(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function stableId(prefix: string, index: number): string {
  return `${prefix}_${index.toString().padStart(6, '0')}`;
}
