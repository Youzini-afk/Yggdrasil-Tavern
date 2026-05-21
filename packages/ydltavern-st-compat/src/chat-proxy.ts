import type { STChatMessage, STMessageExtra } from '@ydltavern/types';
import { activeVariant, type Chat, type JsonValue, type SubMessage, type TextSubMessage, type Turn } from '@ydltavern/types';

export interface STChatProxyHooks {
  readonly onPush?: (messages: readonly STChatMessage[]) => void;
  readonly onEdit?: (index: number, message: STChatMessage) => void;
  readonly onDelete?: (index: number, message: STChatMessage) => void;
}

export type STChatProxy = STChatMessage[];

type ArrayMutator = 'push' | 'pop' | 'splice';

const ARRAY_MUTATORS = new Set<PropertyKey>(['push', 'pop', 'splice']);

export function createSTChatProxy(chat: Chat, hooks: STChatProxyHooks = {}): STChatProxy {
  const projected = chat.turns.map(projectTurnToSTChatMessage);
  const target: STChatMessage[] = [];

  return new Proxy(target, {
    get(_target, property) {
      if (property === 'length') {
        return projected.length;
      }

      if (property === Symbol.iterator) {
        return projected[Symbol.iterator].bind(projected);
      }

      if (ARRAY_MUTATORS.has(property)) {
        return createMutator(projected, hooks, property as ArrayMutator);
      }

      if (typeof property === 'string' && isArrayIndex(property)) {
        return projected[Number(property)];
      }

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
        projected[index] = message;
        hooks.onEdit?.(index, message);
        return true;
      }

      if (property === 'length' && typeof value === 'number') {
        if (!Number.isInteger(value) || value < 0) {
          return false;
        }

        while (projected.length > value) {
          const removed = projected.pop();
          if (removed !== undefined) {
            hooks.onDelete?.(projected.length, removed);
          }
        }
        projected.length = value;
        return true;
      }

      return false;
    },

    deleteProperty(_target, property) {
      if (typeof property !== 'string' || !isArrayIndex(property)) {
        return false;
      }

      const index = Number(property);
      if (index >= projected.length) {
        return true;
      }

      const [removed] = projected.splice(index, 1);
      if (removed !== undefined) {
        hooks.onDelete?.(index, removed);
      }
      return true;
    },

    has(_target, property) {
      if (property === 'length' || property === Symbol.iterator || ARRAY_MUTATORS.has(property)) {
        return true;
      }

      if (typeof property === 'string' && isArrayIndex(property)) {
        return Number(property) < projected.length;
      }

      return property in projected;
    },

    ownKeys() {
      return [...projected.map((_message, index) => String(index)), 'length'];
    },

    getOwnPropertyDescriptor(_target, property) {
      if (property === 'length') {
        return {
          configurable: false,
          enumerable: false,
          value: projected.length,
          writable: true,
        };
      }

      if (typeof property === 'string' && isArrayIndex(property) && Number(property) < projected.length) {
        return {
          configurable: true,
          enumerable: true,
          value: projected[Number(property)],
          writable: true,
        };
      }

      return undefined;
    },
  }) as STChatProxy;
}

export function projectTurnToSTChatMessage(turn: Turn): STChatMessage {
  const variant = activeVariant(turn);
  const subs = variant?.subs ?? [];
  const extra = projectExtra(subs);
  const message: STChatMessage = {
    is_user: turn.role === 'user',
    is_system: turn.role === 'system',
    name: turn.speaker?.name,
    send_date: new Date(turn.created_at).toISOString(),
    mes: projectMainText(subs),
    swipe_id: turn.active_variant,
    swipes: turn.variants.map((candidate) => projectMainText(candidate.subs)),
    extra,
  };

  return message;
}

function createMutator(projected: STChatMessage[], hooks: STChatProxyHooks, mutator: ArrayMutator): unknown {
  if (mutator === 'push') {
    return (...items: readonly STChatMessage[]): number => {
      projected.push(...items);
      if (items.length > 0) {
        hooks.onPush?.(items);
      }
      return projected.length;
    };
  }

  if (mutator === 'pop') {
    return (): STChatMessage | undefined => {
      const removed = projected.pop();
      if (removed !== undefined) {
        hooks.onDelete?.(projected.length, removed);
      }
      return removed;
    };
  }

  return (start: number, deleteCount?: number, ...items: readonly STChatMessage[]): STChatMessage[] => {
    const normalizedStart = normalizeSpliceStart(start, projected.length);
    const effectiveDeleteCount = deleteCount ?? projected.length - normalizedStart;
    const removed = projected.splice(start, effectiveDeleteCount, ...items);

    removed.forEach((message, offset) => {
      hooks.onDelete?.(normalizedStart + offset, message);
    });

    items.forEach((message, offset) => {
      hooks.onEdit?.(normalizedStart + offset, message);
    });

    return removed;
  };
}

function projectMainText(subs: readonly SubMessage[]): string {
  return subs
    .filter(isMainTextSubMessage)
    .map((sub) => sub.text)
    .join('\n');
}

function isMainTextSubMessage(sub: SubMessage): sub is TextSubMessage {
  return sub.kind === 'text' && (sub.segment_role === undefined || sub.segment_role === 'main');
}

function projectExtra(subs: readonly SubMessage[]): STMessageExtra | undefined {
  const reasoning = subs
    .filter((sub) => sub.kind === 'thinking')
    .map((sub) => sub.text)
    .join('\n');
  const toolInvocations = subs.flatMap((sub) => projectToolInvocation(sub));
  const notes = subs.filter((sub) => sub.kind === 'note').map((sub) => sub.text);

  const extra: STMessageExtra = {
    ...(reasoning.length > 0 ? { reasoning } : {}),
    ...(toolInvocations.length > 0 ? { tool_invocations: toolInvocations } : {}),
    ...(notes.length > 0 ? { notes } : {}),
  };

  return Object.keys(extra).length > 0 ? extra : undefined;
}

function projectToolInvocation(sub: SubMessage): readonly Record<string, unknown>[] {
  if (sub.kind === 'tool_call') {
    return [
      {
        type: 'tool_call',
        call_id: sub.call_id,
        tool: sub.tool,
        arguments: jsonValueToUnknown(sub.arguments),
      },
    ];
  }

  if (sub.kind === 'tool_result') {
    return [
      {
        type: 'tool_result',
        call_id: sub.call_id,
        status: sub.status,
        result: jsonValueToUnknown(sub.result),
      },
    ];
  }

  return [];
}

function jsonValueToUnknown(value: JsonValue): unknown {
  return value;
}

function asSTChatMessage(value: unknown): STChatMessage {
  if (typeof value !== 'object' || value === null) {
    throw new TypeError('ST chat messages must be objects');
  }

  return value as STChatMessage;
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
