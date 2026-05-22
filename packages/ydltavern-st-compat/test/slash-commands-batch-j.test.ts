import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { registerBatchJ } from '../src/slash-commands-batch-j.js';

type ExtraContext = Partial<STContextDeep> & Record<string, unknown>;

function ctx(overrides: Partial<STContextDeep> = {}, extras: ExtraContext = {}): STContextDeep {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
  Object.assign(context, extras);
  registerBatchJ(context.slashCommandRegistry, { ctx: context });
  return context;
}

async function exec(context: STContextDeep, input: string): Promise<ExecuteSlashCommandsDeepResult> {
  return await context.executeSlashCommands!(input) as ExecuteSlashCommandsDeepResult;
}

async function last(context: STContextDeep, input: string): Promise<string> {
  const result = await exec(context, input);
  return result.outputs.at(-1)?.text ?? '';
}

const ada = { id: 'a1', name: 'Ada', avatar: 'ada.png', tags: ['friend'], description: 'old' };
const bob = { id: 'b1', name: 'Bob', avatar: 'bob.png', tags: ['foe'], description: 'builder' };
const cy = { id: 'c1', name: 'Cy', avatar: 'cy.png', tags: [] as string[] };

test('/char-get returns character JSON by name', async () => {
  const output = JSON.parse(await last(ctx({ characters: [ada, bob] }), '/char-get name=Ada'));
  assert.equal(output.name, 'Ada');
  assert.equal(output.avatar, 'ada.png');
});

test('/char-data alias returns character JSON by char argument', async () => {
  const output = JSON.parse(await last(ctx({ characters: [ada] }), '/char-data char=ada.png'));
  assert.equal(output.name, 'Ada');
});

test('/char-get returns specific field', async () => {
  assert.equal(await last(ctx({ characters: [ada] }), '/char-get name=Ada field=description'), 'old');
});

test('/char-get finds by id argument', async () => {
  assert.equal(await last(ctx({ characters: [ada, bob] }), '/char-get id=b1 field=name'), 'Bob');
});

test('/char-get uses current character when no name is provided', async () => {
  assert.equal(await last(ctx({ characters: [ada, bob], characterId: 1 }), '/char-get field=name'), 'Bob');
});

test('/char-get missing character reports failure', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/char-get name=Missing');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /character not found/u);
});

test('/rename-char returns plan-only descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/rename-char old=Ada new=Ada2 silent=true chats=false'));
  assert.deepEqual(output, { planned: true, action: 'rename_character', fields: { old: 'Ada', new: 'Ada2', silent: 'true', chats: 'false' } });
});

test('/rename-char does not modify characters', async () => {
  const character = { ...ada };
  await last(ctx({ characters: [character] }), '/rename-char old=Ada new=Ada2');
  assert.equal(character.name, 'Ada');
});

test('/member-get returns descriptor JSON', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  const output = JSON.parse(await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-get name=Bob'));
  assert.deepEqual(output, { name: 'Bob', index: 1, id: 1, avatar: 'bob.png', key: 'bob.png', disabled: false });
});

test('/member-get supports field extraction', async () => {
  const group = { id: 'g1', members: ['ada.png'] };
  assert.equal(await last(ctx({ characters: [ada], groups: [group], groupId: 'g1' }), '/member-get name=0 field=avatar'), 'ada.png');
});

test('/member-get reports missing group', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/member-get name=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no active group/u);
});

test('/member-get reports missing member', async () => {
  const group = { id: 'g1', members: ['ada.png'] };
  const result = await exec(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-get name=Bob');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /group member not found/u);
});

test('/member-up moves member earlier', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png', 'cy.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob, cy], groups: [group], groupId: 'g1' }), '/member-up name=Bob'), 'Bob');
  assert.deepEqual(group.members, ['bob.png', 'ada.png', 'cy.png']);
});

test('/member-up leaves first member in place', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-up name=Ada'), 'Ada');
  assert.deepEqual(group.members, ['ada.png', 'bob.png']);
});

test('/member-up accepts numeric index', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-up 1');
  assert.deepEqual(group.members, ['bob.png', 'ada.png']);
});

test('/member-down moves member later', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png', 'cy.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob, cy], groups: [group], groupId: 'g1' }), '/member-down name=Bob'), 'Bob');
  assert.deepEqual(group.members, ['ada.png', 'cy.png', 'bob.png']);
});

test('/member-down leaves last member in place', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-down name=Bob'), 'Bob');
  assert.deepEqual(group.members, ['ada.png', 'bob.png']);
});

test('/member-down reorders chat metadata group_order when present', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  const chatMetadata = { group_order: ['ada.png', 'bob.png'] };
  await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1', chatMetadata }), '/member-down name=Ada');
  assert.deepEqual(chatMetadata.group_order, ['bob.png', 'ada.png']);
});

test('/member-count returns active group size', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png', 'cy.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob, cy], groups: [group], groupId: 'g1' }), '/member-count'), '3');
});

test('/member-count supports chatMetadata group_order fallback', async () => {
  assert.equal(await last(ctx({ groupId: 'meta', chatMetadata: { group_order: ['ada.png', 'bob.png'] } }), '/member-count'), '2');
});

test('/member-count reports no active group', async () => {
  const result = await exec(ctx(), '/member-count');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no active group/u);
});

test('/member-peek returns plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/member-peek name=Ada field=description'));
  assert.deepEqual(output, { planned: true, action: 'member_peek', fields: { name: 'Ada', field: 'description' } });
});

test('/peek alias returns member-peek plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/peek name=Bob'));
  assert.equal(output.action, 'member_peek');
  assert.deepEqual(output.fields, { name: 'Bob' });
});

test('/tag-add adds a new tag', async () => {
  const character = { ...ada, tags: ['friend'] };
  assert.equal(await last(ctx({ characters: [character] }), '/tag-add name=Ada tag=ally'), 'ally');
  assert.deepEqual(character.tags, ['friend', 'ally']);
});

test('/tag-add deduplicates an existing tag', async () => {
  const character = { ...ada, tags: ['friend'] };
  await last(ctx({ characters: [character] }), '/tag-add name=Ada tag=friend');
  assert.deepEqual(character.tags, ['friend']);
});

test('/tag-add creates tags array when absent', async () => {
  const character: Record<string, unknown> = { name: 'Ada', avatar: 'ada.png' };
  await last(ctx({ characters: [character] }), '/tag-add name=Ada tag=ally');
  assert.deepEqual(character.tags, ['ally']);
});

test('/tag-add requires character name', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/tag-add tag=ally');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires character name/u);
});

test('/tag-remove removes an existing tag', async () => {
  const character = { ...ada, tags: ['friend', 'ally'] };
  assert.equal(await last(ctx({ characters: [character] }), '/tag-remove name=Ada tag=friend'), 'friend');
  assert.deepEqual(character.tags, ['ally']);
});

test('/tag-remove is stable for absent tag', async () => {
  const character = { ...ada, tags: ['friend'] };
  await last(ctx({ characters: [character] }), '/tag-remove name=Ada tag=ally');
  assert.deepEqual(character.tags, ['friend']);
});

test('/tag-remove reports missing character', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/tag-remove name=Missing tag=ally');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /character 'Missing' not found/u);
});

test('/tag-exists returns true for assigned tag', async () => {
  assert.equal(await last(ctx({ characters: [ada] }), '/tag-exists name=Ada tag=friend'), 'true');
});

test('/tag-exists returns false for absent tag', async () => {
  assert.equal(await last(ctx({ characters: [ada] }), '/tag-exists name=Ada tag=ally'), 'false');
});

test('/tag-exists requires tag', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/tag-exists name=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires tag/u);
});

test('/tag-list returns comma-separated tags', async () => {
  assert.equal(await last(ctx({ characters: [{ ...ada, tags: ['friend', 'ally'] }] }), '/tag-list name=Ada'), 'friend, ally');
});

test('/tag-list returns empty for no tags', async () => {
  assert.equal(await last(ctx({ characters: [{ ...cy, tags: [] }] }), '/tag-list name=Cy'), '');
});

test('/tag-list reports missing character', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/tag-list name=Missing');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /character 'Missing' not found/u);
});

test('/tag-import returns plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/tag-import file=cards/Ada.png name=Ada mode=all'));
  assert.deepEqual(output, { planned: true, action: 'tag_import', fields: { file: 'cards/Ada.png', name: 'Ada', mode: 'all' } });
});

test('/persona-create delegates to ctx.createPersona when available', async () => {
  const context = ctx({}, { createPersona: (fields: Record<string, unknown>) => `avatar-${String(fields.name)}` });
  assert.equal(await last(context, '/persona-create name=Alice description=hello'), 'avatar-Alice');
  assert.equal((context as unknown as { user_avatar?: string }).user_avatar, 'avatar-Alice');
});

test('/persona-create returns plan descriptor without provider', async () => {
  const output = JSON.parse(await last(ctx(), '/persona-create name=Alice description=hello select=false'));
  assert.deepEqual(output, { planned: true, action: 'create_persona', fields: { name: 'Alice', description: 'hello', select: 'false' } });
});

test('/persona-create requires name', async () => {
  const result = await exec(ctx(), '/persona-create description=hello');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires name/u);
});

test('/persona-get returns persona JSON by id', async () => {
  const output = JSON.parse(await last(ctx({}, { power_user: { personas: { alice: 'Alice' } } }), '/persona-get id=alice'));
  assert.equal(output.name, 'Alice');
  assert.equal(output.avatar, 'alice');
});

test('/persona-get returns specific field by name', async () => {
  const personas = { alice: { name: 'Alice', description: 'curious' } };
  assert.equal(await last(ctx({}, { power_user: { personas } }), '/persona-get name=Alice field=description'), 'curious');
});

test('/persona-get uses active user_avatar by default', async () => {
  const personas = { alice: 'Alice', bob: 'Bob' };
  assert.equal(await last(ctx({}, { power_user: { personas }, user_avatar: 'bob' }), '/persona-get field=name'), 'Bob');
});

test('/persona-get reports missing persona', async () => {
  const result = await exec(ctx({}, { power_user: { personas: { alice: 'Alice' } } }), '/persona-get id=missing');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /persona not found/u);
});

test('/persona-set selects existing persona by name', async () => {
  const context = ctx({}, { power_user: { personas: { alice: 'Alice' } } });
  assert.equal(await last(context, '/persona-set Alice'), 'Alice');
  assert.equal((context as unknown as { user_avatar?: string }).user_avatar, 'alice');
  assert.equal(context.name1, 'Alice');
});

test('/persona alias selects existing persona by id', async () => {
  const context = ctx({}, { power_user: { personas: { alice: 'Alice' } } });
  assert.equal(await last(context, '/persona alice'), 'Alice');
  assert.equal((context as unknown as { user_avatar?: string }).user_avatar, 'alice');
});

test('/persona-set mode=temp sets temporary name', async () => {
  const context = ctx({}, { power_user: { personas: { alice: 'Alice' } } });
  assert.equal(await last(context, '/persona-set name=Traveler mode=temp'), 'Traveler');
  assert.equal(context.chatMetadata.persona_name, 'Traveler');
  assert.equal((context as unknown as { user_avatar?: string }).user_avatar, undefined);
});

test('/persona-set mode=lookup reports missing persona', async () => {
  const result = await exec(ctx({}, { power_user: { personas: { alice: 'Alice' } } }), '/persona-set name=Missing mode=lookup');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /persona 'Missing' not found/u);
});

test('/persona-lock returns plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/persona-lock type=chat state=on'));
  assert.deepEqual(output, { planned: true, action: 'persona_lock', fields: { type: 'chat', state: 'on' } });
});

test('/lock alias returns persona-lock descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/lock type=default value=off'));
  assert.equal(output.action, 'persona_lock');
  assert.deepEqual(output.fields, { type: 'default', value: 'off' });
});

test('/persona-sync returns plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/persona-sync from=Old quiet=false range=0-10'));
  assert.deepEqual(output, { planned: true, action: 'persona_sync', fields: { from: 'Old', quiet: 'false', range: '0-10' } });
});

test('/sync alias returns persona-sync descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/sync from=Old'));
  assert.equal(output.action, 'persona_sync');
  assert.deepEqual(output.fields, { from: 'Old' });
});
