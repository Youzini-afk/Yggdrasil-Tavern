import assert from "node:assert/strict";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";

import { openRealtimeSession } from "../dist/capabilities/model-live-realtime.js";

const RUN = process.env.YGG_LIVE_REALTIME_TESTS === "1";

// Optional live smoke test. Skipped by default.
// Requirements when enabled:
// - A running Yggdrasil host with outbound.websocket.executor live/enabled.
// - OPENAI_API_KEY exposed to that host as secret_ref:env:OPENAI_API_KEY.
// - YGG_LIVE_KERNEL_CLIENT_MODULE points to a file URL or package specifier
//   exporting either createKernelClient() or kernelClient with openWebSocket().
test("live OpenAI Realtime says pong", { skip: !RUN }, async (t) => {
  const moduleSpecifier = process.env.YGG_LIVE_KERNEL_CLIENT_MODULE;
  if (!moduleSpecifier) {
    t.skip("requires YGG_LIVE_KERNEL_CLIENT_MODULE exporting a host-connected kernel client");
    return;
  }

  const mod = await import(moduleSpecifier);
  const kernelClient = typeof mod.createKernelClient === "function" ? await mod.createKernelClient() : mod.kernelClient;
  if (!kernelClient || typeof kernelClient.openWebSocket !== "function") {
    t.skip("kernel client module must export createKernelClient() or kernelClient with openWebSocket()");
    return;
  }

  let text = "";
  let done = false;
  const session = await openRealtimeSession(
    {
      source: "openai-realtime",
      model: process.env.YGG_LIVE_OPENAI_REALTIME_MODEL ?? "gpt-4o-realtime-preview",
      secret_ref: "secret_ref:env:OPENAI_API_KEY",
      instructions: "Reply with exactly: pong",
      modalities: ["text"],
      max_response_tokens: 8,
    },
    kernelClient,
    undefined,
    {
      onServerEvent(event) {
        if (event.type === "text_delta") text += event.delta;
        if (event.type === "text_done") text = event.text;
        if (event.type === "response_done") done = true;
      },
    },
  );

  await session.send({ type: "text_send", content: "Say exactly: pong" });
  await session.send({ type: "session_update", partial: { modalities: ["text"] } });

  const deadline = Date.now() + 30_000;
  while (!done && Date.now() < deadline) {
    await delay(100);
  }
  await session.close();

  assert.match(text, /pong/i);
});
