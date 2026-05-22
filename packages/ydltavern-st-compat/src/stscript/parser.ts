import type {
  STScriptArgument,
  STScriptClosureArgument,
  STScriptCommandNode,
  STScriptPipeline,
  STScriptProgram,
  STScriptStatement,
} from './ast.js';

interface Token {
  readonly value: string;
  readonly raw: string;
  readonly closure?: STScriptClosureArgument;
}

export function parseSTScript(input: string): STScriptProgram {
  const body: STScriptStatement[] = [];

  for (const statement of splitTopLevel(input, ['\n', ';'])) {
    const trimmed = statement.trim();
    if (trimmed.length === 0) {
      continue;
    }

    if (!trimmed.startsWith('/')) {
      body.push({ type: 'text', text: trimmed, raw: statement });
      continue;
    }

    const commands = splitTopLevel(trimmed, ['|']).map((part) => parseCommand(part.trim())).filter(isCommand);
    body.push({ type: 'pipeline', commands, raw: statement } satisfies STScriptPipeline);
  }

  return { type: 'program', body };
}

function parseCommand(raw: string): STScriptCommandNode | undefined {
  if (!raw.startsWith('/')) {
    return undefined;
  }

  const withoutSlash = raw.slice(1).trimStart();
  if (withoutSlash.length === 0) {
    return undefined;
  }

  const nameEnd = withoutSlash.search(/\s/u);
  const name = normalizeCommandName(nameEnd === -1 ? withoutSlash : withoutSlash.slice(0, nameEnd));
  const rawArgs = nameEnd === -1 ? '' : withoutSlash.slice(nameEnd).trimStart();

  return {
    type: 'command',
    name,
    args: tokenizeArguments(rawArgs).map(tokenToArgument),
    rawArgs,
    raw,
  };
}

function tokenToArgument(token: Token): STScriptArgument {
  if (token.closure !== undefined) {
    return token.closure;
  }

  const equalsIndex = token.value.indexOf('=');
  if (equalsIndex > 0) {
    return {
      type: 'named',
      key: token.value.slice(0, equalsIndex),
      value: token.value.slice(equalsIndex + 1),
      raw: token.raw,
    };
  }

  return { type: 'text', value: token.value, raw: token.raw };
}

export function tokenizeSTScriptArguments(input: string): readonly STScriptArgument[] {
  return tokenizeArguments(input).map(tokenToArgument);
}

function tokenizeArguments(input: string): readonly Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    while (index < input.length && /\s/u.test(input[index] ?? '')) {
      index += 1;
    }

    if (index >= input.length) {
      break;
    }

    const closure = readClosure(input, index);
    if (closure !== undefined && closure.argument.body.trim() !== 'pipe') {
      tokens.push({ value: closure.argument.body, raw: closure.argument.raw, closure: closure.argument });
      index = closure.nextIndex;
      continue;
    }

    const token = readTextToken(input, index);
    tokens.push(token.token);
    index = token.nextIndex;
  }

  return tokens;
}

function readTextToken(input: string, start: number): { readonly token: Token; readonly nextIndex: number } {
  let index = start;
  let value = '';
  let raw = '';

  while (index < input.length && !/\s/u.test(input[index] ?? '')) {
    const char = input[index] ?? '';
    if (char === '"' || char === "'") {
      const quoted = readQuoted(input, index, char);
      value += quoted.value;
      raw += quoted.raw;
      index = quoted.nextIndex;
      continue;
    }

    value += char;
    raw += char;
    index += 1;
  }

  return { token: { value, raw }, nextIndex: index };
}

function readQuoted(input: string, start: number, quote: string): { readonly value: string; readonly raw: string; readonly nextIndex: number } {
  let index = start + 1;
  let value = '';
  let raw = quote;

  while (index < input.length) {
    const char = input[index] ?? '';
    raw += char;
    index += 1;

    if (char === '\\') {
      const escaped = input[index] ?? '';
      if (escaped.length > 0) {
        value += escaped;
        raw += escaped;
        index += 1;
      }
      continue;
    }

    if (char === quote) {
      return { value, raw, nextIndex: index };
    }

    value += char;
  }

  return { value, raw, nextIndex: index };
}

function readClosure(input: string, start: number): { readonly argument: STScriptClosureArgument; readonly nextIndex: number } | undefined {
  const doubleBrace = input.startsWith('{{', start);
  const singleBrace = !doubleBrace && input[start] === '{';
  if (!doubleBrace && !singleBrace) {
    return undefined;
  }

  const open = doubleBrace ? '{{' : '{';
  const close = doubleBrace ? '}}' : '}';
  let index = start + open.length;
  let depth = 1;
  let body = '';

  while (index < input.length) {
    if (input.startsWith(open, index)) {
      depth += 1;
      body += open;
      index += open.length;
      continue;
    }

    if (input.startsWith(close, index)) {
      depth -= 1;
      if (depth === 0) {
        const nextIndex = index + close.length;
        return {
          argument: {
            type: 'closure',
            body: body.trim(),
            raw: input.slice(start, nextIndex),
            style: doubleBrace ? 'double-brace' : 'brace',
          },
          nextIndex,
        };
      }

      body += close;
      index += close.length;
      continue;
    }

    body += input[index] ?? '';
    index += 1;
  }

  return undefined;
}

function splitTopLevel(input: string, delimiters: readonly string[]): readonly string[] {
  const parts: string[] = [];
  let quote: string | undefined;
  let braceDepth = 0;
  let start = 0;
  let index = 0;

  while (index < input.length) {
    const char = input[index] ?? '';

    if (quote !== undefined) {
      if (char === '\\') {
        index += 2;
        continue;
      }
      if (char === quote) {
        quote = undefined;
      }
      index += 1;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      index += 1;
      continue;
    }

    if (char === '{') {
      braceDepth += 1;
      index += 1;
      continue;
    }

    if (char === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      index += 1;
      continue;
    }

    if (braceDepth === 0 && delimiters.includes(char)) {
      parts.push(input.slice(start, index));
      start = index + 1;
    }

    index += 1;
  }

  parts.push(input.slice(start));
  return parts;
}

function normalizeCommandName(name: string): string {
  return name.trim().replace(/^\/+/, '').toLowerCase();
}

function isCommand(value: STScriptCommandNode | undefined): value is STScriptCommandNode {
  return value !== undefined;
}
