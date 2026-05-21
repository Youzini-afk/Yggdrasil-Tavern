import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildPrompt } from '../dist/index.js';

const fixturesUrl = new URL('./fixtures/', import.meta.url);

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

test('alignment fixture keeps prompt block order and hidden/deleted handling stable', async () => {
  const [blocks, fixtureChat] = await Promise.all([
    readJsonFixture('prompt-blocks.json'),
    readJsonFixture('chat.json'),
  ]);

  const result = buildPrompt(blocks, fixtureChat, { mode: 'chat' });

  assert.deepEqual(result.diagnostics.includedBlocks, [
    'main',
    'personaDescription',
    'charDescription',
    'scenario',
    'dialogueExamples',
    'chatHistory',
    'post_history',
  ]);
  assert.deepEqual(result.diagnostics.skippedBlocks, ['nsfw']);
  assert.deepEqual(result.diagnostics.warnings, ['Unknown prompt block identifier: post_history']);
  assert.equal(result.diagnostics.insertedHistoryTurns, 3);

  assert.deepEqual(result.messages.map((message) => message.content), [
    'System: Follow the style card.',
    'Persona: The user is a curious archivist.',
    'Character: Seraphina is calm and precise.',
    'Scenario: A lantern-lit library during a storm.',
    'Example:\nUser: Any clues?\nAssistant: The dust points north.',
    'Hello, can you identify this map?',
    'It shows the old observatory ridge.',
    'System reminder from chat log.',
    'Post-history: Keep the reply concise.',
  ]);
  assert.equal(result.messages.some((message) => message.content.includes('Hidden note')), false);
  assert.equal(result.messages.some((message) => message.content.includes('Deleted answer')), false);
});

test('alignment fixture inserts chatHistory at the configured prompt block position', async () => {
  const [blocks, fixtureChat] = await Promise.all([
    readJsonFixture('prompt-blocks.json'),
    readJsonFixture('chat.json'),
  ]);

  const result = buildPrompt(blocks, fixtureChat, { mode: 'chat' });
  const contents = result.messages.map((message) => message.content);

  assert.equal(contents.indexOf('Example:\nUser: Any clues?\nAssistant: The dust points north.'), 4);
  assert.equal(contents.indexOf('Hello, can you identify this map?'), 5);
  assert.equal(contents.indexOf('System reminder from chat log.'), 7);
  assert.equal(contents.indexOf('Post-history: Keep the reply concise.'), 8);
});

async function readJsonFixture(name) {
  const fixture = await readFile(new URL(name, fixturesUrl), 'utf8');
  return JSON.parse(fixture);
}

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
