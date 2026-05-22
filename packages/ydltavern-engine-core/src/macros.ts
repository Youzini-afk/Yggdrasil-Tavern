import { substituteSTMacrosDeep, type STMacroTraceSource } from './macros-st.js';

export type MacroValue = string | number | boolean | null | undefined;

export interface MacroContext {
  readonly user?: MacroValue;
  readonly char?: MacroValue;
  readonly description?: MacroValue;
  readonly personality?: MacroValue;
  readonly scenario?: MacroValue;
  readonly persona?: MacroValue;
  readonly charDepthPrompt?: MacroValue;
  readonly creatorNotes?: MacroValue;
  readonly mesExamples?: MacroValue;
  readonly model?: MacroValue;
  readonly now?: Date | string | number;
  readonly dynamic?: Readonly<Record<string, MacroValue>>;
  readonly overrides?: Readonly<Record<string, MacroValue>>;
}

export interface SubstituteMacrosOptions {
  readonly now?: Date | string | number;
  readonly overrides?: Readonly<Record<string, MacroValue>>;
  readonly unknownMacro?: 'preserve' | 'empty';
  readonly previewLength?: number;
  readonly random?: () => number;
  readonly pickSeed?: () => number;
  readonly maxIterations?: number;
}

export type MacroTraceSource = 'context' | 'dynamic' | 'computed' | 'unknown';

export interface MacroTraceEntry {
  readonly name: string;
  readonly source: MacroTraceSource;
  readonly preview: string;
}

export interface SubstituteMacrosResult {
  readonly text: string;
  readonly trace: readonly MacroTraceEntry[];
}

const MACRO_PATTERN = /{{\s*([A-Za-z0-9_.-]+)\s*}}/g;

export function substituteMacros(
  text: string,
  context: MacroContext = {},
  options: SubstituteMacrosOptions = {},
): SubstituteMacrosResult {
  if (usesDeepMacroSemantics(text, context, options)) {
    return substituteMacrosDeepCompat(text, context, options);
  }

  const trace: MacroTraceEntry[] = [];
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

function usesDeepMacroSemantics(text: string, context: MacroContext, options: SubstituteMacrosOptions): boolean {
  return /<USER>|<BOT>|<GROUP>|<CHARIFNOTGROUP>|\{\{\s*(?:\/\/|comment|noop|newline|space|trim|random|pick|roll|isotime|isodate|weekday|datetimeformat|idleDuration|idle_duration|timeDiff|getvar|var|setvar|addvar|incvar|decvar|hasvar|varexists|deletevar|flushvar|getglobalvar|setglobalvar|addglobalvar|incglobalvar|decglobalvar|hasglobalvar|globalvarexists|deleteglobalvar|flushglobalvar|hasExtension|time_UTC|time\s*:|date\s*:)[}:\s]/.test(text)
    || macroSourceHasNestedMacro(context)
    || macroSourceHasNestedMacro(context.dynamic)
    || macroSourceHasNestedMacro(context.overrides)
    || macroSourceHasNestedMacro(options.overrides);
}

function macroSourceHasNestedMacro(source: object | undefined): boolean {
  if (source === undefined) return false;
  return Object.values(source as Record<string, unknown>).some((value) => typeof value === 'string' && value.includes('{{'));
}

function substituteMacrosDeepCompat(
  text: string,
  context: MacroContext,
  options: SubstituteMacrosOptions,
): SubstituteMacrosResult {
  const deep = substituteSTMacrosDeep(text, {
    env: { ...context, ...context.dynamic, ...context.overrides, ...options.overrides },
    now: options.now ?? context.now,
    unknownMacro: options.unknownMacro,
    random: options.random,
    pickSeed: options.pickSeed,
    maxIterations: options.maxIterations,
  });
  const previewLength = options.previewLength ?? 80;
  return {
    text: deep.text,
    trace: deep.trace.map((entry): MacroTraceEntry => ({
      name: entry.name,
      source: entry.source === 'env' ? resolveContextSource(entry.name, context, options) : mapTraceSource(entry.source),
      preview: preview(entry.preview, previewLength),
    })),
  };
}

function mapTraceSource(source: STMacroTraceSource): MacroTraceSource {
  if (source === 'variable' || source === 'control') return 'computed';
  if (source === 'env') return 'dynamic';
  return source;
}

function resolveContextSource(
  name: string,
  context: MacroContext,
  options: SubstituteMacrosOptions,
): MacroTraceSource {
  if (lookupDynamic(name, options.overrides, context.overrides, context.dynamic) !== undefined) return 'dynamic';
  return Object.prototype.hasOwnProperty.call(context, name) ? 'context' : 'dynamic';
}

function resolveMacro(
  name: string,
  context: MacroContext,
  options: SubstituteMacrosOptions,
  now: Date,
): { readonly value: string; readonly source: MacroTraceSource } {
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
  ...sources: readonly (Readonly<Record<string, MacroValue>> | undefined)[]
): MacroValue {
  for (const source of sources) {
    if (source !== undefined && Object.prototype.hasOwnProperty.call(source, name)) {
      return source[name];
    }
  }

  return undefined;
}

function contextValue(value: MacroValue): { readonly value: string; readonly source: MacroTraceSource } {
  return value === undefined
    ? { value: '', source: 'unknown' }
    : { value: stringify(value), source: 'context' };
}

function stringify(value: MacroValue): string {
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
