import { ST_SAMPLER_PARAMETERS } from '@ydltavern/types/st';
import type { STSamplerParameter } from '@ydltavern/types/st';

export type LogitBias = Readonly<Record<string, number>>;

export interface NormalizedSamplerExtensions {
  readonly st_sampler_passthrough: Readonly<Record<string, unknown>>;
}

export interface NormalizedSamplerSettings {
  readonly temperature?: number;
  readonly top_p?: number;
  readonly top_k?: number;
  readonly min_p?: number;
  readonly repetition_penalty?: number;
  readonly frequency_penalty?: number;
  readonly presence_penalty?: number;
  readonly max_tokens?: number;
  readonly stream?: boolean;
  readonly stop?: string | readonly string[];
  readonly logit_bias?: LogitBias;
  readonly extensions: NormalizedSamplerExtensions;
}

const ST_SAMPLER_PARAMETER_SET: ReadonlySet<string> = new Set<string>(ST_SAMPLER_PARAMETERS);

const ALIASES = {
  temperature: ['temperature', 'temp', 'temp_openai'] satisfies readonly STSamplerParameter[],
  top_p: ['top_p', 'top_p_openai'] satisfies readonly STSamplerParameter[],
  top_k: ['top_k', 'top_k_openai'] satisfies readonly STSamplerParameter[],
  min_p: ['min_p', 'min_p_openai'] satisfies readonly STSamplerParameter[],
  repetition_penalty: ['repetition_penalty', 'repetition_penalty_openai', 'rep_pen'] satisfies readonly STSamplerParameter[],
  frequency_penalty: ['frequency_penalty', 'freq_pen_openai', 'freq_pen'] satisfies readonly STSamplerParameter[],
  presence_penalty: ['presence_penalty', 'pres_pen_openai', 'presence_pen'] satisfies readonly STSamplerParameter[],
  max_tokens: ['max_tokens', 'max_new_tokens', 'n_predict', 'num_predict'] satisfies readonly STSamplerParameter[],
  stream: ['stream', 'streaming'] satisfies readonly STSamplerParameter[],
  stop: ['stop', 'stopping_strings'] satisfies readonly STSamplerParameter[],
  logit_bias: ['logit_bias'] satisfies readonly STSamplerParameter[],
} as const;

const CONSUMED_SAMPLER_KEYS: ReadonlySet<string> = new Set<string>(
  Object.values(ALIASES).flatMap((keys) => [...keys]),
);

export function normalizeSamplerSettings(input: unknown): NormalizedSamplerSettings {
  const source = isRecord(input) ? input : {};
  const passthrough: Record<string, unknown> = {};

  const temperature = firstNumber(source, ALIASES.temperature);
  const top_p = firstNumber(source, ALIASES.top_p);
  const top_k = firstInteger(source, ALIASES.top_k);
  const min_p = firstNumber(source, ALIASES.min_p);
  const repetition_penalty = firstNumber(source, ALIASES.repetition_penalty);
  const frequency_penalty = firstNumber(source, ALIASES.frequency_penalty);
  const presence_penalty = firstNumber(source, ALIASES.presence_penalty);
  const max_tokens = firstInteger(source, ALIASES.max_tokens);
  const stream = firstBoolean(source, ALIASES.stream);
  const stop = firstStop(source, ALIASES.stop);
  const logit_bias = firstLogitBias(source, ALIASES.logit_bias);

  for (const [key, value] of Object.entries(source)) {
    if (ST_SAMPLER_PARAMETER_SET.has(key) && !CONSUMED_SAMPLER_KEYS.has(key)) {
      passthrough[key] = value;
    }
  }

  return omitUndefined({
    temperature,
    top_p,
    top_k,
    min_p,
    repetition_penalty,
    frequency_penalty,
    presence_penalty,
    max_tokens,
    stream,
    stop,
    logit_bias,
    extensions: {
      st_sampler_passthrough: passthrough,
    },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function firstNumber(source: Record<string, unknown>, keys: readonly string[]): number | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function firstInteger(source: Record<string, unknown>, keys: readonly string[]): number | undefined {
  const value = firstNumber(source, keys);
  return value === undefined ? undefined : Math.trunc(value);
}

function firstBoolean(source: Record<string, unknown>, keys: readonly string[]): boolean | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
    }
  }
  return undefined;
}

function firstStop(source: Record<string, unknown>, keys: readonly string[]): string | readonly string[] | undefined {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value) && value.every((item): item is string => typeof item === 'string')) {
      return value;
    }
  }
  return undefined;
}

function firstLogitBias(source: Record<string, unknown>, keys: readonly string[]): LogitBias | undefined {
  for (const key of keys) {
    const value = source[key];
    if (!isRecord(value)) {
      continue;
    }

    const entries = Object.entries(value);
    if (entries.every(([, entryValue]) => typeof entryValue === 'number' && Number.isFinite(entryValue))) {
      return Object.fromEntries(entries) as Record<string, number>;
    }
  }
  return undefined;
}

function omitUndefined(settings: NormalizedSamplerSettings): NormalizedSamplerSettings {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as unknown as NormalizedSamplerSettings;
}
