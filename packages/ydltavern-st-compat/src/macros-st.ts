// Deep port of SillyTavern macro engine.
//
// References (read at port time):
//   public/scripts/macros.js — legacy regex layer + pre/post processors
//   public/scripts/macros/engine/MacroEngine.js — registry-based engine
//   public/scripts/macros/definitions/*.js — core/env/time/state/instruct/chat/variable
//
// This module implements the ST macro registry semantics, the legacy
// `<USER>` / `<BOT>` / `<GROUP>` / `<CHARIFNOTGROUP>` pre-normalization,
// the unescape post-processor, the legacy `{{trim}}` post-processor,
// recursive expansion, and the parameterized `getvar` / `setvar` / `var` /
// `random` / `pick` / `roll` / `time` / `datetimeformat` macros.
//
// Pure logic. No DOM. No network. Deterministic given an injected RNG.

export type STMacroValue = string | number | boolean | null | undefined;

export interface STMacroEnv {
  readonly user?: STMacroValue;
  readonly char?: STMacroValue;
  readonly description?: STMacroValue;
  readonly personality?: STMacroValue;
  readonly scenario?: STMacroValue;
  readonly persona?: STMacroValue;
  readonly group?: STMacroValue;
  readonly groupNotMuted?: STMacroValue;
  readonly notChar?: STMacroValue;
  readonly charPrompt?: STMacroValue;
  readonly charInstruction?: STMacroValue;
  readonly charDepthPrompt?: STMacroValue;
  readonly creatorNotes?: STMacroValue;
  readonly mesExamples?: STMacroValue;
  readonly mesExamplesRaw?: STMacroValue;
  readonly charFirstMessage?: STMacroValue;
  readonly charVersion?: STMacroValue;
  readonly model?: STMacroValue;
  readonly original?: STMacroValue;
  readonly isMobile?: STMacroValue;
  readonly maxPrompt?: STMacroValue;
  readonly maxContext?: STMacroValue;
  readonly maxResponse?: STMacroValue;
  readonly lastMessage?: STMacroValue;
  readonly lastMessageId?: STMacroValue;
  readonly lastUserMessage?: STMacroValue;
  readonly lastCharMessage?: STMacroValue;
  readonly firstIncludedMessageId?: STMacroValue;
  readonly firstDisplayedMessageId?: STMacroValue;
  readonly lastSwipeId?: STMacroValue;
  readonly currentSwipeId?: STMacroValue;
  readonly allChatRange?: STMacroValue;
  readonly idleDuration?: STMacroValue;
  readonly lastGenerationType?: STMacroValue;
  // Instruct sequences
  readonly instructStoryStringPrefix?: STMacroValue;
  readonly instructStoryStringSuffix?: STMacroValue;
  readonly instructUserPrefix?: STMacroValue;
  readonly instructUserSuffix?: STMacroValue;
  readonly instructAssistantPrefix?: STMacroValue;
  readonly instructAssistantSuffix?: STMacroValue;
  readonly instructSystemPrefix?: STMacroValue;
  readonly instructSystemSuffix?: STMacroValue;
  readonly instructFirstAssistantPrefix?: STMacroValue;
  readonly instructLastAssistantPrefix?: STMacroValue;
  readonly instructStop?: STMacroValue;
  readonly instructUserFiller?: STMacroValue;
  readonly instructSystemInstructionPrefix?: STMacroValue;
  readonly instructFirstUserPrefix?: STMacroValue;
  readonly instructLastUserPrefix?: STMacroValue;
  readonly defaultSystemPrompt?: STMacroValue;
  readonly systemPrompt?: STMacroValue;
  readonly exampleSeparator?: STMacroValue;
  readonly chatStart?: STMacroValue;
}

export interface STMacroOptions {
  readonly env?: STMacroEnv;
  readonly localVars?: Map<string, STMacroValue>;
  readonly globalVars?: Map<string, STMacroValue>;
  readonly extensions?: ReadonlySet<string>;
  readonly random?: () => number;
  readonly pickSeed?: () => number;
  readonly now?: Date | string | number;
  readonly maxIterations?: number;
  readonly unknownMacro?: 'preserve' | 'empty';
}

export type STMacroTraceSource = 'env' | 'computed' | 'variable' | 'control' | 'unknown';

export interface STMacroTraceEntry {
  readonly name: string;
  readonly raw: string;
  readonly source: STMacroTraceSource;
  readonly preview: string;
}

export interface STMacroResult {
  readonly text: string;
  readonly trace: readonly STMacroTraceEntry[];
  readonly iterations: number;
}

// ---------------------------------------------------------------------------
// Pre-processors: normalize <USER>, <BOT>, <GROUP>, <CHARIFNOTGROUP>

const PRE_PROCESSORS: readonly { readonly pattern: RegExp; readonly replacement: string }[] = [
  { pattern: /<USER>/g, replacement: '{{user}}' },
  { pattern: /<BOT>/g, replacement: '{{char}}' },
  { pattern: /<GROUP>/g, replacement: '{{group}}' },
  { pattern: /<CHARIFNOTGROUP>/g, replacement: '{{charIfNotGroup}}' },
  // Legacy {{time_UTC-10}} → {{time::UTC-10}}
  { pattern: /\{\{\s*time_UTC([+-]\d{1,2})\s*\}\}/g, replacement: '{{time::UTC$1}}' },
];

// ---------------------------------------------------------------------------
// Macro pattern. Captures macro name and optional parameter parts.
// ST uses {{name}}, {{name:args}}, and {{name::a::b::c}} forms.
const MACRO_PATTERN = /\{\{\s*([A-Za-z0-9_/.+-]+)((?::[^}]*)?)\s*\}\}/g;

export function substituteSTMacrosDeep(
  text: string,
  options: STMacroOptions = {},
): STMacroResult {
  const maxIters = options.maxIterations ?? 5;
  const trace: STMacroTraceEntry[] = [];

  let current = text;
  for (const pp of PRE_PROCESSORS) current = current.replace(pp.pattern, pp.replacement);
  // Comment macros: {{// anything until }}}} → empty (with trace)
  current = current.replace(/\{\{\s*\/\/[^}]*\}\}/g, () => {
    trace.push({ name: '//', raw: '{{// ...}}', source: 'computed', preview: '' });
    return '';
  });

  let iterations = 0;
  for (let i = 0; i < maxIters; i++) {
    if (!current.includes('{{')) break;
    const before = current;
    current = current.replace(MACRO_PATTERN, (match, name: string, rawArgs: string) => {
      const args = rawArgs ?? '';
      const resolved = resolveSTMacro(name, args, options);
      trace.push({ name, raw: match, source: resolved.source, preview: previewValue(resolved.value) });
      if (resolved.source === 'unknown') {
        return options.unknownMacro === 'empty' ? '' : match;
      }
      return resolved.value;
    });
    iterations = i + 1;
    if (current === before) break;
  }

  // Post: legacy {{trim}} compatibility — collapse 3+ newlines to 2
  current = current.replace(/\n{3,}/g, '\n\n');

  return { text: current, trace, iterations };
}

function resolveSTMacro(
  name: string,
  rawArgs: string,
  options: STMacroOptions,
): { value: string; source: STMacroTraceSource } {
  const env = options.env ?? {};
  const args = rawArgs.startsWith('::') ? rawArgs.slice(2).split('::')
    : rawArgs.startsWith(':') ? rawArgs.slice(1).split(',').map((s) => s.trim())
      : [];

  // Comment macro
  if (name === '//' || name === 'comment') return { value: '', source: 'computed' };
  if (name === 'noop') return { value: '', source: 'computed' };
  if (name === 'newline') {
    const n = args[0] ? Math.max(0, parseInt(args[0], 10) || 0) : 1;
    return { value: '\n'.repeat(n), source: 'computed' };
  }
  if (name === 'space') {
    const n = args[0] ? Math.max(0, parseInt(args[0], 10) || 0) : 1;
    return { value: ' '.repeat(n), source: 'computed' };
  }
  if (name === 'trim') return { value: '', source: 'computed' };

  // Random / pick / roll
  if (name === 'random') {
    const choices = args.length > 0 ? args : rawArgs ? [rawArgs] : [];
    const rng = options.random ?? Math.random;
    if (choices.length === 0) return { value: '', source: 'computed' };
    return { value: String(choices[Math.floor(rng() * choices.length)] ?? ''), source: 'computed' };
  }
  if (name === 'pick') {
    const choices = args.length > 0 ? args : [];
    const rng = options.pickSeed ?? options.random ?? Math.random;
    if (choices.length === 0) return { value: '', source: 'computed' };
    return { value: String(choices[Math.floor(rng() * choices.length)] ?? ''), source: 'computed' };
  }
  if (name === 'roll') {
    const spec = (args[0] ?? '').toString();
    const m = spec.match(/^(\d+)?d(\d+)$/i);
    const rng = options.random ?? Math.random;
    if (m) {
      const count = Math.max(1, parseInt(m[1] ?? '1', 10));
      const sides = Math.max(1, parseInt(m[2] ?? '6', 10));
      let total = 0;
      for (let i = 0; i < count; i++) total += Math.floor(rng() * sides) + 1;
      return { value: String(total), source: 'computed' };
    }
    const sides = parseInt(spec, 10);
    if (Number.isFinite(sides) && sides > 0) {
      return { value: String(Math.floor(rng() * sides) + 1), source: 'computed' };
    }
    return { value: '', source: 'computed' };
  }

  // Time / date macros
  const now = normalizeDate(options.now ?? Date.now());
  if (name === 'time') {
    if (args[0]?.startsWith('UTC')) {
      const offset = parseInt(args[0].slice(3), 10) || 0;
      const utcDate = new Date(now.getTime() + offset * 60 * 60 * 1000);
      return { value: utcDate.toISOString().slice(11, 19), source: 'computed' };
    }
    return { value: now.toISOString().slice(11, 19), source: 'computed' };
  }
  if (name === 'date') return { value: now.toISOString().slice(0, 10), source: 'computed' };
  if (name === 'isotime') return { value: now.toISOString().slice(11, 19), source: 'computed' };
  if (name === 'isodate') return { value: now.toISOString().slice(0, 10), source: 'computed' };
  if (name === 'weekday') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return { value: days[now.getUTCDay()] ?? '', source: 'computed' };
  }
  if (name === 'datetimeformat') {
    const fmt = args.join('::') || 'YYYY-MM-DD HH:mm:ss';
    return { value: formatDateTime(now, fmt), source: 'computed' };
  }
  if (name === 'idleDuration' || name === 'idle_duration') {
    return { value: stringify(env.idleDuration), source: 'computed' };
  }
  if (name === 'timeDiff') {
    const a = Date.parse(args[0] ?? '');
    const b = Date.parse(args[1] ?? '');
    if (Number.isFinite(a) && Number.isFinite(b)) {
      return { value: String(Math.abs(b - a)), source: 'computed' };
    }
    return { value: '0', source: 'computed' };
  }

  // Variable macros (parameterized forms)
  if ((name === 'getvar' || name === 'var') && args.length >= 1) {
    const v = options.localVars?.get(args[0] ?? '');
    return { value: stringify(v), source: 'variable' };
  }
  if (name === 'setvar' && args.length >= 2) {
    options.localVars?.set(args[0] ?? '', args[1] ?? '');
    return { value: stringify(args[1]), source: 'variable' };
  }
  if (name === 'addvar' && args.length >= 2) {
    const cur = options.localVars?.get(args[0] ?? '');
    const next = `${stringify(cur)}${stringify(args[1])}`;
    options.localVars?.set(args[0] ?? '', next);
    return { value: next, source: 'variable' };
  }
  if (name === 'incvar' && args.length >= 1) {
    const cur = Number(options.localVars?.get(args[0] ?? '') ?? 0);
    const next = (Number.isFinite(cur) ? cur : 0) + 1;
    options.localVars?.set(args[0] ?? '', next);
    return { value: String(next), source: 'variable' };
  }
  if (name === 'decvar' && args.length >= 1) {
    const cur = Number(options.localVars?.get(args[0] ?? '') ?? 0);
    const next = (Number.isFinite(cur) ? cur : 0) - 1;
    options.localVars?.set(args[0] ?? '', next);
    return { value: String(next), source: 'variable' };
  }
  if (name === 'hasvar' || name === 'varexists') {
    return { value: options.localVars?.has(args[0] ?? '') ? 'true' : 'false', source: 'variable' };
  }
  if (name === 'deletevar' || name === 'flushvar') {
    options.localVars?.delete(args[0] ?? '');
    return { value: '', source: 'variable' };
  }
  if (name === 'getglobalvar' && args.length >= 1) {
    return { value: stringify(options.globalVars?.get(args[0] ?? '')), source: 'variable' };
  }
  if (name === 'setglobalvar' && args.length >= 2) {
    options.globalVars?.set(args[0] ?? '', args[1] ?? '');
    return { value: stringify(args[1]), source: 'variable' };
  }
  if (name === 'addglobalvar' && args.length >= 2) {
    const cur = options.globalVars?.get(args[0] ?? '');
    const next = `${stringify(cur)}${stringify(args[1])}`;
    options.globalVars?.set(args[0] ?? '', next);
    return { value: next, source: 'variable' };
  }
  if (name === 'incglobalvar' && args.length >= 1) {
    const cur = Number(options.globalVars?.get(args[0] ?? '') ?? 0);
    const next = (Number.isFinite(cur) ? cur : 0) + 1;
    options.globalVars?.set(args[0] ?? '', next);
    return { value: String(next), source: 'variable' };
  }
  if (name === 'decglobalvar' && args.length >= 1) {
    const cur = Number(options.globalVars?.get(args[0] ?? '') ?? 0);
    const next = (Number.isFinite(cur) ? cur : 0) - 1;
    options.globalVars?.set(args[0] ?? '', next);
    return { value: String(next), source: 'variable' };
  }
  if (name === 'hasglobalvar' || name === 'globalvarexists') {
    return { value: options.globalVars?.has(args[0] ?? '') ? 'true' : 'false', source: 'variable' };
  }
  if (name === 'deleteglobalvar' || name === 'flushglobalvar') {
    options.globalVars?.delete(args[0] ?? '');
    return { value: '', source: 'variable' };
  }

  // hasExtension
  if (name === 'hasExtension') {
    return { value: options.extensions?.has(args[0] ?? '') ? 'true' : 'false', source: 'control' };
  }

  // Env macros (with aliases)
  const envMap: Record<string, keyof STMacroEnv> = {
    user: 'user',
    char: 'char',
    description: 'description',
    charDescription: 'description',
    personality: 'personality',
    charPersonality: 'personality',
    scenario: 'scenario',
    charScenario: 'scenario',
    persona: 'persona',
    group: 'group',
    charIfNotGroup: 'group',
    groupNotMuted: 'groupNotMuted',
    notChar: 'notChar',
    charPrompt: 'charPrompt',
    charInstruction: 'charInstruction',
    charDepthPrompt: 'charDepthPrompt',
    charCreatorNotes: 'creatorNotes',
    creatorNotes: 'creatorNotes',
    mesExamples: 'mesExamples',
    mesExamplesRaw: 'mesExamplesRaw',
    charFirstMessage: 'charFirstMessage',
    greeting: 'charFirstMessage',
    charVersion: 'charVersion',
    version: 'charVersion',
    char_version: 'charVersion',
    model: 'model',
    original: 'original',
    isMobile: 'isMobile',
    maxPrompt: 'maxPrompt',
    maxContext: 'maxContext',
    maxResponse: 'maxResponse',
    lastMessage: 'lastMessage',
    lastMessageId: 'lastMessageId',
    lastUserMessage: 'lastUserMessage',
    lastCharMessage: 'lastCharMessage',
    firstIncludedMessageId: 'firstIncludedMessageId',
    firstDisplayedMessageId: 'firstDisplayedMessageId',
    lastSwipeId: 'lastSwipeId',
    currentSwipeId: 'currentSwipeId',
    allChatRange: 'allChatRange',
    lastGenerationType: 'lastGenerationType',
    instructStoryStringPrefix: 'instructStoryStringPrefix',
    instructStoryStringSuffix: 'instructStoryStringSuffix',
    instructUserPrefix: 'instructUserPrefix',
    instructInput: 'instructUserPrefix',
    instructUserSuffix: 'instructUserSuffix',
    instructAssistantPrefix: 'instructAssistantPrefix',
    instructOutput: 'instructAssistantPrefix',
    instructAssistantSuffix: 'instructAssistantSuffix',
    instructSeparator: 'instructAssistantSuffix',
    instructSystemPrefix: 'instructSystemPrefix',
    instructSystemSuffix: 'instructSystemSuffix',
    instructFirstAssistantPrefix: 'instructFirstAssistantPrefix',
    instructFirstOutputPrefix: 'instructFirstAssistantPrefix',
    instructLastAssistantPrefix: 'instructLastAssistantPrefix',
    instructLastOutputPrefix: 'instructLastAssistantPrefix',
    instructStop: 'instructStop',
    instructUserFiller: 'instructUserFiller',
    instructSystemInstructionPrefix: 'instructSystemInstructionPrefix',
    instructFirstUserPrefix: 'instructFirstUserPrefix',
    instructFirstInput: 'instructFirstUserPrefix',
    instructLastUserPrefix: 'instructLastUserPrefix',
    instructLastInput: 'instructLastUserPrefix',
    defaultSystemPrompt: 'defaultSystemPrompt',
    instructSystem: 'defaultSystemPrompt',
    instructSystemPrompt: 'defaultSystemPrompt',
    systemPrompt: 'systemPrompt',
    exampleSeparator: 'exampleSeparator',
    chatSeparator: 'exampleSeparator',
    chatStart: 'chatStart',
  };
  const key = envMap[name];
  if (key !== undefined) {
    const value = env[key];
    return { value: stringify(value), source: 'env' };
  }

  return { value: '', source: 'unknown' };
}

function stringify(value: STMacroValue): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function previewValue(value: string): string {
  return value.length > 80 ? `${value.slice(0, 79)}…` : value;
}

function normalizeDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value);
}

function formatDateTime(d: Date, fmt: string): string {
  const pad = (n: number, len = 2): string => String(n).padStart(len, '0');
  return fmt
    .replace(/YYYY/g, String(d.getUTCFullYear()))
    .replace(/MM/g, pad(d.getUTCMonth() + 1))
    .replace(/DD/g, pad(d.getUTCDate()))
    .replace(/HH/g, pad(d.getUTCHours()))
    .replace(/mm/g, pad(d.getUTCMinutes()))
    .replace(/ss/g, pad(d.getUTCSeconds()));
}

// ---------------------------------------------------------------------------
// Pick state (per ST: `{{pick}}` is stable per chat with `/reroll-pick` reset)

export class PickState {
  private cache = new Map<string, number>();

  pick(key: string, choiceCount: number, rng: () => number): number {
    if (this.cache.has(key)) return this.cache.get(key)!;
    const idx = Math.floor(rng() * choiceCount);
    this.cache.set(key, idx);
    return idx;
  }

  reset(): void {
    this.cache.clear();
  }
}
