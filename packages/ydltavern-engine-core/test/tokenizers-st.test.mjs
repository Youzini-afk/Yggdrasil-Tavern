import assert from 'node:assert/strict';
import test from 'node:test';

import {
  TOKENIZER,
  ENCODE_TOKENIZERS,
  TOKENIZER_URLS,
  getTokenizerBestMatch,
  guesstimate,
  planCountTokensOpenAI,
  tokenCountCacheKey,
  TokenCountCache,
  getFriendlyTokenizerName,
} from '../dist/index.js';

test('TOKENIZER enum exposes ST canonical IDs', () => {
  assert.equal(TOKENIZER.OPENAI, 'OPENAI');
  assert.equal(TOKENIZER.LLAMA3, 'LLAMA3');
  assert.equal(TOKENIZER.CLAUDE, 'CLAUDE');
  assert.equal(TOKENIZER.DEEPSEEK, 'DEEPSEEK');
  assert.equal(TOKENIZER.BEST_MATCH, 'BEST_MATCH');
});

test('ENCODE_TOKENIZERS includes Llama family but not OpenAI', () => {
  assert.ok(ENCODE_TOKENIZERS.has(TOKENIZER.LLAMA));
  assert.ok(ENCODE_TOKENIZERS.has(TOKENIZER.LLAMA3));
  assert.ok(ENCODE_TOKENIZERS.has(TOKENIZER.MISTRAL));
  assert.ok(ENCODE_TOKENIZERS.has(TOKENIZER.DEEPSEEK));
  assert.equal(ENCODE_TOKENIZERS.has(TOKENIZER.OPENAI), false);
  assert.equal(ENCODE_TOKENIZERS.has(TOKENIZER.CLAUDE), false);
});

test('TOKENIZER_URLS exposes encode/decode/count paths', () => {
  assert.equal(TOKENIZER_URLS[TOKENIZER.OPENAI]?.encode, '/api/tokenizers/openai/encode');
  assert.equal(TOKENIZER_URLS[TOKENIZER.LLAMA3]?.count, '/api/tokenizers/llama3/count');
  assert.equal(TOKENIZER_URLS[TOKENIZER.CLAUDE]?.decode, '/api/tokenizers/claude/decode');
  assert.equal(TOKENIZER_URLS[TOKENIZER.NONE], undefined);
  assert.equal(TOKENIZER_URLS[TOKENIZER.BEST_MATCH], undefined);
});

test('TOKENIZER_URLS routes remote textgen/kobold to /api/tokenizers/remote/...', () => {
  assert.equal(
    TOKENIZER_URLS[TOKENIZER.API_TEXTGENERATIONWEBUI]?.encode,
    '/api/tokenizers/remote/textgenerationwebui/encode',
  );
  assert.equal(
    TOKENIZER_URLS[TOKENIZER.API_KOBOLD]?.count,
    '/api/tokenizers/remote/kobold/count',
  );
});

test('getTokenizerBestMatch novel: clio→NERD, kayra→NERD2, erato→LLAMA3', () => {
  assert.equal(getTokenizerBestMatch({ api: 'novel', novelModel: 'clio-v1' }), TOKENIZER.NERD);
  assert.equal(getTokenizerBestMatch({ api: 'novel', novelModel: 'kayra-v1' }), TOKENIZER.NERD2);
  assert.equal(getTokenizerBestMatch({ api: 'novel', novelModel: 'erato-v1' }), TOKENIZER.LLAMA3);
  assert.equal(getTokenizerBestMatch({ api: 'novel', novelModel: 'unknown' }), TOKENIZER.LLAMA);
});

test('getTokenizerBestMatch kobold/textgen: remote-connected uses API_KOBOLD/API_TEXTGEN', () => {
  assert.equal(
    getTokenizerBestMatch({ api: 'kobold', remoteConnected: true }),
    TOKENIZER.API_KOBOLD,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'textgenerationwebui', remoteConnected: true }),
    TOKENIZER.API_TEXTGENERATIONWEBUI,
  );
});

test('getTokenizerBestMatch textgen heuristics by model name', () => {
  assert.equal(
    getTokenizerBestMatch({ api: 'textgenerationwebui', model: 'meta-llama-3-70b' }),
    TOKENIZER.LLAMA3,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'textgenerationwebui', model: 'mistral-7b' }),
    TOKENIZER.MISTRAL,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'textgenerationwebui', model: 'gemma-2-9b' }),
    TOKENIZER.GEMMA,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'textgenerationwebui', model: 'deepseek-coder' }),
    TOKENIZER.DEEPSEEK,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'textgenerationwebui', model: 'unknown-model' }),
    TOKENIZER.LLAMA,
  );
});

test('getTokenizerBestMatch openai: claude → CLAUDE, else → OPENAI', () => {
  assert.equal(getTokenizerBestMatch({ api: 'openai', model: 'claude-3-opus' }), TOKENIZER.CLAUDE);
  assert.equal(getTokenizerBestMatch({ api: 'openai', model: 'gpt-4o' }), TOKENIZER.OPENAI);
});

test('getTokenizerBestMatch openrouter heuristics map model families', () => {
  assert.equal(
    getTokenizerBestMatch({ api: 'openrouter', model: 'anthropic/claude-3-haiku' }),
    TOKENIZER.CLAUDE,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'openrouter', model: 'meta-llama/llama-3-70b' }),
    TOKENIZER.LLAMA3,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'openrouter', model: 'qwen/qwen-2.5-72b' }),
    TOKENIZER.QWEN2,
  );
  assert.equal(
    getTokenizerBestMatch({ api: 'openrouter', model: 'unknown/model' }),
    TOKENIZER.OPENAI,
  );
});

test('getTokenizerBestMatch cohere uses Command-A or Command-R', () => {
  assert.equal(getTokenizerBestMatch({ api: 'cohere', model: 'command-a-rev1' }), TOKENIZER.COMMAND_A);
  assert.equal(getTokenizerBestMatch({ api: 'cohere', model: 'command-r' }), TOKENIZER.COMMAND_R);
});

test('guesstimate returns ceil(byteLength / 3.35)', () => {
  // ASCII: byteLength = length
  assert.equal(guesstimate(''), 0);
  assert.equal(guesstimate('a'), 1); // ceil(1/3.35) = 1
  assert.equal(guesstimate('hello'), 2); // ceil(5/3.35) = 2
  assert.equal(guesstimate('a'.repeat(34)), 11); // ceil(34/3.35) = 11
});

test('guesstimate uses UTF-8 byte length for non-ASCII', () => {
  // CJK char ~3 bytes, so 3 chars = 9 bytes / 3.35 ≈ 3
  const cjk = guesstimate('中文测');
  assert.ok(cjk >= 2 && cjk <= 4);
});

test('planCountTokensOpenAI wraps each message in single-element array', () => {
  const plan = planCountTokensOpenAI({
    messages: [
      { role: 'user', content: 'hi' },
      { role: 'assistant', content: 'yo' },
    ],
    model: 'gpt-4o',
  });
  assert.equal(plan.endpoint, '/api/tokenizers/openai/count');
  assert.equal(plan.body.messages.length, 2);
  assert.equal(plan.body.messages[0].length, 1);
  assert.equal(plan.body.model, 'gpt-4o');
  assert.equal(plan.subtract, 2);
  assert.equal(plan.body.full, undefined);
});

test('planCountTokensOpenAI sets full=true for Claude and subtract=0', () => {
  const plan = planCountTokensOpenAI({
    messages: [{ role: 'user', content: 'hi' }],
    model: 'claude-3-haiku',
  });
  assert.equal(plan.body.full, true);
  assert.equal(plan.subtract, 0);
});

test('tokenCountCacheKey is deterministic and varies by tokenizer/model/padding', () => {
  const a = tokenCountCacheKey({ tokenizer: TOKENIZER.OPENAI, text: 'hi', model: 'gpt-4o' });
  const b = tokenCountCacheKey({ tokenizer: TOKENIZER.OPENAI, text: 'hi', model: 'gpt-4o' });
  assert.equal(a, b);

  const c = tokenCountCacheKey({ tokenizer: TOKENIZER.LLAMA, text: 'hi', model: 'gpt-4o' });
  assert.notEqual(a, c);

  const d = tokenCountCacheKey({ tokenizer: TOKENIZER.OPENAI, text: 'hi', model: 'gpt-4o', padding: 4 });
  assert.notEqual(a, d);
});

test('TokenCountCache get/set with LRU eviction', () => {
  const cache = new TokenCountCache(3);
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);
  assert.equal(cache.get('a'), 1);
  cache.set('d', 4); // evicts oldest unused — b
  assert.equal(cache.has('b'), false);
  assert.equal(cache.get('a'), 1); // still present (touched)
  assert.equal(cache.size, 3);
});

test('TokenCountCache touches LRU on get', () => {
  const cache = new TokenCountCache(2);
  cache.set('a', 1);
  cache.set('b', 2);
  cache.get('a'); // touch a
  cache.set('c', 3); // evict b (now oldest)
  assert.equal(cache.has('a'), true);
  assert.equal(cache.has('b'), false);
  assert.equal(cache.has('c'), true);
});

test('getFriendlyTokenizerName returns human-readable names', () => {
  assert.equal(getFriendlyTokenizerName(TOKENIZER.OPENAI), 'OpenAI (tiktoken)');
  assert.equal(getFriendlyTokenizerName(TOKENIZER.LLAMA3), 'LLaMA 3');
  assert.equal(getFriendlyTokenizerName(TOKENIZER.NERD2), 'NerdStash v2');
});
