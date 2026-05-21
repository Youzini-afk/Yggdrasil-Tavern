import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildPrompt, buildPromptCriticalBlocks, evaluateWorldInfo, substituteMacros } from '../dist/index.js';

const fixturesUrl = new URL('./fixtures/', import.meta.url);

test('macro substitution records context, computed, dynamic, and unknown trace entries', () => {
  const result = substituteMacros(
    'Hello {{user}}/{{char}} on {{date}} at {{time}} via {{custom}} and {{missing}}.',
    { user: 'Archivist', char: 'Seraphina', dynamic: { custom: 'override-value' } },
    { now: '2024-01-02T03:04:05.000Z', previewLength: 12 },
  );

  assert.equal(
    result.text,
    'Hello Archivist/Seraphina on 2024-01-02 at 03:04:05 via override-value and {{missing}}.',
  );
  assert.deepEqual(result.trace, [
    { name: 'user', source: 'context', preview: 'Archivist' },
    { name: 'char', source: 'context', preview: 'Seraphina' },
    { name: 'date', source: 'computed', preview: '2024-01-02' },
    { name: 'time', source: 'computed', preview: '03:04:05' },
    { name: 'custom', source: 'dynamic', preview: 'override-va…' },
    { name: 'missing', source: 'unknown', preview: '' },
  ]);
});

test('world info evaluates primary, secondary, regex, case, whole-word, recursive, order, and positions', async () => {
  const [book, expected, chat] = await Promise.all([
    readJsonFixture('world-info-book.json'),
    readJsonFixture('expected-world-info.json'),
    readJsonFixture('chat.json'),
  ]);

  const result = evaluateWorldInfo({
    chat,
    book,
    scanData: ['Seraphina reviews art near a lantern.'],
    scanDepth: 4,
    recursiveScanDepth: 3,
    budget: { max: 1000, type: 'characters' },
    macroContext: { user: 'Archivist', char: 'Seraphina' },
  });

  assert.deepEqual(
    result.activated.map((entry) => entry.id),
    expected.activatedIds,
  );
  assert.deepEqual(result.buckets, expected.buckets);
  assert.equal(result.skipped.some((entry) => entry.id === 'not-any-skip'), true);
  assert.equal(result.activated.find((entry) => entry.id === 'ancient-map')?.matchedSecondaryKeys[0], 'observatory');
  assert.equal(result.activated.find((entry) => entry.id === 'regex-ridge')?.matchedKeys[0], '/old\\s+observatory/i');
  assert.equal(result.activated.find((entry) => entry.id === 'whole-word')?.position, 'ANBottom');
  assert.equal(result.diagnostics.iterations, 3);
  assert.equal(result.diagnostics.usedBudget > 0, true);
  assert.equal(result.diagnostics.unsupported.some((item) => item.includes('token-level')), true);
});

test('prompt-critical blocks inject WI and fields before buildPrompt assembles messages', async () => {
  const [book, input, chat] = await Promise.all([
    readJsonFixture('world-info-book.json'),
    readJsonFixture('prompt-critical-input.json'),
    readJsonFixture('chat.json'),
  ]);
  const worldInfo = evaluateWorldInfo({
    chat,
    book,
    scanData: ['Seraphina reviews art near a lantern.'],
    recursiveScanDepth: 3,
    macroContext: { user: 'Archivist', char: 'Seraphina' },
  });
  const critical = buildPromptCriticalBlocks({ ...input, worldInfo });
  const prompt = buildPrompt(
    [...critical.blocks, { identifier: 'chatHistory', role: 'system', content: '', order: 70 }],
    chat,
    { mode: 'chat' },
  );

  assert.deepEqual(critical.blocks.map((block) => block.identifier), [
    'instruct',
    'worldInfoBefore',
    'personaDescription',
    'charDescription',
    'charPersonality',
    'scenario',
    'authorNote',
    'worldInfoAfter',
    'postHistory',
  ]);
  assert.equal(prompt.messages[0]?.content, 'Instruct: answer in character using fixture-model.');
  assert.equal(prompt.messages.some((message) => message.content.includes('Constant note for Archivist.')), true);
  assert.equal(prompt.messages.some((message) => message.content.includes('Persona: Archivist is a careful archivist.')), true);
  assert.equal(prompt.messages.some((message) => message.content.includes('Author note: keep Seraphina concise.')), true);
  assert.equal(prompt.messages.some((message) => message.content.includes('Regex lore: the old observatory was sealed.')), true);
  assert.equal(prompt.messages.at(-1)?.content, 'Post-history: end with one actionable clue.');
  assert.equal(critical.diagnostics.warnings.length, 2);
  assert.equal(prompt.diagnostics.warnings.includes('Unknown prompt block identifier: instruct'), true);
});

async function readJsonFixture(name) {
  const fixture = await readFile(new URL(name, fixturesUrl), 'utf8');
  return JSON.parse(fixture);
}
