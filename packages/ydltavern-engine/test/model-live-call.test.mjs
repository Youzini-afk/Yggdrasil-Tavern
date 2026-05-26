import assert from "node:assert/strict";
import test from "node:test";

import {
  MODEL_LIVE_CALL_ID,
  MODEL_LIVE_CALL_STREAM_ID,
  modelLiveCallStream,
  modelLiveCallUnary,
} from "../dist/capabilities/model-live-call.js";

const baseInput = (overrides = {}) => ({
  source: "openai",
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "Hello" }],
  settings: {
    temp_openai: 0.7,
    stream_openai: false,
    user_name: "User",
    char_name: "Assistant",
    show_thoughts: true,
    custom_url: "https://evil.example/v1",
    reverse_proxy: "https://proxy.example/v1",
  },
  stream: false,
  secret_ref: "secret_ref:env:OPENAI_API_KEY",
  ...overrides,
});

const forbiddenProviderBodyKeys = [
  "chat_completion_source",
  "user_name",
  "char_name",
  "include_reasoning",
  "custom_url",
  "reverse_proxy",
];

class MockKernelClient {
  sendCalls = [];
  streamCalls = [];
  nextResponse = {
    status: "ok",
    body_shape: {
      choices: [{ message: { content: "pong", reasoning_content: "because", tool_calls: [{ id: "tool_1" }] } }],
      usage: { prompt_tokens: 2, completion_tokens: 3, total_tokens: 5 },
    },
    redaction_state: "redacted",
    network_performed: true,
    executor_kind: "fake",
  };
  cancelled = false;

  async sendKernelRequest(method, params) {
    this.sendCalls.push({ method, params });
    return this.nextResponse;
  }

  streamKernelRequest(method, params, callbacks) {
    const call = { method, params, callbacks };
    this.streamCalls.push(call);
    return {
      cancel: () => {
        this.cancelled = true;
      },
    };
  }
}

test("unary OpenAI builds outbound execute params and extracts response", async () => {
  const kernel = new MockKernelClient();
  const output = await modelLiveCallUnary(baseInput(), kernel, MODEL_LIVE_CALL_ID);

  assert.equal(kernel.sendCalls.length, 1);
  const { method, params } = kernel.sendCalls[0];
  assert.equal(method, "kernel.v1.outbound.execute");
  assert.equal(params.capability_id, MODEL_LIVE_CALL_ID);
  assert.equal(params.destination_host, "api.openai.com");
  assert.equal(params.method, "POST");
  assert.equal(params.path, "/v1/chat/completions");
  assert.deepEqual(params.secret_headers, {
    Authorization: { secret_ref: "secret_ref:env:OPENAI_API_KEY", scheme: "bearer" },
  });
  assert.deepEqual(params.secret_refs, ["secret_ref:env:OPENAI_API_KEY"]);
  assert.deepEqual(Object.keys(params.body_shape), [
    "model",
    "messages",
    "temperature",
    "top_p",
    "frequency_penalty",
    "presence_penalty",
    "max_tokens",
    "stream",
  ]);
  assert.equal(params.body_shape.model, "gpt-4o-mini");
  assert.deepEqual(params.body_shape.messages, [{ role: "user", content: "Hello" }]);
  assert.equal(params.body_shape.stream, false);
  assert.equal(params.body_shape.temperature, 0.7);
  assertNoForbiddenProviderBodyKeys(params.body_shape);

  assert.equal(output.status, "ok");
  assert.equal(output.text, "pong");
  assert.equal(output.reasoning, "because");
  assert.deepEqual(output.tool_calls, [{ id: "tool_1" }]);
  assert.deepEqual(output.usage, { prompt_tokens: 2, completion_tokens: 3, total_tokens: 5 });
  assert.equal(output.redaction_state, "redacted");
  assert.equal(output.network_performed, true);
});

test("unary Anthropic uses x-api-key header, version header, and messages path", async () => {
  const kernel = new MockKernelClient();
  kernel.nextResponse = {
    status: "ok",
    body_shape: {
      content: [{ type: "text", text: "hello" }, { type: "tool_use", id: "toolu_1" }],
      usage: { input_tokens: 4, output_tokens: 6 },
    },
    redaction_state: "redacted",
  };

  const output = await modelLiveCallUnary(
    baseInput({
      source: "anthropic",
      model: "claude-3-5-sonnet",
      secret_ref: "secret_ref:env:ANTHROPIC_API_KEY",
      messages: [
        { role: "system", content: "You are concise." },
        { role: "user", content: "Hello" },
        { role: "assistant", content: "Hi" },
      ],
    }),
    kernel,
    MODEL_LIVE_CALL_ID,
  );
  const params = kernel.sendCalls[0].params;
  assert.equal(params.destination_host, "api.anthropic.com");
  assert.equal(params.path, "/v1/messages");
  assert.deepEqual(params.secret_headers, { "x-api-key": { secret_ref: "secret_ref:env:ANTHROPIC_API_KEY" } });
  assert.equal(params.static_headers["anthropic-version"], "2023-06-01");
  assert.equal(params.static_headers["content-type"], "application/json");
  assert.deepEqual(params.body_shape, {
    model: "claude-3-5-sonnet",
    messages: [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi" },
    ],
    max_tokens: 300,
    stream: false,
    system: "You are concise.",
    temperature: 0.7,
    top_p: 1,
  });
  assertNoForbiddenProviderBodyKeys(params.body_shape);
  assert.equal(params.body_shape.messages.some((message) => message.role === "system"), false);
  assert.equal(output.text, "hello");
  assert.deepEqual(output.usage, { prompt_tokens: 4, completion_tokens: 6, total_tokens: 10 });
  assert.equal(output.tool_calls.length, 1);
});

test("unary DeepSeek uses bearer auth and chat completions path", async () => {
  const kernel = new MockKernelClient();
  await modelLiveCallUnary(
    baseInput({ source: "deepseek", model: "deepseek-chat", secret_ref: "secret_ref:env:DEEPSEEK_API_KEY" }),
    kernel,
    MODEL_LIVE_CALL_ID,
  );
  const params = kernel.sendCalls[0].params;
  assert.equal(params.destination_host, "api.deepseek.com");
  assert.equal(params.path, "/v1/chat/completions");
  assert.deepEqual(params.secret_headers, {
    Authorization: { secret_ref: "secret_ref:env:DEEPSEEK_API_KEY", scheme: "bearer" },
  });
  assertNoForbiddenProviderBodyKeys(params.body_shape);
});

test("unary OpenRouter uses OpenAI-compatible final body", async () => {
  const kernel = new MockKernelClient();
  await modelLiveCallUnary(
    baseInput({ source: "openrouter", model: "openai/gpt-4o-mini", secret_ref: "secret_ref:env:OPENROUTER_API_KEY" }),
    kernel,
    MODEL_LIVE_CALL_ID,
  );
  const params = kernel.sendCalls[0].params;
  assert.equal(params.destination_host, "openrouter.ai");
  assert.equal(params.path, "/api/v1/chat/completions");
  assert.equal(params.body_shape.model, "openai/gpt-4o-mini");
  assert.deepEqual(params.body_shape.messages, [{ role: "user", content: "Hello" }]);
  assert.equal(params.body_shape.stream, false);
  assertNoForbiddenProviderBodyKeys(params.body_shape);
});

test("streaming sends SSE outbound params and accumulates final text", () => {
  const kernel = new MockKernelClient();
  const frames = [];
  modelLiveCallStream(baseInput({ stream: true, settings: { stream_openai: true } }), kernel, MODEL_LIVE_CALL_STREAM_ID, (frame) => frames.push(frame));

  assert.equal(kernel.streamCalls.length, 1);
  const call = kernel.streamCalls[0];
  assert.equal(call.method, "kernel.v1.outbound.stream");
  assert.equal(call.params.capability_id, MODEL_LIVE_CALL_STREAM_ID);
  assert.equal(call.params.stream_format, "sse");
  assert.equal(call.params.body_shape.stream, true);
  assertNoForbiddenProviderBodyKeys(call.params.body_shape);

  call.callbacks.onChunk({ data: JSON.stringify({ choices: [{ delta: { content: "po" } }] }) });
  call.callbacks.onChunk({ chunk_shape: { data: JSON.stringify({ choices: [{ delta: { content: "ng" } }] }) } });
  call.callbacks.onChunk({ data: "[DONE]" });
  call.callbacks.onEnd({});

  assert.deepEqual(frames.map((frame) => frame.kind), ["chunk", "chunk", "final"]);
  assert.equal(frames[0].delta_text, "po");
  assert.equal(frames[1].delta_text, "ng");
  assert.equal(frames[2].text, "pong");
});

test("streaming handle cancel wires to kernel handle", () => {
  const kernel = new MockKernelClient();
  const handle = modelLiveCallStream(baseInput({ stream: true, settings: { stream_openai: true } }), kernel, MODEL_LIVE_CALL_STREAM_ID, () => {});
  handle.cancel();
  assert.equal(kernel.cancelled, true);
});

test("unknown source throws unsupported clearly", async () => {
  const kernel = new MockKernelClient();
  await assert.rejects(
    () => modelLiveCallUnary(baseInput({ source: "custom" }), kernel, MODEL_LIVE_CALL_ID),
    /Unsupported live_call source=custom/,
  );
});

test("baseUrl destination override fields are ignored", async () => {
  const kernel = new MockKernelClient();
  await modelLiveCallUnary(
    baseInput({
      destination_host_override: "evil.example",
      api_path_override: "/steal",
    }),
    kernel,
    MODEL_LIVE_CALL_ID,
  );

  const params = kernel.sendCalls[0].params;
  assert.equal(params.destination_host, "api.openai.com");
  assert.equal(params.path, "/v1/chat/completions");
});

test("unary rejects invalid secret_ref before outbound params", async () => {
  const kernel = new MockKernelClient();
  for (const secret_ref of ["sk-raw-secret", "secret_ref:inline:OPENAI_API_KEY", "secret_ref:file:OPENAI_API_KEY", "secret_ref:unknown:OPENAI_API_KEY", ""]) {
    await assert.rejects(
      () => modelLiveCallUnary(baseInput({ secret_ref }), kernel, MODEL_LIVE_CALL_ID),
      /input\.secret_ref must be one of secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME/u,
    );
  }
  assert.equal(kernel.sendCalls.length, 0);
});

test("stream rejects invalid secret_ref before outbound params", () => {
  const kernel = new MockKernelClient();
  assert.throws(
    () => modelLiveCallStream(baseInput({ stream: true, settings: { stream_openai: true }, secret_ref: "secret_ref:file:OPENAI_API_KEY" }), kernel, MODEL_LIVE_CALL_STREAM_ID, () => {}),
    /input\.secret_ref must be one of secret_ref:store:NAME, secret_ref:project:NAME, or secret_ref:env:NAME/u,
  );
  assert.equal(kernel.streamCalls.length, 0);
});

test("unary rejects stream=true and stream rejects stream=false", async () => {
  const kernel = new MockKernelClient();
  await assert.rejects(
    () => modelLiveCallUnary(baseInput({ stream: true }), kernel, MODEL_LIVE_CALL_ID),
    /modelLiveCallUnary called with stream=true/,
  );
  assert.throws(
    () => modelLiveCallStream(baseInput({ stream: false }), kernel, MODEL_LIVE_CALL_STREAM_ID, () => {}),
    /modelLiveCallStream called with stream=false/,
  );
});

function assertNoForbiddenProviderBodyKeys(body) {
  for (const key of forbiddenProviderBodyKeys) {
    assert.equal(Object.hasOwn(body, key), false, `${key} should not be in final provider body`);
  }
}
