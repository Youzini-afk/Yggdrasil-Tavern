import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { installTestDom } from './formatting/test-dom.ts';

installTestDom();

const { MessageBubble } = await import('../src/components/product/Message/MessageBubble.tsx');
const { MessageList } = await import('../src/components/product/MessageList.tsx');
const { TavernShell } = await import('../src/app/TavernShell.tsx');
const { TavernProvider } = await import('../src/app/TavernProvider.tsx');
const { TopBar } = await import('../src/components/shell/TopBar.tsx');
const { SendForm } = await import('../src/components/product/Composer/SendForm.tsx');
const { ExtensionsDrawer } = await import('../src/components/shell/drawers/ExtensionsDrawer.tsx');

function render(element: React.ReactElement): { container: HTMLDivElement; unmount: () => void } {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(element);
  document.body.append(container);
  return {
    container,
    unmount: () => {
      container.remove();
    },
  };
}

const drawerState = {
  openId: null,
  open: () => undefined,
  close: () => undefined,
  toggle: () => undefined,
} as const;

const bubbleMessage = {
  mesId: 'm1',
  chName: 'Assistant',
  isUser: false,
  isSystem: false,
  text: 'hello',
};

describe('DOM extension territories', () => {
  it('MessageBubble renders .mes_text as formatted HTML', () => {
    const { container, unmount } = render(<MessageBubble message={{ ...bubbleMessage, text: 'hello' }} />);
    try {
      const mesText = container.querySelector('.mes_text');
      assert.ok(mesText);
      assert.equal(mesText.innerHTML, '<p>hello</p>');
    } finally {
      unmount();
    }
  });

  it('MessageBubble formats markdown in .mes_text', () => {
    const { container, unmount } = render(<MessageBubble message={{ ...bubbleMessage, text: '**bold**' }} />);
    try {
      const strong = container.querySelector('.mes_text strong');
      assert.ok(strong);
      assert.equal(strong.textContent, 'bold');
    } finally {
      unmount();
    }
  });

  it('MessageBubble sanitizes XSS from .mes_text', () => {
    const { container, unmount } = render(<MessageBubble message={{ ...bubbleMessage, text: '<script>alert(1)</script>safe' }} />);
    try {
      const mesText = container.querySelector('.mes_text');
      assert.ok(mesText);
      assert.equal(mesText.querySelector('script'), null);
      assert.match(mesText.textContent ?? '', /safe/u);
    } finally {
      unmount();
    }
  });

  it('MessageBubble has .mes_buttons_extra mount slot', () => {
    const { container, unmount } = render(<MessageBubble message={bubbleMessage} />);
    try {
      const slot = container.querySelector('.mes_buttons .mes_buttons_extra');
      assert.ok(slot);
      assert.equal(slot.getAttribute('data-extension-mount-slot'), 'true');
    } finally {
      unmount();
    }
  });

  it('MessageBubble renders is-error class and data-is-error when isError is true', () => {
    const { container, unmount } = render(<MessageBubble message={{ ...bubbleMessage, isError: true }} />);
    try {
      const mes = container.querySelector('.mes');
      assert.ok(mes);
      assert.ok(mes.classList.contains('is-error'));
      assert.equal(mes.getAttribute('data-is-error'), 'true');
    } finally {
      unmount();
    }
  });

  it('MessageList wraps content in #chat', () => {
    const { container, unmount } = render(
      <TavernProvider>
        <MessageList />
      </TavernProvider>,
    );
    try {
      const chat = container.querySelector('#chat.ydltavern-message-list');
      assert.ok(chat);
    } finally {
      unmount();
    }
  });

  it('TavernShell includes #movingDivs extension territory', () => {
    const { container, unmount } = render(
      <TavernProvider>
        <TavernShell />
      </TavernProvider>,
    );
    try {
      const movingDivs = container.querySelector('#movingDivs');
      assert.ok(movingDivs);
      assert.equal(movingDivs.getAttribute('data-extension-territory'), 'true');
    } finally {
      unmount();
    }
  });

  it('TopBar includes #extensionsMenu as sibling of toolbar', () => {
    const { container, unmount } = render(<TopBar drawers={drawerState} />);
    try {
      const toolbar = container.querySelector('.top-settings-holder');
      const extensionsMenu = container.querySelector('#extensionsMenu');
      assert.ok(toolbar);
      assert.ok(extensionsMenu);
      assert.equal(extensionsMenu.parentElement, toolbar.parentElement);
      assert.equal(toolbar.contains(extensionsMenu), false);
    } finally {
      unmount();
    }
  });

  it('SendForm includes #leftSendForm and #rightSendForm territories', () => {
    const { container, unmount } = render(<SendForm onSend={() => undefined} />);
    try {
      const left = container.querySelector('#leftSendForm');
      const right = container.querySelector('#rightSendForm');
      assert.ok(left);
      assert.ok(right);
      assert.equal(left.getAttribute('data-extension-territory'), 'true');
      assert.equal(right.getAttribute('data-extension-territory'), 'true');
      assert.ok(right.querySelector('#send_but'));
    } finally {
      unmount();
    }
  });

  it('ExtensionsDrawer includes extension settings territories', () => {
    const { container, unmount } = render(
      <TavernProvider>
        <ExtensionsDrawer drawers={drawerState} />
      </TavernProvider>,
    );
    try {
      const settings = container.querySelector('#extensions_settings');
      const settings2 = container.querySelector('#extensions_settings2');
      assert.ok(settings);
      assert.ok(settings2);
      assert.equal(settings.getAttribute('data-extension-territory'), 'true');
      assert.equal(settings2.getAttribute('data-extension-territory'), 'true');
    } finally {
      unmount();
    }
  });

  it('all React-owned extension territories use data-extension-territory', () => {
    const { container, unmount } = render(
      <TavernProvider>
        <TavernShell />
      </TavernProvider>,
    );
    try {
      for (const id of ['extensionsMenu', 'movingDivs', 'leftSendForm', 'rightSendForm', 'extensions_settings', 'extensions_settings2']) {
        const element = container.querySelector(`#${id}`);
        assert.ok(element, id);
        assert.equal(element.getAttribute('data-extension-territory'), 'true', id);
      }
    } finally {
      unmount();
    }
  });
});
