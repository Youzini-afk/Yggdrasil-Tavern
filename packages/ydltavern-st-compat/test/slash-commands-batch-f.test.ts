import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, EXTENSION_PROMPT_ROLES, EXTENSION_PROMPT_TYPES, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';

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

function json(text: string): Record<string, unknown> {
  return JSON.parse(text) as Record<string, unknown>;
}

function stripFilter(entry: unknown): Record<string, unknown> | undefined {
  if (!entry || typeof entry !== 'object') return undefined;
  const { filter: _filter, ...rest } = entry as Record<string, unknown>;
  return rest;
}

test('/inject creates injection with explicit values', async () => {
  const context = ctx();
  assert.equal(await last(context, '/inject id=note position=chat depth=2 scan=true role=user content=Remember this'), 'note');
  assert.deepEqual(stripFilter(context.extensionPrompts.get('note')), { value: 'Remember this', position: EXTENSION_PROMPT_TYPES.IN_CHAT, depth: 2, scan: true, role: EXTENSION_PROMPT_ROLES.USER });
});

test('/inject rejects empty id', async () => {
  const result = await exec(ctx(), '/inject content=No id');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /id cannot be empty/u);
});

test('/inject applies default position depth scan and role', async () => {
  const context = ctx();
  await last(context, '/inject id=default Hello world');
  assert.deepEqual(stripFilter(context.extensionPrompts.get('default')), { value: 'Hello world', position: EXTENSION_PROMPT_TYPES.IN_PROMPT, depth: 4, scan: false, role: EXTENSION_PROMPT_ROLES.SYSTEM });
});

test('/inject round-trips through getExtensionPrompt render', async () => {
  const context = ctx();
  await last(context, '/inject id=rt content=Round trip');
  assert.equal(await context.getExtensionPrompt(EXTENSION_PROMPT_TYPES.IN_PROMPT, 4), 'Round trip');
});

test('/inject mirrors script_injects metadata and saves', async () => {
  let calls = 0;
  const context = ctx({ saveMetadataDebounced: () => { calls += 1; } });
  await last(context, '/inject id=m position=2 depth=3 role=2 scan=1 content=Mirror');
  assert.deepEqual((context.chatMetadata.script_injects as Record<string, unknown>).m, { value: 'Mirror', position: 2, depth: 3, scan: true, role: 2 });
  assert.equal(calls, 1);
});

test('/listinjects returns empty list text', async () => {
  assert.equal(await last(ctx(), '/listinjects'), 'No injections');
});

test('/listinjects includes multiple ids', async () => {
  const context = ctx();
  await last(context, '/inject id=a content=Alpha');
  await last(context, '/inject id=b content=Beta');
  const output = await last(context, '/listinjects');
  assert.match(output, /a:/u);
  assert.match(output, /b:/u);
});

test('/listinjects format includes position and depth', async () => {
  const context = ctx();
  await last(context, '/inject id=a position=before depth=7 content=Alpha');
  const output = await last(context, '/listinjects');
  assert.match(output, /position=2/u);
  assert.match(output, /depth=7/u);
});

test('/listinjects previews long content', async () => {
  const context = ctx();
  await last(context, `/inject id=long content=${'x'.repeat(80)}`);
  assert.match(await last(context, '/listinjects'), /\.\.\./u);
});

test('/flushinject removes specific injection', async () => {
  const context = ctx();
  await last(context, '/inject id=a content=Alpha');
  await last(context, '/inject id=b content=Beta');
  await last(context, '/flushinject id=a');
  assert.equal(context.extensionPrompts.get('a'), undefined);
  assert.notEqual(context.extensionPrompts.get('b'), undefined);
});

test('/flushinject missing id is no-op', async () => {
  const context = ctx();
  await last(context, '/inject id=a content=Alpha');
  assert.equal(await last(context, '/flushinject'), '');
  assert.notEqual(context.extensionPrompts.get('a'), undefined);
});

test('/flushinject removes mirrored metadata', async () => {
  const context = ctx();
  await last(context, '/inject id=a content=Alpha');
  await last(context, '/flushinject a');
  assert.deepEqual(context.chatMetadata.script_injects, {});
});

test('/flushinject missing target does not fail', async () => {
  const result = await exec(ctx(), '/flushinject id=missing');
  assert.equal(result.ok, true);
});

test('/flushinjects empties all injections', async () => {
  const context = ctx();
  await last(context, '/inject id=a content=Alpha');
  await last(context, '/inject id=b content=Beta');
  await last(context, '/flushinjects');
  assert.equal(context.extensionPrompts.entries().length, 0);
});

test('/flushinjects removes script_injects metadata', async () => {
  const context = ctx();
  await last(context, '/inject id=a content=Alpha');
  await last(context, '/flushinjects');
  assert.equal(context.chatMetadata.script_injects, undefined);
});

test('/flushinjects saves metadata', async () => {
  let calls = 0;
  const context = ctx({ saveMetadataDebounced: () => { calls += 1; } });
  await last(context, '/flushinjects');
  assert.equal(calls, 1);
});

test('/getpromptentry returns plan-only placeholder', async () => {
  const out = json(await last(ctx(), '/getpromptentry id=main'));
  assert.equal(out.planned, true);
  assert.equal(out.action, 'get_prompt_entry');
  assert.equal(out.delegatedTo, 'engine_prompt_manager');
});

test('/getpromptentry returns stored override when present', async () => {
  const context = ctx({ extensionSettings: { ydltavern_prompt_manager_overrides: { main: { enabled: false } } } as Record<string, unknown> });
  assert.deepEqual(json(await last(context, '/getpromptentry id=main')).entry, { enabled: false });
});

test('/getpromptentries alias returns descriptor', async () => {
  assert.equal(json(await last(ctx(), '/getpromptentries identifier=main')).action, 'get_prompt_entry');
});

test('/setpromptentry writes prompt override metadata', async () => {
  const context = ctx();
  const out = json(await last(context, '/setpromptentry id=main enabled=false'));
  assert.equal(out.planned, true);
  assert.deepEqual(context.extensionSettings.ydltavern_prompt_manager_overrides, { main: { enabled: false } });
});

test('/setpromptentry positional toggle writes enabled field', async () => {
  const context = ctx();
  await last(context, '/setpromptentry id=jailbreak off');
  assert.deepEqual(context.extensionSettings.ydltavern_prompt_manager_overrides, { jailbreak: { enabled: false } });
});

test('/setpromptentry saves settings', async () => {
  let calls = 0;
  await last(ctx({ saveSettingsDebounced: () => { calls += 1; } }), '/setpromptentry id=main enabled=true');
  assert.equal(calls, 1);
});

test('/setpromptentry missing id fails', async () => {
  const result = await exec(ctx(), '/setpromptentry enabled=true');
  assert.equal(result.ok, false);
});

test('/worldenable writes enabled world metadata', async () => {
  const context = ctx();
  const out = json(await last(context, '/worldenable name=Lore'));
  assert.equal(out.planned, true);
  assert.deepEqual(context.chatMetadata.ydltavern_world_info, { enabled_books: { Lore: true } });
});

test('/worlddisable writes disabled world metadata', async () => {
  const context = ctx();
  await last(context, '/worlddisable name=Lore');
  assert.deepEqual(context.chatMetadata.ydltavern_world_info, { enabled_books: { Lore: false } });
});

test('/worldenable and /worlddisable maintain compatibility alias', async () => {
  const context = ctx();
  await last(context, '/worldenable Lore');
  await last(context, '/worlddisable Other');
  assert.deepEqual(context.chatMetadata.world_info_enabled, { Lore: true, Other: false });
});

test('/worldenable missing name fails', async () => {
  assert.equal((await exec(ctx(), '/worldenable')).ok, false);
});

test('/world-add returns add world entry descriptor', async () => {
  const out = json(await last(ctx(), '/world-add book=Lore key=dragon content=A dragon entry'));
  assert.equal(out.planned, true);
  assert.equal(out.action, 'add_world_entry');
  assert.equal(out.book, 'Lore');
  assert.equal(out.key, 'dragon');
  assert.equal(out.content, 'A dragon entry');
});

test('/world-add accepts positional content', async () => {
  const out = json(await last(ctx(), '/world-add book=Lore key=castle Castle content here'));
  assert.equal(out.content, 'Castle content here');
});

test('/world-add includes extra fields', async () => {
  const out = json(await last(ctx(), '/world-add book=Lore key=dragon depth=2 role=1 content=Entry'));
  assert.deepEqual(out.fields, { book: 'Lore', key: 'dragon', depth: 2, role: 1 });
});
