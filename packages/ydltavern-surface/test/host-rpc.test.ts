import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

const HOST_ORIGIN = 'https://host.example.test';
const BRIDGE_TOKEN = 'bridge-token-test';

interface InstalledWindow {
  readonly parent: WindowProxy;
  readonly otherSource: WindowProxy;
  readonly posted: Array<{ message: Record<string, unknown>; targetOrigin: string }>;
  dispatch(message: unknown, options?: { origin?: string; source?: WindowProxy | null }): void;
}

function installWindow(autoRespond = true): InstalledWindow {
  const listeners: Array<(event: MessageEvent) => void> = [];
  const posted: Array<{ message: Record<string, unknown>; targetOrigin: string }> = [];
  const parent = {
    postMessage(message: Record<string, unknown>, targetOrigin: string) {
      posted.push({ message, targetOrigin });
      if (!autoRespond) return;
      queueMicrotask(() => {
        const call = message as { id: string; bridge_token: string };
        for (const listener of [...listeners]) {
          listener({
            data: { type: 'rpc.result', id: call.id, result: { ok: true }, bridge_token: call.bridge_token },
            origin: HOST_ORIGIN,
            source: parent,
          } as MessageEvent);
        }
      });
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
    },
    configurable: true,
  });
  return {
    parent,
    otherSource,
    posted,
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

async function importHostRpc(tag = 'test'): Promise<typeof import('../src/host-rpc/index.ts')> {
  return import(`../src/host-rpc/index.ts?${tag}=${Date.now()}-${Math.random()}`);
}

describe('callHostRpc', () => {
  beforeEach(() => {
    installWindow();
  });

  it('posts the host RPC message and resolves matching rpc.result', async () => {
    const bridge = installWindow();
    const { callHostRpc, configureHostRpcBridge } = await importHostRpc();
    configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    const result = await callHostRpc('kernel.v1.capability.invoke', { capability_id: 'test/cap', input: { x: 1 } }, 1000);

    assert.deepEqual(result, { ok: true });
    assert.equal(bridge.posted.length, 1);
    const first = bridge.posted[0] as { message: { type: string; id: string; method: string; params: unknown; bridge_token: string }; targetOrigin: string };
    assert.equal(first.targetOrigin, HOST_ORIGIN);
    assert.notEqual(first.targetOrigin, '*');
    assert.equal(first.message.type, 'rpc.call');
    assert.match(first.message.id, /^rpc-\d+-\d+$/u);
    assert.equal(first.message.method, 'kernel.v1.capability.invoke');
    assert.deepEqual(first.message.params, { capability_id: 'test/cap', input: { x: 1 } });
    assert.equal(first.message.bridge_token, BRIDGE_TOKEN);
  });

  it('attaches active session_id to RPC messages', async () => {
    const bridge = installWindow();
    const { callHostRpc, configureHostRpcBridge, setActiveSessionId } = await importHostRpc('testSession');
    configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    setActiveSessionId('sess-test-1');
    await callHostRpc('kernel.v1.capability.invoke', {}, 1000);
    setActiveSessionId(undefined);

    const first = bridge.posted[0] as { message: { session_id?: string } };
    assert.equal(first.message.session_id, 'sess-test-1');
  });

  it('ignores rpc.result from wrong origin', async () => {
    const bridge = installWindow(false);
    const { callHostRpc, configureHostRpcBridge } = await importHostRpc('wrongOrigin');
    configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    const rpc = callHostRpc('kernel.v1.capability.invoke', {}, 1000);
    await Promise.resolve();
    const id = String(bridge.posted[0]?.message.id);

    bridge.dispatch({ type: 'rpc.result', id, result: { ok: false }, bridge_token: BRIDGE_TOKEN }, { origin: 'https://evil.example.test' });
    bridge.dispatch({ type: 'rpc.result', id, result: { ok: true }, bridge_token: BRIDGE_TOKEN });

    assert.deepEqual(await rpc, { ok: true });
  });

  it('ignores rpc.result from wrong source', async () => {
    const bridge = installWindow(false);
    const { callHostRpc, configureHostRpcBridge } = await importHostRpc('wrongSource');
    configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    const rpc = callHostRpc('kernel.v1.capability.invoke', {}, 1000);
    await Promise.resolve();
    const id = String(bridge.posted[0]?.message.id);

    bridge.dispatch({ type: 'rpc.result', id, result: { ok: false }, bridge_token: BRIDGE_TOKEN }, { source: bridge.otherSource });
    bridge.dispatch({ type: 'rpc.result', id, result: { ok: true }, bridge_token: BRIDGE_TOKEN });

    assert.deepEqual(await rpc, { ok: true });
  });

  it('ignores rpc.result with wrong bridge token', async () => {
    const bridge = installWindow(false);
    const { callHostRpc, configureHostRpcBridge } = await importHostRpc('wrongToken');
    configureHostRpcBridge({ targetOrigin: HOST_ORIGIN, expectedSource: bridge.parent, bridgeToken: BRIDGE_TOKEN });
    const rpc = callHostRpc('kernel.v1.capability.invoke', {}, 1000);
    await Promise.resolve();
    const id = String(bridge.posted[0]?.message.id);

    bridge.dispatch({ type: 'rpc.result', id, result: { ok: false }, bridge_token: 'wrong-token' });
    bridge.dispatch({ type: 'rpc.result', id, result: { ok: true }, bridge_token: BRIDGE_TOKEN });

    assert.deepEqual(await rpc, { ok: true });
  });
});
