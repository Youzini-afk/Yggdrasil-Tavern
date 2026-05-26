import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import React, { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { Chat } from '@ydltavern/types';
import { installTestDom } from './formatting/test-dom.ts';
import { configureHostRpcBridge, resetHostRpcBridgeConfig } from '../src/host-rpc/index.ts';
import { STORAGE_KEYS } from '../src/state/persistence.ts';

installTestDom();

const baseAddEventListener = window.addEventListener;
const baseRemoveEventListener = window.removeEventListener;

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
  clear(): void { this.data.clear(); }
}

type PostedMessage = {
  readonly type: string;
  readonly id?: string;
  readonly method?: string;
  readonly bridge_token?: string;
  readonly session_id?: string;
  readonly params?: {
    readonly capability_id?: string;
    readonly input?: Record<string, unknown>;
    readonly stream_id?: string;
  };
  readonly stream_id?: string;
};

type StreamFrame = {
  readonly kind: 'started' | 'chunk' | 'progress' | 'ended' | 'error' | 'cancelled' | 'timeout';
  readonly payload: unknown;
};

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  root?.unmount();
  root = undefined;
  container?.remove();
  container = undefined;
  Object.defineProperty(window, 'addEventListener', { value: baseAddEventListener, configurable: true });
  Object.defineProperty(window, 'removeEventListener', { value: baseRemoveEventListener, configurable: true });
  Object.defineProperty(globalThis, 'localStorage', { value: window.localStorage ?? new MemoryStorage(), configurable: true });
  globalThis.localStorage?.clear();
});

describe('TavernProvider streaming sendMessage flow', () => {
  it('appends chunks progressively', async () => {
    const posted: PostedMessage[] = [];
    installRpcHostMock(posted, {
      streamFrames: [
        { kind: 'started', payload: {} },
        { kind: 'chunk', payload: { delta_text: 'Hello' } },
        { kind: 'chunk', payload: { delta_text: ' world' } },
      ],
    });

    const { completed, states } = await renderDriver('stream-progress', async (tavern) => {
      await tavern.sendMessage('hi');
    });

    await completed;
    await tick();

    const streamCalls = posted.filter((message) => message.params?.capability_id === 'ydltavern/engine/model.live_call.stream');
    assert.equal(streamCalls.length, 1);
    assert.equal(streamCalls[0]?.method, 'kernel.v1.capability.stream');
    assert.equal(streamCalls[0]?.params?.input?.stream, true);
    assert.equal(posted.some((message) => message.type === 'stream.subscribe'), true);
    await waitFor(() => states.some((state) => state.text.includes('Hello world')));
    assert.ok(states.some((state) => state.text.includes('Hello')));
    assert.equal(states.at(-1)?.text.includes('Hello world'), true);
    assert.equal(states.at(-1)?.isGenerating, false);
  });

  it('handles cancel', async () => {
    const posted: PostedMessage[] = [];
    const bridge = installRpcHostMock(posted, { streamFrames: [{ kind: 'chunk', payload: { delta_text: 'Partial' } }], autoEnd: false });

    const { completed, states } = await renderDriver('stream-cancel', async (tavern) => {
      const send = tavern.sendMessage('hi');
      await bridge.waitForSubscribe();
      await waitFor(() => states.at(-1)?.isGenerating === true);
      await tavern.cancelGeneration();
      await send;
    });

    await completed;
    await tick();

    assert.equal(posted.some((message) => message.method === 'kernel.v1.capability.cancel' && message.params?.stream_id === 'stream-test-1'), true);
    assert.equal(posted.some((message) => message.type === 'stream.unsubscribe'), true);
    await waitFor(() => states.at(-1)?.text.includes('Partial') === true);
    assert.equal(states.at(-1)?.text.includes('Partial'), true);
    assert.equal(states.at(-1)?.isGenerating, false);
  });

  it('handles error frame', async () => {
    const posted: PostedMessage[] = [];
    installRpcHostMock(posted, {
      streamFrames: [
        { kind: 'chunk', payload: { delta_text: 'Partial ' } },
        { kind: 'error', payload: { code: 'kernel/v1/stream.error', message: 'provider 401' } },
      ],
      autoEnd: false,
    });

    const { completed, states } = await renderDriver('stream-error', async (tavern) => {
      await tavern.sendMessage('hi');
    });

    await completed;
    await tick();

    await waitFor(() => states.at(-1)?.text.includes('Partial ') === true);
    assert.equal(states.at(-1)?.text.includes('Partial '), true);
    assert.equal(states.at(-1)?.isGenerating, false);
  });

  it('non-streaming still invokes model.live_call', async () => {
    const posted: PostedMessage[] = [];
    writeStreamingSetting(false);
    installRpcHostMock(posted, { unaryOutput: { text: 'Unary response' } });

    const { completed, states } = await renderDriver('stream-off', async (tavern) => {
      await tavern.sendMessage('hi');
    });

    await completed;
    await tick();

    const unaryCalls = posted.filter((message) => message.params?.capability_id === 'ydltavern/engine/model.live_call');
    assert.equal(unaryCalls.length, 1);
    assert.equal(unaryCalls[0]?.method, 'kernel.v1.capability.invoke');
    assert.equal(unaryCalls[0]?.params?.input?.stream, false);
    assert.equal(posted.some((message) => message.params?.capability_id === 'ydltavern/engine/model.live_call.stream'), false);
    await waitFor(() => states.at(-1)?.text.includes('Unary response') === true);
    assert.equal(states.at(-1)?.text.includes('Unary response'), true);
    assert.equal(states.at(-1)?.isGenerating, false);
  });
});

async function renderDriver(
  tag: string,
  run: (tavern: Awaited<ReturnType<typeof import('../src/app/TavernProvider.tsx')>>['useTavern'] extends () => infer T ? T : never) => Promise<void>,
): Promise<{ completed: Promise<void>; states: Array<{ text: string; isGenerating: boolean }> }> {
  const { TavernProvider, useTavern } = await import(`../src/app/TavernProvider.tsx?${tag}=${Date.now()}`);
  const states: Array<{ text: string; isGenerating: boolean }> = [];
  let done!: () => void;
  let fail!: (err: unknown) => void;
  const completed = new Promise<void>((resolve, reject) => {
    done = resolve;
    fail = reject;
  });

  function Driver(): JSX.Element {
    const tavern = useTavern();
    const sent = useRef(false);
    const text = tavern.liveChat.turns
      .map((turn) => turn.variants[turn.active_variant]?.subs.map((sub) => 'text' in sub ? sub.text : '').join(''))
      .join('\n');
    states.push({ text, isGenerating: tavern.isGenerating });
    useEffect(() => {
      if (sent.current) return;
      sent.current = true;
      run(tavern).then(done, fail);
    }, [tavern]);
    return <div>{text}</div>;
  }

  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  flushSync(() => {
    root?.render(
      <TavernProvider chat={emptyChat} sessionId="sess-test-stream">
        <Driver />
      </TavernProvider>,
    );
  });

  return { completed, states };
}

function installRpcHostMock(posted: PostedMessage[], options: {
  readonly streamFrames?: readonly StreamFrame[];
  readonly unaryOutput?: unknown;
  readonly autoEnd?: boolean;
}): { waitForSubscribe(): Promise<void> } {
  const listeners: Array<(event: MessageEvent) => void> = [];
  const waiters: Array<() => void> = [];
  const parent = {
    postMessage(message: unknown) {
      const call = message as PostedMessage;
      posted.push(call);
      if (call.type === 'rpc.call') {
        queueMicrotask(() => {
          const result = call.method === 'kernel.v1.capability.stream'
            ? { stream_id: 'stream-test-1' }
            : { output: options.unaryOutput ?? { text: 'Unary response' } };
          dispatch(listeners, { type: 'rpc.result', id: call.id, result, bridge_token: call.bridge_token }, parent);
        });
      }
      if (call.type === 'stream.subscribe') {
        waiters.splice(0).forEach((resolve) => resolve());
        queueMicrotask(() => {
          const frames = options.streamFrames ?? [];
          for (const frame of frames) {
            if (frame.kind === 'ended') {
              dispatch(listeners, { type: 'stream.ended', subscription_id: call.id, session_id: call.session_id, bridge_token: call.bridge_token }, parent);
            } else if (frame.kind === 'error') {
              dispatch(listeners, { type: 'stream.error', subscription_id: call.id, session_id: call.session_id, bridge_token: call.bridge_token, error: frame.payload }, parent);
            } else {
              dispatch(listeners, { type: 'stream.frame', subscription_id: call.id, session_id: call.session_id, bridge_token: call.bridge_token, kind: frame.kind, payload: frame.payload }, parent);
            }
          }
          if (options.autoEnd !== false && frames.every((frame) => frame.kind !== 'ended' && frame.kind !== 'error')) {
            dispatch(listeners, { type: 'stream.ended', subscription_id: call.id, session_id: call.session_id, bridge_token: call.bridge_token }, parent);
          }
        });
      }
    },
  } as WindowProxy & { postMessage(message: unknown): void };
  Object.defineProperty(window, 'parent', { value: parent, configurable: true });
  resetHostRpcBridgeConfig();
  configureHostRpcBridge({ targetOrigin: window.location.origin, expectedSource: parent, bridgeToken: 'stream-send-bridge-token' });
  const originalAddEventListener = baseAddEventListener.bind(window);
  window.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
    if (type === 'message' && typeof listener === 'function') listeners.push(listener as (event: MessageEvent) => void);
    originalAddEventListener(type, listener, options);
  }) as typeof window.addEventListener;
  const originalRemoveEventListener = baseRemoveEventListener.bind(window);
  window.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
    if (type === 'message' && typeof listener === 'function') {
      const index = listeners.indexOf(listener as (event: MessageEvent) => void);
      if (index >= 0) listeners.splice(index, 1);
    }
    originalRemoveEventListener(type, listener, options);
  }) as typeof window.removeEventListener;

  return {
    waitForSubscribe() {
      if (posted.some((message) => message.type === 'stream.subscribe')) return Promise.resolve();
      return new Promise((resolve) => waiters.push(resolve));
    },
  };
}

function dispatch(listeners: Array<(event: MessageEvent) => void>, data: unknown, source: WindowProxy): void {
  void listeners;
  window.dispatchEvent(new window.MessageEvent('message', { data, origin: window.location.origin, source }));
}

async function waitFor(predicate: () => boolean): Promise<void> {
  for (let i = 0; i < 20; i += 1) {
    if (predicate()) return;
    await tick();
  }
  assert.fail('condition was not met');
}

async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

function writeStreamingSetting(streaming: boolean): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ streaming }));
}

const emptyChat: Chat = {
  id: 'test-chat',
  meta: {},
  turns: [],
};
