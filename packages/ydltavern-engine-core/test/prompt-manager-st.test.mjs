import assert from 'node:assert/strict';
import test from 'node:test';

import {
  Prompt,
  PromptCollection,
  Message,
  MessageCollection,
  ChatCompletion,
  INJECTION_POSITION,
  NAMES_BEHAVIOR,
  EXTENSION_PROMPT_TYPES,
  EXTENSION_PROMPT_ROLES,
  DEFAULT_PROMPT_ORDER,
  DEFAULT_MARKER_IDENTIFIERS,
  SQUASH_EXCLUDED_IDS,
  preparePromptsForChatCompletion,
  populationInjectionPrompts,
  populateChatHistory,
  populateDialogueExamples,
  squashSystemMessages,
  sanitizeName,
  getPromptOrderForCharacter,
  isPromptDisabledForActiveCharacter,
} from '../dist/index.js';

test('Prompt assigns ST defaults including injection_position RELATIVE and order 100', () => {
  const p = new Prompt({ identifier: 'main', content: 'hello' });
  assert.equal(p.injection_position, INJECTION_POSITION.RELATIVE);
  assert.equal(p.injection_order, 100);
  assert.equal(p.injection_depth, 4);
  assert.equal(p.role, 'system');
  assert.equal(p.enabled, true);
  assert.equal(p.marker, false);
});

test('Prompt auto-flags default marker identifiers', () => {
  const m = new Prompt({ identifier: 'worldInfoBefore' });
  assert.equal(m.marker, true);
  for (const id of ['worldInfoAfter', 'charDescription', 'chatHistory', 'dialogueExamples']) {
    assert.ok(DEFAULT_MARKER_IDENTIFIERS.has(id), `${id} should be a default marker`);
  }
});

test('PromptCollection rejects non-Prompt instances and supports override tracking', () => {
  const c = new PromptCollection();
  assert.throws(() => c.add({ identifier: 'fake' }), TypeError);

  c.add(new Prompt({ identifier: 'main', content: 'a' }));
  c.add(new Prompt({ identifier: 'jailbreak', content: 'b' }));
  assert.equal(c.length, 2);
  assert.equal(c.has('main'), true);
  assert.equal(c.index('jailbreak'), 1);

  c.override(new Prompt({ identifier: 'main', content: 'override' }), 0);
  assert.equal(c.get('main').content, 'override');
  assert.deepEqual(c.overriddenPrompts, ['main']);
});

test('preparePromptsForChatCompletion respects prompt_order for character', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'You are X' },
      { identifier: 'worldInfoBefore', marker: true },
      { identifier: 'chatHistory', marker: true },
      { identifier: 'jailbreak', content: 'JB' },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: true },
        { identifier: 'worldInfoBefore', enabled: true },
        { identifier: 'chatHistory', enabled: true },
        { identifier: 'jailbreak', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
    worldInfoBefore: 'WI before content',
    openai_max_context: 4096,
    openai_max_tokens: 256,
  });

  const ids = result.prompts.toArray().map((p) => p.identifier);
  assert.deepEqual(ids, ['main', 'worldInfoBefore', 'chatHistory', 'jailbreak']);
  assert.equal(result.prompts.get('worldInfoBefore').content, 'WI before content');
});

test('preparePromptsForChatCompletion keeps disabled main as anchor and skips others', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'Original' },
      { identifier: 'nsfw', content: 'NSFW' },
      { identifier: 'chatHistory', marker: true },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: false },
        { identifier: 'nsfw', enabled: false },
        { identifier: 'chatHistory', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
  });

  assert.deepEqual(result.diagnostics.disabledAnchors, ['main']);
  assert.deepEqual(result.diagnostics.disabledSkipped, ['nsfw']);
  const main = result.prompts.get('main');
  assert.equal(main.content, '');
  assert.equal(main.enabled, false);
  assert.equal(result.prompts.has('nsfw'), false);
});

test('preparePromptsForChatCompletion filters by injection_trigger', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'm' },
      { identifier: 'continueOnly', content: 'c', injection_trigger: ['continue'] },
      { identifier: 'impersonateOnly', content: 'i', injection_trigger: ['impersonate'] },
      { identifier: 'always', content: 'a', injection_trigger: [] },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: true },
        { identifier: 'continueOnly', enabled: true },
        { identifier: 'impersonateOnly', enabled: true },
        { identifier: 'always', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
    generation_type: 'impersonate',
  });

  const ids = result.prompts.toArray().map((p) => p.identifier);
  assert.deepEqual(ids, ['main', 'impersonateOnly', 'always']);
  assert.deepEqual(result.diagnostics.triggerSkipped, ['continueOnly']);
});

test('preparePromptsForChatCompletion applies main override with {{original}}', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [{ identifier: 'main', content: 'Original main' }],
    prompt_order: [{ character_id: 100001, order: [{ identifier: 'main', enabled: true }] }],
    active_character: { id: 100001 },
    systemPromptOverride: 'Override with {{original}}',
  });

  assert.equal(result.prompts.get('main').content, 'Override with Original main');
  assert.deepEqual(result.diagnostics.overriddenPrompts, ['main']);
  assert.equal(result.diagnostics.triggeredOverrides[0].status, 'applied');
});

test('preparePromptsForChatCompletion blocks override when forbid_overrides=true', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [{ identifier: 'jailbreak', content: 'JB', forbid_overrides: true }],
    prompt_order: [{ character_id: 100001, order: [{ identifier: 'jailbreak', enabled: true }] }],
    active_character: { id: 100001 },
    jailbreakPromptOverride: 'NEW JB',
  });

  assert.equal(result.prompts.get('jailbreak').content, 'JB');
  assert.equal(result.diagnostics.triggeredOverrides[0].status, 'blocked_forbidden');
});

test('preparePromptsForChatCompletion fills marker content from inputs', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'sys' },
      { identifier: 'charDescription', marker: true },
      { identifier: 'charPersonality', marker: true },
      { identifier: 'scenario', marker: true },
      { identifier: 'personaDescription', marker: true },
      { identifier: 'worldInfoBefore', marker: true },
      { identifier: 'worldInfoAfter', marker: true },
      { identifier: 'chatHistory', marker: true },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: true },
        { identifier: 'worldInfoBefore', enabled: true },
        { identifier: 'personaDescription', enabled: true },
        { identifier: 'charDescription', enabled: true },
        { identifier: 'charPersonality', enabled: true },
        { identifier: 'scenario', enabled: true },
        { identifier: 'worldInfoAfter', enabled: true },
        { identifier: 'chatHistory', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
    charDescription: 'Char desc text',
    charPersonality: 'Char persona text',
    scenario: 'Scene text',
    personaDescription: 'User persona',
    worldInfoBefore: 'WI before',
    worldInfoAfter: 'WI after',
    personality_format: '{{char}}\'s personality: {{personality}}',
    scenario_format: 'Setting: {{scenario}}',
  });

  assert.equal(result.prompts.get('charDescription').content, 'Char desc text');
  assert.equal(result.prompts.get('charPersonality').content, "{{char}}'s personality: Char persona text");
  assert.equal(result.prompts.get('scenario').content, 'Setting: Scene text');
  assert.equal(result.prompts.get('personaDescription').content, 'User persona');
  assert.equal(result.prompts.get('worldInfoBefore').content, 'WI before');
  assert.equal(result.prompts.get('worldInfoAfter').content, 'WI after');
});

test('preparePromptsForChatCompletion emits chat completion structure with history collection', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'sys main' },
      { identifier: 'worldInfoBefore', marker: true },
      { identifier: 'chatHistory', marker: true },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: true },
        { identifier: 'worldInfoBefore', enabled: true },
        { identifier: 'chatHistory', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
    worldInfoBefore: 'WI before',
    openai_max_context: 4096,
    openai_max_tokens: 512,
  });

  const items = result.chatCompletion.getItems();
  // main message, worldInfoBefore as MessageCollection, chatHistory as empty MessageCollection
  assert.equal(items.length, 3);
  assert.ok(items[0] instanceof Message);
  assert.equal(items[0].identifier, 'main');
  assert.ok(items[1] instanceof MessageCollection);
  assert.equal(items[1].identifier, 'worldInfoBefore');
  assert.ok(items[2] instanceof MessageCollection);
  assert.equal(items[2].identifier, 'chatHistory');
});

test('preparePromptsForChatCompletion adds groupNudge to chatHistory and reserves budget', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'sys' },
      { identifier: 'chatHistory', marker: true },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: true },
        { identifier: 'chatHistory', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
    selected_group: { name: 'Group', members: ['Alice', 'Bob'] },
    group_nudge_prompt: 'Now {{group}} should respond',
    openai_max_context: 4096,
    openai_max_tokens: 256,
  });

  const history = result.chatCompletion.getCollection('chatHistory');
  assert.ok(history);
  const nudge = history.messages.find((m) => m.identifier === 'groupNudge');
  assert.ok(nudge);
  assert.equal(nudge.content, 'Now Alice, Bob should respond');
  assert.ok(result.diagnostics.reservations.some((r) => r.reason === 'groupNudge'));
});

test('preparePromptsForChatCompletion skips groupNudge for impersonate', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [
      { identifier: 'main', content: 'sys' },
      { identifier: 'chatHistory', marker: true },
    ],
    prompt_order: [{
      character_id: 100001,
      order: [
        { identifier: 'main', enabled: true },
        { identifier: 'chatHistory', enabled: true },
      ],
    }],
    active_character: { id: 100001 },
    selected_group: { name: 'Group', members: ['Alice', 'Bob'] },
    group_nudge_prompt: 'Continue as {{group}}',
    impersonation_prompt: 'Impersonate user',
    generation_type: 'impersonate',
  });

  const items = result.chatCompletion.getItems();
  // impersonate prompt should be inserted before chatHistory
  const impersonateIdx = items.findIndex((i) => i instanceof Message && i.identifier === 'impersonate');
  assert.ok(impersonateIdx >= 0);
  const history = result.chatCompletion.getCollection('chatHistory');
  assert.ok(history);
  assert.equal(history.messages.find((m) => m.identifier === 'groupNudge'), undefined);
});

test('preparePromptsForChatCompletion appends extension prompts (summary, authorsNote, vectors)', () => {
  const result = preparePromptsForChatCompletion({
    prompts: [{ identifier: 'main', content: 'sys' }],
    prompt_order: [{ character_id: 100001, order: [{ identifier: 'main', enabled: true }] }],
    active_character: { id: 100001 },
    extensionPrompts: {
      '1_memory': {
        value: 'Summary so far',
        position: EXTENSION_PROMPT_TYPES.IN_PROMPT,
        depth: 0,
        scan: false,
        role: EXTENSION_PROMPT_ROLES.SYSTEM,
      },
      '2_floating_prompt': {
        value: 'Authors note',
        position: EXTENSION_PROMPT_TYPES.IN_PROMPT,
        depth: 0,
        scan: false,
        role: EXTENSION_PROMPT_ROLES.SYSTEM,
      },
      '3_vectors': {
        value: 'Vectors memory',
        position: EXTENSION_PROMPT_TYPES.BEFORE_PROMPT,
        depth: 0,
        scan: false,
        role: EXTENSION_PROMPT_ROLES.SYSTEM,
      },
    },
  });

  const ids = result.chatCompletion.getItems()
    .filter((i) => i instanceof Message)
    .map((i) => i.identifier);
  assert.ok(ids.includes('summary'));
  assert.ok(ids.includes('authorsNote'));
  assert.ok(ids.includes('vectorsMemory'));
});

test('populationInjectionPrompts splices ABSOLUTE prompts at depth and groups by role', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({
    identifier: 'absSystem',
    role: 'system',
    content: 'ABS sys',
    injection_position: INJECTION_POSITION.ABSOLUTE,
    injection_depth: 1,
    injection_order: 100,
  }));
  prompts.add(new Prompt({
    identifier: 'absUser',
    role: 'user',
    content: 'ABS user',
    injection_position: INJECTION_POSITION.ABSOLUTE,
    injection_depth: 1,
    injection_order: 100,
  }));

  const chat = [
    { role: 'user', content: 'old' },
    { role: 'assistant', content: 'new' },
  ];
  const result = populationInjectionPrompts(chat, prompts, {}, 4);
  // depth=1 inserts before index 1 (since depth + totalInserted = 1 + 0 = 1)
  // 2 insertions push everything down
  const idxSys = result.findIndex((m) => m.content === 'ABS sys');
  const idxUser = result.findIndex((m) => m.content === 'ABS user');
  assert.ok(idxSys >= 0);
  assert.ok(idxUser >= 0);
  // sys before user (system role bucket precedes user role bucket)
  assert.ok(idxSys < idxUser);
});

test('populationInjectionPrompts merges same-depth same-role prompts with newline', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({
    identifier: 'a',
    role: 'system',
    content: 'one',
    injection_position: INJECTION_POSITION.ABSOLUTE,
    injection_depth: 0,
    injection_order: 100,
  }));
  prompts.add(new Prompt({
    identifier: 'b',
    role: 'system',
    content: 'two',
    injection_position: INJECTION_POSITION.ABSOLUTE,
    injection_depth: 0,
    injection_order: 100,
  }));

  const result = populationInjectionPrompts([{ role: 'user', content: 'msg' }], prompts);
  const merged = result.find((m) => m.role === 'system');
  assert.ok(merged);
  assert.equal(merged.content, 'one\ntwo');
});

test('populationInjectionPrompts orders by injection_order desc within depth', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({
    identifier: 'low',
    role: 'system',
    content: 'low',
    injection_position: INJECTION_POSITION.ABSOLUTE,
    injection_depth: 0,
    injection_order: 50,
  }));
  prompts.add(new Prompt({
    identifier: 'high',
    role: 'system',
    content: 'high',
    injection_position: INJECTION_POSITION.ABSOLUTE,
    injection_depth: 0,
    injection_order: 200,
  }));

  const result = populationInjectionPrompts([{ role: 'user', content: 'msg' }], prompts);
  const idxHigh = result.findIndex((m) => m.content === 'high');
  const idxLow = result.findIndex((m) => m.content === 'low');
  assert.ok(idxHigh < idxLow); // higher order comes first
});

test('populationInjectionPrompts merges IN_CHAT extension prompts at order=100', () => {
  const prompts = new PromptCollection();
  const extensionPrompts = {
    'depth_inject': {
      value: 'EXT in chat',
      position: EXTENSION_PROMPT_TYPES.IN_CHAT,
      depth: 0,
      scan: false,
      role: EXTENSION_PROMPT_ROLES.SYSTEM,
    },
  };
  const result = populationInjectionPrompts(
    [{ role: 'user', content: 'msg' }],
    prompts,
    extensionPrompts,
  );
  assert.ok(result.find((m) => m.content === 'EXT in chat'));
});

test('squashSystemMessages merges consecutive unnamed system messages with newline', () => {
  const merged = squashSystemMessages([
    { role: 'system', content: 'A' },
    { role: 'system', content: 'B' },
    { role: 'user', content: 'U' },
    { role: 'system', content: 'C' },
    { role: 'system', content: 'D' },
  ]);
  assert.equal(merged.length, 3);
  assert.equal(merged[0].content, 'A\nB');
  assert.equal(merged[1].content, 'U');
  assert.equal(merged[2].content, 'C\nD');
});

test('squashSystemMessages does not merge named or excluded id system messages', () => {
  const merged = squashSystemMessages([
    { role: 'system', content: 'A', name: 'narrator' },
    { role: 'system', content: 'B' },
    { role: 'system', content: 'C', identifier: 'groupNudge' },
    { role: 'system', content: 'D' },
  ]);
  // A is named, B is unnamed, C is excluded id, D is unnamed
  // Result: [A (named, no merge), B (unnamed), C (excluded), D (unnamed, won't merge with C since C excluded)]
  assert.equal(merged.length, 4);
});

test('squashSystemMessages drops empty system messages', () => {
  const merged = squashSystemMessages([
    { role: 'system', content: 'A' },
    { role: 'system', content: '' },
    { role: 'system', content: 'B' },
  ]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].content, 'A\nB');
});

test('populateChatHistory walks newest→oldest and prepends', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'chatHistory', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(10000, 1000);
  cc.append(new MessageCollection('chatHistory'));

  const chat = [
    { role: 'user', content: 'msg 1' },
    { role: 'assistant', content: 'msg 2' },
    { role: 'user', content: 'msg 3' },
  ];

  const r = populateChatHistory(cc, chat);
  assert.equal(r.inserted, 3);
  const history = cc.getCollection('chatHistory');
  assert.equal(history.messages.length, 3);
  // should be in original chat order (oldest to newest)
  assert.equal(history.messages[0].content, 'msg 1');
  assert.equal(history.messages[2].content, 'msg 3');
});

test('populateChatHistory stops at first unaffordable message', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'chatHistory', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(5, 0); // tiny budget — fits "short" but not the long one
  cc.append(new MessageCollection('chatHistory'));

  const chat = [
    { role: 'user', content: 'this is a long old message that will not fit in the budget' },
    { role: 'assistant', content: 'short' },
  ];
  const r = populateChatHistory(cc, chat);
  // newest "short" fits, then "this is a long..." would not, so stop
  assert.equal(r.inserted, 1);
  const history = cc.getCollection('chatHistory');
  assert.equal(history.messages[0].content, 'short');
});

test('populateChatHistory skips hidden and deleted messages', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'chatHistory', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(10000, 1000);
  cc.append(new MessageCollection('chatHistory'));

  const chat = [
    { role: 'user', content: 'visible' },
    { role: 'assistant', content: 'hidden', hidden: true },
    { role: 'user', content: 'deleted', deleted: true },
    { role: 'assistant', content: 'second visible' },
  ];
  populateChatHistory(cc, chat);
  const history = cc.getCollection('chatHistory');
  assert.equal(history.messages.length, 2);
});

test('populateChatHistory applies COMPLETION names_behavior with sanitization', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'chatHistory', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(10000, 1000);
  cc.append(new MessageCollection('chatHistory'));

  const chat = [
    { role: 'user', content: 'hi', name: 'Alice Smith!' },
  ];
  populateChatHistory(cc, chat, { names_behavior: NAMES_BEHAVIOR.COMPLETION });
  const history = cc.getCollection('chatHistory');
  assert.equal(history.messages[0].name, 'Alice_Smith_');
});

test('populateChatHistory applies CONTENT names_behavior by prefixing name', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'chatHistory', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(10000, 1000);
  cc.append(new MessageCollection('chatHistory'));

  const chat = [{ role: 'user', content: 'hi', name: 'Alice' }];
  populateChatHistory(cc, chat, { names_behavior: NAMES_BEHAVIOR.CONTENT });
  const history = cc.getCollection('chatHistory');
  assert.equal(history.messages[0].content, 'Alice: hi');
});

test('populateDialogueExamples splits on Example Dialogue marker and inserts blocks', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'dialogueExamples', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(10000, 1000);
  cc.append(new MessageCollection('dialogueExamples'));

  const examples = '{Example Dialogue:}\nAlice: hi\nBob: hello\n{Example Dialogue:}\nAlice: bye\nBob: goodbye';
  const r = populateDialogueExamples(cc, examples);
  assert.equal(r.blocks, 2);
  // each block: header + 2 messages = 3, *2 blocks = 6 total messages in collection
  const ec = cc.getCollection('dialogueExamples');
  assert.equal(ec.messages.length, 6);
});

test('populateDialogueExamples handles <START> as block separator', () => {
  const prompts = new PromptCollection();
  prompts.add(new Prompt({ identifier: 'dialogueExamples', marker: true }));
  const cc = new ChatCompletion(prompts);
  cc.setTokenBudget(10000, 1000);
  cc.append(new MessageCollection('dialogueExamples'));

  const examples = '<START>\nAlice: a\nBob: b';
  const r = populateDialogueExamples(cc, examples);
  assert.equal(r.blocks, 1);
});

test('sanitizeName enforces ST [A-Za-z0-9_]{1,64}', () => {
  assert.equal(sanitizeName('Alice Smith!'), 'Alice_Smith_');
  assert.equal(sanitizeName('a'.repeat(80)).length, 64);
  assert.equal(sanitizeName('valid_name_123'), 'valid_name_123');
});

test('getPromptOrderForCharacter matches by String() comparison and isPromptDisabled', () => {
  const order = [
    { character_id: 100001, order: [{ identifier: 'main', enabled: true }, { identifier: 'nsfw', enabled: false }] },
    { character_id: '42', order: [{ identifier: 'main', enabled: false }] },
  ];
  const list = getPromptOrderForCharacter(order, { id: '100001' });
  assert.equal(list.length, 2);
  assert.equal(isPromptDisabledForActiveCharacter(order, { id: 100001 }, 'nsfw'), true);
  assert.equal(isPromptDisabledForActiveCharacter(order, { id: 42 }, 'main'), true);
});

test('ChatCompletion budget reservations and canAfford', () => {
  const cc = new ChatCompletion(new PromptCollection());
  cc.setTokenBudget(1000, 100);
  assert.equal(cc.getRemainingBudget(), 900);

  const m = new Message({ role: 'system', content: 'short' });
  assert.ok(cc.canAfford(m));
  cc.reserveBudget(m.tokens);
  cc.freeBudget(50);
  assert.ok(cc.getRemainingBudget() > 800);
});

test('ChatCompletion getChat flattens messages and collections in order', () => {
  const cc = new ChatCompletion(new PromptCollection());
  cc.append(new Message({ role: 'system', content: 'sys', identifier: 'main' }));
  const mc = new MessageCollection('chatHistory');
  mc.add(new Message({ role: 'user', content: 'u1' }));
  mc.add(new Message({ role: 'assistant', content: 'a1' }));
  cc.append(mc);
  cc.append(new Message({ role: 'system', content: 'jb', identifier: 'jailbreak' }));

  const chat = cc.getChat();
  assert.equal(chat.length, 4);
  assert.deepEqual(chat.map((m) => m.role), ['system', 'user', 'assistant', 'system']);
  assert.deepEqual(chat.map((m) => m.content), ['sys', 'u1', 'a1', 'jb']);
});
