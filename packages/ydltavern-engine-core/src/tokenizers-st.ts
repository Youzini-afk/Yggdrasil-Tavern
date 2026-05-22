// Deep port of SillyTavern tokenizer registry and best-match heuristics.
//
// References (read at port time):
//   public/scripts/tokenizers.js — full registry, URL table, best-match
//   public/scripts/tokenizers.js:16-154 enum
//   public/scripts/tokenizers.js:212-365 ENCODE_TOKENIZERS / TOKENIZER_URLS
//   public/scripts/tokenizers.js:379-490 getTokenizerBestMatch
//   public/scripts/tokenizers.js:569-790 countTokensOpenAIAsync
//   public/scripts/tokenizers.js:796-1231 cache + guesstimate
//
// Pure logic. No real tokenization — that requires wasm/binary tokenizers.
// We expose the registry, URL endpoints, best-match heuristics, cache key
// generation, and the guesstimate fallback. Real network calls happen via
// Yggdrasil host outbound.

export const TOKENIZER = {
  NONE: 'NONE',
  GPT2: 'GPT2',
  OPENAI: 'OPENAI',
  LLAMA: 'LLAMA',
  NERD: 'NERD',
  NERD2: 'NERD2',
  API_CURRENT: 'API_CURRENT',
  MISTRAL: 'MISTRAL',
  YI: 'YI',
  API_TEXTGENERATIONWEBUI: 'API_TEXTGENERATIONWEBUI',
  API_KOBOLD: 'API_KOBOLD',
  CLAUDE: 'CLAUDE',
  LLAMA3: 'LLAMA3',
  GEMMA: 'GEMMA',
  JAMBA: 'JAMBA',
  QWEN2: 'QWEN2',
  COMMAND_R: 'COMMAND_R',
  NEMO: 'NEMO',
  DEEPSEEK: 'DEEPSEEK',
  COMMAND_A: 'COMMAND_A',
  BEST_MATCH: 'BEST_MATCH',
} as const;

export type TokenizerId = (typeof TOKENIZER)[keyof typeof TOKENIZER];

// Tokenizers that support local encode (vs remote-only or guesstimate)
export const ENCODE_TOKENIZERS: ReadonlySet<TokenizerId> = new Set([
  TOKENIZER.LLAMA,
  TOKENIZER.MISTRAL,
  TOKENIZER.YI,
  TOKENIZER.LLAMA3,
  TOKENIZER.GEMMA,
  TOKENIZER.JAMBA,
  TOKENIZER.QWEN2,
  TOKENIZER.COMMAND_R,
  TOKENIZER.COMMAND_A,
  TOKENIZER.NEMO,
  TOKENIZER.DEEPSEEK,
]);

export interface TokenizerEndpoints {
  readonly encode: string;
  readonly decode: string;
  readonly count: string;
}

// Local backend endpoints exposed by the ST/YdlTavern backend.
// These are paths only — Yggdrasil host outbound resolves the base.
export const TOKENIZER_URLS: Readonly<Record<TokenizerId, TokenizerEndpoints | undefined>> = {
  [TOKENIZER.NONE]: undefined,
  [TOKENIZER.GPT2]: {
    encode: '/api/tokenizers/gpt2/encode',
    decode: '/api/tokenizers/gpt2/decode',
    count: '/api/tokenizers/gpt2/count',
  },
  [TOKENIZER.OPENAI]: {
    encode: '/api/tokenizers/openai/encode',
    decode: '/api/tokenizers/openai/decode',
    count: '/api/tokenizers/openai/count',
  },
  [TOKENIZER.LLAMA]: {
    encode: '/api/tokenizers/llama/encode',
    decode: '/api/tokenizers/llama/decode',
    count: '/api/tokenizers/llama/count',
  },
  [TOKENIZER.NERD]: {
    encode: '/api/tokenizers/nerdstash/encode',
    decode: '/api/tokenizers/nerdstash/decode',
    count: '/api/tokenizers/nerdstash/count',
  },
  [TOKENIZER.NERD2]: {
    encode: '/api/tokenizers/nerdstash_v2/encode',
    decode: '/api/tokenizers/nerdstash_v2/decode',
    count: '/api/tokenizers/nerdstash_v2/count',
  },
  [TOKENIZER.MISTRAL]: {
    encode: '/api/tokenizers/mistral/encode',
    decode: '/api/tokenizers/mistral/decode',
    count: '/api/tokenizers/mistral/count',
  },
  [TOKENIZER.YI]: {
    encode: '/api/tokenizers/yi/encode',
    decode: '/api/tokenizers/yi/decode',
    count: '/api/tokenizers/yi/count',
  },
  [TOKENIZER.CLAUDE]: {
    encode: '/api/tokenizers/claude/encode',
    decode: '/api/tokenizers/claude/decode',
    count: '/api/tokenizers/claude/count',
  },
  [TOKENIZER.LLAMA3]: {
    encode: '/api/tokenizers/llama3/encode',
    decode: '/api/tokenizers/llama3/decode',
    count: '/api/tokenizers/llama3/count',
  },
  [TOKENIZER.GEMMA]: {
    encode: '/api/tokenizers/gemma/encode',
    decode: '/api/tokenizers/gemma/decode',
    count: '/api/tokenizers/gemma/count',
  },
  [TOKENIZER.JAMBA]: {
    encode: '/api/tokenizers/jamba/encode',
    decode: '/api/tokenizers/jamba/decode',
    count: '/api/tokenizers/jamba/count',
  },
  [TOKENIZER.QWEN2]: {
    encode: '/api/tokenizers/qwen2/encode',
    decode: '/api/tokenizers/qwen2/decode',
    count: '/api/tokenizers/qwen2/count',
  },
  [TOKENIZER.COMMAND_R]: {
    encode: '/api/tokenizers/command-r/encode',
    decode: '/api/tokenizers/command-r/decode',
    count: '/api/tokenizers/command-r/count',
  },
  [TOKENIZER.NEMO]: {
    encode: '/api/tokenizers/nemo/encode',
    decode: '/api/tokenizers/nemo/decode',
    count: '/api/tokenizers/nemo/count',
  },
  [TOKENIZER.DEEPSEEK]: {
    encode: '/api/tokenizers/deepseek/encode',
    decode: '/api/tokenizers/deepseek/decode',
    count: '/api/tokenizers/deepseek/count',
  },
  [TOKENIZER.COMMAND_A]: {
    encode: '/api/tokenizers/command-a/encode',
    decode: '/api/tokenizers/command-a/decode',
    count: '/api/tokenizers/command-a/count',
  },
  [TOKENIZER.API_TEXTGENERATIONWEBUI]: {
    encode: '/api/tokenizers/remote/textgenerationwebui/encode',
    decode: '/api/tokenizers/remote/textgenerationwebui/decode',
    count: '/api/tokenizers/remote/textgenerationwebui/count',
  },
  [TOKENIZER.API_KOBOLD]: {
    encode: '/api/tokenizers/remote/kobold/encode',
    decode: '/api/tokenizers/remote/kobold/decode',
    count: '/api/tokenizers/remote/kobold/count',
  },
  [TOKENIZER.API_CURRENT]: undefined,
  [TOKENIZER.BEST_MATCH]: undefined,
};

// ---------------------------------------------------------------------------
// getTokenizerBestMatch — port of tokenizers.js:379-490

export type BestMatchApi =
  | 'novel'
  | 'kobold'
  | 'textgenerationwebui'
  | 'openai'
  | 'openrouter'
  | 'electronhub'
  | 'chutes'
  | 'workers_ai'
  | 'perplexity'
  | 'groq'
  | 'cohere';

export interface BestMatchInput {
  api: BestMatchApi;
  model?: string;
  novelModel?: string;
  // Whether kobold/textgen remote tokenization is connected
  remoteConnected?: boolean;
}

export function getTokenizerBestMatch(input: BestMatchInput | string): TokenizerId {
  if (typeof input === 'string') {
    return getTokenizerBestMatchForModel(input);
  }

  const { api, model = '', novelModel = '', remoteConnected = false } = input;
  const m = model.toLowerCase();

  if (api === 'novel') {
    if (/clio/.test(novelModel.toLowerCase())) return TOKENIZER.NERD;
    if (/kayra/.test(novelModel.toLowerCase())) return TOKENIZER.NERD2;
    if (/erato/.test(novelModel.toLowerCase())) return TOKENIZER.LLAMA3;
    return TOKENIZER.LLAMA;
  }

  if (api === 'kobold' || api === 'textgenerationwebui') {
    if (remoteConnected) {
      return api === 'kobold' ? TOKENIZER.API_KOBOLD : TOKENIZER.API_TEXTGENERATIONWEBUI;
    }
    if (m.includes('llama-3') || m.includes('llama3')) return TOKENIZER.LLAMA3;
    if (m.includes('mistral')) return TOKENIZER.MISTRAL;
    if (m.includes('gemma')) return TOKENIZER.GEMMA;
    if (m.includes('nemo')) return TOKENIZER.NEMO;
    if (m.includes('deepseek')) return TOKENIZER.DEEPSEEK;
    if (m.includes('yi')) return TOKENIZER.YI;
    if (m.includes('jamba')) return TOKENIZER.JAMBA;
    if (m.includes('command-a')) return TOKENIZER.COMMAND_A;
    if (m.includes('command-r')) return TOKENIZER.COMMAND_R;
    if (m.includes('qwen')) return TOKENIZER.QWEN2;
    return TOKENIZER.LLAMA;
  }

  if (api === 'openai') {
    if (/^claude/i.test(model)) return TOKENIZER.CLAUDE;
    return TOKENIZER.OPENAI;
  }

  if (api === 'openrouter') {
    if (m.includes('claude')) return TOKENIZER.CLAUDE;
    if (m.includes('llama-3') || m.includes('llama3')) return TOKENIZER.LLAMA3;
    if (m.includes('mistral')) return TOKENIZER.MISTRAL;
    if (m.includes('gemma')) return TOKENIZER.GEMMA;
    if (m.includes('command-a')) return TOKENIZER.COMMAND_A;
    if (m.includes('command-r')) return TOKENIZER.COMMAND_R;
    if (m.includes('qwen')) return TOKENIZER.QWEN2;
    if (m.includes('deepseek')) return TOKENIZER.DEEPSEEK;
    return TOKENIZER.OPENAI;
  }

  if (api === 'cohere') return m.includes('command-a') ? TOKENIZER.COMMAND_A : TOKENIZER.COMMAND_R;

  if (api === 'electronhub' || api === 'chutes' || api === 'workers_ai' || api === 'perplexity' || api === 'groq') {
    if (m.includes('llama-3') || m.includes('llama3')) return TOKENIZER.LLAMA3;
    if (m.includes('mistral')) return TOKENIZER.MISTRAL;
    if (m.includes('gemma')) return TOKENIZER.GEMMA;
    if (m.includes('deepseek')) return TOKENIZER.DEEPSEEK;
    if (m.includes('qwen')) return TOKENIZER.QWEN2;
    if (m.includes('command-a')) return TOKENIZER.COMMAND_A;
    if (m.includes('command-r')) return TOKENIZER.COMMAND_R;
    return TOKENIZER.LLAMA;
  }

  return TOKENIZER.OPENAI;
}

function getTokenizerBestMatchForModel(model: string): TokenizerId {
  const m = model.toLowerCase();
  if (m.includes('claude')) return TOKENIZER.CLAUDE;
  if (m.includes('llama-3') || m.includes('llama3')) return TOKENIZER.LLAMA3;
  if (m.includes('llama-2') || m.includes('llama2') || m.includes('llama-1') || m.includes('llama1')) return TOKENIZER.LLAMA;
  if (m.includes('mistral')) return TOKENIZER.MISTRAL;
  if (m.includes('gemma')) return TOKENIZER.GEMMA;
  if (m.includes('jamba')) return TOKENIZER.JAMBA;
  if (m.includes('qwen')) return TOKENIZER.QWEN2;
  if (m.includes('command-a')) return TOKENIZER.COMMAND_A;
  if (m.includes('command-r')) return TOKENIZER.COMMAND_R;
  if (m.includes('nemo')) return TOKENIZER.NEMO;
  if (m.includes('deepseek')) return TOKENIZER.DEEPSEEK;
  if (m.includes('yi')) return TOKENIZER.YI;
  if (m === 'gpt2' || m.includes('gpt-2')) return TOKENIZER.GPT2;
  return TOKENIZER.OPENAI;
}

// ---------------------------------------------------------------------------
// guesstimate — tokenizers.js fallback, byteLength / 3.35

export function guesstimate(text: string): number {
  const bytes = byteLength(text);
  return Math.ceil(bytes / 3.35);
}

function byteLength(text: string): number {
  // Match ST: byte length of UTF-8 encoded string
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 0x80) bytes += 1;
    else if (c < 0x800) bytes += 2;
    else if (c >= 0xd800 && c <= 0xdbff) {
      bytes += 4;
      i++;
    } else bytes += 3;
  }
  return bytes;
}

// ---------------------------------------------------------------------------
// countTokensOpenAIAsync — port of tokenizers.js:569-790
//
// Wraps each message in a one-item array, sets full=true for Claude,
// subtracts 2 unless full.

export interface CountTokensOpenAIInput {
  readonly messages: readonly { role: string; content: string; name?: string }[];
  readonly model: string;
}

export interface CountTokensOpenAIPlan {
  readonly endpoint: string;
  readonly body: {
    readonly model: string;
    readonly messages: readonly { role: string; content: string; name?: string }[][];
    readonly full?: boolean;
  };
  readonly subtract: number;
}

export function planCountTokensOpenAI(input: CountTokensOpenAIInput): CountTokensOpenAIPlan {
  const isClaude = /^claude/i.test(input.model);
  return {
    endpoint: '/api/tokenizers/openai/count',
    body: {
      model: input.model,
      // Each message wrapped in its own array per ST
      messages: input.messages.map((m) => [m]),
      ...(isClaude ? { full: true } : {}),
    },
    subtract: isClaude ? 0 : 2,
  };
}

// ---------------------------------------------------------------------------
// Cache key — port of ST's hash + tokenizer + model + padding key
//
// ST caches by (tokenizer, hash(content), modelHash, padding).

export interface TokenCountCacheKeyInput {
  readonly tokenizer: TokenizerId;
  readonly text: string;
  readonly model?: string;
  readonly padding?: number;
}

export function tokenCountCacheKey(input: TokenCountCacheKeyInput): string {
  return [
    input.tokenizer,
    hashString(input.text),
    hashString(input.model ?? ''),
    input.padding ?? 0,
  ].join(':');
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h * 31) + s.charCodeAt(i)) | 0;
  }
  return h;
}

// ---------------------------------------------------------------------------
// LRU token count cache (size matches ST's small cache; tunable)

export class TokenCountCache {
  private cache = new Map<string, number>();
  private capacity: number;

  constructor(capacity = 1000) {
    this.capacity = capacity;
  }

  get(key: string): number | undefined {
    const v = this.cache.get(key);
    if (v === undefined) return undefined;
    // Touch for LRU
    this.cache.delete(key);
    this.cache.set(key, v);
    return v;
  }

  set(key: string, value: number): void {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      // Evict oldest (Map iteration order = insertion order)
      const first = this.cache.keys().next().value;
      if (first !== undefined) this.cache.delete(first);
    }
    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// ---------------------------------------------------------------------------
// Friendly tokenizer name (token-counter extension)

export function getFriendlyTokenizerName(id: TokenizerId): string {
  const names: Readonly<Record<TokenizerId, string>> = {
    [TOKENIZER.NONE]: 'None',
    [TOKENIZER.GPT2]: 'GPT-2',
    [TOKENIZER.OPENAI]: 'OpenAI (tiktoken)',
    [TOKENIZER.LLAMA]: 'LLaMA',
    [TOKENIZER.NERD]: 'NerdStash',
    [TOKENIZER.NERD2]: 'NerdStash v2',
    [TOKENIZER.API_CURRENT]: 'API (current)',
    [TOKENIZER.MISTRAL]: 'Mistral',
    [TOKENIZER.YI]: 'Yi',
    [TOKENIZER.API_TEXTGENERATIONWEBUI]: 'Text generation web UI (remote)',
    [TOKENIZER.API_KOBOLD]: 'Kobold (remote)',
    [TOKENIZER.CLAUDE]: 'Claude',
    [TOKENIZER.LLAMA3]: 'LLaMA 3',
    [TOKENIZER.GEMMA]: 'Gemma',
    [TOKENIZER.JAMBA]: 'Jamba',
    [TOKENIZER.QWEN2]: 'Qwen 2',
    [TOKENIZER.COMMAND_R]: 'Command R',
    [TOKENIZER.NEMO]: 'Nemo',
    [TOKENIZER.DEEPSEEK]: 'DeepSeek',
    [TOKENIZER.COMMAND_A]: 'Command A',
    [TOKENIZER.BEST_MATCH]: 'Best match',
  };
  return names[id] ?? id;
}
