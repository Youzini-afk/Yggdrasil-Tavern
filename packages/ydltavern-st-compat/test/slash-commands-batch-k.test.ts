import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { registerBatchK } from '../src/slash-commands-batch-k.js';

type PlainRecord = Record<string, unknown>;

function ctx(overrides: Partial<STContextDeep> = {}): STContextDeep {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
  registerBatchK(context.slashCommandRegistry, { ctx: context });
  return context;
}

function worldCtx(overrides: Partial<STContextDeep> = {}): STContextDeep {
  const context = ctx(overrides);
  const compat = context as STContextDeep & PlainRecord;
  compat.power_user = {
    world_info_books: {
      lore_main: {
        entries: {
          '0': { uid: '0', keys: ['castle'], content: 'A grand castle', depth: 2 },
          '1': { uid: '1', keys: ['dragon'], content: 'A red dragon', order: 10 },
        },
      },
    },
    world_info_active_books: ['lore_main'],
    persona_descriptions: {
      you_png: { lorebook: 'persona_lore' },
    },
  };
  compat.user_avatar = 'you_png';
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

test('/world sets active world book metadata', async () => {
  const context = ctx();
  assert.equal(await last(context, '/world lore_main'), 'lore_main');
  assert.equal(context.chatMetadata.world_info, 'lore_main');
});

test('/world name= sets active world book metadata', async () => {
  const context = ctx();
  assert.equal(await last(context, '/world name=lore_main'), 'lore_main');
  assert.equal(context.chatMetadata.world_info, 'lore_main');
});

test('/world without args returns current active book', async () => {
  assert.equal(await last(ctx({ chatMetadata: { world_info: 'current_lore' } }), '/world'), 'current_lore');
});

test('/world saves metadata when changed', async () => {
  let calls = 0;
  await last(ctx({ saveMetadataDebounced: () => { calls += 1; } }), '/world lore_main');
  assert.equal(calls, 1);
});

test('/getchatbook returns chat-bound world book', async () => {
  assert.equal(await last(ctx({ chatMetadata: { world_info: 'chat_lore' } }), '/getchatbook'), 'chat_lore');
});

test('/getchatbook returns empty when unbound', async () => {
  assert.equal(await last(ctx(), '/getchatbook'), '');
});

test('/getchatlore alias returns chat-bound world book', async () => {
  assert.equal(await last(ctx({ chatMetadata: { world_info: 'chat_lore' } }), '/getchatlore'), 'chat_lore');
});

test('/getchatwi alias returns chat-bound world book', async () => {
  assert.equal(await last(ctx({ chatMetadata: { world_info: 'chat_lore' } }), '/getchatwi'), 'chat_lore');
});

test('/getglobalbooks returns comma-separated active books', async () => {
  assert.equal(await last(worldCtx(), '/getglobalbooks'), 'lore_main');
});

test('/getglobalbooks returns multiple active books', async () => {
  const context = worldCtx();
  ((context as STContextDeep & PlainRecord).power_user as PlainRecord).world_info_active_books = ['lore_main', 'side_lore'];
  assert.equal(await last(context, '/getglobalbooks'), 'lore_main, side_lore');
});

test('/getglobalbooks returns empty without active list', async () => {
  assert.equal(await last(ctx(), '/getglobalbooks'), '');
});

test('/getgloballore alias returns active books', async () => {
  assert.equal(await last(worldCtx(), '/getgloballore'), 'lore_main');
});

test('/getpersonabook returns current persona lorebook', async () => {
  assert.equal(await last(worldCtx(), '/getpersonabook'), 'persona_lore');
});

test('/getpersonabook returns empty without user avatar', async () => {
  const context = worldCtx();
  delete (context as STContextDeep & PlainRecord).user_avatar;
  assert.equal(await last(context, '/getpersonabook'), '');
});

test('/getpersonabook returns empty for persona without lorebook', async () => {
  const context = worldCtx();
  (context as STContextDeep & PlainRecord).user_avatar = 'missing_png';
  assert.equal(await last(context, '/getpersonabook'), '');
});

test('/getpersonawi alias returns current persona lorebook', async () => {
  assert.equal(await last(worldCtx(), '/getpersonawi'), 'persona_lore');
});

test('/getcharbook returns current character book', async () => {
  const context = ctx({
    characterId: 0,
    characters: [{ name: 'Alice', data: { character_book: 'alice_lore' } }],
  } as Partial<STContextDeep>);
  assert.equal(await last(context, '/getcharbook'), 'alice_lore');
});

test('/getcharbook name= finds character case-insensitively', async () => {
  const context = ctx({
    characters: [{ name: 'Alice', data: { character_book: 'alice_lore' } }],
  } as Partial<STContextDeep>);
  assert.equal(await last(context, '/getcharbook name=alice'), 'alice_lore');
});

test('/getcharbook falls back to top-level character_book', async () => {
  const context = ctx({ characterId: 0, characters: [{ name: 'Bob', character_book: 'bob_lore' }] } as Partial<STContextDeep>);
  assert.equal(await last(context, '/getcharbook'), 'bob_lore');
});

test('/getcharbook returns empty when no character matches', async () => {
  const context = ctx({ characters: [{ name: 'Alice', data: { character_book: 'alice_lore' } }] } as Partial<STContextDeep>);
  assert.equal(await last(context, '/getcharbook name=Bob'), '');
});

test('/getcharlore alias returns character book', async () => {
  const context = ctx({ characterId: 0, characters: [{ name: 'Alice', data: { character_book: 'alice_lore' } }] } as Partial<STContextDeep>);
  assert.equal(await last(context, '/getcharlore'), 'alice_lore');
});

test('/findentry returns matching entry UID', async () => {
  assert.equal(await last(worldCtx(), '/findentry book=lore_main key=castle'), '0');
});

test('/findentry accepts positional key', async () => {
  assert.equal(await last(worldCtx(), '/findentry book=lore_main dragon'), '1');
});

test('/findentry matches key case-insensitively', async () => {
  assert.equal(await last(worldCtx(), '/findentry book=lore_main key=CASTLE'), '0');
});

test('/findentry returns empty for missing entry', async () => {
  assert.equal(await last(worldCtx(), '/findentry book=lore_main key=forest'), '');
});

test('/findentry returns empty for missing book', async () => {
  assert.equal(await last(worldCtx(), '/findentry book=missing key=castle'), '');
});

test('/findentry missing book reports failure', async () => {
  const result = await exec(worldCtx(), '/findentry key=castle');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /book=NAME/u);
});

test('/findentry missing key reports failure', async () => {
  const result = await exec(worldCtx(), '/findentry book=lore_main');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /key=KEY/u);
});

test('/findlore alias returns matching entry UID', async () => {
  assert.equal(await last(worldCtx(), '/findlore book=lore_main key=dragon'), '1');
});

test('/getentryfield returns entry content', async () => {
  assert.equal(await last(worldCtx(), '/getentryfield book=lore_main uid=0 field=content'), 'A grand castle');
});

test('/getentryfield returns numeric field as string', async () => {
  assert.equal(await last(worldCtx(), '/getentryfield book=lore_main uid=0 field=depth'), '2');
});

test('/getentryfield returns array field as JSON', async () => {
  assert.equal(await last(worldCtx(), '/getentryfield book=lore_main uid=1 field=keys'), '["dragon"]');
});

test('/getentryfield returns empty for missing entry', async () => {
  assert.equal(await last(worldCtx(), '/getentryfield book=lore_main uid=9 field=content'), '');
});

test('/getentryfield returns empty for missing field', async () => {
  assert.equal(await last(worldCtx(), '/getentryfield book=lore_main uid=0 field=missing'), '');
});

test('/getentryfield missing required args reports failure', async () => {
  const result = await exec(worldCtx(), '/getentryfield book=lore_main uid=0');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /book, uid, field/u);
});

test('/getwifield alias returns entry field', async () => {
  assert.equal(await last(worldCtx(), '/getwifield book=lore_main uid=0 field=content'), 'A grand castle');
});

test('/createentry returns plan-only descriptor', async () => {
  const out = json(await last(ctx(), '/createentry book=lore_main key=castle content=Entry'));
  assert.equal(out.planned, true);
  assert.equal(out.action, 'world_info.entry.create');
  assert.deepEqual(out.fields, { book: 'lore_main', key: 'castle', content: 'Entry' });
});

test('/createlore alias returns create descriptor', async () => {
  const out = json(await last(ctx(), '/createlore book=lore_main key=dragon content=Entry'));
  assert.equal(out.action, 'world_info.entry.create');
  assert.deepEqual(out.fields, { book: 'lore_main', key: 'dragon', content: 'Entry' });
});

test('/createentry includes optional entry fields', async () => {
  const out = json(await last(ctx(), '/createentry book=lore_main key=castle content=Entry position=before depth=3 order=7'));
  assert.deepEqual(out.fields, { book: 'lore_main', key: 'castle', content: 'Entry', position: 'before', depth: '3', order: '7' });
});

test('/setentryfield returns plan-only descriptor', async () => {
  const out = json(await last(ctx(), '/setentryfield book=lore_main uid=0 field=content value=Updated'));
  assert.equal(out.planned, true);
  assert.equal(out.action, 'world_info.entry.update');
  assert.deepEqual(out.fields, { book: 'lore_main', uid: '0', field: 'content', value: 'Updated' });
});

test('/setwifield alias returns update descriptor', async () => {
  const out = json(await last(ctx(), '/setwifield book=lore_main uid=1 field=content value=Updated'));
  assert.equal(out.action, 'world_info.entry.update');
  assert.deepEqual(out.fields, { book: 'lore_main', uid: '1', field: 'content', value: 'Updated' });
});

test('/wi-set-timed-effect returns plan-only descriptor', async () => {
  const out = json(await last(ctx(), '/wi-set-timed-effect uid=0 effect=sticky duration=5'));
  assert.equal(out.planned, true);
  assert.equal(out.action, 'world_info.timed_effect.set');
  assert.deepEqual(out.fields, { uid: '0', effect: 'sticky', duration: '5' });
});

test('/wi-set-timed-effect omits missing optional fields', async () => {
  const out = json(await last(ctx(), '/wi-set-timed-effect uid=0 effect=sticky'));
  assert.equal(out.action, 'world_info.timed_effect.set');
  assert.deepEqual(out.fields, { uid: '0', effect: 'sticky' });
});

test('/wi-get-timed-effect returns plan-only descriptor', async () => {
  const out = json(await last(ctx(), '/wi-get-timed-effect uid=0'));
  assert.equal(out.planned, true);
  assert.equal(out.action, 'world_info.timed_effect.get');
  assert.deepEqual(out.fields, { uid: '0' });
});

test('/wi-get-timed-effect without uid returns descriptor with empty fields', async () => {
  const out = json(await last(ctx(), '/wi-get-timed-effect'));
  assert.equal(out.action, 'world_info.timed_effect.get');
  assert.deepEqual(out.fields, {});
});
