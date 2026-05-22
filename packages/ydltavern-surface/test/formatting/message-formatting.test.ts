import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { installTestDom } from './test-dom.ts';

installTestDom();
const formatting = await import('../../src/formatting/index.ts');
const { formatMessage, registerPreMarkdownHook, registerPreSanitizeHook } = formatting;

const opts = { messageId: 'm1', isUser: false, isSystem: false };

describe('formatMessage', () => {
  it('returns empty string for empty input', () => {
    assert.equal(formatMessage('', opts), '');
  });

  it('formats simple text', () => {
    assert.equal(formatMessage('hello', opts), '<p>hello</p>');
  });

  it('formats markdown bold', () => {
    assert.equal(formatMessage('hello **world**', opts), '<p>hello <strong>world</strong></p>');
  });

  it('bypasses markdown for system messages', () => {
    assert.equal(formatMessage('hello **world**', { ...opts, isSystem: true }), 'hello **world**');
  });

  it('keeps user message content', () => {
    assert.equal(formatMessage('_hi_', { ...opts, isUser: true }), '<p><em>hi</em></p>');
  });

  it('adds target blank to links', () => {
    assert.equal(
      formatMessage('[x](https://example.test)', opts),
      '<p><a href="https://example.test" target="_blank" rel="noopener noreferrer">x</a></p>',
    );
  });

  it('normalizes ampersands in code tags', () => {
    assert.equal(formatMessage('<code>a&amp;b</code>', opts), '<p><code>a&amp;b</code></p>');
  });

  it('preserves quotes in tag attributes', () => {
    assert.equal(formatMessage('<span title="hello">x</span>', opts), '<p><span title="hello">x</span></p>');
  });

  it('fires preMarkdown hooks', () => {
    const cleanup = registerPreMarkdownHook('message-formatting-test-pre-md', (text) => text.replace('TOKEN', '**ok**'));
    try {
      assert.equal(formatMessage('TOKEN', opts), '<p><strong>ok</strong></p>');
    } finally {
      cleanup();
    }
  });

  it('fires preSanitize hooks', () => {
    const cleanup = registerPreSanitizeHook('message-formatting-test-pre-sanitize', (html) => html.replace('</p>', '<span>!</span></p>'));
    try {
      assert.equal(formatMessage('ok', opts), '<p>ok<span>!</span></p>');
    } finally {
      cleanup();
    }
  });
});
