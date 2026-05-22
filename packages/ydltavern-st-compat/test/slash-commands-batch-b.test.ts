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

test('/sendas adds assistant-like message with name override', async () => {
  const context = ctx();
  await last(context, '/sendas name=Chloe Hello there');
  assert.equal(context.chat[0]?.name, 'Chloe');
  assert.equal(context.chat[0]?.is_user, false);
  assert.equal(context.chat[0]?.mes, 'Hello there');
});

test('/sendas defaults to character name when name missing', async () => {
  const context = ctx({ name2: 'Bot' });
  await last(context, '/sendas hello');
  assert.equal(context.chat[0]?.name, 'Bot');
});

test('/sendas return=pipe returns sent text', async () => {
  assert.equal(await last(ctx(), '/sendas name=Chloe return=pipe hi'), 'hi');
});

test('/sendas at inserts at index', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'c' }] });
  await last(context, '/sendas name=B at=1 b');
  assert.deepEqual(context.chat.map((m) => m.mes), ['a', 'b', 'c']);
});

test('/sendas negative at inserts before last', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'c' }] });
  await last(context, '/sendas name=B at=-1 b');
  assert.deepEqual(context.chat.map((m) => m.mes), ['a', 'b', 'c']);
});

test('/send adds user message', async () => {
  const context = ctx({ name1: 'Alice' });
  await last(context, '/send Hello world');
  assert.equal(context.chat[0]?.is_user, true);
  assert.equal(context.chat[0]?.name, 'Alice');
  assert.equal(context.chat[0]?.mes, 'Hello world');
});

test('/send name overrides display name', async () => {
  const context = ctx();
  await last(context, '/send name=Persona hello');
  assert.equal(context.chat[0]?.name, 'Persona');
});

test('/send trims content', async () => {
  const context = ctx();
  await last(context, '/send   hello   ');
  assert.equal(context.chat[0]?.mes, 'hello');
});

test('/send return=pipe returns content', async () => {
  assert.equal(await last(ctx(), '/send return=pipe hi user'), 'hi user');
});

test('/sys adds system message', async () => {
  const context = ctx();
  await last(context, '/sys The sun sets');
  assert.equal(context.chat[0]?.is_system, true);
  assert.equal(context.chat[0]?.name, 'System');
  assert.equal(context.chat[0]?.mes, 'The sun sets');
});

test('/sys name overrides narrator name', async () => {
  const context = ctx();
  await last(context, '/sys name=Narrator words');
  assert.equal(context.chat[0]?.name, 'Narrator');
});

test('/nar alias adds system message', async () => {
  const context = ctx();
  await last(context, '/nar narration');
  assert.equal(context.chat[0]?.mes, 'narration');
  assert.equal(context.chat[0]?.is_system, true);
});

test('/sys at inserts at requested index', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'c' }] });
  await last(context, '/sys at=1 b');
  assert.deepEqual(context.chat.map((m) => m.mes), ['a', 'b', 'c']);
});

test('/comment adds hidden comment message', async () => {
  const context = ctx();
  await last(context, '/comment remember this');
  assert.equal(context.chat[0]?.name, 'Comment');
  assert.equal(context.chat[0]?.is_system, true);
  assert.equal(context.chat[0]?.extra?.is_hidden, true);
});

test('/comment trims text', async () => {
  const context = ctx();
  await last(context, '/comment   note   ');
  assert.equal(context.chat[0]?.mes, 'note');
});

test('/comment at inserts comment', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'c' }] });
  await last(context, '/comment at=1 b');
  assert.deepEqual(context.chat.map((m) => m.mes), ['a', 'b', 'c']);
});

test('/comment return=pipe returns content', async () => {
  assert.equal(await last(ctx(), '/comment return=pipe note'), 'note');
});

test('/continue marks continuation requested', async () => {
  const context = ctx();
  assert.equal(await last(context, '/continue'), '');
  assert.equal(context.continuationRequested, true);
});

test('/continue passes prompt to host generate', async () => {
  const calls: unknown[][] = [];
  const context = ctx({ generate: (...args: unknown[]) => { calls.push(args); return Promise.resolve(); } });
  await last(context, '/continue more please');
  assert.equal(calls[0]?.[0], 'continue');
  assert.deepEqual(calls[0]?.[1], { quiet_prompt: 'more please', quietToLoud: true });
});

test('/cont alias marks continuation requested', async () => {
  const context = ctx();
  await last(context, '/cont');
  assert.equal(context.continuationRequested, true);
});

test('/regenerate marks regeneration requested', async () => {
  const context = ctx();
  await last(context, '/regenerate');
  assert.equal(context.regenerationRequested, true);
});

test('/regenerate calls host generate', async () => {
  const calls: unknown[][] = [];
  await last(ctx({ generate: (...args: unknown[]) => { calls.push(args); return Promise.resolve(); } }), '/regenerate');
  assert.equal(calls[0]?.[0], 'regenerate');
});

test('/regen alias marks regeneration requested', async () => {
  const context = ctx();
  await last(context, '/regen');
  assert.equal(context.regenerationRequested, true);
});

test('/getmessage returns message text', async () => {
  assert.equal(await last(ctx({ chat: [{ mes: 'zero' }, { mes: 'one' }] }), '/getmessage 1'), 'one');
});

test('/get-message alias returns message text', async () => {
  assert.equal(await last(ctx({ chat: [{ mes: 'zero' }] }), '/get-message 0'), 'zero');
});

test('/getmessage invalid index reports failed output', async () => {
  const result = await exec(ctx(), '/getmessage 0');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Invalid message index/u);
});

test('/setmessage index=content edits message', async () => {
  const context = ctx({ chat: [{ mes: 'old' }] });
  assert.equal(await last(context, '/setmessage 0=new text'), 'new text');
  assert.equal(context.chat[0]?.mes, 'new text');
});

test('/setmessage positional index content edits message', async () => {
  const context = ctx({ chat: [{ mes: 'old' }] });
  await last(context, '/setmessage 0 newer text');
  assert.equal(context.chat[0]?.mes, 'newer text');
});

test('/set-message alias edits message', async () => {
  const context = ctx({ chat: [{ mes: 'old' }] });
  await last(context, '/set-message 0=alias text');
  assert.equal(context.chat[0]?.mes, 'alias text');
});

test('/setmessage invalid index reports failure', async () => {
  const result = await exec(ctx({ chat: [{ mes: 'old' }] }), '/setmessage 9=nope');
  assert.equal(result.ok, false);
});

test('/hide hides indexed message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }] });
  await last(context, '/hide 0');
  assert.equal(context.chat[0]?.extra?.is_hidden, true);
});

test('/hide defaults to last message', async () => {
  const context = ctx({ chat: [{ mes: 'a' }, { mes: 'b' }] });
  await last(context, '/hide');
  assert.equal(context.chat[1]?.extra?.is_hidden, true);
  assert.equal(context.chat[0]?.extra?.is_hidden, undefined);
});

test('/hide invalid index reports failure', async () => {
  const result = await exec(ctx(), '/hide 0');
  assert.equal(result.ok, false);
});

test('/unhide unhides indexed message', async () => {
  const context = ctx({ chat: [{ mes: 'a', extra: { is_hidden: true } }] });
  await last(context, '/unhide 0');
  assert.equal(context.chat[0]?.extra?.is_hidden, false);
});

test('/unhide defaults to last message', async () => {
  const context = ctx({ chat: [{ mes: 'a', extra: { is_hidden: true } }, { mes: 'b', extra: { is_hidden: true } }] });
  await last(context, '/unhide');
  assert.equal(context.chat[1]?.extra?.is_hidden, false);
  assert.equal(context.chat[0]?.extra?.is_hidden, true);
});

test('/unhide invalid index reports failure', async () => {
  const result = await exec(ctx(), '/unhide 0');
  assert.equal(result.ok, false);
});
