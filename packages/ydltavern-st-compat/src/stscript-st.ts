// Deep port of SillyTavern STScript runtime primitives.
//
// References (read at port time):
//   public/scripts/slash-commands/SlashCommandScope.js — scope chain, getVariable, setVariable
//   public/scripts/slash-commands/SlashCommandClosure.js — closure execution, controllers
//   public/scripts/slash-commands/SlashCommandParser.js — parser flags, pipe rules
//   public/scripts/slash-commands/SlashCommand.js — command metadata schema
//
// This module exposes ST-faithful primitives the higher-level runtime can use.
// Pure logic, no DOM, no network, no DOM event coupling.

// ---------------------------------------------------------------------------
// Parser flags (SlashCommandParser.js:38-42)

export const PARSER_FLAG = {
  STRICT_ESCAPING: 'STRICT_ESCAPING',
  REPLACE_GETVAR: 'REPLACE_GETVAR',
} as const;
export type ParserFlag = (typeof PARSER_FLAG)[keyof typeof PARSER_FLAG];

export class ParserFlags {
  private flags = new Map<ParserFlag, boolean>();

  isOn(flag: ParserFlag): boolean {
    return this.flags.get(flag) === true;
  }

  set(flag: ParserFlag, on: boolean): void {
    this.flags.set(flag, on);
  }

  toggle(flag: ParserFlag): void {
    this.flags.set(flag, !this.isOn(flag));
  }

  clone(): ParserFlags {
    const f = new ParserFlags();
    for (const [k, v] of this.flags) f.flags.set(k, v);
    return f;
  }
}

// ---------------------------------------------------------------------------
// Argument types (SlashCommandArgument.js)

export const ARGUMENT_TYPE = {
  STRING: 'string',
  NUMBER: 'number',
  RANGE: 'range',
  BOOLEAN: 'boolean',
  VARIABLE_NAME: 'variableName',
  CLOSURE: 'closure',
  SUBCOMMAND: 'subcommand',
  LIST: 'list',
  DICTIONARY: 'dictionary',
} as const;
export type ArgumentType = (typeof ARGUMENT_TYPE)[keyof typeof ARGUMENT_TYPE];

// ---------------------------------------------------------------------------
// Error classes (SlashCommandParser.js + SlashCommandClosure.js)

export class SlashCommandParserError extends Error {
  index?: number;
  line?: number;
  column?: number;

  constructor(message: string, opts: { index?: number; line?: number; column?: number } = {}) {
    super(message);
    this.name = 'SlashCommandParserError';
    if (opts.index !== undefined) this.index = opts.index;
    if (opts.line !== undefined) this.line = opts.line;
    if (opts.column !== undefined) this.column = opts.column;
  }
}

export class SlashCommandExecutionError extends Error {
  command?: string;
  cause?: unknown;

  constructor(message: string, opts: { command?: string; cause?: unknown } = {}) {
    super(message);
    this.name = 'SlashCommandExecutionError';
    if (opts.command !== undefined) this.command = opts.command;
    if (opts.cause !== undefined) this.cause = opts.cause;
  }
}

export class SlashCommandAbortError extends Error {
  quiet: boolean;

  constructor(message: string, quiet = false) {
    super(message);
    this.name = 'SlashCommandAbortError';
    this.quiet = quiet;
  }
}

// ---------------------------------------------------------------------------
// SlashCommandScope deep port (SlashCommandScope.js:4-115)
//
// Key ST behaviors:
//   - getVariable(key) walks parent chain; numeric strings coerce to Number;
//     index option attempts JSON.parse and returns indexed slot; missing → ''
//   - setVariable(key, value) finds the nearest scope with the variable;
//     throws if not found anywhere
//   - letVariable(key, value) declares NEW in current scope; throws if exists
//   - pipe falls back to parent.pipe if local not set

export type ScopeValue = unknown;

export interface ScopeIndexOptions {
  index?: number | string;
  as?: 'string' | 'number' | 'bool' | 'list' | 'object';
}

export class SlashCommandScope {
  parent: SlashCommandScope | undefined;
  variables: Map<string, ScopeValue> = new Map();
  private _pipe: ScopeValue = undefined;
  private _pipeSet = false;

  constructor(parent?: SlashCommandScope) {
    this.parent = parent;
  }

  // pipe getter walks parent if not set locally
  get pipe(): ScopeValue {
    if (this._pipeSet) return this._pipe;
    if (this.parent) return this.parent.pipe;
    return undefined;
  }

  set pipe(value: ScopeValue) {
    this._pipe = value;
    this._pipeSet = true;
  }

  // letVariable: declare new in CURRENT scope; throw if already exists locally
  letVariable(key: string, value: ScopeValue = ''): void {
    if (this.variables.has(key)) {
      throw new SlashCommandExecutionError(`Variable already declared in scope: ${key}`);
    }
    this.variables.set(key, value);
  }

  // setVariable: find nearest scope with key, mutate; throw if absent everywhere
  setVariable(key: string, value: ScopeValue, options: ScopeIndexOptions = {}): void {
    const scope = this.findOwningScope(key);
    if (!scope) {
      throw new SlashCommandExecutionError(`Variable not declared: ${key}`);
    }
    if (options.index !== undefined) {
      const current = scope.variables.get(key);
      const parsed = tryJsonParse(current);
      if (Array.isArray(parsed) || (parsed && typeof parsed === 'object')) {
        const coerced = coerceValue(value, options.as);
        if (Array.isArray(parsed)) {
          const idx = typeof options.index === 'string' ? Number(options.index) : options.index;
          if (Number.isFinite(idx)) parsed[idx as number] = coerced;
        } else {
          (parsed as Record<string, unknown>)[String(options.index)] = coerced;
        }
        scope.variables.set(key, JSON.stringify(parsed));
      } else {
        scope.variables.set(key, value);
      }
      return;
    }
    scope.variables.set(key, value);
  }

  // getVariable: walk parent; numeric coerce; index → JSON.parse + slot lookup
  getVariable(key: string, options: ScopeIndexOptions = {}): ScopeValue {
    const scope = this.findOwningScope(key);
    if (!scope) return '';
    const raw = scope.variables.get(key);

    if (options.index !== undefined) {
      const parsed = tryJsonParse(raw);
      if (Array.isArray(parsed)) {
        const idx = typeof options.index === 'string' ? Number(options.index) : options.index;
        const slot = parsed[idx as number];
        return typeof slot === 'object' ? JSON.stringify(slot) : slot ?? '';
      }
      if (parsed && typeof parsed === 'object') {
        const slot = (parsed as Record<string, unknown>)[String(options.index)];
        return typeof slot === 'object' ? JSON.stringify(slot) : slot ?? '';
      }
      return '';
    }

    if (typeof raw === 'string') {
      const numericRe = /^-?\d+(\.\d+)?$/;
      if (numericRe.test(raw)) {
        const num = Number(raw);
        if (Number.isFinite(num)) return num;
      }
    }
    return raw;
  }

  hasVariable(key: string): boolean {
    return this.findOwningScope(key) !== undefined;
  }

  deleteVariable(key: string): void {
    const scope = this.findOwningScope(key);
    if (scope) scope.variables.delete(key);
  }

  private findOwningScope(key: string): SlashCommandScope | undefined {
    let s: SlashCommandScope | undefined = this;
    while (s) {
      if (s.variables.has(key)) return s;
      s = s.parent;
    }
    return undefined;
  }

  child(): SlashCommandScope {
    return new SlashCommandScope(this);
  }
}

function tryJsonParse(value: ScopeValue): unknown {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function coerceValue(value: ScopeValue, as?: ScopeIndexOptions['as']): unknown {
  if (as === undefined) return value;
  if (typeof value !== 'string') return value;
  switch (as) {
    case 'number': {
      const n = Number(value);
      return Number.isFinite(n) ? n : value;
    }
    case 'bool':
      return value === 'true' || value === '1';
    case 'list':
    case 'object':
      try { return JSON.parse(value); } catch { return value; }
    case 'string':
      return value;
    default:
      return value;
  }
}

// ---------------------------------------------------------------------------
// Controllers (SlashCommandClosure.js)

export class AbortController_ {
  private _aborted = false;
  private _reason: string | undefined;
  private _quiet = false;

  abort(reason?: string, quiet = false): void {
    this._aborted = true;
    this._reason = reason;
    this._quiet = quiet;
  }

  get aborted(): boolean { return this._aborted; }
  get reason(): string | undefined { return this._reason; }
  get quiet(): boolean { return this._quiet; }
}

export class BreakController {
  private _broken = false;
  private _value: ScopeValue = undefined;

  break(value?: ScopeValue): void {
    this._broken = true;
    this._value = value;
  }

  reset(): void {
    this._broken = false;
    this._value = undefined;
  }

  get broken(): boolean { return this._broken; }
  get value(): ScopeValue { return this._value; }
}

// ---------------------------------------------------------------------------
// SlashCommandClosure deep port (SlashCommandClosure.js)

export interface ClosureResult {
  pipe: ScopeValue;
  isBreak: boolean;
  isAborted: boolean;
  isQuietlyAborted: boolean;
  abortReason?: string;
}

export interface ClosureExecutorStep {
  // Caller-defined async step function operating on scope/abort/break.
  run(closure: SlashCommandClosure): Promise<void> | void;
}

export class SlashCommandClosure {
  scope: SlashCommandScope;
  argumentList: { name: string; defaultValue?: ScopeValue }[] = [];
  providedArgumentList: { name: string; value: ScopeValue }[] = [];
  executorList: ClosureExecutorStep[] = [];
  abortController: AbortController_ = new AbortController_();
  breakController: BreakController = new BreakController();
  rawText = '';
  fullText = '';
  executeNow = false;

  constructor(scope: SlashCommandScope) {
    this.scope = scope;
  }

  // ST cloned-then-executed pattern for re-entrancy safety.
  // Note: abort/break controllers are SHARED with the original so external
  // .abort()/.break() on the parent reference propagates into the running copy.
  getCopy(): SlashCommandClosure {
    const copy = new SlashCommandClosure(this.scope.child());
    copy.argumentList = [...this.argumentList];
    copy.providedArgumentList = [...this.providedArgumentList];
    copy.executorList = [...this.executorList];
    copy.abortController = this.abortController;
    copy.breakController = this.breakController;
    copy.rawText = this.rawText;
    copy.fullText = this.fullText;
    copy.executeNow = this.executeNow;
    return copy;
  }

  async executeDirect(): Promise<ClosureResult> {
    const work = this.getCopy();

    // Bind named args into local scope (let semantics).
    for (const arg of work.argumentList) {
      try {
        work.scope.letVariable(arg.name, arg.defaultValue ?? '');
      } catch {
        // already declared — ST tolerates this
      }
    }
    for (const arg of work.providedArgumentList) {
      // Provided args set on local scope (writes locally, not upward).
      work.scope.variables.set(arg.name, arg.value);
    }

    // Empty closure: pipe normalized to ''
    if (work.executorList.length === 0) {
      work.scope.pipe = '';
    }

    for (const step of work.executorList) {
      if (work.abortController.aborted) {
        return {
          pipe: work.scope.pipe,
          isBreak: false,
          isAborted: true,
          isQuietlyAborted: work.abortController.quiet,
          abortReason: work.abortController.reason,
        };
      }
      await step.run(work);
      if (work.breakController.broken) {
        return {
          pipe: work.breakController.value ?? work.scope.pipe,
          isBreak: true,
          isAborted: false,
          isQuietlyAborted: false,
        };
      }
      // Normalize pipe per ST #lintPipe semantics
      work.scope.pipe = lintPipeValue(work.scope.pipe);
    }

    return {
      pipe: work.scope.pipe,
      isBreak: false,
      isAborted: false,
      isQuietlyAborted: false,
    };
  }
}

// Port of #lintPipe (SlashCommandClosure.js): normalize pipe value type.
export function lintPipeValue(value: ScopeValue): ScopeValue {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (value instanceof SlashCommandClosure) return value;
  // Arrays/objects → JSON
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

// ---------------------------------------------------------------------------
// Pipe injection rules (SlashCommandParser.js / SlashCommandClosure.js)
//
// After each command:
//   - first `|` ends current command and sets injectPipe=true for next
//   - `||` ends current command but suppresses pipe injection for the next one
//   - inside `{{...}}` macro braces, `|` is NOT a separator
//
// `injectPipe` decision for next command:
//   - injectPipe defaults to true after each command
//   - `||` resets injectPipe to false for the next command only
//   - if next command has NO unnamed arg AND injectPipe=true, scope.pipe is injected

export interface PipeInjectionState {
  injectPipe: boolean;
}

export function shouldInjectPipe(
  state: PipeInjectionState,
  nextCommandHasUnnamedArg: boolean,
): boolean {
  return state.injectPipe && !nextCommandHasUnnamedArg;
}

export function consumePipeSeparator(
  state: PipeInjectionState,
  doublePipe: boolean,
): void {
  state.injectPipe = !doublePipe;
}

export function resetPipeState(state: PipeInjectionState): void {
  state.injectPipe = true;
}

// ---------------------------------------------------------------------------
// Comparison rules for /if and /while (variables.js:1298+)

export type CompareRule = 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'gte' | 'lt' | 'lte' | 'not';

export function compareValues(left: ScopeValue, right: ScopeValue, rule: CompareRule): boolean {
  switch (rule) {
    case 'eq':
      return loose(left) === loose(right);
    case 'neq':
      return loose(left) !== loose(right);
    case 'in':
      return String(left).includes(String(right));
    case 'nin':
      return !String(left).includes(String(right));
    case 'gt':
      return Number(left) > Number(right);
    case 'gte':
      return Number(left) >= Number(right);
    case 'lt':
      return Number(left) < Number(right);
    case 'lte':
      return Number(left) <= Number(right);
    case 'not':
      return !loose(left);
    default:
      return false;
  }
}

function loose(value: ScopeValue): unknown {
  if (typeof value === 'string') {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Variable command semantics (variables.js)
//
// These are pure-function semantics for the variable command set. They do not
// register slash commands themselves — that's higher-level wiring.

export class GlobalVariables {
  private store = new Map<string, ScopeValue>();

  get(key: string): ScopeValue { return this.store.get(key) ?? ''; }
  set(key: string, value: ScopeValue): void { this.store.set(key, value); }
  has(key: string): boolean { return this.store.has(key); }
  delete(key: string): void { this.store.delete(key); }
  add(key: string, value: ScopeValue): void {
    const current = this.store.get(key);
    if (typeof current === 'number' && typeof value === 'number') {
      this.store.set(key, current + value);
    } else {
      this.store.set(key, String(current ?? '') + String(value));
    }
  }
  inc(key: string): void {
    const n = Number(this.store.get(key) ?? 0);
    this.store.set(key, Number.isFinite(n) ? n + 1 : 1);
  }
  dec(key: string): void {
    const n = Number(this.store.get(key) ?? 0);
    this.store.set(key, Number.isFinite(n) ? n - 1 : -1);
  }
  list(): Record<string, ScopeValue> {
    const out: Record<string, ScopeValue> = {};
    for (const [k, v] of this.store) out[k] = v;
    return out;
  }
}

// ---------------------------------------------------------------------------
// SlashCommand metadata schema (SlashCommand.js)

export interface NamedArgumentDef {
  name: string;
  description?: string;
  typeList?: ArgumentType[];
  isRequired?: boolean;
  acceptsMultiple?: boolean;
  defaultValue?: ScopeValue;
  enumList?: string[];
  enumProvider?: () => string[];
  forceEnum?: boolean;
  aliasList?: string[];
}

export interface UnnamedArgumentDef {
  description?: string;
  typeList?: ArgumentType[];
  isRequired?: boolean;
  acceptsMultiple?: boolean;
  defaultValue?: ScopeValue;
  enumList?: string[];
  enumProvider?: () => string[];
  forceEnum?: boolean;
}

export interface SlashCommandDef {
  name: string;
  callback: (args: Record<string, ScopeValue>, value: ScopeValue) => Promise<ScopeValue> | ScopeValue;
  helpString?: string;
  splitUnnamedArgument?: boolean;
  splitUnnamedArgumentCount?: number;
  rawQuotes?: boolean;
  aliases?: string[];
  returns?: string;
  namedArgumentList?: NamedArgumentDef[];
  unnamedArgumentList?: UnnamedArgumentDef[];
}

export interface SlashCommandExecution {
  readonly name: string;
  readonly ok: boolean;
  readonly text: string;
  readonly error?: string;
}

export interface ExecuteSlashCommandsDeepResult {
  readonly ok: boolean;
  readonly input: string;
  readonly output: string;
  readonly outputs: readonly SlashCommandExecution[];
}

export class SlashCommandRegistry {
  private commands = new Map<string, SlashCommandDef>();
  private aliases = new Map<string, string>();

  register(def: SlashCommandDef): void {
    if (this.commands.has(def.name)) {
      throw new SlashCommandParserError(`Command already registered: /${def.name}`);
    }
    this.commands.set(def.name, def);
    for (const alias of def.aliases ?? []) {
      this.aliases.set(alias, def.name);
    }
  }

  get(name: string): SlashCommandDef | undefined {
    const real = this.aliases.get(name) ?? name;
    return this.commands.get(real);
  }

  has(name: string): boolean {
    return this.commands.has(name) || this.aliases.has(name);
  }

  list(): SlashCommandDef[] {
    return [...this.commands.values()];
  }

  resolveAlias(name: string): string {
    return this.aliases.get(name) ?? name;
  }

  async execute(input: string): Promise<ExecuteSlashCommandsDeepResult> {
    const outputs: SlashCommandExecution[] = [];
    let ok = true;
    for (const command of parseSlashCommandLines(input)) {
      const def = this.get(command.name);
      if (!def) {
        ok = false;
        outputs.push({ name: command.name, ok: false, text: '', error: `Unknown slash command: /${command.name}` });
        continue;
      }
      try {
        const value = await def.callback(command.namedArgs, command.unnamed);
        outputs.push({ name: def.name, ok: true, text: String(value ?? '') });
      } catch (error) {
        ok = false;
        outputs.push({ name: def.name, ok: false, text: '', error: error instanceof Error ? error.message : String(error) });
      }
    }
    return {
      ok,
      input,
      output: outputs.map((entry) => entry.text).filter((text) => text.length > 0).join('\n'),
      outputs,
    };
  }
}

interface ParsedSlashCommandLine {
  readonly name: string;
  readonly namedArgs: Record<string, ScopeValue>;
  readonly unnamed: string;
}

function parseSlashCommandLines(input: string): ParsedSlashCommandLine[] {
  return input
    .split(/[\n;]/u)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('/'))
    .map(parseSlashCommandLine)
    .filter((line): line is ParsedSlashCommandLine => line !== undefined);
}

function parseSlashCommandLine(line: string): ParsedSlashCommandLine | undefined {
  const withoutSlash = line.slice(1).trimStart();
  if (!withoutSlash) return undefined;
  const match = withoutSlash.match(/^(\S+)(?:\s+([\s\S]*))?$/u);
  if (!match) return undefined;
  const name = String(match[1] ?? '').toLowerCase();
  let rest = match[2] ?? '';
  const namedArgs: Record<string, ScopeValue> = {};

  while (rest.length > 0) {
    const parsed = readNamedArgument(rest);
    if (!parsed) break;
    if (parsed.value === '' && parsed.consumed < rest.length && /\s/u.test(rest[parsed.consumed] ?? '')) break;
    if (!looksLikeCommandNamedArgument(rest, parsed.consumed)) break;
    namedArgs[parsed.key] = parsed.value;
    rest = rest.slice(parsed.consumed).trimStart();
  }

  return { name, namedArgs, unnamed: unquote(rest) };
}

function readNamedArgument(input: string): { key: string; value: string; consumed: number } | undefined {
  const eq = input.indexOf('=');
  if (eq <= 0) return undefined;
  const key = input.slice(0, eq);
  if (/\s/u.test(key) || key.length === 0 || !/^[A-Za-z_][A-Za-z0-9_-]*$/u.test(key)) return undefined;
  const valueStart = eq + 1;
  const first = input[valueStart];
  if (first === '"' || first === "'") {
    let value = '';
    let index = valueStart + 1;
    while (index < input.length) {
      const char = input[index] ?? '';
      if (char === '\\') {
        value += input[index + 1] ?? '';
        index += 2;
        continue;
      }
      if (char === first) return { key, value, consumed: index + 1 };
      value += char;
      index += 1;
    }
    return { key, value, consumed: input.length };
  }

  const nextSpace = input.slice(valueStart).search(/\s/u);
  const end = nextSpace === -1 ? input.length : valueStart + nextSpace;
  return { key, value: input.slice(valueStart, end), consumed: end };
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && ((trimmed[0] === '"' && trimmed.at(-1) === '"') || (trimmed[0] === "'" && trimmed.at(-1) === "'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function looksLikeCommandNamedArgument(input: string, consumed: number): boolean {
  const suffix = input.slice(consumed).trimStart();
  if (suffix.length === 0) return true;
  const nextEquals = suffix.indexOf('=');
  const nextSpace = suffix.search(/\s/u);
  return nextEquals > 0 && (nextSpace === -1 || nextEquals < nextSpace);
}
