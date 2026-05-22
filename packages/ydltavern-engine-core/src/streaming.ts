export type NormalizedStreamFrame =
  | { readonly type: 'start'; readonly id?: string; readonly model?: string }
  | { readonly type: 'delta'; readonly text: string; readonly index?: number }
  | { readonly type: 'reasoning_delta'; readonly text: string; readonly index?: number }
  | { readonly type: 'tool_call_delta'; readonly toolCall: unknown; readonly index?: number }
  | { readonly type: 'progress'; readonly progress: unknown }
  | { readonly type: 'error'; readonly error: string; readonly detail?: unknown }
  | { readonly type: 'end'; readonly reason?: string; readonly usage?: unknown }
  | { readonly type: 'cancelled'; readonly reason?: string };

export function normalizeOpenAIChatStreamFrame(chunk: unknown): readonly NormalizedStreamFrame[] {
  const record = asRecord(chunk);
  if (record === undefined) {
    return [];
  }
  if (typeof record.error === 'string') {
    return [{ type: 'error', error: record.error }];
  }
  if (asRecord(record.error) !== undefined) {
    return [{ type: 'error', error: readString(asRecord(record.error), 'message') ?? 'stream error', detail: record.error }];
  }
  const frames: NormalizedStreamFrame[] = [];
  if (record.id !== undefined || record.model !== undefined) {
    frames.push(omitUndefined({ type: 'start' as const, id: readString(record, 'id'), model: readString(record, 'model') }));
  }
  for (const [index, choice] of readArray(record.choices).entries()) {
    const choiceRecord = asRecord(choice);
    const delta = asRecord(choiceRecord?.delta);
    const content = readString(delta, 'content');
    const reasoning = readString(delta, 'reasoning_content') ?? readString(delta, 'reasoning');
    const toolCalls = delta?.tool_calls ?? delta?.toolCalls;
    if (content !== undefined && content !== '') {
      frames.push({ type: 'delta', text: content, index });
    }
    if (reasoning !== undefined && reasoning !== '') {
      frames.push({ type: 'reasoning_delta', text: reasoning, index });
    }
    if (toolCalls !== undefined) {
      frames.push({ type: 'tool_call_delta', toolCall: toolCalls, index });
    }
    const finishReason = readString(choiceRecord, 'finish_reason') ?? readString(choiceRecord, 'finishReason');
    if (finishReason !== undefined) {
      frames.push(omitUndefined({ type: 'end' as const, reason: finishReason, usage: record.usage }));
    }
  }
  return frames;
}

export function normalizeTextCompletionStreamFrame(chunk: unknown): readonly NormalizedStreamFrame[] {
  const record = asRecord(chunk);
  if (record === undefined) {
    return [];
  }
  if (typeof record.error === 'string') {
    return [{ type: 'error', error: record.error }];
  }
  const frames: NormalizedStreamFrame[] = [];
  for (const [index, choice] of readArray(record.choices).entries()) {
    const choiceRecord = asRecord(choice);
    const text = readString(choiceRecord, 'text');
    if (text !== undefined && text !== '') {
      frames.push({ type: 'delta', text, index });
    }
    const finishReason = readString(choiceRecord, 'finish_reason') ?? readString(choiceRecord, 'finishReason');
    if (finishReason !== undefined) {
      frames.push(omitUndefined({ type: 'end' as const, reason: finishReason, usage: record.usage }));
    }
  }
  return frames;
}

export function normalizeOllamaStreamFrame(chunk: unknown): readonly NormalizedStreamFrame[] {
  const record = asRecord(chunk);
  if (record === undefined) {
    return [];
  }
  if (typeof record.error === 'string') {
    return [{ type: 'error', error: record.error }];
  }
  const frames: NormalizedStreamFrame[] = [];
  const response = readString(record, 'response') ?? readString(record, 'message');
  const thinking = readString(record, 'thinking');
  if (response !== undefined && response !== '') {
    frames.push({ type: 'delta', text: response });
  }
  if (thinking !== undefined && thinking !== '') {
    frames.push({ type: 'reasoning_delta', text: thinking });
  }
  if (record.done === true) {
    frames.push(omitUndefined({ type: 'end' as const, reason: readString(record, 'done_reason') ?? readString(record, 'doneReason'), usage: ollamaUsage(record) }));
  }
  return frames;
}

export function cancelledStreamFrame(reason?: string): NormalizedStreamFrame {
  return omitUndefined({ type: 'cancelled' as const, reason });
}

function ollamaUsage(record: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> | undefined {
  const usage = omitUndefined({
    prompt_eval_count: record.prompt_eval_count,
    eval_count: record.eval_count,
    total_duration: record.total_duration,
    load_duration: record.load_duration,
    prompt_eval_duration: record.prompt_eval_duration,
    eval_duration: record.eval_duration,
  });
  return Object.keys(usage).length > 0 ? usage : undefined;
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Readonly<Record<string, unknown>>
    : undefined;
}

function readArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function readString(record: Readonly<Record<string, unknown>> | undefined, key: string): string | undefined {
  const value = record?.[key];
  return typeof value === 'string' ? value : undefined;
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
