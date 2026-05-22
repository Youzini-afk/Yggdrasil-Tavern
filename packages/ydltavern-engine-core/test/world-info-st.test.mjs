import assert from 'node:assert/strict';
import test from 'node:test';

import {
  WORLD_INFO_POSITION,
  WI_ANCHOR_POSITION,
  EXTENSION_PROMPT_ROLE,
  SELECTIVE_LOGIC,
  parseRegexFromString,
  escapeRegex,
  matchKeys,
  selectiveLogicMatches,
  parseDecorators,
  decideActivation,
  emptyTimedEffectsState,
  findTimedEffect,
  isStickyActive,
  isCooldownActive,
  isDelayActive,
  applyActivationToTimedEffects,
  routeActivatedEntries,
  entryHash,
} from '../dist/index.js';

test('WORLD_INFO_POSITION matches ST world_info_position enum', () => {
  assert.equal(WORLD_INFO_POSITION.before, 0);
  assert.equal(WORLD_INFO_POSITION.after, 1);
  assert.equal(WORLD_INFO_POSITION.ANTop, 2);
  assert.equal(WORLD_INFO_POSITION.ANBottom, 3);
  assert.equal(WORLD_INFO_POSITION.atDepth, 4);
  assert.equal(WORLD_INFO_POSITION.EMTop, 5);
  assert.equal(WORLD_INFO_POSITION.EMBottom, 6);
  assert.equal(WORLD_INFO_POSITION.outlet, 7);
});

test('SELECTIVE_LOGIC matches ST world_info_logic enum', () => {
  assert.equal(SELECTIVE_LOGIC.AND_ANY, 0);
  assert.equal(SELECTIVE_LOGIC.NOT_ALL, 1);
  assert.equal(SELECTIVE_LOGIC.NOT_ANY, 2);
  assert.equal(SELECTIVE_LOGIC.AND_ALL, 3);
});

test('parseRegexFromString accepts /.../flags with gimsuy', () => {
  assert.ok(parseRegexFromString('/foo/i'));
  assert.ok(parseRegexFromString('/foo/'));
  assert.ok(parseRegexFromString('/foo/giy'));
  assert.equal(parseRegexFromString('/foo/i').test('FOO bar'), true);
});

test('parseRegexFromString rejects invalid flags', () => {
  assert.equal(parseRegexFromString('/foo/x'), null);
  assert.equal(parseRegexFromString('/foo/abc'), null);
});

test('parseRegexFromString rejects unescaped slash inside pattern', () => {
  assert.equal(parseRegexFromString('/foo/bar/'), null);
});

test('parseRegexFromString accepts escaped slashes', () => {
  const re = parseRegexFromString('/a\\/b/i');
  assert.ok(re);
});

test('parseRegexFromString rejects malformed regex', () => {
  assert.equal(parseRegexFromString('not-a-regex'), null);
  assert.equal(parseRegexFromString('/(/i'), null);
});

test('escapeRegex escapes regex meta characters', () => {
  assert.equal(escapeRegex('a.b*c+d?e^f$g{h}i(j)k|l[m]n\\o'), 'a\\.b\\*c\\+d\\?e\\^f\\$g\\{h\\}i\\(j\\)k\\|l\\[m\\]n\\\\o');
});

test('matchKeys plain text uses substring includes by default', () => {
  assert.equal(matchKeys('hello world', 'world'), true);
  assert.equal(matchKeys('hello world', 'WORLD'), true); // case-insensitive default
  assert.equal(matchKeys('hello', 'world'), false);
});

test('matchKeys caseSensitive option', () => {
  assert.equal(matchKeys('HELLO', 'hello', { caseSensitive: false }), true);
  assert.equal(matchKeys('HELLO', 'hello', { caseSensitive: true }), false);
  assert.equal(matchKeys('hello', 'hello', { caseSensitive: true }), true);
});

test('matchKeys matchWholeWords with single token uses boundary regex', () => {
  assert.equal(matchKeys('hello world', 'hello', { matchWholeWords: true }), true);
  assert.equal(matchKeys('helloworld', 'hello', { matchWholeWords: true }), false);
  assert.equal(matchKeys('say hello!', 'hello', { matchWholeWords: true }), true);
});

test('matchKeys matchWholeWords with multi-word needle uses substring', () => {
  assert.equal(matchKeys('say hello world today', 'hello world', { matchWholeWords: true }), true);
  // multi-word skips boundary check per ST behavior
  assert.equal(matchKeys('sayhellow worldtoday', 'hello world', { matchWholeWords: true }), false);
});

test('matchKeys regex pattern bypasses case-sensitive and wholeWord settings', () => {
  // Regex /foo/ matches even with caseSensitive=true and matchWholeWords=true
  assert.equal(matchKeys('foobar', '/foo/', { caseSensitive: true, matchWholeWords: true }), true);
  // Regex /FOO/ does not match foobar (no 'i' flag)
  assert.equal(matchKeys('foobar', '/FOO/', { caseSensitive: false, matchWholeWords: false }), false);
  assert.equal(matchKeys('foobar', '/FOO/i', { caseSensitive: false, matchWholeWords: false }), true);
});

test('selectiveLogicMatches AND_ANY requires at least one secondary key', () => {
  const opts = { caseSensitive: false };
  assert.equal(selectiveLogicMatches('hello world', true, ['world'], SELECTIVE_LOGIC.AND_ANY, opts), true);
  assert.equal(selectiveLogicMatches('hello world', true, ['xyz'], SELECTIVE_LOGIC.AND_ANY, opts), false);
  assert.equal(selectiveLogicMatches('hello world', true, ['xyz', 'world'], SELECTIVE_LOGIC.AND_ANY, opts), true);
});

test('selectiveLogicMatches NOT_ALL requires not all secondary keys to match', () => {
  // At least one secondary key NOT matched → activate
  assert.equal(selectiveLogicMatches('foo bar', true, ['foo', 'baz'], SELECTIVE_LOGIC.NOT_ALL), true);
  // All match → don't activate
  assert.equal(selectiveLogicMatches('foo bar', true, ['foo', 'bar'], SELECTIVE_LOGIC.NOT_ALL), false);
});

test('selectiveLogicMatches NOT_ANY requires no secondary keys to match', () => {
  assert.equal(selectiveLogicMatches('foo bar', true, ['baz', 'qux'], SELECTIVE_LOGIC.NOT_ANY), true);
  assert.equal(selectiveLogicMatches('foo bar', true, ['baz', 'foo'], SELECTIVE_LOGIC.NOT_ANY), false);
});

test('selectiveLogicMatches AND_ALL requires all secondary keys to match', () => {
  assert.equal(selectiveLogicMatches('foo bar baz', true, ['foo', 'bar'], SELECTIVE_LOGIC.AND_ALL), true);
  assert.equal(selectiveLogicMatches('foo bar', true, ['foo', 'baz'], SELECTIVE_LOGIC.AND_ALL), false);
});

test('selectiveLogicMatches without primary match is always false', () => {
  assert.equal(selectiveLogicMatches('hello', false, ['hello'], SELECTIVE_LOGIC.AND_ANY), false);
});

test('selectiveLogicMatches with empty secondary keys returns primary match', () => {
  assert.equal(selectiveLogicMatches('foo', true, [], SELECTIVE_LOGIC.AND_ANY), true);
  assert.equal(selectiveLogicMatches('foo', true, [], SELECTIVE_LOGIC.NOT_ALL), true);
});

test('parseDecorators recognizes @@activate and @@dont_activate', () => {
  const a = parseDecorators('@@activate\nactual content');
  assert.deepEqual(a.decorators, ['@@activate']);
  assert.equal(a.content, 'actual content');

  const d = parseDecorators('@@dont_activate\ncontent');
  assert.deepEqual(d.decorators, ['@@dont_activate']);
  assert.equal(d.content, 'content');
});

test('parseDecorators stops on first non-decorator line', () => {
  const r = parseDecorators('@@activate\nbody line\n@@dont_activate');
  assert.deepEqual(r.decorators, ['@@activate']);
  assert.equal(r.content, 'body line\n@@dont_activate');
});

test('parseDecorators handles multiple decorators on consecutive lines', () => {
  const r = parseDecorators('@@activate\n@@dont_activate\nbody');
  assert.deepEqual(r.decorators, ['@@activate', '@@dont_activate']);
  assert.equal(r.content, 'body');
});

test('parseDecorators handles @@@ as escape', () => {
  // @@@ at top is an escape — content begins immediately, with one @ removed
  const r = parseDecorators('@@@activate\nbody');
  assert.deepEqual(r.decorators, []);
  assert.ok(r.content.includes('@@activate'));
});

test('parseDecorators ignores unknown @@ tokens', () => {
  const r = parseDecorators('@@unknown\nbody');
  assert.deepEqual(r.decorators, []);
  assert.equal(r.content, 'body');
});

test('decideActivation order: @@activate beats @@dont_activate', () => {
  const reason = decideActivation({
    decorators: ['@@activate', '@@dont_activate'],
    externallyActivated: false,
    constant: false,
    stickyActive: false,
    keywordMatched: false,
  });
  assert.equal(reason, 'decorator_activate');
});

test('decideActivation order: external > constant > sticky > keyword', () => {
  const constantOnly = decideActivation({
    decorators: [],
    externallyActivated: false,
    constant: true,
    stickyActive: false,
    keywordMatched: false,
  });
  assert.equal(constantOnly, 'constant');

  const stickyOnly = decideActivation({
    decorators: [],
    externallyActivated: false,
    constant: false,
    stickyActive: true,
    keywordMatched: false,
  });
  assert.equal(stickyOnly, 'sticky');

  const keywordOnly = decideActivation({
    decorators: [],
    externallyActivated: false,
    constant: false,
    stickyActive: false,
    keywordMatched: true,
  });
  assert.equal(keywordOnly, 'keyword');
});

test('decideActivation @@dont_activate blocks even if other conditions hold', () => {
  const reason = decideActivation({
    decorators: ['@@dont_activate'],
    externallyActivated: true,
    constant: true,
    stickyActive: true,
    keywordMatched: true,
  });
  assert.equal(reason, 'decorator_dont_activate');
});

test('decideActivation returns undefined when nothing applies', () => {
  const reason = decideActivation({
    decorators: [],
    externallyActivated: false,
    constant: false,
    stickyActive: false,
    keywordMatched: false,
  });
  assert.equal(reason, undefined);
});

test('isDelayActive checks chatLength against entry.delay', () => {
  assert.equal(isDelayActive({ delay: 5 }, 3), true);
  assert.equal(isDelayActive({ delay: 5 }, 5), false);
  assert.equal(isDelayActive({ delay: 5 }, 10), false);
  assert.equal(isDelayActive({ delay: undefined }, 3), false);
  assert.equal(isDelayActive({ delay: 0 }, 3), false);
});

test('findTimedEffect respects start/end window', () => {
  const records = [{ hash: 1, start: 5, end: 10 }];
  assert.ok(findTimedEffect(records, 1, 7));
  assert.equal(findTimedEffect(records, 1, 4), undefined);
  assert.equal(findTimedEffect(records, 1, 10), undefined);
  assert.equal(findTimedEffect(records, 2, 7), undefined);
});

test('applyActivationToTimedEffects creates sticky and chained cooldown', () => {
  const state = emptyTimedEffectsState();
  applyActivationToTimedEffects(state, { hash: 42, chatLength: 0, sticky: 3, cooldown: 5 });
  assert.equal(state.sticky.length, 1);
  assert.equal(state.sticky[0].start, 0);
  assert.equal(state.sticky[0].end, 3);
  assert.equal(state.cooldown.length, 1);
  // cooldown chains from sticky end
  assert.equal(state.cooldown[0].start, 3);
  assert.equal(state.cooldown[0].end, 8);
  assert.equal(state.cooldown[0].protected, true);
});

test('applyActivationToTimedEffects creates cooldown without sticky', () => {
  const state = emptyTimedEffectsState();
  applyActivationToTimedEffects(state, { hash: 1, chatLength: 5, cooldown: 3 });
  assert.equal(state.sticky.length, 0);
  assert.equal(state.cooldown.length, 1);
  // No sticky, cooldown starts at chatLength+1
  assert.equal(state.cooldown[0].start, 6);
  assert.equal(state.cooldown[0].end, 9);
});

test('isStickyActive bypasses isCooldownActive in activation', () => {
  // Verifies the underlying state checks return correctly
  const state = { sticky: [{ hash: 1, start: 0, end: 5 }], cooldown: [{ hash: 1, start: 0, end: 10 }] };
  assert.equal(isStickyActive(state, 1, 2), true);
  assert.equal(isCooldownActive(state, 1, 2), true);
  // Caller is responsible for sticky-bypass logic
});

test('routeActivatedEntries places before/after into separate buckets', () => {
  const result = routeActivatedEntries([
    { content: 'BEFORE A', position: WORLD_INFO_POSITION.before, order: 100 },
    { content: 'AFTER B', position: WORLD_INFO_POSITION.after, order: 100 },
  ]);
  assert.deepEqual(result.before, ['BEFORE A']);
  assert.deepEqual(result.after, ['AFTER B']);
});

test('routeActivatedEntries sorts by order desc and unshifts (net asc)', () => {
  const result = routeActivatedEntries([
    { content: 'order=200', position: WORLD_INFO_POSITION.before, order: 200 },
    { content: 'order=100', position: WORLD_INFO_POSITION.before, order: 100 },
    { content: 'order=300', position: WORLD_INFO_POSITION.before, order: 300 },
  ]);
  // ST sort desc → unshift → final ascending
  assert.deepEqual(result.before, ['order=100', 'order=200', 'order=300']);
});

test('routeActivatedEntries patches author note with top + original + bottom', () => {
  const result = routeActivatedEntries([
    { content: 'TOP A', position: WORLD_INFO_POSITION.ANTop, order: 100 },
    { content: 'TOP B', position: WORLD_INFO_POSITION.ANTop, order: 200 },
    { content: 'BOT A', position: WORLD_INFO_POSITION.ANBottom, order: 100 },
  ], { originalAuthorNote: 'Original note' });
  assert.equal(result.authorNote.top, 'TOP A\nTOP B');
  assert.equal(result.authorNote.bottom, 'BOT A');
  assert.equal(result.authorNote.originalAuthorNote, 'Original note');
  assert.equal(result.authorNote.patched, 'TOP A\nTOP B\nOriginal note\nBOT A');
});

test('routeActivatedEntries patches author note even without original', () => {
  const result = routeActivatedEntries([
    { content: 'TOP', position: WORLD_INFO_POSITION.ANTop, order: 100 },
  ]);
  assert.equal(result.authorNote.patched, 'TOP');
});

test('routeActivatedEntries merges atDepth by (depth, role) and joins with newline', () => {
  const result = routeActivatedEntries([
    {
      content: 'depth-1-sys-A',
      position: WORLD_INFO_POSITION.atDepth,
      depth: 1,
      role: EXTENSION_PROMPT_ROLE.SYSTEM,
      order: 100,
    },
    {
      content: 'depth-1-sys-B',
      position: WORLD_INFO_POSITION.atDepth,
      depth: 1,
      role: EXTENSION_PROMPT_ROLE.SYSTEM,
      order: 200,
    },
    {
      content: 'depth-1-user',
      position: WORLD_INFO_POSITION.atDepth,
      depth: 1,
      role: EXTENSION_PROMPT_ROLE.USER,
      order: 100,
    },
    {
      content: 'depth-2-sys',
      position: WORLD_INFO_POSITION.atDepth,
      depth: 2,
      role: EXTENSION_PROMPT_ROLE.SYSTEM,
      order: 100,
    },
  ]);

  assert.equal(result.atDepth.length, 3);
  const d1Sys = result.atDepth.find((b) => b.depth === 1 && b.role === EXTENSION_PROMPT_ROLE.SYSTEM);
  const d1User = result.atDepth.find((b) => b.depth === 1 && b.role === EXTENSION_PROMPT_ROLE.USER);
  const d2Sys = result.atDepth.find((b) => b.depth === 2 && b.role === EXTENSION_PROMPT_ROLE.SYSTEM);
  assert.ok(d1Sys);
  assert.ok(d1User);
  assert.ok(d2Sys);
  // Both entries at same (depth, role) merged with \n
  assert.ok(d1Sys.content.includes('depth-1-sys-A'));
  assert.ok(d1Sys.content.includes('depth-1-sys-B'));
  assert.ok(d1Sys.content.includes('\n'));
  assert.equal(d1User.content, 'depth-1-user');
  assert.equal(d2Sys.content, 'depth-2-sys');
});

test('routeActivatedEntries puts EM entries into examples with correct anchor position', () => {
  const result = routeActivatedEntries([
    { content: 'EM TOP', position: WORLD_INFO_POSITION.EMTop, order: 100 },
    { content: 'EM BOTTOM', position: WORLD_INFO_POSITION.EMBottom, order: 100 },
  ]);
  assert.equal(result.examples.length, 2);
  const top = result.examples.find((e) => e.content === 'EM TOP');
  const bottom = result.examples.find((e) => e.content === 'EM BOTTOM');
  assert.equal(top.position, WI_ANCHOR_POSITION.before);
  assert.equal(bottom.position, WI_ANCHOR_POSITION.after);
});

test('routeActivatedEntries groups outlets by name', () => {
  const result = routeActivatedEntries([
    { content: 'one A', position: WORLD_INFO_POSITION.outlet, outletName: 'one', order: 100 },
    { content: 'one B', position: WORLD_INFO_POSITION.outlet, outletName: 'one', order: 200 },
    { content: 'two', position: WORLD_INFO_POSITION.outlet, outletName: 'two', order: 100 },
  ]);
  assert.equal(result.outlets.length, 2);
  const one = result.outlets.find((o) => o.name === 'one');
  const two = result.outlets.find((o) => o.name === 'two');
  assert.ok(one);
  assert.ok(two);
  assert.equal(one.content.length, 2);
  assert.equal(two.content.length, 1);
});

test('entryHash is deterministic and differs per entry', () => {
  const a = entryHash({ uid: 1, content: 'foo', key: ['a'] });
  const b = entryHash({ uid: 1, content: 'foo', key: ['a'] });
  const c = entryHash({ uid: 2, content: 'foo', key: ['a'] });
  assert.equal(a, b);
  assert.notEqual(a, c);
});
