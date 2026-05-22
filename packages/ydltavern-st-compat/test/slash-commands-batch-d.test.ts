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

const ada = { name: 'Ada', avatar: 'ada.png', tags: ['friend'], description: 'old' };
const bob = { name: 'Bob', avatar: 'bob.png', tags: ['foe'] };
const cy = { name: 'Cy', avatar: 'cy.png', tags: ['friend'] };

test('/char-find finds by name', async () => {
  const output = JSON.parse(await last(ctx({ characters: [ada, bob] }), '/char-find name=Ada'));
  assert.equal(output.avatar, 'ada.png');
});

test('/char-find returns empty when no match', async () => {
  assert.equal(await last(ctx({ characters: [ada] }), '/char-find name=Missing'), '');
});

test('/char-find respects tag filter', async () => {
  const context = ctx({ characters: [{ ...ada, tags: ['friend'] }, { name: 'Ada', avatar: 'evil.png', tags: ['foe'] }] });
  const output = JSON.parse(await last(context, '/char-find name=Ada tag=foe'));
  assert.equal(output.avatar, 'evil.png');
});

test('/char-find empty list returns empty', async () => {
  assert.equal(await last(ctx({ characters: [] }), '/char-find name=Ada'), '');
});

test('/char-update updates known field in memory', async () => {
  const character = { ...ada };
  const output = JSON.parse(await last(ctx({ characters: [character] }), '/char-update name=Ada description="new desc"'));
  assert.deepEqual(output, { planned: true, action: 'update', name: 'Ada', fields: { description: 'new desc' } });
  assert.equal(character.description, 'new desc');
});

test('/char-update supports explicit char target while updating name', async () => {
  const character = { ...ada };
  await last(ctx({ characters: [character] }), '/char-update char=Ada name=Ada2');
  assert.equal(character.name, 'Ada2');
});

test('/char-update rejects unknown field', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/char-update name=Ada avatar=x.png');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /unsupported character field: avatar/u);
});

test('/char-update not-found character reports failure', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/char-update name=Missing description=x');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /character not found/u);
});

test('/char-update enforces whitelist for creator_notes and tags only', async () => {
  const character: Record<string, unknown> = { ...ada };
  await last(ctx({ characters: [character] }), '/char-update name=Ada creator_notes=note tags=friend,ally');
  assert.equal(character.creator_notes, 'note');
  assert.deepEqual(character.tags, ['friend', 'ally']);
});

test('/char-create returns plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/char-create name=Ada description="new char" tags=friend,ally'));
  assert.deepEqual(output, { planned: true, action: 'create', name: 'Ada', fields: { description: 'new char', tags: ['friend', 'ally'] } });
});

test('/char-create does not modify characters', async () => {
  const characters: unknown[] = [];
  await last(ctx({ characters }), '/char-create name=Ada');
  assert.deepEqual(characters, []);
});

test('/char-create requires name', async () => {
  const result = await exec(ctx(), '/char-create description=x');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires name/u);
});

test('/char-delete throws unsupported error', async () => {
  const result = await exec(ctx(), '/char-delete name=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /unsupported by st-compat/u);
});

test('/char-delete message marks destructive op', async () => {
  const result = await exec(ctx(), '/char-delete');
  assert.match(result.outputs[0]?.error ?? '', /destructive op/u);
});

test('/member-add appends to active group', async () => {
  const group = { id: 'g1', members: ['ada.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-add name=Bob'), 'Bob');
  assert.deepEqual(group.members, ['ada.png', 'bob.png']);
});

test('/member-add errors when no group', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/member-add name=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no active group/u);
});

test('/member-add deduplicates existing member', async () => {
  const group = { id: 'g1', members: ['ada.png'] };
  await last(ctx({ characters: [ada], groups: [group], groupId: 'g1' }), '/member-add name=Ada');
  assert.deepEqual(group.members, ['ada.png']);
});

test('/member-add reports missing character', async () => {
  const group = { id: 'g1', members: [] as unknown[] };
  const result = await exec(ctx({ characters: [ada], groups: [group], groupId: 'g1' }), '/member-add name=Missing');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /character not found/u);
});

test('/member-remove removes when present', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-remove name=Ada'), 'Ada');
  assert.deepEqual(group.members, ['bob.png']);
});

test('/member-remove errors when absent', async () => {
  const group = { id: 'g1', members: ['ada.png'] };
  const result = await exec(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-remove name=Bob');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /group member not found/u);
});

test('/member-remove errors when no group', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/member-remove name=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no active group/u);
});

test('/member-remove accepts numeric index', async () => {
  const group = { id: 'g1', members: ['ada.png', 'bob.png'] };
  assert.equal(await last(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-remove 1'), 'Bob');
  assert.deepEqual(group.members, ['ada.png']);
});

test('/member-disable toggles disabled_members for string entries', async () => {
  const group = { id: 'g1', members: ['ada.png'], disabled_members: [] as string[] };
  assert.equal(await last(ctx({ characters: [ada], groups: [group], groupId: 'g1' }), '/member-disable name=Ada'), 'Ada');
  assert.deepEqual(group.disabled_members, ['ada.png']);
});

test('/member-enable clears disabled_members flag', async () => {
  const group = { id: 'g1', members: ['ada.png'], disabled_members: ['ada.png'] };
  assert.equal(await last(ctx({ characters: [ada], groups: [group], groupId: 'g1' }), '/member-enable name=Ada'), 'Ada');
  assert.deepEqual(group.disabled_members, []);
});

test('/member-disable sets object member disabled flag', async () => {
  const member: Record<string, unknown> = { name: 'Ada', avatar: 'ada.png' };
  const group = { id: 'g1', members: [member] };
  await last(ctx({ characters: [ada], groups: [group], groupId: 'g1' }), '/member-disable name=Ada');
  assert.equal(member.disabled, true);
});

test('/member-enable errors when member not found', async () => {
  const group = { id: 'g1', members: ['ada.png'] };
  const result = await exec(ctx({ characters: [ada, bob], groups: [group], groupId: 'g1' }), '/member-enable name=Bob');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /group member not found/u);
});

test('/member-disable errors when no group', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/member-disable name=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no active group/u);
});

test('/group-create returns plan descriptor', async () => {
  const output = JSON.parse(await last(ctx(), '/group-create name=Party members=Ada,Bob'));
  assert.deepEqual(output, { planned: true, action: 'create_group', name: 'Party', members: ['Ada', 'Bob'] });
});

test('/group-create does not modify groups', async () => {
  const groups: unknown[] = [];
  await last(ctx({ groups }), '/group-create name=Party members=Ada');
  assert.deepEqual(groups, []);
});

test('/group-create requires name', async () => {
  const result = await exec(ctx(), '/group-create members=Ada');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /group name is required/u);
});

test('/trigger emits event with named member', async () => {
  const context = ctx({ characters: [ada, bob], groups: [{ id: 'g1', members: ['ada.png', 'bob.png'] }], groupId: 'g1' });
  const drafted: unknown[] = [];
  context.eventSource.on(context.eventTypes.GROUP_MEMBER_DRAFTED, (...args) => drafted.push(args));
  assert.equal(await last(context, '/trigger name=Bob'), 'Bob');
  assert.deepEqual(drafted[0], ['Bob', { index: 1, key: 'bob.png', characterIndex: 1 }]);
});

test('/trigger without name rotates members', async () => {
  const context = ctx({ characters: [ada, bob], groups: [{ id: 'g1', members: ['ada.png', 'bob.png'] }], groupId: 'g1' });
  assert.equal(await last(context, '/trigger'), 'Ada');
  assert.equal(await last(context, '/trigger'), 'Bob');
});

test('/trigger skips disabled members during rotation', async () => {
  const context = ctx({ characters: [ada, bob], groups: [{ id: 'g1', members: ['ada.png', 'bob.png'], disabled_members: ['ada.png'] }], groupId: 'g1' });
  assert.equal(await last(context, '/trigger'), 'Bob');
});

test('/trigger errors when no group', async () => {
  const result = await exec(ctx({ characters: [ada] }), '/trigger');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /no active group/u);
});

test('/go alias triggers named group member', async () => {
  const context = ctx({ characters: [ada, cy], groups: [{ id: 'g1', members: ['ada.png', 'cy.png'] }], groupId: 'g1' });
  assert.equal(await last(context, '/go name=Cy'), 'Cy');
});
