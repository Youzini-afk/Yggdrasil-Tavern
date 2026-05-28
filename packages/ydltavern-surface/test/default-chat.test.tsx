import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import React, { useEffect } from 'react';
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
  globalThis.localStorage?.clear();
});

describe('production default chat', () => {
  it('TavernProvider defaults to an empty chat, not the sample fixture', async () => {
    const { TavernProvider, useTavern } = await import('../src/app/TavernProvider.tsx');

    let turnCount: number | undefined;
    let chatTitle: string | undefined;

    function Driver(): JSX.Element {
      const tavern = useTavern();
      useEffect(() => {
        turnCount = tavern.liveChat.turns.length;
        chatTitle = tavern.liveChat.meta.title;
      }, [tavern]);
      return <div data-testid="turn-count">{tavern.liveChat.turns.length}</div>;
    }

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <TavernProvider>
          <Driver />
        </TavernProvider>,
      );
    });

    await tick();
    assert.equal(turnCount, 0);
    assert.equal(chatTitle, 'New chat');
  });

  it('TavernPlaySurface does not render the demo product-review fixture by default', async () => {
    const { TavernPlaySurface } = await import('../src/surfaces/TavernPlaySurface.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => root?.render(<TavernPlaySurface />));

    await tick();
    const text = container.textContent ?? '';
    assert.equal(text.includes("Help me plan tomorrow's product review"), false);
    assert.equal(text.includes('Aria'), false);
    assert.equal(text.includes('release health, blockers'), false);
  });
});

async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
