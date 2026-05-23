import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import React, { useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { Chat } from '@ydltavern/types';
import { installTestDom } from './formatting/test-dom.ts';
import { extractContentFromResult } from '../src/app/TavernProvider.tsx';

installTestDom();

type PostedMessage = {
  readonly type: string;
  readonly id: string;
  readonly method: string;
  readonly params: {
    readonly capability_id: string;
    readonly input: Record<string, unknown>;
  };
};

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  root?.unmount();
  root = undefined;
  container?.remove();
  container = undefined;
  globalThis.localStorage?.clear();
});

describe('TavernProvider sendMessage flow', () => {
  it('appends a user turn, invokes model.live_call, and writes assistant response', async () => {
    const posted: PostedMessage[] = [];
    installRpcHostMock(posted, { text: 'Mock assistant response' });

    const { TavernProvider, useTavern } = await import(`../src/app/TavernProvider.tsx?sendFlow=${Date.now()}`);

    let done!: () => void;
    const completed = new Promise<void>((resolve) => { done = resolve; });

    function Driver(): JSX.Element {
      const tavern = useTavern();
      const sent = useRef(false);
      useEffect(() => {
        if (sent.current) return;
        sent.current = true;
        tavern.sendMessage('Hello engine').then(done, done);
      }, [tavern]);
      return <div>{tavern.liveChat.turns.map((turn) => turn.variants[turn.active_variant]?.subs.map((sub) => 'text' in sub ? sub.text : '').join('')).join('\n')}</div>;
    }

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <TavernProvider chat={emptyChat}>
          <Driver />
        </TavernProvider>,
      );
    });

    await completed;
    await tick();

    const liveCalls = posted.filter((message) => message.params.capability_id === 'ydltavern/engine/model.live_call');
    assert.equal(liveCalls.length, 1);
    assert.equal(liveCalls[0]?.method, 'kernel.v1.capability.invoke');
    assert.equal(liveCalls[0]?.params.input.secret_ref, 'secret_ref:store:OPENAI_API_KEY');
    assert.equal(liveCalls[0]?.params.input.stream, false);
    assert.deepEqual(liveCalls[0]?.params.input.messages, [
      { role: 'user', content: 'Hello engine' },
      { role: 'assistant', content: '' },
    ]);
    assert.equal(extractContentFromResult({ text: 'Mock assistant response' }), 'Mock assistant response');
  });
});

function installRpcHostMock(posted: PostedMessage[], output: unknown): void {
  const listeners: Array<(event: MessageEvent) => void> = [];
  const parent = {
    postMessage(message: unknown) {
      const call = message as PostedMessage;
      posted.push(call);
      queueMicrotask(() => {
        for (const listener of listeners) {
          listener({ data: { type: 'rpc.result', id: call.id, result: { output } } } as MessageEvent);
        }
      });
    },
  };
  Object.defineProperty(window, 'parent', { value: parent, configurable: true });
  const originalAddEventListener = window.addEventListener.bind(window);
  window.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
    if (type === 'message' && typeof listener === 'function') listeners.push(listener as (event: MessageEvent) => void);
    originalAddEventListener(type, listener, options);
  }) as typeof window.addEventListener;
}

async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

const emptyChat: Chat = {
  id: 'test-chat',
  meta: {},
  turns: [],
};
