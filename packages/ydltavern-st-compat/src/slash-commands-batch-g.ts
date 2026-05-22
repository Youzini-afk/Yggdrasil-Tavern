/*
 * P5 deferred slash-command batches:
 * - Batch C: extended variable/control commands (`/addvar`, `/flushvar`, `/listvar`, `/closure-serialize`, etc.) — deferred.
 * - Batch D: characters/group (`/char-find`, `/char-update`, `/member-add`, etc.) — deferred.
 * - Batch E: messages/visibility extras (`/message-role`, `/delname`, etc.) — deferred.
 * - Batch F: WI/Injections (`/inject`, `/listinjects`, `/flushinject`, `/getpromptentry`) — deferred.
 */

import type { ScopeValue } from './stscript-st.js';
import { registerIfMissing, textValue, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

export function registerBatchG(registry: BatchSlashRegistry, _options: BatchSlashOptions): void {
  registerIfMissing(registry, { name: 'echo', rawQuotes: true, callback: (_args, value) => textValue(value), returns: 'the text' });
  registerIfMissing(registry, { name: 'upper', aliases: ['uppercase', 'to-upper'], callback: (_args, value) => textValue(value).toUpperCase() });
  registerIfMissing(registry, { name: 'lower', aliases: ['lowercase', 'to-lower'], callback: (_args, value) => textValue(value).toLowerCase() });
  registerIfMissing(registry, { name: 'trim', callback: (_args, value) => textValue(value).trim() });
  registerIfMissing(registry, { name: 'length', aliases: ['len'], callback: (_args, value) => String(textValue(value).length) });
  registerIfMissing(registry, {
    name: 'substring',
    aliases: ['substr'],
    callback: (_args, value) => {
      const [startRaw = '0', endRaw = '', ...textParts] = textValue(value).split(/\s+/u);
      const start = Number(startRaw);
      const end = endRaw === '' ? undefined : Number(endRaw);
      const text = textParts.join(' ');
      return text.slice(Number.isFinite(start) ? start : 0, Number.isFinite(end) ? end : undefined);
    },
  });
  registerIfMissing(registry, {
    name: 'replace',
    aliases: ['re'],
    callback: (args, value) => {
      const named = Object.entries(args)[0];
      const raw = textValue(value);
      if (named) return raw.replaceAll(named[0], String(named[1] ?? ''));
      const [assignment = '', ...textParts] = raw.split(/\s+/u);
      const equals = assignment.indexOf('=');
      if (equals <= 0) throw new Error('Expected /replace old=new text');
      return textParts.join(' ').replaceAll(assignment.slice(0, equals), assignment.slice(equals + 1));
    },
  });
  registerIfMissing(registry, {
    name: 'concat',
    callback: (args, value) => {
      const values = Object.values(args).map((v) => String(v ?? ''));
      return values.length > 0 ? values.join('') : textValue(value).replace(/\s+/gu, '');
    },
  });
  registerIfMissing(registry, { name: 'reverse', callback: (_args, value) => [...textValue(value)].reverse().join('') });
  registerIfMissing(registry, {
    name: 'delay',
    aliases: ['wait', 'sleep'],
    callback: async (_args, value) => {
      const ms = Math.max(0, Number(textValue(value).trim()) || 0);
      await new Promise((resolve) => setTimeout(resolve, ms));
      return '';
    },
  });
}

export function stringifyScopeValue(value: ScopeValue): string {
  return textValue(value);
}
