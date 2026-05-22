// Batch L: preset/settings commands.
// Aligns with ST canonical registrations in SillyTavern/public/scripts/slash-commands.js:518-674,
// SillyTavern/public/scripts/sysprompt.js:196-251, and power-user.js:4109-4413.

import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { registerIfMissing, registerPlanOnly, registerUnsupported, toBoolean, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type PlainRecord = Record<string, unknown>;

interface FormattingCapableContext extends STContextDeep {
  formattingSettings?: PlainRecord;
  updateFormattingSettings?: (values: PlainRecord) => void;
  power_user?: PlainRecord;
}

export function registerBatchL(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as FormattingCapableContext;

  registerIfMissing(registry, {
    name: 'instruct',
    helpString: 'Set or get active instruct template name.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:518-577.
      const name = commandText(args, value, ['name']).trim();
      if (!name) return readString(ctx, 'instructTemplate', ['instruct', 'preset']);
      updateFormatting(ctx, { instructTemplate: name }, (formatting) => { formatting.instructTemplate = name; });
      updateNested(ctx.power_user, ['instruct'], { preset: name });
      return name;
    },
    returns: 'current instruct template name',
  });

  registerIfMissing(registry, {
    name: 'instruct-on',
    helpString: 'Enable instruct mode.',
    callback: async () => {
      // ST source: slash-commands.js:578-582.
      setBoolean(ctx, 'instructEnabled', true, ['instruct', 'enabled']);
      return 'true';
    },
  });

  registerIfMissing(registry, {
    name: 'instruct-off',
    helpString: 'Disable instruct mode.',
    callback: async () => {
      // ST source: slash-commands.js:583-587.
      setBoolean(ctx, 'instructEnabled', false, ['instruct', 'enabled']);
      return 'false';
    },
  });

  registerIfMissing(registry, {
    name: 'instruct-state',
    aliases: ['instruct-toggle'],
    helpString: 'Get or set instruct mode state.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:588-608.
      const state = commandText(args, value, ['enabled', 'state']).trim();
      if (!state) return String(readBoolean(ctx, 'instructEnabled', ['instruct', 'enabled']));
      const enabled = toBoolean(state);
      setBoolean(ctx, 'instructEnabled', enabled, ['instruct', 'enabled']);
      return String(enabled);
    },
    returns: 'current instruct state',
  });

  registerIfMissing(registry, {
    name: 'context',
    helpString: 'Set or get active context template.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:609-648.
      const name = commandText(args, value, ['name']).trim();
      if (!name) return readString(ctx, 'contextTemplate', ['context', 'preset']);
      updateFormatting(ctx, { contextTemplate: name }, (formatting) => { formatting.contextTemplate = name; });
      updateNested(ctx.power_user, ['context'], { preset: name });
      return name;
    },
    returns: 'current context template name',
  });

  registerIfMissing(registry, {
    name: 'sysprompt',
    aliases: ['system-prompt'],
    helpString: 'Set or get active system prompt preset name.',
    callback: async (args, value) => {
      // ST source: sysprompt.js:196-238.
      const name = commandText(args, value, ['name']).trim();
      if (!name) return readString(ctx, 'systemPrompt', ['sysprompt', 'preset']);
      updateFormatting(ctx, { systemPrompt: name }, (formatting) => { formatting.systemPrompt = name; });
      updateNested(ctx.power_user, ['sysprompt'], { preset: name });
      return name;
    },
    returns: 'current system prompt preset name',
  });

  registerIfMissing(registry, {
    name: 'sysprompt-on',
    aliases: ['sysprompt-enable'],
    helpString: 'Enable system prompt.',
    callback: async () => {
      // ST source: sysprompt.js:239-244.
      setBoolean(ctx, 'systemPromptEnabled', true, ['sysprompt', 'enabled']);
      return 'true';
    },
  });

  registerIfMissing(registry, {
    name: 'sysprompt-off',
    aliases: ['sysprompt-disable'],
    helpString: 'Disable system prompt.',
    callback: async () => {
      // ST source: sysprompt.js:245-250.
      setBoolean(ctx, 'systemPromptEnabled', false, ['sysprompt', 'enabled']);
      return 'false';
    },
  });

  registerIfMissing(registry, {
    name: 'sysprompt-state',
    aliases: ['sysprompt-toggle'],
    helpString: 'Get or set system prompt state.',
    callback: async (args, value) => {
      // ST source: sysprompt.js:251-263.
      const state = commandText(args, value, ['enabled', 'state']).trim();
      if (!state) return String(readBoolean(ctx, 'systemPromptEnabled', ['sysprompt', 'enabled']));
      const enabled = toBoolean(state);
      setBoolean(ctx, 'systemPromptEnabled', enabled, ['sysprompt', 'enabled']);
      return String(enabled);
    },
    returns: 'current system prompt state',
  });

  registerIfMissing(registry, {
    name: 'stop-strings',
    aliases: ['stopping-strings', 'custom-stopping-strings', 'custom-stop-strings'],
    helpString: 'Get or set custom stop strings (newline-separated).',
    callback: async (args, value) => {
      // ST source: power-user.js:4350-4412.
      const text = nullableCommandText(args, value, ['value']);
      if (text === null) return readString(ctx, 'stopStrings', ['custom_stopping_strings']);
      updateFormatting(ctx, { stopStrings: text }, (formatting) => { formatting.stopStrings = text; });
      if (ctx.power_user) ctx.power_user.custom_stopping_strings = text;
      return text;
    },
    returns: 'custom stop strings',
  });

  registerIfMissing(registry, {
    name: 'start-reply-with',
    helpString: 'Set start-reply prefix.',
    callback: async (args, value) => {
      // ST source: power-user.js:4413-4459.
      const text = commandText(args, value, ['text']);
      updateFormatting(ctx, { startReplyWith: text }, (formatting) => { formatting.startReplyWith = text; });
      if (ctx.power_user) ctx.power_user.user_prompt_bias = text;
      return text;
    },
    returns: 'start-reply prefix',
  });

  viewModeCommand(registry, ctx, 'single', ['story'], 'story');
  viewModeCommand(registry, ctx, 'bubble', ['bubbles'], 'bubble');
  viewModeCommand(registry, ctx, 'flat', ['default'], 'default');

  // ST source: slash-commands.js:674-709; real background assets are host-managed in YdlTavern.
  registerPlanOnly(registry, {
    name: 'bg',
    aliases: ['background'],
    action: 'background.set',
    fields: ['name'],
  });

  registerUnsupported(registry, { name: 'theme', reason: 'requires live DOM theme runtime' });
  registerUnsupported(registry, { name: 'bgcol', reason: 'requires DOM color extraction from canvas' });
  registerUnsupported(registry, { name: 'movingui', reason: 'requires moving UI runtime' });
  registerUnsupported(registry, { name: 'resetpanels', aliases: ['resetui'], reason: 'requires layout panel runtime' });
  registerUnsupported(registry, { name: 'css-var', reason: 'requires DOM CSS variable manipulation' });
  registerUnsupported(registry, { name: 'vn', reason: 'requires Visual Novel mode UI runtime' });
}

function viewModeCommand(registry: BatchSlashRegistry, ctx: FormattingCapableContext, name: string, aliases: string[], displayValue: string): void {
  registerIfMissing(registry, {
    name,
    aliases,
    helpString: `Set chat display to ${displayValue}.`,
    callback: async () => {
      // ST source: power-user.js:4188-4191 area registers UI settings commands; display mode is stored on power_user.chat_display.
      if (ctx.power_user) ctx.power_user.chat_display = displayValue;
      ctx.powerUserSettings.chat_display = displayValue;
      ctx.chatMetadata.chat_display = displayValue;
      return displayValue;
    },
    returns: 'chat display mode',
  });
}

function commandText(args: Record<string, ScopeValue>, value: ScopeValue, namedKeys: readonly string[]): string {
  for (const key of namedKeys) {
    if (args[key] !== undefined) return String(args[key] ?? '');
  }
  if (args._unnamed !== undefined) return String(args._unnamed ?? '');
  return value === undefined || value === null ? '' : String(value);
}

function nullableCommandText(args: Record<string, ScopeValue>, value: ScopeValue, namedKeys: readonly string[]): string | null {
  for (const key of namedKeys) {
    if (args[key] !== undefined) return String(args[key] ?? '');
  }
  if (args._unnamed !== undefined) return String(args._unnamed ?? '');
  if (value !== undefined && value !== null && String(value) !== '') return String(value);
  return null;
}

function formatting(ctx: FormattingCapableContext): PlainRecord | undefined {
  const metadata = ctx.chatMetadata as PlainRecord | undefined;
  return ctx.formattingSettings ?? asRecord(metadata?.ydltavern_formatting);
}

function ensureFormatting(ctx: FormattingCapableContext): PlainRecord {
  const existing = formatting(ctx);
  if (existing) return existing;
  const metadata = ctx.chatMetadata as PlainRecord;
  const created: PlainRecord = {};
  metadata.ydltavern_formatting = created;
  return created;
}

function updateFormatting(ctx: FormattingCapableContext, patch: PlainRecord, fallback: (formatting: PlainRecord) => void): void {
  if (ctx.updateFormattingSettings) {
    ctx.updateFormattingSettings(patch);
    if (ctx.formattingSettings) Object.assign(ctx.formattingSettings, patch);
    else fallback(ensureFormatting(ctx));
    return;
  }
  fallback(ensureFormatting(ctx));
}

function readString(ctx: FormattingCapableContext, field: string, powerPath: readonly string[]): string {
  const current = formatting(ctx)?.[field];
  if (current !== undefined && current !== null) return String(current);
  const powerValue = readNested(ctx.power_user, powerPath);
  if (powerValue !== undefined && powerValue !== null) return String(powerValue);
  return '';
}

function readBoolean(ctx: FormattingCapableContext, field: string, powerPath: readonly string[]): boolean {
  const current = formatting(ctx)?.[field];
  if (current !== undefined && current !== null) return Boolean(current);
  const powerValue = readNested(ctx.power_user, powerPath);
  return Boolean(powerValue);
}

function setBoolean(ctx: FormattingCapableContext, field: string, value: boolean, powerPath: readonly string[]): void {
  updateFormatting(ctx, { [field]: value }, (formattingRecord) => { formattingRecord[field] = value; });
  if (powerPath.length >= 2) updateNested(ctx.power_user, powerPath.slice(0, -1), { [String(powerPath.at(-1))]: value });
}

function updateNested(root: PlainRecord | undefined, path: readonly string[], patch: PlainRecord): void {
  if (!root) return;
  let target = root;
  for (const segment of path) {
    const next = asRecord(target[segment]);
    if (next) {
      target = next;
      continue;
    }
    const created: PlainRecord = {};
    target[segment] = created;
    target = created;
  }
  Object.assign(target, patch);
}

function readNested(root: PlainRecord | undefined, path: readonly string[]): unknown {
  let current: unknown = root;
  for (const segment of path) {
    const record = asRecord(current);
    if (!record) return undefined;
    current = record[segment];
  }
  return current;
}

function asRecord(value: unknown): PlainRecord | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as PlainRecord : undefined;
}
