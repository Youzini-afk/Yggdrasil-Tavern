import assert from "node:assert/strict";
import test from "node:test";

import { modelLiveCallUnary } from "../dist/capabilities/model-live-call.js";

const RUN_LIVE = process.env.YGG_LIVE_MODEL_TESTS === "1";

// Optional live smoke test.
// Requires a running Yggdrasil host using the forge-with-live-models.example.yaml
// profile and an OPENAI_API_KEY exposed to the host as secret_ref:env:OPENAI_API_KEY.
// Provide YGG_LIVE_KERNEL_CLIENT_MODULE as a file URL or package specifier that
// exports `kernelClient` with the Y4 sendKernelRequest/streamKernelRequest API.
// It is skipped by default so normal package tests never touch the network.
test("live OpenAI roundtrip says pong", { skip: !RUN_LIVE }, async (t) => {
  const moduleSpecifier = process.env.YGG_LIVE_KERNEL_CLIENT_MODULE;
  if (!moduleSpecifier) {
    t.skip("requires YGG_LIVE_KERNEL_CLIENT_MODULE exporting a host-connected kernelClient");
    return;
  }

  const { kernelClient } = await import(moduleSpecifier);
  const output = await modelLiveCallUnary(
    {
      source: "openai",
      model: process.env.YGG_LIVE_OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "user", content: "Say exactly: pong" }],
      settings: { temp_openai: 0, openai_max_tokens: 8, stream_openai: false },
      stream: false,
      secret_ref: "secret_ref:env:OPENAI_API_KEY",
      timeout_ms: 60_000,
    },
    kernelClient,
  );

  assert.equal(output.status, "ok");
  assert.match(output.text ?? "", /pong/i);
});
