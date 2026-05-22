import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';

function ctx(): STContextDeep {
  return createSTContextDeep({ eventSource: createEventSource() });
}

async function exec(input: string): Promise<ExecuteSlashCommandsDeepResult> {
  return await ctx().executeSlashCommands!(input) as ExecuteSlashCommandsDeepResult;
}

async function last(input: string): Promise<string> {
  const result = await exec(input);
  return result.outputs.at(-1)?.text ?? '';
}

test('/echo returns content as-is', async () => {
  assert.equal(await last('/echo hello world'), 'hello world');
});

test('/echo empty input returns empty', async () => {
  assert.equal(await last('/echo'), '');
});

test('/echo preserves symbols', async () => {
  assert.equal(await last('/echo a=b & c'), 'a=b & c');
});

test('/upper transforms input to uppercase', async () => {
  assert.equal(await last('/upper hello world'), 'HELLO WORLD');
});

test('/uppercase alias transforms input', async () => {
  assert.equal(await last('/uppercase hi'), 'HI');
});

test('/upper empty returns empty', async () => {
  assert.equal(await last('/upper'), '');
});

test('/lower transforms input to lowercase', async () => {
  assert.equal(await last('/lower HELLO WORLD'), 'hello world');
});

test('/lowercase alias transforms input', async () => {
  assert.equal(await last('/lowercase HI'), 'hi');
});

test('/lower empty returns empty', async () => {
  assert.equal(await last('/lower'), '');
});

test('/trim trims whitespace', async () => {
  assert.equal(await last('/trim   hello world   '), 'hello world');
});

test('/trim empty returns empty', async () => {
  assert.equal(await last('/trim'), '');
});

test('/trim preserves interior whitespace', async () => {
  assert.equal(await last('/trim   hello   world   '), 'hello   world');
});

test('/length returns character length', async () => {
  assert.equal(await last('/length hello'), '5');
});

test('/length counts spaces', async () => {
  assert.equal(await last('/length hello world'), '11');
});

test('/length empty returns zero', async () => {
  assert.equal(await last('/length'), '0');
});

test('/len alias returns length', async () => {
  assert.equal(await last('/len abc'), '3');
});

test('/substring extracts range', async () => {
  assert.equal(await last('/substring 1 4 abcdef'), 'bcd');
});

test('/substring omitted end uses text end', async () => {
  assert.equal(await last('/substring 2 x abcdef'), 'cdef');
});

test('/substring negative start follows JS slice', async () => {
  assert.equal(await last('/substring -3 x abcdef'), 'def');
});

test('/substr alias extracts range', async () => {
  assert.equal(await last('/substr 0 2 abc'), 'ab');
});

test('/replace replaces named old=new token', async () => {
  assert.equal(await last('/replace blue=red blue house blue car'), 'red house red car');
});

test('/replace supports empty replacement', async () => {
  assert.equal(await last('/replace blue=blue house'), 'house');
});

test('/replace missing assignment reports failure', async () => {
  const result = await exec('/replace blue house');
  assert.equal(result.ok, false);
});

test('/re alias replaces text', async () => {
  assert.equal(await last('/re a=b cat'), 'cbt');
});

test('/concat concatenates named values', async () => {
  assert.equal(await last('/concat a=hello b=world'), 'helloworld');
});

test('/concat preserves named arg order', async () => {
  assert.equal(await last('/concat first=1 second=2 third=3'), '123');
});

test('/concat falls back to compact positional input', async () => {
  assert.equal(await last('/concat hello world'), 'helloworld');
});

test('/reverse reverses text', async () => {
  assert.equal(await last('/reverse abc'), 'cba');
});

test('/reverse handles spaces', async () => {
  assert.equal(await last('/reverse ab cd'), 'dc ba');
});

test('/reverse empty returns empty', async () => {
  assert.equal(await last('/reverse'), '');
});

test('/delay waits and returns empty', async () => {
  const started = Date.now();
  assert.equal(await last('/delay 5'), '');
  assert.ok(Date.now() - started >= 0);
});

test('/delay invalid input returns after zero delay', async () => {
  assert.equal(await last('/delay nope'), '');
});

test('/wait alias delays', async () => {
  assert.equal(await last('/wait 1'), '');
});

test('/sleep alias delays', async () => {
  assert.equal(await last('/sleep 1'), '');
});
