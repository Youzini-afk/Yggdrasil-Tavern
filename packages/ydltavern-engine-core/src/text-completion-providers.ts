// Deep port of SillyTavern text-completion provider adapters.
//
// References (read at port time):
//   public/scripts/textgen-settings.js — full provider matrix
//   public/scripts/textgen-settings.js:31-47 source enum
//   public/scripts/textgen-settings.js:122-140 server URL resolution
//   public/scripts/textgen-settings.js:1289-1343 unified request route
//   public/scripts/textgen-settings.js:1575-1841 sampler matrix
//   public/scripts/horde.js — Kobold Horde polling
//
// SillyTavern's frontend POSTs a unified payload to its local backend, which
// fans out to each text completion server. We model the same request shape so
// Yggdrasil host outbound can perform the real call.

export type TextCompletionSource =
  | 'ooba'
  | 'mancer'
  | 'vllm'
  | 'aphrodite'
  | 'tabby'
  | 'koboldcpp'
  | 'togetherai'
  | 'llamacpp'
  | 'ollama'
  | 'infermaticai'
  | 'dreamgen'
  | 'openrouter'
  | 'featherless'
  | 'huggingface'
  | 'generic';

// Server bases per ST getTextGenServer (textgen-settings.js:122-140)
const FIXED_SERVERS: Readonly<Record<string, string>> = {
  mancer: 'https://neuro.mancer.tech',
  togetherai: 'https://api.together.xyz',
  infermaticai: 'https://api.totalgpt.ai',
  dreamgen: 'https://dreamgen.com',
  openrouter: 'https://openrouter.ai/api',
  featherless: 'https://api.featherless.ai/v1',
};

export function resolveTextGenServer(
  source: TextCompletionSource,
  serverUrls: Readonly<Record<string, string>> = {},
): string | undefined {
  if (FIXED_SERVERS[source]) return FIXED_SERVERS[source];
  return serverUrls[source];
}

export interface TextCompletionSettings {
  readonly api_type?: TextCompletionSource;
  readonly api_server?: string;
  readonly model?: string;
  readonly server_urls?: Readonly<Record<string, string>>;

  // Common samplers
  readonly max_new_tokens?: number;
  readonly max_tokens?: number;
  readonly temperature?: number;
  readonly top_p?: number;
  readonly top_k?: number;
  readonly top_a?: number;
  readonly typical_p?: number;
  readonly min_p?: number;
  readonly repetition_penalty?: number;
  readonly frequency_penalty?: number;
  readonly presence_penalty?: number;
  readonly sampler_seed?: number;
  readonly seed?: number;
  readonly stopping_strings?: readonly string[];
  readonly stop?: readonly string[];
  readonly ban_eos_token?: boolean;
  readonly skip_special_tokens?: boolean;
  readonly add_bos_token?: boolean;
  readonly logprobs?: number;
  readonly guidance_scale?: number;
  readonly negative_prompt?: string;
  readonly grammar_string?: string;
  readonly json_schema?: Readonly<Record<string, unknown>> | null;
  readonly custom_token_bans?: string;
  readonly banned_strings?: readonly string[];
  readonly include_reasoning?: boolean;

  // DRY sampling
  readonly dry_multiplier?: number;
  readonly dry_base?: number;
  readonly dry_allowed_length?: number;
  readonly dry_sequence_breakers?: readonly string[] | string;
  readonly dry_penalty_last_n?: number;

  // Mirostat
  readonly mirostat?: number;
  readonly mirostat_tau?: number;
  readonly mirostat_eta?: number;

  // XTC
  readonly xtc_threshold?: number;
  readonly xtc_probability?: number;

  // n-sigma
  readonly nsigma?: number;
  readonly top_n_sigma?: number;

  // Adaptive
  readonly adaptive_temperature?: number;
  readonly adaptive_threshold?: number;

  // Other
  readonly spaces_between_special_tokens?: boolean;
  readonly max_tokens_second?: number;

  // Ooba extras
  readonly rep_pen_range?: number;
  readonly rep_pen_decay?: number;
  readonly rep_pen_slope?: number;
  readonly no_repeat_ngram_size?: number;
  readonly penalty_alpha?: number;
  readonly num_beams?: number;
  readonly length_penalty?: number;
  readonly early_stopping?: boolean;
  readonly encoder_repetition_penalty?: number;
  readonly do_sample?: boolean;
  readonly epsilon_cutoff?: number;
  readonly eta_cutoff?: number;
  readonly temperature_last?: boolean;
  readonly sampler_priority?: readonly string[];

  // llamacpp / ollama
  readonly cache_prompt?: boolean;
  readonly grammar?: string;
  readonly num_ctx?: number;

  // vLLM
  readonly n?: number;
  readonly ignore_eos?: boolean;

  // Aphrodite
  readonly tfs?: number;
  readonly smoothing_factor?: number;
  readonly smoothing_curve?: number;
  readonly min_tokens?: number;
  readonly guided_grammar?: string;
  readonly guided_json?: Readonly<Record<string, unknown>>;
  readonly include_stop_str_in_output?: boolean;
  readonly dynatemp_min?: number;
  readonly dynatemp_max?: number;
  readonly dynatemp_exponent?: number;

  // OpenRouter text
  readonly provider?: string;
  readonly quantizations?: readonly string[];
  readonly allow_fallbacks?: boolean;

  // KoboldCpp
  readonly grammar_retain_state?: boolean;
  readonly trim_stop?: boolean;

  // Mancer
  readonly dynatemp_mode?: string;

  // DreamGen
  readonly minimum_message_content_tokens?: number;

  // HuggingFace / generic / featherless
  readonly generic_model?: string;
  readonly featherless_model?: string;
}

export interface BuildTextRequestInput {
  readonly source: TextCompletionSource;
  readonly prompt: string;
  readonly settings: TextCompletionSettings;
  readonly stream?: boolean;
}

export interface TextRequestBody {
  readonly prompt: string;
  readonly api_type: TextCompletionSource;
  readonly stream?: boolean;
  readonly [key: string]: unknown;
}

export interface BuildTextRequestResult {
  readonly body: TextRequestBody;
  readonly diagnostics: {
    readonly server: string | undefined;
    readonly notes: readonly string[];
  };
}

export function buildTextRequest(input: BuildTextRequestInput): BuildTextRequestResult {
  const { source, prompt, settings } = input;
  const stream = input.stream ?? false;
  const notes: string[] = [];

  const body: Record<string, unknown> = {
    prompt,
    api_type: source,
    api_server: settings.api_server ?? resolveTextGenServer(source, settings.server_urls),
    stream,
    model: settings.model,
  };

  // Common max tokens (both names emitted per ST)
  const maxTokens = settings.max_new_tokens ?? settings.max_tokens;
  if (maxTokens !== undefined) {
    body.max_new_tokens = maxTokens;
    body.max_tokens = maxTokens;
  }

  // Common samplers
  copyDefined(body, settings as unknown as Record<string, unknown>, [
    'temperature', 'top_p', 'top_k', 'top_a', 'typical_p', 'min_p',
    'repetition_penalty', 'frequency_penalty', 'presence_penalty',
    'sampler_seed', 'seed', 'guidance_scale', 'negative_prompt',
    'grammar_string', 'json_schema', 'custom_token_bans', 'banned_strings',
    'include_reasoning', 'logprobs', 'spaces_between_special_tokens',
    'max_tokens_second', 'add_bos_token', 'skip_special_tokens', 'ban_eos_token',
  ]);

  // DRY family
  copyDefined(body, settings as unknown as Record<string, unknown>, [
    'dry_multiplier', 'dry_base', 'dry_allowed_length',
    'dry_sequence_breakers', 'dry_penalty_last_n',
  ]);
  // Mirostat
  copyDefined(body, settings as unknown as Record<string, unknown>, ['mirostat', 'mirostat_tau', 'mirostat_eta']);
  // XTC
  copyDefined(body, settings as unknown as Record<string, unknown>, ['xtc_threshold', 'xtc_probability']);
  // Adaptive
  copyDefined(body, settings as unknown as Record<string, unknown>, ['adaptive_temperature', 'adaptive_threshold']);

  // n-sigma alias
  if (settings.top_n_sigma !== undefined) body.top_n_sigma = settings.top_n_sigma;
  if (settings.nsigma !== undefined) body.nsigma = settings.nsigma;

  // Stop strings (both stopping_strings and stop)
  const stops = settings.stopping_strings ?? settings.stop;
  if (stops !== undefined) {
    body.stopping_strings = stops;
    body.stop = stops;
  }

  // Provider-specific
  switch (source) {
    case 'ooba':
      applyOoba(body, settings);
      break;
    case 'koboldcpp':
      applyKoboldCpp(body, settings);
      break;
    case 'llamacpp':
      applyLlamaCpp(body, settings);
      break;
    case 'ollama':
      applyOllama(body, settings, notes);
      break;
    case 'tabby':
      applyTabby(body, settings);
      break;
    case 'vllm':
      applyVLLM(body, settings);
      break;
    case 'aphrodite':
      applyAphrodite(body, settings);
      break;
    case 'mancer':
      applyMancer(body, settings);
      break;
    case 'openrouter':
      applyOpenRouterText(body, settings);
      break;
    case 'huggingface':
      applyHuggingFace(body, settings);
      break;
    case 'featherless':
      if (settings.featherless_model) body.featherless_model = settings.featherless_model;
      break;
    case 'generic':
      if (settings.generic_model) body.generic_model = settings.generic_model;
      break;
    case 'dreamgen':
      applyDreamGen(body, settings);
      break;
    case 'togetherai':
    case 'infermaticai':
      // Routed via fixed server bases; no extra body shaping in front-end
      break;
  }

  return {
    body: body as TextRequestBody,
    diagnostics: {
      server: typeof body.api_server === 'string' ? body.api_server : undefined,
      notes,
    },
  };
}

function copyDefined(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
  keys: readonly string[],
): void {
  for (const k of keys) {
    if (source[k] !== undefined) target[k] = source[k];
  }
}

function applyOoba(body: Record<string, unknown>, s: TextCompletionSettings): void {
  copyDefined(body, s as unknown as Record<string, unknown>, [
    'rep_pen_range', 'rep_pen_decay', 'rep_pen_slope',
    'no_repeat_ngram_size', 'penalty_alpha', 'num_beams', 'length_penalty',
    'early_stopping', 'encoder_repetition_penalty', 'do_sample',
    'epsilon_cutoff', 'eta_cutoff', 'temperature_last', 'sampler_priority',
  ]);
}

function applyKoboldCpp(body: Record<string, unknown>, s: TextCompletionSettings): void {
  if (s.grammar !== undefined) body.grammar = s.grammar;
  if (s.grammar_retain_state !== undefined) body.grammar_retain_state = s.grammar_retain_state;
  if (s.trim_stop !== undefined) body.trim_stop = s.trim_stop;
  if (s.dry_sequence_breakers !== undefined) body.dry_sequence_breakers = s.dry_sequence_breakers;
}

function applyLlamaCpp(body: Record<string, unknown>, s: TextCompletionSettings): void {
  // llamacpp aliases
  if (s.repetition_penalty !== undefined) body.repeat_penalty = s.repetition_penalty;
  if (s.rep_pen_range !== undefined) body.repeat_last_n = s.rep_pen_range;
  if (body.max_new_tokens !== undefined) body.n_predict = body.max_new_tokens;
  if (s.num_ctx !== undefined) body.num_ctx = s.num_ctx;
  if (s.mirostat !== undefined) body.mirostat = s.mirostat;
  if (s.ignore_eos !== undefined) body.ignore_eos = s.ignore_eos;
  if (s.logprobs !== undefined) body.n_probs = s.logprobs;
  if (s.cache_prompt !== undefined) body.cache_prompt = s.cache_prompt;
  if (s.grammar !== undefined) body.grammar = s.grammar;
}

function applyOllama(body: Record<string, unknown>, s: TextCompletionSettings, notes: string[]): void {
  if (!s.model) notes.push('ollama requires model selection');
  if (body.max_new_tokens !== undefined) body.num_predict = body.max_new_tokens;
  if (s.num_ctx !== undefined) body.num_ctx = s.num_ctx;
  // Ollama nests samplers under "options" in the real API, but ST passes them
  // flat to the local backend. Preserve flat passthrough for compatibility.
}

function applyTabby(body: Record<string, unknown>, _s: TextCompletionSettings): void {
  // Tabby supports json_schema natively
  void _s;
  void body;
}

function applyVLLM(body: Record<string, unknown>, s: TextCompletionSettings): void {
  if (s.n !== undefined) body.n = s.n;
  if (s.ignore_eos !== undefined) body.ignore_eos = s.ignore_eos;
  if (s.spaces_between_special_tokens !== undefined) body.spaces_between_special_tokens = s.spaces_between_special_tokens;
  if (s.seed !== undefined) body.seed = s.seed;
}

function applyAphrodite(body: Record<string, unknown>, s: TextCompletionSettings): void {
  copyDefined(body, s as unknown as Record<string, unknown>, [
    'temperature_last', 'guided_grammar', 'guided_json', 'include_stop_str_in_output',
    'tfs', 'smoothing_factor', 'smoothing_curve', 'epsilon_cutoff', 'eta_cutoff',
    'min_tokens', 'dynatemp_min', 'dynatemp_max', 'dynatemp_exponent',
    'sampler_priority',
  ]);
  body.early_stopping = false;
  if (body.include_stop_str_in_output === undefined) body.include_stop_str_in_output = false;
}

function applyMancer(body: Record<string, unknown>, s: TextCompletionSettings): void {
  // Per ST: mancer divides epsilon/eta_cutoff by 1000
  if (typeof s.epsilon_cutoff === 'number') body.epsilon_cutoff = s.epsilon_cutoff / 1000;
  if (typeof s.eta_cutoff === 'number') body.eta_cutoff = s.eta_cutoff / 1000;
  if (s.dynatemp_mode !== undefined) body.dynatemp_mode = s.dynatemp_mode;
  if (s.dynatemp_min !== undefined) body.dynatemp_min = s.dynatemp_min;
  if (s.dynatemp_max !== undefined) body.dynatemp_max = s.dynatemp_max;
  if (s.dry_sequence_breakers !== undefined) body.dry_sequence_breakers = s.dry_sequence_breakers;
}

function applyOpenRouterText(body: Record<string, unknown>, s: TextCompletionSettings): void {
  if (s.provider !== undefined) body.provider = s.provider;
  if (s.quantizations !== undefined) body.quantizations = s.quantizations;
  if (s.allow_fallbacks !== undefined) body.allow_fallbacks = s.allow_fallbacks;
}

function applyHuggingFace(body: Record<string, unknown>, _s: TextCompletionSettings): void {
  // ST clamps top_p < 0.999 for HF
  if (typeof body.top_p === 'number' && body.top_p >= 0.999) body.top_p = 0.999;
}

function applyDreamGen(body: Record<string, unknown>, s: TextCompletionSettings): void {
  if (s.minimum_message_content_tokens !== undefined) {
    body.minimum_message_content_tokens = s.minimum_message_content_tokens;
  }
}

// ---------------------------------------------------------------------------
// Stream parser (textgen-settings.js:1310-1341)
//
// Handles:
//   - data.index > 0 → llama.cpp swipe
//   - choices[0].index > 0 → multi-swipe
//   - choices[0].text or data.content → main text
//   - choices[0].reasoning / .thinking → reasoning

export interface TextStreamMergeState {
  text: string;
  swipes: string[];
  reasoning: string;
  done: boolean;
}

export function emptyTextStreamState(): TextStreamMergeState {
  return { text: '', swipes: [], reasoning: '', done: false };
}

export function applyTextStreamChunk(state: TextStreamMergeState, parsed: unknown): void {
  if (parsed === null || typeof parsed !== 'object') return;
  const data = parsed as Record<string, unknown>;

  // llama.cpp swipe via data.index
  if (typeof data.index === 'number' && data.index > 0) {
    const c = (data.content ?? '') as string;
    if (typeof c === 'string') state.swipes[data.index - 1] = (state.swipes[data.index - 1] ?? '') + c;
    return;
  }

  const choices = data.choices as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(choices) && choices.length > 0) {
    const choice = choices[0]!;
    const idx = typeof choice.index === 'number' ? choice.index : 0;
    if (idx > 0) {
      const t = (choice.text ?? '') as string;
      if (typeof t === 'string') state.swipes[idx - 1] = (state.swipes[idx - 1] ?? '') + t;
      return;
    }
    if (typeof choice.text === 'string') state.text += choice.text;
    if (typeof choice.reasoning === 'string') state.reasoning += choice.reasoning;
    if (typeof choice.thinking === 'string') state.reasoning += choice.thinking;
    return;
  }

  // llama.cpp/ollama: data.content as main text
  if (typeof data.content === 'string') state.text += data.content;
}

// ---------------------------------------------------------------------------
// Kobold Horde polling (horde.js)

export const HORDE_MIN_LENGTH = 16;
export const HORDE_MAX_RETRIES = 480;

export interface HordeJobInput {
  readonly prompt: string;
  readonly params: Readonly<Record<string, unknown>>;
  readonly trustedWorkers?: boolean;
  readonly models?: readonly string[];
}

export interface HordeJobPlan {
  readonly request: { prompt: string; params: Readonly<Record<string, unknown>>; trusted_workers: boolean; models: readonly string[] };
  readonly minLength: number;
  readonly maxRetries: number;
  readonly pollIntervalMs: number;
}

export function planHordeJob(input: HordeJobInput): HordeJobPlan {
  const params = { ...input.params };
  // Enforce min length per ST
  const length = (params as Record<string, unknown>).max_length ?? (params as Record<string, unknown>).max_new_tokens;
  if (typeof length !== 'number' || length < HORDE_MIN_LENGTH) {
    (params as Record<string, unknown>).max_length = HORDE_MIN_LENGTH;
  }
  return {
    request: {
      prompt: input.prompt,
      params,
      trusted_workers: input.trustedWorkers === true,
      models: input.models ?? [],
    },
    minLength: HORDE_MIN_LENGTH,
    maxRetries: HORDE_MAX_RETRIES,
    pollIntervalMs: 1000,
  };
}
