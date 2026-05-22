/*
 * P5 deferred slash-command batches:
 * - Batch C: extended variable/control commands (`/addvar`, `/flushvar`, `/listvar`, `/closure-serialize`, etc.) — deferred.
 * - Batch D: characters/group (`/char-find`, `/char-update`, `/member-add`, etc.) — deferred.
 * - Batch E: messages/visibility extras (`/message-role`, `/delname`, etc.) — deferred.
 * - Batch F: WI/Injections (`/inject`, `/listinjects`, `/flushinject`, `/getpromptentry`) — deferred.
 */

import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { namedString, registerIfMissing, textValue, toBoolean, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

export function registerBatchA(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'api',
    callback: (_args, value) => {
      const api = textValue(value).trim();
      if (!api) return ctx.mainApi;
      ctx.mainApi = api;
      ctx.main_api = api;
      ctx.saveSettingsDebounced();
      return api;
    },
    returns: 'the current API',
  });

  registerIfMissing(registry, {
    name: 'model',
    callback: (_args, value) => {
      const model = textValue(value).trim();
      if (!model) return ctx.model ?? '';
      ctx.model = model;
      ctx.saveSettingsDebounced();
      return model;
    },
    returns: 'current model',
  });

  registerIfMissing(registry, {
    name: 'tokenizer',
    callback: (_args, value) => {
      const tokenizer = textValue(value).trim();
      if (!tokenizer) return ctx.tokenizerId ?? '';
      ctx.tokenizerId = tokenizer;
      ctx.saveSettingsDebounced();
      return tokenizer;
    },
    returns: 'current tokenizer',
  });

  registerIfMissing(registry, {
    name: 'closechat',
    callback: async () => {
      ctx.chat.splice(0, ctx.chat.length);
      ctx.chatId = undefined;
      await ctx.saveChat();
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'tempchat',
    callback: () => {
      ctx.temporaryChat = !ctx.temporaryChat;
      if (ctx.temporaryChat) ctx.chat.splice(0, ctx.chat.length);
      return String(ctx.temporaryChat);
    },
  });

  registerIfMissing(registry, {
    name: 'swipe',
    callback: async (args, value) => {
      const direction = (namedString(args, 'direction') ?? textValue(value) ?? '').trim().toLowerCase();
      ctx.swipeRequested = direction === 'left' ? 'left' : 'right';
      if (ctx.swipeRequested === 'left') await ctx.swipe.left();
      else await ctx.swipe.right();
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'stop',
    aliases: ['generate-stop'],
    callback: () => {
      const wasRunning = ctx.generationStopped !== true;
      ctx.generationStopped = true;
      return String(wasRunning);
    },
    returns: 'true/false, whether generation was stopped',
  });

  registerIfMissing(registry, {
    name: 'last-msg-id',
    callback: () => String(ctx.chat.length - 1),
    returns: 'index of the last message',
  });

  registerIfMissing(registry, {
    name: 'messagecount',
    aliases: ['message-count'],
    callback: () => String(ctx.chat.length),
    returns: 'message count',
  });
}

export function argIsTrue(value: ScopeValue): boolean {
  return toBoolean(value);
}
