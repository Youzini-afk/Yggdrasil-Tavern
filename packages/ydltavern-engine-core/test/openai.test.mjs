import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { buildOpenAIChatRequest, buildPrompt, mapSTSamplerToOpenAI, normalizeSamplerSettings } from '../dist/index.js';

const fixturesUrl = new URL('./fixtures/', import.meta.url);

test('OpenAI request builder maps sampler fields and stream', () => {
  const sampler = normalizeSamplerSettings({
    temperature: 0.4,
    top_p: 0.95,
    max_tokens: 123,
    stream: false,
  });

  const request = buildOpenAIChatRequest({
    model: 'gpt-test',
    messages: [{ role: 'user', content: 'Hello' }],
    sampler,
    stream: true,
  });

  assert.deepEqual(request, {
    model: 'gpt-test',
    messages: [{ role: 'user', content: 'Hello' }],
    temperature: 0.4,
    top_p: 0.95,
    max_tokens: 123,
    stream: true,
  });
});

test('OpenAI request builder rejects empty model', () => {
  assert.throws(
    () => buildOpenAIChatRequest({ model: '  ', messages: [{ role: 'user', content: 'Hello' }] }),
    /model must be a non-empty string/,
  );
});

test('alignment fixture keeps sampler aliases and unsupported passthrough stable', async () => {
  const preset = await readJsonFixture('openai-preset.json');
  const normalized = normalizeSamplerSettings(preset);
  const mapped = mapSTSamplerToOpenAI(normalized);

  assert.deepEqual(mapped.request, {
    temperature: 0.65,
    top_p: 0.92,
    frequency_penalty: 0.15,
    presence_penalty: 0.25,
    max_tokens: 320,
    stream: false,
    stop: ['<|im_end|>', '###'],
  });
  assert.deepEqual(mapped.diagnostics.unsupportedFields, ['top_k', 'min_p', 'repetition_penalty']);
  assert.deepEqual(mapped.diagnostics.unsupportedPassthrough, {
    dynatemp: true,
    grammar: 'root ::= "ok"',
    reasoning_effort: 'low',
  });
});

test('alignment fixture builds expected OpenAI chat request shape', async () => {
  const [preset, blocks, chat, expected] = await Promise.all([
    readJsonFixture('openai-preset.json'),
    readJsonFixture('prompt-blocks.json'),
    readJsonFixture('chat.json'),
    readJsonFixture('expected-openai-request.json'),
  ]);
  const prompt = buildPrompt(blocks, chat, { mode: 'chat' });
  const request = buildOpenAIChatRequest({
    model: preset.model,
    messages: prompt.messages,
    sampler: normalizeSamplerSettings(preset),
  });

  assert.deepEqual(request, expected);
});

async function readJsonFixture(name) {
  const fixture = await readFile(new URL(name, fixturesUrl), 'utf8');
  return JSON.parse(fixture);
}
