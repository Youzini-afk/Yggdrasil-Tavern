import type { NormalizedStreamFrame } from './streaming.js';

export type ModelCallMode = 'chat' | 'text';

export interface ModelCallProfile {
  readonly provider: string;
  readonly model: string;
  readonly endpoint?: string;
  readonly secretRef?: string;
  readonly mode: ModelCallMode;
  readonly stream?: boolean;
}

export interface YggdrasilOutboundModelEnvelope {
  readonly method: 'kernel.outbound.execute';
  readonly shape: 'yggdrasil.outbound.model_call.v1';
  readonly capability_id: 'model.execute';
  readonly destination_host: string;
  readonly request: unknown;
  readonly secret_refs: readonly string[];
  readonly audit: {
    readonly category: 'model_call';
    readonly provider: string;
    readonly model: string;
    readonly mode: ModelCallMode;
    readonly stream: boolean;
    readonly live: false;
    readonly network: false;
  };
  readonly redaction: {
    readonly raw_secrets_allowed: false;
    readonly secret_ref_fields: readonly string[];
    readonly redacted_fields: readonly string[];
  };
}

export interface ModelCallPlan {
  readonly live: false;
  readonly requiresHostExecution: true;
  readonly network: false;
  readonly provider: string;
  readonly model: string;
  readonly mode: ModelCallMode;
  readonly stream: boolean;
  readonly envelope: YggdrasilOutboundModelEnvelope;
}

export interface BuildModelCallPlanInput {
  readonly profile: ModelCallProfile;
  readonly requestShape: unknown;
  readonly stream?: boolean;
}

export interface ConsumedModelStreamSummary {
  readonly text: string;
  readonly reasoning: string;
  readonly toolCalls: readonly unknown[];
  readonly errors: readonly { readonly error: string; readonly detail?: unknown }[];
  readonly progress: readonly unknown[];
  readonly started: readonly { readonly id?: string; readonly model?: string }[];
  readonly ended: boolean;
  readonly cancelled: boolean;
  readonly finishReason?: string;
  readonly cancelReason?: string;
  readonly usage?: unknown;
  readonly framesConsumed: number;
  readonly summary: {
    readonly textLength: number;
    readonly reasoningLength: number;
    readonly toolCallCount: number;
    readonly errorCount: number;
    readonly progressCount: number;
  };
}

const RAW_SECRET_PATTERNS: readonly RegExp[] = [
  /\bsk-[A-Za-z0-9_-]{8,}/u,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{8,}/u,
  /\bAIza[A-Za-z0-9_-]{8,}/u,
  /\bxox[abprs]-[A-Za-z0-9-]{8,}/u,
  /\bgh[pousr]_[A-Za-z0-9_]{8,}/u,
];

export function buildModelCallPlan(input: BuildModelCallPlanInput): ModelCallPlan {
  const profile = input.profile;
  if (!isNonEmptyString(profile.provider)) {
    throw new Error('model profile provider is required');
  }
  if (!isNonEmptyString(profile.model)) {
    throw new Error('model profile model is required');
  }
  if (profile.mode !== 'chat' && profile.mode !== 'text') {
    throw new Error('model profile mode must be chat or text');
  }

  rejectRawSecretsInProfile(profile);
  rejectRawSecretsInHeaders(input.requestShape);

  if (profile.provider !== 'fake-local' && !isNonEmptyString(profile.secretRef)) {
    throw new Error('model profile secretRef is required for live providers');
  }

  const stream = input.stream ?? profile.stream ?? false;
  const destinationHost = profile.provider === 'fake-local'
    ? 'fake-local'
    : profile.endpoint ?? profile.provider;
  const secretRefs = isNonEmptyString(profile.secretRef) ? [profile.secretRef] : [];

  const envelope: YggdrasilOutboundModelEnvelope = {
    method: 'kernel.outbound.execute',
    shape: 'yggdrasil.outbound.model_call.v1',
    capability_id: 'model.execute',
    destination_host: destinationHost,
    request: input.requestShape,
    secret_refs: secretRefs,
    audit: {
      category: 'model_call',
      provider: profile.provider,
      model: profile.model,
      mode: profile.mode,
      stream,
      live: false,
      network: false,
    },
    redaction: {
      raw_secrets_allowed: false,
      secret_ref_fields: ['profile.secretRef', 'envelope.secret_refs'],
      redacted_fields: ['headers.authorization', 'headers.x-api-key', 'headers.api-key'],
    },
  };

  return {
    live: false,
    requiresHostExecution: true,
    network: false,
    provider: profile.provider,
    model: profile.model,
    mode: profile.mode,
    stream,
    envelope,
  };
}

export function consumeModelStreamFrames(frames: readonly NormalizedStreamFrame[]): ConsumedModelStreamSummary {
  let text = '';
  let reasoning = '';
  const toolCalls: unknown[] = [];
  const errors: { error: string; detail?: unknown }[] = [];
  const progress: unknown[] = [];
  const started: { id?: string; model?: string }[] = [];
  let ended = false;
  let cancelled = false;
  let finishReason: string | undefined;
  let cancelReason: string | undefined;
  let usage: unknown;

  for (const frame of frames) {
    switch (frame.type) {
      case 'start':
        started.push(omitUndefined({ id: frame.id, model: frame.model }));
        break;
      case 'delta':
        text += frame.text;
        break;
      case 'reasoning_delta':
        reasoning += frame.text;
        break;
      case 'tool_call_delta':
        toolCalls.push(frame.toolCall);
        break;
      case 'progress':
        progress.push(frame.progress);
        break;
      case 'error':
        errors.push(omitUndefined({ error: frame.error, detail: frame.detail }));
        break;
      case 'end':
        ended = true;
        finishReason = frame.reason;
        usage = frame.usage;
        break;
      case 'cancelled':
        cancelled = true;
        cancelReason = frame.reason;
        break;
    }
  }

  return omitUndefined({
    text,
    reasoning,
    toolCalls,
    errors,
    progress,
    started,
    ended,
    cancelled,
    finishReason,
    cancelReason,
    usage,
    framesConsumed: frames.length,
    summary: {
      textLength: text.length,
      reasoningLength: reasoning.length,
      toolCallCount: toolCalls.length,
      errorCount: errors.length,
      progressCount: progress.length,
    },
  });
}

function rejectRawSecretsInProfile(profile: ModelCallProfile): void {
  for (const [key, value] of Object.entries(profile)) {
    if (typeof value === 'string' && looksLikeRawSecret(value)) {
      throw new Error(`raw API key-like value is not allowed in model profile field ${key}`);
    }
  }
}

function rejectRawSecretsInHeaders(requestShape: unknown): void {
  for (const headers of collectHeaderRecords(requestShape)) {
    for (const [key, value] of Object.entries(headers)) {
      const values = Array.isArray(value) ? value : [value];
      for (const item of values) {
        if (typeof item === 'string' && looksLikeRawSecret(item)) {
          throw new Error(`raw API key-like value is not allowed in request header ${key}`);
        }
      }
    }
  }
}

function collectHeaderRecords(value: unknown): readonly Readonly<Record<string, unknown>>[] {
  const headers: Readonly<Record<string, unknown>>[] = [];
  const seen = new Set<unknown>();

  const visit = (current: unknown): void => {
    if (typeof current !== 'object' || current === null || seen.has(current)) {
      return;
    }
    seen.add(current);

    if (Array.isArray(current)) {
      for (const item of current) {
        visit(item);
      }
      return;
    }

    const record = current as Readonly<Record<string, unknown>>;
    for (const [key, child] of Object.entries(record)) {
      if (key.toLowerCase() === 'headers' && isRecord(child)) {
        headers.push(child);
      }
      visit(child);
    }
  };

  visit(value);
  return headers;
}

function looksLikeRawSecret(value: string): boolean {
  return RAW_SECRET_PATTERNS.some((pattern) => pattern.test(value));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
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
