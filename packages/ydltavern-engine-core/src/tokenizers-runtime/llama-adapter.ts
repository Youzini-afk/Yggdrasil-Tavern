import type { TokenizerAdapter } from './types.js';
import { TOKENIZER, type TokenizerId } from '../tokenizers-st.js';

// llama-tokenizer-js: encode(prompt, add_bos_token=true, add_preceding_space=true)
// No EOS support — the package doesn't add end-of-sequence tokens.
interface Llama12TokenizerLike {
  encode(text: string, addBos?: boolean, addPrecedingSpace?: boolean): number[];
  decode(tokens: number[]): string;
}

// llama3-tokenizer-js: encode(prompt, options?) where options = {bos?, eos?}
// Default options when omitted: {bos: true, eos: true}
interface Llama3TokenizerLike {
  encode(text: string, options?: { readonly bos?: boolean; readonly eos?: boolean }): number[];
  decode(tokens: number[]): string;
}

// Module-level caches — prevent reloading across all adapter instances
let llama12Cache: Promise<Llama12TokenizerLike> | undefined;
let llama3Cache: Promise<Llama3TokenizerLike> | undefined;

async function loadLlama12(): Promise<Llama12TokenizerLike> {
  if (!llama12Cache) {
    llama12Cache = (async () => {
      const mod = await import('llama-tokenizer-js');
      const tok = (mod.default ?? mod) as Llama12TokenizerLike;
      return tok;
    })();
  }
  return llama12Cache;
}

async function loadLlama3(): Promise<Llama3TokenizerLike> {
  if (!llama3Cache) {
    llama3Cache = (async () => {
      const mod = await import('llama3-tokenizer-js');
      const tok = (mod.default ?? mod) as Llama3TokenizerLike;
      return tok;
    })();
  }
  return llama3Cache;
}

export interface LlamaAdapterOptions {
  /** Include beginning-of-sequence token (default: true, matching ST behavior) */
  readonly addBos?: boolean;
  /**
   * Include end-of-sequence token.
   * For LLAMA (Llama 1/2): not supported by the package — ignored.
   * For LLAMA3 (Llama 3+): default true (matching the package default of bos=true, eos=true).
   */
  readonly addEos?: boolean;
}

export class LlamaTokenizerAdapter implements TokenizerAdapter {
  readonly id: TokenizerId;
  readonly modelHint?: string;
  private readonly addBos: boolean;
  private readonly addEos: boolean;
  private llama12?: Llama12TokenizerLike;
  private llama3?: Llama3TokenizerLike;

  constructor(id: TokenizerId, options: LlamaAdapterOptions = {}, modelHint?: string) {
    this.id = id;
    if (modelHint !== undefined) this.modelHint = modelHint;
    this.addBos = options.addBos ?? true;
    // LLAMA3 defaults to eos=true (matching the package default when no options are provided);
    // LLAMA (1/2) doesn't support EOS, so default is false.
    this.addEos = options.addEos ?? (id === TOKENIZER.LLAMA3);
  }

  async load(): Promise<void> {
    if (this.id === TOKENIZER.LLAMA3) {
      if (!this.llama3) this.llama3 = await loadLlama3();
    } else {
      if (!this.llama12) this.llama12 = await loadLlama12();
    }
  }

  async encode(text: string): Promise<readonly number[]> {
    await this.load();
    if (this.llama3) {
      return this.llama3.encode(text, { bos: this.addBos, eos: this.addEos });
    }
    // llama-tokenizer-js: only pass addBos; add_preceding_space uses default (true)
    return this.llama12!.encode(text, this.addBos);
  }

  async decode(tokens: readonly number[]): Promise<string> {
    await this.load();
    if (this.llama3) {
      return this.llama3.decode([...tokens]);
    }
    return this.llama12!.decode([...tokens]);
  }

  async count(text: string): Promise<number> {
    const tokens = await this.encode(text);
    return tokens.length;
  }
}
