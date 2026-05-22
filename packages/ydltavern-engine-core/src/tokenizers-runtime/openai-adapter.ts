import type { TokenizerAdapter, EncodingId } from './types.js';
import { selectEncodingForModel } from './types.js';
import { TOKENIZER, type TokenizerId } from '../tokenizers-st.js';

interface EncodingModule {
  encode(text: string): number[];
  decode(tokens: number[]): string;
}

// Module cache keyed by encoding id - prevents reloading
const encodingCache = new Map<EncodingId, Promise<EncodingModule>>();

async function loadEncoding(encoding: EncodingId): Promise<EncodingModule> {
  let cached = encodingCache.get(encoding);
  if (!cached) {
    cached = (async () => {
      // gpt-tokenizer exposes per-encoding entry points
      const mod = await import(`gpt-tokenizer/encoding/${encoding}`);
      return mod as EncodingModule;
    })();
    encodingCache.set(encoding, cached);
  }
  return cached;
}

export class OpenAITokenizerAdapter implements TokenizerAdapter {
  readonly id: TokenizerId;
  readonly modelHint?: string;
  private encoding: EncodingId;
  private module?: EncodingModule;

  constructor(id: TokenizerId, modelHint?: string) {
    this.id = id;
    if (modelHint !== undefined) this.modelHint = modelHint;
    // Map TOKENIZER id to default encoding
    this.encoding = id === TOKENIZER.GPT2 ? 'r50k_base' : selectEncodingForModel(modelHint ?? '');
  }

  async load(): Promise<void> {
    if (this.module) return;
    this.module = await loadEncoding(this.encoding);
  }

  async encode(text: string): Promise<readonly number[]> {
    await this.load();
    return this.module!.encode(text);
  }

  async decode(tokens: readonly number[]): Promise<string> {
    await this.load();
    return this.module!.decode([...tokens]);
  }

  async count(text: string): Promise<number> {
    await this.load();
    return this.module!.encode(text).length;
  }
}
