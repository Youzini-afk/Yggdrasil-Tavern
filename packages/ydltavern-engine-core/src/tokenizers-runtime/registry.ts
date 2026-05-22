import type { TokenizerAdapter, GuesstimateAdapter } from './types.js';
import { OpenAITokenizerAdapter } from './openai-adapter.js';
import { LlamaTokenizerAdapter } from './llama-adapter.js';
import { TOKENIZER, type TokenizerId, guesstimate } from '../tokenizers-st.js';

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

const adapters = new Map<TokenizerId, () => TokenizerAdapter>([
  [TOKENIZER.OPENAI, () => new OpenAITokenizerAdapter(TOKENIZER.OPENAI)],
  [TOKENIZER.GPT2, () => new OpenAITokenizerAdapter(TOKENIZER.GPT2)],
  [TOKENIZER.LLAMA, () => new LlamaTokenizerAdapter(TOKENIZER.LLAMA)],
  [TOKENIZER.LLAMA3, () => new LlamaTokenizerAdapter(TOKENIZER.LLAMA3)],
]);

export async function getTokenizer(
  id: TokenizerId,
  options: { readonly modelHint?: string } = {},
): Promise<TokenizerAdapter> {
  const factory = adapters.get(id);
  if (!factory) return createGuesstimateAdapter(id);
  if (id === TOKENIZER.OPENAI && options.modelHint) {
    return new OpenAITokenizerAdapter(id, options.modelHint);
  }
  return factory();
}
