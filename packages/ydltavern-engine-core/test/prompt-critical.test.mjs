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
  assert.equal(result.buckets.depthEntries[0]?.depth, 4);
  assert.equal(result.buckets.depthEntries[0]?.role, 'system');
  assert.equal(result.buckets.outlets.default?.entries[0]?.entryId, 'recursive-child');
  assert.equal(result.diagnostics.routingTrace.some((entry) => entry.entryId === 'recursive-seed'), true);
  assert.equal(result.diagnostics.uninserted.some((item) => item.includes('recursive-child')), true);
  assert.equal(result.diagnostics.iterations, 3);
  assert.equal(result.diagnostics.usedBudget > 0, true);
  assert.equal(result.diagnostics.unsupported.some((item) => item.includes('token-level')), true);
});

test('world info routes ST positions with unshift ordering, AN patch, atDepth, EM, and outlets', async () => {
  const chat = await readJsonFixture('chat.json');
  const book = {
    name: 'routing-book',
    entries: [
      { uid: 'before-low', constant: true, content: 'before low', position: 0, order: 10 },
      { uid: 'before-high', constant: true, content: 'before high', position: 'before', order: 20 },
      { uid: 'after-low', constant: true, content: 'after low', position: '1', order: 30 },
      { uid: 'after-high', constant: true, content: 'after high', position: 'after', order: 40 },
      { uid: 'an-top', constant: true, content: 'an top', position: 'author_note_top', order: 50 },
      { uid: 'an-bottom', constant: true, content: 'an bottom', position: 'author-note-bottom', order: 60 },
      { uid: 'depth-assistant', constant: true, content: 'depth assistant', position: 'at-depth', depth: 2, role: 'assistant', order: 70 },
      { uid: 'depth-default', constant: true, content: 'depth default', position: 4, order: 80 },
      { uid: 'em-top', constant: true, content: 'em top', position: 'EMTop', order: 90 },
      { uid: 'em-bottom', constant: true, content: 'em bottom', position: 6, order: 100 },
      { uid: 'outlet-named', constant: true, content: 'outlet named', position: 7, outletName: 'memory', order: 110 },
      { uid: 'outlet-default', constant: true, content: 'outlet default', position: 'outlet', order: 120 },
    ],
  };

  const result = evaluateWorldInfo({ chat, book, originalAuthorNote: 'original note' });

  assert.deepEqual(result.buckets.before, ['before high', 'before low']);
  assert.deepEqual(result.buckets.after, ['after high', 'after low']);
  assert.deepEqual(result.buckets.ANTop, ['an top']);
  assert.deepEqual(result.buckets.ANBottom, ['an bottom']);
  assert.deepEqual(result.buckets.anPatch, {
    top: ['an top'],
    original: 'original note',
    bottom: ['an bottom'],
    patched: 'an top\noriginal note\nan bottom',
  });
  assert.deepEqual(result.buckets.examples, [
    { position: 'after', content: 'em bottom', entryId: 'em-bottom', order: 100 },
    { position: 'before', content: 'em top', entryId: 'em-top', order: 90 },
  ]);
  assert.equal(result.buckets.em, result.buckets.examples);
  assert.deepEqual(
    result.buckets.depthEntries.map((bucket) => ({
      depth: bucket.depth,
      role: bucket.role,
      ids: bucket.entries.map((entry) => entry.entryId),
      content: bucket.content,
    })),
    [
      { depth: 4, role: 'system', ids: ['depth-default'], content: ['depth default'] },
      { depth: 2, role: 'assistant', ids: ['depth-assistant'], content: ['depth assistant'] },
    ],
  );
  assert.deepEqual(result.buckets.outlets.memory?.content, ['outlet named']);
  assert.deepEqual(result.buckets.outlets.default?.content, ['outlet default']);
  assert.equal(result.activated.find((entry) => entry.id === 'depth-default')?.depth, 4);
  assert.equal(result.activated.find((entry) => entry.id === 'depth-assistant')?.role, 'assistant');
  assert.equal(result.diagnostics.routingTrace.find((entry) => entry.entryId === 'em-top')?.inserted, false);
  assert.equal(result.diagnostics.routingTrace.find((entry) => entry.entryId === 'before-high')?.inserted, true);
  assert.equal(result.diagnostics.uninserted.length, 6);
  assert.equal(result.diagnostics.unsupported.some((item) => item.includes('routing output only')), true);
});

test('world info applies deterministic advanced filters and diagnostics', async () => {
  const chat = await readJsonFixture('chat.json');
  const book = {
    name: 'advanced-filters-book',
    entries: [
      { uid: 'trigger-ok', key: ['map'], triggers: ['normal'], content: 'trigger ok', order: 10 },
      { uid: 'trigger-skip', key: ['map'], generationTriggers: ['continue'], content: 'trigger skip', order: 20 },
      {
        uid: 'character-ok',
        key: ['map'],
        characterFilter: { names: ['Seraphina'], tags: ['guide'] },
        content: 'character ok',
        order: 30,
      },
      {
        uid: 'character-skip',
        key: ['map'],
        characterFilter: { tags: ['villain'], exclude: true },
        content: 'character skip',
        order: 40,
      },
      { uid: 'decorator-forced', content: '@@activate forced by decorator', order: 50 },
      { uid: 'decorator-blocked', constant: true, content: '@@dont_activate blocked by decorator', order: 60 },
      { uid: 'scan-flag', key: ['careful archivist'], matchPersonaDescription: true, content: 'scan flag ok', order: 70 },
    ],
  };

  const result = evaluateWorldInfo({
    chat,
    book,
    generation_type: 'normal',
    activeCharacterName: 'Seraphina',
    activeCharacterTags: ['guide', 'villain'],
    personaDescription: 'The user is a careful archivist.',
  });

  assert.deepEqual(
    result.activated.map((entry) => [entry.id, entry.code]),
    [
      ['trigger-ok', 'key_match'],
      ['character-ok', 'key_match'],
      ['decorator-forced', 'decorator_forced'],
      ['scan-flag', 'scan_flag_match'],
    ],
  );
  assert.equal(result.activated.find((entry) => entry.id === 'decorator-forced')?.content, 'forced by decorator');
  assert.equal(result.skipped.find((entry) => entry.id === 'trigger-skip')?.code, 'trigger_mismatch');
  assert.equal(result.skipped.find((entry) => entry.id === 'character-skip')?.code, 'character_filter_mismatch');
  assert.equal(result.skipped.find((entry) => entry.id === 'decorator-blocked')?.code, 'decorator_blocked');
  assert.equal(result.diagnostics.activationTrace.some((entry) => entry.entryId === 'scan-flag' && entry.code === 'scan_flag_match'), true);
});

test('world info honors delay/exclude recursion and min activation scan expansion deterministically', async () => {
  const chat = await readJsonFixture('chat.json');
  const extendedChat = {
    ...chat,
    turns: [
      {
        id: 'turn-user-prologue',
        index: -1,
        role: 'user',
        source: 'user_input',
        variants: [{ id: 'turn-user-prologue-variant', subs: [{ kind: 'text', text: 'Prologue clue.' }], meta: {}, created_at: 1699999999000 }],
        active_variant: 0,
        created_at: 1699999999000,
      },
      ...chat.turns,
    ],
  };
  const book = {
    name: 'recursion-min-book',
    entries: [
      { uid: 'seed', key: ['map'], content: 'seed mentions lantern-key', order: 10 },
      { uid: 'delayed', key: ['lantern-key'], delayUntilRecursion: true, content: 'delayed recursion active', order: 20 },
      { uid: 'excluded-seed', key: ['map'], excludeRecursion: true, content: 'excluded mentions sealed-door', order: 30 },
      { uid: 'excluded-child', key: ['sealed-door'], delayUntilRecursion: true, content: 'should not activate', order: 40 },
      { uid: 'min-activation', key: ['Prologue'], content: 'min activation from expanded scan', order: 50 },
    ],
  };

  const result = evaluateWorldInfo({ chat: extendedChat, book, scanDepth: 3, recursiveScanDepth: 2, minActivations: 4 });

  assert.deepEqual(
    result.activated.map((entry) => [entry.id, entry.code]),
    [
      ['seed', 'key_match'],
      ['delayed', 'key_match'],
      ['excluded-seed', 'key_match'],
      ['min-activation', 'min_activation_scan'],
    ],
  );
  assert.equal(result.skipped.find((entry) => entry.id === 'excluded-child')?.code, 'delay_until_recursion');
  assert.equal(result.activated.find((entry) => entry.id === 'min-activation')?.reason.includes('min activation scan'), true);
  assert.equal(result.diagnostics.warnings.some((warning) => warning.includes('min activations requested 4')), true);
  assert.equal(result.diagnostics.activationTrace.some((entry) => entry.entryId === 'delayed' && entry.iteration === 1), true);
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
