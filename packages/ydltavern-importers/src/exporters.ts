import type { Chat, JsonObject, JsonValue } from '@ydltavern/types';

import { mainText } from '@ydltavern/types';

import type { ImportedCharacterCard } from './character.js';
import type { ImportedChatHistory } from './chat.js';
import type { ImportedPreset } from './assets.js';
import type { ImportedWorldBook } from './world-book.js';
import { isJsonObject } from './common/json.js';
import { preservedObjectOrUndefined } from './common/preserved.js';

type MutableJsonObject = { [key: string]: JsonValue };

export function exportCharacterCard(card: ImportedCharacterCard): JsonObject {
  const preserved = preservedObjectOrUndefined(card.preserved);
  if (preserved !== undefined) return preserved;
  return compactObject({
    spec: card.version?.spec,
    spec_version: card.version?.spec_version,
    data: compactObject({
      name: card.name,
      description: card.description,
      personality: card.personality,
      scenario: card.scenario,
      first_mes: card.first_mes,
      mes_example: card.mes_example,
      creator_notes: card.creator_notes,
      tags: card.tags === undefined ? undefined : [...card.tags],
      extensions: card.extensions,
    }),
  });
}

export function exportWorldBook(book: ImportedWorldBook): JsonObject {
  const preserved = preservedObjectOrUndefined(book.preserved);
  if (preserved !== undefined) return preserved;
  return compactObject({
    name: book.name,
    entries: book.entries.map((entry) => preservedObjectOrUndefined(entry.preserved) ?? compactObject({
      keys: [...entry.keys],
      comment: entry.comment,
      content: entry.content,
      enabled: entry.enabled,
      position: entry.position,
      order: entry.order,
      probability: entry.probability,
      depth: entry.depth,
      selective: entry.selective,
      constant: entry.constant,
      extensions: entry.extensions,
    })),
  });
}

export function exportChatHistory(history: ImportedChatHistory | Chat): JsonObject | readonly JsonObject[] {
  const maybeHistory = history as ImportedChatHistory;
  if (maybeHistory.kind === 'chat_history' && maybeHistory.preserved !== undefined) {
    const payload = maybeHistory.preserved.payload;
    if (isJsonObject(payload)) return payload;
    if (Array.isArray(payload) && payload.every(isJsonObject)) return payload;
  }
  const chat = maybeHistory.kind === 'chat_history' ? maybeHistory.chat : history as Chat;
  return chat.turns.map((turn) => {
    const variant = turn.variants[turn.active_variant] ?? turn.variants[0];
    const raw = isJsonObject(variant?.meta.raw) ? variant.meta.raw : {};
    return {
      ...raw,
      name: turn.speaker?.name ?? turn.role,
      is_user: turn.role === 'user',
      is_system: turn.role === 'system',
      mes: variant === undefined ? '' : mainText(variant),
      created_at: turn.created_at,
      is_hidden: turn.hidden ?? false,
      deleted: turn.deleted ?? false,
    };
  });
}

export function exportPreset(preset: ImportedPreset): JsonObject {
  const preserved = preservedObjectOrUndefined(preset.preserved);
  if (preserved !== undefined) return preserved;
  return preset.raw;
}

function compactObject(values: Record<string, JsonValue | undefined>): JsonObject {
  const output: MutableJsonObject = {};
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) output[key] = value;
  }
  return output;
}
