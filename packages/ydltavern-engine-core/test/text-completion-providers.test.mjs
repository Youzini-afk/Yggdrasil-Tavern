import assert from 'node:assert/strict';
import test from 'node:test';

import {
  resolveTextGenServer,
  buildTextRequest,
  emptyTextStreamState,
  applyTextStreamChunk,
  HORDE_MIN_LENGTH,
  HORDE_MAX_RETRIES,
  planHordeJob,
} from '../dist/index.js';

test('resolveTextGenServer returns fixed server for mancer/togetherai/openrouter', () => {
  assert.equal(resolveTextGenServer('mancer'), 'https://neuro.mancer.tech');
  assert.equal(resolveTextGenServer('togetherai'), 'https://api.together.xyz');
  assert.equal(resolveTextGenServer('openrouter'), 'https://openrouter.ai/api');
  assert.equal(resolveTextGenServer('featherless'), 'https://api.featherless.ai/v1');
});

test('resolveTextGenServer falls back to server_urls for ooba/llamacpp', () => {
  const urls = { ooba: 'http://localhost:5000', llamacpp: 'http://localhost:8080' };
  assert.equal(resolveTextGenServer('ooba', urls), 'http://localhost:5000');
  assert.equal(resolveTextGenServer('llamacpp', urls), 'http://localhost:8080');
  assert.equal(resolveTextGenServer('ooba'), undefined);
});

const baseTextInput = (overrides = {}) => ({
  source: 'ooba',
  prompt: 'Once upon a time',
  settings: {
    max_new_tokens: 200,
    temperature: 0.8,
    top_p: 0.9,
    top_k: 40,
    repetition_penalty: 1.1,
  },
  ...overrides,
});

test('buildTextRequest emits unified base body', () => {
  const r = buildTextRequest(baseTextInput());
  assert.equal(r.body.api_type, 'ooba');
  assert.equal(r.body.prompt, 'Once upon a time');
  assert.equal(r.body.max_new_tokens, 200);
  assert.equal(r.body.max_tokens, 200);
  assert.equal(r.body.temperature, 0.8);
  assert.equal(r.body.top_p, 0.9);
  assert.equal(r.body.repetition_penalty, 1.1);
});

test('buildTextRequest emits both stopping_strings and stop', () => {
  const r = buildTextRequest(baseTextInput({
    settings: { ...baseTextInput().settings, stopping_strings: ['<|end|>', 'STOP'] },
  }));
  assert.deepEqual(r.body.stopping_strings, ['<|end|>', 'STOP']);
  assert.deepEqual(r.body.stop, ['<|end|>', 'STOP']);
});

test('buildTextRequest ooba passes ooba-specific samplers', () => {
  const r = buildTextRequest(baseTextInput({
    settings: {
      ...baseTextInput().settings,
      rep_pen_range: 1024,
      penalty_alpha: 0.5,
      do_sample: true,
      temperature_last: true,
      sampler_priority: ['temperature', 'top_p'],
    },
  }));
  assert.equal(r.body.rep_pen_range, 1024);
  assert.equal(r.body.penalty_alpha, 0.5);
  assert.equal(r.body.do_sample, true);
  assert.equal(r.body.temperature_last, true);
  assert.deepEqual(r.body.sampler_priority, ['temperature', 'top_p']);
});

test('buildTextRequest koboldcpp passes grammar/dry/trim_stop', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'koboldcpp',
    settings: {
      ...baseTextInput().settings,
      grammar: 'root ::= "yes" | "no"',
      grammar_retain_state: true,
      trim_stop: true,
      dry_sequence_breakers: ['\n', '.'],
    },
  }));
  assert.equal(r.body.grammar, 'root ::= "yes" | "no"');
  assert.equal(r.body.grammar_retain_state, true);
  assert.equal(r.body.trim_stop, true);
  assert.deepEqual(r.body.dry_sequence_breakers, ['\n', '.']);
});

test('buildTextRequest llamacpp aliases repetition_penalty→repeat_penalty and max_new_tokens→n_predict', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'llamacpp',
    settings: {
      ...baseTextInput().settings,
      repetition_penalty: 1.15,
      rep_pen_range: 64,
      mirostat: 2,
      logprobs: 5,
      cache_prompt: true,
    },
  }));
  assert.equal(r.body.repeat_penalty, 1.15);
  assert.equal(r.body.repeat_last_n, 64);
  assert.equal(r.body.n_predict, 200);
  assert.equal(r.body.mirostat, 2);
  assert.equal(r.body.n_probs, 5);
  assert.equal(r.body.cache_prompt, true);
});

test('buildTextRequest ollama notes missing model and aliases num_predict', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'ollama',
    settings: { ...baseTextInput().settings, num_ctx: 2048 },
  }));
  assert.equal(r.body.num_predict, 200);
  assert.equal(r.body.num_ctx, 2048);
  assert.ok(r.diagnostics.notes.some((n) => n.includes('ollama')));
});

test('buildTextRequest vllm passes n/ignore_eos/seed', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'vllm',
    settings: {
      ...baseTextInput().settings,
      n: 4,
      ignore_eos: true,
      spaces_between_special_tokens: false,
      seed: 12345,
    },
  }));
  assert.equal(r.body.n, 4);
  assert.equal(r.body.ignore_eos, true);
  assert.equal(r.body.spaces_between_special_tokens, false);
  assert.equal(r.body.seed, 12345);
});

test('buildTextRequest aphrodite passes guided_json/dynatemp/early_stopping=false', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'aphrodite',
    settings: {
      ...baseTextInput().settings,
      guided_json: { type: 'object' },
      dynatemp_min: 0.5,
      dynatemp_max: 1.5,
      dynatemp_exponent: 1,
      tfs: 0.95,
      smoothing_factor: 0.3,
    },
  }));
  assert.deepEqual(r.body.guided_json, { type: 'object' });
  assert.equal(r.body.dynatemp_min, 0.5);
  assert.equal(r.body.dynatemp_max, 1.5);
  assert.equal(r.body.tfs, 0.95);
  assert.equal(r.body.smoothing_factor, 0.3);
  assert.equal(r.body.early_stopping, false);
  assert.equal(r.body.include_stop_str_in_output, false);
});

test('buildTextRequest mancer scales epsilon_cutoff/eta_cutoff by 1000', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'mancer',
    settings: {
      ...baseTextInput().settings,
      epsilon_cutoff: 100,
      eta_cutoff: 200,
      dynatemp_mode: 'auto',
    },
  }));
  assert.equal(r.body.epsilon_cutoff, 0.1);
  assert.equal(r.body.eta_cutoff, 0.2);
  assert.equal(r.body.dynatemp_mode, 'auto');
});

test('buildTextRequest openrouter text passes provider/quantizations/allow_fallbacks', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'openrouter',
    settings: {
      ...baseTextInput().settings,
      provider: 'anthropic',
      quantizations: ['fp16'],
      allow_fallbacks: false,
    },
  }));
  assert.equal(r.body.provider, 'anthropic');
  assert.deepEqual(r.body.quantizations, ['fp16']);
  assert.equal(r.body.allow_fallbacks, false);
});

test('buildTextRequest huggingface clamps top_p < 0.999', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'huggingface',
    settings: { ...baseTextInput().settings, top_p: 1 },
  }));
  assert.equal(r.body.top_p, 0.999);
});

test('buildTextRequest dreamgen passes minimum_message_content_tokens', () => {
  const r = buildTextRequest(baseTextInput({
    source: 'dreamgen',
    settings: { ...baseTextInput().settings, minimum_message_content_tokens: 50 },
  }));
  assert.equal(r.body.minimum_message_content_tokens, 50);
});

test('applyTextStreamChunk handles llama.cpp main content', () => {
  const state = emptyTextStreamState();
  applyTextStreamChunk(state, { content: 'Hel' });
  applyTextStreamChunk(state, { content: 'lo' });
  assert.equal(state.text, 'Hello');
});

test('applyTextStreamChunk handles llama.cpp data.index swipe', () => {
  const state = emptyTextStreamState();
  applyTextStreamChunk(state, { index: 1, content: 'sw1-a' });
  applyTextStreamChunk(state, { index: 1, content: '-b' });
  applyTextStreamChunk(state, { index: 2, content: 'sw2' });
  assert.equal(state.swipes[0], 'sw1-a-b');
  assert.equal(state.swipes[1], 'sw2');
});

test('applyTextStreamChunk handles choices[0].text and reasoning', () => {
  const state = emptyTextStreamState();
  applyTextStreamChunk(state, { choices: [{ index: 0, text: 'main', reasoning: 'thinking' }] });
  assert.equal(state.text, 'main');
  assert.equal(state.reasoning, 'thinking');
});

test('applyTextStreamChunk handles thinking field', () => {
  const state = emptyTextStreamState();
  applyTextStreamChunk(state, { choices: [{ index: 0, text: 'x', thinking: 'reasoned' }] });
  assert.equal(state.reasoning, 'reasoned');
});

test('planHordeJob enforces MIN_LENGTH and exposes constants', () => {
  assert.equal(HORDE_MIN_LENGTH, 16);
  assert.equal(HORDE_MAX_RETRIES, 480);

  const plan = planHordeJob({
    prompt: 'hi',
    params: { max_length: 5 },
    trustedWorkers: true,
    models: ['llama-3-70b'],
  });
  assert.equal(plan.request.params.max_length, 16);
  assert.equal(plan.request.trusted_workers, true);
  assert.deepEqual(plan.request.models, ['llama-3-70b']);
  assert.equal(plan.maxRetries, 480);
});

test('planHordeJob keeps params.max_length when above MIN_LENGTH', () => {
  const plan = planHordeJob({ prompt: 'x', params: { max_length: 100 } });
  assert.equal(plan.request.params.max_length, 100);
});
