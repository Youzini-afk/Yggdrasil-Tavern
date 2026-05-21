import { ST_EVENT_TYPES, type STEventType } from '@ydltavern/types/st';

export type STEventName = STEventType | (string & {});
export type STEventListener = (...args: readonly unknown[]) => void;

export interface STEventSource {
  readonly eventTypes: typeof ST_EVENT_TYPES;
  on(eventName: STEventName, listener: STEventListener): this;
  once(eventName: STEventName, listener: STEventListener): this;
  off(eventName: STEventName, listener: STEventListener): this;
  emit(eventName: STEventName, ...args: readonly unknown[]): boolean;
  listenerCount(eventName: STEventName): number;
}

interface ListenerEntry {
  readonly listener: STEventListener;
  readonly once: boolean;
}

export function createEventSource(): STEventSource {
  const listeners = new Map<string, ListenerEntry[]>();

  const source: STEventSource = {
    eventTypes: ST_EVENT_TYPES,

    on(eventName, listener) {
      addListener(listeners, eventName, listener, false);
      return this;
    },

    once(eventName, listener) {
      addListener(listeners, eventName, listener, true);
      return this;
    },

    off(eventName, listener) {
      const key = eventKey(eventName);
      const current = listeners.get(key);
      if (current === undefined) {
        return this;
      }

      const next = current.filter((entry) => entry.listener !== listener);
      if (next.length === 0) {
        listeners.delete(key);
      } else {
        listeners.set(key, next);
      }

      return this;
    },

    emit(eventName, ...args) {
      const key = eventKey(eventName);
      const current = listeners.get(key);
      if (current === undefined || current.length === 0) {
        return false;
      }

      const snapshot = [...current];
      for (const entry of snapshot) {
        entry.listener(...args);
        if (entry.once) {
          source.off(eventName, entry.listener);
        }
      }

      return true;
    },

    listenerCount(eventName) {
      return listeners.get(eventKey(eventName))?.length ?? 0;
    },
  };

  return source;
}

function addListener(
  listeners: Map<string, ListenerEntry[]>,
  eventName: STEventName,
  listener: STEventListener,
  once: boolean,
): void {
  const key = eventKey(eventName);
  const current = listeners.get(key) ?? [];
  listeners.set(key, [...current, { listener, once }]);
}

function eventKey(eventName: STEventName): string {
  return eventName;
}
