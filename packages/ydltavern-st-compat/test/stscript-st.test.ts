import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PARSER_FLAG,
  ParserFlags,
  ARGUMENT_TYPE,
  SlashCommandParserError,
  SlashCommandExecutionError,
  SlashCommandAbortError,
  SlashCommandScope,
  AbortController_,
  BreakController,
  SlashCommandClosure,
  lintPipeValue,
  shouldInjectPipe,
  consumePipeSeparator,
  resetPipeState,
  compareValues,
  GlobalVariables,
  SlashCommandRegistry,
} from '../src/index.js';

test('ParserFlags toggles STRICT_ESCAPING and REPLACE_GETVAR', () => {
  const flags = new ParserFlags();
  assert.equal(flags.isOn(PARSER_FLAG.STRICT_ESCAPING), false);
  flags.set(PARSER_FLAG.STRICT_ESCAPING, true);
  assert.equal(flags.isOn(PARSER_FLAG.STRICT_ESCAPING), true);
  flags.toggle(PARSER_FLAG.STRICT_ESCAPING);
  assert.equal(flags.isOn(PARSER_FLAG.STRICT_ESCAPING), false);
});

test('ParserFlags clone is independent', () => {
  const a = new ParserFlags();
  a.set(PARSER_FLAG.STRICT_ESCAPING, true);
  const b = a.clone();
  a.set(PARSER_FLAG.STRICT_ESCAPING, false);
  assert.equal(a.isOn(PARSER_FLAG.STRICT_ESCAPING), false);
  assert.equal(b.isOn(PARSER_FLAG.STRICT_ESCAPING), true);
});

test('ARGUMENT_TYPE has ST canonical types', () => {
  assert.equal(ARGUMENT_TYPE.STRING, 'string');
  assert.equal(ARGUMENT_TYPE.CLOSURE, 'closure');
  assert.equal(ARGUMENT_TYPE.LIST, 'list');
});

test('SlashCommandParserError preserves location info', () => {
  const e = new SlashCommandParserError('bad', { index: 10, line: 2, column: 3 });
  assert.equal(e.name, 'SlashCommandParserError');
  assert.equal(e.index, 10);
});

test('SlashCommandExecutionError records command and cause', () => {
  const inner = new Error('boom');
  const e = new SlashCommandExecutionError('failed', { command: 'gen', cause: inner });
  assert.equal(e.command, 'gen');
  assert.equal(e.cause, inner);
});

test('SlashCommandScope letVariable creates in current scope and rejects duplicates', () => {
  const s = new SlashCommandScope();
  s.letVariable('x', 1);
  assert.equal(s.getVariable('x'), 1);
  assert.throws(() => s.letVariable('x', 2), SlashCommandExecutionError);
});

test('SlashCommandScope getVariable walks parent chain', () => {
  const parent = new SlashCommandScope();
  parent.letVariable('a', 'parent');
  const child = new SlashCommandScope(parent);
  child.letVariable('b', 'child');
  assert.equal(child.getVariable('a'), 'parent');
  assert.equal(child.getVariable('b'), 'child');
  assert.equal(parent.getVariable('b'), '');
});

test('SlashCommandScope getVariable coerces numeric strings to Number', () => {
  const s = new SlashCommandScope();
  s.letVariable('n', '42');
  s.letVariable('f', '3.14');
  s.letVariable('s', 'hello');
  assert.equal(s.getVariable('n'), 42);
  assert.equal(s.getVariable('f'), 3.14);
  assert.equal(s.getVariable('s'), 'hello');
});

test('SlashCommandScope getVariable returns empty string for missing key', () => {
  const s = new SlashCommandScope();
  assert.equal(s.getVariable('nope'), '');
});

test('SlashCommandScope setVariable mutates nearest owning scope', () => {
  const parent = new SlashCommandScope();
  parent.letVariable('a', 1);
  const child = new SlashCommandScope(parent);
  child.setVariable('a', 2);
  assert.equal(parent.getVariable('a'), 2);
});

test('SlashCommandScope setVariable throws when variable not declared anywhere', () => {
  const s = new SlashCommandScope();
  assert.throws(() => s.setVariable('missing', 1), SlashCommandExecutionError);
});

test('SlashCommandScope index option JSON.parse and slot lookup', () => {
  const s = new SlashCommandScope();
  s.letVariable('list', JSON.stringify([10, 20, 30]));
  assert.equal(s.getVariable('list', { index: 1 }), 20);
  s.letVariable('obj', JSON.stringify({ x: 1, y: 2 }));
  assert.equal(s.getVariable('obj', { index: 'y' }), 2);
});

test('SlashCommandScope setVariable with index updates JSON slot', () => {
  const s = new SlashCommandScope();
  s.letVariable('list', JSON.stringify([1, 2, 3]));
  s.setVariable('list', 99, { index: 0 });
  assert.deepEqual(JSON.parse(s.variables.get('list') as string), [99, 2, 3]);
});

test('SlashCommandScope setVariable as=number coerces indexed value', () => {
  const s = new SlashCommandScope();
  s.letVariable('list', JSON.stringify([1, 2, 3]));
  s.setVariable('list', '42', { index: 1, as: 'number' });
  assert.deepEqual(JSON.parse(s.variables.get('list') as string), [1, 42, 3]);
});

test('SlashCommandScope hasVariable walks parents', () => {
  const parent = new SlashCommandScope();
  parent.letVariable('p', 1);
  const child = new SlashCommandScope(parent);
  assert.equal(child.hasVariable('p'), true);
  assert.equal(child.hasVariable('missing'), false);
});

test('SlashCommandScope deleteVariable removes from owning scope', () => {
  const s = new SlashCommandScope();
  s.letVariable('x', 1);
  s.deleteVariable('x');
  assert.equal(s.hasVariable('x'), false);
});

test('SlashCommandScope pipe falls back to parent when not set locally', () => {
  const parent = new SlashCommandScope();
  parent.pipe = 'parent-pipe';
  const child = new SlashCommandScope(parent);
  assert.equal(child.pipe, 'parent-pipe');
  child.pipe = 'child-pipe';
  assert.equal(child.pipe, 'child-pipe');
  assert.equal(parent.pipe, 'parent-pipe');
});

test('SlashCommandScope.child creates new scope linked to current', () => {
  const root = new SlashCommandScope();
  root.letVariable('a', 1);
  const child = root.child();
  assert.equal(child.parent, root);
  assert.equal(child.getVariable('a'), 1);
});

test('AbortController_ records aborted and reason', () => {
  const c = new AbortController_();
  assert.equal(c.aborted, false);
  c.abort('user cancel', true);
  assert.equal(c.aborted, true);
  assert.equal(c.reason, 'user cancel');
  assert.equal(c.quiet, true);
});

test('BreakController carries break value and resets', () => {
  const b = new BreakController();
  b.break('done');
  assert.equal(b.broken, true);
  assert.equal(b.value, 'done');
  b.reset();
  assert.equal(b.broken, false);
});

test('SlashCommandClosure.executeDirect runs steps and produces pipe', async () => {
  const scope = new SlashCommandScope();
  const closure = new SlashCommandClosure(scope);
  closure.executorList.push({
    run(c) { c.scope.pipe = 'first'; },
  });
  closure.executorList.push({
    run(c) { c.scope.pipe = String(c.scope.pipe) + ':second'; },
  });
  const result = await closure.executeDirect();
  assert.equal(result.pipe, 'first:second');
  assert.equal(result.isBreak, false);
  assert.equal(result.isAborted, false);
});

test('SlashCommandClosure handles break controller mid-execution', async () => {
  const closure = new SlashCommandClosure(new SlashCommandScope());
  let secondRan = false;
  closure.executorList.push({
    run(c) { c.breakController.break('break-value'); },
  });
  closure.executorList.push({
    run() { secondRan = true; },
  });
  const result = await closure.executeDirect();
  assert.equal(result.isBreak, true);
  assert.equal(result.pipe, 'break-value');
  assert.equal(secondRan, false);
});

test('SlashCommandClosure handles abort controller', async () => {
  const closure = new SlashCommandClosure(new SlashCommandScope());
  closure.abortController.abort('test', true);
  closure.executorList.push({ run() { throw new Error('should not run'); } });
  const result = await closure.executeDirect();
  assert.equal(result.isAborted, true);
  assert.equal(result.isQuietlyAborted, true);
  assert.equal(result.abortReason, 'test');
});

test('SlashCommandClosure.executeDirect normalizes empty pipe to empty string', async () => {
  const closure = new SlashCommandClosure(new SlashCommandScope());
  const result = await closure.executeDirect();
  assert.equal(result.pipe, '');
});

test('SlashCommandClosure binds named args via letVariable', async () => {
  const closure = new SlashCommandClosure(new SlashCommandScope());
  closure.argumentList.push({ name: 'x', defaultValue: 'default' });
  closure.providedArgumentList.push({ name: 'x', value: 'override' });
  closure.executorList.push({
    run(c) { c.scope.pipe = c.scope.getVariable('x'); },
  });
  const result = await closure.executeDirect();
  assert.equal(result.pipe, 'override');
});

test('SlashCommandClosure.getCopy preserves config but uses child scope', () => {
  const parent = new SlashCommandScope();
  parent.letVariable('a', 1);
  const closure = new SlashCommandClosure(parent);
  closure.argumentList.push({ name: 'x' });
  closure.executeNow = true;
  closure.rawText = 'raw';
  const copy = closure.getCopy();
  assert.equal(copy.executeNow, true);
  assert.equal(copy.rawText, 'raw');
  assert.deepEqual(copy.argumentList, closure.argumentList);
  assert.equal(copy.scope.parent, parent);
});

test('lintPipeValue normalizes types per ST rules', () => {
  assert.equal(lintPipeValue(null), '');
  assert.equal(lintPipeValue(undefined), '');
  assert.equal(lintPipeValue('hello'), 'hello');
  assert.equal(lintPipeValue(42), 42);
  assert.equal(lintPipeValue(true), true);
  assert.equal(lintPipeValue([1, 2, 3]), '[1,2,3]');
  assert.equal(lintPipeValue({ a: 1 }), '{"a":1}');
  // Closure passthrough
  const closure = new SlashCommandClosure(new SlashCommandScope());
  assert.equal(lintPipeValue(closure), closure);
});

test('shouldInjectPipe respects state and unnamed-arg presence', () => {
  const state = { injectPipe: true };
  assert.equal(shouldInjectPipe(state, false), true);
  assert.equal(shouldInjectPipe(state, true), false);
  state.injectPipe = false;
  assert.equal(shouldInjectPipe(state, false), false);
});

test('consumePipeSeparator handles single vs double pipe', () => {
  const state = { injectPipe: true };
  consumePipeSeparator(state, false);
  assert.equal(state.injectPipe, true);
  consumePipeSeparator(state, true);
  assert.equal(state.injectPipe, false);
  resetPipeState(state);
  assert.equal(state.injectPipe, true);
});

test('compareValues eq/neq handle string and number coercion', () => {
  assert.equal(compareValues('1', 1, 'eq'), true);
  assert.equal(compareValues('hello', 'hello', 'eq'), true);
  assert.equal(compareValues('a', 'b', 'neq'), true);
  assert.equal(compareValues(1, 2, 'neq'), true);
});

test('compareValues gt/gte/lt/lte numeric', () => {
  assert.equal(compareValues(5, 3, 'gt'), true);
  assert.equal(compareValues(3, 5, 'gt'), false);
  assert.equal(compareValues(5, 5, 'gte'), true);
  assert.equal(compareValues(3, 5, 'lt'), true);
  assert.equal(compareValues(5, 5, 'lte'), true);
});

test('compareValues in/nin substring', () => {
  assert.equal(compareValues('hello world', 'world', 'in'), true);
  assert.equal(compareValues('hello world', 'xyz', 'in'), false);
  assert.equal(compareValues('hello world', 'xyz', 'nin'), true);
});

test('compareValues not coerces truthiness', () => {
  assert.equal(compareValues('false', undefined, 'not'), true);
  assert.equal(compareValues('true', undefined, 'not'), false);
  assert.equal(compareValues('hello', undefined, 'not'), false);
  assert.equal(compareValues('', undefined, 'not'), true);
});

test('GlobalVariables get/set/has/delete', () => {
  const g = new GlobalVariables();
  g.set('x', 'y');
  assert.equal(g.get('x'), 'y');
  assert.equal(g.has('x'), true);
  g.delete('x');
  assert.equal(g.has('x'), false);
});

test('GlobalVariables add/inc/dec', () => {
  const g = new GlobalVariables();
  g.set('count', 0);
  g.inc('count');
  g.inc('count');
  g.dec('count');
  assert.equal(g.get('count'), 1);
  g.add('count', 10);
  assert.equal(g.get('count'), 11);
});

test('SlashCommandRegistry register, lookup, alias resolution', () => {
  const reg = new SlashCommandRegistry();
  reg.register({
    name: 'gen',
    callback: () => 'ok',
    aliases: ['generate', 'g'],
  });
  assert.ok(reg.has('gen'));
  assert.ok(reg.has('generate'));
  assert.ok(reg.has('g'));
  assert.equal(reg.resolveAlias('g'), 'gen');
  assert.equal(reg.get('generate')?.name, 'gen');
});

test('SlashCommandRegistry rejects duplicate registration', () => {
  const reg = new SlashCommandRegistry();
  reg.register({ name: 'echo', callback: () => '' });
  assert.throws(() => reg.register({ name: 'echo', callback: () => '' }));
});

test('SlashCommandRegistry list returns canonical commands', () => {
  const reg = new SlashCommandRegistry();
  reg.register({ name: 'a', callback: () => '' });
  reg.register({ name: 'b', callback: () => '', aliases: ['bb'] });
  assert.equal(reg.list().length, 2);
});

test('SlashCommandAbortError quiet flag', () => {
  const e = new SlashCommandAbortError('cancel', true);
  assert.equal(e.quiet, true);
});
