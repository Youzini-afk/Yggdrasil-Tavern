//! Streaming capability invocation over the surface-host postMessage bridge.
//!
//! Returns an AsyncIterable<StreamFrame> that the caller awaits. When the caller
//! is done (or wants to abort), call handle.cancel() to send
//! kernel.v1.capability.cancel and unsubscribe.

import { callHostRpc, getActiveSessionId } from './index.js';

export interface StreamFrame {
  kind: 'started' | 'chunk' | 'progress' | 'ended' | 'error' | 'cancelled' | 'timeout';
  payload: unknown;
}

export interface StreamHandle {
  streamId: string;
  frames: AsyncIterable<StreamFrame>;
  cancel(): Promise<void>;
}

interface StreamFrameMessage {
  type: 'stream.frame';
  subscription_id: string;
  kind: 'started' | 'chunk' | 'progress';
  payload: unknown;
}

interface StreamEndedMessage {
  type: 'stream.ended';
  subscription_id: string;
}

interface StreamErrorMessage {
  type: 'stream.error';
  subscription_id: string;
  error: { code: string; message: string };
}

let nextSubscriptionId = 1;

function newSubscriptionId(): string {
  return `sub-${nextSubscriptionId++}-${Date.now()}`;
}

/**
 * Minimal async queue with push + close + iter.
 * Allows producer (postMessage handler) and consumer (for-await) to be decoupled.
 */
class AsyncQueue<T> {
  private items: T[] = [];
  private resolvers: Array<(v: IteratorResult<T>) => void> = [];
  private closed = false;

  push(item: T): void {
    if (this.closed) return;
    const r = this.resolvers.shift();
    if (r) r({ value: item, done: false });
    else this.items.push(item);
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    for (const r of this.resolvers) r({ value: undefined as unknown as T, done: true });
    this.resolvers.length = 0;
  }

  iter(): AsyncIterable<T> {
    const queue = this;
    return {
      [Symbol.asyncIterator](): AsyncIterator<T> {
        return {
          next(): Promise<IteratorResult<T>> {
            const item = queue.items.shift();
            if (item !== undefined) return Promise.resolve({ value: item, done: false });
            if (queue.closed) return Promise.resolve({ value: undefined as unknown as T, done: true });
            return new Promise((resolve) => queue.resolvers.push(resolve));
          },
          return(): Promise<IteratorResult<T>> {
            queue.close();
            return Promise.resolve({ value: undefined as unknown as T, done: true });
          },
        };
      },
    };
  }
}

/**
 * Start a streaming capability invocation.
 *
 * Calls kernel.v1.capability.stream to obtain stream_id, then subscribes via
 * postMessage. Returns a handle whose `frames` is an AsyncIterable. Caller must
 * either consume to completion (which auto-cleans up) or call cancel().
 */
export async function streamCapability(
  capabilityId: string,
  input: unknown,
): Promise<StreamHandle> {
  const sessionId = getActiveSessionId();
  if (!sessionId) {
    throw new Error('streamCapability requires active session id (set via mount initialProps)');
  }

  // 1. Start stream via kernel.v1.capability.stream
  const start = await callHostRpc('kernel.v1.capability.stream', {
    capability_id: capabilityId,
    input,
  }) as { stream_id?: string; output?: { stream_id?: string } };
  const streamId = start.stream_id ?? start.output?.stream_id;
  if (!streamId) {
    throw new Error('kernel.v1.capability.stream did not return stream_id');
  }

  // 2. Subscribe to stream frames via postMessage
  const subscriptionId = newSubscriptionId();
  const queue = new AsyncQueue<StreamFrame>();
  let cleanedUp = false;

  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', onMessage);
      // Tell host to drop its subscription too
      try {
        window.parent?.postMessage(
          { type: 'stream.unsubscribe', subscription_id: subscriptionId },
          '*',
        );
      } catch { /* ignore */ }
    }
    queue.close();
  };

  const frames: AsyncIterable<StreamFrame> = {
    [Symbol.asyncIterator](): AsyncIterator<StreamFrame> {
      const iterator = queue.iter()[Symbol.asyncIterator]();
      return {
        next: () => iterator.next(),
        return: async () => {
          cleanup();
          if (iterator.return) return iterator.return();
          return { value: undefined as unknown as StreamFrame, done: true };
        },
      };
    },
  };

  const onMessage = (e: MessageEvent) => {
    const data = e.data as
      | StreamFrameMessage
      | StreamEndedMessage
      | StreamErrorMessage
      | undefined;
    if (!data || typeof data !== 'object') return;
    if ((data as { subscription_id?: string }).subscription_id !== subscriptionId) return;

    if (data.type === 'stream.frame') {
      queue.push({ kind: data.kind, payload: data.payload });
    } else if (data.type === 'stream.ended') {
      queue.push({ kind: 'ended', payload: null });
      cleanup();
    } else if (data.type === 'stream.error') {
      queue.push({ kind: 'error', payload: data.error });
      cleanup();
    }
  };

  if (typeof window !== 'undefined' && window.parent) {
    window.addEventListener('message', onMessage);
    window.parent.postMessage(
      {
        type: 'stream.subscribe',
        id: subscriptionId,
        stream_id: streamId,
        session_id: sessionId,
      },
      '*',
    );
  } else {
    // No window/parent (e.g., test environment without bridge): immediately error
    queue.push({
      kind: 'error',
      payload: { code: 'no_window', message: 'streamCapability requires window.parent' },
    });
    cleanup();
  }

  return {
    streamId,
    frames,
    async cancel() {
      try {
        await callHostRpc('kernel.v1.capability.cancel', { stream_id: streamId });
      } catch {
        // best-effort; cleanup anyway
      } finally {
        cleanup();
      }
    },
  };
}
