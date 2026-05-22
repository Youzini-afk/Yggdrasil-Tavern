import assert from 'node:assert/strict';
import test from 'node:test';

import {
  REGEX_PLACEMENT,
  getRegexedString,
  MEMORY_SOURCE,
  DEFAULT_MEMORY_SETTINGS,
  shouldSummarize,
  formatMemoryValue,
  VECTORS_SOURCE,
  DEFAULT_VECTORS_SETTINGS,
  chunkText,
  planVectorsInjection,
  QUICK_REPLY_AUTO_EVENTS,
  DEFAULT_QUICK_REPLY_SETTINGS,
  autoExecuteCandidates,
  tokenCounterPlan,
} from '../dist/index.js';

// ---------------------------------------------------------------------------
// Regex

test('REGEX_PLACEMENT exposes ST canonical placement enum', () => {
  assert.equal(REGEX_PLACEMENT.MD_DISPLAY, 0);
  assert.equal(REGEX_PLACEMENT.USER_INPUT, 1);
  assert.equal(REGEX_PLACEMENT.AI_OUTPUT, 2);
  assert.equal(REGEX_PLACEMENT.SLASH_COMMAND, 3);
  assert.equal(REGEX_PLACEMENT.WORLD_INFO, 5);
  assert.equal(REGEX_PLACEMENT.REASONING, 6);
});

test('getRegexedString applies matching placement scripts', () => {
  const scripts = [{
    id: '1',
    scriptName: 'replace foo',
    findRegex: '/foo/g',
    replaceString: 'bar',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
  }];
  const out = getRegexedString('foo foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, 'bar bar');
});

test('getRegexedString skips disabled scripts', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/foo/g',
    replaceString: 'bar',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
    disabled: true,
  }];
  const out = getRegexedString('foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, 'foo');
});

test('getRegexedString skips non-matching placement', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/foo/g',
    replaceString: 'bar',
    placement: [REGEX_PLACEMENT.USER_INPUT],
  }];
  const out = getRegexedString('foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, 'foo');
});

test('getRegexedString respects min/max depth', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/foo/g',
    replaceString: 'bar',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
    minDepth: 5,
    maxDepth: 10,
  }];
  // Depth 3 < minDepth → skip
  assert.equal(getRegexedString('foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT, depth: 3 }), 'foo');
  // Depth 7 in range → apply
  assert.equal(getRegexedString('foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT, depth: 7 }), 'bar');
  // Depth 11 > maxDepth → skip
  assert.equal(getRegexedString('foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT, depth: 11 }), 'foo');
});

test('getRegexedString supports capture groups via $1..$N', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/(\\w+)\\s+(\\w+)/g',
    replaceString: '$2 $1',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
  }];
  const out = getRegexedString('hello world', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, 'world hello');
});

test('getRegexedString {{match}} resolves to $0', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/foo/g',
    replaceString: '<<{{match}}>>',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
  }];
  const out = getRegexedString('foo bar', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, '<<foo>> bar');
});

test('getRegexedString trimStrings remove unwanted text from replacement', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/foo/g',
    replaceString: '<<bar>>',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
    trimStrings: ['<<', '>>'],
  }];
  const out = getRegexedString('foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, 'bar');
});

test('getRegexedString substituteParams runs on final replacement', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/foo/g',
    replaceString: '{{user}}',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
  }];
  const out = getRegexedString('foo', scripts, {
    placement: REGEX_PLACEMENT.AI_OUTPUT,
    substituteParams: (s) => s.replace('{{user}}', 'Alice'),
  });
  assert.equal(out, 'Alice');
});

test('getRegexedString substituteRegex=2 expands pattern via substituteParams', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: '/{{user}}/g',
    replaceString: 'BOT',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
    substituteRegex: 2,
  }];
  const out = getRegexedString('Alice and Alice', scripts, {
    placement: REGEX_PLACEMENT.AI_OUTPUT,
    substituteParams: (s) => s.replace(/\{\{user\}\}/g, 'Alice'),
  });
  assert.equal(out, 'BOT and BOT');
});

test('getRegexedString plain pattern (no slashes) uses g flag', () => {
  const scripts = [{
    id: '1',
    scriptName: 'x',
    findRegex: 'foo',
    replaceString: 'bar',
    placement: [REGEX_PLACEMENT.AI_OUTPUT],
  }];
  const out = getRegexedString('foo foo', scripts, { placement: REGEX_PLACEMENT.AI_OUTPUT });
  assert.equal(out, 'bar bar');
});

// ---------------------------------------------------------------------------
// Memory

test('MEMORY_SOURCE has extras/main/webllm', () => {
  assert.equal(MEMORY_SOURCE.EXTRAS, 'extras');
  assert.equal(MEMORY_SOURCE.MAIN, 'main');
  assert.equal(MEMORY_SOURCE.WEBLLM, 'webllm');
});

test('DEFAULT_MEMORY_SETTINGS has ST defaults', () => {
  assert.equal(DEFAULT_MEMORY_SETTINGS.source, 'main');
  assert.equal(DEFAULT_MEMORY_SETTINGS.depth, 2);
  assert.equal(DEFAULT_MEMORY_SETTINGS.promptInterval, 10);
  assert.ok(DEFAULT_MEMORY_SETTINGS.template.includes('{{summary}}'));
});

test('shouldSummarize blocks when frozen', () => {
  const r = shouldSummarize({ ...DEFAULT_MEMORY_SETTINGS, memoryFrozen: true }, {
    chatLength: 100,
    lastSummaryAt: 0,
    wordsSinceLastSummary: 1000,
  });
  assert.equal(r.shouldSummarize, false);
  assert.equal(r.reason, 'frozen');
});

test('shouldSummarize blocks when sending or generating or unsupported', () => {
  const base = { chatLength: 100, lastSummaryAt: 0, wordsSinceLastSummary: 0 };
  assert.equal(shouldSummarize(DEFAULT_MEMORY_SETTINGS, { ...base, isSending: true }).reason, 'sending');
  assert.equal(shouldSummarize(DEFAULT_MEMORY_SETTINGS, { ...base, isGenerating: true }).reason, 'generating');
  assert.equal(shouldSummarize(DEFAULT_MEMORY_SETTINGS, { ...base, unsupportedBackend: true }).reason, 'unsupported_backend');
});

test('shouldSummarize triggers on interval', () => {
  const r = shouldSummarize({ ...DEFAULT_MEMORY_SETTINGS, promptInterval: 5 }, {
    chatLength: 10,
    lastSummaryAt: 0,
    wordsSinceLastSummary: 0,
  });
  assert.equal(r.shouldSummarize, true);
  assert.equal(r.reason, 'interval');
});

test('shouldSummarize triggers on force_words', () => {
  const r = shouldSummarize({ ...DEFAULT_MEMORY_SETTINGS, promptInterval: 0, promptForceWords: 100 }, {
    chatLength: 5,
    lastSummaryAt: 0,
    wordsSinceLastSummary: 150,
  });
  assert.equal(r.shouldSummarize, true);
  assert.equal(r.reason, 'force_words');
});

test('shouldSummarize returns no_trigger when below thresholds', () => {
  const r = shouldSummarize({ ...DEFAULT_MEMORY_SETTINGS, promptInterval: 100 }, {
    chatLength: 5,
    lastSummaryAt: 0,
    wordsSinceLastSummary: 0,
  });
  assert.equal(r.shouldSummarize, false);
  assert.equal(r.reason, 'no_trigger');
});

test('formatMemoryValue substitutes {{summary}} into template', () => {
  assert.equal(formatMemoryValue({ summary: 'Alice met Bob.' }), '[Summary: Alice met Bob.]');
});

test('formatMemoryValue returns empty for empty summary', () => {
  assert.equal(formatMemoryValue({ summary: '' }), '');
  assert.equal(formatMemoryValue({ summary: '   ' }), '');
});

test('formatMemoryValue uses input.template override', () => {
  assert.equal(
    formatMemoryValue({ summary: 'X', template: 'MEMORY: {{summary}}' }),
    'MEMORY: X',
  );
});

// ---------------------------------------------------------------------------
// Vectors

test('VECTORS_SOURCE includes major providers', () => {
  for (const src of ['transformers', 'openai', 'cohere', 'ollama', 'google']) {
    assert.ok(VECTORS_SOURCE.includes(src), `missing source ${src}`);
  }
});

test('DEFAULT_VECTORS_SETTINGS has chat/files/databank defaults', () => {
  assert.equal(DEFAULT_VECTORS_SETTINGS.source, 'transformers');
  assert.equal(DEFAULT_VECTORS_SETTINGS.chunk_size, 5000);
  assert.equal(DEFAULT_VECTORS_SETTINGS.chunk_count_db, 5);
  assert.ok(DEFAULT_VECTORS_SETTINGS.template.includes('{{text}}'));
});

test('chunkText splits by size with overlap', () => {
  const text = 'a'.repeat(100);
  const chunks = chunkText(text, { size: 30, overlapPercent: 0 });
  assert.equal(chunks.length, 4); // 30+30+30+10
  assert.equal(chunks[0].length, 30);
  assert.equal(chunks[3].length, 10);
});

test('chunkText overlap creates sliding window', () => {
  const text = 'abcdefghij';
  const chunks = chunkText(text, { size: 5, overlapPercent: 40 });
  // 40% of 5 = 2 overlap, stride = 3
  assert.ok(chunks.length >= 2);
  assert.equal(chunks[0], 'abcde');
  assert.equal(chunks[1], 'defgh');
});

test('chunkText respects custom boundary when onlyCustomBoundary=true', () => {
  const chunks = chunkText('a||b||c', { size: 1000, overlapPercent: 0, customBoundary: '||', onlyCustomBoundary: true });
  assert.deepEqual(chunks, ['a', 'b', 'c']);
});

test('chunkText handles empty text', () => {
  assert.deepEqual(chunkText('', { size: 100, overlapPercent: 0 }), []);
});

test('planVectorsInjection wraps retrieved chunks via template', () => {
  const plan = planVectorsInjection(['chunk one', 'chunk two'], DEFAULT_VECTORS_SETTINGS);
  assert.ok(plan.text.includes('chunk one'));
  assert.ok(plan.text.includes('chunk two'));
  assert.ok(plan.text.startsWith('Past events:'));
  assert.equal(plan.depth, DEFAULT_VECTORS_SETTINGS.depth);
});

// ---------------------------------------------------------------------------
// Quick Reply

test('QUICK_REPLY_AUTO_EVENTS lists ST hook events', () => {
  for (const ev of ['APP_READY', 'CHAT_CHANGED', 'USER_MESSAGE_RENDERED', 'CHARACTER_MESSAGE_RENDERED', 'GENERATION_AFTER_COMMANDS']) {
    assert.ok(QUICK_REPLY_AUTO_EVENTS.includes(ev), `missing ${ev}`);
  }
});

test('autoExecuteCandidates returns empty when disabled', () => {
  const settings = { ...DEFAULT_QUICK_REPLY_SETTINGS, isEnabled: false };
  assert.deepEqual([...autoExecuteCandidates(settings, 'APP_READY')], []);
});

test('autoExecuteCandidates picks startup-flagged QRs on APP_READY', () => {
  const settings = {
    isEnabled: true,
    config: { setList: [{
      name: 'set1',
      qrList: [
        { label: 'a', message: 'msg-a', executeOnStartup: true },
        { label: 'b', message: 'msg-b', executeOnStartup: false },
      ],
    }] },
  };
  const r = autoExecuteCandidates(settings, 'APP_READY');
  assert.equal(r.length, 1);
  assert.equal(r[0].label, 'a');
});

test('autoExecuteCandidates handles each event flag mapping', () => {
  const qr = (flags) => ({ label: 'x', message: 'y', ...flags });
  const settings = {
    isEnabled: true,
    config: { setList: [{
      name: 's',
      qrList: [
        qr({ executeOnUser: true }),
        qr({ executeOnAi: true }),
        qr({ executeOnChatChange: true }),
        qr({ executeOnGroupMemberDraft: true }),
        qr({ executeOnNewChat: true }),
        qr({ executeBeforeGeneration: true }),
        qr({ automationId: 'auto-1' }),
      ],
    }] },
  };
  assert.equal(autoExecuteCandidates(settings, 'USER_MESSAGE_RENDERED').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'CHARACTER_MESSAGE_RENDERED').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'CHAT_CHANGED').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'GROUP_MEMBER_DRAFTED').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'CHAT_CREATED').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'GROUP_CHAT_CREATED').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'GENERATION_AFTER_COMMANDS').length, 1);
  assert.equal(autoExecuteCandidates(settings, 'WORLD_INFO_ACTIVATED').length, 1);
});

// ---------------------------------------------------------------------------
// Token counter

test('tokenCounterPlan exposes char count and approximate tokens', () => {
  const plan = tokenCounterPlan('hello world', 'OpenAI');
  assert.equal(plan.text, 'hello world');
  assert.equal(plan.charCount, 11);
  assert.equal(plan.approxTokens, 3); // ceil(11/4)
  assert.equal(plan.tokenizer, 'OpenAI');
});
