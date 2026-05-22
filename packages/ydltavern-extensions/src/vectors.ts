import type { Chat } from '@ydltavern/types';
import { activeVariant, mainText } from '@ydltavern/types';

import type { ExtensionDiagnostic } from './registry.js';

export interface VectorSettingsInput {
  readonly enabled?: boolean;
  readonly provider?: string;
  readonly collection?: string;
  readonly chunkSize?: number;
  readonly topK?: number;
  readonly injectionTemplate?: string;
}

export interface VectorSettings {
  readonly enabled: boolean;
  readonly provider: string;
  readonly collection: string;
  readonly chunkSize: number;
  readonly topK: number;
  readonly injectionTemplate: string;
}

export interface VectorPlan {
  readonly kind: 'vectorIndexPlan' | 'vectorQueryPlan' | 'vectorInjectionPlan';
  readonly actions: readonly string[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

const DEFAULT_VECTOR_SETTINGS: VectorSettings = {
  enabled: true,
  provider: 'none',
  collection: 'chat-memory',
  chunkSize: 800,
  topK: 4,
  injectionTemplate: 'Relevant memories:\n{{matches}}',
};

export function normalizeVectorSettings(input: VectorSettingsInput = {}): VectorSettings {
  return {
    enabled: input.enabled ?? DEFAULT_VECTOR_SETTINGS.enabled,
    provider: input.provider ?? DEFAULT_VECTOR_SETTINGS.provider,
    collection: input.collection ?? DEFAULT_VECTOR_SETTINGS.collection,
    chunkSize: positiveInteger(input.chunkSize, DEFAULT_VECTOR_SETTINGS.chunkSize),
    topK: positiveInteger(input.topK, DEFAULT_VECTOR_SETTINGS.topK),
    injectionTemplate: input.injectionTemplate ?? DEFAULT_VECTOR_SETTINGS.injectionTemplate,
  };
}

export function planVectorIndex(chat: Chat, settingsInput: VectorSettingsInput = {}): VectorPlan {
  const settings = normalizeVectorSettings(settingsInput);
  const diagnostics = baseDiagnostics(settings);
  const actions = settings.enabled
    ? chat.turns
      .filter((turn) => turn.deleted !== true && activeVariant(turn) !== undefined)
      .map((turn) => `index:${settings.collection}:${turn.id}:${chunkText(mainText(activeVariant(turn)!), settings.chunkSize).length}`)
    : [];
  return { kind: 'vectorIndexPlan', actions, diagnostics };
}

export function planVectorQuery(query: string, settingsInput: VectorSettingsInput = {}): VectorPlan {
  const settings = normalizeVectorSettings(settingsInput);
  const diagnostics = baseDiagnostics(settings);
  const actions = settings.enabled && query.trim() !== ''
    ? [`query:${settings.collection}:topK=${settings.topK}:text=${query.trim()}`]
    : [];
  if (query.trim() === '') {
    diagnostics.push({ level: 'info', code: 'vectors.query.empty', message: 'Empty vector query; no retrieval planned.', extensionId: 'vectors' });
  }
  return { kind: 'vectorQueryPlan', actions, diagnostics };
}

export function planVectorInjection(matches: readonly string[], settingsInput: VectorSettingsInput = {}): VectorPlan {
  const settings = normalizeVectorSettings(settingsInput);
  const diagnostics = baseDiagnostics(settings);
  const rendered = settings.injectionTemplate.replace('{{matches}}', matches.join('\n'));
  const actions = settings.enabled && matches.length > 0 ? [`inject:${rendered}`] : [];
  if (matches.length === 0) {
    diagnostics.push({ level: 'info', code: 'vectors.matches.empty', message: 'No vector matches available for injection.', extensionId: 'vectors' });
  }
  return { kind: 'vectorInjectionPlan', actions, diagnostics };
}

function baseDiagnostics(settings: VectorSettings): ExtensionDiagnostic[] {
  const diagnostics: ExtensionDiagnostic[] = [{
    level: 'info',
    code: 'vectors.planOnly',
    message: 'Vector extension is plan-only; embeddings and network calls are not performed.',
    extensionId: 'vectors',
  }];
  if (!settings.enabled) {
    diagnostics.push({ level: 'info', code: 'vectors.disabled', message: 'Vector extension is disabled.', extensionId: 'vectors' });
  }
  if (settings.provider === 'none') {
    diagnostics.push({ level: 'warning', code: 'vectors.provider.none', message: 'No vector provider is configured.', extensionId: 'vectors' });
  }
  return diagnostics;
}

function positiveInteger(value: number | undefined, fallback: number): number {
  return value === undefined || !Number.isFinite(value) || value <= 0 ? fallback : Math.floor(value);
}

function chunkText(text: string, size: number): readonly string[] {
  if (text === '') {
    return [];
  }
  const chunks: string[] = [];
  for (let index = 0; index < text.length; index += size) {
    chunks.push(text.slice(index, index + size));
  }
  return chunks;
}
