export interface STScriptProgram {
  readonly type: 'program';
  readonly body: readonly STScriptStatement[];
}

export type STScriptStatement = STScriptPipeline | STScriptTextNode;

export interface STScriptPipeline {
  readonly type: 'pipeline';
  readonly commands: readonly STScriptCommandNode[];
  readonly raw: string;
}

export interface STScriptTextNode {
  readonly type: 'text';
  readonly text: string;
  readonly raw: string;
}

export interface STScriptCommandNode {
  readonly type: 'command';
  readonly name: string;
  readonly args: readonly STScriptArgument[];
  readonly rawArgs: string;
  readonly raw: string;
}

export type STScriptArgument = STScriptTextArgument | STScriptNamedArgument | STScriptClosureArgument;

export interface STScriptTextArgument {
  readonly type: 'text';
  readonly value: string;
  readonly raw: string;
}

export interface STScriptNamedArgument {
  readonly type: 'named';
  readonly key: string;
  readonly value: string;
  readonly raw: string;
}

export interface STScriptClosureArgument {
  readonly type: 'closure';
  readonly body: string;
  readonly raw: string;
  readonly style: 'brace' | 'double-brace';
}

export type STScriptClosure = STScriptClosureArgument;
