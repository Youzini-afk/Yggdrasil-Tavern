import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  _runPostRender,
  _runPreMarkdown,
  _runPreSanitize,
  registerPostRenderHook,
  registerPreMarkdownHook,
  registerPreSanitizeHook,
  type FormatRenderCtx,
} from '../../src/formatting/hooks.ts';
import { installTestDom } from './test-dom.ts';

installTestDom();

const ctx: FormatRenderCtx = { messageId: 'm1', isUser: false, isSystem: false };

describe('formatting hooks', () => {
  it('registers and cleans up preMarkdown hooks', () => {
    const cleanup = registerPreMarkdownHook('hooks-test-cleanup', (text) => `${text}!`);
    assert.equal(_runPreMarkdown('go', ctx), 'go!');
    cleanup();
    assert.equal(_runPreMarkdown('go', ctx), 'go');
  });

  it('composes multiple hooks in registration order', () => {
    const cleanupA = registerPreMarkdownHook('hooks-test-a', (text) => `${text}a`);
    const cleanupB = registerPreMarkdownHook('hooks-test-b', (text) => `${text}b`);
    try {
      assert.equal(_runPreMarkdown('', ctx), 'ab');
    } finally {
      cleanupA();
      cleanupB();
    }
  });

  it('continues when a preMarkdown hook throws', () => {
    const cleanupA = registerPreMarkdownHook('hooks-test-throw', () => { throw new Error('boom'); });
    const cleanupB = registerPreMarkdownHook('hooks-test-after-throw', (text) => `${text}ok`);
    try {
      assert.equal(_runPreMarkdown('', ctx), 'ok');
    } finally {
      cleanupA();
      cleanupB();
    }
  });

  it('runs preSanitize hooks', () => {
    const cleanup = registerPreSanitizeHook('hooks-test-sanitize', (html) => html.replace('a', 'b'));
    try {
      assert.equal(_runPreSanitize('<p>a</p>', ctx), '<p>b</p>');
    } finally {
      cleanup();
    }
  });

  it('runs postRender hooks and returns cleanups', () => {
    const cleanup = registerPostRenderHook('hooks-test-post', (el) => {
      el.setAttribute('data-hooked', 'yes');
      return () => el.setAttribute('data-cleaned', 'yes');
    });
    try {
      const el = document.createElement('div');
      const cleanups = _runPostRender(el, ctx);
      assert.equal(el.getAttribute('data-hooked'), 'yes');
      assert.equal(cleanups.length, 1);
      cleanups[0]?.();
      assert.equal(el.getAttribute('data-cleaned'), 'yes');
    } finally {
      cleanup();
    }
  });

  it('continues when postRender hooks throw', () => {
    const cleanupA = registerPostRenderHook('hooks-test-post-throw', () => { throw new Error('boom'); });
    const cleanupB = registerPostRenderHook('hooks-test-post-after', (el) => { el.id = 'ok'; });
    try {
      const el = document.createElement('div');
      assert.deepEqual(_runPostRender(el, ctx), []);
      assert.equal(el.id, 'ok');
    } finally {
      cleanupA();
      cleanupB();
    }
  });
});
