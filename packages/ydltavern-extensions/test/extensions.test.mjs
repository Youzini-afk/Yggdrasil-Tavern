import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyzePromptChunks,
  applyRegexScripts,
  buildMemoryPromptInsertion,
  countMessages,
  countText,
  createExtensionRegistry,
  executeQuickReply,
  normalizeMemorySettings,
  normalizeQuickReplySets,
  normalizeVectorSettings,
  planMemoryUpdate,
  planQuickReplyAutoExecute,
  planVectorIndex,
  planVectorInjection,
  planVectorQuery,
} from '../dist/index.js';

test('registry tracks installed, enabled, settings, and diagnostics', () => {
  const registry = createExtensionRegistry();
  const installed = registry.install({
    id: 'regex',
    name: 'Regex',
    version: '0.0.1',
    hooks: ['beforePrompt'],
    defaultSettings: { enabledScripts: [] },
  }, { enabled: false, settings: { enabledScripts: ['a'] } });

  assert.equal(installed.installed, true);
  assert.equal(installed.enabled, false);
  assert.deepEqual(installed.settings, { enabledScripts: ['a'] });
  assert.equal(registry.setEnabled('regex', true).enabled, true);
  assert.equal(registry.updateSettings('regex', { mode: 'dev' }).settings.mode, 'dev');
  assert.equal(registry.snapshot().extensions.length, 1);

  registry.install({ id: 'regex', name: 'Regex duplicate', version: '0.0.1' });
  assert.equal(registry.diagnostics().some((item) => item.code === 'extension.duplicate'), true);
});

test('token counter delegates to engine-core tokenizer api', () => {
  const tokenizer = {
    countText(text) {
      return text.length;
    },
    countMessages(messages) {
      return messages.reduce((sum, message) => sum + message.content.length + 1, 0);
    },
  };

  assert.equal(countText('abcd', tokenizer), 4);
  assert.equal(countMessages([{ role: 'user', content: 'hi' }], tokenizer), 3);
  const analysis = analyzePromptChunks([
    { id: 'system', role: 'system', text: 'abc' },
    { id: 'empty', text: '', enabled: false },
  ], tokenizer);
  assert.equal(analysis.totalTokens, 3);
  assert.equal(analysis.enabledTokens, 3);
  assert.equal(analysis.diagnostics[0].code, 'tokenCounter.chunk.empty');
});

test('regex applies matching placements and reports invalid regex diagnostics', () => {
  const result = applyRegexScripts('hello secret 123', [
    { id: 'global', scope: 'GLOBAL', find: 'secret', replace: '[redacted]', placement: 'beforePrompt' },
    { id: 'scoped', scope: 'SCOPED', find: '\\d+', replace: 'n', placement: 'beforePrompt', scopedTo: ['chat-a'] },
    { id: 'wrong-placement', scope: 'GLOBAL', find: 'hello', replace: 'bye', placement: 'response' },
    { id: 'bad', scope: 'GLOBAL', find: '[', replace: '', placement: 'beforePrompt' },
  ], { placement: 'beforePrompt', scopeId: 'chat-a' });

  assert.equal(result.text, 'hello [redacted] n');
  assert.deepEqual(result.applied, ['global', 'scoped']);
  assert.equal(result.diagnostics[0].code, 'regex.invalid');
  assert.equal(result.diagnostics[0].hook, 'beforePrompt');
});

test('quick replies normalize, execute messages and slash commands, and plan auto execute', async () => {
  const normalized = normalizeQuickReplySets([{ id: 'main', items: [
    { label: 'Say hi', message: 'Hi {{name}}', autoExecute: true, triggers: ['hi'] },
    { id: 'slash', slashCommand: '/help {{topic}}' },
    { id: 'empty' },
  ], links: ['main', 'main'] }]);

  assert.equal(normalized.sets[0].items[0].id, 'main:0');
  assert.deepEqual(normalized.sets[0].links, ['main']);
  assert.equal(normalized.diagnostics.some((item) => item.code === 'quickReply.item.empty'), true);

  const messageResult = await executeQuickReply(normalized.sets[0].items[0], undefined, { variables: { name: 'Ada' } });
  assert.deepEqual(messageResult, { kind: 'message', message: 'Hi Ada' });

  const slashCalls = [];
  const slashResult = await executeQuickReply(normalized.sets[0].items[1], {
    execute(command) {
      slashCalls.push(command);
      return 'ok';
    },
  }, { variables: { topic: 'docs' } });
  assert.equal(slashResult.kind, 'slashCommand');
  assert.deepEqual(slashCalls, ['/help docs']);

  const plan = planQuickReplyAutoExecute(normalized.sets, 'please say hi');
  assert.deepEqual(plan.itemIds, ['main:0']);
});

test('memory normalizes settings, builds insertion, and returns plan-only update proposal', () => {
  assert.equal(normalizeMemorySettings({ maxSummaryTokens: -1 }).maxSummaryTokens, 512);
  assert.deepEqual(buildMemoryPromptInsertion(' remembered ', { insertionTemplate: 'M={{summary}}' }), {
    enabled: true,
    content: 'M=remembered',
    diagnostics: [],
  });

  const chat = sampleChat(['one', 'two', 'three']);
  const plan = planMemoryUpdate(chat, { updateAfterTurns: 2 });
  assert.equal(plan.kind, 'memoryUpdateProposal');
  assert.equal(plan.shouldUpdate, true);
  assert.deepEqual(plan.candidateTurnIds, ['turn-2', 'turn-3']);
  assert.match(plan.proposal, /No summarization performed/);
});

test('vectors normalize settings and return plan-only diagnostics for index query injection', () => {
  assert.equal(normalizeVectorSettings({ topK: 0 }).topK, 4);

  const chat = sampleChat(['alpha beta', 'gamma']);
  const indexPlan = planVectorIndex(chat, { provider: 'none', chunkSize: 5 });
  assert.equal(indexPlan.kind, 'vectorIndexPlan');
  assert.deepEqual(indexPlan.actions, ['index:chat-memory:turn-1:2', 'index:chat-memory:turn-2:1']);
  assert.equal(indexPlan.diagnostics.some((item) => item.code === 'vectors.planOnly'), true);
  assert.equal(indexPlan.diagnostics.some((item) => item.code === 'vectors.provider.none'), true);

  const queryPlan = planVectorQuery('alpha', { provider: 'local' });
  assert.deepEqual(queryPlan.actions, ['query:chat-memory:topK=4:text=alpha']);

  const injectionPlan = planVectorInjection(['match a', 'match b'], { injectionTemplate: 'R={{matches}}' });
  assert.deepEqual(injectionPlan.actions, ['inject:R=match a\nmatch b']);
});

function sampleChat(texts) {
  return {
    id: 'chat',
    meta: {},
    turns: texts.map((text, index) => ({
      id: `turn-${index + 1}`,
      index,
      role: index % 2 === 0 ? 'user' : 'assistant',
      source: index % 2 === 0 ? 'user_input' : 'generation',
      variants: [{ id: `variant-${index + 1}`, subs: [{ kind: 'text', text }], meta: {}, created_at: 1 }],
      active_variant: 0,
      created_at: 1,
      memory_summary: index === 0 ? 'old summary' : undefined,
    })),
  };
}
