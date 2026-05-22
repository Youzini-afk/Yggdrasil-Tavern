import assert from 'node:assert/strict';
import test from 'node:test';

import { applyPromptBudget, countMessages, countText } from '../dist/index.js';

test('approx tokenizer counts chars over four plus message overhead', () => {
  assert.equal(countText('123456789'), 3);
  assert.equal(countMessages([{ role: 'user', content: '12345678' }]), 6);
});

test('applyPromptBudget keeps blocks and drops oldest history first', () => {
  const result = applyPromptBudget(
    [{ identifier: 'main', role: 'system', content: 'System prompt' }],
    {
      id: 'chat',
      meta: {},
      turns: [
        turn('1', 0, 'user', 'old message that is long'),
        turn('2', 1, 'assistant', 'middle message'),
        turn('3', 2, 'user', 'new'),
      ],
    },
    { maxTokens: 21 },
  );

  assert.deepEqual(result.kept.blocks.map((block) => block.identifier), ['main']);
  assert.deepEqual(result.kept.messages.map((message) => message.content), ['middle message', 'new']);
  assert.deepEqual(result.dropped.turnIds, ['1']);
  assert.equal(result.tokenUsage.total <= result.tokenUsage.available, true);
});

function turn(id, index, role, text) {
  return {
    id,
    index,
    role,
    source: role === 'assistant' ? 'generation' : 'user_input',
    variants: [{ id: `${id}-v`, subs: [{ kind: 'text', text }], meta: {}, created_at: 1 }],
    active_variant: 0,
    created_at: 1,
  };
}
