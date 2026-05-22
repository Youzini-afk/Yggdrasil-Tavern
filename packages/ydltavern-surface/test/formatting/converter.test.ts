import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createConverter } from '../../src/formatting/converter.ts';

describe('formatting converter', () => {
  it('renders basic markdown to HTML', () => {
    assert.match(createConverter().makeHtml('hello **world**'), /<strong>world<\/strong>/);
  });

  it('renders markdown tables', () => {
    const html = createConverter().makeHtml('| A | B |\n| --- | --- |\n| 1 | 2 |');
    assert.match(html, /<table>/);
    assert.match(html, /<td>1<\/td>/);
  });

  it('renders strikethrough', () => {
    assert.match(createConverter().makeHtml('~~gone~~'), /<del>gone<\/del>/);
  });

  it('renders single underscore emphasis', () => {
    assert.match(createConverter().makeHtml('say _hi_ now'), /<em>hi<\/em>/);
  });

  it('renders image dimensions', () => {
    const html = createConverter().makeHtml('![alt](image.png =120x80)');
    assert.match(html, /width="120"/);
    assert.match(html, /height="80"/);
  });
});
