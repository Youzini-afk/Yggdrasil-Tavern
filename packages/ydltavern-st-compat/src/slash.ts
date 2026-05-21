import type { STContext, STGenerateResult } from './context.js';

export interface SlashCommandInvocation {
  readonly name: string;
  readonly args: string;
  readonly argv: readonly string[];
  readonly raw: string;
  readonly context: STContext;
  readonly variables: Map<string, string>;
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

export interface SlashCommandDescriptor {
  readonly name: string;
  readonly aliases: readonly string[];
}

export interface ExecuteSlashCommandsOptions {
  readonly stopOnError?: boolean;
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
}

export interface SlashHost {
  readonly variables: Map<string, string>;
  readonly diagnostics: readonly SlashDiagnostic[];
  readonly slashCommands: () => readonly SlashCommandDescriptor[];
  readonly registerSlashCommand: (name: string, callback: SlashCommandCallback, aliases?: readonly string[]) => void;
  readonly executeSlashCommands: (input: string, options?: ExecuteSlashCommandsOptions) => ExecuteSlashCommandsResult;
}

interface RegisteredSlashCommand {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly callback: SlashCommandCallback;
}

export function createSlashHost(getContext: () => STContext, variables: Map<string, string> = new Map()): SlashHost {
  const registry = new Map<string, RegisteredSlashCommand>();
  const diagnostics: SlashDiagnostic[] = [];

  const registerSlashCommand = (name: string, callback: SlashCommandCallback, aliases: readonly string[] = []): void => {
    const normalizedName = normalizeCommandName(name);
    const normalizedAliases = aliases.map(normalizeCommandName).filter((alias) => alias.length > 0 && alias !== normalizedName);
    if (normalizedName.length === 0) {
      throw new Error('Slash command name must not be empty.');
    }

    const command: RegisteredSlashCommand = { name: normalizedName, aliases: normalizedAliases, callback };
    registry.set(normalizedName, command);
    for (const alias of normalizedAliases) {
      registry.set(alias, command);
    }
  };

  const slashCommands = (): readonly SlashCommandDescriptor[] => {
    const unique = new Map<string, SlashCommandDescriptor>();
    for (const command of registry.values()) {
      unique.set(command.name, { name: command.name, aliases: command.aliases });
    }

    return [...unique.values()].sort((left, right) => left.name.localeCompare(right.name));
  };

  const executeSlashCommands = (input: string, options: ExecuteSlashCommandsOptions = {}): ExecuteSlashCommandsResult => {
    const executions: SlashCommandExecution[] = [];
    const output: string[] = [];
    const executionDiagnostics: SlashDiagnostic[] = [];

    for (const rawLine of splitCommandLines(input)) {
      const line = rawLine.trim();
      if (line.length === 0) {
        continue;
      }

      if (!line.startsWith('/')) {
        output.push(line);
        continue;
      }

      const parsed = parseSlashCommand(line);
      if (parsed === undefined) {
        const diagnostic = makeDiagnostic('invalid-command', `Invalid slash command: ${line}`);
        diagnostics.push(diagnostic);
        executionDiagnostics.push(diagnostic);
        if (options.stopOnError === true) {
          break;
        }
        continue;
      }

      const command = registry.get(parsed.name);
      if (command === undefined) {
        const diagnostic = makeDiagnostic('unknown-command', `Unknown slash command: /${parsed.name}`, parsed.name);
        diagnostics.push(diagnostic);
        executionDiagnostics.push(diagnostic);
        executions.push({ name: parsed.name, raw: line, ok: false, output: '', diagnostics: [diagnostic] });
        if (options.stopOnError === true) {
          break;
        }
        continue;
      }

      const result = normalizeCallbackResult(
        command.callback({
          name: command.name,
          args: parsed.args,
          argv: parseArguments(parsed.args),
          raw: line,
          context: getContext(),
          variables,
        }),
      );
      const resultDiagnostics = result.diagnostics ?? [];
      diagnostics.push(...resultDiagnostics);
      executionDiagnostics.push(...resultDiagnostics);
      executions.push({ name: command.name, raw: line, ok: result.ok, output: result.output, diagnostics: resultDiagnostics });
      if (result.output.length > 0) {
        output.push(result.output);
      }

      if (!result.ok && options.stopOnError === true) {
        break;
      }
    }

    return {
      ok: executions.every((execution) => execution.ok) && executionDiagnostics.length === 0,
      input,
      output: output.join('\n'),
      executions,
      diagnostics: executionDiagnostics,
      variables: Object.fromEntries(variables.entries()),
    };
  };

  const host: SlashHost = {
    variables,
    diagnostics,
    slashCommands,
    registerSlashCommand,
    executeSlashCommands,
  };

  registerBuiltInCommands(host);

  return host;
}

function registerBuiltInCommands(host: SlashHost): void {
  host.registerSlashCommand('gen', ({ args, context }) => generatedText(context.Generate({ text: args })));
  host.registerSlashCommand('continue', ({ context }) => generatedText(context.Generate({ text: '[ydltavern fake continue]' })));
  host.registerSlashCommand('swipe', ({ context }) => generatedText(context.Generate({ text: '[ydltavern fake swipe]' })));
  host.registerSlashCommand('setvar', ({ args, variables }) => setVariable(args, variables));
  host.registerSlashCommand('getvar', ({ args, variables }) => variables.get(args.trim()) ?? '');
  host.registerSlashCommand('if', ({ args, context }) => executeIfCommand(args, context));
  host.registerSlashCommand('run', ({ args }) => ({
    ok: false,
    output: '',
    diagnostics: [makeDiagnostic('unknown-run-target', `Unknown /run target: ${args.trim() || '<empty>'}`, 'run')],
  }));
}

function generatedText(result: STGenerateResult): string {
  return result.message.mes ?? '';
}

function setVariable(args: string, variables: Map<string, string>): SlashCommandResult {
  const parsed = parseSetVariable(args);
  if (parsed === undefined) {
    return {
      ok: false,
      output: '',
      diagnostics: [makeDiagnostic('invalid-setvar', 'Expected /setvar name=value or /setvar name value.', 'setvar')],
    };
  }

  variables.set(parsed.name, parsed.value);
  return { ok: true, output: parsed.value };
}

function executeIfCommand(args: string, context: STContext): SlashCommandResult {
  const parsed = parseIfArgs(args);
  if (parsed === undefined) {
    return {
      ok: false,
      output: '',
      diagnostics: [makeDiagnostic('invalid-if', 'Expected /if left == right then ... else ...', 'if')],
    };
  }

  const left = resolveOperand(parsed.left, context.variables);
  const right = resolveOperand(parsed.right, context.variables);
  const selected = left === right ? parsed.thenCommand : parsed.elseCommand;
  if (selected === undefined || selected.length === 0) {
    return { ok: true, output: '' };
  }

  if (!selected.startsWith('/')) {
    return { ok: true, output: selected };
  }

  const nested = context.executeSlashCommands(selected);
  return { ok: nested.ok, output: nested.output, diagnostics: nested.diagnostics };
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

function resolveOperand(operand: string, variables: Map<string, string>): string {
  const trimmed = operand.trim();
  const unquoted = unquote(trimmed);
  if (unquoted !== trimmed) {
    return unquoted;
  }

  const variableName = trimmed.startsWith('$') ? trimmed.slice(1) : trimmed;
  return variables.get(variableName) ?? trimmed;
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

function parseSlashCommand(line: string): { readonly name: string; readonly args: string } | undefined {
  const trimmed = line.trim();
  if (!trimmed.startsWith('/')) {
    return undefined;
  }

  const withoutSlash = trimmed.slice(1).trimStart();
  if (withoutSlash.length === 0) {
    return undefined;
  }

  const firstWhitespace = withoutSlash.search(/\s/);
  if (firstWhitespace === -1) {
    return { name: normalizeCommandName(withoutSlash), args: '' };
  }

  return {
    name: normalizeCommandName(withoutSlash.slice(0, firstWhitespace)),
    args: withoutSlash.slice(firstWhitespace).trimStart(),
  };
}

function parseArguments(args: string): readonly string[] {
  const trimmed = args.trim();
  if (trimmed.length === 0) {
    return [];
  }

  return trimmed.split(/\s+/u);
}

function normalizeCommandName(name: string): string {
  return name.trim().replace(/^\/+/, '').toLowerCase();
}

function splitCommandLines(input: string): readonly string[] {
  return input.split(/\r?\n/u);
}

function makeDiagnostic(code: string, message: string, command?: string): SlashDiagnostic {
  return { code, message, command };
}
