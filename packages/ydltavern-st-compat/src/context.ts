import type { STChatMessage } from '@ydltavern/types';
import { ST_EVENT_TYPES } from '@ydltavern/types/st';
import type { Chat } from '@ydltavern/types';
import { createSTChatProxy, type STChatProxy, type STChatProxyHooks } from './chat-proxy.js';
import { YdlTavernNotImplementedError } from './errors.js';
import { createEventSource, type STEventSource } from './events.js';

export interface STContextOptions {
  readonly chat: Chat;
  readonly chatHooks?: STChatProxyHooks;
  readonly characters?: readonly unknown[];
  readonly groups?: readonly unknown[];
  readonly extensionSettings?: Record<string, unknown>;
}

export interface STContext {
  readonly chat: STChatProxy;
  readonly eventSource: STEventSource;
  readonly event_types: typeof ST_EVENT_TYPES;
  readonly characters: readonly unknown[];
  readonly groups: readonly unknown[];
  readonly extensionSettings: Record<string, unknown>;
  readonly saveSettingsDebounced: () => never;
  readonly addOneMessage: (message: STChatMessage) => never;
  readonly saveChat: () => never;
  readonly Generate: (...args: readonly unknown[]) => never;
}

export interface STContextRuntime {
  readonly getContext: () => STContext;
  readonly context: STContext;
}

export function createSTContext(options: STContextOptions): STContextRuntime {
  const context: STContext = {
    chat: createSTChatProxy(options.chat, options.chatHooks),
    eventSource: createEventSource(),
    event_types: ST_EVENT_TYPES,
    characters: options.characters ?? [],
    groups: options.groups ?? [],
    extensionSettings: options.extensionSettings ?? {},
    saveSettingsDebounced: notImplemented('saveSettingsDebounced'),
    addOneMessage: notImplemented('addOneMessage'),
    saveChat: notImplemented('saveChat'),
    Generate: notImplemented('Generate'),
  };

  return {
    getContext: () => context,
    context,
  };
}

function notImplemented(source: string): () => never {
  return () => {
    throw new YdlTavernNotImplementedError(source);
  };
}
