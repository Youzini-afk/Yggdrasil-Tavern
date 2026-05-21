import type { NormalizedSamplerSettings } from './sampler.js';

export interface OpenAIChatMessage {
  readonly role: 'system' | 'user' | 'assistant' | 'tool';
  readonly content: string;
}

export interface OpenAISamplerRequestFields {
  readonly temperature?: number;
  readonly top_p?: number;
  readonly frequency_penalty?: number;
  readonly presence_penalty?: number;
  readonly max_tokens?: number;
  readonly stream?: boolean;
  readonly stop?: string | readonly string[];
  readonly logit_bias?: Readonly<Record<string, number>>;
}

export interface OpenAISamplerDiagnostics {
  readonly unsupportedFields: readonly string[];
  readonly unsupportedPassthrough: Readonly<Record<string, unknown>>;
}

export interface OpenAISamplerMapping {
  readonly request: OpenAISamplerRequestFields;
  readonly diagnostics: OpenAISamplerDiagnostics;
}

export interface BuildOpenAIChatRequestInput {
  readonly model: string;
  readonly messages: readonly OpenAIChatMessage[];
  readonly sampler?: NormalizedSamplerSettings;
  readonly stream?: boolean;
}

export interface OpenAIChatRequestBody extends OpenAISamplerRequestFields {
  readonly model: string;
  readonly messages: readonly OpenAIChatMessage[];
}

export function mapSTSamplerToOpenAI(sampler: NormalizedSamplerSettings): OpenAISamplerMapping {
  const request: OpenAISamplerRequestFields = omitUndefined({
    temperature: sampler.temperature,
    top_p: sampler.top_p,
    frequency_penalty: sampler.frequency_penalty,
    presence_penalty: sampler.presence_penalty,
    max_tokens: sampler.max_tokens,
    stream: sampler.stream,
    stop: sampler.stop,
    logit_bias: sampler.logit_bias,
  });

  const unsupportedFields: string[] = [];
  if (sampler.top_k !== undefined) {
    unsupportedFields.push('top_k');
  }
  if (sampler.min_p !== undefined) {
    unsupportedFields.push('min_p');
  }
  if (sampler.repetition_penalty !== undefined) {
    unsupportedFields.push('repetition_penalty');
  }

  return {
    request,
    diagnostics: {
      unsupportedFields,
      unsupportedPassthrough: sampler.extensions.st_sampler_passthrough,
    },
  };
}

export function buildOpenAIChatRequest(input: BuildOpenAIChatRequestInput): OpenAIChatRequestBody {
  const model = input.model.trim();
  if (model === '') {
    throw new TypeError('OpenAI chat request model must be a non-empty string');
  }

  const samplerRequest = input.sampler === undefined ? {} : mapSTSamplerToOpenAI(input.sampler).request;
  return omitUndefined({
    ...samplerRequest,
    model,
    messages: input.messages,
    stream: input.stream ?? samplerRequest.stream,
  });
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
