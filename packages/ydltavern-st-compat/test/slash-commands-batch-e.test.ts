import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';

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

test('/message-role sets user role', async () => {
  const context = ctx({ chat: [{ mes: 'a', is_user: false, is_system: true }] });
  assert.equal(await last(context, '/message-role index=0 role=user'), 'user');
  assert.equal(context.chat[0]?.is_user, true);
  assert.equal(context.chat[0]?.is_system, false);
});

test('/message-role sets assistant role', async () => {
  const context = ctx({ chat: [{ mes: 'a', is_user: true, is_system: true, extra: { type: 'narrator' } }] });
  await last(context, '/message-role index=0 role=assistant');
  assert.equal(context.chat[0]?.is_user, false);
  assert.equal(context.chat[0]?.is_system, false);
  assert.equal(context.chat[0]?.extra?.type, undefined);
});

test('/message-role sets system role', async () => {
  const context = ctx({ chat: [{ mes: 'a', is_user: true, is_system: false }] });
  await last(context, '/message-role index=0 role=system');
  assert.equal(context.chat[0]?.is_user, false);
  assert.equal(context.chat[0]?.is_system, true);
  assert.equal(context.chat[0]?.extra?.type, 'narrator');
});

test('/message-role positional index and role are supported', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b', is_user: true }] });
  await last(context, '/message-role 1 assistant');
  assert.equal(context.chat[1]?.is_user, false);
  assert.equal(context.chat[1]?.is_system, false);
});

test('/message-role invalid index reports failure', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'a' }] }), '/message-role index=9 role=user');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Invalid message index/u);
});

test('/message-role invalid role reports failure', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'a' }] }), '/message-role index=0 role=bot');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Invalid message role/u);
});

test('/delfirst deletes first message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b' }, { mes: 'c' }] });
  await last(context, '/delfirst');
  assert.deepEqual(context.chat.map((message) => message.mes), ['b', 'c']);
});

test('/delfirst no-ops on empty chat', async () => {
  const context = ctx();
  await last(context, '/delfirst');
  assert.equal(context.chat.length, 0);
});

test('/dellast deletes last message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b' }, { mes: 'c' }] });
  await last(context, '/dellast');
  assert.deepEqual(context.chat.map((message) => message.mes), ['a', 'b']);
});

test('/dellast no-ops on empty chat', async () => {
  const context = ctx();
  await last(context, '/dellast');
  assert.equal(context.chat.length, 0);
});

test('/delname deletes all matching messages and returns count', async () => {
  const context = ctx({ chat: [{ name: 'A', mes: '1' }, { name: 'B', mes: '2' }, { name: 'A', mes: '3' }] });
  assert.equal(await last(context, '/delname name=A'), '2');
  assert.deepEqual(context.chat.map((message) => message.name), ['B']);
});

test('/delname supports positional name', async () => {
  const context = ctx({ chat: [{ name: 'A', mes: '1' }, { name: 'B', mes: '2' }] });
  assert.equal(await last(context, '/delname B'), '1');
  assert.deepEqual(context.chat.map((message) => message.name), ['A']);
});

test('/delname no match returns zero', async () => {
  const context = ctx({ chat: [{ name: 'A', mes: '1' }] });
  assert.equal(await last(context, '/delname name=Missing'), '0');
  assert.equal(context.chat.length, 1);
});

test('/delname missing name reports failure', async () => {
  const result = await exec(ctx({ chat: [{ name: 'A' }] }), '/delname');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Message name cannot be empty/u);
});

test('/cut deletes half-open range and returns deleted text', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b' }, { mes: 'c' }, { mes: 'd' }] });
  assert.equal(await last(context, '/cut start=1 end=3'), 'b\nc');
  assert.deepEqual(context.chat.map((message) => message.mes), ['a', 'd']);
});

test('/cut supports positional range', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b' }, { mes: 'c' }] });
  await last(context, '/cut 0-2');
  assert.deepEqual(context.chat.map((message) => message.mes), ['c']);
});

test('/cut invalid range reports failure', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'a' }] }), '/cut start=1 end=0');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Invalid cut range/u);
});

test('/cut start equals end is a no-op', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b' }] });
  assert.equal(await last(context, '/cut start=1 end=1'), '');
  assert.deepEqual(context.chat.map((message) => message.mes), ['a', 'b']);
});

test('/hide-all hides every message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b', extra: { is_hidden: false } }] });
  await last(context, '/hide-all');
  assert.deepEqual(context.chat.map((message) => message.extra?.is_hidden), [true, true]);
});

test('/hide-all is idempotent for already hidden messages', async () => {
  const context = ctx({ chat: [{ mes: 'a', extra: { is_hidden: true } }] });
  await last(context, '/hide-all');
  assert.equal(context.chat[0]?.extra?.is_hidden, true);
});

test('/hide-all preserves existing extra metadata', async () => {
  const context = ctx({ chat: [{ mes: 'a', extra: { image: 'pic.png' } }] });
  await last(context, '/hide-all');
  assert.equal(context.chat[0]?.extra?.image, 'pic.png');
  assert.equal(context.chat[0]?.extra?.is_hidden, true);
});

test('/unhide-all unhides every message', async () => {
  const context = ctx({ chat: [{ mes: 'a', extra: { is_hidden: true } }, { mes: 'b', extra: { is_hidden: true } }] });
  await last(context, '/unhide-all');
  assert.deepEqual(context.chat.map((message) => message.extra?.is_hidden), [false, false]);
});

test('/unhide-all sets false on messages without extra', async () => {
  const context = ctx({ chat: [{ mes: 'a' }] });
  await last(context, '/unhide-all');
  assert.equal(context.chat[0]?.extra?.is_hidden, false);
});

test('/buttons sets extra.buttons on last message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }] });
  await last(context, '/buttons label=Yes,No');
  assert.deepEqual(context.chat[0]?.extra?.buttons, [{ text: 'Yes' }, { text: 'No' }]);
});

test('/buttons parses JSON label objects', async () => {
  const context = ctx({ chat: [{ mes: 'a' }] });
  await last(context, '/buttons labels=[{"text":"Save","icon":"fa-floppy-disk"},{"text":"Cancel"}]');
  assert.deepEqual(context.chat[0]?.extra?.buttons, [{ text: 'Save', icon: 'fa-floppy-disk' }, { text: 'Cancel' }]);
});

test('/buttons without chat reports failure', async () => {
  const result = await exec(ctx(), '/buttons label=Yes');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /without a chat message/u);
});

test('/reply-buttons sets extra.reply_buttons on last message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }] });
  await last(context, '/reply-buttons label=Accept,Reject');
  assert.deepEqual(context.chat[0]?.extra?.reply_buttons, [{ text: 'Accept' }, { text: 'Reject' }]);
});

test('/reply-buttons preserves buttons metadata separately', async () => {
  const context = ctx({ chat: [{ mes: 'a', extra: { buttons: [{ text: 'Old' }] } }] });
  await last(context, '/reply-buttons labels=["A","B"]');
  assert.deepEqual(context.chat[0]?.extra?.buttons, [{ text: 'Old' }]);
  assert.deepEqual(context.chat[0]?.extra?.reply_buttons, [{ text: 'A' }, { text: 'B' }]);
});

test('/messageedit mirrors /setmessage mutation', async () => {
  const context = ctx({ chat: [{ mes: 'old' }] });
  assert.equal(await last(context, '/messageedit 0=new'), 'new');
  assert.equal(context.chat[0]?.mes, 'new');
});

test('/messageedit invalid index reports failure', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'old' }] }), '/messageedit 3=new');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Invalid message index/u);
});
