import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

interface PostedMessage {
  message: Record<string, unknown>;
  targetOrigin: string;
}

function installWindow(): {
  posted: PostedMessage[];
  dispatch(message: unknown): void;
} {
  const listeners: Array<(event: MessageEvent) => void> = [];
  const posted: PostedMessage[] = [];
  const parent = {
    postMessage(message: Record<string, unknown>, targetOrigin: string) {
      posted.push({ message, targetOrigin });
      if (message.type === 'rpc.call') {
        queueMicrotask(() => {
          const method = message.method;
          const result = method === 'kernel.v1.capability.stream'
            ? { stream_id: 'stream-test-1' }
            : { ok: true };
          for (const listener of [...listeners]) {
            listener({ data: { type: 'rpc.result', id: message.id, result } } as MessageEvent);
          }
        });
      }
    },
  };

  Object.defineProperty(globalThis, 'window', {
    value: {
      parent,
      addEventListener(type: string, listener: (event: MessageEvent) => void) {
        if (type === 'message') listeners.push(listener);
      },
      removeEventListener(type: string, listener: (event: MessageEvent) => void) {
        if (type !== 'message') return;
        const index = listeners.indexOf(listener);
        if (index >= 0) listeners.splice(index, 1);
      },
    },
    configurable: true,
  });

  return {
    posted,
    dispatch(message: unknown) {
      for (const listener of [...listeners]) {
        listener({ data: message } as MessageEvent);
      }
    },
  };
}

async function importHostRpc(): Promise<typeof import('../src/host-rpc/index.ts')> {
  return import('../src/host-rpc/index.ts');
}

function subscribeMessage(posted: PostedMessage[]): Record<string, unknown> {
  const found = posted.find((entry) => entry.message.type === 'stream.subscribe');
  assert.ok(found, 'expected stream.subscribe message');
  return found.message;
}

describe('streamCapability', () => {
  beforeEach(async () => {
    installWindow();
    const { setActiveSessionId } = await importHostRpc();
    setActiveSessionId(undefined);
  });

  it('throws with no active session id', async () => {
    const { streamCapability } = await importHostRpc();

    await assert.rejects(
      streamCapability('test/cap', { x: 1 }),
      /streamCapability requires active session id/u,
    );
  });

  it('sends stream.subscribe with correct stream_id and session_id', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-1');

    const handle = await streamCapability('test/cap', { prompt: 'hello' });

    assert.equal(handle.streamId, 'stream-test-1');
    const subscribe = subscribeMessage(bridge.posted);
    assert.match(String(subscribe.id), /^sub-\d+-\d+$/u);
    assert.equal(subscribe.stream_id, 'stream-test-1');
    assert.equal(subscribe.session_id, 'sess-test-1');
    assert.equal(bridge.posted.find((entry) => entry.message.type === 'stream.subscribe')?.targetOrigin, '*');
  });

  it('yields stream.frame chunk events', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-2');
    const handle = await streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: subscriptionId,
      kind: 'chunk',
      payload: { text: 'hello' },
    });

    assert.deepEqual(await iterator.next(), {
      value: { kind: 'chunk', payload: { text: 'hello' } },
      done: false,
    });
  });

  it('yields ended and then completes on stream.ended', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-3');
    const handle = await streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({ type: 'stream.ended', subscription_id: subscriptionId });

    assert.deepEqual(await iterator.next(), { value: { kind: 'ended', payload: null }, done: false });
    assert.deepEqual(await iterator.next(), { value: undefined, done: true });
    assert.equal(bridge.posted.some((entry) => entry.message.type === 'stream.unsubscribe'), true);
  });

  it('yields error and then completes on stream.error', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-4');
    const handle = await streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();
    const error = { code: 'boom', message: 'failed' };

    bridge.dispatch({ type: 'stream.error', subscription_id: subscriptionId, error });

    assert.deepEqual(await iterator.next(), { value: { kind: 'error', payload: error }, done: false });
    assert.deepEqual(await iterator.next(), { value: undefined, done: true });
    assert.equal(bridge.posted.some((entry) => entry.message.type === 'stream.unsubscribe'), true);
  });

  it('cancel calls capability.cancel, stream.unsubscribe, and cleanup', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-5');
    const handle = await streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);

    await handle.cancel();

    const cancelCall = bridge.posted.find((entry) => entry.message.method === 'kernel.v1.capability.cancel');
    assert.ok(cancelCall, 'expected capability.cancel RPC');
    assert.deepEqual(cancelCall.message.params, { stream_id: 'stream-test-1' });
    const unsubscribe = bridge.posted.find((entry) => entry.message.type === 'stream.unsubscribe');
    assert.deepEqual(unsubscribe?.message, { type: 'stream.unsubscribe', subscription_id: subscriptionId });

    const iterator = handle.frames[Symbol.asyncIterator]();
    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: subscriptionId,
      kind: 'chunk',
      payload: 'ignored',
    });
    assert.deepEqual(await iterator.next(), { value: undefined, done: true });
  });

  it('iterator return() cleans up and unsubscribes', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-6');
    const handle = await streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    assert.ok(iterator.return);
    await iterator.return();

    const unsubscribe = bridge.posted.find((entry) => entry.message.type === 'stream.unsubscribe');
    assert.deepEqual(unsubscribe?.message, { type: 'stream.unsubscribe', subscription_id: subscriptionId });
  });

  it('ignores frames from a different subscription_id', async () => {
    const bridge = installWindow();
    const { setActiveSessionId, streamCapability } = await importHostRpc();
    setActiveSessionId('sess-test-7');
    const handle = await streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: 'other-subscription',
      kind: 'chunk',
      payload: 'ignored',
    });
    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: subscriptionId,
      kind: 'chunk',
      payload: 'accepted',
    });

    assert.deepEqual(await iterator.next(), {
      value: { kind: 'chunk', payload: 'accepted' },
      done: false,
    });
  });
});
