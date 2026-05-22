import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildChatRequest,
  emptyStreamState,
  applyStreamChunk,
  isStreamDone,
} from '../dist/index.js';

const baseInput = (overrides = {}) => ({
  source: 'openai',
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'hi' }],
  settings: {
    temp_openai: 0.7,
    top_p_openai: 1,
    openai_max_tokens: 256,
    stream_openai: false,
  },
  ...overrides,
});

test('buildChatRequest emits unified base body for openai', () => {
  const r = buildChatRequest(baseInput());
  assert.equal(r.body.chat_completion_source, 'openai');
  assert.equal(r.body.model, 'gpt-4o');
  assert.equal(r.body.temperature, 0.7);
  assert.equal(r.body.max_tokens, 256);
  assert.equal(r.body.stream, false);
});

test('buildChatRequest renames max_tokens for o1 family and strips unsupported', () => {
  const r = buildChatRequest(baseInput({ model: 'o1-preview' }));
  assert.equal(r.body.max_completion_tokens, 256);
  assert.equal(r.body.max_tokens, undefined);
  assert.equal(r.body.temperature, undefined);
  assert.equal(r.body.top_p, undefined);
  assert.ok(r.diagnostics.stripped.includes('temperature'));
});

test('buildChatRequest converts system→user for o1', () => {
  const r = buildChatRequest(baseInput({
    model: 'o1-mini',
    messages: [{ role: 'system', content: 'sys' }, { role: 'user', content: 'u' }],
  }));
  const msgs = r.body.messages;
  assert.equal(msgs[0].role, 'user');
  assert.equal(msgs[1].role, 'user');
});

test('buildChatRequest disables tools for o1 and gpt-5-chat-latest', () => {
  const r1 = buildChatRequest(baseInput({
    model: 'o1-mini',
    tools: [{ type: 'function', function: { name: 'f' } }],
  }));
  assert.equal(r1.body.tools, undefined);
  const r2 = buildChatRequest(baseInput({
    model: 'gpt-5-chat-latest',
    tools: [{ type: 'function', function: { name: 'f' } }],
  }));
  assert.equal(r2.body.tools, undefined);
});

test('buildChatRequest applies azure_openai fields', () => {
  const r = buildChatRequest(baseInput({
    source: 'azure_openai',
    settings: {
      ...baseInput().settings,
      azure_base_url: 'https://x.azure.com',
      azure_deployment_name: 'dep',
      azure_api_version: '2024-02-01',
    },
  }));
  assert.equal(r.body.azure_base_url, 'https://x.azure.com');
  assert.equal(r.body.azure_deployment_name, 'dep');
});

test('buildChatRequest claude assistant_prefill on continue', () => {
  const r = buildChatRequest(baseInput({
    source: 'claude',
    model: 'claude-3-opus',
    generationType: 'continue',
    settings: { ...baseInput().settings, assistant_prefill: 'PREFILL', top_k: 50, use_sysprompt: true },
  }));
  assert.equal(r.body.top_k, 50);
  assert.equal(r.body.use_sysprompt, true);
});

test('buildChatRequest gemini limits stop strings to 5 and 16 chars', () => {
  const r = buildChatRequest(baseInput({
    source: 'makersuite',
    model: 'gemini-pro',
    settings: {
      ...baseInput().settings,
      stop: ['a', 'bb', 'ccc', 'dddd', 'eeeee', 'extra'],
      top_k: 40,
    },
  }));
  assert.equal(r.body.stop.length, 5);
  assert.equal(r.body.top_k, 40);
});

test('buildChatRequest cohere clamps top_p and freq/pres penalties', () => {
  const r = buildChatRequest(baseInput({
    source: 'cohere',
    settings: {
      ...baseInput().settings,
      top_p_openai: 0.005,
      freq_pen_openai: 2,
      pres_pen_openai: -1,
    },
  }));
  assert.equal(r.body.top_p, 0.01);
  assert.equal(r.body.frequency_penalty, 1);
  assert.equal(r.body.presence_penalty, 0);
});

test('buildChatRequest openrouter provider/quantizations passthrough', () => {
  const r = buildChatRequest(baseInput({
    source: 'openrouter',
    settings: {
      ...baseInput().settings,
      top_k: 40,
      min_p: 0.05,
      openrouter_provider: 'anthropic',
      openrouter_quantizations: ['fp16'],
      openrouter_allow_fallbacks: false,
    },
  }));
  assert.equal(r.body.provider, 'anthropic');
  assert.deepEqual(r.body.quantizations, ['fp16']);
  assert.equal(r.body.allow_fallbacks, false);
});

test('buildChatRequest perplexity strips stop', () => {
  const r = buildChatRequest(baseInput({
    source: 'perplexity',
    settings: { ...baseInput().settings, stop: ['x'], top_k: 30 },
  }));
  assert.equal(r.body.stop, undefined);
  assert.equal(r.body.top_k, 30);
});

test('buildChatRequest groq strips logprobs/logit_bias/top_logprobs/n', () => {
  const r = buildChatRequest(baseInput({
    source: 'groq',
    settings: { ...baseInput().settings, n: 2, logit_bias: { '1': 1 } },
  }));
  assert.equal(r.body.n, undefined);
  assert.equal(r.body.logit_bias, undefined);
  assert.ok(r.diagnostics.stripped.includes('n'));
});

test('buildChatRequest deepseek forces top_p>0 and maps reasoning auto→omit', () => {
  const r = buildChatRequest(baseInput({
    source: 'deepseek',
    model: 'deepseek-reasoner',
    settings: { ...baseInput().settings, top_p_openai: 0, reasoning_effort: 'auto' },
  }));
  assert.ok(r.body.top_p > 0);
  assert.equal(r.body.reasoning_effort, undefined);
});

test('buildChatRequest xai grok-3-mini strips penalties+stop', () => {
  const r = buildChatRequest(baseInput({
    source: 'xai',
    model: 'grok-3-mini',
    settings: {
      ...baseInput().settings,
      stop: ['x'],
      freq_pen_openai: 0.5,
      pres_pen_openai: 0.5,
    },
  }));
  assert.equal(r.body.stop, undefined);
  assert.equal(r.body.frequency_penalty, undefined);
});

test('buildChatRequest xai non-grok-3-mini strips reasoning_effort', () => {
  const r = buildChatRequest(baseInput({
    source: 'xai',
    model: 'grok-2',
    settings: { ...baseInput().settings, reasoning_effort: 'high' },
  }));
  assert.equal(r.body.reasoning_effort, undefined);
});

test('buildChatRequest mistral sets safe_prompt=false', () => {
  const r = buildChatRequest(baseInput({ source: 'mistralai' }));
  assert.equal(r.body.safe_prompt, false);
});

test('buildChatRequest custom passes custom_url and headers', () => {
  const r = buildChatRequest(baseInput({
    source: 'custom',
    settings: {
      ...baseInput().settings,
      custom_url: 'https://my-gw',
      custom_include_body: '{"x":1}',
    },
  }));
  assert.equal(r.body.custom_url, 'https://my-gw');
  assert.equal(r.body.custom_include_body, '{"x":1}');
});

test('buildChatRequest sanitizes openai message names', () => {
  const r = buildChatRequest(baseInput({
    source: 'openai',
    messages: [{ role: 'user', content: 'hi', name: 'Alice Smith!' }],
  }));
  assert.equal(r.body.messages[0].name, 'Alice_Smith_');
});

test('buildChatRequest tools with default tool_choice=auto', () => {
  const r = buildChatRequest(baseInput({
    tools: [{ type: 'function', function: { name: 'f', parameters: {} } }],
  }));
  assert.equal(r.body.tool_choice, 'auto');
});

test('buildChatRequest workers_ai caps top_k and removes n+logit_bias', () => {
  const r = buildChatRequest(baseInput({
    source: 'workers_ai',
    settings: {
      ...baseInput().settings,
      top_k: 200,
      n: 3,
      logit_bias: { '1': 1 },
      workers_ai_account_id: 'acc',
    },
  }));
  assert.equal(r.body.top_k, 50);
  assert.equal(r.body.n, undefined);
  assert.equal(r.body.logit_bias, undefined);
  assert.equal(r.body.workers_ai_account_id, 'acc');
});

test('buildChatRequest moonshot kimi-k2.5 strips temperature/top_p/penalties', () => {
  const r = buildChatRequest(baseInput({
    source: 'moonshot',
    model: 'kimi-k2.5-test',
  }));
  assert.equal(r.body.temperature, undefined);
  assert.equal(r.body.top_p, undefined);
  assert.equal(r.body.frequency_penalty, undefined);
});

test('buildChatRequest minimax clamps temperature to (0,1]', () => {
  const r = buildChatRequest(baseInput({
    source: 'minimax',
    settings: { ...baseInput().settings, temp_openai: 2 },
  }));
  assert.equal(r.body.temperature, 1);
});

test('buildChatRequest zai limits stop to 1, clamps top_p, strips penalties', () => {
  const r = buildChatRequest(baseInput({
    source: 'zai',
    settings: {
      ...baseInput().settings,
      stop: ['a', 'b', 'c'],
      top_p_openai: 0.005,
      freq_pen_openai: 1,
    },
  }));
  assert.equal(r.body.stop.length, 1);
  assert.equal(r.body.top_p, 0.01);
  assert.equal(r.body.frequency_penalty, undefined);
});

test('isStreamDone detects [DONE] terminator', () => {
  assert.equal(isStreamDone('[DONE]'), true);
  assert.equal(isStreamDone(' [DONE] '), true);
  assert.equal(isStreamDone('foo'), false);
});

test('applyStreamChunk OpenAI delta accumulates content', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'openai', { choices: [{ index: 0, delta: { content: 'Hel' } }] });
  applyStreamChunk(state, 'openai', { choices: [{ index: 0, delta: { content: 'lo' } }] });
  assert.equal(state.text, 'Hello');
});

test('applyStreamChunk multi-swipe routes index>0 into swipes array', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'openai', { choices: [{ index: 1, delta: { content: 'sw1-a' } }] });
  applyStreamChunk(state, 'openai', { choices: [{ index: 2, delta: { content: 'sw2' } }] });
  applyStreamChunk(state, 'openai', { choices: [{ index: 1, delta: { content: '-b' } }] });
  assert.equal(state.swipes[0], 'sw1-a-b');
  assert.equal(state.swipes[1], 'sw2');
});

test('applyStreamChunk DeepSeek reasoning_content accumulates into reasoning', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'deepseek', { choices: [{ index: 0, delta: { reasoning_content: 'thinking', content: 'answer' } }] });
  assert.equal(state.reasoning, 'thinking');
  assert.equal(state.text, 'answer');
});

test('applyStreamChunk Claude thinking field maps to reasoning', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'claude', { choices: [{ index: 0, delta: { thinking: 'thought', text: 'output' } }] });
  assert.equal(state.reasoning, 'thought');
  assert.equal(state.text, 'output');
});

test('applyStreamChunk Gemini parts route thought vs text', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'makersuite', {
    candidates: [{ content: { parts: [
      { thought: true, text: 'reasoned', thoughtSignature: 'sig123' },
      { text: 'visible' },
    ] } }],
  });
  assert.equal(state.reasoning, 'reasoned');
  assert.equal(state.text, 'visible');
  assert.equal(state.signature, 'sig123');
});

test('applyStreamChunk OpenRouter reasoning_details maps via reasoning fallback', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'openrouter', { choices: [{ index: 0, delta: { reasoning: 'r-think', content: 'main' } }] });
  assert.equal(state.reasoning, 'r-think');
  assert.equal(state.text, 'main');
});

test('applyStreamChunk Mistral nested content blocks accumulate', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'mistralai', {
    choices: [{ index: 0, delta: { content: [{ text: 'block-a' }, { text: 'block-b' }] } }],
  });
  assert.equal(state.text, 'block-ablock-b');
});

test('applyStreamChunk merges streamed tool_calls by index', () => {
  const state = emptyStreamState();
  applyStreamChunk(state, 'openai', {
    choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: 'call1', function: { name: 'foo', arguments: '{"a"' } }] } }],
  });
  applyStreamChunk(state, 'openai', {
    choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: ':1}' } }] } }],
  });
  assert.equal(state.toolCalls[0].id, 'call1');
  assert.equal(state.toolCalls[0].name, 'foo');
  assert.equal(state.toolCalls[0].arguments, '{"a":1}');
});

test('buildChatRequest reasoning_effort for openai gpt-5.4 maps min→none', () => {
  const r = buildChatRequest(baseInput({
    model: 'gpt-5.4-mini',
    settings: { ...baseInput().settings, reasoning_effort: 'min' },
  }));
  assert.equal(r.body.reasoning_effort, 'none');
});

test('buildChatRequest reasoning_effort for openai gpt-4o maps min→low', () => {
  const r = buildChatRequest(baseInput({
    model: 'gpt-4o',
    settings: { ...baseInput().settings, reasoning_effort: 'min' },
  }));
  assert.equal(r.body.reasoning_effort, 'low');
});

test('buildChatRequest reasoning_effort for custom maps min→minimal max→xhigh', () => {
  const a = buildChatRequest(baseInput({
    source: 'custom',
    settings: { ...baseInput().settings, reasoning_effort: 'min' },
  }));
  assert.equal(a.body.reasoning_effort, 'minimal');
  const b = buildChatRequest(baseInput({
    source: 'custom',
    settings: { ...baseInput().settings, reasoning_effort: 'max' },
  }));
  assert.equal(b.body.reasoning_effort, 'xhigh');
});
