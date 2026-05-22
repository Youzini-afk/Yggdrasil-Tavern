import type { Chat, Turn, TurnVariant } from '@ydltavern/types';

import type { PromptBlock, PromptMessage } from './prompt.js';

export interface TokenCountMessage {
  readonly role?: string;
  readonly content: string;
}

export interface ApproxTokenizerOptions {
  readonly charsPerToken?: number;
  readonly messageOverhead?: number;
}

export interface Tokenizer {
  countText(text: string): number;
  countMessages(messages: readonly TokenCountMessage[]): number;
}

export interface ApplyPromptBudgetOptions {
  readonly maxTokens: number;
  readonly reserveTokens?: number;
  readonly tokenizer?: Tokenizer;
}

export interface PromptBudgetTokenUsage {
  readonly budget: number;
  readonly reserved: number;
  readonly available: number;
  readonly blocks: number;
  readonly history: number;
  readonly total: number;
  readonly droppedHistory: number;
}

export interface ApplyPromptBudgetResult {
  readonly kept: {
    readonly blocks: readonly PromptBlock[];
    readonly messages: readonly PromptMessage[];
  };
  readonly dropped: {
    readonly messages: readonly PromptMessage[];
    readonly turnIds: readonly string[];
  };
  readonly tokenUsage: PromptBudgetTokenUsage;
  readonly warnings: readonly string[];
}

export function createApproxTokenizer(options: ApproxTokenizerOptions = {}): Tokenizer {
  const charsPerToken = options.charsPerToken ?? 4;
  const messageOverhead = options.messageOverhead ?? 4;
  return {
    countText(text: string): number {
      return countText(text, { charsPerToken });
    },
    countMessages(messages: readonly TokenCountMessage[]): number {
      return countMessages(messages, { charsPerToken, messageOverhead });
    },
  };
}

export function countText(text: string, options: Pick<ApproxTokenizerOptions, 'charsPerToken'> = {}): number {
  const charsPerToken = Math.max(1, options.charsPerToken ?? 4);
  return Math.ceil(text.length / charsPerToken);
}

export function countMessages(messages: readonly TokenCountMessage[], options: ApproxTokenizerOptions = {}): number {
  const tokenizer = createApproxTokenizer(options);
  const overhead = options.messageOverhead ?? 4;
  return messages.reduce((sum, message) => sum + tokenizer.countText(message.content) + overhead, 0);
}

export function applyPromptBudget(
  blocks: readonly PromptBlock[],
  chat: Chat,
  options: ApplyPromptBudgetOptions,
): ApplyPromptBudgetResult {
  const tokenizer = options.tokenizer ?? createApproxTokenizer();
  const reserved = Math.max(0, options.reserveTokens ?? 0);
  const available = Math.max(0, options.maxTokens - reserved);
  const keptBlocks = blocks.filter((block) => block.enabled !== false);
  const blockMessages = keptBlocks
    .filter((block) => block.identifier !== 'chatHistory' && block.content.trim() !== '')
    .map((block): PromptMessage => ({ role: block.role ?? 'system', content: block.content }));
  const blocksTokens = tokenizer.countMessages(blockMessages);
  const history = chat.turns.flatMap(turnToBudgetMessage);
  const keptHistory = [...history];
  const droppedHistory: BudgetHistoryMessage[] = [];
  let historyTokens = tokenizer.countMessages(keptHistory);

  while (keptHistory.length > 0 && blocksTokens + historyTokens > available) {
    const dropped = keptHistory.shift();
    if (dropped === undefined) {
      break;
    }
    droppedHistory.push(dropped);
    historyTokens = tokenizer.countMessages(keptHistory);
  }

  const droppedTokens = tokenizer.countMessages(droppedHistory);
  const warnings = blocksTokens > available
    ? ['Prompt blocks exceed the available token budget; system blocks were preserved and all history may be dropped.']
    : [];

  return {
    kept: {
      blocks: keptBlocks,
      messages: keptHistory.map(({ role, content }) => ({ role, content })),
    },
    dropped: {
      messages: droppedHistory.map(({ role, content }) => ({ role, content })),
      turnIds: droppedHistory.map((message) => message.turnId),
    },
    tokenUsage: {
      budget: options.maxTokens,
      reserved,
      available,
      blocks: blocksTokens,
      history: historyTokens,
      total: blocksTokens + historyTokens,
      droppedHistory: droppedTokens,
    },
    warnings,
  };
}

interface BudgetHistoryMessage extends PromptMessage {
  readonly turnId: string;
}

function turnToBudgetMessage(turn: Turn): readonly BudgetHistoryMessage[] {
  if (turn.hidden === true || turn.deleted === true) {
    return [];
  }
  const variant = turn.variants[turn.active_variant];
  if (variant === undefined) {
    return [];
  }
  const content = variantMainText(variant).trim();
  return content === '' ? [] : [{ role: turn.role, content, turnId: turn.id }];
}

function variantMainText(variant: TurnVariant): string {
  return variant.subs
    .filter((sub) => sub.kind === 'text')
    .map((sub) => sub.text)
    .join('\n');
}
