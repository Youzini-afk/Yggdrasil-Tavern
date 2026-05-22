import assert from 'node:assert/strict';
import test from 'node:test';

import {
  EXTENSION_PROMPT_TYPES,
  EXTENSION_PROMPT_ROLES,
  ExtensionPromptStore,
  createVariableScope,
  createToolManager,
  createSTContextDeep,
  createEventSource,
} from '../src/index.js';

test('EXTENSION_PROMPT_TYPES exposes ST canonical enum', () => {
  assert.equal(EXTENSION_PROMPT_TYPES.NONE, -1);
  assert.equal(EXTENSION_PROMPT_TYPES.IN_PROMPT, 0);
  assert.equal(EXTENSION_PROMPT_TYPES.IN_CHAT, 1);
  assert.equal(EXTENSION_PROMPT_TYPES.BEFORE_PROMPT, 2);
});

test('EXTENSION_PROMPT_ROLES exposes ST canonical roles', () => {
  assert.equal(EXTENSION_PROMPT_ROLES.SYSTEM, 0);
  assert.equal(EXTENSION_PROMPT_ROLES.USER, 1);
  assert.equal(EXTENSION_PROMPT_ROLES.ASSISTANT, 2);
});

test('ExtensionPromptStore set/get/remove with defaults', () => {
  const store = new ExtensionPromptStore();
  store.set('1_memory', 'summary content');
  const e = store.get('1_memory');
  assert.equal(e?.value, 'summary content');
  assert.equal(e?.position, EXTENSION_PROMPT_TYPES.IN_PROMPT);
  assert.equal(e?.depth, 4);
  assert.equal(e?.scan, false);
  assert.equal(e?.role, EXTENSION_PROMPT_ROLES.SYSTEM);
  store.remove('1_memory');
  assert.equal(store.get('1_memory'), undefined);
});

test('ExtensionPromptStore.render filters by position', async () => {
  const store = new ExtensionPromptStore();
  store.set('a', 'in-prompt-a', EXTENSION_PROMPT_TYPES.IN_PROMPT);
  store.set('b', 'in-chat-b', EXTENSION_PROMPT_TYPES.IN_CHAT, 2);
  store.set('c', 'before-c', EXTENSION_PROMPT_TYPES.BEFORE_PROMPT);

  const inPrompt = await store.render(EXTENSION_PROMPT_TYPES.IN_PROMPT);
  assert.equal(inPrompt, 'in-prompt-a');

  const beforePrompt = await store.render(EXTENSION_PROMPT_TYPES.BEFORE_PROMPT);
  assert.equal(beforePrompt, 'before-c');
});

test('ExtensionPromptStore.render filters by depth and role', async () => {
  const store = new ExtensionPromptStore();
  store.set('a', 'sys-d2', EXTENSION_PROMPT_TYPES.IN_CHAT, 2, false, EXTENSION_PROMPT_ROLES.SYSTEM);
  store.set('b', 'user-d2', EXTENSION_PROMPT_TYPES.IN_CHAT, 2, false, EXTENSION_PROMPT_ROLES.USER);
  store.set('c', 'sys-d3', EXTENSION_PROMPT_TYPES.IN_CHAT, 3, false, EXTENSION_PROMPT_ROLES.SYSTEM);

  const sysD2 = await store.render(EXTENSION_PROMPT_TYPES.IN_CHAT, 2, '\n', EXTENSION_PROMPT_ROLES.SYSTEM);
  assert.equal(sysD2, 'sys-d2');
});

test('ExtensionPromptStore.render runs filter callback', async () => {
  const store = new ExtensionPromptStore();
  store.set('a', 'always', EXTENSION_PROMPT_TYPES.IN_PROMPT, 4, false, EXTENSION_PROMPT_ROLES.SYSTEM, () => true);
  store.set('b', 'never', EXTENSION_PROMPT_TYPES.IN_PROMPT, 4, false, EXTENSION_PROMPT_ROLES.SYSTEM, () => false);
  const out = await store.render(EXTENSION_PROMPT_TYPES.IN_PROMPT);
  assert.equal(out, 'always');
});

test('ExtensionPromptStore.render wraps with separator when wrap=true', async () => {
  const store = new ExtensionPromptStore();
  store.set('a', 'x');
  const out = await store.render(EXTENSION_PROMPT_TYPES.IN_PROMPT, undefined, '\n', undefined, true);
  assert.equal(out, '\nx\n');
});

test('ExtensionPromptStore.maxDepth tracks IN_CHAT entries', () => {
  const store = new ExtensionPromptStore();
  store.set('a', 'x', EXTENSION_PROMPT_TYPES.IN_PROMPT, 100);
  store.set('b', 'y', EXTENSION_PROMPT_TYPES.IN_CHAT, 5);
  store.set('c', 'z', EXTENSION_PROMPT_TYPES.IN_CHAT, 10);
  assert.equal(store.maxDepth(), 10);
});

test('ExtensionPromptStore.removeDepthPrompts removes only IN_CHAT', () => {
  const store = new ExtensionPromptStore();
  store.set('a', 'in-prompt', EXTENSION_PROMPT_TYPES.IN_PROMPT);
  store.set('b', 'in-chat', EXTENSION_PROMPT_TYPES.IN_CHAT);
  store.removeDepthPrompts();
  assert.equal(store.get('a')?.value, 'in-prompt');
  assert.equal(store.get('b'), undefined);
});

test('createVariableScope get/set/has/del/list', () => {
  const v = createVariableScope({ x: 1 });
  assert.equal(v.get('x'), 1);
  v.set('y', 'hi');
  assert.equal(v.has('y'), true);
  v.del('y');
  assert.equal(v.has('y'), false);
  assert.deepEqual(v.list(), { x: 1 });
});

test('createVariableScope add concatenates strings or sums numbers', () => {
  const v = createVariableScope({ count: 3, name: 'A' });
  v.add('count', 5);
  v.add('name', 'B');
  assert.equal(v.get('count'), 8);
  assert.equal(v.get('name'), 'AB');
});

test('createVariableScope inc/dec', () => {
  const v = createVariableScope({ n: 5 });
  v.inc('n');
  v.dec('n');
  v.dec('n');
  assert.equal(v.get('n'), 4);
});

test('createToolManager registers and queries tools', () => {
  const tm = createToolManager();
  assert.equal(tm.canPerformToolCalls('chat', {}, 'gpt-4o'), false);
  tm.registerFunctionTool({ name: 'foo', description: 'd', parameters: {} });
  assert.equal(tm.canPerformToolCalls('chat', {}, 'gpt-4o'), true);
  tm.unregisterFunctionTool('foo');
  assert.equal(tm.canPerformToolCalls('chat', {}, 'gpt-4o'), false);
});

test('createSTContextDeep exposes ST canonical surface', () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({ eventSource });
  // State
  assert.deepEqual(ctx.chat, []);
  assert.equal(ctx.name1, 'You');
  assert.equal(ctx.name2, 'Assistant');
  assert.equal(ctx.mainApi, 'openai');
  // Bridges
  assert.ok(ctx.eventSource);
  assert.ok(ctx.extensionPrompts);
  assert.ok(ctx.variables.local);
  assert.ok(ctx.variables.global);
  assert.ok(ctx.swipe);
  assert.ok(ctx.toolManager);
  // Functions
  assert.equal(typeof ctx.getCurrentChatId, 'function');
  assert.equal(typeof ctx.substituteParams, 'function');
  assert.equal(typeof ctx.setExtensionPrompt, 'function');
  assert.equal(typeof ctx.getExtensionPrompt, 'function');
  assert.equal(typeof ctx.isMobile, 'function');
  // Legacy aliases
  assert.equal(ctx.event_types, ctx.eventTypes);
  assert.equal(ctx.main_api, ctx.mainApi);
  assert.equal(ctx.online_status, ctx.onlineStatus);
  // Symbols
  assert.equal(typeof ctx.symbols.ignore, 'symbol');
  assert.equal(typeof ctx.constants.unset, 'symbol');
});

test('createSTContextDeep setExtensionPrompt → render round trip', async () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({ eventSource });
  ctx.setExtensionPrompt('1_memory', 'Summary so far');
  const rendered = await ctx.getExtensionPrompt(EXTENSION_PROMPT_TYPES.IN_PROMPT);
  assert.equal(rendered, 'Summary so far');
});

test('createSTContextDeep updateChatMetadata supports reset', () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({ eventSource });
  ctx.updateChatMetadata({ a: 1, b: 2 }, false);
  assert.deepEqual(ctx.chatMetadata, { a: 1, b: 2 });
  ctx.updateChatMetadata({ c: 3 }, true);
  assert.deepEqual(ctx.chatMetadata, { c: 3 });
});

test('createSTContextDeep addOneMessage default appends to chat', () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({ eventSource });
  // Cast to any since STChatMessage is a complex type from @ydltavern/types
  ctx.addOneMessage({ name: 'A', is_user: true, mes: 'hi', send_date: '' } as never);
  assert.equal(ctx.chat.length, 1);
});

test('createSTContextDeep substituteParams uses provided fn', () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({
    eventSource,
    substituteParams: (s) => s.replace('{{user}}', 'Alice'),
  });
  assert.equal(ctx.substituteParams('Hello {{user}}'), 'Hello Alice');
});

test('createSTContextDeep getRequestHeaders returns JSON content-type by default', () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({ eventSource });
  const headers = ctx.getRequestHeaders();
  assert.equal(headers['Content-Type'], 'application/json');
});

test('createSTContextDeep getTokenCountAsync defaults to char/4 approx', async () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({ eventSource });
  const n = await ctx.getTokenCountAsync('hello');
  assert.equal(n, Math.ceil(5 / 4));
});

test('createSTContextDeep host bridge overrides defaults', () => {
  const eventSource = createEventSource();
  const ctx = createSTContextDeep({
    eventSource,
    hostBridge: {
      name1: 'Custom1',
      name2: 'Custom2',
      mainApi: 'claude',
      onlineStatus: 'online',
      maxContext: 200000,
    },
  });
  assert.equal(ctx.name1, 'Custom1');
  assert.equal(ctx.name2, 'Custom2');
  assert.equal(ctx.mainApi, 'claude');
  assert.equal(ctx.main_api, 'claude');
  assert.equal(ctx.onlineStatus, 'online');
  assert.equal(ctx.online_status, 'online');
  assert.equal(ctx.maxContext, 200000);
});
