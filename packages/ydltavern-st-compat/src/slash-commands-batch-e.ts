import type { STChatMessage } from '@ydltavern/types';
import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { mutableMessage, namedString, parseIndex, registerIfMissing, textValue, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type MessageRole = 'user' | 'assistant' | 'system';
type MutableChatMessage = STChatMessage & { is_user?: boolean; is_system?: boolean; extra?: Record<string, unknown>; mes?: string };

interface ButtonHint {
  text: string;
  icon?: string;
  tooltip?: string;
  [key: string]: unknown;
}

export function registerBatchE(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'message-role',
    callback: (args, value) => {
      // ST source: public/scripts/slash-commands.js:1162-1202 registers /message-role;
      // callback role mutation is slash-commands.js:5820-5860. R2 uses index=/role= named args.
      const index = parseMessageIndex(args, value, ctx.chat.length);
      const role = parseRole(namedString(args, 'role') ?? positionalRole(value));
      const message = mutableChatMessage(ctx.chat[index]!);
      message.is_user = role === 'user';
      message.is_system = role === 'system';
      if (role === 'system') message.extra = { ...(message.extra ?? {}), type: 'narrator' };
      else if (message.extra) {
        const extra = { ...message.extra };
        delete extra.type;
        message.extra = extra;
      }
      return role;
    },
    returns: 'the updated message role',
  });

  registerIfMissing(registry, {
    name: 'delfirst',
    callback: () => {
      // Frontier R2 compatibility helper; no exact ST /delfirst registration was found.
      if (ctx.chat.length > 0) ctx.chat.splice(0, 1);
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'dellast',
    callback: () => {
      // ST has deleteLastMessage on getContext(): public/scripts/st-context.js:51,140;
      // Frontier R2 exposes it as a no-op-on-empty slash helper.
      if (ctx.chat.length > 0) ctx.chat.splice(ctx.chat.length - 1, 1);
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'delname',
    callback: (args, value) => {
      // ST source: slash-commands.js:1704-1729 registers /delname; callback at
      // slash-commands.js:5047-5080 deletes every message whose resolved name matches.
      const name = (namedString(args, 'name') ?? textValue(value)).trim();
      if (!name) throw new Error('Message name cannot be empty');
      let deleted = 0;
      for (let index = ctx.chat.length - 1; index >= 0; index -= 1) {
        if (ctx.chat[index]?.name === name) {
          ctx.chat.splice(index, 1);
          deleted += 1;
        }
      }
      return String(deleted);
    },
    returns: 'number of deleted messages',
  });

  registerIfMissing(registry, {
    name: 'cut',
    callback: (args, value) => {
      // ST source: public/scripts/power-user.js:4157-4186 registers /cut and
      // power-user.js:2821-2853 deletes an inclusive range. R2 defines a half-open [start,end) range.
      const { start, end } = parseCutRange(args, value, ctx.chat.length);
      const deleted = ctx.chat.splice(start, end - start);
      return deleted.map((message) => message.mes ?? '').join('\n');
    },
    returns: 'the text of cut messages separated by a newline',
  });

  registerIfMissing(registry, {
    name: 'hide-all',
    callback: () => {
      // ST /hide is registered at slash-commands.js:1835-1856 and implemented at
      // slash-commands.js:4773-4783; R2 adds all-chat extra.is_hidden metadata for surfaces.
      for (const message of ctx.chat) setHidden(message, true);
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'unhide-all',
    callback: () => {
      // ST /unhide is registered at slash-commands.js:1858-1879 and implemented at
      // slash-commands.js:4786-4796; R2 adds all-chat extra.is_hidden metadata for surfaces.
      for (const message of ctx.chat) setHidden(message, false);
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'buttons',
    callback: (args, value) => {
      // ST source: slash-commands.js:2773-2818 registers /buttons; callback at
      // slash-commands.js:4019-4090 renders a popup. Offline port stores metadata only.
      const message = lastMutableMessage(ctx);
      const buttons = parseButtons(args, value);
      message.extra = { ...(message.extra ?? {}), buttons };
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'reply-buttons',
    callback: (args, value) => {
      // Frontier R2 UI hint. No exact ST /reply-buttons slash registration was found;
      // metadata mirrors /buttons for reply-area rendering by @ydltavern/surface.
      const message = lastMutableMessage(ctx);
      const buttons = parseButtons(args, value);
      message.extra = { ...(message.extra ?? {}), reply_buttons: buttons };
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'messageedit',
    callback: (args, value) => {
      // Batch B registers /setmessage and /set-message only; no /messageedit alias exists there.
      // Registry has no alias-only API, so this command mirrors /setmessage semantics.
      const parsed = parseSetMessageArgs(args, value);
      const index = parseIndex(parsed.index, ctx.chat.length);
      const message = mutableMessage(ctx.chat[index]!);
      message.mes = parsed.content;
      return parsed.content;
    },
  });
}

function mutableChatMessage(message: STChatMessage): MutableChatMessage {
  return message as MutableChatMessage;
}

function parseMessageIndex(args: Record<string, ScopeValue>, value: ScopeValue, length: number): number {
  const raw = namedString(args, 'index') ?? namedString(args, 'at') ?? defaultLastIndex(value, length);
  return parseIndex(raw, length);
}

function defaultLastIndex(value: ScopeValue, length: number): ScopeValue {
  const raw = textValue(value).trim();
  const first = raw.split(/\s+/u)[0] ?? '';
  return first && /^-?\d+$/u.test(first) ? first : String(length - 1);
}

function positionalRole(value: ScopeValue): string {
  const raw = textValue(value).trim();
  const parts = raw.split(/\s+/u).filter(Boolean);
  return parts.length > 1 && /^-?\d+$/u.test(parts[0] ?? '') ? parts.slice(1).join(' ') : raw;
}

function parseRole(raw: string | undefined): MessageRole {
  const role = String(raw ?? '').trim().toLowerCase();
  if (role === 'user' || role === 'assistant' || role === 'system') return role;
  throw new Error(`Invalid message role: ${String(raw ?? '')}`);
}

function parseSetMessageArgs(args: Record<string, ScopeValue>, value: ScopeValue): { index: ScopeValue; content: string } {
  const namedIndex = args.index ?? args.at;
  if (namedIndex !== undefined) return { index: namedIndex, content: textValue(value) };
  const named = Object.entries(args)[0];
  if (named) return { index: named[0], content: String(named[1] ?? '') };
  const raw = textValue(value);
  const match = raw.match(/^(\d+)=(.*)$/u);
  if (match) return { index: match[1] ?? '', content: match[2] ?? '' };
  const [index = '', ...content] = raw.split(/\s+/u);
  return { index, content: content.join(' ') };
}

function parseCutRange(args: Record<string, ScopeValue>, value: ScopeValue, length: number): { start: number; end: number } {
  const namedStart = args.start;
  const namedEnd = args.end;
  if (namedStart !== undefined || namedEnd !== undefined) {
    if (namedStart === undefined || namedEnd === undefined) throw new Error('Both start and end are required for /cut');
    return validateCutRange(namedStart, namedEnd, length);
  }

  const raw = textValue(value).trim();
  const rangeMatch = raw.match(/^(\d+)\s*[-:]\s*(\d+)$/u);
  if (rangeMatch) return validateCutRange(rangeMatch[1] ?? '', rangeMatch[2] ?? '', length);
  const [start = '', end = ''] = raw.split(/\s+/u);
  return validateCutRange(start, end, length);
}

function validateCutRange(rawStart: ScopeValue, rawEnd: ScopeValue, length: number): { start: number; end: number } {
  const start = Number(rawStart);
  const end = Number(rawEnd);
  if (!Number.isInteger(start) || !Number.isInteger(end)) throw new Error(`Invalid cut range: ${String(rawStart)}..${String(rawEnd)}`);
  if (start < 0 || end < 0 || start > length || end > length || start > end) {
    throw new Error(`Invalid cut range: ${start}..${end}`);
  }
  return { start, end };
}

function setHidden(message: STChatMessage, hidden: boolean): void {
  const mutable = mutableMessage(message);
  mutable.extra = { ...(mutable.extra ?? {}), is_hidden: hidden };
}

function lastMutableMessage(ctx: STContextDeep): MutableChatMessage {
  if (ctx.chat.length === 0) throw new Error('Cannot attach buttons without a chat message');
  return mutableChatMessage(ctx.chat[ctx.chat.length - 1]!);
}

function parseButtons(args: Record<string, ScopeValue>, value: ScopeValue): ButtonHint[] {
  const raw = namedString(args, 'labels') ?? namedString(args, 'label') ?? textValue(value);
  const buttons = parseButtonList(raw);
  if (buttons.length === 0) throw new Error('At least one button label is required');
  return buttons;
}

function parseButtonList(raw: string): ButtonHint[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith('[')) {
    const parsed = JSON.parse(trimmed) as unknown;
    if (!Array.isArray(parsed)) throw new Error('Button labels must be an array');
    return parsed.map(normalizeButton);
  }
  return trimmed.split(',').map((label) => normalizeButton(label.trim())).filter((button) => button.text.length > 0);
}

function normalizeButton(value: unknown): ButtonHint {
  if (typeof value === 'string') return { text: value };
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    if (typeof record.text === 'string' && record.text.trim()) return { ...record, text: record.text } as ButtonHint;
  }
  throw new Error('Button labels must be strings or objects with text');
}
