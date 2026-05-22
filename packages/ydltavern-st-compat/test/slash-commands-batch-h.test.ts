import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { registerBatchH } from '../src/slash-commands-batch-h.js';

function ctx(overrides: Partial<STContextDeep> = {}): STContextDeep {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
  registerBatchH(context.slashCommandRegistry, { ctx: context });
  return context;
}

async function exec(context: STContextDeep, input: string): Promise<ExecuteSlashCommandsDeepResult> {
  return await context.executeSlashCommands!(input) as ExecuteSlashCommandsDeepResult;
}

async function last(context: STContextDeep, input: string): Promise<string> {
  const result = await exec(context, input);
  return result.outputs.at(-1)?.text ?? '';
}

test('/incvar increments numeric local variable', async () => {
  const context = ctx();
  context.variables.local.set('counter', 5);
  assert.equal(await last(context, '/incvar counter'), '6');
  assert.equal(context.variables.local.get('counter'), 6);
});

test('/incvar creates missing local variable from zero', async () => {
  const context = ctx();
  assert.equal(await last(context, '/incvar counter'), '1');
  assert.equal(context.variables.local.get('counter'), 1);
});

test('/incchatvar alias increments local variable', async () => {
  const context = ctx();
  context.variables.local.set('counter', '2');
  assert.equal(await last(context, '/incchatvar counter'), '3');
});

test('/incvar missing name reports failure', async () => {
  const result = await exec(ctx(), '/incvar');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /variable name/u);
});

test('/decvar decrements numeric local variable', async () => {
  const context = ctx();
  context.variables.local.set('counter', 5);
  assert.equal(await last(context, '/decvar counter'), '4');
  assert.equal(context.variables.local.get('counter'), 4);
});

test('/decvar creates missing local variable as negative one', async () => {
  const context = ctx();
  assert.equal(await last(context, '/decvar counter'), '-1');
  assert.equal(context.variables.local.get('counter'), -1);
});

test('/decchatvar alias decrements local variable', async () => {
  const context = ctx();
  context.variables.local.set('counter', '2');
  assert.equal(await last(context, '/decchatvar counter'), '1');
});

test('/decvar missing name reports failure', async () => {
  const result = await exec(ctx(), '/decvar');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /variable name/u);
});

test('/incglobalvar increments numeric global variable', async () => {
  const context = ctx();
  context.variables.global.set('score', 10);
  assert.equal(await last(context, '/incglobalvar score'), '11');
  assert.equal(context.variables.global.get('score'), 11);
});

test('/incglobalvar creates missing global variable', async () => {
  const context = ctx();
  assert.equal(await last(context, '/incglobalvar score'), '1');
  assert.equal(context.variables.global.get('score'), 1);
});

test('/incglobalvar calls saveSettingsDebounced', async () => {
  let calls = 0;
  await last(ctx({ saveSettingsDebounced: () => { calls += 1; } }), '/incglobalvar score');
  assert.equal(calls, 1);
});

test('/incglobalvar missing name reports failure', async () => {
  const result = await exec(ctx(), '/incglobalvar');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /variable name/u);
});

test('/decglobalvar decrements numeric global variable', async () => {
  const context = ctx();
  context.variables.global.set('score', 10);
  assert.equal(await last(context, '/decglobalvar score'), '9');
  assert.equal(context.variables.global.get('score'), 9);
});

test('/decglobalvar creates missing global variable', async () => {
  const context = ctx();
  assert.equal(await last(context, '/decglobalvar score'), '-1');
  assert.equal(context.variables.global.get('score'), -1);
});

test('/decglobalvar calls saveSettingsDebounced', async () => {
  let calls = 0;
  await last(ctx({ saveSettingsDebounced: () => { calls += 1; } }), '/decglobalvar score');
  assert.equal(calls, 1);
});

test('/decglobalvar missing name reports failure', async () => {
  const result = await exec(ctx(), '/decglobalvar');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /variable name/u);
});

test('/times executes command repeatedly and returns last result', async () => {
  assert.equal(await last(ctx(), '/times 3 /echo {{timesIndex}}'), '2');
});

test('/times with zero iterations returns empty', async () => {
  assert.equal(await last(ctx(), '/times 0 /echo nope'), '');
});

test('/times with negative iterations returns empty', async () => {
  assert.equal(await last(ctx(), '/times -2 /echo nope'), '');
});

test('/times missing command reports failure', async () => {
  const result = await exec(ctx(), '/times 2');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /command|closure/u);
});

test('/add sums multiple positional numbers', async () => {
  assert.equal(await last(ctx(), '/add 1 2 3'), '6');
});

test('/add returns zero for empty input', async () => {
  assert.equal(await last(ctx(), '/add'), '0');
});

test('/add resolves local and global variables', async () => {
  const context = ctx();
  context.variables.local.set('a', 2);
  context.variables.global.set('b', 3);
  assert.equal(await last(context, '/add a b 4'), '9');
});

test('/sub subtracts multiple positional numbers', async () => {
  assert.equal(await last(ctx(), '/sub 10 2 3'), '5');
});

test('/sub returns zero for empty input', async () => {
  assert.equal(await last(ctx(), '/sub'), '0');
});

test('/sub ignores nonnumeric values', async () => {
  assert.equal(await last(ctx(), '/sub 10 nope 4'), '6');
});

test('/mul multiplies multiple positional numbers', async () => {
  assert.equal(await last(ctx(), '/mul 2 3 4'), '24');
});

test('/mul returns zero for empty input', async () => {
  assert.equal(await last(ctx(), '/mul'), '0');
});

test('/mul supports JSON list input', async () => {
  assert.equal(await last(ctx(), '/mul [2,3,4]'), '24');
});

test('/div divides two numbers', async () => {
  assert.equal(await last(ctx(), '/div 10 2'), '5');
});

test('/div by zero returns zero', async () => {
  assert.equal(await last(ctx(), '/div 10 0'), '0');
});

test('/div empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/div'), '0');
});

test('/mod calculates modulo', async () => {
  assert.equal(await last(ctx(), '/mod 10 3'), '1');
});

test('/mod by zero returns zero', async () => {
  assert.equal(await last(ctx(), '/mod 10 0'), '0');
});

test('/mod empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/mod'), '0');
});

test('/pow raises base to exponent', async () => {
  assert.equal(await last(ctx(), '/pow 2 3'), '8');
});

test('/pow missing exponent uses zero', async () => {
  assert.equal(await last(ctx(), '/pow 2'), '1');
});

test('/pow empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/pow'), '0');
});

test('/max returns maximum number', async () => {
  assert.equal(await last(ctx(), '/max 2 9 4'), '9');
});

test('/max supports negative numbers', async () => {
  assert.equal(await last(ctx(), '/max -5 -2 -9'), '-2');
});

test('/max empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/max'), '0');
});

test('/min returns minimum number', async () => {
  assert.equal(await last(ctx(), '/min 2 9 4'), '2');
});

test('/min supports negative numbers', async () => {
  assert.equal(await last(ctx(), '/min -5 -2 -9'), '-9');
});

test('/min empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/min'), '0');
});

test('/abs returns absolute value', async () => {
  assert.equal(await last(ctx(), '/abs -7'), '7');
});

test('/abs empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/abs'), '0');
});

test('/abs resolves variable value', async () => {
  const context = ctx();
  context.variables.local.set('n', -3);
  assert.equal(await last(context, '/abs n'), '3');
});

test('/sqrt returns square root', async () => {
  assert.equal(await last(ctx(), '/sqrt 16'), '4');
});

test('/sqrt negative input returns zero for NaN', async () => {
  assert.equal(await last(ctx(), '/sqrt -1'), '0');
});

test('/sqrt empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/sqrt'), '0');
});

test('/round rounds fractional number', async () => {
  assert.equal(await last(ctx(), '/round 2.6'), '3');
});

test('/round rounds negative fractional number', async () => {
  assert.equal(await last(ctx(), '/round -2.4'), '-2');
});

test('/round empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/round'), '0');
});

test('/sin returns sine value', async () => {
  assert.equal(await last(ctx(), '/sin 0'), '0');
});

test('/sin empty input returns zero', async () => {
  assert.equal(await last(ctx(), '/sin'), '0');
});

test('/sin resolves variable value', async () => {
  const context = ctx();
  context.variables.local.set('angle', 0);
  assert.equal(await last(context, '/sin angle'), '0');
});

test('/cos returns cosine value', async () => {
  assert.equal(await last(ctx(), '/cos 0'), '1');
});

test('/cos empty input returns one', async () => {
  assert.equal(await last(ctx(), '/cos'), '1');
});

test('/cos resolves variable value', async () => {
  const context = ctx();
  context.variables.local.set('angle', 0);
  assert.equal(await last(context, '/cos angle'), '1');
});

test('/log returns natural logarithm', async () => {
  assert.equal(await last(ctx(), '/log 1'), '0');
});

test('/log zero returns negative infinity string', async () => {
  assert.equal(await last(ctx(), '/log 0'), '-Infinity');
});

test('/log negative input returns zero for NaN', async () => {
  assert.equal(await last(ctx(), '/log -1'), '0');
});

test('/sort sorts JSON list values', async () => {
  assert.equal(await last(ctx(), '/sort [5,3,4,1,2]'), '[1,2,3,4,5]');
});

test('/sort sorts dictionary keys by default', async () => {
  assert.equal(await last(ctx(), '/sort {"b":2,"a":1}'), '["a","b"]');
});

test('/sort keysort=false sorts dictionary keys by value', async () => {
  assert.equal(await last(ctx(), '/sort keysort=false {"a":3,"b":1,"c":2}'), '["b","c","a"]');
});

test('/sort invalid JSON returns original input', async () => {
  assert.equal(await last(ctx(), '/sort c,b,a'), 'c,b,a');
});

test('/rand default returns value in zero-one range', async () => {
  const value = Number(await last(ctx(), '/rand'));
  assert.ok(value >= 0 && value < 1);
});

test('/rand positional to value returns range from zero', async () => {
  const value = Number(await last(ctx(), '/rand 10'));
  assert.ok(value >= 0 && value < 10);
});

test('/rand from/to with floor returns integer range', async () => {
  const value = Number(await last(ctx(), '/rand from=5 to=10 round=floor'));
  assert.ok(Number.isInteger(value));
  assert.ok(value >= 5 && value < 10);
});

test('/rand invalid range reports failure', async () => {
  const result = await exec(ctx(), '/rand from=nope to=10');
  assert.equal(result.ok, false);
});

test('/trimtokens under limit returns original text', async () => {
  assert.equal(await last(ctx({ getTokenCountAsync: () => 2 }), '/trimtokens limit=5 hello world'), 'hello world');
});

test('/trimtokens limit zero returns empty', async () => {
  assert.equal(await last(ctx(), '/trimtokens limit=0 hello world'), '');
});

test('/trimtokens direction=end keeps start approximately', async () => {
  assert.equal(await last(ctx({ getTokenCountAsync: () => 10 }), '/trimtokens limit=2 abcdefghij'), 'abcdef');
});

test('/trimtokens direction=start keeps end approximately', async () => {
  assert.equal(await last(ctx({ getTokenCountAsync: () => 10 }), '/trimtokens limit=2 direction=start abcdefghij'), 'efghij');
});

test('/trimstart trims to start of first full sentence', async () => {
  assert.equal(await last(ctx(), '/trimstart First sentence. Second sentence.'), 'Second sentence.');
});

test('/trimstart without sentence punctuation returns original', async () => {
  assert.equal(await last(ctx(), '/trimstart no punctuation'), 'no punctuation');
});

test('/trimstart empty input returns empty', async () => {
  assert.equal(await last(ctx(), '/trimstart'), '');
});

test('/trimend trims to end of last full sentence', async () => {
  assert.equal(await last(ctx(), '/trimend First sentence. Second fragment'), 'First sentence.');
});

test('/trimend without sentence punctuation trims trailing whitespace', async () => {
  assert.equal(await last(ctx(), '/trimend no punctuation   '), 'no punctuation');
});

test('/trimend empty input returns empty', async () => {
  assert.equal(await last(ctx(), '/trimend'), '');
});

test('/tokens returns host token count', async () => {
  assert.equal(await last(ctx({ getTokenCountAsync: () => 7 }), '/tokens hello world'), '7');
});

test('/tokens default estimator counts short text', async () => {
  assert.equal(await last(ctx(), '/tokens abcde'), '2');
});

test('/tokens empty input returns zero', async () => {
  assert.equal(await last(ctx({ getTokenCountAsync: () => 0 }), '/tokens'), '0');
});
