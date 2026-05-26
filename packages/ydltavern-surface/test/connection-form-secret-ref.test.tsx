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

describe('ConnectionForm secret_ref validation', () => {
  it('does not commit invalid secret refs on blur', async () => {
    const { ConnectionForm } = await import(`../src/components/product/Settings/ConnectionForm.tsx?secret=${Date.now()}`);
    const committed: unknown[] = [];

    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
    flushSync(() => {
      root?.render(
        <ConnectionForm
          settings={{ provider: 'openai', model: 'gpt-4o-mini', secretRef: 'secret_ref:store:OPENAI_API_KEY', apiBaseUrl: '', stream: true }}
          onChange={(next) => committed.push(next)}
        />,
      );
    });

    const input = container.querySelector<HTMLInputElement>('input[placeholder="secret_ref:store:OPENAI_API_KEY"]');
    assert.ok(input);
    flushSync(() => {
      setInputValue(input, 'secret_ref:inline:OPENAI_API_KEY');
      input.dispatchEvent(new window.Event('input', { bubbles: true }));
    });
    flushSync(() => {
      input.dispatchEvent(new window.FocusEvent('focusout', { bubbles: true }));
    });

    assert.equal(committed.length, 0);
    assert.match(container.textContent ?? '', /Expected secret_ref:store:NAME/u);
  });
});

function setInputValue(input: HTMLInputElement, value: string): void {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, value);
}
