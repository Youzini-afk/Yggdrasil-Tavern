import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type STContextDeep, type ExecuteSlashCommandsDeepResult } from '../src/index.js';

function ctx(overrides: Partial<STContextDeep> = {}): STContextDeep {
  return createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
}

async function exec(context: STContextDeep, input: string): Promise<ExecuteSlashCommandsDeepResult> {
  return await context.executeSlashCommands!(input) as ExecuteSlashCommandsDeepResult;
}

async function last(context: STContextDeep, input: string): Promise<string> {
  const result = await exec(context, input);
  return result.outputs.at(-1)?.text ?? '';
}

test('/api returns current API', async () => {
  assert.equal(await last(ctx({ mainApi: 'openai' }), '/api'), 'openai');
});

test('/api sets current API and alias', async () => {
  const context = ctx();
  assert.equal(await last(context, '/api kobold'), 'kobold');
  assert.equal(context.mainApi, 'kobold');
  assert.equal(context.main_api, 'kobold');
});

test('/api trims API names', async () => {
  const context = ctx();
  assert.equal(await last(context, '/api   novel   '), 'novel');
});

test('/api calls saveSettingsDebounced on set', async () => {
  let calls = 0;
  await last(ctx({ saveSettingsDebounced: () => { calls += 1; } }), '/api horde');
  assert.equal(calls, 1);
});

test('/model returns empty when unset', async () => {
  assert.equal(await last(ctx(), '/model'), '');
});

test('/model returns current model', async () => {
  assert.equal(await last(ctx({ model: 'gpt-test' } as Partial<STContextDeep>), '/model'), 'gpt-test');
});

test('/model sets model', async () => {
  const context = ctx();
  assert.equal(await last(context, '/model claude'), 'claude');
  assert.equal(context.model, 'claude');
});

test('/model trims input', async () => {
  const context = ctx();
  assert.equal(await last(context, '/model   llama-3   '), 'llama-3');
});

test('/tokenizer returns empty when unset', async () => {
  assert.equal(await last(ctx(), '/tokenizer'), '');
});

test('/tokenizer returns current tokenizer', async () => {
  assert.equal(await last(ctx({ tokenizerId: 'llama' } as Partial<STContextDeep>), '/tokenizer'), 'llama');
});

test('/tokenizer sets tokenizer id', async () => {
  const context = ctx();
  assert.equal(await last(context, '/tokenizer gpt2'), 'gpt2');
  assert.equal(context.tokenizerId, 'gpt2');
});

test('/tokenizer trims tokenizer id', async () => {
  assert.equal(await last(ctx(), '/tokenizer   nerdstash   '), 'nerdstash');
});

test('/closechat clears current chat', async () => {
  const context = ctx({ chat: [{ mes: 'one' }, { mes: 'two' }] });
  assert.equal(await last(context, '/closechat'), '');
  assert.equal(context.chat.length, 0);
});

test('/closechat clears chatId', async () => {
  const context = ctx({ chatId: 'chat-a', chat: [{ mes: 'one' }] });
  await last(context, '/closechat');
  assert.equal(context.chatId, undefined);
});

test('/closechat saves chat', async () => {
  let calls = 0;
  await last(ctx({ chat: [{ mes: 'one' }], saveChat: () => { calls += 1; } }), '/closechat');
  assert.equal(calls, 1);
});

test('/tempchat toggles on', async () => {
  const context = ctx();
  assert.equal(await last(context, '/tempchat'), 'true');
  assert.equal(context.temporaryChat, true);
});

test('/tempchat toggles off', async () => {
  const context = ctx({ temporaryChat: true } as Partial<STContextDeep>);
  assert.equal(await last(context, '/tempchat'), 'false');
  assert.equal(context.temporaryChat, false);
});

test('/tempchat clears chat when enabling', async () => {
  const context = ctx({ chat: [{ mes: 'persist' }] });
  await last(context, '/tempchat');
  assert.equal(context.chat.length, 0);
});

test('/swipe defaults to right', async () => {
  let right = 0;
  const context = ctx({ swipe: { left() {}, right() { right += 1; }, to() {}, show() {}, hide() {}, refresh() {}, isAllowed: () => true, state: () => ({ index: 0, count: 1, canSwipeLeft: false, canSwipeRight: true }) } });
  assert.equal(await last(context, '/swipe'), '');
  assert.equal(context.swipeRequested, 'right');
  assert.equal(right, 1);
});

test('/swipe direction=left calls left', async () => {
  let left = 0;
  const context = ctx({ swipe: { left() { left += 1; }, right() {}, to() {}, show() {}, hide() {}, refresh() {}, isAllowed: () => true, state: () => ({ index: 0, count: 1, canSwipeLeft: true, canSwipeRight: false }) } });
  await last(context, '/swipe direction=left');
  assert.equal(context.swipeRequested, 'left');
  assert.equal(left, 1);
});

test('/swipe positional left calls left', async () => {
  let left = 0;
  const context = ctx({ swipe: { left() { left += 1; }, right() {}, to() {}, show() {}, hide() {}, refresh() {}, isAllowed: () => true, state: () => ({ index: 0, count: 1, canSwipeLeft: true, canSwipeRight: false }) } });
  await last(context, '/swipe left');
  assert.equal(left, 1);
});

test('/stop sets generation stopped flag', async () => {
  const context = ctx();
  assert.equal(await last(context, '/stop'), 'true');
  assert.equal(context.generationStopped, true);
});

test('/stop second call reports false', async () => {
  const context = ctx();
  await last(context, '/stop');
  assert.equal(await last(context, '/stop'), 'false');
});

test('/generate-stop alias maps to /stop', async () => {
  const context = ctx();
  assert.equal(await last(context, '/generate-stop'), 'true');
  assert.equal(context.generationStopped, true);
});

test('/last-msg-id returns -1 for empty chat', async () => {
  assert.equal(await last(ctx(), '/last-msg-id'), '-1');
});

test('/last-msg-id returns last index', async () => {
  assert.equal(await last(ctx({ chat: [{ mes: 'a' }, { mes: 'b' }] }), '/last-msg-id'), '1');
});

test('/messagecount returns zero for empty chat', async () => {
  assert.equal(await last(ctx(), '/messagecount'), '0');
});

test('/messagecount returns chat length', async () => {
  assert.equal(await last(ctx({ chat: [{ mes: 'a' }, { mes: 'b' }, { mes: 'c' }] }), '/messagecount'), '3');
});

test('/message-count alias returns chat length', async () => {
  assert.equal(await last(ctx({ chat: [{ mes: 'a' }] }), '/message-count'), '1');
});
