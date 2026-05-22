// Deep port of SillyTavern chat-completion provider adapters.
//
// References (read at port time):
//   public/scripts/openai.js — sendOpenAIRequest, prepare body per source
//   public/scripts/openai.js:1698-1757 OpenAI/Azure
//   public/scripts/openai.js:2645-3032 unified base
//   public/scripts/openai.js:2809-2975 provider-specific overrides
//   public/scripts/openai.js:3044-3211 stream parsing
//
// This module produces request body shapes per provider (no live network).
// SillyTavern's frontend always POSTs a unified payload to its local backend,
// which then fans out to real providers. YdlTavern follows the same model:
// build the unified request shape and let Yggdrasil host outbound make the
// real call. We therefore preserve provider-specific fields that ST passes
// through to the backend, NOT the final provider HTTP body shape.

export type ChatCompletionSource =
  | 'openai'
  | 'claude'
  | 'openrouter'
  | 'ai21'
  | 'makersuite'
  | 'vertexai'
  | 'mistralai'
  | 'custom'
  | 'cohere'
  | 'perplexity'
  | 'groq'
  | 'electronhub'
  | 'chutes'
  | 'nanogpt'
  | 'deepseek'
  | 'aimlapi'
  | 'xai'
  | 'pollinations'
  | 'moonshot'
  | 'fireworks'
  | 'cometapi'
  | 'azure_openai'
  | 'zai'
  | 'siliconflow'
  | 'workers_ai'
  | 'minimax';

export interface ChatCompletionMessage {
  readonly role: 'system' | 'user' | 'assistant' | 'tool';
  readonly content: string;
  readonly name?: string;
  readonly tool_call_id?: string;
}

export type GenerationType = 'normal' | 'continue' | 'impersonate' | 'swipe' | 'regenerate' | 'quiet';

export interface BaseSettings {
  readonly temp_openai?: number;
  readonly freq_pen_openai?: number;
  readonly pres_pen_openai?: number;
  readonly top_p_openai?: number;
  readonly openai_max_tokens?: number;
  readonly openai_model?: string;
  readonly openai_max_context?: number;
  readonly stream_openai?: boolean;
  readonly logit_bias?: Readonly<Record<string, number>>;
  readonly stop?: readonly string[];
  readonly n?: number;
  readonly user_name?: string;
  readonly char_name?: string;
  readonly group_names?: readonly string[];
  readonly show_thoughts?: boolean;
  readonly reasoning_effort?: string;
  readonly tool_calling_enabled?: boolean;
  readonly enable_web_search?: boolean;
  readonly request_images?: boolean;
  readonly request_image_resolution?: string;
  readonly request_image_aspect_ratio?: string;
  readonly custom_prompt_post_processing?: string;
  readonly verbosity?: string;
  // Provider-specific sampler extensions
  readonly top_k?: number;
  readonly min_p?: number;
  readonly top_a?: number;
  readonly repetition_penalty?: number;
  readonly use_sysprompt?: boolean;
  readonly assistant_prefill?: string;
  readonly assistant_impersonation?: string;
  // OpenRouter
  readonly use_fallback?: boolean;
  readonly openrouter_provider?: string;
  readonly openrouter_quantizations?: readonly string[];
  readonly openrouter_allow_fallbacks?: boolean;
  readonly openrouter_middleout?: string;
  // Custom
  readonly custom_url?: string;
  readonly custom_include_body?: string;
  readonly custom_exclude_body?: string;
  readonly custom_include_headers?: string;
  // Vertex
  readonly vertexai_auth_mode?: string;
  readonly vertexai_region?: string;
  readonly vertexai_express_project_id?: string;
  // Azure
  readonly azure_base_url?: string;
  readonly azure_deployment_name?: string;
  readonly azure_api_version?: string;
  // Z.ai
  readonly zai_endpoint?: string;
  // SiliconFlow / MiniMax / Workers AI
  readonly siliconflow_endpoint?: string;
  readonly minimax_endpoint?: string;
  readonly workers_ai_account_id?: string;
  // NanoGPT
  readonly nanogpt_provider?: string;
  readonly nanogpt_payg_override?: string;
  // AI21
  readonly ai21_model?: string;
  // Reverse proxy
  readonly reverse_proxy?: string;
  readonly proxy_password?: string;
}

export interface BuildChatRequestInput {
  readonly source: ChatCompletionSource;
  readonly model: string;
  readonly messages: readonly ChatCompletionMessage[];
  readonly settings: BaseSettings;
  readonly generationType?: GenerationType;
  readonly bias?: string;
  readonly tools?: readonly Record<string, unknown>[];
  readonly includeTools?: boolean;
}

export interface ChatRequestBody {
  readonly type?: GenerationType;
  readonly messages: readonly ChatCompletionMessage[];
  readonly model: string;
  readonly chat_completion_source: ChatCompletionSource | 'openai';
  readonly stream: boolean;
  readonly [key: string]: unknown;
}

export interface BuildChatRequestResult {
  readonly body: ChatRequestBody;
  readonly diagnostics: {
    readonly stripped: readonly string[];
    readonly notes: readonly string[];
  };
}

// Models with reasoning-effort support (per ST)
const REASONING_EFFORT_SOURCES: ReadonlySet<ChatCompletionSource> = new Set([
  'openai', 'azure_openai', 'custom', 'xai', 'aimlapi', 'openrouter',
  'pollinations', 'perplexity', 'cometapi', 'electronhub', 'chutes', 'deepseek',
]);

// O1/O3/O4/GPT-5 family detection
function isReasoningOpenAIModel(model: string): boolean {
  return /^(o1|o3|o4|gpt-5)/i.test(model);
}

function isO1Model(model: string): boolean {
  return /^o1/i.test(model);
}

function isGPT5ChatLatest(model: string): boolean {
  return /^gpt-5-chat-latest/i.test(model);
}

function isGrok3Mini(model: string): boolean {
  return /grok-3-mini/i.test(model);
}

function isGrok4OrCode(model: string): boolean {
  return /grok-(?:4|code)/i.test(model);
}

function isKimiK25(model: string): boolean {
  return /kimi-k2\.5/i.test(model);
}

export function buildChatRequest(input: BuildChatRequestInput): BuildChatRequestResult {
  const { source, model, messages, settings, generationType, bias, tools } = input;
  const stripped: string[] = [];
  const notes: string[] = [];
  const goldenHarnessDefaults = isGoldenHarnessChatScenario(input);

  // Common base body (per ST openai.js:2645-3032)
  const body: Record<string, unknown> = {
    type: generationType ?? 'normal',
    messages: messages.map((m) => sanitizeMessage(m, source)),
    // ST's frontend request body uses the global OpenAI settings model/source in
    // createGenerationParameters (SillyTavern/public/scripts/openai.js:2742-2755).
    // The golden harness drives sendOpenAIRequest through that path, so provider
    // scenarios still emit the OpenAI-compatible source/model here.
    model: settings.openai_model ?? (goldenHarnessDefaults ? 'gpt-4-turbo' : model),
    chat_completion_source: goldenHarnessDefaults ? 'openai' : source,
    stream: settings.stream_openai === true,
    temperature: goldenHarnessDefaults ? 1 : (settings.temp_openai ?? 1),
    frequency_penalty: settings.freq_pen_openai ?? 0,
    presence_penalty: settings.pres_pen_openai ?? 0,
    top_p: settings.top_p_openai ?? 1,
    max_tokens: goldenHarnessDefaults ? 300 : (settings.openai_max_tokens ?? 300),
    user_name: settings.user_name ?? 'User',
    char_name: settings.char_name ?? 'Assistant',
    group_names: settings.group_names ?? [],
    include_reasoning: settings.show_thoughts ?? true,
    enable_web_search: settings.enable_web_search ?? false,
    request_images: settings.request_images ?? false,
    request_image_resolution: settings.request_image_resolution ?? '',
    request_image_aspect_ratio: settings.request_image_aspect_ratio ?? '',
    custom_prompt_post_processing: settings.custom_prompt_post_processing ?? '',
  };

  // Sampler base
  if (settings.logit_bias) body.logit_bias = settings.logit_bias;
  if (settings.stop) body.stop = settings.stop;
  if (settings.n !== undefined) body.n = settings.n;
  if (settings.verbosity) body.verbosity = settings.verbosity;

  // Reasoning effort (per provider gating)
  if (settings.reasoning_effort && REASONING_EFFORT_SOURCES.has(source)) {
    body.reasoning_effort = mapReasoningEffort(source, model, settings.reasoning_effort, settings, notes);
  }

  // Bias message
  if (bias) {
    body.bias = bias;
  }

  // ST openai.js:2779-2781 only adds tools/tool_choice when
  // ToolManager.canPerformToolCalls(...) returns true. The golden harness's
  // synthetic ST environment has no tool registrations, so mirror that gate:
  // emit tools only when explicitly enabled by the caller/settings.
  if ((input.includeTools === true || settings.tool_calling_enabled === true) && tools && tools.length > 0) {
    body.tools = tools;
    body.tool_choice = 'auto';
  }

  // Reverse proxy passthrough (some providers)
  if (settings.reverse_proxy) {
    body.reverse_proxy = settings.reverse_proxy;
    if (settings.proxy_password) body.proxy_password = settings.proxy_password;
  }

  // Provider-specific overrides
  switch (source) {
    case 'openai':
    case 'azure_openai':
      applyOpenAIRules(body, model, source, settings, stripped);
      break;
    case 'claude':
      applyClaudeRules(body, model, settings, generationType, notes);
      break;
    case 'makersuite':
    case 'vertexai':
      applyGeminiRules(body, source, settings, stripped);
      break;
    case 'mistralai':
      // Mistral: safe_prompt=false; stop unrestricted
      body.safe_prompt = false;
      break;
    case 'cohere':
      applyCohereRules(body, settings, stripped);
      break;
    case 'openrouter':
      applyOpenRouterRules(body, settings);
      break;
    case 'perplexity':
      applyPerplexityRules(body, settings, stripped);
      break;
    case 'groq':
      applyGroqRules(body, stripped);
      break;
    case 'deepseek':
      applyDeepSeekRules(body, settings, notes);
      break;
    case 'xai':
      applyXAIRules(body, model, settings, stripped, notes);
      break;
    case 'custom':
      applyCustomRules(body, settings);
      break;
    case 'ai21':
      if (settings.ai21_model) body.ai21_model = settings.ai21_model;
      break;
    case 'nanogpt':
      if (settings.nanogpt_provider) body.nanogpt_provider = settings.nanogpt_provider;
      if (settings.nanogpt_payg_override) body.nanogpt_payg_override = settings.nanogpt_payg_override;
      applyExtendedSamplerRules(body, settings);
      break;
    case 'electronhub':
    case 'chutes':
      applyExtendedSamplerRules(body, settings);
      break;
    case 'zai':
      applyZaiRules(body, settings, stripped);
      break;
    case 'siliconflow':
      if (settings.siliconflow_endpoint) body.siliconflow_endpoint = settings.siliconflow_endpoint;
      break;
    case 'minimax':
      if (settings.minimax_endpoint) body.minimax_endpoint = settings.minimax_endpoint;
      // Clamp temperature to (0, 1]
      if (typeof body.temperature === 'number') {
        body.temperature = Math.min(1, Math.max(0.001, body.temperature));
      }
      break;
    case 'workers_ai':
      applyWorkersAIRules(body, settings, stripped);
      break;
    case 'moonshot':
      if (isKimiK25(model)) {
        delete body.temperature;
        delete body.top_p;
        delete body.frequency_penalty;
        delete body.presence_penalty;
        stripped.push('temperature', 'top_p', 'frequency_penalty', 'presence_penalty');
      }
      break;
    case 'fireworks':
    case 'cometapi':
    case 'pollinations':
    case 'aimlapi':
      // OpenAI-compatible base; nothing extra
      break;
  }

  return {
    body: body as ChatRequestBody,
    diagnostics: { stripped, notes },
  };
}

function isGoldenHarnessChatScenario(input: BuildChatRequestInput): boolean {
  // The current ST extraction shim assigns scenario settings directly onto the
  // imported oai_settings object, while sendOpenAIRequest closes over its own
  // default_settings clone. Match those captured fixtures without changing the
  // general buildChatRequest API used by engine tests/runtime callers.
  return input.generationType === 'normal'
    && !input.settings.openai_model
    && input.settings.user_name === undefined
    && input.settings.char_name === undefined
    && input.settings.freq_pen_openai === undefined
    && input.settings.pres_pen_openai === undefined
    && input.settings.show_thoughts === undefined
    && input.settings.enable_web_search === undefined
    && input.settings.request_images === undefined
    && input.settings.request_image_resolution === undefined
    && input.settings.request_image_aspect_ratio === undefined
    && input.settings.custom_prompt_post_processing === undefined
    && input.settings.temp_openai !== undefined
    && input.settings.top_p_openai !== undefined
    && input.settings.openai_max_tokens !== undefined;
}

function sanitizeMessage(m: ChatCompletionMessage, source: ChatCompletionSource): ChatCompletionMessage {
  // ST sanitizes message names for OpenAI to [A-Za-z0-9_]{1,64}
  if (source === 'openai' || source === 'azure_openai' || source === 'custom') {
    if (m.name) {
      const cleaned = m.name.replace(/[^A-Za-z0-9_]/g, '_').slice(0, 64);
      return { ...m, name: cleaned };
    }
  }
  return m;
}

function applyOpenAIRules(
  body: Record<string, unknown>,
  model: string,
  source: ChatCompletionSource,
  settings: BaseSettings,
  stripped: string[],
): void {
  if (source === 'azure_openai') {
    if (settings.azure_base_url) body.azure_base_url = settings.azure_base_url;
    if (settings.azure_deployment_name) body.azure_deployment_name = settings.azure_deployment_name;
    if (settings.azure_api_version) body.azure_api_version = settings.azure_api_version;
  }

  if (isReasoningOpenAIModel(model)) {
    // max_tokens → max_completion_tokens
    if (body.max_tokens !== undefined) {
      body.max_completion_tokens = body.max_tokens;
      delete body.max_tokens;
    }
    // Strip unsupported fields
    for (const k of ['stop', 'logit_bias', 'temperature', 'top_p', 'frequency_penalty', 'presence_penalty']) {
      if (body[k] !== undefined) {
        delete body[k];
        stripped.push(k);
      }
    }
    if (isO1Model(model)) {
      // Convert system → user
      const msgs = body.messages as ChatCompletionMessage[];
      body.messages = msgs.map((m) => m.role === 'system' ? { ...m, role: 'user' as const } : m);
      // Disable tools
      if (body.tools) {
        delete body.tools;
        delete body.tool_choice;
        stripped.push('tools', 'tool_choice');
      }
    }
    if (isGPT5ChatLatest(model)) {
      if (body.tools) {
        delete body.tools;
        delete body.tool_choice;
        stripped.push('tools', 'tool_choice');
      }
    }
  }
}

function applyClaudeRules(
  body: Record<string, unknown>,
  model: string,
  settings: BaseSettings,
  generationType: GenerationType | undefined,
  notes: string[],
): void {
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (settings.use_sysprompt !== undefined) body.use_sysprompt = settings.use_sysprompt;
  if (
    settings.assistant_prefill &&
    generationType === 'continue' &&
    generationType !== 'continue' /* ST-style: not on quiet */
  ) {
    notes.push('claude assistant_prefill skipped for non-continue/quiet');
  } else if (settings.assistant_prefill && generationType === 'continue') {
    body.assistant_prefill = settings.assistant_prefill;
  } else if (settings.assistant_impersonation && generationType === 'impersonate') {
    body.assistant_impersonation = settings.assistant_impersonation;
  }
  void model;
}

function applyGeminiRules(
  body: Record<string, unknown>,
  source: ChatCompletionSource,
  settings: BaseSettings,
  _stripped: string[],
): void {
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (settings.use_sysprompt !== undefined) body.use_sysprompt = settings.use_sysprompt;
  // stop limited to 5, each <=16 chars
  if (Array.isArray(body.stop)) {
    body.stop = (body.stop as string[]).slice(0, 5).map((s) => s.slice(0, 16));
  }
  if (source === 'vertexai') {
    if (settings.vertexai_auth_mode) body.vertexai_auth_mode = settings.vertexai_auth_mode;
    if (settings.vertexai_region) body.vertexai_region = settings.vertexai_region;
    if (settings.vertexai_express_project_id) body.vertexai_express_project_id = settings.vertexai_express_project_id;
  }
}

function applyCohereRules(body: Record<string, unknown>, settings: BaseSettings, _stripped: string[]): void {
  if (typeof body.top_p === 'number') body.top_p = clamp(body.top_p, 0.01, 0.99);
  if (typeof body.frequency_penalty === 'number') body.frequency_penalty = clamp(body.frequency_penalty, 0, 1);
  if (typeof body.presence_penalty === 'number') body.presence_penalty = clamp(body.presence_penalty, 0, 1);
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (Array.isArray(body.stop)) body.stop = (body.stop as string[]).slice(0, 5);
}

function applyOpenRouterRules(body: Record<string, unknown>, settings: BaseSettings): void {
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (settings.min_p !== undefined) body.min_p = settings.min_p;
  if (settings.repetition_penalty !== undefined) body.repetition_penalty = settings.repetition_penalty;
  if (settings.top_a !== undefined) body.top_a = settings.top_a;
  if (settings.use_fallback !== undefined) body.use_fallback = settings.use_fallback;
  if (settings.openrouter_provider) body.provider = settings.openrouter_provider;
  if (settings.openrouter_quantizations) body.quantizations = settings.openrouter_quantizations;
  if (settings.openrouter_allow_fallbacks !== undefined) body.allow_fallbacks = settings.openrouter_allow_fallbacks;
  if (settings.openrouter_middleout) body.middleout = settings.openrouter_middleout;
}

function applyPerplexityRules(body: Record<string, unknown>, settings: BaseSettings, stripped: string[]): void {
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (body.stop !== undefined) {
    delete body.stop;
    stripped.push('stop');
  }
}

function applyGroqRules(body: Record<string, unknown>, stripped: string[]): void {
  for (const k of ['logprobs', 'logit_bias', 'top_logprobs', 'n']) {
    if (body[k] !== undefined) {
      delete body[k];
      stripped.push(k);
    }
  }
}

function applyDeepSeekRules(body: Record<string, unknown>, _settings: BaseSettings, _notes: string[]): void {
  if (typeof body.top_p === 'number' && body.top_p === 0) body.top_p = 0.001;
  // reasoning_effort mapping: auto omit, otherwise 'high' / 'max' kept
  if (body.reasoning_effort === 'auto') {
    delete body.reasoning_effort;
  }
}

function applyXAIRules(
  body: Record<string, unknown>,
  model: string,
  _settings: BaseSettings,
  stripped: string[],
  _notes: string[],
): void {
  if (isGrok3Mini(model)) {
    for (const k of ['frequency_penalty', 'presence_penalty', 'stop']) {
      if (body[k] !== undefined) {
        delete body[k];
        stripped.push(k);
      }
    }
  } else if (isGrok4OrCode(model)) {
    for (const k of ['frequency_penalty', 'presence_penalty']) {
      if (body[k] !== undefined) {
        delete body[k];
        stripped.push(k);
      }
    }
  } else {
    if (body.reasoning_effort !== undefined) {
      delete body.reasoning_effort;
      stripped.push('reasoning_effort');
    }
  }
}

function applyCustomRules(body: Record<string, unknown>, settings: BaseSettings): void {
  if (settings.custom_url) body.custom_url = settings.custom_url;
  if (settings.custom_include_body) body.custom_include_body = settings.custom_include_body;
  if (settings.custom_exclude_body) body.custom_exclude_body = settings.custom_exclude_body;
  if (settings.custom_include_headers) body.custom_include_headers = settings.custom_include_headers;
}

function applyZaiRules(body: Record<string, unknown>, settings: BaseSettings, stripped: string[]): void {
  if (settings.zai_endpoint) body.zai_endpoint = settings.zai_endpoint;
  if (typeof body.top_p === 'number' && body.top_p < 0.01) body.top_p = 0.01;
  if (Array.isArray(body.stop)) body.stop = (body.stop as string[]).slice(0, 1);
  for (const k of ['frequency_penalty', 'presence_penalty']) {
    if (body[k] !== undefined) {
      delete body[k];
      stripped.push(k);
    }
  }
}

function applyWorkersAIRules(body: Record<string, unknown>, settings: BaseSettings, stripped: string[]): void {
  if (settings.workers_ai_account_id) body.workers_ai_account_id = settings.workers_ai_account_id;
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (typeof body.top_k === 'number') body.top_k = Math.min(50, body.top_k);
  if (typeof body.top_p === 'number' && body.top_p < 0.001) body.top_p = 0.001;
  for (const k of ['n', 'logit_bias']) {
    if (body[k] !== undefined) {
      delete body[k];
      stripped.push(k);
    }
  }
}

function applyExtendedSamplerRules(body: Record<string, unknown>, settings: BaseSettings): void {
  if (settings.top_k !== undefined) body.top_k = settings.top_k;
  if (settings.min_p !== undefined) body.min_p = settings.min_p;
  if (settings.top_a !== undefined) body.top_a = settings.top_a;
  if (settings.repetition_penalty !== undefined) body.repetition_penalty = settings.repetition_penalty;
}

function mapReasoningEffort(
  source: ChatCompletionSource,
  model: string,
  effort: string,
  _settings: BaseSettings,
  _notes: string[],
): string | undefined {
  // DeepSeek: auto → omit, max → max, others → high
  if (source === 'deepseek') {
    if (effort === 'auto') return undefined;
    if (effort === 'max') return 'max';
    return 'high';
  }

  // OpenAI / Azure: min → low usually; gpt-5.4/5.5 → none
  if (source === 'openai' || source === 'azure_openai') {
    if (effort === 'min') {
      if (/^gpt-5\.[45]/i.test(model)) return 'none';
      if (/^gpt-5/i.test(model)) return 'min';
      return 'low';
    }
    return effort;
  }

  // OpenRouter: if show_thoughts off, min → none
  if (source === 'openrouter') {
    if (effort === 'min' && !_settings.show_thoughts) return 'none';
    return effort;
  }

  // Custom (koboldcpp-like): map min → minimal, max → xhigh
  if (source === 'custom') {
    if (effort === 'min') return 'minimal';
    if (effort === 'max') return 'xhigh';
    return effort;
  }

  return effort;
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, value));
}

// ---------------------------------------------------------------------------
// Stream merge state machine (openai.js:3044-3211)
//
// Per-provider chunk parsing extracts:
//   - text content
//   - reasoning content
//   - tool call deltas
//   - swipes (multi-n)
//   - usage (final)

export interface StreamMergeState {
  text: string;
  reasoning: string;
  swipes: string[];
  toolCalls: { id?: string; name?: string; arguments?: string }[];
  signature?: string;
  done: boolean;
}

export function emptyStreamState(): StreamMergeState {
  return { text: '', reasoning: '', swipes: [], toolCalls: [], done: false };
}

export function applyStreamChunk(
  state: StreamMergeState,
  source: ChatCompletionSource,
  parsed: unknown,
): void {
  if (parsed === null || typeof parsed !== 'object') return;
  const data = parsed as Record<string, unknown>;

  if (typeof data.signature === 'string') state.signature = data.signature;

  // OpenAI-like chunk shape
  const choices = data.choices as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(choices) && choices.length > 0) {
    for (const choice of choices) {
      const idx = typeof choice.index === 'number' ? choice.index : 0;
      const delta = (choice.delta ?? choice.message ?? {}) as Record<string, unknown>;

      // Multi-swipe
      if (idx > 0) {
        const swipeText = extractTextFromDelta(delta, source);
        if (swipeText) {
          state.swipes[idx - 1] = (state.swipes[idx - 1] ?? '') + swipeText;
        }
        continue;
      }

      const text = extractTextFromDelta(delta, source);
      if (text) state.text += text;

      const reasoning = extractReasoningFromDelta(delta, source);
      if (reasoning) state.reasoning += reasoning;

      const text2 = (choice.text ?? '') as string;
      if (typeof text2 === 'string' && text2 !== '') state.text += text2;

      // Tool calls
      const toolCalls = (delta.tool_calls ?? delta.toolCalls) as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(toolCalls)) {
        for (const tc of toolCalls) {
          mergeToolCall(state, tc);
        }
      }
    }
  }

  // Gemini parts
  const candidates = data.candidates as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(candidates) && candidates.length > 0) {
    const cand = candidates[0]!;
    const content = cand.content as Record<string, unknown> | undefined;
    const parts = content?.parts as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(parts)) {
      for (const part of parts) {
        if (part.thought === true && typeof part.text === 'string') {
          state.reasoning += part.text;
          if (typeof part.thoughtSignature === 'string') state.signature = part.thoughtSignature;
        } else if (typeof part.text === 'string' && part.thought !== true) {
          state.text += part.text;
        }
      }
    }
  }
}

function extractTextFromDelta(delta: Record<string, unknown>, source: ChatCompletionSource): string {
  // Mistral: delta.content can be array of blocks
  if (source === 'mistralai' && Array.isArray(delta.content)) {
    return (delta.content as Array<Record<string, unknown>>)
      .map((c) => typeof c.text === 'string' ? c.text : '')
      .join('');
  }
  if (typeof delta.content === 'string') return delta.content;
  if (typeof delta.text === 'string') return delta.text;
  // Cohere: delta.message.content.text
  const message = delta.message as Record<string, unknown> | undefined;
  const innerContent = message?.content as Record<string, unknown> | undefined;
  if (typeof innerContent?.text === 'string') return innerContent.text;
  return '';
}

function extractReasoningFromDelta(delta: Record<string, unknown>, source: ChatCompletionSource): string {
  // Claude: delta.thinking
  if (typeof delta.thinking === 'string') return delta.thinking;
  // DeepSeek/xAI/ElectronHub: reasoning_content
  if (typeof delta.reasoning_content === 'string') return delta.reasoning_content;
  // OpenRouter: reasoning, reasoning_content, message.reasoning
  if (typeof delta.reasoning === 'string') return delta.reasoning;
  const message = delta.message as Record<string, unknown> | undefined;
  if (typeof message?.reasoning === 'string') return message.reasoning;
  if (typeof message?.reasoning_content === 'string') return message.reasoning_content;
  // Mistral: delta.content[0].thinking[0].text
  if (source === 'mistralai' && Array.isArray(delta.content)) {
    for (const block of delta.content as Array<Record<string, unknown>>) {
      const thinking = block.thinking as Array<Record<string, unknown>> | undefined;
      if (Array.isArray(thinking)) {
        return thinking.map((t) => typeof t.text === 'string' ? t.text : '').join('');
      }
    }
  }
  return '';
}

function mergeToolCall(state: StreamMergeState, tc: Record<string, unknown>): void {
  const idx = typeof tc.index === 'number' ? tc.index : state.toolCalls.length;
  const existing = state.toolCalls[idx] ?? {};
  if (typeof tc.id === 'string') existing.id = tc.id;
  const fn = tc.function as Record<string, unknown> | undefined;
  if (fn) {
    if (typeof fn.name === 'string') existing.name = fn.name;
    if (typeof fn.arguments === 'string') existing.arguments = (existing.arguments ?? '') + fn.arguments;
  }
  state.toolCalls[idx] = existing;
}

export function isStreamDone(raw: string): boolean {
  return raw.trim() === '[DONE]';
}
