import type { ExtensionDiagnostic } from './registry.js';

export type RegexScriptScope = 'GLOBAL' | 'PRESET' | 'SCOPED';
export type RegexPlacement = 'beforePrompt' | 'afterPrompt' | 'response' | 'userInput';

export interface RegexScript {
  readonly id: string;
  readonly name?: string;
  readonly scope: RegexScriptScope;
  readonly find: string;
  readonly replace: string;
  readonly flags?: string;
  readonly placement: RegexPlacement;
  readonly enabled?: boolean;
  readonly scopedTo?: readonly string[];
}

export interface RegexContext {
  readonly placement: RegexPlacement;
  readonly scopeId?: string;
  readonly enabledScopes?: readonly RegexScriptScope[];
}

export interface ApplyRegexScriptsResult {
  readonly text: string;
  readonly applied: readonly string[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export function applyRegexScripts(
  text: string,
  scripts: readonly RegexScript[],
  context: RegexContext,
): ApplyRegexScriptsResult {
  let current = text;
  const applied: string[] = [];
  const diagnostics: ExtensionDiagnostic[] = [];

  for (const script of scripts) {
    if (!shouldApplyScript(script, context)) {
      continue;
    }

    const flags = normalizeFlags(script.flags);
    try {
      const pattern = new RegExp(script.find, flags);
      current = current.replace(pattern, script.replace);
      applied.push(script.id);
    } catch (error) {
      diagnostics.push({
        level: 'error',
        code: 'regex.invalid',
        message: `Invalid regex script ${script.id}: ${error instanceof Error ? error.message : String(error)}`,
        extensionId: 'regex',
        hook: script.placement,
      });
    }
  }

  return { text: current, applied, diagnostics };
}

function shouldApplyScript(script: RegexScript, context: RegexContext): boolean {
  if (script.enabled === false || script.placement !== context.placement) {
    return false;
  }
  if (context.enabledScopes !== undefined && !context.enabledScopes.includes(script.scope)) {
    return false;
  }
  if (script.scope === 'SCOPED') {
    return context.scopeId !== undefined && (script.scopedTo ?? []).includes(context.scopeId);
  }
  return true;
}

function normalizeFlags(flags: string | undefined): string {
  if (flags === undefined || flags === '') {
    return 'g';
  }
  return [...new Set(flags.split(''))].join('');
}
