import type { TokenizerAdapter } from './types.js';
import { TOKENIZER, type TokenizerId } from '../tokenizers-st.js';

interface AnthropicTokenizerLike {
  countTokens(text: string): number;
}

let anthropicCache: Promise<AnthropicTokenizerLike> | undefined;

async function loadAnthropic(): Promise<AnthropicTokenizerLike> {
  if (!anthropicCache) {
    anthropicCache = (async () => {
      const packageName = '@anthropic-ai/tokenizer';
      const mod = await import(packageName) as unknown;
      // @anthropic-ai/tokenizer@0.0.4 exposes both named countTokens and default.countTokens.
      const anthropicModule = mod as { countTokens?: unknown; default?: { countTokens?: unknown } };
      const counter = anthropicModule.countTokens ?? anthropicModule.default?.countTokens;
      if (typeof counter !== 'function') {
        throw new Error('@anthropic-ai/tokenizer: no countTokens export found');
      }
      return { countTokens: counter as (text: string) => number };
    })();
  }
  return anthropicCache;
}

/**
 * Local Claude tokenizer adapter (approximation only).
 *
 * @anthropic-ai/tokenizer is the official local tokenizer published by Anthropic,
 * but it is NOT a faithful reproduction of the current Claude messages/count_tokens
 * API. It only counts text tokens; structured features (tools, images, PDFs,
 * thinking blocks) require the API. Treat counts from this adapter as estimates.
 *
 * encode/decode are NOT supported by this package — those throw.
 */
export class AnthropicTokenizerAdapter implements TokenizerAdapter {
  readonly id: TokenizerId = TOKENIZER.CLAUDE;
  readonly modelHint?: string;
  private tokenizer?: AnthropicTokenizerLike;

  constructor(modelHint?: string) {
    if (modelHint !== undefined) this.modelHint = modelHint;
  }

  async load(): Promise<void> {
    if (this.tokenizer) return;
    this.tokenizer = await loadAnthropic();
  }

  async encode(_text: string): Promise<readonly number[]> {
    throw new Error('AnthropicTokenizerAdapter: encode is not supported (countTokens-only package)');
  }

  async decode(_tokens: readonly number[]): Promise<string> {
    throw new Error('AnthropicTokenizerAdapter: decode is not supported (countTokens-only package)');
  }

  async count(text: string): Promise<number> {
    await this.load();
    return this.tokenizer!.countTokens(text);
  }
}
