import { ST_PROMPT_MANAGER_IDENTIFIERS } from '@ydltavern/types/st';
import type { Chat, Turn, TurnRole, TurnVariant } from '@ydltavern/types';
import type { STPromptManagerIdentifier } from '@ydltavern/types/st';

export type PromptBlockIdentifier = STPromptManagerIdentifier | (string & Record<never, never>);

export type PromptMessageRole = Extract<TurnRole, 'system' | 'user' | 'assistant' | 'tool'>;

export interface PromptBlock {
  readonly identifier: PromptBlockIdentifier;
  readonly role?: PromptMessageRole;
  readonly content: string;
  readonly enabled?: boolean;
  readonly position?: number;
  readonly order?: number;
}

export interface PromptMessage {
  readonly role: PromptMessageRole;
  readonly content: string;
}

export type PromptBuildMode = 'chat' | 'text';

export interface BuildPromptOptions {
  readonly mode?: PromptBuildMode;
}

export interface PromptBuildDiagnostics {
  readonly mode: PromptBuildMode;
  readonly includedBlocks: readonly PromptBlockIdentifier[];
  readonly skippedBlocks: readonly PromptBlockIdentifier[];
  readonly insertedHistoryTurns: number;
  readonly warnings: readonly string[];
}

export interface BuildPromptResult {
  readonly messages: readonly PromptMessage[];
  readonly text: string;
  readonly diagnostics: PromptBuildDiagnostics;
}

const PROMPT_MANAGER_IDENTIFIERS: ReadonlySet<string> = new Set<string>(ST_PROMPT_MANAGER_IDENTIFIERS);

export function buildPrompt(
  blocks: readonly PromptBlock[],
  chat: Chat,
  options: BuildPromptOptions = {},
): BuildPromptResult {
  const mode = options.mode ?? 'chat';
  const sortedBlocks = [...blocks].sort(comparePromptBlocks);
  const includedBlocks: PromptBlockIdentifier[] = [];
  const skippedBlocks: PromptBlockIdentifier[] = [];
  const warnings: string[] = [];
  const messages: PromptMessage[] = [];
  const textParts: string[] = [];
  const historyMessages = chat.turns.flatMap((turn) => turnToPromptMessage(turn, warnings));
  let historyInserted = false;

  for (const block of sortedBlocks) {
    if (block.enabled === false) {
      skippedBlocks.push(block.identifier);
      continue;
    }

    includedBlocks.push(block.identifier);
    if (!isKnownPromptIdentifier(block.identifier)) {
      warnings.push(`Unknown prompt block identifier: ${block.identifier}`);
    }

    if (block.identifier === 'chatHistory') {
      appendHistory(mode, historyMessages, messages, textParts);
      historyInserted = true;
      continue;
    }

    if (block.content.trim() === '') {
      continue;
    }

    if (mode === 'chat') {
      messages.push({ role: block.role ?? 'system', content: block.content });
    } else {
      textParts.push(block.content);
    }
  }

  if (!historyInserted) {
    appendHistory(mode, historyMessages, messages, textParts);
  }

  return {
    messages: mode === 'chat' ? messages : [],
    text: mode === 'text' ? textParts.join('\n\n') : '',
    diagnostics: {
      mode,
      includedBlocks,
      skippedBlocks,
      insertedHistoryTurns: historyMessages.length,
      warnings,
    },
  };
}

function comparePromptBlocks(left: PromptBlock, right: PromptBlock): number {
  return blockSortValue(left) - blockSortValue(right);
}

function blockSortValue(block: PromptBlock): number {
  return block.order ?? block.position ?? 0;
}

function appendHistory(
  mode: PromptBuildMode,
  historyMessages: readonly PromptMessage[],
  messages: PromptMessage[],
  textParts: string[],
): void {
  if (mode === 'chat') {
    messages.push(...historyMessages);
    return;
  }

  if (historyMessages.length > 0) {
    textParts.push(historyMessages.map(formatHistoryMessage).join('\n'));
  }
}

function turnToPromptMessage(turn: Turn, warnings: string[]): readonly PromptMessage[] {
  if (turn.hidden === true || turn.deleted === true) {
    return [];
  }

  const active = activeVariant(turn);
  if (active === undefined) {
    warnings.push(`Turn ${turn.id} has no active variant at index ${turn.active_variant}`);
    return [];
  }

  const content = variantMainText(active).trim();
  if (content === '') {
    return [];
  }

  return [{ role: turn.role, content }];
}

function activeVariant(turn: Turn): TurnVariant | undefined {
  return turn.variants[turn.active_variant];
}

function variantMainText(variant: TurnVariant): string {
  return variant.subs
    .filter((sub) => sub.kind === 'text')
    .map((sub) => sub.text)
    .join('\n');
}

function formatHistoryMessage(message: PromptMessage): string {
  return `${roleLabel(message.role)}: ${message.content}`;
}

function roleLabel(role: PromptMessageRole): string {
  switch (role) {
    case 'assistant':
      return 'Assistant';
    case 'system':
      return 'System';
    case 'tool':
      return 'Tool';
    case 'user':
      return 'User';
  }
}

function isKnownPromptIdentifier(identifier: PromptBlockIdentifier): boolean {
  return PROMPT_MANAGER_IDENTIFIERS.has(identifier);
}
