import type { STContext, STGenerateResult } from './context.js';
import type { STScriptArgument, STScriptClosure, STScriptClosureArgument, STScriptCommandNode } from './stscript/index.js';
import { evaluateSTScript, parseSTScript, createSTScriptState, type STScriptState } from './stscript/index.js';

export interface SlashCommandInvocation {
  readonly name: string;
  readonly args: string;
  readonly argv: readonly string[];
  readonly namedArgs: Readonly<Record<string, string>>;
  readonly raw: string;
  readonly context: STContext;
  readonly variables: Map<string, string>;
  readonly state: STScriptState;
}

export type SlashCommandCallback = (invocation: SlashCommandInvocation) => SlashCommandCallbackResult;
export type SlashCommandCallbackResult = string | SlashCommandResult;

export interface SlashCommandResult {
  readonly ok: boolean;
  readonly output: string;
  readonly diagnostics?: readonly SlashDiagnostic[];
}

export interface SlashDiagnostic {
  readonly code: string;
  readonly message: string;
  readonly command?: string;
}

export interface SlashCommandArgumentMetadata {
  readonly name: string;
  readonly description?: string;
  readonly required?: boolean;
}

export interface SlashCommandMetadata {
  readonly aliases?: readonly string[];
  readonly help?: string;
  readonly returns?: string;
  readonly namedArgs?: readonly SlashCommandArgumentMetadata[];
  readonly unnamedArgs?: readonly SlashCommandArgumentMetadata[];
}

export interface SlashCommandDescriptor {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly help?: string;
  readonly returns?: string;
  readonly namedArgs?: readonly SlashCommandArgumentMetadata[];
  readonly unnamedArgs?: readonly SlashCommandArgumentMetadata[];
}

export interface ExecuteSlashCommandsOptions {
  readonly stopOnError?: boolean;
  readonly state?: STScriptState;
}

export interface SlashCommandExecution {
  readonly name: string;
  readonly raw: string;
  readonly ok: boolean;
  readonly output: string;
  readonly diagnostics: readonly SlashDiagnostic[];
}

export interface ExecuteSlashCommandsResult {
  readonly ok: boolean;
  readonly input: string;
  readonly output: string;
  readonly executions: readonly SlashCommandExecution[];
  readonly diagnostics: readonly SlashDiagnostic[];
  readonly variables: Readonly<Record<string, string>>;
  readonly state: STScriptState;
}

export interface SlashHost {
  readonly variables: Map<string, string>;
  readonly diagnostics: readonly SlashDiagnostic[];
  readonly slashCommands: () => readonly SlashCommandDescriptor[];
  readonly registerSlashCommand: (
    name: string,
    callback: SlashCommandCallback,
    aliasesOrMetadata?: readonly string[] | SlashCommandMetadata,
  ) => void;
  readonly executeSlashCommands: (input: string, options?: ExecuteSlashCommandsOptions) => ExecuteSlashCommandsResult;
}

interface RegisteredSlashCommand {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly metadata: SlashCommandMetadata;
  readonly callback: SlashCommandCallback;
}

export function createSlashHost(getContext: () => STContext, variables: Map<string, string> = new Map()): SlashHost {
  const registry = new Map<string, RegisteredSlashCommand>();
  const diagnostics: SlashDiagnostic[] = [];
  const rootState = createSTScriptState({ globalVariables: variables });

  const registerSlashCommand = (
    name: string,
    callback: SlashCommandCallback,
    aliasesOrMetadata: readonly string[] | SlashCommandMetadata = [],
  ): void => {
    const metadata: SlashCommandMetadata = isAliasList(aliasesOrMetadata) ? { aliases: aliasesOrMetadata } : aliasesOrMetadata;
    const normalizedName = normalizeCommandName(name);
    const normalizedAliases = (metadata.aliases ?? []).map(normalizeCommandName).filter((alias) => alias.length > 0 && alias !== normalizedName);
    if (normalizedName.length === 0) {
      throw new Error('Slash command name must not be empty.');
    }

    const command: RegisteredSlashCommand = { name: normalizedName, aliases: normalizedAliases, metadata, callback };
    registry.set(normalizedName, command);
    for (const alias of normalizedAliases) {
      registry.set(alias, command);
    }
  };

  const slashCommands = (): readonly SlashCommandDescriptor[] => {
    const unique = new Map<string, SlashCommandDescriptor>();
    for (const command of registry.values()) {
      unique.set(command.name, {
        name: command.name,
        aliases: command.aliases,
        help: command.metadata.help,
        returns: command.metadata.returns,
        namedArgs: command.metadata.namedArgs,
        unnamedArgs: command.metadata.unnamedArgs,
      });
    }

    return [...unique.values()].sort((left, right) => left.name.localeCompare(right.name));
  };

  const host: SlashHost = {
    variables,
    diagnostics,
    slashCommands,
    registerSlashCommand,
    executeSlashCommands: (input, options = {}) => {
      const state = options.state ?? rootState;
      const result = evaluateSTScript(input, runtimeHost, getContext(), state, options);
      diagnostics.push(...result.diagnostics);
      return result;
    },
  };

  const runtimeHost = {
    variables,
    invokeSTScriptCommand: (command: STScriptCommandNode, context: STContext, state: STScriptState) => {
      const registered = registry.get(command.name);
      if (registered === undefined) {
        const diagnostic = makeDiagnostic('unknown-command', `Unknown slash command: /${command.name}`, command.name);
        return { name: command.name, raw: command.raw, ok: false, output: '', diagnostics: [diagnostic] };
      }

      const result = normalizeCallbackResult(
        registered.callback({
          name: registered.name,
          args: command.rawArgs,
          argv: command.args.filter(isTextArgument).map((argument) => argument.value),
          namedArgs: Object.fromEntries(command.args.filter(isNamedArgument).map((argument) => [argument.key, argument.value])),
          raw: command.raw,
          context,
          variables,
          state,
        }),
      );
      const resultDiagnostics = result.diagnostics ?? [];
      return { name: registered.name, raw: command.raw, ok: result.ok, output: result.output, diagnostics: resultDiagnostics };
    },
  };

  registerBuiltInCommands(host);

  return host;
}

function registerBuiltInCommands(host: SlashHost): void {
  host.registerSlashCommand('gen', ({ args, context }) => generatedText(context.Generate({ text: args })), {
    help: 'Generate a message from text.',
    returns: 'generated text',
  });
  host.registerSlashCommand('continue', ({ context }) => generatedText(context.Generate({ text: '[ydltavern fake continue]' })));
  host.registerSlashCommand('swipe', ({ context }) => generatedText(context.Generate({ text: '[ydltavern fake swipe]' })));
  host.registerSlashCommand('setvar', ({ args, state }) => setVariable(args, state, 'global'));
  host.registerSlashCommand('getvar', ({ args, state }) => state.getVariable(args.trim()) ?? '');
  host.registerSlashCommand('if', ({ args, context, state }) => executeIfCommand(args, context, state));
  host.registerSlashCommand('run', ({ argv, args, context, state }) => executeRunCommand(argv, args, context, state));
  host.registerSlashCommand('let', ({ args, state }) => setVariable(args, state, 'local'));
  host.registerSlashCommand('var', ({ args, state }) => setVariable(args, state, 'global'));
  host.registerSlashCommand('while', ({ argv, args, namedArgs, context, state }) => executeWhileCommand(argv, args, namedArgs, context, state));
  host.registerSlashCommand('break', ({ state }) => {
    state.breakRequested = true;
    return '';
  });
}

function generatedText(result: STGenerateResult): string {
  return result.message.mes ?? '';
}

function setVariable(args: string, state: STScriptState, scope: 'local' | 'global'): SlashCommandResult {
  const parsed = parseSetVariable(args);
  if (parsed === undefined) {
    return {
      ok: false,
      output: '',
      diagnostics: [makeDiagnostic(`invalid-${scope === 'local' ? 'let' : 'setvar'}`, `Expected /${scope === 'local' ? 'let' : 'setvar'} name=value or name value.`, scope === 'local' ? 'let' : 'setvar')],
    };
  }

  if (looksLikeClosure(parsed.value)) {
    const closure = parseInlineClosure(parsed.value);
    if (closure !== undefined) {
      if (scope === 'local') {
        state.setLocalClosure(parsed.name, closure);
      } else {
        state.setGlobalClosure(parsed.name, closure);
      }
      return { ok: true, output: '' };
    }
  }

  if (scope === 'local') {
    state.setLocalVariable(parsed.name, parsed.value);
  } else {
    state.setGlobalVariable(parsed.name, parsed.value);
  }
  return { ok: true, output: parsed.value };
}

function executeIfCommand(args: string, context: STContext, state: STScriptState): SlashCommandResult {
  const parsed = parseIfArgs(args);
  if (parsed === undefined) {
    return {
      ok: false,
      output: '',
      diagnostics: [makeDiagnostic('invalid-if', 'Expected /if left == right then ... else ...', 'if')],
    };
  }

  const left = resolveOperand(parsed.left, state);
  const right = resolveOperand(parsed.right, state);
  const selected = left === right ? parsed.thenCommand : parsed.elseCommand;
  if (selected === undefined || selected.length === 0) {
    return { ok: true, output: '' };
  }

  if (!selected.startsWith('/')) {
    return { ok: true, output: selected };
  }

  const nested = context.executeSlashCommands(selected, { state });
  return { ok: nested.ok, output: nested.output, diagnostics: nested.diagnostics };
}

function executeRunCommand(argv: readonly string[], args: string, context: STContext, state: STScriptState): SlashCommandResult {
  const target = argv[0];
  const inline = parseInlineClosure(args.trim());
  const closure = inline ?? (target === undefined ? undefined : state.getClosure(target));
  if (closure === undefined) {
    return {
      ok: false,
      output: '',
      diagnostics: [makeDiagnostic('unknown-run-target', `Unknown /run target: ${args.trim() || '<empty>'}`, 'run')],
    };
  }

  const child = state.createChild();
  child.pipe = state.pipe;
  const nested = context.executeSlashCommands(closure.body, { state: child });
  state.pipe = nested.state.pipe;
  if (nested.state.breakRequested) {
    state.breakRequested = true;
  }
  return { ok: nested.ok, output: nested.output, diagnostics: nested.diagnostics };
}

function executeWhileCommand(
  argv: readonly string[],
  args: string,
  namedArgs: Readonly<Record<string, string>>,
  context: STContext,
  state: STScriptState,
): SlashCommandResult {
  const closure = firstInlineClosure(args) ?? parseInlineClosure(argv.at(-1) ?? '');
  const maxIterations = parsePositiveInt(namedArgs.maxIterations ?? namedArgs.max ?? '', state.maxIterations);
  if (closure === undefined) {
    return { ok: false, output: '', diagnostics: [makeDiagnostic('invalid-while', 'Expected /while condition { ... }.', 'while')] };
  }

  const condition = argv.filter((value) => !looksLikeClosure(value) && !value.startsWith('max=') && !value.startsWith('maxIterations=')).join(' ').trim();
  const outputs: string[] = [];
  const diagnostics: SlashDiagnostic[] = [];
  let ok = true;

  for (let index = 0; index < maxIterations; index += 1) {
    if (!truthy(resolveCondition(condition, state))) {
      return { ok, output: outputs.join('\n'), diagnostics };
    }

    const child = state.createChild();
    child.pipe = state.pipe;
    const nested = context.executeSlashCommands(closure.body, { state: child });
    outputs.push(nested.output);
    diagnostics.push(...nested.diagnostics);
    ok = ok && nested.ok;
    state.pipe = nested.state.pipe;
    if (nested.state.breakRequested) {
      nested.state.breakRequested = false;
      return { ok, output: outputs.filter((part) => part.length > 0).join('\n'), diagnostics };
    }
  }

  return {
    ok: false,
    output: outputs.filter((part) => part.length > 0).join('\n'),
    diagnostics: [...diagnostics, makeDiagnostic('while-max-iterations', `Exceeded /while maxIterations (${maxIterations}).`, 'while')],
  };
}

function parseSetVariable(args: string): { readonly name: string; readonly value: string } | undefined {
  const trimmed = args.trim();
  if (trimmed.length === 0) {
    return undefined;
  }

  const equalsIndex = trimmed.indexOf('=');
  if (equalsIndex > 0) {
    const name = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    return name.length > 0 ? { name, value } : undefined;
  }

  const firstWhitespace = trimmed.search(/\s/);
  if (firstWhitespace <= 0) {
    return undefined;
  }

  const name = trimmed.slice(0, firstWhitespace).trim();
  const value = trimmed.slice(firstWhitespace).trim();
  return name.length > 0 ? { name, value } : undefined;
}

function parseIfArgs(
  args: string,
): { readonly left: string; readonly right: string; readonly thenCommand: string; readonly elseCommand?: string } | undefined {
  const match = /^(.*?)\s*==\s*(.*?)\s+then\s+(.+?)(?:\s+else\s+(.+))?$/iu.exec(args.trim());
  if (match === null) {
    return undefined;
  }

  const left = match[1]?.trim() ?? '';
  const right = match[2]?.trim() ?? '';
  const thenCommand = match[3]?.trim() ?? '';
  const elseCommand = match[4]?.trim();
  if (left.length === 0 || right.length === 0 || thenCommand.length === 0) {
    return undefined;
  }

  return { left, right, thenCommand, elseCommand };
}

function resolveOperand(operand: string, state: STScriptState): string {
  const trimmed = operand.trim();
  const unquoted = unquote(trimmed);
  if (unquoted !== trimmed) {
    return unquoted;
  }

  if (trimmed === '{{pipe}}') {
    return state.pipe;
  }

  const variableName = trimmed.startsWith('$') ? trimmed.slice(1) : trimmed;
  return state.getVariable(variableName) ?? trimmed;
}

function resolveCondition(condition: string, state: STScriptState): string {
  const trimmed = condition.trim();
  if (trimmed.length === 0) {
    return 'true';
  }

  const match = /^(.*?)\s*(==|!=|<|>|<=|>=)\s*(.*?)$/u.exec(trimmed);
  if (match !== null) {
    const left = resolveOperand(match[1] ?? '', state);
    const right = resolveOperand(match[3] ?? '', state);
    switch (match[2]) {
      case '==':
        return String(left === right);
      case '!=':
        return String(left !== right);
      case '<':
        return String(Number(left) < Number(right));
      case '>':
        return String(Number(left) > Number(right));
      case '<=':
        return String(Number(left) <= Number(right));
      case '>=':
        return String(Number(left) >= Number(right));
      default:
        return 'false';
    }
  }

  return resolveOperand(trimmed, state);
}

function unquote(value: string): string {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }

  return value;
}

function normalizeCallbackResult(result: SlashCommandCallbackResult): SlashCommandResult {
  if (typeof result === 'string') {
    return { ok: true, output: result };
  }

  return result;
}

function normalizeCommandName(name: string): string {
  return name.trim().replace(/^\/+/, '').toLowerCase();
}

function makeDiagnostic(code: string, message: string, command?: string): SlashDiagnostic {
  return { code, message, command };
}

function isTextArgument(argument: STScriptArgument): argument is Extract<STScriptArgument, { readonly type: 'text' }> {
  return argument.type === 'text';
}

function isNamedArgument(argument: STScriptArgument): argument is Extract<STScriptArgument, { readonly type: 'named' }> {
  return argument.type === 'named';
}

function isAliasList(value: readonly string[] | SlashCommandMetadata): value is readonly string[] {
  return Array.isArray(value);
}

function parseInlineClosure(value: string): STScriptClosure | undefined {
  const trimmed = value.trim();
  if (!looksLikeClosure(trimmed)) {
    return undefined;
  }

  const parsed = parseSTScript(`/run ${trimmed}`);
  const statement = parsed.body[0];
  if (statement?.type !== 'pipeline') {
    return undefined;
  }

  return statement.commands[0]?.args.find((argument): argument is STScriptClosureArgument => argument.type === 'closure');
}

function firstInlineClosure(value: string): STScriptClosure | undefined {
  const match = /(\{\{[\s\S]*\}\}|\{[\s\S]*\})/u.exec(value);
  return match?.[1] === undefined ? undefined : parseInlineClosure(match[1]);
}

function looksLikeClosure(value: string): boolean {
  const trimmed = value.trim();
  return (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('{{') && trimmed.endsWith('}}'));
}

function parsePositiveInt(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function truthy(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && normalized !== '0' && normalized !== 'false' && normalized !== 'no' && normalized !== 'null' && normalized !== 'undefined';
}
