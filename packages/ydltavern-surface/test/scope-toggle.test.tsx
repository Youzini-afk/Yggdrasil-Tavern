import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { installTestDom } from './formatting/test-dom.ts';

installTestDom();

let root: Root | undefined;
let container: HTMLDivElement | undefined;

afterEach(() => {
  root?.unmount();
  root = undefined;
  container?.remove();
  container = undefined;
});

describe('APIKeySection scope toggle', () => {
  it('selects project scope when current secret ref is project scoped', async () => {
    const { APIKeySection } = await import(`../src/components/shell/drawers/APIConnectionsDrawer.tsx?scope=${Date.now()}`);
    installRpcHostMock();

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <APIKeySection
          provider="openai"
          currentSecretRef="secret_ref:project:OPENAI_API_KEY"
          projectId="project-1"
          onSecretRefChange={() => undefined}
        />,
      );
    });

    await tick();

    const platform = container.querySelector<HTMLInputElement>('input[type="radio"][value="platform"]');
    const project = container.querySelector<HTMLInputElement>('input[type="radio"][value="project"]');
    assert.ok(platform);
    assert.ok(project);
    assert.equal(platform.checked, false);
    assert.equal(project.checked, true);
  });
});

function installRpcHostMock(): void {
  const listeners: Array<(event: MessageEvent) => void> = [];
  const parent = {
    postMessage(message: unknown) {
      const call = message as { id: string };
      queueMicrotask(() => {
        for (const listener of listeners) {
          listener({ data: { type: 'rpc.result', id: call.id, result: { output: { names: [] } } } } as MessageEvent);
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
