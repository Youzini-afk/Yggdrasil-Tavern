import assert from 'node:assert/strict';
import test from 'node:test';

import { buildOpenAIChatRequest, normalizeSamplerSettings } from '../dist/index.js';

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
