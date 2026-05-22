import type { STContextDeep, VariableScope } from './context-st.js';
import { SlashCommandClosure, SlashCommandScope, type ScopeValue } from './stscript-st.js';
import { namedString, registerIfMissing, textValue, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type VarScopeName = 'local' | 'global';
type ListScopeName = VarScopeName | 'all';

const SPECIAL_ARGUMENTS = new Set(['key', 'name', 'value', 'scope', 'return', 'index', 'as']);

export function registerBatchC(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'addvar',
    aliases: ['addchatvar'],
    callback: (args, value) => {
      // ST source: public/scripts/variables.js:1027-1059 registers /addvar;
      // add semantics are in variables.js:136-164 (numeric sum, string concat, array append).
      const parsed = parseVariableAssignment(args, value, { allowScope: true });
      const scopeName = parsed.scope === 'global' ? 'global' : 'local';
      const result = addVariable(scope(ctx, scopeName), parsed.key, parsed.value);
      persistScope(ctx, scopeName);
      return stringifyVariable(result);
    },
    returns: 'the new variable value',
  });

  registerIfMissing(registry, {
    name: 'flushvar',
    aliases: ['flushchatvar'],
    callback: (_args, value) => {
      // ST source: variables.js:1534-1558 registers /flushvar; variables.js:592-600 deletes one local var.
      // Frontier R2 requests no-arg /flushvar to clear all local vars; a supplied name keeps ST delete-one behavior.
      const key = parseOptionalVariableName(_args, value);
      if (key) ctx.variables.local.del(key);
      else clearScope(ctx.variables.local);
      ctx.saveMetadataDebounced();
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'flushglobalvar',
    callback: (_args, value) => {
      // ST source: variables.js:1560-1585 registers /flushglobalvar; variables.js:608-616 deletes one global var.
      // Frontier R2 requests no-arg /flushglobalvar to clear all global vars; a supplied name keeps ST delete-one behavior.
      const key = parseOptionalVariableName(_args, value);
      if (key) ctx.variables.global.del(key);
      else clearScope(ctx.variables.global);
      ctx.saveSettingsDebounced();
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'listvar',
    aliases: ['listchatvar'],
    callback: (args, value) => {
      // ST source: variables.js:904-932 registers /listvar; variables.js:263-296 builds local/global listings.
      const selectedScope = parseListScope(args, value);
      const entries = listVariables(ctx, selectedScope);
      const returnMode = (namedString(args, 'return') ?? '').trim().toLowerCase();
      if (returnMode === 'json' || returnMode === 'object') return JSON.stringify(entries);
      if (entries.length === 0) return 'No variables';
      return entries.map((entry) => `${entry.scope}.${entry.key}: ${stringifyVariable(entry.value)}`).join('\n');
    },
    returns: 'variable names and values',
  });

  registerIfMissing(registry, {
    name: 'globalsetvar',
    aliases: ['setglobalvar'],
    callback: (args, value) => {
      // ST canonical command is /setglobalvar, not /globalsetvar: variables.js:1061-1107.
      // Setter semantics are in variables.js:105-133.
      const parsed = parseVariableAssignment(args, value);
      ctx.variables.global.set(parsed.key, parsed.value);
      ctx.saveSettingsDebounced();
      return stringifyVariable(parsed.value);
    },
    returns: 'the set global variable value',
  });

  registerIfMissing(registry, {
    name: 'globalgetvar',
    aliases: ['getglobalvar'],
    callback: (args, value) => {
      // ST canonical command is /getglobalvar, not /globalgetvar: variables.js:1109-1149.
      // Getter semantics are in variables.js:83-103.
      const key = parseVariableName(args, value);
      return stringifyVariable(ctx.variables.global.get(key) ?? '');
    },
    returns: 'global variable value',
  });

  registerIfMissing(registry, {
    name: 'globaladdvar',
    aliases: ['addglobalvar'],
    callback: (args, value) => {
      // ST canonical command is /addglobalvar, not /globaladdvar: variables.js:1151-1182.
      // Add semantics are in variables.js:166-193.
      const parsed = parseVariableAssignment(args, value);
      const result = addVariable(ctx.variables.global, parsed.key, parsed.value);
      ctx.saveSettingsDebounced();
      return stringifyVariable(result);
    },
    returns: 'the new global variable value',
  });

  registerIfMissing(registry, {
    name: 'closure-serialize',
    callback: (_args, value) => {
      // ST source: variables.js:883-888 serializes SlashCommandClosure.rawText;
      // registration is variables.js:2288-2317.
      if (value instanceof SlashCommandClosure) return value.rawText || value.fullText;
      const source = textValue(value).trim();
      if (!source) throw new Error('unnamed argument must be a closure');
      return source;
    },
    returns: 'serialized closure as string',
  });

  registerIfMissing(registry, {
    name: 'closure-deserialize',
    callback: (_args, value) => {
      // ST source: variables.js:895-900 parses text into a SlashCommandClosure;
      // registration is variables.js:2318-2347. Offline limitation: this stores the source text only and does not
      // rehydrate executor AST/captured complex scope values, so execution of deserialized closures is unsupported here.
      const source = textValue(value).trim();
      if (!source) throw new Error('serialized closure cannot be empty');
      const closure = new SlashCommandClosure(new SlashCommandScope());
      closure.rawText = source;
      closure.fullText = source;
      return closure;
    },
    returns: 'deserialized closure',
  });

  registerIfMissing(registry, {
    name: 'pass',
    aliases: ['noop', 'return'],
    callback: (_args, value) => {
      // ST source: slash-commands.js:2449-2463 registers /pass with alias /return.
      // /noop is a Frontier R2 compatibility alias; no exact ST /noop slash registration was found.
      return textValue(value);
    },
    returns: 'the provided value',
  });

  registerIfMissing(registry, {
    name: 'yes',
    callback: () => {
      // Frontier R2 helper constant. No exact ST /yes slash registration was found in slash-commands.js or variables.js.
      return 'yes';
    },
    returns: 'yes',
  });

  registerIfMissing(registry, {
    name: 'no',
    callback: () => {
      // Frontier R2 helper constant. No exact ST /no slash registration was found in slash-commands.js or variables.js.
      return 'no';
    },
    returns: 'no',
  });
}

function scope(ctx: STContextDeep, name: VarScopeName): VariableScope {
  return name === 'global' ? ctx.variables.global : ctx.variables.local;
}

function persistScope(ctx: STContextDeep, name: VarScopeName): void {
  if (name === 'global') ctx.saveSettingsDebounced();
  else ctx.saveMetadataDebounced();
}

function clearScope(target: VariableScope): void {
  for (const key of Object.keys(target.list())) target.del(key);
}

function listVariables(ctx: STContextDeep, selectedScope: ListScopeName): { key: string; value: unknown; scope: VarScopeName }[] {
  const out: { key: string; value: unknown; scope: VarScopeName }[] = [];
  if (selectedScope === 'all' || selectedScope === 'local') {
    for (const [key, value] of Object.entries(ctx.variables.local.list())) out.push({ key, value, scope: 'local' });
  }
  if (selectedScope === 'all' || selectedScope === 'global') {
    for (const [key, value] of Object.entries(ctx.variables.global.list())) out.push({ key, value, scope: 'global' });
  }
  return out;
}

function addVariable(target: VariableScope, key: string, value: ScopeValue): ScopeValue {
  if (!key) throw new Error('Variable name cannot be empty or undefined.');
  const current = target.get(key);
  const parsedArray = parseArray(current);
  if (parsedArray) {
    parsedArray.push(value);
    const next = JSON.stringify(parsedArray);
    target.set(key, next);
    return next;
  }

  const currentNumber = toFiniteNumber(current ?? 0);
  const increment = toFiniteNumber(value);
  if (currentNumber !== undefined && increment !== undefined) {
    const next = currentNumber + increment;
    target.set(key, next);
    return next;
  }

  const next = `${current === undefined || current === null ? '' : String(current)}${String(value ?? '')}`;
  target.set(key, next);
  return next;
}

function parseArray(value: ScopeValue): unknown[] | undefined {
  if (Array.isArray(value)) return [...value];
  if (typeof value !== 'string' || !value.trim().startsWith('[')) return undefined;
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function toFiniteNumber(value: ScopeValue): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function stringifyVariable(value: ScopeValue): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function parseVariableAssignment(
  args: Record<string, ScopeValue>,
  value: ScopeValue,
  options: { allowScope?: boolean } = {},
): { key: string; value: ScopeValue; scope?: VarScopeName } {
  const direct = firstDirectAssignment(args);
  const raw = textValue(value).trim();
  const scopeFromArgs = normalizeVarScope(namedString(args, 'scope'));
  if (direct) {
    const scoped = options.allowScope ? splitTrailingScope(String(direct.value), scopeFromArgs) : { value: direct.value, scope: scopeFromArgs };
    return validateAssignment(direct.key, scoped.value, scoped.scope);
  }

  const namedKey = namedString(args, 'key') ?? namedString(args, 'name');
  if (namedKey !== undefined) {
    const rawValue = args.value ?? raw;
    const scoped = options.allowScope ? splitTrailingScope(String(rawValue ?? ''), scopeFromArgs) : { value: rawValue, scope: scopeFromArgs };
    return validateAssignment(namedKey, scoped.value, scoped.scope);
  }

  const rawParsed = parseRawAssignment(raw, options.allowScope === true, scopeFromArgs);
  return validateAssignment(rawParsed.key, rawParsed.value, rawParsed.scope);
}

function validateAssignment(key: string, value: ScopeValue, selectedScope?: VarScopeName): { key: string; value: ScopeValue; scope?: VarScopeName } {
  const trimmedKey = key.trim();
  if (!trimmedKey) throw new Error('Variable name cannot be empty or undefined.');
  if (value === undefined || value === null || String(value) === '') throw new Error(`Expected value for variable: ${trimmedKey}`);
  return { key: trimmedKey, value, scope: selectedScope };
}

function firstDirectAssignment(args: Record<string, ScopeValue>): { key: string; value: ScopeValue } | undefined {
  for (const [key, value] of Object.entries(args)) {
    if (!SPECIAL_ARGUMENTS.has(key)) return { key, value };
  }
  return undefined;
}

function parseRawAssignment(raw: string, allowScope: boolean, scopeFromArgs?: VarScopeName): { key: string; value: ScopeValue; scope?: VarScopeName } {
  if (!raw) throw new Error('Variable name cannot be empty or undefined.');

  const keyToken = raw.match(/^(key|name)=([^\s]+)(?:\s+([\s\S]*))?$/u);
  if (keyToken) {
    const scoped = allowScope ? splitTrailingScope(keyToken[3] ?? '', scopeFromArgs) : { value: keyToken[3] ?? '', scope: scopeFromArgs };
    return { key: keyToken[2] ?? '', value: scoped.value, scope: scoped.scope };
  }

  const assignment = raw.match(/^([^\s=]+)=([\s\S]*)$/u);
  if (assignment) {
    const scoped = allowScope ? splitTrailingScope(assignment[2] ?? '', scopeFromArgs) : { value: assignment[2] ?? '', scope: scopeFromArgs };
    return { key: assignment[1] ?? '', value: scoped.value, scope: scoped.scope };
  }

  const [key = '', ...rest] = raw.split(/\s+/u);
  const scoped = allowScope ? splitTrailingScope(rest.join(' '), scopeFromArgs) : { value: rest.join(' '), scope: scopeFromArgs };
  return { key, value: scoped.value, scope: scoped.scope };
}

function splitTrailingScope(value: string, scopeFromArgs?: VarScopeName): { value: string; scope?: VarScopeName } {
  const trimmed = value.trim();
  const parts = trimmed.split(/\s+/u);
  const last = normalizeVarScope(parts.at(-1));
  if (last && parts.length > 1) return { value: parts.slice(0, -1).join(' '), scope: scopeFromArgs ?? last };
  return { value: trimmed, scope: scopeFromArgs };
}

function parseVariableName(args: Record<string, ScopeValue>, value: ScopeValue): string {
  const key = parseOptionalVariableName(args, value);
  if (!key) throw new Error('Variable name cannot be empty or undefined.');
  return key;
}

function parseOptionalVariableName(args: Record<string, ScopeValue>, value: ScopeValue): string {
  const direct = firstDirectAssignment(args);
  const raw = textValue(value).trim();
  const candidate = namedString(args, 'key') ?? namedString(args, 'name') ?? direct?.key ?? raw;
  const match = candidate.match(/^(?:key|name)=([^\s]+)$/u);
  return (match?.[1] ?? candidate).trim();
}

function parseListScope(args: Record<string, ScopeValue>, value: ScopeValue): ListScopeName {
  const fromArgs = normalizeListScope(namedString(args, 'scope'));
  if (fromArgs) return fromArgs;
  const raw = textValue(value).trim().toLowerCase();
  return normalizeListScope(raw) ?? 'all';
}

function normalizeVarScope(value: ScopeValue): VarScopeName | undefined {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'local' || normalized === 'global' ? normalized : undefined;
}

function normalizeListScope(value: ScopeValue): ListScopeName | undefined {
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'local' || normalized === 'global' || normalized === 'all' ? normalized : undefined;
}
