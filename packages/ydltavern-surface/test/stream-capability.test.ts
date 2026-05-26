import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

interface PostedMessage {
  message: Record<string, unknown>;
  targetOrigin: string;
}

const HOST_ORIGIN = 'https://host.example.test';
const BRIDGE_TOKEN = 'bridge-token-test';

function installWindow(): {
  posted: PostedMessage[];
  parent: WindowProxy;
  otherSource: WindowProxy;
  dispatch(message: unknown, options?: { origin?: string; source?: WindowProxy | null }): void;
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
            listener({
              data: { type: 'rpc.result', id: message.id, result, bridge_token: message.bridge_token },
              origin: HOST_ORIGIN,
              source: parent,
            } as MessageEvent);
          }
        });
      }
    },
  } as WindowProxy & { postMessage(message: Record<string, unknown>, targetOrigin: string): void };
  const otherSource = {} as WindowProxy;

  Object.defineProperty(globalThis, 'window', {
    value: {
      parent,
      location: { origin: 'https://surface.example.test', search: '', hash: '', href: 'https://surface.example.test/' },
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
    parent,
    otherSource,
    dispatch(message: unknown, options = {}) {
      for (const listener of [...listeners]) {
        listener({
          data: message,
          origin: options.origin ?? HOST_ORIGIN,
          source: options.source === undefined ? parent : options.source,
        } as MessageEvent);
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
    const bridge = installWindow();
    const { configureHostRpcBridge, resetHostRpcBridgeConfig, setActiveSessionId } = await importHostRpc();
    resetHostRpcBridgeConfig();
    configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    setActiveSessionId(undefined);
  });

  async function prepareBridge(sessionId: string): Promise<ReturnType<typeof installWindow> & { hostRpc: Awaited<ReturnType<typeof importHostRpc>> }> {
    const bridge = installWindow();
    const hostRpc = await importHostRpc();
    hostRpc.resetHostRpcBridgeConfig();
    hostRpc.configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    hostRpc.setActiveSessionId(sessionId);
    return { ...bridge, hostRpc };
  }

  it('throws with no active session id', async () => {
    const { streamCapability } = await importHostRpc();

    await assert.rejects(
      streamCapability('test/cap', { x: 1 }),
      /streamCapability requires active session id/u,
    );
  });

  it('sends stream.subscribe with correct stream_id and session_id', async () => {
    const bridge = await prepareBridge('sess-test-1');

    const handle = await bridge.hostRpc.streamCapability('test/cap', { prompt: 'hello' });

    assert.equal(handle.streamId, 'stream-test-1');
    const subscribe = subscribeMessage(bridge.posted);
    assert.match(String(subscribe.id), /^sub-\d+-\d+$/u);
    assert.equal(subscribe.subscription_id, subscribe.id);
    assert.equal(subscribe.stream_id, 'stream-test-1');
    assert.equal(subscribe.session_id, 'sess-test-1');
    assert.equal(subscribe.bridge_token, BRIDGE_TOKEN);
    const subscribePost = bridge.posted.find((entry) => entry.message.type === 'stream.subscribe');
    assert.equal(subscribePost?.targetOrigin, HOST_ORIGIN);
    assert.notEqual(subscribePost?.targetOrigin, '*');
  });

  it('yields stream.frame chunk events', async () => {
    const bridge = await prepareBridge('sess-test-2');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: subscriptionId,
      session_id: 'sess-test-2',
      bridge_token: BRIDGE_TOKEN,
      kind: 'chunk',
      payload: { text: 'hello' },
    });

    assert.deepEqual(await iterator.next(), {
      value: { kind: 'chunk', payload: { text: 'hello' } },
      done: false,
    });
  });

  it('yields ended and then completes on stream.ended', async () => {
    const bridge = await prepareBridge('sess-test-3');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({ type: 'stream.ended', subscription_id: subscriptionId, session_id: 'sess-test-3', bridge_token: BRIDGE_TOKEN });

    assert.deepEqual(await iterator.next(), { value: { kind: 'ended', payload: null }, done: false });
    assert.deepEqual(await iterator.next(), { value: undefined, done: true });
    assert.equal(bridge.posted.some((entry) => entry.message.type === 'stream.unsubscribe'), true);
    const unsubscribe = bridge.posted.find((entry) => entry.message.type === 'stream.unsubscribe');
    assert.equal(unsubscribe?.targetOrigin, HOST_ORIGIN);
    assert.notEqual(unsubscribe?.targetOrigin, '*');
  });

  it('yields error and then completes on stream.error', async () => {
    const bridge = await prepareBridge('sess-test-4');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();
    const error = { code: 'boom', message: 'failed' };

    bridge.dispatch({ type: 'stream.error', subscription_id: subscriptionId, session_id: 'sess-test-4', bridge_token: BRIDGE_TOKEN, error });

    assert.deepEqual(await iterator.next(), { value: { kind: 'error', payload: error }, done: false });
    assert.deepEqual(await iterator.next(), { value: undefined, done: true });
    assert.equal(bridge.posted.some((entry) => entry.message.type === 'stream.unsubscribe'), true);
  });

  it('cancel calls capability.cancel, stream.unsubscribe, and cleanup', async () => {
    const bridge = await prepareBridge('sess-test-5');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);

    await handle.cancel();

    const cancelCall = bridge.posted.find((entry) => entry.message.method === 'kernel.v1.capability.cancel');
    assert.ok(cancelCall, 'expected capability.cancel RPC');
    assert.deepEqual(cancelCall.message.params, { stream_id: 'stream-test-1' });
    const unsubscribe = bridge.posted.find((entry) => entry.message.type === 'stream.unsubscribe');
    assert.deepEqual(unsubscribe?.message, { type: 'stream.unsubscribe', subscription_id: subscriptionId, session_id: 'sess-test-5', bridge_token: BRIDGE_TOKEN });

    const iterator = handle.frames[Symbol.asyncIterator]();
    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: subscriptionId,
      session_id: 'sess-test-5',
      bridge_token: BRIDGE_TOKEN,
      kind: 'chunk',
      payload: 'ignored',
    });
    assert.deepEqual(await iterator.next(), { value: undefined, done: true });
  });

  it('iterator return() cleans up and unsubscribes', async () => {
    const bridge = await prepareBridge('sess-test-6');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    assert.ok(iterator.return);
    await iterator.return();

    const unsubscribe = bridge.posted.find((entry) => entry.message.type === 'stream.unsubscribe');
    assert.deepEqual(unsubscribe?.message, { type: 'stream.unsubscribe', subscription_id: subscriptionId, session_id: 'sess-test-6', bridge_token: BRIDGE_TOKEN });
  });

  it('ignores frames from a different subscription_id', async () => {
    const bridge = await prepareBridge('sess-test-7');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: 'other-subscription',
      session_id: 'sess-test-7',
      bridge_token: BRIDGE_TOKEN,
      kind: 'chunk',
      payload: 'ignored',
    });
    bridge.dispatch({
      type: 'stream.frame',
      subscription_id: subscriptionId,
      session_id: 'sess-test-7',
      bridge_token: BRIDGE_TOKEN,
      kind: 'chunk',
      payload: 'accepted',
    });

    assert.deepEqual(await iterator.next(), {
      value: { kind: 'chunk', payload: 'accepted' },
      done: false,
    });
  });

  it('ignores stream.frame from wrong origin', async () => {
    const bridge = await prepareBridge('sess-test-8');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-8', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'ignored' }, { origin: 'https://evil.example.test' });
    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-8', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'accepted' });

    assert.deepEqual(await iterator.next(), { value: { kind: 'chunk', payload: 'accepted' }, done: false });
  });

  it('ignores stream.frame from wrong source', async () => {
    const bridge = await prepareBridge('sess-test-9');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-9', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'ignored' }, { source: bridge.otherSource });
    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-9', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'accepted' });

    assert.deepEqual(await iterator.next(), { value: { kind: 'chunk', payload: 'accepted' }, done: false });
  });

  it('ignores stream.frame with wrong bridge token', async () => {
    const bridge = await prepareBridge('sess-test-10');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-10', bridge_token: 'wrong-token', kind: 'chunk', payload: 'ignored' });
    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-10', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'accepted' });

    assert.deepEqual(await iterator.next(), { value: { kind: 'chunk', payload: 'accepted' }, done: false });
  });

  it('ignores stream.frame from wrong session_id', async () => {
    const bridge = await prepareBridge('sess-test-11');
    const handle = await bridge.hostRpc.streamCapability('test/cap', {});
    const subscriptionId = String(subscribeMessage(bridge.posted).id);
    const iterator = handle.frames[Symbol.asyncIterator]();

    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'other-session', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'ignored' });
    bridge.dispatch({ type: 'stream.frame', subscription_id: subscriptionId, session_id: 'sess-test-11', bridge_token: BRIDGE_TOKEN, kind: 'chunk', payload: 'accepted' });

    assert.deepEqual(await iterator.next(), { value: { kind: 'chunk', payload: 'accepted' }, done: false });
  });
});
