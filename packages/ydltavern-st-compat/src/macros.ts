export type STMacroValue = string | number | boolean | null | undefined;

export interface STMacroContext {
  readonly user?: STMacroValue;
  readonly char?: STMacroValue;
  readonly description?: STMacroValue;
  readonly personality?: STMacroValue;
  readonly scenario?: STMacroValue;
  readonly persona?: STMacroValue;
  readonly charDepthPrompt?: STMacroValue;
  readonly creatorNotes?: STMacroValue;
  readonly mesExamples?: STMacroValue;
  readonly model?: STMacroValue;
  readonly now?: Date | string | number;
  readonly dynamic?: Readonly<Record<string, STMacroValue>>;
  readonly overrides?: Readonly<Record<string, STMacroValue>>;
}

export interface SubstituteSTMacrosOptions {
  readonly now?: Date | string | number;
  readonly overrides?: Readonly<Record<string, STMacroValue>>;
  readonly unknownMacro?: 'preserve' | 'empty';
  readonly previewLength?: number;
}

export type STMacroTraceSource = 'context' | 'dynamic' | 'computed' | 'unknown';

export interface STMacroTraceEntry {
  readonly name: string;
  readonly source: STMacroTraceSource;
  readonly preview: string;
}

export interface SubstituteSTMacrosResult {
  readonly text: string;
  readonly trace: readonly STMacroTraceEntry[];
}

const MACRO_PATTERN = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;

export function substituteSTMacros(
  text: string,
  context: STMacroContext = {},
  options: SubstituteSTMacrosOptions = {},
): SubstituteSTMacrosResult {
  const trace: STMacroTraceEntry[] = [];
  const previewLength = options.previewLength ?? 80;
  const now = normalizeDate(options.now ?? context.now ?? Date.now());

  const replaced = text.replace(MACRO_PATTERN, (match: string, rawName: string): string => {
    const resolved = resolveMacro(rawName, context, options, now);
    trace.push({ name: rawName, source: resolved.source, preview: preview(resolved.value, previewLength) });

    if (resolved.source === 'unknown') {
      return options.unknownMacro === 'empty' ? '' : match;
    }

    return resolved.value;
  });

  return { text: replaced, trace };
}

function resolveMacro(
  name: string,
  context: STMacroContext,
  options: SubstituteSTMacrosOptions,
  now: Date,
): { readonly value: string; readonly source: STMacroTraceSource } {
  const dynamicValue = lookupDynamic(name, options.overrides, context.overrides, context.dynamic);
  if (dynamicValue !== undefined) {
    return { value: stringify(dynamicValue), source: 'dynamic' };
  }

  switch (name) {
    case 'user':
      return contextValue(context.user);
    case 'char':
      return contextValue(context.char);
    case 'description':
      return contextValue(context.description);
    case 'personality':
      return contextValue(context.personality);
    case 'scenario':
      return contextValue(context.scenario);
    case 'persona':
      return contextValue(context.persona);
    case 'charDepthPrompt':
      return contextValue(context.charDepthPrompt);
    case 'creatorNotes':
      return contextValue(context.creatorNotes);
    case 'mesExamples':
      return contextValue(context.mesExamples);
    case 'model':
      return contextValue(context.model);
    case 'date':
      return { value: now.toISOString().slice(0, 10), source: 'computed' };
    case 'time':
      return { value: now.toISOString().slice(11, 19), source: 'computed' };
    default:
      return { value: '', source: 'unknown' };
  }
}

function lookupDynamic(
  name: string,
  ...sources: readonly (Readonly<Record<string, STMacroValue>> | undefined)[]
): STMacroValue {
  for (const source of sources) {
    if (source !== undefined && Object.prototype.hasOwnProperty.call(source, name)) {
      return source[name];
    }
  }

  return undefined;
}

function contextValue(value: STMacroValue): { readonly value: string; readonly source: STMacroTraceSource } {
  return value === undefined
    ? { value: '', source: 'unknown' }
    : { value: stringify(value), source: 'context' };
}

function stringify(value: STMacroValue): string {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value);
}

function preview(value: string, length: number): string {
  if (value.length <= length) {
    return value;
  }

  return `${value.slice(0, Math.max(0, length - 1))}…`;
}

function normalizeDate(value: Date | string | number): Date {
  if (value instanceof Date) {
    return value;
  }

  return new Date(value);
}
