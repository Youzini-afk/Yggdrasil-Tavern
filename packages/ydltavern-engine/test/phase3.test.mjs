import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import test from "node:test";

import { assetHandlers } from "../dist/capabilities/asset.js";
import { presetHandlers } from "../dist/capabilities/preset.js";
import { turnHandlers } from "../dist/capabilities/turn.js";
import { worldInfoHandlers } from "../dist/capabilities/world-info.js";

const PACKAGE_ID = "ydltavern/engine";

const sampleChat = {
  id: "chat_test",
  meta: { title: "Phase 3 test" },
  turns: [
    {
      id: "turn_user_0",
      index: 0,
      role: "user",
      speaker: { name: "User", kind: "user" },
      variants: [
        {
          id: "variant_user_0",
          subs: [{ kind: "text", text: "Hello engine" }],
          meta: {},
          created_at: 0,
        },
      ],
      active_variant: 0,
      source: "user_input",
      created_at: 0,
    },
  ],
};

const promptBlocks = [
  { identifier: "main", role: "system", content: "You are deterministic.", order: 0 },
  { identifier: "chatHistory", content: "", order: 1 },
];

const loreBook = {
  name: "Test Lore",
  entries: [
    { uid: "engine-lore", key: ["engine"], content: "World info says engines run on moonlight.", position: "before", order: 0 },
    { uid: "quiet-lore", key: ["absent-key"], content: "This should not activate.", position: "after", order: 1 },
  ],
};

test("world_info.evaluate activates matching world info entries", () => {
  const output = worldInfoHandlers[`${PACKAGE_ID}/world_info.evaluate`]({
    chat: sampleChat,
    world_book: loreBook,
  });

  assert.equal(output.activated.length, 1);
  assert.equal(output.activated[0].id, "engine-lore");
  assert.deepEqual(output.activated[0].matchedKeys, ["engine"]);
  assert.equal(output.buckets.before[0], "World info says engines run on moonlight.");
  assert.equal(output.skipped[0].id, "quiet-lore");
  assert.equal(output.diagnostics.iterations, 1);
});

test("preset.compile builds prompt and OpenAI request shape", () => {
  const output = presetHandlers[`${PACKAGE_ID}/preset.compile`]({
    chat: sampleChat,
    prompt_blocks: promptBlocks,
    sampler: { temperature: 0.25, max_tokens: 32 },
    model: "phase3-model",
  });

  assert.equal(output.prompt.messages.length, 2);
  assert.equal(output.prompt.messages[0].content, "You are deterministic.");
  assert.equal(output.request_shape.model, "phase3-model");
  assert.equal(output.request_shape.temperature, 0.25);
  assert.equal(output.request_shape.max_tokens, 32);
  assert.equal(output.request_shape.stream, false);
  assert.equal(output.diagnostics.insertedHistoryTurns, 1);
});

test("preset.compile includes prompt-critical WI, persona, and author note", () => {
  const output = presetHandlers[`${PACKAGE_ID}/preset.compile`]({
    chat: sampleChat,
    prompt_blocks: [{ identifier: "chatHistory", content: "", order: 100 }],
    world_info: loreBook,
    prompt_context: {
      persona: "Persona enjoys deterministic engines.",
      author_note: { content: "Author note mentions {{persona}}.", position: "bottom" },
      macro_context: { persona: "macro persona" },
    },
    model: "phase3-model",
  });

  const contents = output.prompt.messages.map((message) => message.content);
  assert.ok(contents.includes("World info says engines run on moonlight."));
  assert.ok(contents.includes("Persona enjoys deterministic engines."));
  assert.ok(contents.includes("Author note mentions macro persona."));
  assert.equal(output.world_info.activated.length, 1);
  assert.ok(output.prompt_critical.includedBlocks.includes("worldInfoBefore"));
  assert.ok(output.diagnostics.prompt_critical.includedBlocks.includes("personaDescription"));
});

test("turn.generate returns lifecycle frames and assistant outputs", () => {
  const output = turnHandlers[`${PACKAGE_ID}/turn.generate`]({
    id: "generate_test",
    chat: sampleChat,
    prompt_blocks: promptBlocks,
    model: "phase3-model",
    text: "sample response",
  });

  assert.deepEqual(output.frames.map((frame) => frame.type), ["started", "prompt_critical", "token", "completed"]);
  assert.equal(output.turn.role, "assistant");
  assert.equal(output.turn.variants[0].subs[0].text, "[ydltavern fake generation] sample response");
  assert.equal(output.message.mes, "[ydltavern fake generation] sample response");
  assert.equal(output.request_shape.model, "phase3-model");
});

test("turn.generate exposes prompt-critical diagnostics frame", () => {
  const output = turnHandlers[`${PACKAGE_ID}/turn.generate`]({
    id: "generate_prompt_critical_test",
    chat: sampleChat,
    prompt_blocks: promptBlocks,
    world_book: loreBook,
    prompt_context: { persona: "Frame persona." },
    model: "phase3-model",
  });

  const frame = output.frames.find((item) => item.type === "prompt_critical");
  assert.ok(frame);
  assert.equal(frame.activated_world_info, 1);
  assert.ok(frame.diagnostics.includedBlocks.includes("personaDescription"));
  assert.equal(output.world_info.activated[0].id, "engine-lore");
  assert.ok(output.prompt_critical.includedBlocks.includes("worldInfoBefore"));
});

test("turn operations produce deterministic non-echo results", () => {
  const swipe = turnHandlers[`${PACKAGE_ID}/turn.swipe`]({ turn_id: "turn-a", text: "base" });
  const regenerate = turnHandlers[`${PACKAGE_ID}/turn.regenerate`]({ turn_id: "turn-a", text: "base" });
  const continuation = turnHandlers[`${PACKAGE_ID}/turn.continue`]({ turn_id: "turn-a", text: "base" });

  assert.equal(swipe.operation, "swipe");
  assert.equal(swipe.variant.text, "[ydltavern fake swipe] base");
  assert.equal(regenerate.operation, "regenerate");
  assert.equal(regenerate.variant.text, "[ydltavern fake regenerate] base");
  assert.equal(continuation.operation, "continue");
  assert.equal(continuation.continuation.text, "[ydltavern fake continuation] base");
});

test("asset import capabilities return importer outputs", () => {
  const character = assetHandlers[`${PACKAGE_ID}/asset.import_character_v2`]({
    payload: {
      spec: "chara_card_v2",
      spec_version: "2.0",
      data: { name: "Alice", description: "Imported character" },
    },
  });
  const worldBook = assetHandlers[`${PACKAGE_ID}/asset.import_world_book`]({
    payload: {
      name: "Lore",
      entries: [{ keys: ["moon"], content: "The moon is bright.", enabled: true }],
    },
  });

  assert.equal(character.kind, "character_card");
  assert.equal(character.name, "Alice");
  assert.equal(character.format, "st_v2");
  assert.equal(worldBook.kind, "world_book");
  assert.equal(worldBook.entries[0].content, "The moon is bright.");
});

test("fallback JSON-RPC capability.invoke calls a real capability", async () => {
  const child = spawn(process.execPath, ["dist/index.js"], {
    cwd: new URL("..", import.meta.url),
    env: { ...process.env, YDLTAVERN_ENGINE_FORCE_FALLBACK: "1" },
    stdio: ["pipe", "pipe", "pipe"],
  });
  const stdout = [];
  const stderr = [];
  child.stdout.on("data", (chunk) => stdout.push(chunk));
  child.stderr.on("data", (chunk) => stderr.push(chunk));

  child.stdin.end(`${JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "capability.invoke",
    params: {
      capability_id: `${PACKAGE_ID}/preset.compile`,
      input: { chat: sampleChat, prompt_blocks: promptBlocks, model: "rpc-model" },
    },
  })}\n`);

  const code = await new Promise((resolve) => child.on("close", resolve));
  assert.equal(code, 0, Buffer.concat(stderr).toString("utf8"));
  const response = JSON.parse(Buffer.concat(stdout).toString("utf8").trim());
  assert.equal(response.id, 1);
  assert.equal(response.result.output.request_shape.model, "rpc-model");
  assert.equal(response.result.output.prompt.messages[0].content, "You are deterministic.");
});
