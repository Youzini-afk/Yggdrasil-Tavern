import assert from 'node:assert/strict';
import test from 'node:test';

import { buildTextCompletionRequest, normalizeSamplerSettings } from '../dist/index.js';

test('text completion builder maps textgen request fields and diagnostics', () => {
  const sampler = normalizeSamplerSettings({
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    frequency_penalty: 0.2,
    max_new_tokens: 128,
    stream: true,
    stopping_strings: ['END'],
    grammar: 'root ::= "ok"',
  });

  const result = buildTextCompletionRequest({
    provider: 'textgen',
    prompt: 'Hello',
    sampler,
    stopStrings: ['STOP'],
    max_context: 2048,
    max_response: 64,
    stream: false,
  });

  assert.deepEqual(result.request, {
    prompt: 'Hello',
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    max_context_length: 2048,
    max_new_tokens: 64,
    stream: false,
    stopping_strings: ['END', 'STOP'],
  });
  assert.deepEqual(result.diagnostics.unsupportedSamplerFields, ['frequency_penalty']);
  assert.deepEqual(result.diagnostics.unsupportedPassthrough, { grammar: 'root ::= "ok"' });
  assert.deepEqual(result.diagnostics.droppedSamplerFields, ['max_tokens', 'stream', 'stop']);
});

test('text completion builder nests ollama options', () => {
  const sampler = normalizeSamplerSettings({ temperature: 0.2, rep_pen: 1.1, num_predict: 32 });

  const result = buildTextCompletionRequest({
    provider: 'ollama',
    model: 'llama3',
    prompt: 'Say hi',
    sampler,
    maxContext: 4096,
  });

  assert.deepEqual(result.request, {
    model: 'llama3',
    prompt: 'Say hi',
    options: {
      temperature: 0.2,
      repeat_penalty: 1.1,
      num_ctx: 4096,
      num_predict: 32,
    },
  });
});
