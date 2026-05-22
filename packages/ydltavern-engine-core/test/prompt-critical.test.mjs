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

test('prompt-critical follows PromptManager marker order and reports mapping diagnostics', () => {
  const critical = buildPromptCriticalBlocks({
    persona: 'Persona marker text',
    character: {
      description: 'Description marker text',
      personality: 'Personality marker text',
      scenario: 'Scenario marker text',
    },
    authorNote: 'Author note delta',
    postHistory: 'Post-history delta',
    promptManager: {
      prompts: [
        { identifier: 'personaDescription', content: 'PM persona placeholder', marker: true, role: 'user' },
        { identifier: 'charDescription', content: 'PM char placeholder', marker: true, injection_position: 'before', injection_depth: 3 },
        { identifier: 'scenario', content: 'PM scenario placeholder', marker: true },
      ],
      prompt_order: [
        { identifier: 'scenario', order: 1 },
        { identifier: 'personaDescription', order: 2 },
        { identifier: 'charDescription', order: 3 },
      ],
    },
  });

  assert.deepEqual(critical.blocks.map((block) => block.identifier), [
    'scenario',
    'personaDescription',
    'charDescription',
    'authorNote',
    'postHistory',
  ]);
  assert.equal(critical.blocks[0]?.content, 'Scenario marker text');
  assert.equal(critical.blocks[1]?.role, 'user');
  assert.equal(critical.blocks[2]?.injection_position, 'before');
  assert.equal(critical.blocks[2]?.injection_depth, 3);
  assert.deepEqual(
    critical.diagnostics.markerMapping
      .filter((mapping) => mapping.source !== 'internal')
      .map((mapping) => [mapping.blockIdentifier, mapping.promptIdentifier, mapping.field]),
    [
      ['scenario', 'scenario', 'scenario'],
      ['personaDescription', 'personaDescription', 'personaDescription'],
      ['charDescription', 'charDescription', 'charDescription'],
    ],
  );
  assert.equal(critical.diagnostics.promptManager.disabledSkipped.length, 0);
  assert.equal(critical.diagnostics.knownDeltas.some((delta) => delta.includes('authorNote')), true);
  assert.equal(critical.diagnostics.knownDeltas.some((delta) => delta.includes('postHistory')), true);
});

test('prompt-critical skips disabled PromptManager markers except disabled main anchor', () => {
  const critical = buildPromptCriticalBlocks({
    persona: 'Persona should be disabled',
    character: { description: 'Description survives' },
    prompt_manager: {
      prompts: [
        { identifier: 'main', content: 'Main anchor content' },
        { identifier: 'personaDescription', content: 'Persona placeholder', marker: true },
        { identifier: 'charDescription', content: 'Description placeholder', marker: true },
      ],
      prompt_order: [
        { identifier: 'main', enabled: false, order: 1 },
        { identifier: 'personaDescription', enabled: false, order: 2 },
        { identifier: 'charDescription', enabled: true, order: 3 },
      ],
    },
  });

  assert.deepEqual(critical.blocks.map((block) => block.identifier), ['charDescription']);
  assert.equal(critical.blocks[0]?.content, 'Description survives');
  assert.deepEqual(critical.diagnostics.promptManager.disabledAnchors, ['main']);
  assert.deepEqual(critical.diagnostics.promptManager.disabledSkipped, ['personaDescription']);
});

test('prompt-critical passes through custom prompts and fills marker prompts', () => {
  const critical = buildPromptCriticalBlocks({
    persona: 'Filled persona for {{user}}',
    userName: 'Archivist',
    promptManager: {
      prompts: [
        { identifier: 'customPrompt', content: 'Custom passthrough for {{user}}', role: 'assistant' },
        { identifier: 'personaDescription', content: 'Persona placeholder', marker: true },
        { identifier: 'customMarker', content: 'Custom marker passthrough', marker: true },
      ],
      prompt_order: ['customPrompt', 'personaDescription', 'customMarker'],
    },
  });

  assert.deepEqual(critical.blocks.map((block) => block.identifier), [
    'customPrompt',
    'personaDescription',
    'customMarker',
  ]);
  assert.equal(critical.blocks[0]?.content, 'Custom passthrough for {{user}}');
  assert.equal(critical.blocks[0]?.role, 'assistant');
  assert.equal(critical.blocks[1]?.content, 'Filled persona for Archivist');
  assert.equal(critical.blocks[2]?.content, 'Custom marker passthrough');
  assert.equal(
    critical.diagnostics.markerMapping.find((mapping) => mapping.blockIdentifier === 'personaDescription')?.field,
    'personaDescription',
  );
  assert.equal(
    critical.diagnostics.markerMapping.find((mapping) => mapping.blockIdentifier === 'customMarker')?.field,
    undefined,
  );
});

async function readJsonFixture(name) {
  const fixture = await readFile(new URL(name, fixturesUrl), 'utf8');
  return JSON.parse(fixture);
}
