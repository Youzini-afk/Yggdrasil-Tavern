import type { Chat } from '@ydltavern/types';
import { activeVariant, mainText } from '@ydltavern/types';

import type { ExtensionDiagnostic } from './registry.js';

export interface MemorySettingsInput {
  readonly enabled?: boolean;
  readonly maxSummaryTokens?: number;
  readonly insertionTemplate?: string;
  readonly updateAfterTurns?: number;
  readonly includeHidden?: boolean;
}

export interface MemorySettings {
  readonly enabled: boolean;
  readonly maxSummaryTokens: number;
  readonly insertionTemplate: string;
  readonly updateAfterTurns: number;
  readonly includeHidden: boolean;
}

export interface MemoryPromptInsertion {
  readonly enabled: boolean;
  readonly content: string;
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface MemoryUpdatePlan {
  readonly kind: 'memoryUpdateProposal';
  readonly shouldUpdate: boolean;
  readonly candidateTurnIds: readonly string[];
  readonly currentSummary?: string;
  readonly proposal: string;
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

const DEFAULT_MEMORY_SETTINGS: MemorySettings = {
  enabled: true,
  maxSummaryTokens: 512,
  insertionTemplate: 'Memory summary:\n{{summary}}',
  updateAfterTurns: 8,
  includeHidden: false,
};

export function normalizeMemorySettings(input: MemorySettingsInput = {}): MemorySettings {
  return {
    enabled: input.enabled ?? DEFAULT_MEMORY_SETTINGS.enabled,
    maxSummaryTokens: positiveInteger(input.maxSummaryTokens, DEFAULT_MEMORY_SETTINGS.maxSummaryTokens),
    insertionTemplate: input.insertionTemplate ?? DEFAULT_MEMORY_SETTINGS.insertionTemplate,
    updateAfterTurns: positiveInteger(input.updateAfterTurns, DEFAULT_MEMORY_SETTINGS.updateAfterTurns),
    includeHidden: input.includeHidden ?? DEFAULT_MEMORY_SETTINGS.includeHidden,
  };
}

export function buildMemoryPromptInsertion(summary: string, settingsInput: MemorySettingsInput = {}): MemoryPromptInsertion {
  const settings = normalizeMemorySettings(settingsInput);
  if (!settings.enabled || summary.trim() === '') {
    return { enabled: false, content: '', diagnostics: [] };
  }
  return {
    enabled: true,
    content: settings.insertionTemplate.replace('{{summary}}', summary.trim()),
    diagnostics: [],
  };
}

export function planMemoryUpdate(chat: Chat, settingsInput: MemorySettingsInput = {}): MemoryUpdatePlan {
  const settings = normalizeMemorySettings(settingsInput);
  const diagnostics: ExtensionDiagnostic[] = [];
  if (!settings.enabled) {
    return {
      kind: 'memoryUpdateProposal',
      shouldUpdate: false,
      candidateTurnIds: [],
      proposal: 'Memory is disabled; no summary update proposed.',
      diagnostics,
    };
  }

  const visibleTurns = chat.turns.filter((turn) => settings.includeHidden || (turn.hidden !== true && turn.deleted !== true));
  const candidateTurns = visibleTurns.slice(-settings.updateAfterTurns);
  if (candidateTurns.length < settings.updateAfterTurns) {
    diagnostics.push({ level: 'info', code: 'memory.update.insufficientTurns', message: 'Not enough turns for scheduled memory update.', extensionId: 'memory' });
  }
  const currentSummary = [...chat.turns].reverse().find((turn) => turn.memory_summary !== undefined)?.memory_summary;
  const excerpts = candidateTurns.map((turn) => {
    const variant = activeVariant(turn);
    const text = variant === undefined ? '' : mainText(variant).trim();
    return `${turn.role}: ${text}`.slice(0, 160);
  });

  return {
    kind: 'memoryUpdateProposal',
    shouldUpdate: candidateTurns.length >= settings.updateAfterTurns,
    candidateTurnIds: candidateTurns.map((turn) => turn.id),
    currentSummary,
    proposal: `Plan-only memory update from ${candidateTurns.length} turns. No summarization performed.\n${excerpts.join('\n')}`.trim(),
    diagnostics,
  };
}

function positiveInteger(value: number | undefined, fallback: number): number {
  return value === undefined || !Number.isFinite(value) || value <= 0 ? fallback : Math.floor(value);
}
