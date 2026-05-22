import type { NormalizedSamplerSettings } from './sampler.js';

export type TextCompletionProviderFamily = 'generic' | 'textgen' | 'kobold' | 'ollama';

export interface BuildTextCompletionRequestInput {
  readonly provider: TextCompletionProviderFamily;
  readonly prompt: string;
  readonly model?: string;
  readonly sampler?: NormalizedSamplerSettings;
  readonly stopStrings?: readonly string[];
  readonly max_context?: number;
  readonly maxContext?: number;
  readonly max_response?: number;
  readonly maxResponse?: number;
  readonly stream?: boolean;
}

export interface TextCompletionRequestDiagnostics {
  readonly provider: TextCompletionProviderFamily;
  readonly unsupportedSamplerFields: readonly string[];
  readonly unsupportedPassthrough: Readonly<Record<string, unknown>>;
  readonly droppedSamplerFields: readonly string[];
}

export interface TextCompletionRequestBuildResult<TRequest extends Readonly<Record<string, unknown>> = Readonly<Record<string, unknown>>> {
  readonly request: TRequest;
  readonly diagnostics: TextCompletionRequestDiagnostics;
}

type SamplerField = Exclude<keyof NormalizedSamplerSettings, 'extensions'>;

const TEXT_COMPLETION_SAMPLER_FIELDS: readonly SamplerField[] = [
  'temperature',
  'top_p',
  'top_k',
  'min_p',
  'repetition_penalty',
  'frequency_penalty',
  'presence_penalty',
  'max_tokens',
  'stream',
  'stop',
  'logit_bias',
];

const SUPPORTED_FIELDS: Readonly<Record<TextCompletionProviderFamily, ReadonlySet<SamplerField>>> = {
  generic: new Set(TEXT_COMPLETION_SAMPLER_FIELDS),
  textgen: new Set(['temperature', 'top_p', 'top_k', 'min_p', 'repetition_penalty', 'max_tokens', 'stream', 'stop']),
  kobold: new Set(['temperature', 'top_p', 'top_k', 'repetition_penalty', 'max_tokens', 'stream', 'stop']),
  ollama: new Set(['temperature', 'top_p', 'top_k', 'min_p', 'repetition_penalty', 'max_tokens', 'stream', 'stop']),
};

export function buildTextCompletionRequest(input: BuildTextCompletionRequestInput): TextCompletionRequestBuildResult {
  const maxContext = input.maxContext ?? input.max_context;
  const maxResponse = input.maxResponse ?? input.max_response ?? input.sampler?.max_tokens;
  const stream = input.stream ?? input.sampler?.stream;
  const stop = mergeStops(input.sampler?.stop, input.stopStrings);
  const unsupportedSamplerFields = unsupportedFields(input.provider, input.sampler);
  const droppedSamplerFields = droppedFields(input, stop);

  const request = buildProviderRequest(input, maxContext, maxResponse, stream, stop);

  return {
    request,
    diagnostics: {
      provider: input.provider,
      unsupportedSamplerFields,
      unsupportedPassthrough: input.sampler?.extensions.st_sampler_passthrough ?? {},
      droppedSamplerFields,
    },
  };
}

function buildProviderRequest(
  input: BuildTextCompletionRequestInput,
  maxContext: number | undefined,
  maxResponse: number | undefined,
  stream: boolean | undefined,
  stop: readonly string[] | undefined,
): Readonly<Record<string, unknown>> {
  switch (input.provider) {
    case 'generic':
      return omitUndefined({
        prompt: input.prompt,
        temperature: input.sampler?.temperature,
        top_p: input.sampler?.top_p,
        top_k: input.sampler?.top_k,
        min_p: input.sampler?.min_p,
        repetition_penalty: input.sampler?.repetition_penalty,
        frequency_penalty: input.sampler?.frequency_penalty,
        presence_penalty: input.sampler?.presence_penalty,
        max_context: maxContext,
        max_response: maxResponse,
        stream,
        stop,
        logit_bias: input.sampler?.logit_bias,
      });
    case 'textgen':
      return omitUndefined({
        prompt: input.prompt,
        temperature: input.sampler?.temperature,
        top_p: input.sampler?.top_p,
        top_k: input.sampler?.top_k,
        min_p: input.sampler?.min_p,
        repetition_penalty: input.sampler?.repetition_penalty,
        max_context_length: maxContext,
        max_new_tokens: maxResponse,
        stream,
        stopping_strings: stop,
      });
    case 'kobold':
      return omitUndefined({
        prompt: input.prompt,
        temperature: input.sampler?.temperature,
        top_p: input.sampler?.top_p,
        top_k: input.sampler?.top_k,
        rep_pen: input.sampler?.repetition_penalty,
        max_context_length: maxContext,
        max_length: maxResponse,
        stream,
        stop_sequence: stop,
      });
    case 'ollama': {
      const options = omitUndefined({
        temperature: input.sampler?.temperature,
        top_p: input.sampler?.top_p,
        top_k: input.sampler?.top_k,
        min_p: input.sampler?.min_p,
        repeat_penalty: input.sampler?.repetition_penalty,
        num_ctx: maxContext,
        num_predict: maxResponse,
        stop,
      });
      return omitUndefined({
        model: input.model,
        prompt: input.prompt,
        stream,
        options: Object.keys(options).length > 0 ? options : undefined,
      });
    }
  }
}

function unsupportedFields(provider: TextCompletionProviderFamily, sampler: NormalizedSamplerSettings | undefined): readonly string[] {
  if (sampler === undefined) {
    return [];
  }
  const supported = SUPPORTED_FIELDS[provider];
  return TEXT_COMPLETION_SAMPLER_FIELDS.filter((field) => sampler[field] !== undefined && !supported.has(field));
}

function droppedFields(input: BuildTextCompletionRequestInput, stop: readonly string[] | undefined): readonly string[] {
  const dropped: string[] = [];
  if (input.sampler?.max_tokens !== undefined && (input.maxResponse !== undefined || input.max_response !== undefined)) {
    dropped.push('max_tokens');
  }
  if (input.sampler?.stream !== undefined && input.stream !== undefined) {
    dropped.push('stream');
  }
  if (input.sampler?.stop !== undefined && input.stopStrings !== undefined && stop !== undefined) {
    dropped.push('stop');
  }
  return dropped;
}

function mergeStops(samplerStop: string | readonly string[] | undefined, stopStrings: readonly string[] | undefined): readonly string[] | undefined {
  const values = [
    ...normalizeStop(samplerStop),
    ...(stopStrings ?? []),
  ].filter((item) => item.length > 0);
  return values.length === 0 ? undefined : [...new Set(values)];
}

function normalizeStop(value: string | readonly string[] | undefined): readonly string[] {
  if (value === undefined) {
    return [];
  }
  return typeof value === 'string' ? [value] : value;
}

function omitUndefined<T extends Record<string, unknown>>(input: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}
