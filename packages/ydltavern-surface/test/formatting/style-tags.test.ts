import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { decodeStyleTags, encodeStyleTags } from '../../src/formatting/style-tags.ts';

describe('style tag helpers', () => {
  it('encodes and decodes custom-style tags', () => {
    const encoded = encodeStyleTags('<custom-style>.foo { color: red; }</custom-style>');
    assert.match(encoded, /data-encoded="[^"]+"/);
    assert.equal(decodeStyleTags(encoded), '<style>.foo { color: red; }</style>');
  });

  it('prefixes decoded selectors', () => {
    const html = decodeStyleTags(encodeStyleTags('<custom-style>.a, #b { color: red; }</custom-style>'), { prefix: '.mes_text ' });
    assert.equal(html, '<style>.mes_text .a, .mes_text #b{ color: red; }</style>');
  });

  it('supports the Buffer base64 codepath', () => {
    const oldBtoa = globalThis.btoa;
    const oldAtob = globalThis.atob;
    try {
      Object.defineProperty(globalThis, 'btoa', { value: undefined, configurable: true });
      Object.defineProperty(globalThis, 'atob', { value: undefined, configurable: true });
      const encoded = encodeStyleTags('<custom-style>.x { display: block; }</custom-style>');
      assert.equal(decodeStyleTags(encoded), '<style>.x { display: block; }</style>');
    } finally {
      Object.defineProperty(globalThis, 'btoa', { value: oldBtoa, configurable: true });
      Object.defineProperty(globalThis, 'atob', { value: oldAtob, configurable: true });
    }
  });

  it('round-trips unicode bodies', () => {
    const html = decodeStyleTags(encodeStyleTags('<custom-style>.雪::before { content: "☃"; }</custom-style>'));
    assert.equal(html, '<style>.雪::before { content: "☃"; }</style>');
  });
});
