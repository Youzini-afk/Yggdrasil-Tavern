import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyzePromptChunks,
  applyRegexScripts,
  buildMemoryPromptInsertion,
  countMessages,
  countText,
  createExtensionRegistry,
  createExtensionHookRegistry,
  createSTExtensionCompatibilityAdapter,
  discoverExtensionBundles,
  evaluateExtensionPermissions,
  executeQuickReply,
  normalizeMemorySettings,
  normalizeQuickReplySets,
  normalizeVectorSettings,
  parseExtensionManifest,
  planLoadExtension,
  planMemoryUpdate,
  planQuickReplyAutoExecute,
  planVectorIndex,
  planVectorInjection,
  planVectorQuery,
  sortExtensionsByLoadingOrder,
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

test('loader parses ST-like manifests and discovers bundle records', () => {
  const parsed = parseExtensionManifest({
    id: 'alpha',
    name: 'Alpha',
    display_name: 'Alpha Extension',
    version: '1.2.3',
    author: 'Ada',
    js: 'index.js',
    css: ['style.css'],
    loading_order: '7',
    requires: ['core'],
    optional: ['extras'],
    permissions: ['slash', 'network'],
    settings: { enabled: true },
    template: '<panel />',
  });

  assert.equal(parsed.manifest.id, 'alpha');
  assert.equal(parsed.manifest.displayName, 'Alpha Extension');
  assert.deepEqual(parsed.manifest.js, ['index.js']);
  assert.deepEqual(parsed.manifest.css, ['style.css']);
  assert.equal(parsed.manifest.loadingOrder, 7);
  assert.deepEqual(parsed.manifest.permissions, ['slash', 'network']);
  assert.deepEqual(parsed.diagnostics, []);

  const discovered = discoverExtensionBundles([
    { manifest: parsed.manifest.raw, enabled: false, assets: [{ type: 'template', path: 'panel.html' }] },
    { manifest: { name: 'No Version' } },
    { id: 'broken', manifest: null },
  ]);

  assert.equal(discovered.bundles.length, 3);
  assert.equal(discovered.bundles[0].enabled, false);
  assert.deepEqual(discovered.bundles[0].assets.map((asset) => `${asset.type}:${asset.path}`), [
    'css:style.css',
    'js:index.js',
    'template:template',
    'template:panel.html',
  ]);
  assert.equal(discovered.bundles[1].manifest.version, '0.0.0');
  assert.equal(discovered.diagnostics.some((item) => item.code === 'loader.bundle.manifest.missing'), true);
});

test('loader sorts extensions by loading order, name, and id', () => {
  const manifests = [
    parseExtensionManifest({ id: 'z', name: 'Same', loading_order: 2 }).manifest,
    parseExtensionManifest({ id: 'a', name: 'Same', loading_order: 2 }).manifest,
    parseExtensionManifest({ id: 'b', name: 'Before', loading_order: 2 }).manifest,
    parseExtensionManifest({ id: 'first', name: 'Last', loading_order: 1 }).manifest,
  ];

  assert.deepEqual(sortExtensionsByLoadingOrder(manifests).map((manifest) => manifest.id), ['first', 'b', 'a', 'z']);
});

test('loader exposes compatibility adapter and deterministic hook registry', () => {
  const compat = createSTExtensionCompatibilityAdapter();
  assert.equal(compat.available.getContext, true);
  assert.equal(compat.available.registerSlashCommand, true);
  assert.equal(compat.executesExtensionJavaScript, false);

  const hooks = createExtensionHookRegistry();
  assert.deepEqual(hooks.register('slash', {
    id: 'slash:hello',
    extensionId: 'alpha',
    deterministic: true,
    callback: (payload) => `hello:${payload.name}`,
  }), []);
  assert.equal(hooks.register('prompt', {
    id: 'prompt:unsafe',
    extensionId: 'alpha',
    callback: () => 'nope',
  })[0].code, 'loader.hook.callback.denied');

  assert.deepEqual(hooks.list('slash'), [{
    id: 'slash:hello',
    extensionId: 'alpha',
    kind: 'slash',
    deterministic: true,
  }]);
  assert.deepEqual(hooks.emit('slash', { name: 'Ada' }).results, ['hello:Ada']);
});

test('loader evaluates permissions and builds non-executing load plans', () => {
  const manifest = parseExtensionManifest({
    id: 'perm',
    name: 'Permissions',
    version: '1.0.0',
    js: ['main.js'],
    css: ['style.css'],
    permissions: ['slash', 'prompt', 'file', 'network'],
  }).manifest;

  const defaultResult = evaluateExtensionPermissions(manifest);
  assert.deepEqual(defaultResult.granted, ['slash', 'prompt']);
  assert.deepEqual(defaultResult.denied, ['file', 'network']);
  assert.equal(defaultResult.allowed, false);

  const allowedResult = evaluateExtensionPermissions(manifest, { allow: ['file'], permissions: { network: true } });
  assert.deepEqual(allowedResult.denied, []);
  assert.equal(allowedResult.allowed, true);

  const plan = planLoadExtension({ manifest: manifest.raw, assets: ['panel.html'] }, { allow: ['file'], permissions: { network: true } });
  assert.equal(plan.manifest.id, 'perm');
  assert.deepEqual(plan.sortedAssets.map((asset) => `${asset.type}:${asset.path}`), ['css:style.css', 'js:main.js', 'template:panel.html']);
  assert.equal(plan.compat.executesExtensionJavaScript, false);
  assert.equal(plan.loadPlan.enabled, true);
  assert.equal(plan.loadPlan.executeJavaScript, false);
  assert.equal(plan.loadPlan.actions.includes('skip:execute-js'), true);
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
