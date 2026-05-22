import assert from 'node:assert/strict';
import test from 'node:test';

import { createEventSource, createSTContextDeep, type ExecuteSlashCommandsDeepResult, type STContextDeep } from '../src/index.js';
import { registerBatchL } from '../src/slash-commands-batch-l.js';
import { SlashCommandUnsupportedError } from '../src/slash-commands-common.js';

type PlainRecord = Record<string, unknown>;
type TestContext = STContextDeep & PlainRecord & {
  formattingSettings?: PlainRecord;
  updateFormattingSettings?: (values: PlainRecord) => void;
  power_user?: PlainRecord;
};

function ctx(extra: PlainRecord = {}, hostBridge: Partial<STContextDeep> = {}): TestContext {
  const context = createSTContextDeep({ eventSource: createEventSource(), hostBridge }) as TestContext;
  Object.assign(context, extra);
  registerBatchL(context.slashCommandRegistry, { ctx: context });
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

async function assertUnsupported(command: string, reason: RegExp): Promise<void> {
  const context = ctx();
  const def = context.slashCommandRegistry.get(command);
  assert.ok(def, `expected /${command} to be registered`);
  await assert.rejects(
    async () => { await def.callback({}, ''); },
    (error) => error instanceof SlashCommandUnsupportedError && reason.test(error.message),
  );
}

test('/instruct without args returns current formatting template', async () => {
  assert.equal(await last(ctx({ formattingSettings: { instructTemplate: 'Alpaca' } }), '/instruct'), 'Alpaca');
});

test('/instruct falls back to chat metadata formatting', async () => {
  const context = ctx({}, { chatMetadata: { ydltavern_formatting: { instructTemplate: 'ChatML' } } });
  assert.equal(await last(context, '/instruct'), 'ChatML');
});

test('/instruct falls back to ST power_user instruct preset', async () => {
  assert.equal(await last(ctx({ power_user: { instruct: { preset: 'Roleplay' } } }), '/instruct'), 'Roleplay');
});

test('/instruct sets formatting template through updater', async () => {
  const patches: PlainRecord[] = [];
  const formattingSettings = { instructTemplate: 'old' };
  const context = ctx({ formattingSettings, updateFormattingSettings: (values: PlainRecord) => { patches.push(values); } });
  assert.equal(await last(context, '/instruct Metharme'), 'Metharme');
  assert.deepEqual(patches, [{ instructTemplate: 'Metharme' }]);
  assert.equal(formattingSettings.instructTemplate, 'Metharme');
});

test('/instruct name= sets formatting template', async () => {
  const context = ctx({ formattingSettings: {} });
  assert.equal(await last(context, '/instruct name=Vicuna'), 'Vicuna');
  assert.equal(context.formattingSettings?.instructTemplate, 'Vicuna');
});

test('/instruct creates chat metadata formatting when missing', async () => {
  const context = ctx();
  assert.equal(await last(context, '/instruct Creative'), 'Creative');
  assert.deepEqual(context.chatMetadata.ydltavern_formatting, { instructTemplate: 'Creative' });
});

test('/instruct-on enables instruct mode', async () => {
  const context = ctx({ formattingSettings: { instructEnabled: false } });
  assert.equal(await last(context, '/instruct-on'), 'true');
  assert.equal(context.formattingSettings?.instructEnabled, true);
});

test('/instruct-off disables instruct mode', async () => {
  const context = ctx({ formattingSettings: { instructEnabled: true } });
  assert.equal(await last(context, '/instruct-off'), 'false');
  assert.equal(context.formattingSettings?.instructEnabled, false);
});

test('/instruct state commands mirror power_user instruct.enabled', async () => {
  const context = ctx({ formattingSettings: {}, power_user: { instruct: { enabled: false } } });
  await last(context, '/instruct-on');
  assert.deepEqual(context.power_user?.instruct, { enabled: true });
  await last(context, '/instruct-off');
  assert.deepEqual(context.power_user?.instruct, { enabled: false });
});

test('/instruct-state gets current state', async () => {
  assert.equal(await last(ctx({ formattingSettings: { instructEnabled: true } }), '/instruct-state'), 'true');
});

test('/instruct-state enabled=false toggles state off', async () => {
  const context = ctx({ formattingSettings: { instructEnabled: true } });
  assert.equal(await last(context, '/instruct-state enabled=false'), 'false');
  assert.equal(context.formattingSettings?.instructEnabled, false);
});

test('/instruct-toggle alias toggles state from positional value', async () => {
  const context = ctx({ formattingSettings: { instructEnabled: false } });
  assert.equal(await last(context, '/instruct-toggle true'), 'true');
  assert.equal(context.formattingSettings?.instructEnabled, true);
});

test('/context without args returns active context template', async () => {
  assert.equal(await last(ctx({ formattingSettings: { contextTemplate: 'default' } }), '/context'), 'default');
});

test('/context falls back to ST power_user context preset', async () => {
  assert.equal(await last(ctx({ power_user: { context: { preset: 'Novel' } } }), '/context'), 'Novel');
});

test('/context sets active context template', async () => {
  const context = ctx({ formattingSettings: { contextTemplate: 'old' } });
  assert.equal(await last(context, '/context Chat'), 'Chat');
  assert.equal(context.formattingSettings?.contextTemplate, 'Chat');
});

test('/context name= sets active context template', async () => {
  const context = ctx({ formattingSettings: {} });
  assert.equal(await last(context, '/context name=Story'), 'Story');
  assert.equal(context.formattingSettings?.contextTemplate, 'Story');
});

test('/context creates metadata fallback when formatting context is absent', async () => {
  const context = ctx();
  assert.equal(await last(context, '/context Minimal'), 'Minimal');
  assert.deepEqual(context.chatMetadata.ydltavern_formatting, { contextTemplate: 'Minimal' });
});

test('/sysprompt without args returns current system prompt preset', async () => {
  assert.equal(await last(ctx({ formattingSettings: { systemPrompt: 'Default Sys' } }), '/sysprompt'), 'Default Sys');
});

test('/sysprompt falls back to metadata formatting', async () => {
  const context = ctx({}, { chatMetadata: { ydltavern_formatting: { systemPrompt: 'Meta Sys' } } });
  assert.equal(await last(context, '/sysprompt'), 'Meta Sys');
});

test('/sysprompt falls back to ST power_user sysprompt preset', async () => {
  assert.equal(await last(ctx({ power_user: { sysprompt: { preset: 'Strict' } } }), '/sysprompt'), 'Strict');
});

test('/sysprompt sets active system prompt preset', async () => {
  const context = ctx({ formattingSettings: {} });
  assert.equal(await last(context, '/sysprompt Safety'), 'Safety');
  assert.equal(context.formattingSettings?.systemPrompt, 'Safety');
});

test('/system-prompt alias sets active system prompt preset', async () => {
  const context = ctx({ formattingSettings: {} });
  assert.equal(await last(context, '/system-prompt name="System A"'), 'System A');
  assert.equal(context.formattingSettings?.systemPrompt, 'System A');
});

test('/sysprompt creates metadata fallback when formatting context is absent', async () => {
  const context = ctx();
  assert.equal(await last(context, '/sysprompt Main'), 'Main');
  assert.deepEqual(context.chatMetadata.ydltavern_formatting, { systemPrompt: 'Main' });
});

test('/sysprompt-on enables system prompt', async () => {
  const context = ctx({ formattingSettings: { systemPromptEnabled: false } });
  assert.equal(await last(context, '/sysprompt-on'), 'true');
  assert.equal(context.formattingSettings?.systemPromptEnabled, true);
});

test('/sysprompt-enable alias enables system prompt', async () => {
  const context = ctx({ formattingSettings: { systemPromptEnabled: false } });
  assert.equal(await last(context, '/sysprompt-enable'), 'true');
  assert.equal(context.formattingSettings?.systemPromptEnabled, true);
});

test('/sysprompt-off disables system prompt', async () => {
  const context = ctx({ formattingSettings: { systemPromptEnabled: true } });
  assert.equal(await last(context, '/sysprompt-off'), 'false');
  assert.equal(context.formattingSettings?.systemPromptEnabled, false);
});

test('/sysprompt-disable alias disables system prompt', async () => {
  const context = ctx({ formattingSettings: { systemPromptEnabled: true } });
  assert.equal(await last(context, '/sysprompt-disable'), 'false');
  assert.equal(context.formattingSettings?.systemPromptEnabled, false);
});

test('/sysprompt-state gets current state', async () => {
  assert.equal(await last(ctx({ formattingSettings: { systemPromptEnabled: true } }), '/sysprompt-state'), 'true');
});

test('/sysprompt-state enabled=false toggles state off', async () => {
  const context = ctx({ formattingSettings: { systemPromptEnabled: true } });
  assert.equal(await last(context, '/sysprompt-state enabled=false'), 'false');
  assert.equal(context.formattingSettings?.systemPromptEnabled, false);
});

test('/sysprompt-toggle alias toggles state from positional value', async () => {
  const context = ctx({ formattingSettings: { systemPromptEnabled: false } });
  assert.equal(await last(context, '/sysprompt-toggle true'), 'true');
  assert.equal(context.formattingSettings?.systemPromptEnabled, true);
});

test('/stop-strings without args returns current stop strings', async () => {
  assert.equal(await last(ctx({ formattingSettings: { stopStrings: 'A\nB' } }), '/stop-strings'), 'A\nB');
});

test('/stop-strings falls back to ST custom_stopping_strings', async () => {
  assert.equal(await last(ctx({ power_user: { custom_stopping_strings: '["stop"]' } }), '/stop-strings'), '["stop"]');
});

test('/stop-strings sets custom stop strings', async () => {
  const context = ctx({ formattingSettings: {} });
  assert.equal(await last(context, '/stop-strings value="Alpha Beta"'), 'Alpha Beta');
  assert.equal(context.formattingSettings?.stopStrings, 'Alpha Beta');
});

test('/stopping-strings alias sets custom stop strings', async () => {
  const context = ctx({ formattingSettings: {}, power_user: {} });
  assert.equal(await last(context, '/stopping-strings ["halt"]'), '["halt"]');
  assert.equal(context.formattingSettings?.stopStrings, '["halt"]');
  assert.equal(context.power_user?.custom_stopping_strings, '["halt"]');
});

test('/custom-stopping-strings alias returns stop strings', async () => {
  assert.equal(await last(ctx({ formattingSettings: { stopStrings: 'custom' } }), '/custom-stopping-strings'), 'custom');
});

test('/custom-stop-strings alias returns stop strings', async () => {
  assert.equal(await last(ctx({ formattingSettings: { stopStrings: 'custom2' } }), '/custom-stop-strings'), 'custom2');
});

test('/start-reply-with sets start reply prefix', async () => {
  const context = ctx({ formattingSettings: {} });
  assert.equal(await last(context, '/start-reply-with Sure!'), 'Sure!');
  assert.equal(context.formattingSettings?.startReplyWith, 'Sure!');
});

test('/start-reply-with text= sets start reply prefix', async () => {
  const context = ctx({ formattingSettings: {}, power_user: {} });
  assert.equal(await last(context, '/start-reply-with text="Of course"'), 'Of course');
  assert.equal(context.formattingSettings?.startReplyWith, 'Of course');
  assert.equal(context.power_user?.user_prompt_bias, 'Of course');
});

test('/start-reply-with empty input clears start reply prefix', async () => {
  const context = ctx({ formattingSettings: { startReplyWith: 'old' } });
  assert.equal(await last(context, '/start-reply-with'), '');
  assert.equal(context.formattingSettings?.startReplyWith, '');
});

test('/single sets story display mode', async () => {
  const context = ctx({ power_user: {} });
  assert.equal(await last(context, '/single'), 'story');
  assert.equal(context.power_user?.chat_display, 'story');
  assert.equal(context.powerUserSettings.chat_display, 'story');
  assert.equal(context.chatMetadata.chat_display, 'story');
});

test('/story alias sets story display mode', async () => {
  assert.equal(await last(ctx(), '/story'), 'story');
});

test('/bubble sets bubble display mode', async () => {
  const context = ctx({ power_user: {} });
  assert.equal(await last(context, '/bubble'), 'bubble');
  assert.equal(context.power_user?.chat_display, 'bubble');
});

test('/bubbles alias sets bubble display mode', async () => {
  assert.equal(await last(ctx(), '/bubbles'), 'bubble');
});

test('/flat sets default display mode', async () => {
  const context = ctx({ power_user: {} });
  assert.equal(await last(context, '/flat'), 'default');
  assert.equal(context.power_user?.chat_display, 'default');
});

test('/default alias sets default display mode', async () => {
  assert.equal(await last(ctx(), '/default'), 'default');
});

test('/bg returns background plan-only descriptor', async () => {
  assert.deepEqual(json(await last(ctx(), '/bg name=beach.jpg')), {
    planned: true,
    action: 'background.set',
    fields: { name: 'beach.jpg' },
  });
});

test('/background alias returns background plan-only descriptor', async () => {
  assert.equal(json(await last(ctx(), '/background name=forest.png')).action, 'background.set');
});

test('/theme is unsupported', async () => {
  await assertUnsupported('theme', /DOM theme runtime/u);
});

test('/bgcol is unsupported', async () => {
  await assertUnsupported('bgcol', /DOM color extraction/u);
});

test('/movingui is unsupported', async () => {
  await assertUnsupported('movingui', /moving UI runtime/u);
});

test('/resetpanels and /resetui are unsupported', async () => {
  await assertUnsupported('resetpanels', /layout panel runtime/u);
  await assertUnsupported('resetui', /layout panel runtime/u);
});

test('/css-var is unsupported', async () => {
  await assertUnsupported('css-var', /CSS variable manipulation/u);
});

test('/vn is unsupported', async () => {
  await assertUnsupported('vn', /Visual Novel mode UI runtime/u);
});
