import type { TokenizerId } from '../tokenizers-st.js';

export interface TokenizerAdapter {
  readonly id: TokenizerId;
  readonly modelHint?: string;
  load(): Promise<void>;
  encode(text: string): Promise<readonly number[]>;
  decode(tokens: readonly number[]): Promise<string>;
  count(text: string): Promise<number>;
}

export type EncodingId = 'cl100k_base' | 'o200k_base' | 'p50k_base' | 'r50k_base';

export function selectEncodingForModel(model: string): EncodingId {
  // Mirror gpt-tokenizer's modelToEncodingMap logic + SillyTavern's heuristics
  const m = model.toLowerCase();
  if (m.startsWith('gpt-4o') || m.startsWith('gpt-5') || m.startsWith('o1') || m.startsWith('o3') || m.startsWith('o4')) {
    return 'o200k_base';
  }
  if (m.startsWith('gpt-4') || m.startsWith('gpt-3.5') || m.startsWith('chatgpt')) {
    return 'cl100k_base';
  }
  if (m.startsWith('text-davinci') || m.startsWith('code-')) {
    return 'p50k_base';
  }
  return 'r50k_base';
}

export interface GetTokenizerOptions {
  readonly modelHint?: string;
}

export interface GuesstimateAdapter extends TokenizerAdapter {
  readonly fallback: true;
}
