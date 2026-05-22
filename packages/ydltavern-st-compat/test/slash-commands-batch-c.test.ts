import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, SlashCommandClosure, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';

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

test('/addvar creates local number from name=value', async () => {
  const context = ctx();
  assert.equal(await last(context, '/addvar score=2'), '2');
  assert.equal(context.variables.local.get('score'), 2);
});

test('/addvar sums numeric values', async () => {
  const context = ctx();
  context.variables.local.set('score', 3);
  assert.equal(await last(context, '/addvar score=4'), '7');
  assert.equal(context.variables.local.get('score'), 7);
});

test('/addvar concatenates nonnumeric values', async () => {
  const context = ctx();
  context.variables.local.set('word', 'hello');
  assert.equal(await last(context, '/addvar word=world'), 'helloworld');
});

test('/addvar supports key=value positional and global scope flag', async () => {
  const context = ctx();
  assert.equal(await last(context, '/addvar key=score 5 global'), '5');
  assert.equal(context.variables.local.has('score'), false);
  assert.equal(context.variables.global.get('score'), 5);
});

test('/addvar invalid missing value reports failure', async () => {
  const result = await exec(ctx(), '/addvar score');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Expected value/u);
});

test('/flushvar clears all local vars but leaves globals', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.local.set('b', 2);
  context.variables.global.set('g', 3);
  assert.equal(await last(context, '/flushvar'), '');
  assert.deepEqual(context.variables.local.list(), {});
  assert.equal(context.variables.global.get('g'), 3);
});

test('/flushvar deletes named local var', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.local.set('b', 2);
  await last(context, '/flushvar a');
  assert.equal(context.variables.local.has('a'), false);
  assert.equal(context.variables.local.get('b'), 2);
});

test('/flushvar calls saveMetadataDebounced', async () => {
  let calls = 0;
  const context = ctx({ saveMetadataDebounced: () => { calls += 1; } });
  context.variables.local.set('a', 1);
  await last(context, '/flushvar');
  assert.equal(calls, 1);
});

test('/flushglobalvar clears all global vars but leaves locals', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.global.set('g', 3);
  await last(context, '/flushglobalvar');
  assert.equal(context.variables.local.get('a'), 1);
  assert.deepEqual(context.variables.global.list(), {});
});

test('/flushglobalvar deletes named global var', async () => {
  const context = ctx();
  context.variables.global.set('a', 1);
  context.variables.global.set('b', 2);
  await last(context, '/flushglobalvar key=a');
  assert.equal(context.variables.global.has('a'), false);
  assert.equal(context.variables.global.get('b'), 2);
});

test('/flushglobalvar calls saveSettingsDebounced', async () => {
  let calls = 0;
  const context = ctx({ saveSettingsDebounced: () => { calls += 1; } });
  context.variables.global.set('g', 1);
  await last(context, '/flushglobalvar');
  assert.equal(calls, 1);
});

test('/listvar defaults to all scopes', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.global.set('g', 'x');
  const output = await last(context, '/listvar');
  assert.match(output, /local\.a: 1/u);
  assert.match(output, /global\.g: x/u);
});

test('/listvar scope=local filters globals', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.global.set('g', 2);
  assert.equal(await last(context, '/listvar scope=local'), 'local.a: 1');
});

test('/listvar positional global scope filters locals', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.global.set('g', 2);
  assert.equal(await last(context, '/listvar global'), 'global.g: 2');
});

test('/listvar invalid scope falls back to all', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  context.variables.global.set('g', 2);
  const output = await last(context, '/listvar scope=bad');
  assert.match(output, /local\.a: 1/u);
  assert.match(output, /global\.g: 2/u);
});

test('/listvar return=json returns structured variables', async () => {
  const context = ctx();
  context.variables.local.set('a', 1);
  assert.deepEqual(JSON.parse(await last(context, '/listvar return=json')), [{ key: 'a', value: 1, scope: 'local' }]);
});

test('/globalsetvar sets global with name=value syntax', async () => {
  const context = ctx();
  assert.equal(await last(context, '/globalsetvar mood=calm'), 'calm');
  assert.equal(context.variables.global.get('mood'), 'calm');
});

test('/setglobalvar alias sets global', async () => {
  const context = ctx();
  await last(context, '/setglobalvar key=mood happy');
  assert.equal(context.variables.global.get('mood'), 'happy');
});

test('/globalsetvar calls saveSettingsDebounced', async () => {
  let calls = 0;
  await last(ctx({ saveSettingsDebounced: () => { calls += 1; } }), '/globalsetvar x=1');
  assert.equal(calls, 1);
});

test('/globalsetvar missing key reports failure', async () => {
  const result = await exec(ctx(), '/globalsetvar');
  assert.equal(result.ok, false);
});

test('/globalgetvar gets global by positional name', async () => {
  const context = ctx();
  context.variables.global.set('mood', 'calm');
  assert.equal(await last(context, '/globalgetvar mood'), 'calm');
});

test('/getglobalvar alias gets global by key argument', async () => {
  const context = ctx();
  context.variables.global.set('mood', 'calm');
  assert.equal(await last(context, '/getglobalvar key=mood'), 'calm');
});

test('/globalgetvar missing variable returns empty', async () => {
  assert.equal(await last(ctx(), '/globalgetvar missing'), '');
});

test('/globalgetvar missing key reports failure', async () => {
  const result = await exec(ctx(), '/globalgetvar');
  assert.equal(result.ok, false);
});

test('/globaladdvar creates and returns global number', async () => {
  const context = ctx();
  assert.equal(await last(context, '/globaladdvar score=2'), '2');
  assert.equal(context.variables.global.get('score'), 2);
});

test('/globaladdvar sums existing global number', async () => {
  const context = ctx();
  context.variables.global.set('score', '3');
  assert.equal(await last(context, '/globaladdvar score=4'), '7');
});

test('/addglobalvar alias concatenates global strings', async () => {
  const context = ctx();
  context.variables.global.set('name', 'Ada');
  assert.equal(await last(context, '/addglobalvar name= Lovelace'), 'Ada Lovelace');
});

test('/globaladdvar missing value reports failure', async () => {
  const result = await exec(ctx(), '/globaladdvar score');
  assert.equal(result.ok, false);
});

test('/globaladdvar calls saveSettingsDebounced', async () => {
  let calls = 0;
  await last(ctx({ saveSettingsDebounced: () => { calls += 1; } }), '/globaladdvar score=1');
  assert.equal(calls, 1);
});

test('/closure-serialize returns closure text input', async () => {
  assert.equal(await last(ctx(), '/closure-serialize {: /echo hi :}'), '{: /echo hi :}');
});

test('/closure-serialize missing closure reports failure', async () => {
  const result = await exec(ctx(), '/closure-serialize');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /closure/u);
});

test('/closure-deserialize returns serialized closure text through registry stringification', async () => {
  assert.equal(await last(ctx(), '/closure-deserialize {: /echo hi :}'), '[object Object]');
});

test('/closure-deserialize creates SlashCommandClosure through command callback', async () => {
  const context = ctx();
  const def = context.slashCommandRegistry.get('closure-deserialize');
  const closure = await def?.callback({}, '{: /echo hi :}');
  assert.ok(closure instanceof SlashCommandClosure);
  assert.equal(closure.rawText, '{: /echo hi :}');
});

test('/closure-deserialize missing string reports failure', async () => {
  const result = await exec(ctx(), '/closure-deserialize');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /empty/u);
});

test('/pass returns positional text', async () => {
  assert.equal(await last(ctx(), '/pass hello world'), 'hello world');
});

test('/pass returns empty input as empty', async () => {
  assert.equal(await last(ctx(), '/pass'), '');
});

test('/noop alias returns text', async () => {
  assert.equal(await last(ctx(), '/noop unchanged'), 'unchanged');
});

test('/return alias returns text', async () => {
  assert.equal(await last(ctx(), '/return value'), 'value');
});

test('/yes returns constant yes', async () => {
  assert.equal(await last(ctx(), '/yes'), 'yes');
});

test('/yes ignores arguments', async () => {
  assert.equal(await last(ctx(), '/yes anything'), 'yes');
});

test('/no returns constant no', async () => {
  assert.equal(await last(ctx(), '/no'), 'no');
});

test('/no ignores arguments', async () => {
  assert.equal(await last(ctx(), '/no anything'), 'no');
});
