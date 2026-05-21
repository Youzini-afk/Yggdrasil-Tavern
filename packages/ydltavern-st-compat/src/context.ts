import type { STChatMessage } from '@ydltavern/types';
import { ST_EVENT_TYPES } from '@ydltavern/types/st';
import type { Chat } from '@ydltavern/types';
import { createSTChatProxyFromStore, type STChatProxy, type STChatProxyHooks } from './chat-proxy.js';
import { createEventSource, type STEventSource } from './events.js';
import { createTurnStore } from './turn-store.js';

export interface STContextOptions {
  readonly chat: Chat;
  readonly chatHooks?: STChatProxyHooks;
  readonly characters?: readonly unknown[];
  readonly groups?: readonly unknown[];
  readonly extensionSettings?: Record<string, unknown>;
  readonly name1?: string;
  readonly name2?: string;
  readonly this_chid?: number | string;
  readonly characterId?: number | string;
  readonly groupId?: number | string;
  readonly onlineStatus?: string;
}

export interface STSaveChatResult {
  readonly ok: true;
  readonly turns: number;
}

export interface STGenerateOptions {
  readonly prompt?: string;
  readonly text?: string;
  readonly name?: string;
}

export interface STGenerateResult {
  readonly ok: true;
  readonly message: STChatMessage;
  readonly index: number;
}

export type STSubstituteParamsValues = Record<string, string | number | boolean | null | undefined>;

export interface STContext {
  readonly chat: STChatProxy;
  readonly eventSource: STEventSource;
  readonly event_types: typeof ST_EVENT_TYPES;
  readonly characters: readonly unknown[];
  readonly groups: readonly unknown[];
  readonly extensionSettings: Record<string, unknown>;
  readonly name1: string;
  readonly name2: string;
  readonly this_chid: number | string | undefined;
  readonly characterId: number | string | undefined;
  readonly groupId: number | string | undefined;
  readonly onlineStatus: string;
  generationStarted: boolean;
  readonly saveSettingsDebounced: () => void;
  readonly addOneMessage: (message: STChatMessage) => STChatMessage;
  readonly saveChat: () => STSaveChatResult;
  readonly Generate: (options?: STGenerateOptions | string) => STGenerateResult;
  readonly substituteParams: (text: string, values?: STSubstituteParamsValues) => string;
}

export interface STContextRuntime {
  readonly getContext: () => STContext;
  readonly context: STContext;
}

export function createSTContext(options: STContextOptions): STContextRuntime {
  const store = createTurnStore(options.chat);
  const eventSource = createEventSource();
  let saveSettingsDebouncedCalls = 0;

  const context: STContext = {
    chat: createSTChatProxyFromStore(store, options.chatHooks),
    eventSource,
    event_types: ST_EVENT_TYPES,
    characters: options.characters ?? [],
    groups: options.groups ?? [],
    extensionSettings: options.extensionSettings ?? {},
    name1: options.name1 ?? 'User',
    name2: options.name2 ?? 'Assistant',
    this_chid: options.this_chid,
    characterId: options.characterId,
    groupId: options.groupId,
    onlineStatus: options.onlineStatus ?? 'no_connection',
    generationStarted: false,
    saveSettingsDebounced: () => {
      saveSettingsDebouncedCalls += 1;
    },
    addOneMessage: (message) => {
      store.pushMessage(message);
      const storedMessage = store.messageAt(store.length - 1) ?? message;
      eventSource.emit(resolveEventType('MESSAGE_ADDED', ST_EVENT_TYPES.MESSAGE_RECEIVED), storedMessage, store.length - 1);
      return storedMessage;
    },
    saveChat: () => ({ ok: true, turns: store.length }),
    Generate: (generateOptions) => {
      const text = generationText(generateOptions);
      const message: STChatMessage = {
        is_user: false,
        is_system: false,
        name: generationName(generateOptions) ?? context.name2,
        mes: text,
        send_date: new Date().toISOString(),
      };

      context.generationStarted = true;
      eventSource.emit(ST_EVENT_TYPES.GENERATION_STARTED, generateOptions ?? {});
      eventSource.emit(ST_EVENT_TYPES.STREAM_TOKEN_RECEIVED, text);
      store.pushMessage(message);
      const index = store.length - 1;
      const storedMessage = store.messageAt(index) ?? message;
      eventSource.emit(ST_EVENT_TYPES.MESSAGE_RECEIVED, storedMessage, index);
      context.generationStarted = false;
      eventSource.emit(ST_EVENT_TYPES.GENERATION_ENDED, storedMessage, index);
      return { ok: true, message: storedMessage, index };
    },
    substituteParams: (text, values) => {
      const replacements: Record<string, string> = {
        user: stringifyMacroValue(values?.user) ?? context.name1,
        char: stringifyMacroValue(values?.char) ?? context.name2,
        time: stringifyMacroValue(values?.time) ?? currentTime(),
        date: stringifyMacroValue(values?.date) ?? currentDate(),
      };

      return text.replace(/{{\s*(user|char|time|date)\s*}}/g, (_match, key: string) => replacements[key] ?? '');
    },
  };

  Object.defineProperty(context.saveSettingsDebounced, 'callCount', {
    configurable: false,
    enumerable: false,
    get: () => saveSettingsDebouncedCalls,
  });

  return {
    getContext: () => context,
    context,
  };
}

function resolveEventType(name: string, fallback: string): string {
  return Object.prototype.hasOwnProperty.call(ST_EVENT_TYPES, name)
    ? (ST_EVENT_TYPES as Record<string, string>)[name] ?? fallback
    : fallback;
}

function generationText(options: STGenerateOptions | string | undefined): string {
  if (typeof options === 'string') {
    return options;
  }

  return options?.prompt ?? options?.text ?? '[ydltavern fake generation]';
}

function generationName(options: STGenerateOptions | string | undefined): string | undefined {
  return typeof options === 'string' ? undefined : options?.name;
}

function stringifyMacroValue(value: string | number | boolean | null | undefined): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value);
}

function currentTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function currentDate(): string {
  return new Date().toLocaleDateString('en-US');
}
