import type { STScriptClosure } from './ast.js';

export interface CreateSTScriptStateOptions {
  readonly parent?: STScriptState;
  readonly globalVariables?: Map<string, string>;
  readonly localVariables?: Map<string, string>;
  readonly closures?: Map<string, STScriptClosure>;
  readonly globalClosures?: Map<string, STScriptClosure>;
  readonly pipe?: string;
  readonly maxIterations?: number;
}

export interface STScriptState {
  readonly parent: STScriptState | undefined;
  readonly variables: Map<string, string>;
  readonly globalVariables: Map<string, string>;
  readonly localVariables: Map<string, string>;
  readonly closures: Map<string, STScriptClosure>;
  readonly globalClosures: Map<string, STScriptClosure>;
  pipe: string;
  breakRequested: boolean;
  maxIterations: number;
  readonly getVariable: (name: string) => string | undefined;
  readonly setLocalVariable: (name: string, value: string) => void;
  readonly setGlobalVariable: (name: string, value: string) => void;
  readonly getClosure: (name: string) => STScriptClosure | undefined;
  readonly setLocalClosure: (name: string, closure: STScriptClosure) => void;
  readonly setGlobalClosure: (name: string, closure: STScriptClosure) => void;
  readonly createChild: () => STScriptState;
}

export function createSTScriptState(options: CreateSTScriptStateOptions = {}): STScriptState {
  const parent = options.parent;
  const globalVariables = options.globalVariables ?? parent?.globalVariables ?? new Map<string, string>();
  const globalClosures = options.globalClosures ?? parent?.globalClosures ?? new Map<string, STScriptClosure>();
  const localVariables = options.localVariables ?? new Map<string, string>();
  const closures = options.closures ?? new Map<string, STScriptClosure>();

  const state: STScriptState = {
    parent,
    variables: globalVariables,
    globalVariables,
    localVariables,
    closures,
    globalClosures,
    pipe: options.pipe ?? parent?.pipe ?? '',
    breakRequested: false,
    maxIterations: options.maxIterations ?? parent?.maxIterations ?? 100,
    getVariable: (name) => localVariables.get(name) ?? parent?.getVariable(name) ?? globalVariables.get(name),
    setLocalVariable: (name, value) => {
      localVariables.set(name, value);
    },
    setGlobalVariable: (name, value) => {
      globalVariables.set(name, value);
    },
    getClosure: (name) => closures.get(name) ?? parent?.getClosure(name) ?? globalClosures.get(name),
    setLocalClosure: (name, closure) => {
      closures.set(name, closure);
    },
    setGlobalClosure: (name, closure) => {
      globalClosures.set(name, closure);
    },
    createChild: () => createSTScriptState({ parent: state }),
  };

  return state;
}
