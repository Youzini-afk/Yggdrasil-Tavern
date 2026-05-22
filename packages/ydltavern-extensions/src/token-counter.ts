import type { TokenCountMessage, Tokenizer } from '@ydltavern/engine-core';
import { createApproxTokenizer } from '@ydltavern/engine-core';

import type { ExtensionDiagnostic } from './registry.js';

export interface PromptChunk {
  readonly id: string;
  readonly text: string;
  readonly role?: string;
  readonly enabled?: boolean;
}

export interface PromptChunkAnalysis {
  readonly id: string;
  readonly role?: string;
  readonly enabled: boolean;
  readonly characters: number;
  readonly tokens: number;
}

export interface PromptChunkAnalysisResult {
  readonly chunks: readonly PromptChunkAnalysis[];
  readonly totalTokens: number;
  readonly enabledTokens: number;
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export function countText(text: string, tokenizer: Tokenizer = createApproxTokenizer()): number {
  return tokenizer.countText(text);
}

export function countMessages(messages: readonly TokenCountMessage[], tokenizer: Tokenizer = createApproxTokenizer()): number {
  return tokenizer.countMessages(messages);
}

export function analyzePromptChunks(
  chunks: readonly PromptChunk[],
  tokenizer: Tokenizer = createApproxTokenizer(),
): PromptChunkAnalysisResult {
  const diagnostics: ExtensionDiagnostic[] = [];
  const analyses = chunks.map((chunk): PromptChunkAnalysis => {
    if (chunk.text.trim() === '') {
      diagnostics.push({
        level: 'info',
        code: 'tokenCounter.chunk.empty',
        message: `Prompt chunk ${chunk.id} is empty.`,
        extensionId: 'token-counter',
      });
    }
    return {
      id: chunk.id,
      role: chunk.role,
      enabled: chunk.enabled !== false,
      characters: chunk.text.length,
      tokens: tokenizer.countText(chunk.text),
    };
  });

  return {
    chunks: analyses,
    totalTokens: analyses.reduce((sum, chunk) => sum + chunk.tokens, 0),
    enabledTokens: analyses.filter((chunk) => chunk.enabled).reduce((sum, chunk) => sum + chunk.tokens, 0),
    diagnostics,
  };
}
