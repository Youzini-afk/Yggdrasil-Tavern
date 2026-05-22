// Batch M: extension lifecycle and tool registry commands.
// Aligns with ST extension commands in SillyTavern/public/scripts/extensions-slashcommands.js:87-305,
// tool registry in SillyTavern/public/scripts/tool-calling.js:258-345,
// Quick Reply commands in SillyTavern/public/scripts/extensions/quick-reply/src/SlashCommandHandler.js:78-778,
// and action loader commands in SillyTavern/public/scripts/action-loader-slashcommands.js:58-369.

import type { STContextDeep } from './context-st.js';
import { registerIfMissing, registerPlanOnly, registerUnsupported, textValue, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type ExtensionRecord = { id?: string; manifest?: { display_name?: string } };
type ExtensionActivationContext = { disabledExtensions?: Set<string> };
type ExtraBatchMContext = STContextDeep & {
  extensionRecords?: readonly ExtensionRecord[];
  extensionActivationContext?: ExtensionActivationContext;
  toolRegistry?: Array<Record<string, unknown>>;
};

const UNSUPPORTED_EXTENSION_COMMANDS: Array<{ name: string; aliases?: string[]; reason: string }> = [
  { name: 'extension-enable', reason: 'requires extension lifecycle runtime' },
  { name: 'extension-disable', reason: 'requires extension lifecycle runtime' },
  { name: 'extension-toggle', reason: 'requires extension lifecycle runtime' },
  { name: 'reload-page', reason: 'requires browser reload runtime' },
];

const UNSUPPORTED_QR_COMMANDS: Array<{ name: string; aliases?: string[] }> = [
  { name: 'qr' },
  { name: 'qrset' },
  { name: 'qr-set' },
  { name: 'qr-set-on' },
  { name: 'qr-set-off' },
  { name: 'qr-chat-set' },
  { name: 'qr-chat-set-on' },
  { name: 'qr-chat-set-off' },
  { name: 'qr-set-list' },
  { name: 'qr-list' },
  { name: 'qr-create' },
  { name: 'qr-get' },
  { name: 'qr-update' },
  { name: 'qr-delete' },
  { name: 'qr-contextadd' },
  { name: 'qr-contextdel' },
  { name: 'qr-contextclear' },
  { name: 'qr-set-create', aliases: ['qr-presetadd'] },
  { name: 'qr-set-update', aliases: ['qr-presetupdate'] },
  { name: 'qr-set-delete', aliases: ['qr-presetdelete'] },
  { name: 'qr-arg' },
  { name: 'import' },
];

const UNSUPPORTED_LOADER_COMMANDS: Array<{ name: string }> = [
  { name: 'loader-wrap' },
  { name: 'loader-show' },
  { name: 'loader-hide' },
  { name: 'loader-stop' },
];

export function registerBatchM(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as ExtraBatchMContext;

  registerIfMissing(registry, {
    name: 'extension-exists',
    aliases: ['extension-installed'],
    helpString: 'Check if an extension is installed.',
    callback: async (args, value) => {
      // ST source: extensions-slashcommands.js:265-295.
      const name = String(args._unnamed ?? args.name ?? textValue(value)).trim();
      if (!name) throw new Error('extension-exists requires extension name');
      const records = ctx.extensionRecords ?? [];
      const found = records.some((record) => record.id === name
        || record.manifest?.display_name === name
        || record.id?.toLowerCase() === name.toLowerCase());
      return found ? 'true' : 'false';
    },
    returns: 'true if the extension is installed, otherwise false',
  });

  registerIfMissing(registry, {
    name: 'extension-state',
    helpString: 'Returns extension state: enabled, disabled, or missing.',
    callback: async (args, value) => {
      // ST source: extensions-slashcommands.js:229-264.
      const name = String(args._unnamed ?? args.name ?? textValue(value)).trim();
      if (!name) throw new Error('extension-state requires extension name');
      const records = ctx.extensionRecords ?? [];
      const activation = ctx.extensionActivationContext;
      const found = records.find((record) => record.id === name);
      if (!found) return 'missing';
      if (activation?.disabledExtensions?.has(name)) return 'disabled';
      return 'enabled';
    },
    returns: 'enabled, disabled, or missing',
  });

  registerIfMissing(registry, {
    name: 'tools-list',
    aliases: ['tool-list'],
    helpString: 'List registered tools (returns JSON array).',
    callback: async () => {
      // ST source: tool-calling.js:258-263 exposes ToolManager.tools.
      const metadataTools = (ctx.chatMetadata as Record<string, unknown>).ydltavern_tools;
      const tools = (ctx.toolRegistry ?? metadataTools ?? []) as Array<Record<string, unknown>>;
      return JSON.stringify(tools.map((tool) => ({ name: tool.name, description: tool.description })), null, 2);
    },
    returns: 'JSON array of registered tools',
  });

  // ST source: tool-calling.js:269-345 defines register/unregister/invoke host-side tool registry behavior.
  registerPlanOnly(registry, {
    name: 'tools-invoke',
    aliases: ['tool-invoke'],
    action: 'tool.invoke',
    fields: ['name', 'args'],
  });
  registerPlanOnly(registry, {
    name: 'tools-register',
    aliases: ['tool-register'],
    action: 'tool.register',
    fields: ['name', 'spec', 'description'],
  });
  registerPlanOnly(registry, {
    name: 'tools-unregister',
    aliases: ['tool-unregister'],
    action: 'tool.unregister',
    fields: ['name'],
  });

  // ST source: extensions-slashcommands.js:87-228 and 297-305 need browser extension/reload runtime.
  for (const { name, aliases, reason } of UNSUPPORTED_EXTENSION_COMMANDS) {
    registerUnsupported(registry, { name, aliases, reason });
  }
  // ST source: quick-reply SlashCommandHandler.js:78-778 depends on Quick Reply UI/API runtime.
  for (const { name, aliases } of UNSUPPORTED_QR_COMMANDS) {
    registerUnsupported(registry, { name, aliases, reason: 'Quick Reply extension UI runtime not available in headless st-compat' });
  }
  // ST source: action-loader-slashcommands.js:58-369 depends on the action-loader UI overlay.
  for (const { name } of UNSUPPORTED_LOADER_COMMANDS) {
    registerUnsupported(registry, { name, reason: 'requires action-loader UI overlay' });
  }
}
