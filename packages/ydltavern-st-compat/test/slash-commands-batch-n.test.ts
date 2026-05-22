import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { registerBatchN } from '../src/slash-commands-batch-n.js';

function ctx(overrides: Partial<STContextDeep> = {}): STContextDeep {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
  registerBatchN(context.slashCommandRegistry, { ctx: context });
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

test('/? returns a sorted command list', async () => {
  const output = await last(ctx(), '/?');
  const lines = output.split('\n');
  assert.ok(lines.includes('/? — List registered slash commands. Pass name= for specific help.'));
  assert.deepEqual(lines, [...lines].sort());
});

test('/? returns help for a specific command by name', async () => {
  assert.equal(
    await last(ctx(), '/? name=parser-flag'),
    '/parser-flag — Get or set a parser flag (STRICT_ESCAPING, REPLACE_GETVAR, etc).',
  );
});

test('/? returns help for a specific command by unnamed value', async () => {
  assert.match(await last(ctx(), '/? secret-id'), /^\/secret-id \(aliases: secret-rotate\) — Plan-only/u);
});

test('/? resolves aliases in specific command help', async () => {
  assert.match(await last(ctx(), '/? name=help'), /^\/\? \(aliases: help\) — List registered/u);
});

test('/help alias returns command list', async () => {
  const output = await last(ctx(), '/help');
  assert.match(output, /\/parser-flag —/u);
  assert.match(output, /\/secret-write —/u);
});

test('/? reports missing command by name', async () => {
  assert.equal(await last(ctx(), '/? name=no-such-command'), 'No command found: no-such-command');
});

test('/parser-flag defaults missing flags to false', async () => {
  assert.equal(await last(ctx(), '/parser-flag flag=STRICT_ESCAPING'), 'false');
});

test('/parser-flag sets a flag using named value=true', async () => {
  const context = ctx();
  assert.equal(await last(context, '/parser-flag flag=STRICT_ESCAPING value=true'), 'true');
  assert.deepEqual(context.chatMetadata.parser_flags, { STRICT_ESCAPING: true });
});

test('/parser-flag reads a previously set flag', async () => {
  const context = ctx();
  await last(context, '/parser-flag flag=REPLACE_GETVAR value=true');
  assert.equal(await last(context, '/parser-flag flag=REPLACE_GETVAR'), 'true');
});

test('/parser-flag sets a flag false with value=false', async () => {
  const context = ctx({ chatMetadata: { parser_flags: { STRICT_ESCAPING: true } } });
  assert.equal(await last(context, '/parser-flag flag=STRICT_ESCAPING value=false'), 'false');
  assert.deepEqual(context.chatMetadata.parser_flags, { STRICT_ESCAPING: false });
});

test('/parser-flag accepts positional flag and value', async () => {
  const context = ctx();
  assert.equal(await last(context, '/parser-flag STRICT_ESCAPING on'), 'true');
  assert.equal(await last(context, '/parser-flag STRICT_ESCAPING'), 'true');
});

test('/parser-flag missing flag reports failure', async () => {
  const result = await exec(ctx(), '/parser-flag');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires flag=NAME/u);
});

test('/breakpoint returns empty output', async () => {
  assert.equal(await last(ctx(), '/breakpoint'), '');
});

test('/breakpoint does not throw through registry execution', async () => {
  const result = await exec(ctx(), '/breakpoint');
  assert.equal(result.ok, true);
  assert.equal(result.outputs[0]?.text, '');
});

test('/breakpoint direct callback does not throw', async () => {
  const def = ctx().slashCommandRegistry.get('breakpoint');
  assert.ok(def);
  assert.equal(await def.callback({}, ''), '');
});

test('/secret-id returns rotate descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-id name=openai')), {
    planned: true,
    action: 'secret.rotate',
    fields: { name: 'openai' },
  });
});

test('/secret-rotate alias returns rotate descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-rotate name=anthropic')), {
    planned: true,
    action: 'secret.rotate',
    fields: { name: 'anthropic' },
  });
});

test('/secret-id empty descriptor has no fields', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-id openai')), {
    planned: true,
    action: 'secret.rotate',
    fields: {},
  });
});

test('/secret-delete returns delete descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-delete name=openai')), {
    planned: true,
    action: 'secret.delete',
    fields: { name: 'openai' },
  });
});

test('/secret-delete empty descriptor has no fields', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-delete openai')), {
    planned: true,
    action: 'secret.delete',
    fields: {},
  });
});

test('/secret-write accepts secret_ref values', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-write name=openai ref=secret_ref:env:OPENAI_API_KEY')), {
    planned: true,
    action: 'secret.write',
    fields: { name: 'openai', ref: 'secret_ref:env:OPENAI_API_KEY' },
  });
});

test('/secret-write accepts value alias for secret_ref', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-write name=openai value=secret_ref:env:OPENAI_API_KEY')), {
    planned: true,
    action: 'secret.write',
    fields: { name: 'openai', ref: 'secret_ref:env:OPENAI_API_KEY' },
  });
});

test('/secret-write rejects raw values', async () => {
  const result = await exec(ctx(), '/secret-write name=openai ref=sk-raw-secret');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /raw values are rejected/u);
});

test('/secret-write requires a secret name', async () => {
  const result = await exec(ctx(), '/secret-write ref=secret_ref:env:OPENAI_API_KEY');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires name/u);
});

test('/secret-write requires a ref value', async () => {
  const result = await exec(ctx(), '/secret-write name=openai');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires ref=secret_ref/u);
});

test('/secret-rename returns rename descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-rename old=openai new=openrouter')), {
    planned: true,
    action: 'secret.rename',
    fields: { old: 'openai', new: 'openrouter' },
  });
});

test('/secret-rename partial descriptor includes provided fields only', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-rename old=openai')), {
    planned: true,
    action: 'secret.rename',
    fields: { old: 'openai' },
  });
});

test('/secret-read returns read descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-read name=openai')), {
    planned: true,
    action: 'secret.read',
    fields: { name: 'openai' },
  });
});

test('/secret-find alias returns read descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-find name=openai')), {
    planned: true,
    action: 'secret.read',
    fields: { name: 'openai' },
  });
});

test('/secret-get alias returns read descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/secret-get name=openai')), {
    planned: true,
    action: 'secret.read',
    fields: { name: 'openai' },
  });
});
