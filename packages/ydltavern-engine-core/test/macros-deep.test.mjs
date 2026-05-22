import assert from 'node:assert/strict';
import test from 'node:test';

import { substituteMacros, substituteSTMacrosDeep } from '../dist/index.js';

test('substituteMacros expands {{// comment}} by removing comment', () => {
  const result = substituteMacros('A {{// hidden}}B');
  assert.equal(result.text, 'A B');
});

test('substituteMacros expands {{trim}} and collapses excess newlines', () => {
  const result = substituteMacros('A{{trim}}\n\n\nB');
  assert.equal(result.text, 'A B');
});

test('substituteMacros expands {{newline}}', () => {
  const result = substituteMacros('A{{newline}}B {{newline:2}}C');
  assert.equal(result.text, 'A\nB \n\nC');
});

test('substituteMacros expands {{roll:d6}} with deterministic default harness dice', () => {
  const result = substituteMacros('{{roll:d6}}');
  assert.equal(result.text, '1');
});

test('substituteMacros expands {{pick:a,b,c}} with injected deterministic RNG', () => {
  const result = substituteMacros('{{pick:a,b,c}}', {}, { pickSeed: () => 0.67 });
  assert.equal(result.text, 'c');
});

test('substituteMacros expands {{random:lo,hi}}', () => {
  const result = substituteMacros('{{random:lo,hi}}', {}, { random: () => 0.75 });
  assert.equal(result.text, 'hi');
});

test('substituteMacros expands {{isodate}} with frozen time', () => {
  const result = substituteMacros('{{isodate}}', {}, { now: '2025-05-29T12:00:00.000Z' });
  assert.equal(result.text, '2025-05-29');
});

test('substituteMacros expands {{weekday}} with frozen time', () => {
  const result = substituteMacros('{{weekday}}', {}, { now: '2025-05-29T12:00:00.000Z' });
  assert.equal(result.text, 'Thursday');
});

test('substituteMacros expands {{datetimeformat:YYYY-MM-DD HH:mm}} with frozen time', () => {
  const result = substituteMacros('{{datetimeformat:YYYY-MM-DD HH:mm}}', {}, { now: '2025-05-29T12:00:00.000Z' });
  assert.equal(result.text, '2025-05-29 12:00');
});

test('substituteMacros recursively expands nested macros', () => {
  const result = substituteMacros('{{description}}', { description: '{{user}}', user: 'Alice' });
  assert.equal(result.text, 'Alice');
});

test('substituteMacros respects deterministic default seed for byte-identical output', () => {
  const text = 'Roll: {{roll:d6}}. Pick: {{pick:apple|banana|cherry}}. Random: {{random:1-100}}.';
  const first = substituteMacros(text).text;
  const second = substituteMacros(text).text;
  assert.equal(first, second);
  assert.equal(first, 'Roll: 1. Pick: apple|banana|cherry. Random: 1-100.');
});

test('substituteSTMacrosDeep is exported from engine-core', () => {
  const result = substituteSTMacrosDeep('<USER>{{newline}}<BOT>', { env: { user: 'Alice', char: 'Bob' } });
  assert.equal(result.text, 'Alice\nBob');
});
