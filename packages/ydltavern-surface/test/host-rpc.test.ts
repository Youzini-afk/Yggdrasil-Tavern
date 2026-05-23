import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

describe('callHostRpc', () => {
  beforeEach(() => {
    const listeners: Array<(event: MessageEvent) => void> = [];
    const parent = {
      postMessage(message: unknown) {
        queueMicrotask(() => {
          const call = message as { id: string };
          for (const listener of listeners) {
            listener({ data: { type: 'rpc.result', id: call.id, result: { ok: true } } } as MessageEvent);
          }
        });
      },
    };
    Object.defineProperty(globalThis, 'window', {
      value: {
        parent,
        addEventListener(type: string, listener: (event: MessageEvent) => void) {
          if (type === 'message') listeners.push(listener);
        },
      },
      configurable: true,
    });
  });

  it('posts the host RPC message and resolves matching rpc.result', async () => {
    const posted: unknown[] = [];
    const win = window as unknown as { parent: { postMessage: (message: unknown, targetOrigin: string) => void } };
    const originalPost = win.parent.postMessage;
    win.parent.postMessage = (message: unknown, targetOrigin: string) => {
      posted.push({ message, targetOrigin });
      originalPost(message, targetOrigin);
    };

    const { callHostRpc } = await import(`../src/host-rpc/index.ts?test=${Date.now()}`);
    const result = await callHostRpc('kernel.v1.capability.invoke', { capability_id: 'test/cap', input: { x: 1 } }, 1000);

    assert.deepEqual(result, { ok: true });
    assert.equal(posted.length, 1);
    const first = posted[0] as { message: { type: string; id: string; method: string; params: unknown }; targetOrigin: string };
    assert.equal(first.targetOrigin, '*');
    assert.equal(first.message.type, 'rpc.call');
    assert.match(first.message.id, /^rpc-\d+-\d+$/u);
    assert.equal(first.message.method, 'kernel.v1.capability.invoke');
    assert.deepEqual(first.message.params, { capability_id: 'test/cap', input: { x: 1 } });
  });
});
