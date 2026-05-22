import type { ExtensionDiagnostic } from './registry.js';

export interface QuickReplyItemInput {
  readonly id?: string;
  readonly label?: string;
  readonly message?: string;
  readonly slashCommand?: string;
  readonly enabled?: boolean;
  readonly autoExecute?: boolean;
  readonly triggers?: readonly string[];
}

export interface QuickReplySetInput {
  readonly id: string;
  readonly name?: string;
  readonly enabled?: boolean;
  readonly items?: readonly QuickReplyItemInput[];
  readonly links?: readonly string[];
}

export interface QuickReplyItem {
  readonly id: string;
  readonly label: string;
  readonly message?: string;
  readonly slashCommand?: string;
  readonly enabled: boolean;
  readonly autoExecute: boolean;
  readonly triggers: readonly string[];
}

export interface QuickReplySet {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly items: readonly QuickReplyItem[];
  readonly links: readonly string[];
}

export interface NormalizeQuickReplyResult {
  readonly sets: readonly QuickReplySet[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface SlashCommandHost {
  execute(command: string, context?: QuickReplyExecutionContext): unknown | Promise<unknown>;
}

export interface QuickReplyExecutionContext {
  readonly setId?: string;
  readonly input?: string;
  readonly variables?: Record<string, string>;
}

export type QuickReplyExecutionResult =
  | { readonly kind: 'slashCommand'; readonly command: string; readonly result: unknown }
  | { readonly kind: 'message'; readonly message: string }
  | { readonly kind: 'noop'; readonly diagnostics: readonly ExtensionDiagnostic[] };

export interface QuickReplyAutoExecutePlan {
  readonly itemIds: readonly string[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export function normalizeQuickReplySets(inputs: readonly QuickReplySetInput[]): NormalizeQuickReplyResult {
  const diagnostics: ExtensionDiagnostic[] = [];
  const seen = new Set<string>();
  const sets = inputs.map((setInput): QuickReplySet => {
    if (seen.has(setInput.id)) {
      diagnostics.push({
        level: 'warning',
        code: 'quickReply.set.duplicate',
        message: `Duplicate quick reply set id: ${setInput.id}`,
        extensionId: 'quick-reply',
      });
    }
    seen.add(setInput.id);
    return {
      id: setInput.id,
      name: setInput.name ?? setInput.id,
      enabled: setInput.enabled !== false,
      items: (setInput.items ?? []).map((item, index) => normalizeQuickReplyItem(item, `${setInput.id}:${index}`, diagnostics)),
      links: [...new Set(setInput.links ?? [])],
    };
  });
  return { sets, diagnostics };
}

export async function executeQuickReply(
  item: QuickReplyItem,
  slashHost?: SlashCommandHost,
  context?: QuickReplyExecutionContext,
): Promise<QuickReplyExecutionResult> {
  if (!item.enabled) {
    return {
      kind: 'noop',
      diagnostics: [{ level: 'info', code: 'quickReply.disabled', message: `Quick reply ${item.id} is disabled.`, extensionId: 'quick-reply' }],
    };
  }
  if (item.slashCommand !== undefined && item.slashCommand.trim() !== '') {
    if (slashHost === undefined) {
      return {
        kind: 'noop',
        diagnostics: [{ level: 'warning', code: 'quickReply.slashHost.missing', message: 'Slash command host is not available.', extensionId: 'quick-reply' }],
      };
    }
    const command = renderTemplate(item.slashCommand, context?.variables ?? {});
    return { kind: 'slashCommand', command, result: await slashHost.execute(command, context) };
  }
  return { kind: 'message', message: renderTemplate(item.message ?? '', context?.variables ?? {}) };
}

export function planQuickReplyAutoExecute(
  sets: readonly QuickReplySet[],
  input: string,
): QuickReplyAutoExecutePlan {
  const diagnostics: ExtensionDiagnostic[] = [];
  const itemIds: string[] = [];
  for (const set of sets) {
    if (!set.enabled) {
      continue;
    }
    for (const item of set.items) {
      if (!item.enabled || !item.autoExecute) {
        continue;
      }
      if (item.triggers.length === 0) {
        diagnostics.push({ level: 'info', code: 'quickReply.autoExecute.noTriggers', message: `Auto quick reply ${item.id} has no triggers.`, extensionId: 'quick-reply' });
        continue;
      }
      if (item.triggers.some((trigger) => input.includes(trigger))) {
        itemIds.push(item.id);
      }
    }
  }
  return { itemIds, diagnostics };
}

function normalizeQuickReplyItem(item: QuickReplyItemInput, fallbackId: string, diagnostics: ExtensionDiagnostic[]): QuickReplyItem {
  const id = item.id ?? fallbackId;
  if ((item.message ?? '') === '' && (item.slashCommand ?? '') === '') {
    diagnostics.push({ level: 'warning', code: 'quickReply.item.empty', message: `Quick reply ${id} has no message or slash command.`, extensionId: 'quick-reply' });
  }
  return {
    id,
    label: item.label ?? id,
    message: item.message,
    slashCommand: item.slashCommand,
    enabled: item.enabled !== false,
    autoExecute: item.autoExecute === true,
    triggers: [...new Set(item.triggers ?? [])],
  };
}

function renderTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => variables[key] ?? '');
}
