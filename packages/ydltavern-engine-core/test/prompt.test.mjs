import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPrompt } from '../dist/index.js';

const chat = {
  id: 'chat-1',
  meta: {},
  turns: [
    turn('turn-1', 0, 'user', 'Hello there'),
    turn('turn-2', 1, 'assistant', 'General Kenobi'),
  ],
};

test('prompt builder inserts system block and two Turn messages in order', () => {
  const result = buildPrompt(
    [
      { identifier: 'chatHistory', content: '', order: 20 },
      { identifier: 'main', role: 'system', content: 'You are helpful.', order: 10 },
    ],
    chat,
    { mode: 'chat' },
  );

  assert.deepEqual(result.messages, [
    { role: 'system', content: 'You are helpful.' },
    { role: 'user', content: 'Hello there' },
    { role: 'assistant', content: 'General Kenobi' },
  ]);
  assert.equal(result.diagnostics.insertedHistoryTurns, 2);
});

test('text mode prompt joins blocks and history', () => {
  const result = buildPrompt(
    [
      { identifier: 'main', content: 'System prompt', order: 0 },
      { identifier: 'chatHistory', content: '', order: 1 },
      { identifier: 'jailbreak', content: 'Final instruction', order: 2 },
    ],
    chat,
    { mode: 'text' },
  );

  assert.equal(
    result.text,
    ['System prompt', 'User: Hello there\nAssistant: General Kenobi', 'Final instruction'].join('\n\n'),
  );
  assert.deepEqual(result.messages, []);
});

function turn(id, index, role, text) {
  return {
    id,
    index,
    role,
    source: role === 'assistant' ? 'generation' : 'user_input',
    variants: [
      {
        id: `${id}-variant`,
        subs: [{ kind: 'text', text }],
        meta: {},
        created_at: 1,
      },
    ],
    active_variant: 0,
    created_at: 1,
  };
}
