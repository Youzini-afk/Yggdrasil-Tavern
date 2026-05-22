import assert from 'node:assert/strict';
import test from 'node:test';

import { buildModelCallPlan, consumeModelStreamFrames } from '../dist/index.js';

test('model call plan rejects raw API key-like profile values and request headers', () => {
  assert.throws(
    () => buildModelCallPlan({
      profile: { provider: 'openai', model: 'sk-secretvalue123', secretRef: 'vault:openai', mode: 'chat' },
      requestShape: { messages: [] },
    }),
    /raw API key-like value/u,
  );

  assert.throws(
    () => buildModelCallPlan({
      profile: { provider: 'openai', model: 'gpt-test', secretRef: 'vault:openai', mode: 'chat' },
      requestShape: { headers: { authorization: 'Bearer rawtoken123456' }, messages: [] },
    }),
    /request header authorization/u,
  );
});

test('model call plan requires secretRef for live providers', () => {
  assert.throws(
    () => buildModelCallPlan({
      profile: { provider: 'openai', model: 'gpt-test', mode: 'chat' },
      requestShape: { messages: [] },
    }),
    /secretRef is required/u,
  );
});

test('model call plan allows fake-local without secretRef and remains plan-only', () => {
  const plan = buildModelCallPlan({
    profile: { provider: 'fake-local', model: 'fake-model', mode: 'text', stream: true },
    requestShape: { prompt: 'hello' },
  });

  assert.equal(plan.live, false);
  assert.equal(plan.requiresHostExecution, true);
  assert.equal(plan.network, false);
  assert.equal(plan.stream, true);
  assert.equal(plan.envelope.method, 'kernel.outbound.execute');
  assert.equal(plan.envelope.destination_host, 'fake-local');
  assert.deepEqual(plan.envelope.secret_refs, []);
  assert.deepEqual(plan.envelope.request, { prompt: 'hello' });
});

test('model stream consumer assembles normalized frames', () => {
  const consumed = consumeModelStreamFrames([
    { type: 'start', id: 'cmpl', model: 'fake' },
    { type: 'reasoning_delta', text: 'think ' },
    { type: 'delta', text: 'hel' },
    { type: 'delta', text: 'lo' },
    { type: 'tool_call_delta', toolCall: { id: 'tool' } },
    { type: 'progress', progress: { step: 1 } },
    { type: 'error', error: 'warn', detail: { recoverable: true } },
    { type: 'end', reason: 'stop', usage: { tokens: 2 } },
  ]);

  assert.equal(consumed.text, 'hello');
  assert.equal(consumed.reasoning, 'think ');
  assert.deepEqual(consumed.toolCalls, [{ id: 'tool' }]);
  assert.deepEqual(consumed.errors, [{ error: 'warn', detail: { recoverable: true } }]);
  assert.equal(consumed.ended, true);
  assert.equal(consumed.cancelled, false);
  assert.equal(consumed.finishReason, 'stop');
  assert.deepEqual(consumed.usage, { tokens: 2 });
  assert.equal(consumed.summary.toolCallCount, 1);
  assert.equal(consumed.framesConsumed, 8);
});
