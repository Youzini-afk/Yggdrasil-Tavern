import assert from 'node:assert/strict';
import test from 'node:test';

import { cancelledStreamFrame, normalizeOllamaStreamFrame, normalizeOpenAIChatStreamFrame, normalizeTextCompletionStreamFrame } from '../dist/index.js';

test('openai-compatible chat stream delta normalizes content, reasoning, tools, and end', () => {
  const frames = normalizeOpenAIChatStreamFrame({
    id: 'cmpl',
    model: 'model',
    choices: [{ delta: { content: 'hi', reasoning_content: 'think', tool_calls: [{ id: 'tool' }] }, finish_reason: 'stop' }],
  });

  assert.deepEqual(frames, [
    { type: 'start', id: 'cmpl', model: 'model' },
    { type: 'delta', text: 'hi', index: 0 },
    { type: 'reasoning_delta', text: 'think', index: 0 },
    { type: 'tool_call_delta', toolCall: [{ id: 'tool' }], index: 0 },
    { type: 'end', reason: 'stop' },
  ]);
});

test('text and ollama stream adapters normalize deltas and end frames', () => {
  assert.deepEqual(normalizeTextCompletionStreamFrame({ choices: [{ text: 'hello' }] }), [
    { type: 'delta', text: 'hello', index: 0 },
  ]);
  assert.deepEqual(normalizeOllamaStreamFrame({ response: 'hi', thinking: 'why', done: true, done_reason: 'stop', eval_count: 2 }), [
    { type: 'delta', text: 'hi' },
    { type: 'reasoning_delta', text: 'why' },
    { type: 'end', reason: 'stop', usage: { eval_count: 2 } },
  ]);
  assert.deepEqual(cancelledStreamFrame('user'), { type: 'cancelled', reason: 'user' });
});
