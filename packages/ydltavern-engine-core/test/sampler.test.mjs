import assert from 'node:assert/strict';
import test from 'node:test';

import { normalizeSamplerSettings } from '../dist/index.js';

test('sampler normalization handles aliases and pass-through', () => {
  const normalized = normalizeSamplerSettings({
    temp_openai: '0.7',
    top_p_openai: 0.9,
    rep_pen: 1.08,
    freq_pen: '0.2',
    presence_pen: 0.3,
    max_new_tokens: 256.9,
    streaming: 'true',
    stopping_strings: ['END'],
    dynatemp: true,
    grammar: 'root ::= "ok"',
    not_a_st_key: 'ignored',
  });

  assert.equal(normalized.temperature, 0.7);
  assert.equal(normalized.top_p, 0.9);
  assert.equal(normalized.repetition_penalty, 1.08);
  assert.equal(normalized.frequency_penalty, 0.2);
  assert.equal(normalized.presence_penalty, 0.3);
  assert.equal(normalized.max_tokens, 256);
  assert.equal(normalized.stream, true);
  assert.deepEqual(normalized.stop, ['END']);
  assert.deepEqual(normalized.extensions.st_sampler_passthrough, {
    dynatemp: true,
    grammar: 'root ::= "ok"',
  });
});
