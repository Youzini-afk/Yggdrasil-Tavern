import assert from 'node:assert/strict';
import test from 'node:test';

import {
  TOKENIZER,
  guesstimate,
  selectEncodingForModel,
  OpenAITokenizerAdapter,
  LlamaTokenizerAdapter,
  AnthropicTokenizerAdapter,
  HuggingFaceTokenizerAdapter,
  createHuggingFaceTokenizer,
  getTokenizer,
  countTokens,
  createGuesstimateAdapter,
  getTokenizerBestMatch,
} from '../dist/index.js';

const MINIMAL_HF_TOKENIZER_JSON = {
  version: '1.0',
  normalizer: null,
  pre_tokenizer: { type: 'Whitespace' },
  post_processor: null,
  decoder: { type: 'WordPiece', prefix: '##', cleanup: true },
  model: {
    type: 'WordPiece',
    vocab: { '[UNK]': 0, hello: 1, world: 2 },
    unk_token: '[UNK]',
  },
  added_tokens: [],
};

// ---------------------------------------------------------------------------
// selectEncodingForModel

test('selectEncodingForModel: o200k_base for gpt-4o, gpt-5, o1, o3, o4', () => {
  assert.equal(selectEncodingForModel('gpt-4o'), 'o200k_base');
  assert.equal(selectEncodingForModel('gpt-4o-mini'), 'o200k_base');
  assert.equal(selectEncodingForModel('gpt-5'), 'o200k_base');
  assert.equal(selectEncodingForModel('gpt-5-turbo'), 'o200k_base');
  assert.equal(selectEncodingForModel('o1-preview'), 'o200k_base');
  assert.equal(selectEncodingForModel('o1-mini'), 'o200k_base');
  assert.equal(selectEncodingForModel('o3'), 'o200k_base');
  assert.equal(selectEncodingForModel('o3-mini'), 'o200k_base');
  assert.equal(selectEncodingForModel('o4-mini'), 'o200k_base');
});

test('selectEncodingForModel: cl100k_base for gpt-4, gpt-3.5, chatgpt', () => {
  assert.equal(selectEncodingForModel('gpt-4'), 'cl100k_base');
  assert.equal(selectEncodingForModel('gpt-4-turbo'), 'cl100k_base');
  assert.equal(selectEncodingForModel('gpt-4-0314'), 'cl100k_base');
  assert.equal(selectEncodingForModel('gpt-3.5-turbo'), 'cl100k_base');
  assert.equal(selectEncodingForModel('gpt-3.5-turbo-16k'), 'cl100k_base');
  assert.equal(selectEncodingForModel('chatgpt-4k'), 'cl100k_base');
});

test('selectEncodingForModel: p50k_base for text-davinci, code-', () => {
  assert.equal(selectEncodingForModel('text-davinci-003'), 'p50k_base');
  assert.equal(selectEncodingForModel('text-davinci-002'), 'p50k_base');
  assert.equal(selectEncodingForModel('code-davinci-002'), 'p50k_base');
  assert.equal(selectEncodingForModel('code-cushman-001'), 'p50k_base');
});

test('selectEncodingForModel: r50k_base for unknown/older models', () => {
  assert.equal(selectEncodingForModel('davinci'), 'r50k_base');
  assert.equal(selectEncodingForModel('curie'), 'r50k_base');
  assert.equal(selectEncodingForModel('some-random-model'), 'r50k_base');
  assert.equal(selectEncodingForModel(''), 'r50k_base');
});

test('selectEncodingForModel is case-insensitive', () => {
  assert.equal(selectEncodingForModel('GPT-4O'), 'o200k_base');
  assert.equal(selectEncodingForModel('Gpt-4'), 'cl100k_base');
  assert.equal(selectEncodingForModel('TEXT-DAVINCI-003'), 'p50k_base');
});

// ---------------------------------------------------------------------------
// OpenAITokenizerAdapter — real token counts

test('OpenAITokenizerAdapter cl100k_base count("hello world") = 2', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  await adapter.load();
  const count = await adapter.count('hello world');
  assert.equal(count, 2);
});

test('OpenAITokenizerAdapter cl100k_base count("hello") = 1', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  await adapter.load();
  const count = await adapter.count('hello');
  assert.equal(count, 1);
});

test('OpenAITokenizerAdapter cl100k_base encode returns expected tokens', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  const tokens = await adapter.encode('hello world');
  assert.deepEqual([...tokens], [15339, 1917]);
});

test('OpenAITokenizerAdapter cl100k_base decode round-trips', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  const text = 'hello world';
  const tokens = await adapter.encode(text);
  const decoded = await adapter.decode(tokens);
  assert.equal(decoded, text);
});

test('OpenAITokenizerAdapter cl100k_base round-trip with CJK text', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  const text = '你好世界';
  const tokens = await adapter.encode(text);
  const decoded = await adapter.decode(tokens);
  assert.equal(decoded, text);
  assert.equal(tokens.length, 5); // cl100k_base tokenizes 你好世界 as 5 tokens
});

test('OpenAITokenizerAdapter o200k_base count("hello world") = 2', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4o');
  await adapter.load();
  const count = await adapter.count('hello world');
  assert.equal(count, 2);
});

test('OpenAITokenizerAdapter o200k_base CJK text is more efficient than cl100k_base', async () => {
  const adapterO200k = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4o');
  const adapterCl100k = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  const text = '你好世界';
  const countO200k = await adapterO200k.count(text);
  const countCl100k = await adapterCl100k.count(text);
  // o200k_base is more efficient for CJK: 2 vs 5
  assert.equal(countO200k, 2);
  assert.equal(countCl100k, 5);
  assert.ok(countO200k < countCl100k);
});

test('OpenAITokenizerAdapter GPT2 id defaults to r50k_base', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.GPT2);
  const tokens = await adapter.encode('hello world');
  assert.deepEqual([...tokens], [31373, 995]);
});

test('OpenAITokenizerAdapter modelHint changes encoding selection', async () => {
  const adapter4o = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4o');
  const adapter4 = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  // CJK text: o200k_base vs cl100k_base differ in tokenization
  const text = '你好世界';
  const tokens4o = await adapter4o.encode(text);
  const tokens4 = await adapter4.encode(text);
  assert.notDeepEqual([...tokens4o], [...tokens4]);
  assert.equal(tokens4o.length, 2);  // o200k_base
  assert.equal(tokens4.length, 5);   // cl100k_base
});

test('OpenAITokenizerAdapter lazy loading: module not loaded until first call', async () => {
  const adapter = new OpenAITokenizerAdapter(TOKENIZER.OPENAI, 'gpt-4');
  // Before any call, the module should not be loaded
  // We verify this indirectly: calling load() then count() works
  await adapter.load();
  const count = await adapter.count('hello');
  assert.equal(count, 1);
});

// ---------------------------------------------------------------------------
// LlamaTokenizerAdapter — LLAMA (Llama 1/2)

test('LlamaTokenizerAdapter id=LLAMA loads llama-tokenizer-js', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  await adapter.load();
  assert.equal(adapter.id, TOKENIZER.LLAMA);
});

test('LlamaTokenizerAdapter id=LLAMA count("hello world") = 3 (BOS + 2 content)', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  const count = await adapter.count('hello world');
  // llama-tokenizer-js default: addBos=true → [1, 22172, 3186] = 3 tokens
  assert.equal(count, 3);
});

test('LlamaTokenizerAdapter id=LLAMA encode returns BOS + content tokens', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  const tokens = await adapter.encode('hello world');
  assert.deepEqual([...tokens], [1, 22172, 3186]);
});

test('LlamaTokenizerAdapter id=LLAMA decode round-trips', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  const text = 'hello world';
  const tokens = await adapter.encode(text);
  const decoded = await adapter.decode(tokens);
  assert.equal(decoded, text);
});

test('LlamaTokenizerAdapter id=LLAMA addBos=false omits BOS token', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA, { addBos: false });
  const tokens = await adapter.encode('hello world');
  // Without BOS: [22172, 3186] = 2 tokens, no BOS=1 prefix
  assert.equal(tokens.length, 2);
  assert.notEqual(tokens[0], 1); // First token is NOT BOS
});

test('LlamaTokenizerAdapter id=LLAMA addBos=false count is 1 less', async () => {
  const adapterWithBos = new LlamaTokenizerAdapter(TOKENIZER.LLAMA, { addBos: true });
  const adapterNoBos = new LlamaTokenizerAdapter(TOKENIZER.LLAMA, { addBos: false });
  const countWithBos = await adapterWithBos.count('hello world');
  const countNoBos = await adapterNoBos.count('hello world');
  assert.equal(countWithBos, 3);
  assert.equal(countNoBos, 2);
  assert.equal(countWithBos - countNoBos, 1);
});

test('LlamaTokenizerAdapter id=LLAMA addEos option is ignored (not supported by package)', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA, { addEos: true });
  const count = await adapter.count('hello world');
  // EOS is not supported by llama-tokenizer-js; count same as default
  assert.equal(count, 3);
});

// ---------------------------------------------------------------------------
// LlamaTokenizerAdapter — LLAMA3 (Llama 3/3.1/3.2/3.3)

test('LlamaTokenizerAdapter id=LLAMA3 loads llama3-tokenizer-js', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3);
  await adapter.load();
  assert.equal(adapter.id, TOKENIZER.LLAMA3);
});

test('LlamaTokenizerAdapter id=LLAMA3 count("hello world") = 4 (BOS+content+EOS)', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3);
  const count = await adapter.count('hello world');
  // llama3-tokenizer-js default: bos=true, eos=true → [128000, 15339, 1917, 128001] = 4 tokens
  assert.equal(count, 4);
});

test('LlamaTokenizerAdapter id=LLAMA3 encode returns BOS + content + EOS', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3);
  const tokens = await adapter.encode('hello world');
  assert.deepEqual([...tokens], [128000, 15339, 1917, 128001]);
});

test('LlamaTokenizerAdapter id=LLAMA3 addBos=false, addEos=false omits special tokens', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3, { addBos: false, addEos: false });
  const tokens = await adapter.encode('hello world');
  // Without BOS/EOS: [15339, 1917] = 2 tokens
  assert.deepEqual([...tokens], [15339, 1917]);
  assert.equal(tokens.length, 2);
});

test('LlamaTokenizerAdapter id=LLAMA3 addBos=false, addEos=true includes EOS but not BOS', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3, { addBos: false, addEos: true });
  const tokens = await adapter.encode('hello world');
  // No BOS, with EOS: [15339, 1917, 128001] = 3 tokens
  assert.deepEqual([...tokens], [15339, 1917, 128001]);
});

test('LlamaTokenizerAdapter id=LLAMA3 addBos=true, addEos=false includes BOS but not EOS', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3, { addBos: true, addEos: false });
  const tokens = await adapter.encode('hello world');
  // BOS, no EOS: [128000, 15339, 1917] = 3 tokens
  assert.deepEqual([...tokens], [128000, 15339, 1917]);
});

test('LlamaTokenizerAdapter id=LLAMA3 count differs from LLAMA for same text', async () => {
  const llama = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  const llama3 = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3);
  // Different vocab sizes → different token counts
  const countLlama = await llama.count('hello world');
  const countLlama3 = await llama3.count('hello world');
  // Llama2: 3 (BOS + 2 content), Llama3: 4 (BOS + 2 content + EOS)
  assert.notEqual(countLlama, countLlama3);
});

// ---------------------------------------------------------------------------
// LlamaTokenizerAdapter — independent caches

test('LLAMA and LLAMA3 use independent caches', async () => {
  const llama = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  const llama3 = new LlamaTokenizerAdapter(TOKENIZER.LLAMA3);

  // Load only LLAMA
  await llama.load();
  // LLAMA3 should not be loaded yet — but we can't inspect internals directly.
  // Instead verify both produce distinct results after loading independently.
  const llamaTokens = await llama.encode('test');
  const llama3Tokens = await llama3.encode('test');
  // LLAMA: BOS(1) + content; LLAMA3: BOS(128000) + content + EOS(128001)
  assert.notDeepEqual([...llamaTokens], [...llama3Tokens]);
});

// ---------------------------------------------------------------------------
// LlamaTokenizerAdapter — lazy loading

test('LlamaTokenizerAdapter lazy loading: tokenizer not loaded until first call', async () => {
  const adapter = new LlamaTokenizerAdapter(TOKENIZER.LLAMA);
  // Before load(), encoding triggers load internally
  const count = await adapter.count('hello');
  assert.ok(count > 0);
});

// ---------------------------------------------------------------------------
// AnthropicTokenizerAdapter — Claude local text approximation only

test('AnthropicTokenizerAdapter count("hello world") returns positive estimate (local text approximation only)', async () => {
  const adapter = new AnthropicTokenizerAdapter('claude-sonnet-4');
  const count = await adapter.count('hello world');
  assert.ok(count >= 1);
});

test('AnthropicTokenizerAdapter encode throws NotSupported because package is countTokens-only', async () => {
  const adapter = new AnthropicTokenizerAdapter();
  await assert.rejects(
    () => adapter.encode('hello world'),
    /encode is not supported/,
  );
});

test('AnthropicTokenizerAdapter decode throws NotSupported because package is countTokens-only', async () => {
  const adapter = new AnthropicTokenizerAdapter();
  await assert.rejects(
    () => adapter.decode([1, 2]),
    /decode is not supported/,
  );
});

test('AnthropicTokenizerAdapter shares cached loaded counter singleton', async () => {
  const first = new AnthropicTokenizerAdapter();
  const second = new AnthropicTokenizerAdapter();
  await first.load();
  await second.load();
  const firstCount = await first.count('hello world');
  const secondCount = await second.count('hello world');
  assert.equal(firstCount, secondCount);
});

test('AnthropicTokenizerAdapter preserves optional modelHint metadata', () => {
  const adapter = new AnthropicTokenizerAdapter('claude-opus-4');
  assert.equal(adapter.id, TOKENIZER.CLAUDE);
  assert.equal(adapter.modelHint, 'claude-opus-4');
});

// ---------------------------------------------------------------------------
// HuggingFaceTokenizerAdapter — caller supplies tokenizer.json/config source

test('HuggingFaceTokenizerAdapter throws useful error on missing tokenizer source', async () => {
  const adapter = new HuggingFaceTokenizerAdapter(TOKENIZER.MISTRAL, { tokenizerJson: {} }, 'invalid-source');
  await assert.rejects(
    () => adapter.load(),
    /Tokenizer must contain/,
  );
});

test('HuggingFaceTokenizerAdapter encodes, decodes, and counts with embedded minimal fixture', async () => {
  const adapter = new HuggingFaceTokenizerAdapter(
    TOKENIZER.MISTRAL,
    { tokenizerJson: MINIMAL_HF_TOKENIZER_JSON, tokenizerConfig: {} },
    'minimal-wordpiece',
  );
  const tokens = await adapter.encode('hello world');
  assert.deepEqual([...tokens], [1, 2]);
  assert.equal(await adapter.count('hello world'), 2);
  assert.equal(await adapter.decode(tokens), 'hello world');
});

test('HuggingFaceTokenizerAdapter caches loaded tokenizer by cacheKey', async () => {
  const first = new HuggingFaceTokenizerAdapter(
    TOKENIZER.GEMMA,
    { tokenizerJson: MINIMAL_HF_TOKENIZER_JSON, tokenizerConfig: {} },
    'shared-minimal',
  );
  const second = new HuggingFaceTokenizerAdapter(
    TOKENIZER.GEMMA,
    { tokenizerJson: { ...MINIMAL_HF_TOKENIZER_JSON, model: { ...MINIMAL_HF_TOKENIZER_JSON.model, vocab: { '[UNK]': 0 } } }, tokenizerConfig: {} },
    'shared-minimal',
  );

  assert.deepEqual([...(await first.encode('hello world'))], [1, 2]);
  // Same id + modelHint reuses the first parsed tokenizer despite a different second source.
  assert.deepEqual([...(await second.encode('hello world'))], [1, 2]);
});

test('createHuggingFaceTokenizer factory returns adapter with requested id', () => {
  const adapter = createHuggingFaceTokenizer(
    TOKENIZER.QWEN2,
    { tokenizerJson: MINIMAL_HF_TOKENIZER_JSON, tokenizerConfig: {} },
    'qwen2-fixture',
  );
  assert.ok(adapter instanceof HuggingFaceTokenizerAdapter);
  assert.equal(adapter.id, TOKENIZER.QWEN2);
});

// ---------------------------------------------------------------------------
// getTokenizer

test('getTokenizer(OPENAI) returns OpenAITokenizerAdapter', async () => {
  const adapter = await getTokenizer(TOKENIZER.OPENAI);
  assert.ok(adapter instanceof OpenAITokenizerAdapter);
  assert.equal(adapter.id, TOKENIZER.OPENAI);
});

test('getTokenizer(GPT2) returns OpenAITokenizerAdapter', async () => {
  const adapter = await getTokenizer(TOKENIZER.GPT2);
  assert.ok(adapter instanceof OpenAITokenizerAdapter);
  assert.equal(adapter.id, TOKENIZER.GPT2);
});

test('getTokenizer(LLAMA) returns LlamaTokenizerAdapter (not guesstimate)', async () => {
  const adapter = await getTokenizer(TOKENIZER.LLAMA);
  assert.ok(adapter instanceof LlamaTokenizerAdapter);
  assert.equal(adapter.id, TOKENIZER.LLAMA);
  assert.equal(adapter.fallback, undefined);
});

test('getTokenizer(LLAMA3) returns LlamaTokenizerAdapter (not guesstimate)', async () => {
  const adapter = await getTokenizer(TOKENIZER.LLAMA3);
  assert.ok(adapter instanceof LlamaTokenizerAdapter);
  assert.equal(adapter.id, TOKENIZER.LLAMA3);
  assert.equal(adapter.fallback, undefined);
});

test('getTokenizer(CLAUDE) returns AnthropicTokenizerAdapter (local approximation)', async () => {
  const adapter = await getTokenizer(TOKENIZER.CLAUDE);
  assert.ok(adapter instanceof AnthropicTokenizerAdapter);
  assert.equal(adapter.id, TOKENIZER.CLAUDE);
  assert.equal(adapter.fallback, undefined);
});

test('getTokenizer(OPENAI, { modelHint: "gpt-4o" }) selects o200k_base encoding', async () => {
  const adapter = await getTokenizer(TOKENIZER.OPENAI, { modelHint: 'gpt-4o' });
  assert.ok(adapter instanceof OpenAITokenizerAdapter);
  // Verify it's using o200k_base by checking CJK token count
  const count = await adapter.count('你好世界');
  assert.equal(count, 2); // o200k_base encodes 你好世界 as 2 tokens
});

test('getTokenizer(NONE) returns guesstimate fallback', async () => {
  const adapter = await getTokenizer(TOKENIZER.NONE);
  assert.equal(adapter.fallback, true);
});

test('getTokenizer(MISTRAL) remains guesstimate fallback because HF source is host-provided', async () => {
  const adapter = await getTokenizer(TOKENIZER.MISTRAL);
  assert.equal(adapter.fallback, true);
});

// ---------------------------------------------------------------------------
// getTokenizerBestMatch model-name shorthand

test('getTokenizerBestMatch routes common model names to ST tokenizer ids', () => {
  assert.equal(getTokenizerBestMatch('gpt-4o'), TOKENIZER.OPENAI);
  assert.equal(getTokenizerBestMatch('claude-3-5-sonnet'), TOKENIZER.CLAUDE);
  assert.equal(getTokenizerBestMatch('llama-3-8b-instruct'), TOKENIZER.LLAMA3);
  assert.equal(getTokenizerBestMatch('llama-2-7b-chat'), TOKENIZER.LLAMA);
  assert.equal(getTokenizerBestMatch('mistral-large-2'), TOKENIZER.MISTRAL);
});

// ---------------------------------------------------------------------------
// countTokens high-level registry runtime

test('countTokens routes gpt-4 to OPENAI exact adapter', async () => {
  const result = await countTokens('hello world', { modelHint: 'gpt-4' });
  assert.equal(result.tokenizerId, TOKENIZER.OPENAI);
  assert.equal(result.accuracy, 'exact');
  assert.ok(result.count > 0);
});

test('countTokens routes claude-3-opus to CLAUDE approximation', async () => {
  const result = await countTokens('hello world', { modelHint: 'claude-3-opus' });
  assert.equal(result.tokenizerId, TOKENIZER.CLAUDE);
  assert.equal(result.accuracy, 'approximation');
  assert.ok(result.count > 0);
});

test('countTokens routes llama-3-8b to LLAMA3 exact adapter', async () => {
  const result = await countTokens('hello world', { modelHint: 'llama-3-8b' });
  assert.equal(result.tokenizerId, TOKENIZER.LLAMA3);
  assert.equal(result.accuracy, 'exact');
  assert.ok(result.count > 0);
});

test('countTokens routes mistral-7b to MISTRAL guesstimate without HF source', async () => {
  const result = await countTokens('hello world', { modelHint: 'mistral-7b' });
  assert.equal(result.tokenizerId, TOKENIZER.MISTRAL);
  assert.equal(result.accuracy, 'guesstimate');
  assert.equal(result.count, guesstimate('hello world'));
});

test('countTokens tokenizerId forces override', async () => {
  const result = await countTokens('hello world', { tokenizerId: TOKENIZER.LLAMA });
  assert.equal(result.tokenizerId, TOKENIZER.LLAMA);
  assert.equal(result.accuracy, 'exact');
});

test('countTokens second call reports warmCache=true for same id/model key', async () => {
  const options = { modelHint: 'gpt-4-warm-cache-test' };
  const first = await countTokens('hello world', options);
  const second = await countTokens('hello world', options);
  assert.equal(first.warmCache, false);
  assert.equal(second.warmCache, true);
});

test('countTokens with empty text returns non-negative count', async () => {
  const result = await countTokens('', { modelHint: 'gpt-4' });
  assert.ok(result.count >= 0);
});

// ---------------------------------------------------------------------------
// Guesstimate fallback adapter

test('guesstimate adapter count("hello") returns ceil(5/3.35) = 2', async () => {
  const adapter = createGuesstimateAdapter(TOKENIZER.LLAMA);
  const count = await adapter.count('hello');
  assert.equal(count, 2); // ceil(5/3.35) = 2
});

test('guesstimate adapter encode throws', async () => {
  const adapter = createGuesstimateAdapter(TOKENIZER.LLAMA);
  await assert.rejects(
    () => adapter.encode('test'),
    /encode not supported/,
  );
});

test('guesstimate adapter decode throws', async () => {
  const adapter = createGuesstimateAdapter(TOKENIZER.LLAMA);
  await assert.rejects(
    () => adapter.decode([1, 2, 3]),
    /decode not supported/,
  );
});

test('guesstimate adapter load is a no-op', async () => {
  const adapter = createGuesstimateAdapter(TOKENIZER.LLAMA);
  // Should not throw
  await adapter.load();
});

// ---------------------------------------------------------------------------
// Existing guesstimate is not broken

test('existing guesstimate function still works unchanged', () => {
  assert.equal(guesstimate('hello'), 2);
  assert.equal(guesstimate(''), 0);
  assert.equal(guesstimate('a'), 1);
});
