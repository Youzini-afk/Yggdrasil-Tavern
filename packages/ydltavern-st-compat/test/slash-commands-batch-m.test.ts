import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { SlashCommandUnsupportedError } from '../src/slash-commands-common.js';
import { registerBatchM } from '../src/slash-commands-batch-m.js';

type ExtraContext = Partial<STContextDeep> & Record<string, unknown>;

function ctx(overrides: Partial<STContextDeep> = {}, extras: ExtraContext = {}): STContextDeep {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge: overrides });
  Object.assign(context, extras);
  registerBatchM(context.slashCommandRegistry, { ctx: context });
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

test('/extension-exists returns true by extension id', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'summarize' }] }), '/extension-exists summarize'), 'true');
});

test('/extension-exists returns true by display name', async () => {
  const context = ctx({}, { extensionRecords: [{ id: 'quick-reply', manifest: { display_name: 'Quick Reply' } }] });
  assert.equal(await last(context, '/extension-exists name="Quick Reply"'), 'true');
});

test('/extension-exists matches id case-insensitively', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'SillyTavern-LALib' }] }), '/extension-exists sillytavern-lalib'), 'true');
});

test('/extension-exists returns false for missing extension', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'summarize' }] }), '/extension-exists missing'), 'false');
});

test('/extension-installed alias checks extension existence', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'summarize' }] }), '/extension-installed summarize'), 'true');
});

test('/extension-exists requires a name', async () => {
  const result = await exec(ctx(), '/extension-exists');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires extension name/u);
});

test('/extension-state returns enabled for installed active extension', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'summarize' }] }), '/extension-state summarize'), 'enabled');
});

test('/extension-state returns disabled when activation marks disabled', async () => {
  const context = ctx({}, {
    extensionRecords: [{ id: 'summarize' }],
    extensionActivationContext: { disabledExtensions: new Set(['summarize']) },
  });
  assert.equal(await last(context, '/extension-state summarize'), 'disabled');
});

test('/extension-state returns missing for unknown extension', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'summarize' }] }), '/extension-state missing'), 'missing');
});

test('/extension-state accepts name= argument', async () => {
  assert.equal(await last(ctx({}, { extensionRecords: [{ id: 'summarize' }] }), '/extension-state name=summarize'), 'enabled');
});

test('/extension-state requires a name', async () => {
  const result = await exec(ctx(), '/extension-state');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires extension name/u);
});

test('/tools-list returns tool names and descriptions from toolRegistry', async () => {
  const output = JSON.parse(await last(ctx({}, {
    toolRegistry: [
      { name: 'search', description: 'Search docs', parameters: { type: 'object' } },
      { name: 'calc', description: 'Calculate', action: 'ignored' },
    ],
  }), '/tools-list')) as Array<Record<string, unknown>>;
  assert.deepEqual(output, [
    { name: 'search', description: 'Search docs' },
    { name: 'calc', description: 'Calculate' },
  ]);
});

test('/tools-list falls back to chat metadata tools', async () => {
  const output = JSON.parse(await last(ctx({ chatMetadata: { ydltavern_tools: [{ name: 'meta', description: 'Metadata tool' }] } }), '/tools-list'));
  assert.deepEqual(output, [{ name: 'meta', description: 'Metadata tool' }]);
});

test('/tool-list alias returns registered tools', async () => {
  const output = JSON.parse(await last(ctx({}, { toolRegistry: [{ name: 'search', description: 'Search docs' }] }), '/tool-list'));
  assert.deepEqual(output, [{ name: 'search', description: 'Search docs' }]);
});

test('/tools-list returns empty array without tools', async () => {
  assert.equal(await last(ctx(), '/tools-list'), '[]');
});

test('/tools-invoke returns plan-only descriptor', async () => {
  const output = json(await last(ctx(), '/tools-invoke name=search args=query'));
  assert.deepEqual(output, { planned: true, action: 'tool.invoke', fields: { name: 'search', args: 'query' } });
});

test('/tool-invoke alias returns invoke descriptor', async () => {
  const output = json(await last(ctx(), '/tool-invoke name=search args=query'));
  assert.equal(output.action, 'tool.invoke');
  assert.deepEqual(output.fields, { name: 'search', args: 'query' });
});

test('/tools-invoke omits missing optional args field', async () => {
  const output = json(await last(ctx(), '/tools-invoke name=search'));
  assert.deepEqual(output.fields, { name: 'search' });
});

test('/tools-register returns plan-only descriptor', async () => {
  const output = json(await last(ctx(), '/tools-register name=search spec=schema description="Search docs"'));
  assert.deepEqual(output, {
    planned: true,
    action: 'tool.register',
    fields: { name: 'search', spec: 'schema', description: 'Search docs' },
  });
});

test('/tool-register alias returns register descriptor', async () => {
  const output = json(await last(ctx(), '/tool-register name=search spec=schema'));
  assert.equal(output.action, 'tool.register');
  assert.deepEqual(output.fields, { name: 'search', spec: 'schema' });
});

test('/tools-register omits missing optional fields', async () => {
  const output = json(await last(ctx(), '/tools-register name=search'));
  assert.deepEqual(output.fields, { name: 'search' });
});

test('/tools-unregister returns plan-only descriptor', async () => {
  const output = json(await last(ctx(), '/tools-unregister name=search'));
  assert.deepEqual(output, { planned: true, action: 'tool.unregister', fields: { name: 'search' } });
});

test('/tool-unregister alias returns unregister descriptor', async () => {
  const output = json(await last(ctx(), '/tool-unregister name=search'));
  assert.equal(output.action, 'tool.unregister');
  assert.deepEqual(output.fields, { name: 'search' });
});

test('/tools-unregister without name returns descriptor with empty fields', async () => {
  const output = json(await last(ctx(), '/tools-unregister'));
  assert.deepEqual(output.fields, {});
});

test('/extension-enable is unsupported with clear reason', async () => {
  const result = await exec(ctx(), '/extension-enable summarize');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /extension-enable is unsupported by st-compat: requires extension lifecycle runtime/u);
});

test('/reload-page is unsupported with clear reason', async () => {
  const result = await exec(ctx(), '/reload-page');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /reload-page is unsupported by st-compat: requires browser reload runtime/u);
});

test('/qr-create is unsupported with Quick Reply reason', async () => {
  const result = await exec(ctx(), '/qr-create set=Main label=Hi /echo hi');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /Quick Reply extension UI runtime not available/u);
});

test('/qr-presetadd alias is unsupported like qr-set-create', async () => {
  const result = await exec(ctx(), '/qr-presetadd Main');
  assert.equal(result.ok, false);
  assert.equal(result.outputs[0]?.name, 'qr-set-create');
  assert.match(result.outputs[0]?.error ?? '', /qr-set-create is unsupported by st-compat/u);
});

test('/loader-show is unsupported with loader overlay reason', async () => {
  const result = await exec(ctx(), '/loader-show message=Loading');
  assert.equal(result.ok, false);
  assert.match(result.outputs[0]?.error ?? '', /requires action-loader UI overlay/u);
});

test('registered unsupported callbacks throw SlashCommandUnsupportedError directly', async () => {
  const command = ctx().slashCommandRegistry.get('qr-set-create');
  await assert.rejects(async () => command?.callback({}, ''), SlashCommandUnsupportedError);
});
