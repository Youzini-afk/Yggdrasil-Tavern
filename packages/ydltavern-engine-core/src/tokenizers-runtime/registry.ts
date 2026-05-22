import type { TokenizerAdapter, GuesstimateAdapter } from './types.js';
import { OpenAITokenizerAdapter } from './openai-adapter.js';
import { LlamaTokenizerAdapter } from './llama-adapter.js';
import { AnthropicTokenizerAdapter } from './anthropic-adapter.js';
import { createHuggingFaceTokenizer, type HuggingFaceTokenizerSource } from './huggingface-adapter.js';
import { TOKENIZER, type TokenizerId, guesstimate, getTokenizerBestMatch } from '../tokenizers-st.js';

export interface CountTokensOptions {
  readonly modelHint?: string;
  /** Override the tokenizer id selection (skip getTokenizerBestMatch). */
  readonly tokenizerId?: TokenizerId;
  /** For HF families that need a caller-provided tokenizer.json/config source. */
  readonly huggingFaceSource?: HuggingFaceTokenizerSource;
}

export interface CountTokensResult {
  readonly count: number;
  readonly tokenizerId: TokenizerId;
  /** exact = real BPE/tokenizer, approximation = Claude local text counter, guesstimate = byte/3.35 fallback. */
  readonly accuracy: 'exact' | 'approximation' | 'guesstimate';
  /** True if this tokenizer id/model key has already been counted through this registry in this process. */
  readonly warmCache: boolean;
}

export function createGuesstimateAdapter(id: TokenizerId): GuesstimateAdapter {
  return {
    id,
    fallback: true,
    async load() {},
    async encode() { throw new Error(`encode not supported for ${id} (guesstimate fallback)`); },
    async decode() { throw new Error(`decode not supported for ${id} (guesstimate fallback)`); },
    async count(text: string) { return guesstimate(text); },
  };
}

const adapters = new Map<TokenizerId, (options: { readonly modelHint?: string }) => TokenizerAdapter>([
  [TOKENIZER.OPENAI, (options) => new OpenAITokenizerAdapter(TOKENIZER.OPENAI, options.modelHint)],
  [TOKENIZER.GPT2, (options) => new OpenAITokenizerAdapter(TOKENIZER.GPT2, options.modelHint)],
  [TOKENIZER.LLAMA, (options) => new LlamaTokenizerAdapter(TOKENIZER.LLAMA, {}, options.modelHint)],
  [TOKENIZER.LLAMA3, (options) => new LlamaTokenizerAdapter(TOKENIZER.LLAMA3, {}, options.modelHint)],
  [TOKENIZER.CLAUDE, (options) => new AnthropicTokenizerAdapter(options.modelHint)],
]);

const loadedIds = new Set<string>();

export async function getTokenizer(
  id: TokenizerId,
  options: { readonly modelHint?: string } = {},
): Promise<TokenizerAdapter> {
  const factory = adapters.get(id);
  if (!factory) return createGuesstimateAdapter(id);
  return factory(options);
}

export async function countTokens(
  text: string,
  options: CountTokensOptions = {},
): Promise<CountTokensResult> {
  const tokenizerId = options.tokenizerId
    ?? (options.modelHint ? getTokenizerBestMatch(options.modelHint) : TOKENIZER.OPENAI);
  const cacheKey = `${tokenizerId}::${options.modelHint ?? ''}`;
  const warmCache = loadedIds.has(cacheKey);
  const adapter = options.huggingFaceSource
    ? createHuggingFaceTokenizer(tokenizerId, options.huggingFaceSource, options.modelHint)
    : await getTokenizer(tokenizerId, { modelHint: options.modelHint });

  const count = await adapter.count(text);
  loadedIds.add(cacheKey);

  return {
    count,
    tokenizerId,
    accuracy: classifyAccuracy(adapter, tokenizerId),
    warmCache,
  };
}

function classifyAccuracy(adapter: TokenizerAdapter, id: TokenizerId): CountTokensResult['accuracy'] {
  if ('fallback' in adapter && (adapter as { readonly fallback?: boolean }).fallback === true) {
    return 'guesstimate';
  }
  if (id === TOKENIZER.CLAUDE) return 'approximation';
  return 'exact';
}
