// Batch H: variables/control/math extras.
// Aligns with ST canonical commands in SillyTavern/public/scripts/variables.js:1183-2175
// plus text/token helpers in SillyTavern/public/scripts/slash-commands.js:2820-2984.

import type { STContextDeep, VariableScope } from './context-st.js';
import { SlashCommandClosure, type ScopeValue } from './stscript-st.js';
import { namedString, registerIfMissing, textValue, toBoolean, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

const MAX_LOOPS = 100;
const TOKEN_CHAR_RATIO = 3.35;

type MathOp = 'add' | 'sub' | 'mul' | 'div' | 'mod' | 'pow' | 'max' | 'min';

export function registerBatchH(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'incvar',
    aliases: ['incchatvar'],
    callback: (_args, value) => {
      // ST source: variables.js:1183-1211; implementation delegates to addLocalVariable(name, 1) at 196-198.
      const key = requireName(value, 'incvar');
      const next = addVariable(ctx.variables.local, key, 1);
      ctx.saveMetadataDebounced();
      return stringify(next);
    },
    returns: 'the new variable value',
  });

  registerIfMissing(registry, {
    name: 'decvar',
    aliases: ['decchatvar'],
    callback: (_args, value) => {
      // ST source: variables.js:1212-1240; implementation delegates to addLocalVariable(name, -1) at 204-206.
      const key = requireName(value, 'decvar');
      const next = addVariable(ctx.variables.local, key, -1);
      ctx.saveMetadataDebounced();
      return stringify(next);
    },
    returns: 'the new variable value',
  });

  registerIfMissing(registry, {
    name: 'incglobalvar',
    callback: (_args, value) => {
      // ST source: variables.js:1241-1268; implementation delegates to addGlobalVariable(name, 1) at 200-202.
      const key = requireName(value, 'incglobalvar');
      const next = addVariable(ctx.variables.global, key, 1);
      ctx.saveSettingsDebounced();
      return stringify(next);
    },
    returns: 'the new variable value',
  });

  registerIfMissing(registry, {
    name: 'decglobalvar',
    callback: (_args, value) => {
      // ST source: variables.js:1269-1296; implementation delegates to addGlobalVariable(name, -1) at 208-210.
      const key = requireName(value, 'decglobalvar');
      const next = addVariable(ctx.variables.global, key, -1);
      ctx.saveSettingsDebounced();
      return stringify(next);
    },
    returns: 'the new variable value',
  });

  registerIfMissing(registry, {
    name: 'times',
    splitUnnamedArgument: true,
    splitUnnamedArgumentCount: 1,
    callback: async (args, value) => {
      // ST source: variables.js:1488-1532; callback implementation at variables.js:350-381.
      const parsed = parseTimes(value);
      const count = Math.max(0, Math.floor(parsed.count));
      if (!Number.isFinite(count)) throw new Error('times requires a numeric repeat count');
      if (!parsed.command) throw new Error('times requires a command or closure');
      const guardOff = args.guard !== undefined && !toBoolean(args.guard);
      const iterations = Math.min(count, guardOff ? Number.MAX_SAFE_INTEGER : MAX_LOOPS);
      let result: ScopeValue = '';
      for (let index = 0; index < iterations; index += 1) {
        if (parsed.command instanceof SlashCommandClosure) {
          parsed.command.scope.variables.set('timesIndex', index);
          const closureResult = await parsed.command.executeDirect();
          result = closureResult.pipe;
          if (closureResult.isAborted || closureResult.isBreak) break;
        } else {
          const command = parsed.command.replaceAll('{{timesIndex}}', String(index));
          const executed = await ctx.slashCommandRegistry.execute(command);
          result = executed.output;
          if (!executed.ok) throw new Error(executed.outputs.find((entry) => !entry.ok)?.error ?? 'times command failed');
        }
      }
      return stringify(result);
    },
    returns: 'result of the last executed command',
  });

  registerMath(registry, ctx, 'add');
  registerMath(registry, ctx, 'sub');
  registerMath(registry, ctx, 'mul');
  registerMath(registry, ctx, 'div');
  registerMath(registry, ctx, 'mod');
  registerMath(registry, ctx, 'pow');
  registerMath(registry, ctx, 'max');
  registerMath(registry, ctx, 'min');

  registerUnaryMath(registry, ctx, 'abs', Math.abs);
  registerUnaryMath(registry, ctx, 'sqrt', Math.sqrt);
  registerUnaryMath(registry, ctx, 'round', Math.round);
  registerUnaryMath(registry, ctx, 'sin', Math.sin);
  registerUnaryMath(registry, ctx, 'cos', Math.cos);
  registerUnaryMath(registry, ctx, 'log', Math.log);

  registerIfMissing(registry, {
    name: 'sort',
    callback: (args, value) => {
      // ST source: variables.js:2076-2121; callback implementation at variables.js:790-814.
      const known = parseKnownArgs(args, value, ['keysort']);
      const parsed = parseJsonValue(known.text);
      if (!parsed.ok) return known.text;
      if (Array.isArray(parsed.value)) return JSON.stringify([...parsed.value].sort(compareMixed));
      if (isPlainRecord(parsed.value)) {
        const record = parsed.value;
        const keys = Object.keys(record);
        const byKey = known.args.keysort === undefined || toBoolean(known.args.keysort);
        keys.sort(byKey ? compareMixed : (a, b) => compareMixed(record[a], record[b]));
        return JSON.stringify(keys);
      }
      return JSON.stringify(parsed.value);
    },
    returns: 'the sorted list or dictionary keys',
  });

  registerIfMissing(registry, {
    name: 'rand',
    callback: (args, value) => {
      // ST source: variables.js:2122-2175; callback implementation at variables.js:767-780.
      const from = Number(args.from ?? args.min ?? 0);
      const to = Number(args.to ?? args.max ?? (textValue(value) ? value : 1));
      if (!Number.isFinite(from) || !Number.isFinite(to)) throw new Error('rand requires numeric from/to values');
      const raw = from + Math.random() * (to - from);
      const method = String(args.round ?? '').toLowerCase();
      if (method === 'round' || args.round === true) return String(Math.round(raw));
      if (method === 'ceil') return String(Math.ceil(raw));
      if (method === 'floor') return String(Math.floor(raw));
      return String(raw);
    },
    returns: 'random number',
  });

  registerIfMissing(registry, {
    name: 'trimtokens',
    callback: async (args, value) => {
      // ST source: slash-commands.js:2820-2856; callback implementation at slash-commands.js:3954-4000.
      const known = parseKnownArgs(args, value, ['limit', 'count', 'direction']);
      const text = known.text;
      if (!text) return '';
      const limit = Number(known.args.limit ?? known.args.count);
      if (!Number.isFinite(limit)) return text;
      if (limit <= 0) return '';
      const tokenCount = await ctx.getTokenCountAsync(text);
      if (Number(tokenCount) <= limit) return text;
      const charLimit = Math.floor(limit * TOKEN_CHAR_RATIO);
      const direction = String(known.args.direction ?? 'end').toLowerCase();
      return direction === 'start' ? text.slice(-charLimit) : text.slice(0, charLimit);
    },
    returns: 'trimmed text',
  });

  registerIfMissing(registry, {
    name: 'trimstart',
    callback: (_args, value) => {
      // ST source: slash-commands.js:2858-2879; callback uses utils.js:914-936.
      return trimToStartSentence(textValue(value));
    },
    returns: 'trimmed text',
  });

  registerIfMissing(registry, {
    name: 'trimend',
    callback: (_args, value) => {
      // ST source: slash-commands.js:2880-2890; callback uses utils.js:883-912.
      return trimToEndSentence(textValue(value));
    },
    returns: 'trimmed text',
  });

  registerIfMissing(registry, {
    name: 'tokens',
    callback: async (_args, value) => {
      // ST source: slash-commands.js:2971-2984.
      return String(await ctx.getTokenCountAsync(textValue(value)));
    },
    returns: 'number of tokens',
  });
}

function registerMath(registry: BatchSlashRegistry, ctx: STContextDeep, name: MathOp): void {
  registerIfMissing(registry, {
    name,
    splitUnnamedArgument: true,
    callback: (_args, value) => {
      // ST source: variables.js:1586-1868; callback implementations are variables.js:677-719.
      const values = parseNumericSeries(value, ctx);
      return String(mathResult(name, values));
    },
    returns: `${name} result`,
  });
}

function registerUnaryMath(registry: BatchSlashRegistry, ctx: STContextDeep, name: string, op: (value: number) => number): void {
  registerIfMissing(registry, {
    name,
    callback: (_args, value) => {
      // ST source: variables.js:1869-2037; callback implementations are variables.js:721-743.
      const first = parseNumericSeries(value, ctx)[0] ?? 0;
      const result = op(first);
      return String(Number.isNaN(result) ? 0 : result);
    },
    returns: `${name} result`,
  });
}

function mathResult(name: MathOp, values: number[]): number {
  if (values.length === 0) return 0;
  switch (name) {
    case 'add': return values.reduce((a, b) => a + b, 0);
    case 'mul': return values.reduce((a, b) => a * b, 1);
    case 'sub': return values.reduce((a, b) => a - b, values.shift() ?? 0);
    case 'div': return values[1] === 0 ? 0 : (values[0] ?? 0) / (values[1] ?? 1);
    case 'mod': return values[1] === 0 ? 0 : (values[0] ?? 0) % (values[1] ?? 1);
    case 'pow': return Math.pow(values[0] ?? 0, values[1] ?? 0);
    case 'max': return Math.max(...values);
    case 'min': return Math.min(...values);
    default: return 0;
  }
}

function requireName(value: ScopeValue, command: string): string {
  const key = textValue(value).trim();
  if (!key) throw new Error(`${command} requires a variable name`);
  return key;
}

function addVariable(target: VariableScope, key: string, increment: number): unknown {
  const current = target.get(key) ?? 0;
  const currentNumber = Number(current);
  const next = Number.isFinite(currentNumber) ? currentNumber + increment : increment;
  target.set(key, next);
  return next;
}

function parseTimes(value: ScopeValue): { count: number; command: string | SlashCommandClosure } {
  if (Array.isArray(value)) {
    const [countRaw, ...rest] = value;
    const first = rest[0];
    return { count: Number(countRaw), command: first instanceof SlashCommandClosure ? first : rest.map(stringify).join(' ').trim() };
  }
  if (value instanceof SlashCommandClosure) return { count: 0, command: value };
  const [countRaw = '', ...rest] = textValue(value).split(/\s+/u);
  return { count: Number(countRaw), command: rest.join(' ').trim() };
}

function parseNumericSeries(value: ScopeValue, ctx: STContextDeep): number[] {
  let values: unknown[];
  if (typeof value === 'number') values = [value];
  else if (Array.isArray(value)) values = value;
  else {
    const raw = textValue(value).trim();
    if (!raw) return [];
    const parsed = parseJsonValue(raw);
    values = parsed.ok && Array.isArray(parsed.value) ? parsed.value : raw.split(/\s+/u);
  }
  return values
    .flatMap((entry) => Array.isArray(entry) ? entry : [entry])
    .map((entry) => numericValue(entry, ctx))
    .filter((entry): entry is number => entry !== undefined);
}

function numericValue(value: unknown, ctx: STContextDeep): number | undefined {
  if (typeof value === 'number') return Number.isFinite(value) ? value : undefined;
  const text = String(value ?? '').trim();
  if (!text) return undefined;
  const direct = Number(text);
  if (Number.isFinite(direct)) return direct;
  const local = ctx.variables.local.get(text);
  const localNumber = Number(local);
  if (local !== undefined && Number.isFinite(localNumber)) return localNumber;
  const global = ctx.variables.global.get(text);
  const globalNumber = Number(global);
  if (global !== undefined && Number.isFinite(globalNumber)) return globalNumber;
  return undefined;
}

function parseJsonValue(value: ScopeValue): { ok: true; value: unknown } | { ok: false } {
  if (typeof value !== 'string') return { ok: true, value };
  try {
    return { ok: true, value: JSON.parse(value) as unknown };
  } catch {
    return { ok: false };
  }
}

function parseKnownArgs(
  args: Record<string, ScopeValue>,
  value: ScopeValue,
  known: readonly string[],
): { args: Record<string, ScopeValue>; text: string } {
  const parsedArgs: Record<string, ScopeValue> = { ...args };
  let text = textValue(value).trimStart();
  const knownSet = new Set(known);
  while (text.length > 0) {
    const match = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)=/u);
    if (!match) break;
    const key = match[1] ?? '';
    if (!knownSet.has(key)) break;
    const parsed = readArgValue(text, key.length + 1);
    parsedArgs[key] = parsed.value;
    text = text.slice(parsed.consumed).trimStart();
  }
  return { args: parsedArgs, text };
}

function readArgValue(input: string, start: number): { value: string; consumed: number } {
  const quote = input[start];
  if (quote === '"' || quote === "'") {
    let value = '';
    let index = start + 1;
    while (index < input.length) {
      const char = input[index] ?? '';
      if (char === '\\') {
        value += input[index + 1] ?? '';
        index += 2;
        continue;
      }
      if (char === quote) return { value, consumed: index + 1 };
      value += char;
      index += 1;
    }
    return { value, consumed: input.length };
  }
  const nextSpace = input.slice(start).search(/\s/u);
  const end = nextSpace === -1 ? input.length : start + nextSpace;
  return { value: input.slice(start, end), consumed: end };
}

function compareMixed(a: unknown, b: unknown): number {
  let left = a;
  let right = b;
  if (typeof left !== typeof right) {
    left = typeof left;
    right = typeof right;
  }
  const leftText = String(left);
  const rightText = String(right);
  return leftText > rightText ? 1 : leftText < rightText ? -1 : 0;
}

function trimToStartSentence(input: string): string {
  if (!input) return '';
  const indexes = [input.indexOf('.'), input.indexOf('!'), input.indexOf('?'), input.indexOf('\n')]
    .filter((index) => index > 0);
  if (indexes.length === 0) return input;
  const first = Math.min(...indexes);
  return input[first] === '\n' ? input.substring(first + 1) : input.substring(first + 2);
}

function trimToEndSentence(input: string): string {
  if (!input) return '';
  const punctuation = new Set(['.', '!', '?', '*', '"', ')', '}', '`', ']', '$', '。', '！', '？', '”', '）', '】', '’', '」', '_']);
  const characters = Array.from(input);
  for (let index = characters.length - 1; index >= 0; index -= 1) {
    const char = characters[index] ?? '';
    const emoji = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u.test(char);
    if (punctuation.has(char) || emoji) {
      const end = !emoji && index > 0 && /[\s\n]/u.test(characters[index - 1] ?? '') ? index - 1 : index;
      return characters.slice(0, end + 1).join('').trimEnd();
    }
  }
  return input.trimEnd();
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function stringify(value: ScopeValue): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
