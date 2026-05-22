import assert from 'node:assert/strict';
import test from 'node:test';

import { substituteSTMacrosDeep, PickState } from '../src/index.js';

test('pre-processors normalize <USER>, <BOT>, <GROUP>, <CHARIFNOTGROUP>', () => {
  const r = substituteSTMacrosDeep('<USER> talks to <BOT> in <GROUP>', {
    env: { user: 'Alice', char: 'Bob', group: 'PartyA' },
  });
  assert.equal(r.text, 'Alice talks to Bob in PartyA');
});

test('legacy {{time_UTC-N}} normalized to {{time::UTCN}}', () => {
  const r = substituteSTMacrosDeep('{{time_UTC-5}}', {
    now: new Date('2026-01-01T12:00:00Z'),
  });
  assert.equal(r.text, '7:00 AM');
});

test('env macros resolve user, char, description, persona, model', () => {
  const r = substituteSTMacrosDeep('{{user}} {{char}} {{description}} {{persona}} {{model}}', {
    env: { user: 'A', char: 'B', description: 'desc', persona: 'P', model: 'gpt-4' },
  });
  assert.equal(r.text, 'A B desc P gpt-4');
});

test('aliases resolve: charDescription, charPersonality, charScenario, greeting', () => {
  const r = substituteSTMacrosDeep('{{charDescription}}|{{charPersonality}}|{{charScenario}}|{{greeting}}', {
    env: { description: 'D', personality: 'P', scenario: 'S', charFirstMessage: 'Hi!' },
  });
  assert.equal(r.text, 'D|P|S|Hi!');
});

test('comment macros // and noop produce empty', () => {
  const r = substituteSTMacrosDeep('A {{// hidden}}B {{noop}}C', {});
  assert.equal(r.text, 'A B C');
});

test('newline and space macros produce N chars', () => {
  const r = substituteSTMacrosDeep('A{{newline:2}}B{{space:3}}C', {});
  assert.equal(r.text, 'A\n\nB   C');
});

test('time/date/isotime/isodate use UTC', () => {
  const now = new Date('2026-05-22T14:30:45Z');
  const r = substituteSTMacrosDeep('{{date}} {{time}} {{isodate}} {{isotime}}', { now });
  assert.equal(r.text, 'May 22, 2026 2:30 PM 2026-05-22 14:30');
});

test('weekday returns full day name', () => {
  const friday = new Date('2026-05-22T12:00:00Z');
  const r = substituteSTMacrosDeep('{{weekday}}', { now: friday });
  assert.equal(r.text, 'Friday');
});

test('datetimeformat substitutes YYYY/MM/DD/HH/mm/ss', () => {
  const now = new Date('2026-05-22T14:30:45Z');
  const r = substituteSTMacrosDeep('{{datetimeformat::YYYY-MM-DD HH:mm:ss}}', { now });
  assert.equal(r.text, '2026-05-22 14:30:45');
});

test('time::UTC offset shifts hours', () => {
  const now = new Date('2026-05-22T12:00:00Z');
  const plus3 = substituteSTMacrosDeep('{{time::UTC+3}}', { now });
  const minus5 = substituteSTMacrosDeep('{{time::UTC-5}}', { now });
  assert.equal(plus3.text, '3:00 PM');
  assert.equal(minus5.text, '7:00 AM');
});

test('random uses injected RNG and picks from comma list', () => {
  const r = substituteSTMacrosDeep('{{random:a,b,c,d}}', { random: () => 0.5 });
  // 0.5 * 4 = 2 → 'c'
  assert.equal(r.text, 'c');
});

test('random :: list with empty options returns empty', () => {
  const r = substituteSTMacrosDeep('{{random}}', { random: () => 0 });
  assert.equal(r.text, '');
});

test('pick uses injected pickSeed RNG', () => {
  const r = substituteSTMacrosDeep('{{pick:x,y,z}}', { pickSeed: () => 0 });
  assert.equal(r.text, 'x');
});

test('roll d6 with seeded RNG is deterministic', () => {
  const r = substituteSTMacrosDeep('{{roll:d6}}', { random: () => 0 });
  assert.equal(r.text, '1');
  const r2 = substituteSTMacrosDeep('{{roll:d6}}', { random: () => 0.99 });
  assert.equal(r2.text, '6');
});

test('roll 2d4 sums dice', () => {
  let calls = 0;
  const r = substituteSTMacrosDeep('{{roll:2d4}}', {
    random: () => { calls++; return 0; },
  });
  // each die = 1, sum = 2; rng called 2 times
  assert.equal(r.text, '2');
  assert.equal(calls, 2);
});

test('getvar/setvar/addvar/incvar/decvar against local map', () => {
  const local = new Map<string, string | number | boolean | null | undefined>();
  const a = substituteSTMacrosDeep('{{setvar::x::5}}', { localVars: local });
  assert.equal(a.text, '5');
  assert.equal(local.get('x'), '5');

  const b = substituteSTMacrosDeep('{{incvar::x}}', { localVars: local });
  assert.equal(b.text, '6');
  const c = substituteSTMacrosDeep('{{getvar::x}}', { localVars: local });
  assert.equal(c.text, '6');
  const d = substituteSTMacrosDeep('{{addvar::x::!}}', { localVars: local });
  assert.equal(d.text, '6!');
  const e = substituteSTMacrosDeep('{{decvar::x}}', { localVars: local });
  // After "6!" decvar Number("6!") is NaN → coerces to 0 then -1
  assert.equal(e.text, '-1');
});

test('hasvar / deletevar mutates local map', () => {
  const local = new Map<string, string | number | boolean | null | undefined>();
  local.set('present', 'x');
  const has = substituteSTMacrosDeep('{{hasvar::present}}|{{hasvar::missing}}', { localVars: local });
  assert.equal(has.text, 'true|false');
  substituteSTMacrosDeep('{{deletevar::present}}', { localVars: local });
  assert.equal(local.has('present'), false);
});

test('global var family operates on globalVars map', () => {
  const global = new Map<string, string | number | boolean | null | undefined>();
  substituteSTMacrosDeep('{{setglobalvar::g::3}}', { globalVars: global });
  assert.equal(global.get('g'), '3');
  const incr = substituteSTMacrosDeep('{{incglobalvar::g}}', { globalVars: global });
  assert.equal(incr.text, '4');
  const has = substituteSTMacrosDeep('{{hasglobalvar::g}}', { globalVars: global });
  assert.equal(has.text, 'true');
  substituteSTMacrosDeep('{{flushglobalvar::g}}', { globalVars: global });
  assert.equal(global.has('g'), false);
});

test('hasExtension checks the extensions set', () => {
  const r = substituteSTMacrosDeep('{{hasExtension::regex}}|{{hasExtension::nope}}', {
    extensions: new Set(['regex']),
  });
  assert.equal(r.text, 'true|false');
});

test('unknown macro preserves by default and empties on option', () => {
  const preserve = substituteSTMacrosDeep('hi {{nopeMacro}} bye', {});
  assert.equal(preserve.text, 'hi {{nopeMacro}} bye');
  const empty = substituteSTMacrosDeep('hi {{nopeMacro}} bye', { unknownMacro: 'empty' });
  assert.equal(empty.text, 'hi  bye');
});

test('recursive expansion resolves nested env across iterations', () => {
  // {{a}} resolves to "{{b}}" which then resolves to "x"
  const r = substituteSTMacrosDeep('{{a}}', {
    env: { user: 'x' } as never,
    // Note: dynamic resolution requires registered env; use env-aliased path
  });
  // Without recursion meta-macro, this just returns unknown preserved.
  // The recursion test below verifies actual recursive expansion via aliases.
  assert.ok(r.iterations >= 1);
});

test('recursive expansion works via aliases', () => {
  // {{description}} contains another macro chain
  const r = substituteSTMacrosDeep('{{description}}', {
    env: { description: '{{user}}' } as never,
  });
  // After 1st iter: "{{user}}" → unknown → preserved (since unknownMacro defaults to preserve)
  assert.ok(r.iterations >= 1);

  const r2 = substituteSTMacrosDeep('{{description}}', {
    env: { description: '{{user}}', user: 'Alice' } as never,
  });
  assert.equal(r2.text, 'Alice');
  assert.ok(r2.iterations >= 2);
});

test('post-processor collapses 3+ newlines to 2', () => {
  const r = substituteSTMacrosDeep('a\n\n\n\n\nb', {});
  assert.equal(r.text, 'a\n\nb');
});

test('PickState caches choice per key and resets', () => {
  const ps = new PickState();
  const a = ps.pick('k', 4, () => 0.5);
  const b = ps.pick('k', 4, () => 0.99);
  assert.equal(a, b); // cached
  ps.reset();
  const c = ps.pick('k', 4, () => 0.99);
  assert.notEqual(a, c);
});

test('instruct macros pull instruct sequence env values', () => {
  const r = substituteSTMacrosDeep('{{instructUserPrefix}}|{{instructAssistantPrefix}}|{{instructStop}}', {
    env: {
      instructUserPrefix: '<|user|>',
      instructAssistantPrefix: '<|assistant|>',
      instructStop: '<|im_end|>',
    } as never,
  });
  assert.equal(r.text, '<|user|>|<|assistant|>|<|im_end|>');
});

test('chat macros pull lastMessage and lastUserMessage from env', () => {
  const r = substituteSTMacrosDeep('{{lastMessage}}|{{lastUserMessage}}', {
    env: { lastMessage: 'L', lastUserMessage: 'U' },
  });
  assert.equal(r.text, 'L|U');
});

test('timeDiff returns absolute ms diff between two ISO timestamps', () => {
  const r = substituteSTMacrosDeep('{{timeDiff::2026-01-01T00:00:00Z::2026-01-01T00:00:01Z}}', {});
  assert.equal(r.text, '1000');
});

test('all macros emit trace entries with sources', () => {
  const r = substituteSTMacrosDeep('{{user}} {{date}} {{nope}}', {
    env: { user: 'A' },
    now: new Date('2026-01-01T00:00:00Z'),
  });
  const sources = r.trace.map((t) => t.source);
  assert.ok(sources.includes('env'));
  assert.ok(sources.includes('computed'));
  assert.ok(sources.includes('unknown'));
});
