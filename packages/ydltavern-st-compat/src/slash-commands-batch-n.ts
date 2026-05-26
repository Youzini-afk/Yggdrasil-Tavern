// Batch N: debug/developer/secret commands.
// Aligns with ST parser/debug registrations in SillyTavern/public/scripts/slash-commands/SlashCommandParser.js:150-185
// and secret command registrations in SillyTavern/public/scripts/secrets.js:767-1134.

import { isValidSecretRef } from '@ydltavern/engine-core';
import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { registerIfMissing, registerPlanOnly, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type PlainRecord = Record<string, unknown>;

export function registerBatchN(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep & { parserFlags?: Record<string, boolean> };

  registerIfMissing(registry, {
    name: '?',
    aliases: ['help'],
    helpString: 'List registered slash commands. Pass name= for specific help.',
    callback: async (args, value) => {
      const name = String(args._unnamed ?? args.name ?? value ?? '').trim();
      const allCommands = registry.list();
      if (!name) {
        const lines = allCommands.map((command) => `/${command.name} — ${command.helpString ?? '(no description)'}`);
        return lines.sort().join('\n');
      }
      const found = allCommands.find((command) => command.name === name || command.aliases?.includes(name));
      if (!found) return `No command found: ${name}`;
      return `/${found.name}${found.aliases ? ` (aliases: ${found.aliases.join(', ')})` : ''} — ${found.helpString ?? ''}`;
    },
    returns: 'command list or command help',
  });

  registerIfMissing(registry, {
    name: 'parser-flag',
    helpString: 'Get or set a parser flag (STRICT_ESCAPING, REPLACE_GETVAR, etc).',
    callback: async (args, value) => {
      // ST source: SlashCommandParser.js:150-167 registers /parser-flag with parser-flag enum + boolean state.
      const [positionalFlag, positionalValue] = splitParserFlagValue(value);
      const flag = String(args.flag ?? args.name ?? positionalFlag ?? '').trim();
      if (!flag) throw new Error('parser-flag requires flag=NAME');

      const rawValue = args.value ?? args.state ?? args.enabled ?? positionalValue;
      const parserFlags = getParserFlags(ctx);
      if (rawValue === undefined || rawValue === null || String(rawValue).trim() === '') {
        return String(parserFlags[flag] ?? false);
      }

      const next = booleanValue(rawValue);
      parserFlags[flag] = next;
      return String(next);
    },
    returns: 'parser flag state',
  });

  registerIfMissing(registry, {
    name: 'breakpoint',
    helpString: 'Trigger a JS debugger breakpoint (effective only when devtools is open).',
    callback: async () => {
      // ST source: SlashCommandParser.js:181-185 registers /breakpoint for QR Editor debugging.
      // eslint-disable-next-line no-debugger
      debugger;
      return '';
    },
  });

  registerPlanOnly(registry, {
    name: 'secret-id',
    aliases: ['secret-rotate'],
    action: 'secret.rotate',
    fields: ['name'],
    helpString: 'Plan-only: rotate/create an active secret reference by name.',
  });

  registerPlanOnly(registry, {
    name: 'secret-delete',
    action: 'secret.delete',
    fields: ['name'],
    helpString: 'Plan-only: delete a secret entry by reference name.',
  });

  registerIfMissing(registry, {
    name: 'secret-write',
    helpString: 'Plan-only: write a secret_ref. Raw values are rejected.',
    callback: async (args, value) => {
      // ST source: secrets.js:910-987 writes raw server-side secret values; st-compat only plans secret_ref writes.
      const name = String(args._unnamed ?? args.name ?? value ?? '').trim();
      const ref = String(args.ref ?? args.value ?? '').trim();
      if (!name) throw new Error('secret-write requires name');
      if (!ref) throw new Error('secret-write requires ref=secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME');
      if (!isValidSecretRef(ref)) {
        throw new Error('secret-write only accepts secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME; raw and unsupported values are rejected');
      }
      return JSON.stringify({
        planned: true,
        action: 'secret.write',
        fields: { name, ref },
      });
    },
  });

  registerPlanOnly(registry, {
    name: 'secret-rename',
    action: 'secret.rename',
    fields: ['old', 'new'],
    helpString: 'Plan-only: rename a secret reference.',
  });

  registerPlanOnly(registry, {
    name: 'secret-read',
    aliases: ['secret-find', 'secret-get'],
    action: 'secret.read',
    fields: ['name'],
    helpString: 'Plan-only: read a secret_ref string only; raw secret values are never exposed.',
  });
}

function splitParserFlagValue(value: ScopeValue): [string | undefined, string | undefined] {
  const text = String(value ?? '').trim();
  if (!text) return [undefined, undefined];
  const [flag, ...rest] = text.split(/\s+/u);
  return [flag, rest.length > 0 ? rest.join(' ') : undefined];
}

function getParserFlags(ctx: STContextDeep & { parserFlags?: Record<string, boolean> }): Record<string, boolean> {
  if (ctx.parserFlags) return ctx.parserFlags;
  const metadata = ctx.chatMetadata as PlainRecord;
  const existing = metadata.parser_flags;
  if (isBooleanRecord(existing)) return existing;
  const created: Record<string, boolean> = {};
  metadata.parser_flags = created;
  return created;
}

function booleanValue(value: ScopeValue): boolean {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes';
}

function isBooleanRecord(value: unknown): value is Record<string, boolean> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
