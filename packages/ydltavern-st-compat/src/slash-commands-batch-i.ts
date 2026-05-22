// Batch I: chat/message/generation extras.
// Aligns with ST canonical commands in SillyTavern/public/scripts/slash-commands.js:405-469,
// 1204-1405, 1628-1676, 2074-2383, 2606-2685 plus power-user.js:4188-4191.

import type { STContextDeep } from './context-st.js';
import { SlashCommandAbortError, type ScopeValue } from './stscript-st.js';
import { registerIfMissing, registerPlanOnly, registerUnsupported, textValue, toBoolean, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type MutableMessageRecord = Record<string, unknown>;

export function registerBatchI(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerPlanOnly(registry, {
    name: 'delchat',
    action: 'delete_chat',
    helpString: 'Plan-only: delete current chat via host capability.',
  });

  registerIfMissing(registry, {
    name: 'renamechat',
    helpString: 'Rename current chat. Updates ctx.chatId.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:437-461; host rename is deferred, so st-compat updates ctx.chatId.
      const newName = String(args._unnamed ?? args.name ?? value ?? '').trim();
      if (!newName) throw new Error('renamechat requires a new name');
      const oldId = ctx.chatId;
      ctx.chatId = newName;
      if (ctx.chatMetadata) ctx.chatMetadata.renamed_from = oldId;
      return newName;
    },
    returns: 'the new chat id/name',
  });

  registerIfMissing(registry, {
    name: 'getchatname',
    helpString: 'Return current chat id/name.',
    callback: async () => {
      // ST source: slash-commands.js:463-469.
      return String(ctx.chatId ?? '');
    },
    returns: 'current chat id/name',
  });

  registerIfMissing(registry, {
    name: 'message-name',
    helpString: 'Change message sender display name.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:1204-1252; callback at slash-commands.js:5869-5926.
      const parsed = parseMessageNameArgs(args, value);
      const index = Number(parsed.index);
      const name = parsed.name;
      if (index < 0 || index >= ctx.chat.length) throw new Error('index out of range');
      if (!name) throw new Error('message-name requires a name');
      (ctx.chat[index] as MutableMessageRecord).name = name;
      return name;
    },
    returns: 'the updated message name',
  });

  registerIfMissing(registry, {
    name: 'sysname',
    helpString: 'Set default system narrator name in chat metadata.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:1397-1405; callback at slash-commands.js:5734-5739.
      const name = String(args.name ?? value ?? '').trim() || 'System';
      ctx.chatMetadata.narrator_name = name;
      ctx.saveMetadataDebounced();
      return name;
    },
    returns: 'the system narrator name',
  });

  registerIfMissing(registry, {
    name: 'messages',
    aliases: ['message'],
    helpString: 'Return chat messages as JSON array. Optional start/end indices.',
    callback: async (args) => {
      // ST source: slash-commands.js:2606-2660; R7 st-compat returns JSON chat slices for headless use.
      const start = args.start !== undefined ? Math.max(0, Number(args.start)) : 0;
      const end = args.end !== undefined ? Math.min(ctx.chat.length, Number(args.end)) : ctx.chat.length;
      const slice = ctx.chat.slice(start, end);
      return JSON.stringify(slice, null, 2);
    },
    returns: 'JSON array of chat messages',
  });

  registerPlanOnly(registry, {
    name: 'gen',
    action: 'generate',
    fields: ['text', 'prompt', 'trim', 'lock', 'name', 'length', 'as'],
    helpString: 'Plan-only: dispatch Generate event with prompt text.',
  });

  registerPlanOnly(registry, {
    name: 'genraw',
    action: 'generate_raw',
    fields: ['text', 'prompt', 'lock', 'instruct', 'stop', 'as', 'system', 'prefill', 'length', 'trim'],
    helpString: 'Plan-only: raw generation request via host.',
  });

  registerPlanOnly(registry, {
    name: 'sysgen',
    action: 'generate_system',
    fields: ['text', 'prompt', 'name', 'length', 'trim'],
    helpString: 'Plan-only: system message generation via host.',
  });

  registerPlanOnly(registry, {
    name: 'ask',
    action: 'ask_character',
    fields: ['text', 'prompt', 'name', 'length', 'trim'],
    helpString: 'Plan-only: ask/impersonation generation via host.',
  });

  registerIfMissing(registry, {
    name: 'addswipe',
    aliases: ['swipeadd'],
    helpString: 'Append text as a new variant/swipe on last assistant message.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:2320-2344; callback at slash-commands.js:4617-4675.
      const text = String(args._unnamed ?? args.text ?? value ?? '');
      if (!text) throw new Error('addswipe requires text');
      const targetIndex = findLastAssistantMessageIndex(ctx);
      if (targetIndex < 0) throw new Error('no assistant message to swipe');
      const message = ctx.chat[targetIndex] as MutableMessageRecord;
      const swipes = (message.swipes as string[] | undefined) ?? [String(message.mes ?? '')];
      swipes.push(text);
      message.swipes = swipes;
      message.swipe_id = swipes.length - 1;
      message.mes = text;
      return text;
    },
    returns: 'the added swipe text',
  });

  registerIfMissing(registry, {
    name: 'delswipe',
    aliases: ['swipedel'],
    helpString: 'Remove current variant from last assistant message.',
    callback: async () => {
      // ST source: slash-commands.js:2074-2106; callback at slash-commands.js:4678-4685.
      const targetIndex = findLastAssistantMessageIndex(ctx);
      if (targetIndex < 0) throw new Error('no assistant message');
      const message = ctx.chat[targetIndex] as MutableMessageRecord;
      const swipes = message.swipes as string[] | undefined;
      if (!swipes || swipes.length <= 1) throw new Error('cannot delete last variant');
      const rawCurrentId = Number(message.swipe_id ?? swipes.length - 1);
      const currentId = Number.isInteger(rawCurrentId) && rawCurrentId >= 0 && rawCurrentId < swipes.length
        ? rawCurrentId
        : swipes.length - 1;
      swipes.splice(currentId, 1);
      const newId = Math.min(currentId, swipes.length - 1);
      message.swipes = swipes;
      message.swipe_id = newId;
      message.mes = swipes[newId];
      return swipes[newId];
    },
    returns: 'the selected swipe text after deletion',
  });

  registerIfMissing(registry, {
    name: 'abort',
    helpString: 'Abort the current slash command batch execution.',
    callback: async (args, value) => {
      // ST source: slash-commands.js:2363-2380; callback at slash-commands.js:4271-4274.
      const reason = textValue(value).trim() || '/abort command executed';
      const quiet = args.quiet === undefined ? true : toBoolean(args.quiet);
      abortController(args)?.abort(reason, quiet);
      throw new SlashCommandAbortError(reason, quiet);
    },
  });

  registerPlanOnly(registry, {
    name: 'fuzzy',
    action: 'fuzzy_match',
    fields: ['list', 'threshold', 'mode', 'text'],
    helpString: 'Plan-only: fuzzy character/item search requires host matching/runtime.',
  });

  registerUnsupported(registry, {
    name: 'popup',
    reason: 'requires live DOM popup runtime; not available in headless st-compat',
  });
  registerUnsupported(registry, {
    name: 'setinput',
    reason: 'requires live DOM input element',
  });
  registerUnsupported(registry, {
    name: 'input',
    aliases: ['prompt'],
    reason: 'requires interactive prompt UI',
  });
  registerUnsupported(registry, {
    name: 'chat-manager',
    aliases: ['chat-history', 'manage-chats'],
    reason: 'requires chat manager UI',
  });
  registerUnsupported(registry, {
    name: 'panels',
    aliases: ['togglepanels'],
    reason: 'requires live UI panel runtime',
  });
  registerUnsupported(registry, {
    name: 'forcesave',
    reason: 'host-managed persistence',
  });
  registerUnsupported(registry, {
    name: 'resetpanels',
    aliases: ['resetui'],
    reason: 'requires live UI panel runtime',
  });
}

function findLastAssistantMessageIndex(ctx: STContextDeep): number {
  for (let i = ctx.chat.length - 1; i >= 0; i -= 1) {
    const message = ctx.chat[i] as MutableMessageRecord | undefined;
    if (message && !message.is_user && !message.is_system) return i;
  }
  return -1;
}

function parseMessageNameArgs(args: Record<string, ScopeValue>, value: ScopeValue): { index: ScopeValue; name: string } {
  const raw = textValue(value).trim();
  const explicitIndex = args.index ?? args.at;
  if (explicitIndex !== undefined) return { index: explicitIndex, name: String(args.name ?? raw ?? '').trim() };

  const namedMatch = raw.match(/^(?:index|at)=(-?\d+)\s+([\s\S]*)$/u);
  if (namedMatch) return { index: namedMatch[1] ?? -1, name: (namedMatch[2] ?? '').trim() };

  const positionalMatch = raw.match(/^(-?\d+)\s+([\s\S]*)$/u);
  if (positionalMatch) return { index: positionalMatch[1] ?? -1, name: (positionalMatch[2] ?? '').trim() };

  return { index: -1, name: String(args.name ?? raw ?? '').trim() };
}

function abortController(args: Record<string, ScopeValue>): { abort(reason?: string, quiet?: boolean): void } | undefined {
  const value = args._abortController;
  if (!value || typeof value !== 'object') return undefined;
  const candidate = value as { abort?: unknown };
  return typeof candidate.abort === 'function'
    ? candidate as { abort(reason?: string, quiet?: boolean): void }
    : undefined;
}
