import type { STChatMessage, STMessageExtra } from '@ydltavern/types';
import type { Chat } from '@ydltavern/types';
import {
  createTurnStore,
  type STChatMessagePatch,
  type STChatProxyMessage,
  type TurnStore,
} from './turn-store.js';

export interface STChatProxyHooks {
  readonly onPush?: (messages: readonly STChatMessage[]) => void;
  readonly onEdit?: (index: number, message: STChatMessage) => void;
  readonly onDelete?: (index: number, message: STChatMessage) => void;
}

export type STChatProxy = STChatProxyMessage[];

type ArrayMutator = 'push' | 'pop' | 'splice';

const ARRAY_MUTATORS = new Set<PropertyKey>(['push', 'pop', 'splice']);
const MESSAGE_PATCH_PROPERTIES = new Set<PropertyKey>(['mes', 'name', 'is_user', 'is_system', 'extra']);

export function createSTChatProxy(chat: Chat, hooks: STChatProxyHooks = {}): STChatProxy {
  return createSTChatProxyFromStore(createTurnStore(chat), hooks);
}

export function createSTChatProxyFromStore(store: TurnStore, hooks: STChatProxyHooks = {}): STChatProxy {
  const target: STChatMessage[] = [];

  return new Proxy(target, {
    get(_target, property) {
      if (property === 'length') {
        return store.length;
      }

      if (property === Symbol.iterator) {
        return function* iterator(): IterableIterator<STChatProxyMessage> {
          for (let index = 0; index < store.length; index += 1) {
            const message = store.messageAt(index);
            if (message !== undefined) {
              yield createMessageProxy(store, hooks, index, message);
            }
          }
        };
      }

      if (ARRAY_MUTATORS.has(property)) {
        return createMutator(store, hooks, property as ArrayMutator);
      }

      if (typeof property === 'string' && isArrayIndex(property)) {
        const index = Number(property);
        const message = store.messageAt(index);
        return message === undefined ? undefined : createMessageProxy(store, hooks, index, message);
      }

      const projected = store.messages();
      const value = Reflect.get(projected, property, projected) as unknown;
      if (typeof value === 'function') {
        return value.bind(projected);
      }

      return value;
    },

    set(_target, property, value) {
      if (typeof property === 'string' && isArrayIndex(property)) {
        const message = asSTChatMessage(value);
        const index = Number(property);
        if (index < store.length) {
          store.updateMessage(index, messageToPatch(message));
          hooks.onEdit?.(index, store.messageAt(index) ?? message);
        } else if (index === store.length) {
          store.pushMessage(message);
          hooks.onPush?.([message]);
        } else {
          return false;
        }
        return true;
      }

      if (property === 'length' && typeof value === 'number') {
        if (!Number.isInteger(value) || value < 0) {
          return false;
        }

        while (store.length > value) {
          const removedIndex = store.length - 1;
          const removed = store.messageAt(removedIndex);
          if (removed !== undefined) {
            store.deleteMessage(removedIndex);
            hooks.onDelete?.(removedIndex, removed);
          }
        }
        return true;
      }

      return false;
    },

    deleteProperty(_target, property) {
      if (typeof property !== 'string' || !isArrayIndex(property)) {
        return false;
      }

      const index = Number(property);
      if (index >= store.length) {
        return true;
      }

      const removed = store.messageAt(index);
      if (removed !== undefined) {
        store.deleteMessage(index);
        hooks.onDelete?.(index, removed);
      }
      return true;
    },

    has(_target, property) {
      if (property === 'length' || property === Symbol.iterator || ARRAY_MUTATORS.has(property)) {
        return true;
      }

      if (typeof property === 'string' && isArrayIndex(property)) {
        return Number(property) < store.length;
      }

      const projected = store.messages();
      return property in projected;
    },
  }) as STChatProxy;
}

export { projectTurnToSTChatMessage } from './turn-store.js';

function createMutator(store: TurnStore, hooks: STChatProxyHooks, mutator: ArrayMutator): unknown {
  if (mutator === 'push') {
    return (...items: readonly STChatMessage[]): number => {
      items.forEach((item) => store.pushMessage(item));
      if (items.length > 0) {
        hooks.onPush?.(items);
      }
      return store.length;
    };
  }

  if (mutator === 'pop') {
    return (): STChatMessage | undefined => {
      const removedIndex = store.length - 1;
      const removed = removedIndex >= 0 ? store.messageAt(removedIndex) : undefined;
      if (removed !== undefined) {
        store.deleteMessage(removedIndex);
        hooks.onDelete?.(removedIndex, removed);
      }
      return removed;
    };
  }

  return (start: number, deleteCount?: number, ...items: readonly STChatMessage[]): STChatMessage[] => {
    const normalizedStart = normalizeSpliceStart(start, store.length);
    const effectiveDeleteCount = deleteCount ?? store.length - normalizedStart;
    const removed = store.messages().slice(normalizedStart, normalizedStart + effectiveDeleteCount);
    store.spliceMessages(normalizedStart, effectiveDeleteCount, ...items);

    removed.forEach((message, offset) => {
      hooks.onDelete?.(normalizedStart + offset, message);
    });

    items.forEach((message, offset) => {
      hooks.onEdit?.(normalizedStart + offset, message);
    });

    return removed;
  };
}

function createMessageProxy(
  store: TurnStore,
  hooks: STChatProxyHooks,
  index: number,
  message: STChatMessage,
): STChatProxyMessage {
  const target = { ...message } as STChatProxyMessage;

  return new Proxy(target, {
    set(proxyTarget, property, value) {
      if (!MESSAGE_PATCH_PROPERTIES.has(property)) {
        return Reflect.set(proxyTarget, property, value);
      }

      const patch = createPatch(property, value);
      const updated = store.updateMessage(index, patch);
      if (updated === undefined) {
        return false;
      }

      Reflect.set(proxyTarget, property, value);
      hooks.onEdit?.(index, store.messageAt(index) ?? message);
      return true;
    },
  });
}

function createPatch(property: PropertyKey, value: unknown): STChatMessagePatch {
  if (property === 'mes') {
    if (typeof value !== 'string' && value !== undefined) {
      throw new TypeError('ST message mes must be a string');
    }
    return { mes: value };
  }

  if (property === 'name') {
    if (typeof value !== 'string' && value !== undefined) {
      throw new TypeError('ST message name must be a string');
    }
    return { name: value };
  }

  if (property === 'is_user') {
    if (typeof value !== 'boolean' && value !== undefined) {
      throw new TypeError('ST message is_user must be a boolean');
    }
    return { is_user: value };
  }

  if (property === 'is_system') {
    if (typeof value !== 'boolean' && value !== undefined) {
      throw new TypeError('ST message is_system must be a boolean');
    }
    return { is_system: value };
  }

  if (value !== undefined && !isRecord(value)) {
    throw new TypeError('ST message extra must be an object');
  }
  return { extra: value as STMessageExtra | undefined };
}

function messageToPatch(message: STChatMessage): STChatMessagePatch {
  return {
    mes: message.mes,
    name: message.name,
    is_user: message.is_user,
    is_system: message.is_system,
    extra: message.extra,
  };
}

function asSTChatMessage(value: unknown): STChatMessage {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('ST chat messages must be objects');
  }

  return value as STChatMessage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isArrayIndex(property: string): boolean {
  if (property.length === 0) {
    return false;
  }

  const index = Number(property);
  return Number.isInteger(index) && index >= 0 && index < 2 ** 32 - 1 && String(index) === property;
}

function normalizeSpliceStart(start: number, length: number): number {
  if (start < 0) {
    return Math.max(length + start, 0);
  }

  return Math.min(start, length);
}
