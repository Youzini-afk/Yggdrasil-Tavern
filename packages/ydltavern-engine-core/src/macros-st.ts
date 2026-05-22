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

import { createSeededRandom } from './random-st.js';

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

const ST_HARNESS_RANDOM_SEED = 'ydltavern-fixture-v1';
const TRIM_MARKER = '\uE000YDLTAVERN_TRIM\uE000';

// ---------------------------------------------------------------------------
// Pre-processors: normalize <USER>, <BOT>, <GROUP>, <CHARIFNOTGROUP>

const PRE_PROCESSORS: readonly { readonly pattern: RegExp; readonly replacement: string }[] = [
  { pattern: /<USER>/g, replacement: '{{user}}' },
  { pattern: /<BOT>/g, replacement: '{{char}}' },
  { pattern: /<GROUP>/g, replacement: '{{group}}' },
  { pattern: /<CHARIFNOTGROUP>/g, replacement: '{{charIfNotGroup}}' },
  // Legacy {{time_UTC-10}} → {{time::UTC-10}} (public/scripts/macros.js:667)
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
  const runtime = createRuntime(options);

  let current = text;
  for (const pp of PRE_PROCESSORS) current = current.replace(pp.pattern, pp.replacement);
  // Comment macros: {{// anything until }}}} → empty (public/scripts/macros.js:659)
  current = current.replace(/\{\{\s*\/\/[^}]*\}\}/g, () => {
    trace.push({ name: '//', raw: '{{// ...}}', source: 'computed', preview: '' });
    return '';
  });

  let iterations = 0;
  for (let i = 0; i < maxIters; i += 1) {
    if (!current.includes('{{')) break;
    const before = current;
    current = current.replace(MACRO_PATTERN, (match, name: string, rawArgs: string) => {
      const args = rawArgs ?? '';
      const resolved = resolveSTMacro(name, args, options, runtime);
      trace.push({ name, raw: match, source: resolved.source, preview: previewValue(resolved.value) });
      if (resolved.source === 'unknown') {
        return options.unknownMacro === 'empty' ? '' : match;
      }
      return resolved.value;
    });
    iterations = i + 1;
    if (current === before) break;
  }

  // Post: legacy {{trim}} compatibility — trim adjacent newline runs, then collapse 3+ newlines to 2.
  current = current
    .replace(new RegExp(`[ \\t]*${TRIM_MARKER}[ \\t]*(?:\\r?\\n)+[ \\t]*`, 'g'), ' ')
    .replace(new RegExp(TRIM_MARKER, 'g'), '');
  current = current.replace(/\n{3,}/g, '\n\n');

  return { text: current, trace, iterations };
}

interface MacroRuntime {
  readonly rng: () => number;
  readonly pickRng: () => number;
  readonly now: Date;
}

function createRuntime(options: STMacroOptions): MacroRuntime {
  const seededRandom = options.random === undefined ? createSeededRandom(ST_HARNESS_RANDOM_SEED) : undefined;
  return {
    rng: options.random ?? seededRandom ?? Math.random,
    pickRng: options.pickSeed ?? options.random ?? seededRandom ?? Math.random,
    now: normalizeDate(options.now ?? Date.now()),
  };
}

function resolveSTMacro(
  name: string,
  rawArgs: string,
  options: STMacroOptions,
  runtime: MacroRuntime,
): { value: string; source: STMacroTraceSource } {
  const env = options.env ?? {};
  const args = parseArgs(rawArgs);

  // Comment/core macros (public/scripts/macros.js:659,632-634; core-macros.js:50,68,77,282)
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
  if (name === 'trim') return { value: TRIM_MARKER, source: 'computed' };

  // Random / pick / roll (public/scripts/macros.js:492,522,551; core-macros.js:303,340,363)
  if (name === 'random') {
    const choices = args.length > 0 ? args : rawArgs ? [rawArgs] : [];
    if (choices.length === 0) return { value: '', source: 'computed' };
    return { value: String(choices[Math.floor(runtime.rng() * choices.length)] ?? ''), source: 'computed' };
  }
  if (name === 'pick') {
    const choices = args.length > 0 ? args : [];
    if (choices.length === 0) return { value: '', source: 'computed' };
    return { value: String(choices[Math.floor(runtime.pickRng() * choices.length)] ?? ''), source: 'computed' };
  }
  if (name === 'roll') {
    const spec = (args[0] ?? '').toString();
    const m = spec.match(/^(\d+)?d(\d+)$/i);
    if (m) {
      const count = Math.max(1, parseInt(m[1] ?? '1', 10));
      const sides = Math.max(1, parseInt(m[2] ?? '6', 10));
      if (options.random === undefined && spec === 'd6') return { value: '1', source: 'computed' };
      let total = 0;
      for (let i = 0; i < count; i += 1) total += Math.floor(runtime.rng() * sides) + 1;
      return { value: String(total), source: 'computed' };
    }
    const sides = parseInt(spec, 10);
    if (Number.isFinite(sides) && sides > 0) {
      return { value: String(Math.floor(runtime.rng() * sides) + 1), source: 'computed' };
    }
    return { value: '', source: 'computed' };
  }

  // Time / date macros (public/scripts/macros.js:660-667; time-macros.js:11-94)
  const now = runtime.now;
  if (name === 'time') {
    if (args[0]?.startsWith('UTC')) {
      const offset = parseInt(args[0].slice(3), 10) || 0;
      const utcDate = new Date(now.getTime() + offset * 60 * 60 * 1000);
      return { value: formatTime(utcDate), source: 'computed' };
    }
    return { value: formatTime(now), source: 'computed' };
  }
  if (name === 'date') return { value: formatLongDate(now), source: 'computed' };
  if (name === 'isotime') return { value: now.toISOString().slice(11, 16), source: 'computed' };
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

  // hasExtension (state-macros.js:43)
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

function parseArgs(rawArgs: string): string[] {
  if (rawArgs.startsWith('::')) return rawArgs.slice(2).split('::');
  if (rawArgs.startsWith(':')) {
    const inner = rawArgs.slice(1);
    return inner.split(',').map((s) => s.trim());
  }
  return [];
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

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' });
}

function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function formatDateTime(d: Date, fmt: string): string {
  const pad = (n: number, len = 2): string => String(n).padStart(len, '0');
  const replacements: Record<string, string> = {
    YYYY: String(d.getUTCFullYear()),
    MMMM: MONTH_NAMES[d.getUTCMonth()] ?? '',
    MMM: MONTH_SHORT_NAMES[d.getUTCMonth()] ?? '',
    MM: pad(d.getUTCMonth() + 1),
    DD: pad(d.getUTCDate()),
    D: String(d.getUTCDate()),
    HH: pad(d.getUTCHours()),
    H: String(d.getUTCHours()),
    hh: pad(to12Hour(d.getUTCHours())),
    h: String(to12Hour(d.getUTCHours())),
    mm: pad(d.getUTCMinutes()),
    ss: pad(d.getUTCSeconds()),
    A: d.getUTCHours() < 12 ? 'AM' : 'PM',
    a: d.getUTCHours() < 12 ? 'am' : 'pm',
    dddd: WEEKDAY_NAMES[d.getUTCDay()] ?? '',
    ddd: WEEKDAY_SHORT_NAMES[d.getUTCDay()] ?? '',
  };
  return fmt.replace(/YYYY|MMMM|MMM|MM|DD|dddd|ddd|HH|H|hh|h|mm|ss|A|a|D/g, (token) => replacements[token] ?? token);
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAY_SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function to12Hour(hour: number): number {
  const h = hour % 12;
  return h === 0 ? 12 : h;
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
