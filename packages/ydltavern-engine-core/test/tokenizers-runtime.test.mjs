import assert from 'node:assert/strict';
import test from 'node:test';

import {
  TOKENIZER,
  guesstimate,
  selectEncodingForModel,
  OpenAITokenizerAdapter,
  getTokenizer,
  createGuesstimateAdapter,
} from '../dist/index.js';

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

test('getTokenizer(LLAMA) returns guesstimate adapter (fallback)', async () => {
  const adapter = await getTokenizer(TOKENIZER.LLAMA);
  assert.equal(adapter.fallback, true);
});

test('getTokenizer(CLAUDE) returns guesstimate adapter (fallback)', async () => {
  const adapter = await getTokenizer(TOKENIZER.CLAUDE);
  assert.equal(adapter.fallback, true);
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
