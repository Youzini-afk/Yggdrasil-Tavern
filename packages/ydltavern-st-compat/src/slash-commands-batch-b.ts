/*
 * P5 deferred slash-command batches:
 * - Batch C: extended variable/control commands (`/addvar`, `/flushvar`, `/listvar`, `/closure-serialize`, etc.) — deferred.
 * - Batch D: characters/group (`/char-find`, `/char-update`, `/member-add`, etc.) — deferred.
 * - Batch E: messages/visibility extras (`/message-role`, `/delname`, etc.) — deferred.
 * - Batch F: WI/Injections (`/inject`, `/listinjects`, `/flushinject`, `/getpromptentry`) — deferred.
 */

import type { STChatMessage } from '@ydltavern/types';
import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { mutableMessage, namedString, nowIso, parseIndex, registerIfMissing, textValue, withInsertedOrAdded, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

export function registerBatchB(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'sendas',
    rawQuotes: true,
    callback: (args, value) => {
      const parsed = parseKnownArgs(args, value, ['name', 'avatar', 'compact', 'at', 'return', 'raw']);
      const name = namedString(parsed.args, 'name')?.trim() || ctx.name2;
      const text = ctx.substituteParams(parsed.text.trim());
      const message: STChatMessage = {
        name,
        is_user: false,
        is_system: false,
        send_date: nowIso(),
        mes: text,
        swipe_id: 0,
        swipes: [text],
        extra: { api: 'manual', model: 'slash command' },
      };
      withInsertedOrAdded(ctx, message, parsed.args.at);
      return maybeReturn(parsed.args.return, text);
    },
  });

  registerIfMissing(registry, {
    name: 'send',
    rawQuotes: true,
    callback: (args, value) => {
      const parsed = parseKnownArgs(args, value, ['compact', 'at', 'name', 'return', 'raw']);
      const text = ctx.substituteParams(parsed.text.trim());
      const message: STChatMessage = {
        name: namedString(parsed.args, 'name') ?? ctx.name1,
        is_user: true,
        is_system: false,
        send_date: nowIso(),
        mes: text,
        extra: { api: 'manual', model: 'slash command' },
      };
      withInsertedOrAdded(ctx, message, parsed.args.at);
      return maybeReturn(parsed.args.return, text);
    },
  });

  registerIfMissing(registry, {
    name: 'sys',
    aliases: ['nar'],
    rawQuotes: true,
    callback: (args, value) => {
      const parsed = parseKnownArgs(args, value, ['compact', 'at', 'name', 'return', 'raw']);
      const text = ctx.substituteParams(parsed.text.trim());
      const message: STChatMessage = {
        name: namedString(parsed.args, 'name') ?? 'System',
        is_user: false,
        is_system: true,
        send_date: nowIso(),
        mes: text,
        extra: { type: 'narrator', api: 'manual', model: 'slash command' },
      };
      withInsertedOrAdded(ctx, message, parsed.args.at);
      return maybeReturn(parsed.args.return, text);
    },
  });

  registerIfMissing(registry, {
    name: 'comment',
    rawQuotes: true,
    callback: (args, value) => {
      const parsed = parseKnownArgs(args, value, ['compact', 'at', 'return', 'raw']);
      const text = ctx.substituteParams(parsed.text.trim());
      const message: STChatMessage = {
        name: 'Comment',
        is_user: false,
        is_system: true,
        send_date: nowIso(),
        mes: text,
        extra: { type: 'comment', is_hidden: true, api: 'manual', model: 'slash command' },
      };
      withInsertedOrAdded(ctx, message, parsed.args.at);
      return maybeReturn(parsed.args.return, text);
    },
  });

  registerIfMissing(registry, {
    name: 'continue',
    aliases: ['cont'],
    callback: async (_args, value) => {
      const prompt = textValue(value).trim();
      ctx.continuationRequested = true;
      if (ctx.generate) await ctx.generate('continue', prompt ? { quiet_prompt: prompt, quietToLoud: true } : {});
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'regenerate',
    aliases: ['regen'],
    callback: async () => {
      ctx.regenerationRequested = true;
      if (ctx.generate) await ctx.generate('regenerate');
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'getmessage',
    aliases: ['get-message'],
    callback: (_args, value) => {
      const index = parseIndex(textValue(value).trim(), ctx.chat.length);
      return ctx.chat[index]?.mes ?? '';
    },
  });

  registerIfMissing(registry, {
    name: 'setmessage',
    aliases: ['set-message'],
    callback: (args, value) => {
      const parsed = parseSetMessageArgs(args, value);
      const index = parseIndex(parsed.index, ctx.chat.length);
      const message = mutableMessage(ctx.chat[index]!);
      message.mes = parsed.content;
      return parsed.content;
    },
  });

  registerIfMissing(registry, {
    name: 'hide',
    callback: (_args, value) => {
      const index = parseIndex(defaultLast(value, ctx.chat.length), ctx.chat.length);
      setHidden(ctx.chat[index]!, true);
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'unhide',
    callback: (_args, value) => {
      const index = parseIndex(defaultLast(value, ctx.chat.length), ctx.chat.length);
      setHidden(ctx.chat[index]!, false);
      return '';
    },
  });
}

function maybeReturn(mode: ScopeValue, text: string): string {
  const normalized = String(mode ?? 'none').toLowerCase();
  return normalized === 'pipe' || normalized === 'text' ? text : '';
}

function parseKnownArgs(
  args: Record<string, ScopeValue>,
  value: ScopeValue,
  known: readonly string[],
): { args: Record<string, ScopeValue>; text: string } {
  const parsedArgs: Record<string, ScopeValue> = { ...args };
  let text = textValue(value).trimStart();
  const knownSet = new Set(known);
  while (text.length > 0) {
    const match = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)=/u);
    if (!match) break;
    const key = match[1] ?? '';
    if (!knownSet.has(key)) break;
    const start = key.length + 1;
    const parsed = readArgValue(text, start);
    parsedArgs[key] = parsed.value;
    text = text.slice(parsed.consumed).trimStart();
  }
  return { args: parsedArgs, text };
}

function readArgValue(input: string, start: number): { value: string; consumed: number } {
  const quote = input[start];
  if (quote === '"' || quote === "'") {
    let value = '';
    let index = start + 1;
    while (index < input.length) {
      const char = input[index] ?? '';
      if (char === '\\') {
        value += input[index + 1] ?? '';
        index += 2;
        continue;
      }
      if (char === quote) return { value, consumed: index + 1 };
      value += char;
      index += 1;
    }
    return { value, consumed: input.length };
  }
  const nextSpace = input.slice(start).search(/\s/u);
  const end = nextSpace === -1 ? input.length : start + nextSpace;
  return { value: input.slice(start, end), consumed: end };
}

function parseSetMessageArgs(args: Record<string, ScopeValue>, value: ScopeValue): { index: ScopeValue; content: string } {
  const named = Object.entries(args)[0];
  if (named) return { index: named[0], content: String(named[1] ?? '') };
  const raw = textValue(value);
  const match = raw.match(/^(\d+)=(.*)$/u);
  if (match) return { index: match[1] ?? '', content: match[2] ?? '' };
  const [index = '', ...content] = raw.split(/\s+/u);
  return { index, content: content.join(' ') };
}

function defaultLast(value: ScopeValue, length: number): ScopeValue {
  const text = textValue(value).trim();
  return text ? text : String(length - 1);
}

function setHidden(message: STChatMessage, hidden: boolean): void {
  const mutable = mutableMessage(message);
  mutable.extra = { ...(mutable.extra ?? {}), is_hidden: hidden };
}
