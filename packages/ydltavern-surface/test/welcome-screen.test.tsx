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
  globalThis.localStorage?.clear();
});

describe('WelcomeScreen', () => {
  it('renders the logo and version text', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          version="0.1.0-test"
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const logoText = container.querySelector('.welcomeHeaderLogoText');
    assert.ok(logoText, 'welcomeHeaderLogoText should exist');
    assert.equal(logoText?.textContent?.trim(), 'YdlTavern');

    const versionDisplay = container.querySelector('.welcomeHeaderVersionDisplay');
    assert.ok(versionDisplay, 'welcomeHeaderVersionDisplay should exist');
    assert.equal(versionDisplay?.textContent?.trim(), '0.1.0-test');
  });

  it('renders "Recent Chats" title', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const recentTitle = container.querySelector('.recentChatsTitle');
    assert.ok(recentTitle, 'recentChatsTitle should exist');
    assert.ok(recentTitle?.textContent?.includes('Recent Chats'));
  });

  it('shows "No recent chats yet" empty hint when no recent chats', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          recentChats={[]}
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const hint = container.querySelector('.welcomeEmptyHint');
    assert.ok(hint, 'welcomeEmptyHint should exist');
    assert.ok(hint?.textContent?.includes('No recent chats yet'));
  });

  it('renders three drawer-opener buttons in the guide message', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const apiBtn = container.querySelector('.drawer-opener[data-target="api-connections"]')
      ?? [...container.querySelectorAll('.drawer-opener')].find(
        (el) => el.textContent?.includes('API Connections'),
      );
    const charBtn = [...container.querySelectorAll('.drawer-opener')].find(
      (el) => el.textContent?.includes('Character Management'),
    );
    const extBtn = [...container.querySelectorAll('.drawer-opener')].find(
      (el) => el.textContent?.includes('Extensions'),
    );

    assert.ok(apiBtn, 'API Connections button should exist');
    assert.ok(charBtn, 'Character Management button should exist');
    assert.ok(extBtn, 'Extensions button should exist');
  });

  it('calls onOpenApiConnections when the API Connections button is clicked', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    let called = false;
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => { called = true; }}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const apiBtn = [...container.querySelectorAll('.drawer-opener')].find(
      (el) => el.textContent?.includes('API Connections'),
    ) as HTMLButtonElement | null;
    assert.ok(apiBtn);
    flushSync(() => apiBtn?.click());
    assert.equal(called, true);
  });

  it('calls onOpenCharacters when the Character Management button is clicked', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    let called = false;
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => { called = true; }}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const charBtn = [...container.querySelectorAll('.drawer-opener')].find(
      (el) => el.textContent?.includes('Character Management'),
    ) as HTMLButtonElement | null;
    assert.ok(charBtn);
    flushSync(() => charBtn?.click());
    assert.equal(called, true);
  });

  it('calls onOpenExtensions when the Extensions button is clicked', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    let called = false;
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => { called = true; }}
        />,
      );
    });

    const extBtn = [...container.querySelectorAll('.drawer-opener')].find(
      (el) => el.textContent?.includes('Extensions'),
    ) as HTMLButtonElement | null;
    assert.ok(extBtn);
    flushSync(() => extBtn?.click());
    assert.equal(called, true);
  });

  it('renders the welcome guide system message with ST class names', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const guide = container.querySelector('.mes.mes_welcome_guide');
    assert.ok(guide, 'mes_welcome_guide should exist');
    assert.equal(guide?.getAttribute('data-is-system'), 'true');

    const nameText = container.querySelector('.name_text');
    assert.ok(nameText, 'name_text should exist');
    assert.equal(nameText?.textContent?.trim(), 'Welcome');

    const howToStart = container.querySelector('.mes_text h3');
    assert.ok(howToStart, 'mes_text h3 should exist');
    assert.ok(howToStart?.textContent?.includes('How to start chatting?'));
  });

  it('renders welcomePanel with ST class name', async () => {
    const { WelcomeScreen } = await import('../src/components/product/WelcomeScreen.tsx');

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <WelcomeScreen
          onOpenApiConnections={() => {}}
          onOpenCharacters={() => {}}
          onOpenExtensions={() => {}}
        />,
      );
    });

    const panel = container.querySelector('.welcomePanel');
    assert.ok(panel, 'welcomePanel should exist');
  });
});
