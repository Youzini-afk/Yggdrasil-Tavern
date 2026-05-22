import assert from 'node:assert/strict';
import test from 'node:test';

import { compareGolden, normalizeJson, normalizeText } from '../dist/index.js';

test('golden helpers normalize json keys and text line endings', () => {
  assert.deepEqual(normalizeJson({ b: 2, a: { d: undefined, c: 1 } }), { a: { c: 1 }, b: 2 });
  assert.equal(normalizeText(' a  \r\n b \n'), 'a\n b');
});

test('compareGolden supports exact, whitespace, and structure modes', () => {
  assert.equal(compareGolden('a', 'a', 'exact').pass, true);
  assert.equal(compareGolden('a\n  b', 'a b', 'whitespace').pass, true);
  assert.equal(compareGolden({ b: 1, a: 'x' }, { a: 'y', b: 2 }, 'structure').pass, true);
  assert.equal(compareGolden({ a: 1 }, { a: 1, b: 2 }, 'structure').pass, false);
});
