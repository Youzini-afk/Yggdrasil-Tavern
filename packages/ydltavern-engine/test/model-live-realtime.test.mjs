import assert from "node:assert/strict";
import test from "node:test";

import {
  MODEL_LIVE_REALTIME_ID,
  openRealtimeSession,
  parseRealtimeServerFrame,
  serializeRealtimeClientEvent,
} from "../dist/capabilities/model-live-realtime.js";

const openAIInput = (overrides = {}) => ({
  source: "openai-realtime",
  model: "gpt-4o-realtime-preview",
  secret_ref: "secret_ref:env:OPENAI_API_KEY",
  ...overrides,
});

class MockKernelClient {
  wsCalls = [];
  sentFrames = [];
  closeCalls = [];

  async openWebSocket(params, callbacks) {
    const handle = {
      connectionId: "mock-conn-1",
      subprotocol: "mock-proto",
      send: async (frame) => {
        this.sentFrames.push(frame);
      },
      close: async (code, reason) => {
        this.closeCalls.push({ code, reason });
      },
    };
    this.wsCalls.push({ params, callbacks, handle });
    return handle;
  }
}

const textFrame = (payload) => ({ kind: "text", data: JSON.stringify(payload) });
const parseSent = (frame) => JSON.parse(frame.data);

test("openRealtimeSession openai-realtime sends correct ws params", async () => {
  const kernel = new MockKernelClient();
  await openRealtimeSession(openAIInput(), kernel, MODEL_LIVE_REALTIME_ID, { onServerEvent() {} });

  assert.equal(kernel.wsCalls.length, 1);
  const { params } = kernel.wsCalls[0];
  assert.equal(params.capability_id, MODEL_LIVE_REALTIME_ID);
  assert.equal(params.destination_host, "api.openai.com");
  assert.equal(params.path, "/v1/realtime?model=gpt-4o-realtime-preview");
  assert.equal(params.purpose, "ydltavern.realtime:openai-realtime");
  assert.deepEqual(params.secret_refs, ["secret_ref:env:OPENAI_API_KEY"]);
  assert.equal(params.max_frame_bytes, 1_048_576);
});

test("openRealtimeSession openai-realtime authorization secret_header bearer", async () => {
  const kernel = new MockKernelClient();
  await openRealtimeSession(openAIInput(), kernel, MODEL_LIVE_REALTIME_ID, { onServerEvent() {} });
  assert.deepEqual(kernel.wsCalls[0].params.secret_headers, {
    Authorization: { secret_ref: "secret_ref:env:OPENAI_API_KEY", scheme: "bearer" },
  });
});

test("openRealtimeSession openai-realtime openai-beta static header", async () => {
  const kernel = new MockKernelClient();
  await openRealtimeSession(openAIInput(), kernel, MODEL_LIVE_REALTIME_ID, { onServerEvent() {} });
  assert.equal(kernel.wsCalls[0].params.static_headers["openai-beta"], "realtime=v1");
});

test("openRealtimeSession gemini-live x-goog-api-key secret_header", async () => {
  const kernel = new MockKernelClient();
  await openRealtimeSession(
    { source: "gemini-live", model: "gemini-2.0-flash-live-001", secret_ref: "secret_ref:env:GEMINI_API_KEY" },
    kernel,
    MODEL_LIVE_REALTIME_ID,
    { onServerEvent() {} },
  );
  assert.equal(kernel.wsCalls[0].params.destination_host, "generativelanguage.googleapis.com");
  assert.deepEqual(kernel.wsCalls[0].params.secret_headers, {
    "x-goog-api-key": { secret_ref: "secret_ref:env:GEMINI_API_KEY" },
  });
});

test("openRealtimeSession openai-realtime sends session.update on open", async () => {
  const kernel = new MockKernelClient();
  await openRealtimeSession(
    openAIInput({ voice: "verse", instructions: "Be concise", modalities: ["text"], input_audio_format: "g711_ulaw", max_response_tokens: 12 }),
    kernel,
    MODEL_LIVE_REALTIME_ID,
    { onServerEvent() {} },
  );
  kernel.wsCalls[0].callbacks.onOpen({ connectionId: "mock-conn-1" });
  await Promise.resolve();
  await Promise.resolve();

  assert.equal(kernel.sentFrames.length, 1);
  assert.deepEqual(parseSent(kernel.sentFrames[0]), {
    type: "session.update",
    session: {
      modalities: ["text"],
      instructions: "Be concise",
      voice: "verse",
      input_audio_format: "g711_ulaw",
      output_audio_format: "pcm16",
      max_response_output_tokens: 12,
    },
  });
});

test("parseRealtimeServerFrame session.created maps to session_created event", () => {
  assert.deepEqual(parseRealtimeServerFrame("openai-realtime", textFrame({ type: "session.created", session: { id: "sess_1" } })), {
    type: "session_created",
    session: { id: "sess_1" },
  });
});

test("parseRealtimeServerFrame response.audio.delta maps to decoded audio_delta", () => {
  const event = parseRealtimeServerFrame("openai-realtime", textFrame({ type: "response.audio.delta", delta: Buffer.from([1, 2, 3]).toString("base64") }));
  assert.equal(event.type, "audio_delta");
  assert.deepEqual(Array.from(event.data), [1, 2, 3]);
});

test("parseRealtimeServerFrame response.audio.done maps to audio_done", () => {
  assert.deepEqual(parseRealtimeServerFrame("openai-realtime", textFrame({ type: "response.audio.done" })), { type: "audio_done" });
});

test("parseRealtimeServerFrame response.text.delta maps to text_delta", () => {
  assert.deepEqual(parseRealtimeServerFrame("openai-realtime", textFrame({ type: "response.text.delta", delta: "po" })), { type: "text_delta", delta: "po" });
});

test("parseRealtimeServerFrame response.text.done maps to text_done", () => {
  assert.deepEqual(parseRealtimeServerFrame("openai-realtime", textFrame({ type: "response.text.done", text: "pong" })), { type: "text_done", text: "pong" });
});

test("parseRealtimeServerFrame response.function_call_arguments.done maps to function_call", () => {
  assert.deepEqual(
    parseRealtimeServerFrame("openai-realtime", textFrame({ type: "response.function_call_arguments.done", call_id: "call_1", name: "lookup", arguments: { q: "x" } })),
    { type: "function_call", call_id: "call_1", name: "lookup", arguments: { q: "x" } },
  );
});

test("parseRealtimeServerFrame response.done maps to response_done", () => {
  assert.deepEqual(parseRealtimeServerFrame("openai-realtime", textFrame({ type: "response.done", response: { usage: { total_tokens: 4 } } })), {
    type: "response_done",
    usage: { total_tokens: 4 },
  });
});

test("parseRealtimeServerFrame error maps to error event", () => {
  assert.deepEqual(parseRealtimeServerFrame("openai-realtime", textFrame({ type: "error", error: { code: "bad_request", message: "Nope" } })), {
    type: "error",
    code: "bad_request",
    message: "Nope",
  });
});

test("serializeRealtimeClientEvent audio_append maps to input_audio_buffer.append with base64", () => {
  assert.deepEqual(parseSent(serializeRealtimeClientEvent("openai-realtime", { type: "audio_append", data: Uint8Array.from([4, 5]) })), {
    type: "input_audio_buffer.append",
    audio: Buffer.from([4, 5]).toString("base64"),
  });
});

test("serializeRealtimeClientEvent audio_commit maps to input_audio_buffer.commit", () => {
  assert.deepEqual(parseSent(serializeRealtimeClientEvent("openai-realtime", { type: "audio_commit" })), { type: "input_audio_buffer.commit" });
});

test("serializeRealtimeClientEvent text_send maps to conversation.item.create text", () => {
  assert.deepEqual(parseSent(serializeRealtimeClientEvent("openai-realtime", { type: "text_send", content: "ping" })), {
    type: "conversation.item.create",
    item: { type: "message", role: "user", content: [{ type: "input_text", text: "ping" }] },
  });
});

test("serializeRealtimeClientEvent function_call_response maps to conversation.item.create function_call_output", () => {
  assert.deepEqual(parseSent(serializeRealtimeClientEvent("openai-realtime", { type: "function_call_response", call_id: "call_1", output: "ok" })), {
    type: "conversation.item.create",
    item: { type: "function_call_output", call_id: "call_1", output: "ok" },
  });
});

test("serializeRealtimeClientEvent session_update maps to session.update", () => {
  assert.deepEqual(parseSent(serializeRealtimeClientEvent("openai-realtime", { type: "session_update", partial: { instructions: "new" } })), {
    type: "session.update",
    session: { instructions: "new" },
  });
});

test("session.close calls handle.close with 1000 client_done", async () => {
  const kernel = new MockKernelClient();
  const session = await openRealtimeSession(openAIInput(), kernel, MODEL_LIVE_REALTIME_ID, { onServerEvent() {} });
  await session.close();
  assert.deepEqual(kernel.closeCalls, [{ code: 1000, reason: "client_done" }]);
});

test("binary frame routes to audio_delta event", () => {
  const event = parseRealtimeServerFrame("openai-realtime", { kind: "binary", data: Uint8Array.from([8, 9]) });
  assert.equal(event.type, "audio_delta");
  assert.deepEqual(Array.from(event.data), [8, 9]);
});
