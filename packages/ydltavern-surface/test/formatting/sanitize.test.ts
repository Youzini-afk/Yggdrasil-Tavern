import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { installTestDom } from './test-dom.ts';

installTestDom();
const { sanitizeChatHtml } = await import('../../src/formatting/sanitize.ts');

describe('sanitizeChatHtml', () => {
  it('blocks script tags', () => {
    assert.equal(sanitizeChatHtml('<p>x</p><script>alert(1)</script>'), '<p>x</p>');
  });

  it('blocks iframe tags', () => {
    assert.equal(sanitizeChatHtml('<iframe src="x"></iframe><span>ok</span>'), '<span>ok</span>');
  });

  it('blocks on* attributes', () => {
    assert.equal(sanitizeChatHtml('<img src="x" onerror="alert(1)">'), '<img src="x" loading="lazy" decoding="async">');
  });

  it('blocks javascript hrefs', () => {
    assert.equal(sanitizeChatHtml('<a href="javascript:alert(1)">x</a>'), '<a target="_blank" rel="noopener noreferrer">x</a>');
  });

  it('allows links and adds target rel attributes', () => {
    assert.equal(
      sanitizeChatHtml('<a href="https://example.test">x</a>'),
      '<a href="https://example.test" target="_blank" rel="noopener noreferrer">x</a>',
    );
  });

  it('prefixes unsafe class names but preserves safe prefixes and literals', () => {
    assert.equal(
      sanitizeChatHtml('<span class="foo fa-star note-info monospace bar">x</span>'),
      '<span class="custom-foo fa-star note-info monospace custom-bar">x</span>',
    );
  });

  it('allows custom-style tags', () => {
    assert.equal(sanitizeChatHtml('<custom-style data-encoded="eA=="></custom-style>'), '<custom-style data-encoded="eA=="></custom-style>');
  });

  it('blocks srcdoc attributes', () => {
    assert.equal(sanitizeChatHtml('<div srcdoc="<p>x</p>">ok</div>'), '<div>ok</div>');
  });
});
