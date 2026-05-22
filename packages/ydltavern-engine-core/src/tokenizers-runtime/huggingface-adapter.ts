import type { TokenizerAdapter } from './types.js';
import { type TokenizerId } from '../tokenizers-st.js';

export interface HuggingFaceTokenizerSource {
  /** Pre-loaded tokenizer.json content as a parsed object. */
  readonly tokenizerJson: unknown;
  /** Optional tokenizer_config.json for chat templates etc. */
  readonly tokenizerConfig?: unknown;
}

interface HfTokenizerLike {
  encode(text: string): { ids: number[] };
  decode(tokens: number[]): string;
}

const tokenizerCache = new Map<string, Promise<HfTokenizerLike>>();

async function loadHfPackage(): Promise<{
  Tokenizer: new (json: unknown, config?: unknown) => HfTokenizerLike;
}> {
  const packageName = '@huggingface/tokenizers';
  const mod = await import(packageName) as unknown;
  // @huggingface/tokenizers@0.1.3 exposes a named Tokenizer export.
  const Tokenizer = (mod as { Tokenizer?: unknown }).Tokenizer
    ?? (mod as { default?: { Tokenizer?: unknown } }).default?.Tokenizer;
  if (typeof Tokenizer !== 'function') {
    throw new Error('@huggingface/tokenizers: no Tokenizer constructor found');
  }
  return { Tokenizer: Tokenizer as new (json: unknown, config?: unknown) => HfTokenizerLike };
}

/**
 * Generic Hugging Face tokenizer adapter for pre-fetched tokenizer files.
 *
 * This adapter intentionally does not fetch tokenizer.json/tokenizer_config.json
 * from the Hugging Face Hub. Network permission, persistence, cache invalidation,
 * and integrity checks are host concerns; callers must provide parsed file content.
 */
export class HuggingFaceTokenizerAdapter implements TokenizerAdapter {
  readonly id: TokenizerId;
  readonly modelHint?: string;
  private readonly source: HuggingFaceTokenizerSource;
  private readonly cacheKey: string;
  private tokenizer?: HfTokenizerLike;

  constructor(id: TokenizerId, source: HuggingFaceTokenizerSource, modelHint?: string) {
    this.id = id;
    this.source = source;
    if (modelHint !== undefined) this.modelHint = modelHint;
    // Cache key: id + model hint (so multiple models share parsed tokenizers).
    this.cacheKey = modelHint ? `${id}::${modelHint}` : id;
  }

  async load(): Promise<void> {
    if (this.tokenizer) return;
    let cached = tokenizerCache.get(this.cacheKey);
    if (!cached) {
      cached = (async () => {
        const { Tokenizer } = await loadHfPackage();
        return new Tokenizer(this.source.tokenizerJson, this.source.tokenizerConfig);
      })();
      tokenizerCache.set(this.cacheKey, cached);
    }
    this.tokenizer = await cached;
  }

  async encode(text: string): Promise<readonly number[]> {
    await this.load();
    return this.tokenizer!.encode(text).ids;
  }

  async decode(tokens: readonly number[]): Promise<string> {
    await this.load();
    return this.tokenizer!.decode([...tokens]);
  }

  async count(text: string): Promise<number> {
    await this.load();
    return this.tokenizer!.encode(text).ids.length;
  }
}

export function createHuggingFaceTokenizer(
  id: TokenizerId,
  source: HuggingFaceTokenizerSource,
  modelHint?: string,
): TokenizerAdapter {
  return new HuggingFaceTokenizerAdapter(id, source, modelHint);
}
