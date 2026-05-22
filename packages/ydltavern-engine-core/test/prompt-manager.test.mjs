import assert from 'node:assert/strict';
import test from 'node:test';

import { compilePromptCollection } from '../dist/index.js';

test('prompt manager compiles prompt_order and passthrough fields', () => {
  const result = compilePromptCollection({
    prompts: [
      { identifier: 'main', content: 'Main prompt', role: 'system', injection_position: 'before', injection_depth: 2 },
      { identifier: 'chatHistory', content: '', marker: true },
      { identifier: 'jailbreak', content: 'Jailbreak prompt', injection_order: 90 },
    ],
    prompt_order: [
      { identifier: 'main', enabled: true, order: 10, forbid_overrides: true },
      { identifier: 'chatHistory', enabled: true, order: 20 },
      { identifier: 'jailbreak', enabled: true, order: 30 },
    ],
  });

  assert.deepEqual(result.collection.map((prompt) => prompt.identifier), ['main', 'chatHistory', 'jailbreak']);
  assert.deepEqual(result.collection.map((prompt) => prompt.order), [10, 20, 30]);
  assert.equal(result.collection[0]?.role, 'system');
  assert.equal(result.collection[0]?.injection_position, 'before');
  assert.equal(result.collection[0]?.injection_depth, 2);
  assert.equal(result.collection[0]?.forbid_overrides, true);
  assert.equal(result.collection[1]?.marker, true);
  assert.equal(result.collection[2]?.injection_order, 90);
});

test('prompt manager keeps disabled main as empty anchor and skips other disabled prompts', () => {
  const result = compilePromptCollection({
    prompts: [
      { identifier: 'main', content: 'Should not appear' },
      { identifier: 'nsfw', content: 'Should skip' },
      { identifier: 'chatHistory', content: '' },
    ],
    prompt_order: [
      { identifier: 'main', enabled: false },
      { identifier: 'nsfw', enabled: false },
      { identifier: 'chatHistory', enabled: true },
    ],
    main_prompt: 'Override blocked because main is disabled',
  });

  assert.deepEqual(result.collection.map((prompt) => prompt.identifier), ['main', 'chatHistory']);
  assert.equal(result.collection[0]?.enabled, false);
  assert.equal(result.collection[0]?.content, '');
  assert.equal(result.collection[0]?.anchor, true);
  assert.deepEqual(result.diagnostics.disabledAnchors, ['main']);
  assert.deepEqual(result.diagnostics.disabledSkipped, ['nsfw']);
  assert.equal(result.diagnostics.overrides.main.status, 'blocked_disabled');
});

test('prompt manager filters generation triggers while empty triggers always fire', () => {
  const result = compilePromptCollection({
    generation_trigger: 'impersonate',
    prompts: [
      { identifier: 'main', content: 'Always' },
      { identifier: 'continueOnly', content: 'No', generation_trigger: ['continue'] },
      { identifier: 'impersonateOnly', content: 'Yes', generation_trigger: ['impersonate'] },
      { identifier: 'emptyTrigger', content: 'Also yes', generation_trigger: [] },
    ],
    prompt_order: ['main', 'continueOnly', 'impersonateOnly', 'emptyTrigger'],
  });

  assert.deepEqual(result.collection.map((prompt) => prompt.identifier), [
    'main',
    'impersonateOnly',
    'emptyTrigger',
  ]);
  assert.deepEqual(result.diagnostics.triggerSkipped, ['continueOnly']);
});

test('prompt manager recognizes marker custom prompts and reports unknown order ids', () => {
  const result = compilePromptCollection({
    prompts: {
      customPrompt: {
        content: 'Custom content',
        marker: true,
        role: 'user',
      },
    },
    prompt_order: [
      { identifier: 'customPrompt', enabled: true },
      { identifier: 'missingCustom', enabled: true },
      { identifier: 'worldInfoBefore', enabled: true },
    ],
  });

  assert.deepEqual(result.collection.map((prompt) => prompt.identifier), ['customPrompt', 'worldInfoBefore']);
  assert.equal(result.collection[0]?.marker, true);
  assert.equal(result.collection[0]?.role, 'user');
  assert.equal(result.collection[1]?.marker, true);
  assert.deepEqual(result.diagnostics.unknownPromptIds, ['missingCustom']);
  assert.deepEqual(result.diagnostics.missingPromptFallbacks, ['worldInfoBefore']);
});

test('prompt manager records main and jailbreak override diagnostics', () => {
  const applied = compilePromptCollection({
    prompts: [
      { identifier: 'main', content: 'Original main' },
      { identifier: 'jailbreak', content: 'Original jailbreak', forbid_overrides: true },
    ],
    prompt_order: ['main', 'jailbreak'],
    main_prompt: 'Override main with {{original}}',
    jailbreak_prompt: 'Blocked jailbreak',
  });

  assert.equal(applied.diagnostics.overrides.main.status, 'applied');
  assert.equal(applied.collection.find((prompt) => prompt.identifier === 'main')?.content, 'Override main with Original main');
  assert.equal(applied.diagnostics.overrides.jailbreak.status, 'blocked_forbidden');
  assert.equal(
    applied.collection.find((prompt) => prompt.identifier === 'jailbreak')?.content,
    'Original jailbreak',
  );

  const missing = compilePromptCollection({
    prompts: [{ identifier: 'main', content: 'Original main' }],
    prompt_order: ['main'],
    jailbreak_prompt: 'Missing jailbreak',
  });

  assert.equal(missing.diagnostics.overrides.jailbreak.status, 'missing_prompt');
});
