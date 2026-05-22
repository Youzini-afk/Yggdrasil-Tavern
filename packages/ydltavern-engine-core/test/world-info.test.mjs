import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateWorldInfo } from '../dist/index.js';

test('world info probability passes and fails with deterministic random values', () => {
  const result = evaluateWorldInfo({
    chat: chatWithText('the rune glows'),
    randomValues: [0.4, 0.6],
    book: {
      entries: [
        entry('pass', 'the rune glows', 'probability pass', { useProbability: true, probability: 50 }),
        entry('fail', 'the rune glows', 'probability fail', { use_probability: true, probability: 50 }),
      ],
    },
  });

  assert.deepEqual(result.activated.map((item) => item.id), ['pass']);
  assert.equal(result.skipped.find((item) => item.id === 'fail')?.code, 'probability_failed');
  assert.deepEqual(
    result.diagnostics.activationTrace.filter((item) => item.code === 'probability_roll' || item.code === 'probability_failed').map((item) => ({ id: item.entryId, code: item.code, index: item.randomIndex, value: item.randomValue })),
    [
      { id: 'pass', code: 'probability_roll', index: 0, value: 0.4 },
      { id: 'fail', code: 'probability_failed', index: 1, value: 0.6 },
    ],
  );
});

test('world info groupOverride selects highest order entry in group', () => {
  const result = evaluateWorldInfo({
    chat: chatWithText('dragon'),
    book: {
      entries: [
        entry('low', 'dragon', 'low override', { group: 'lair', groupOverride: true, order: 1 }),
        entry('high', 'dragon', 'high override', { group: 'lair', group_override: true, order: 7 }),
        entry('normal', 'dragon', 'normal group', { group: 'lair', order: 10 }),
      ],
    },
  });

  assert.deepEqual(result.activated.map((item) => item.id), ['high']);
  assert.equal(result.skipped.find((item) => item.id === 'low')?.code, 'group_loser');
  assert.equal(result.skipped.find((item) => item.id === 'normal')?.code, 'group_loser');
  assert.equal(result.diagnostics.activationTrace.find((item) => item.entryId === 'high' && item.code === 'group_winner')?.group, 'lair');
});

test('world info weighted group uses seeded RNG', () => {
  const result = evaluateWorldInfo({
    chat: chatWithText('coin'),
    rngSequence: [0.75],
    book: {
      entries: [
        entry('light', 'coin', 'light weight', { group: 'loot', groupWeight: 1 }),
        entry('heavy', 'coin', 'heavy weight', { group: 'loot', group_weight: 3 }),
      ],
    },
  });

  assert.deepEqual(result.activated.map((item) => item.id), ['heavy']);
  const winner = result.diagnostics.activationTrace.find((item) => item.code === 'group_winner');
  assert.equal(winner.entryId, 'heavy');
  assert.equal(winner.randomIndex, 0);
  assert.equal(winner.randomValue, 0.75);
});

test('world info useGroupScoring keeps max matched key score', () => {
  const result = evaluateWorldInfo({
    chat: chatWithText('alpha beta gamma'),
    book: {
      entries: [
        entry('weak', ['alpha'], 'weak score', { group: 'score', useGroupScoring: true }),
        entry('strong', ['alpha', 'beta'], 'strong score', { group: 'score', use_group_scoring: true }),
      ],
    },
  });

  assert.deepEqual(result.activated.map((item) => item.id), ['strong']);
  const loser = result.diagnostics.activationTrace.find((item) => item.entryId === 'weak' && item.code === 'group_scoring_loser');
  assert.equal(loser.score, 1);
  assert.equal(loser.maxScore, 2);
});

test('world info comma-separated multi-group must win every group', () => {
  const result = evaluateWorldInfo({
    chat: chatWithText('sigil'),
    randomValues: [0.5, 0.2],
    book: {
      entries: [
        entry('multi', 'sigil', 'multi group', { group: 'red, blue', groupWeight: 1 }),
        entry('red-winner', 'sigil', 'red winner', { group: 'red', groupWeight: 3 }),
        entry('blue-loser', 'sigil', 'blue loser', { group: 'blue', groupWeight: 1 }),
      ],
    },
  });

  assert.deepEqual(result.activated.map((item) => item.id), ['red-winner']);
  assert.equal(result.skipped.find((item) => item.id === 'multi')?.code, 'group_loser');
  assert.deepEqual(result.diagnostics.activationTrace.filter((item) => item.entryId === 'multi' && item.code === 'group_candidate').map((item) => item.group), ['red', 'blue']);
});

test('world info timed effects persist across generation sequence', () => {
  const book = {
    entries: [entry('timed', 'rune', 'timed lore', { sticky: 2, cooldown: 2 })],
  };

  const first = evaluateWorldInfo({ chat: chatWithText('the rune glows'), chatLength: 1, book });
  assert.deepEqual(first.activated.map((item) => item.id), ['timed']);
  assert.deepEqual(first.nextState.sticky.map(({ entryId, start, end }) => ({ entryId, start, end })), [{ entryId: 'timed', start: 1, end: 3 }]);
  assert.deepEqual(first.nextState.cooldown, []);

  const sticky = evaluateWorldInfo({ chat: chatWithText('quiet room'), chatLength: 2, runtimeState: first.nextState, book });
  assert.deepEqual(sticky.activated.map((item) => item.id), ['timed']);
  assert.equal(sticky.diagnostics.activationTrace.find((item) => item.entryId === 'timed' && item.code === 'sticky_active')?.activated, true);

  const cooldown = evaluateWorldInfo({ chat: chatWithText('the rune glows'), chatLength: 4, runtimeState: sticky.nextState, book });
  assert.deepEqual(cooldown.activated, []);
  assert.equal(cooldown.skipped.find((item) => item.id === 'timed')?.code, 'cooldown_active');
  assert.equal(cooldown.nextState.cooldown.find((item) => item.entryId === 'timed')?.protected, true);
  assert.equal(cooldown.diagnostics.activationTrace.find((item) => item.entryId === 'timed' && item.code === 'protected_cooldown_transition')?.activated, false);
});

test('world info delay expires at chatLength threshold', () => {
  const book = {
    entries: [entry('delay', 'gate', 'delayed lore', { delay: 3 })],
  };

  const waiting = evaluateWorldInfo({ chat: chatWithText('gate'), chat_length: 2, book });
  assert.deepEqual(waiting.activated, []);
  assert.equal(waiting.skipped.find((item) => item.id === 'delay')?.code, 'delay_active');

  const ready = evaluateWorldInfo({ chat: chatWithText('gate'), chat_length: 3, book });
  assert.deepEqual(ready.activated.map((item) => item.id), ['delay']);
});

test('world info dryRun does not update timed effect state', () => {
  const book = {
    entries: [entry('dry', 'spark', 'dry lore', { sticky: 2, cooldown: 2 })],
  };

  const result = evaluateWorldInfo({ chat: chatWithText('spark'), chatLength: 1, dry_run: true, book });
  assert.deepEqual(result.activated.map((item) => item.id), ['dry']);
  assert.deepEqual(result.nextState, { sticky: [], cooldown: [] });
});

function chatWithText(text) {
  return {
    id: 'chat',
    meta: {},
    turns: [
      {
        id: 'turn-1',
        index: 0,
        role: 'user',
        source: 'user_input',
        variants: [{ id: 'variant-1', subs: [{ kind: 'text', text }], meta: {}, created_at: 1 }],
        active_variant: 0,
        created_at: 1,
      },
    ],
  };
}

function entry(uid, key, content, extra = {}) {
  return { uid, key: Array.isArray(key) ? key : [key], content, ...extra };
}
