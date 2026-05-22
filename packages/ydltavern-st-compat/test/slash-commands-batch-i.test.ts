import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, SlashCommandAbortError, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { registerBatchI } from '../src/slash-commands-batch-i.js';
import { SlashCommandUnsupportedError } from '../src/slash-commands-common.js';

function ctx(overrides: Partial<STContextDeep> = {}): STContextDeep {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
  registerBatchI(context.slashCommandRegistry, { ctx: context });
  return context;
}

async function exec(context: STContextDeep, input: string): Promise<ExecuteSlashCommandsDeepResult> {
  return await context.executeSlashCommands!(input) as ExecuteSlashCommandsDeepResult;
}

async function last(context: STContextDeep, input: string): Promise<string> {
  const result = await exec(context, input);
  return result.outputs.at(-1)?.text ?? '';
}

function json(text: string): Record<string, unknown> {
  return JSON.parse(text) as Record<string, unknown>;
}

async function assertUnsupported(command: string, reason: RegExp): Promise<void> {
  const context = ctx();
  const def = context.slashCommandRegistry.get(command);
  assert.ok(def, `expected /${command} to be registered`);
  await assert.rejects(
    async () => { await def.callback({}, ''); },
    (error) => error instanceof SlashCommandUnsupportedError && reason.test(error.message),
  );
}

test('/delchat returns plan-only descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/delchat')), { planned: true, action: 'delete_chat', fields: {} });
});

test('/delchat does not mutate chat messages', async () => {
  const context = ctx({ chat: [{ mes: 'keep' }] });
  await last(context, '/delchat');
  assert.equal(context.chat.length, 1);
});

test('/renamechat updates ctx.chatId and returns new name', async () => {
  const context = ctx({ chatId: 'old-chat' });
  assert.equal(await last(context, '/renamechat New Chat'), 'New Chat');
  assert.equal(context.chatId, 'New Chat');
  assert.equal(context.chatMetadata.renamed_from, 'old-chat');
});

test('/renamechat accepts name argument', async () => {
  const context = ctx({ chatId: 'old' });
  assert.equal(await last(context, '/renamechat name="Named Chat"'), 'Named Chat');
  assert.equal(context.chatId, 'Named Chat');
});

test('/renamechat missing name reports failure', async () => {
  const result = await exec(ctx(), '/renamechat');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires a new name/u);
});

test('/getchatname returns current chat id', async () => {
  assert.equal(await last(ctx({ chatId: 'session-1' }), '/getchatname'), 'session-1');
});

test('/getchatname returns empty when no chat id', async () => {
  assert.equal(await last(ctx(), '/getchatname'), '');
});

test('/message-name changes indexed message sender name', async () => {
  const context = ctx({ chat: [{ name: 'A', mes: 'one' }, { name: 'B', mes: 'two' }] });
  assert.equal(await last(context, '/message-name index=1 name=Chloe'), 'Chloe');
  assert.equal(context.chat[1]?.name, 'Chloe');
});

test('/message-name supports at alias and positional name', async () => {
  const context = ctx({ chat: [{ name: 'A', mes: 'one' }] });
  assert.equal(await last(context, '/message-name at=0 Riley'), 'Riley');
  assert.equal(context.chat[0]?.name, 'Riley');
});

test('/message-name rejects out-of-range index', async () => {
  const result = await exec(ctx({ chat: [{ name: 'A', mes: 'one' }] }), '/message-name index=4 name=Nope');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /index out of range/u);
});

test('/message-name rejects empty name', async () => {
  const result = await exec(ctx({ chat: [{ name: 'A', mes: 'one' }] }), '/message-name index=0');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires a name/u);
});

test('/sysname sets narrator name in chat metadata', async () => {
  const context = ctx();
  assert.equal(await last(context, '/sysname Narrator'), 'Narrator');
  assert.equal(context.chatMetadata.narrator_name, 'Narrator');
});

test('/sysname empty input resets to System', async () => {
  const context = ctx({ chatMetadata: { narrator_name: 'Old' } });
  assert.equal(await last(context, '/sysname'), 'System');
  assert.equal(context.chatMetadata.narrator_name, 'System');
});

test('/sysname saves metadata', async () => {
  let calls = 0;
  await last(ctx({ saveMetadataDebounced: () => { calls += 1; } }), '/sysname Voice');
  assert.equal(calls, 1);
});

test('/messages returns full chat as formatted JSON', async () => {
  const context = ctx({ chat: [{ name: 'A', mes: 'one' }, { name: 'B', mes: 'two' }] });
  assert.deepEqual(JSON.parse(await last(context, '/messages')), context.chat);
});

test('/messages returns requested slice', async () => {
  const context = ctx({ chat: [{ mes: 'zero' }, { mes: 'one' }, { mes: 'two' }] });
  assert.deepEqual(JSON.parse(await last(context, '/messages start=1 end=3')), [{ mes: 'one' }, { mes: 'two' }]);
});

test('/message alias returns chat slice', async () => {
  const context = ctx({ chat: [{ mes: 'zero' }, { mes: 'one' }] });
  assert.deepEqual(JSON.parse(await last(context, '/message start=0 end=1')), [{ mes: 'zero' }]);
});

test('/messages clamps negative start to zero', async () => {
  const context = ctx({ chat: [{ mes: 'zero' }, { mes: 'one' }] });
  assert.deepEqual(JSON.parse(await last(context, '/messages start=-5 end=1')), [{ mes: 'zero' }]);
});

test('/gen returns generate descriptor with fields', async () => {
  assert.deepEqual(json(await last(ctx(), '/gen text="Hello" trim=true length=64')), {
    planned: true,
    action: 'generate',
    fields: { text: 'Hello', trim: 'true', length: '64' },
  });
});

test('/gen descriptor ignores unnamed prompt until host wiring', async () => {
  assert.deepEqual(json(await last(ctx(), '/gen Hello there')), { planned: true, action: 'generate', fields: {} });
});

test('/genraw returns raw generation descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/genraw prompt="Raw" instruct=off system=Sys')), {
    planned: true,
    action: 'generate_raw',
    fields: { prompt: 'Raw', instruct: 'off', system: 'Sys' },
  });
});

test('/sysgen returns system generation descriptor', async () => {
  assert.equal(json(await last(ctx(), '/sysgen text="System prompt"')).action, 'generate_system');
});

test('/ask returns ask character descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/ask name=Ada text="Question"')), {
    planned: true,
    action: 'ask_character',
    fields: { name: 'Ada', text: 'Question' },
  });
});

test('/addswipe appends and selects a swipe on last assistant message', async () => {
  const context = ctx({ chat: [{ mes: 'base', is_user: false, is_system: false }] });
  assert.equal(await last(context, '/addswipe alternate'), 'alternate');
  assert.deepEqual(context.chat[0]?.swipes, ['base', 'alternate']);
  assert.equal(context.chat[0]?.swipe_id, 1);
  assert.equal(context.chat[0]?.mes, 'alternate');
});

test('/addswipe targets previous assistant when trailing user/system messages exist', async () => {
  const context = ctx({ chat: [{ mes: 'base' }, { mes: 'system', is_system: true }, { mes: 'user', is_user: true }] });
  await last(context, '/addswipe next');
  assert.equal(context.chat[0]?.mes, 'next');
  assert.equal(context.chat[2]?.mes, 'user');
});

test('/swipeadd alias appends swipe text', async () => {
  const context = ctx({ chat: [{ mes: 'base' }] });
  assert.equal(await last(context, '/swipeadd alias text'), 'alias text');
  assert.deepEqual(context.chat[0]?.swipes, ['base', 'alias text']);
});

test('/addswipe rejects empty text', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'base' }] }), '/addswipe');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires text/u);
});

test('/addswipe reports missing assistant message', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'user', is_user: true }] }), '/addswipe text');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no assistant message/u);
});

test('/delswipe removes current swipe and selects remaining text', async () => {
  const context = ctx({ chat: [{ mes: 'two', swipes: ['one', 'two', 'three'], swipe_id: 1 }] });
  assert.equal(await last(context, '/delswipe'), 'three');
  assert.deepEqual(context.chat[0]?.swipes, ['one', 'three']);
  assert.equal(context.chat[0]?.swipe_id, 1);
  assert.equal(context.chat[0]?.mes, 'three');
});

test('/delswipe falls back to last swipe for invalid current id', async () => {
  const context = ctx({ chat: [{ mes: 'two', swipes: ['one', 'two'], swipe_id: 99 }] });
  assert.equal(await last(context, '/delswipe'), 'one');
  assert.deepEqual(context.chat[0]?.swipes, ['one']);
});

test('/swipedel alias removes swipe', async () => {
  const context = ctx({ chat: [{ mes: 'two', swipes: ['one', 'two'], swipe_id: 0 }] });
  assert.equal(await last(context, '/swipedel'), 'two');
  assert.deepEqual(context.chat[0]?.swipes, ['two']);
});

test('/delswipe rejects deleting final variant', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'one', swipes: ['one'], swipe_id: 0 }] }), '/delswipe');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /cannot delete last variant/u);
});

test('/delswipe reports missing assistant message', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'system', is_system: true }] }), '/delswipe');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no assistant message/u);
});

test('/abort throws SlashCommandAbortError directly', async () => {
  const context = ctx();
  const def = context.slashCommandRegistry.get('abort');
  assert.ok(def);
  await assert.rejects(async () => { await def.callback({}, 'Stop now'); }, SlashCommandAbortError);
});

test('/abort invokes provided abort controller and quiet flag', async () => {
  const context = ctx();
  const def = context.slashCommandRegistry.get('abort');
  assert.ok(def);
  const calls: unknown[][] = [];
  await assert.rejects(async () => {
    await def.callback({ _abortController: { abort: (...args: unknown[]) => calls.push(args) }, quiet: 'false' }, 'Stop now');
  }, SlashCommandAbortError);
  assert.deepEqual(calls, [['Stop now', false]]);
});

test('/abort reports failure when executed through registry', async () => {
  const result = await exec(ctx(), '/abort quiet=true stop');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /stop/u);
});

test('/fuzzy returns plan-only descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/fuzzy list=a,b threshold=0.4 mode=best text=abc')), {
    planned: true,
    action: 'fuzzy_match',
    fields: { list: 'a,b', threshold: '0.4', mode: 'best', text: 'abc' },
  });
});

test('/fuzzy empty descriptor has no fields', async () => {
  assert.deepEqual(json(await last(ctx(), '/fuzzy abc')), { planned: true, action: 'fuzzy_match', fields: {} });
});

test('/popup throws unsupported error with DOM reason', async () => {
  await assertUnsupported('popup', /DOM popup runtime/u);
});

test('/setinput throws unsupported error with input reason', async () => {
  await assertUnsupported('setinput', /DOM input element/u);
});

test('/input and /prompt throw unsupported interactive UI errors', async () => {
  await assertUnsupported('input', /interactive prompt UI/u);
  await assertUnsupported('prompt', /interactive prompt UI/u);
});

test('/chat-manager aliases throw unsupported chat manager errors', async () => {
  await assertUnsupported('chat-manager', /chat manager UI/u);
  await assertUnsupported('chat-history', /chat manager UI/u);
  await assertUnsupported('manage-chats', /chat manager UI/u);
});

test('/panels and /togglepanels throw unsupported UI panel errors', async () => {
  await assertUnsupported('panels', /UI panel runtime/u);
  await assertUnsupported('togglepanels', /UI panel runtime/u);
});

test('/forcesave throws unsupported host persistence error', async () => {
  await assertUnsupported('forcesave', /host-managed persistence/u);
});

test('/resetpanels and /resetui throw unsupported UI panel errors', async () => {
  await assertUnsupported('resetpanels', /UI panel runtime/u);
  await assertUnsupported('resetui', /UI panel runtime/u);
});
