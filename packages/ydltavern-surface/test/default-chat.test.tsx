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

  it('TavernPlaySurface renders WelcomeScreen instead of sample-chat by default', async () => {
    const { TavernPlaySurface } = await import('../src/surfaces/TavernPlaySurface.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => root?.render(<TavernPlaySurface />));

    await tick();
    const text = container.textContent ?? '';
    const html = container.innerHTML;

    // Must NOT contain sample-chat content
    assert.equal(text.includes("Help me plan tomorrow's product review"), false);
    assert.equal(text.includes('Aria'), false);
    assert.equal(text.includes('release health, blockers'), false);

    // Must contain WelcomeScreen content
    assert.ok(text.includes('YdlTavern'), 'WelcomeScreen should show YdlTavern logo text');
    assert.ok(text.includes('How to start chatting?'), 'WelcomeScreen should show how-to-start heading');
    assert.ok(text.includes('API Connections'), 'WelcomeScreen should show API Connections button');
    assert.ok(text.includes('Character Management'), 'WelcomeScreen should show Character Management button');
    assert.ok(text.includes('Extensions'), 'WelcomeScreen should show Extensions button');
    assert.ok(text.includes('No recent chats yet'), 'WelcomeScreen should show empty recent hint');
    assert.ok(text.includes('Recent Chats'), 'WelcomeScreen should show Recent Chats header');

    // Welcome buttons must exist — check by both class and DOM presence
    const welcomePanel = container.querySelector('.welcomePanel');
    assert.ok(welcomePanel, 'WelcomeScreen should render .welcomePanel');
    const guide = container.querySelector('.mes.mes_welcome_guide');
    assert.ok(guide, 'WelcomeScreen should render the welcome guide message');
    const startButtons = guide?.querySelectorAll('.drawer-opener');
    assert.ok(startButtons, 'drawer-opener buttons should exist');
    if (startButtons && startButtons.length > 0) {
      assert.equal(startButtons.length, 3, 'Welcome guide should have 3 drawer-opener buttons');
    }
  });

  it('WelcomeScreen buttons can trigger drawer callbacks', async () => {
    const { MessageList } = await import('../src/components/product/MessageList.tsx');
    const { TavernProvider } = await import('../src/app/TavernProvider.tsx');

    const openedDrawers: string[] = [];
    const onOpenApiConnections = () => { openedDrawers.push('api-connections'); };
    const onOpenCharacters = () => { openedDrawers.push('characters'); };
    const onOpenExtensions = () => { openedDrawers.push('extensions'); };

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() =>
      root?.render(
        <TavernProvider>
          <MessageList
            onOpenApiConnections={onOpenApiConnections}
            onOpenCharacters={onOpenCharacters}
            onOpenExtensions={onOpenExtensions}
          />
        </TavernProvider>,
      ),
    );

    await tick();
    const html = container.innerHTML;

    // Verify WelcomeScreen rendered
    assert.ok(container.textContent?.includes('How to start chatting?'), 'WelcomeScreen should render');

    // Find buttons by their text content and click them
    const buttons = container.querySelectorAll('.drawer-opener');
    assert.equal(buttons.length, 3, 'WelcomeScreen should have 3 drawer-opener buttons');

    const btnTexts = Array.from(buttons).map((b) => b.textContent ?? '');
    assert.ok(btnTexts.some((t) => t.includes('API Connections')));
    assert.ok(btnTexts.some((t) => t.includes('Character Management')));
    assert.ok(btnTexts.some((t) => t.includes('Extensions')));

    // Click each button by finding it through its text
    const apiBtn = Array.from(buttons).find((b) => b.textContent?.includes('API Connections')) as HTMLButtonElement | null;
    const charBtn = Array.from(buttons).find((b) => b.textContent?.includes('Character Management')) as HTMLButtonElement | null;
    const extBtn = Array.from(buttons).find((b) => b.textContent?.includes('Extensions')) as HTMLButtonElement | null;

    if (apiBtn && charBtn && extBtn) {
      apiBtn.click();
      assert.deepEqual(openedDrawers, ['api-connections']);

      charBtn.click();
      assert.deepEqual(openedDrawers, ['api-connections', 'characters']);

      extBtn.click();
      assert.deepEqual(openedDrawers, ['api-connections', 'characters', 'extensions']);
    } else {
      // Fallback: click buttons by index
      buttons[0]?.click();
      assert.equal(openedDrawers.length, 1, 'First button click should trigger drawer open');
      buttons[1]?.click();
      assert.equal(openedDrawers.length, 2, 'Second button click should trigger drawer open');
      buttons[2]?.click();
      assert.equal(openedDrawers.length, 3, 'Third button click should trigger drawer open');
    }
  });
});

async function tick(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
