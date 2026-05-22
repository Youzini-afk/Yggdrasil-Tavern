import type { STContext } from '../context.js';
import type { SlashDiagnostic } from '../slash.js';
import type { STScriptArgument, STScriptCommandNode, STScriptProgram } from './ast.js';
import { parseSTScript } from './parser.js';
import { createSTScriptState, type STScriptState } from './state.js';

export interface STScriptCommandExecution {
  readonly name: string;
  readonly raw: string;
  readonly ok: boolean;
  readonly output: string;
  readonly diagnostics: readonly SlashDiagnostic[];
}

export interface STScriptEvaluationResult {
  readonly ok: boolean;
  readonly input: string;
  readonly output: string;
  readonly executions: readonly STScriptCommandExecution[];
  readonly diagnostics: readonly SlashDiagnostic[];
  readonly variables: Readonly<Record<string, string>>;
  readonly state: STScriptState;
}

export interface STScriptEvaluateOptions {
  readonly stopOnError?: boolean;
}

export interface STScriptCommandResult {
  readonly name: string;
  readonly raw: string;
  readonly ok: boolean;
  readonly output: string;
  readonly diagnostics: readonly SlashDiagnostic[];
}

export interface STScriptRuntimeHost {
  readonly variables: Map<string, string>;
  readonly invokeSTScriptCommand: (command: STScriptCommandNode, context: STContext, state: STScriptState) => STScriptCommandResult;
}

export function evaluateSTScript(
  astOrInput: STScriptProgram | string,
  host: STScriptRuntimeHost,
  context: STContext,
  state: STScriptState = createSTScriptState({ globalVariables: host.variables }),
  options: STScriptEvaluateOptions = {},
): STScriptEvaluationResult {
  const ast = typeof astOrInput === 'string' ? parseSTScript(astOrInput) : astOrInput;
  const input = typeof astOrInput === 'string' ? astOrInput : ast.body.map((statement) => statement.raw).join('\n');
  const output: string[] = [];
  const executions: STScriptCommandExecution[] = [];
  const diagnostics: SlashDiagnostic[] = [];

  for (const statement of ast.body) {
    if (statement.type === 'text') {
      const text = replacePipe(statement.text, state.pipe);
      if (text.length > 0) {
        output.push(text);
        state.pipe = text;
      }
      continue;
    }

    let pipe = state.pipe;
    let pipelineOk = true;
    for (const command of statement.commands) {
      state.pipe = pipe;
      const invoked = host.invokeSTScriptCommand(withPipe(command, pipe), context, state);
      executions.push(invoked);
      diagnostics.push(...invoked.diagnostics);
      pipelineOk = pipelineOk && invoked.ok;
      pipe = invoked.output;
      state.pipe = pipe;

      if ((!invoked.ok && options.stopOnError === true) || state.breakRequested) {
        break;
      }
    }

    if (pipe.length > 0) {
      output.push(pipe);
    }

    if ((!pipelineOk && options.stopOnError === true) || state.breakRequested) {
      break;
    }
  }

  return {
    ok: executions.every((execution) => execution.ok) && diagnostics.length === 0,
    input,
    output: output.join('\n'),
    executions,
    diagnostics,
    variables: Object.fromEntries(state.globalVariables.entries()),
    state,
  };
}

function withPipe(command: STScriptCommandNode, pipe: string): STScriptCommandNode {
  const args = command.args.map((argument) => replacePipeArgument(argument, pipe));
  return {
    ...command,
    args,
    rawArgs: renderArguments(args),
  };
}

function replacePipeArgument(argument: STScriptArgument, pipe: string): STScriptArgument {
  if (argument.type === 'closure') {
    return argument;
  }

  if (argument.type === 'named') {
    return { ...argument, value: replacePipe(argument.value, pipe) };
  }

  return { ...argument, value: replacePipe(argument.value, pipe) };
}

function replacePipe(value: string, pipe: string): string {
  return value.replaceAll('{{pipe}}', pipe);
}

function renderArguments(args: readonly STScriptArgument[]): string {
  return args
    .map((argument) => {
      if (argument.type === 'closure') {
        return argument.raw;
      }
      if (argument.type === 'named') {
        return `${argument.key}=${argument.value}`;
      }
      return argument.value;
    })
    .join(' ');
}
