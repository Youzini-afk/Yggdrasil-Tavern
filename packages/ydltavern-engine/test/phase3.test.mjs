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

test("world_info.evaluate returns nextState and advanced diagnostics", () => {
  const stickyBook = {
    name: "Sticky Lore",
    entries: [
      { uid: "sticky-lore", key: ["engine"], content: "Sticky lore.", position: "atDepth", depth: 2, sticky: 2, order: 0 },
      { uid: "outlet-lore", key: ["engine"], content: "Outlet lore.", position: "outlet", outletName: "memory", order: 1 },
    ],
  };
  const output = worldInfoHandlers[`${PACKAGE_ID}/world_info.evaluate`]({
    chat: sampleChat,
    world_book: stickyBook,
    runtimeState: { sticky: [], cooldown: [] },
    chatLength: 5,
    originalAuthorNote: "Original AN",
  });

  assert.ok(Array.isArray(output.nextState.sticky));
  assert.equal(output.nextState.sticky[0].entryId, "sticky-lore");
  assert.ok(output.diagnostics.routingTrace.length >= 2);
  assert.equal(output.buckets.depthEntries[0].entries[0].entryId, "sticky-lore");
  assert.equal(output.buckets.outlets.memory.entries[0].entryId, "outlet-lore");
  assert.equal(output.buckets.anPatch.original, "Original AN");
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

test("preset.compile builds text completion request and budget diagnostics", () => {
  const output = presetHandlers[`${PACKAGE_ID}/preset.compile`]({
    chat: sampleChat,
    prompt_blocks: promptBlocks,
    mode: "text",
    provider: "textgen",
    sampler: { temperature: 0.4, max_tokens: 16, top_k: 20 },
    model: "phase3-text-model",
    max_prompt_tokens: 64,
    reserve_tokens: 8,
    stop_strings: ["</s>"],
    goldenExpected: outputLikeTextFixture(),
    goldenMode: "structure",
  });

  assert.equal(output.request_shape, undefined);
  assert.equal(output.text_request_shape.max_new_tokens, 16);
  assert.equal(output.text_request_shape.stopping_strings[0], "</s>");
  assert.equal(output.text_request_diagnostics.provider, "textgen");
  assert.equal(output.token_budget.tokenUsage.budget, 64);
  assert.ok(Array.isArray(output.prompt_routing.diagnostics));
  assert.equal(output.golden.pass, true);
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

test("preset.compile preserves PromptManager and WI diagnostics", () => {
  const output = presetHandlers[`${PACKAGE_ID}/preset.compile`]({
    chat: sampleChat,
    world_info: {
      world_book: loreBook,
      originalAuthorNote: "Original author note",
    },
    promptManager: {
      prompts: [
        { identifier: "main", content: "Main {{char}}", marker: false, role: "system" },
        { identifier: "worldInfoBefore", content: "", marker: true, role: "system" },
        { identifier: "chatHistory", content: "", marker: true, role: "system" },
      ],
      prompt_order: [
        { identifier: "main", enabled: true, order: 0 },
        { identifier: "worldInfoBefore", enabled: true, order: 1, marker: true },
        { identifier: "chatHistory", enabled: true, order: 2, marker: true },
      ],
    },
    prompt_context: {
      character: { name: "Alice" },
      macro_context: { char: "Macro Alice" },
    },
    model: "phase3-model",
  });

  assert.ok(output.prompt_manager.diagnostics);
  assert.ok(output.prompt_manager.mapping.some((item) => item.promptIdentifier === "worldInfoBefore"));
  assert.ok(output.prompt_critical.promptManager);
  assert.ok(output.prompt_critical.markerMapping.some((item) => item.promptIdentifier === "worldInfoBefore"));
  assert.ok(Array.isArray(output.world_info.diagnostics.routingTrace));
  assert.deepEqual(output.world_info.nextState, { sticky: [], cooldown: [] });
  assert.equal(output.world_info.buckets.anPatch.original, "Original author note");
  assert.ok(Array.isArray(output.diagnostics.world_info.depthEntries));
  assert.ok(output.diagnostics.world_info.outlets);
  assert.ok(Array.isArray(output.knownDeltas));
  assert.ok(output.unsupported.length > 0);
});

test("preset.compile reads prompt_manager alias and WI passthrough inputs", () => {
  const probabilisticBook = {
    name: "Probability Lore",
    entries: [
      { uid: "prob-lore", key: ["engine"], content: "Probability lore.", position: "before", order: 0, probability: 50, useProbability: true },
    ],
  };
  const output = presetHandlers[`${PACKAGE_ID}/preset.compile`]({
    chat: sampleChat,
    world_book: probabilisticBook,
    prompt_manager: {
      prompts: [{ identifier: "worldInfoBefore", content: "", marker: true, role: "system" }],
      promptOrder: [{ identifier: "worldInfoBefore", enabled: true, marker: true, order: 0 }],
    },
    randomValues: [0.25],
    dryRun: true,
    chat_length: 10,
    runtimeState: { sticky: [{ entryId: "kept", start: 1, end: 20 }] },
    generationType: "normal",
    authorNote: "Current AN",
    model: "phase3-model",
  });

  assert.equal(output.world_info.activated[0].id, "prob-lore");
  assert.equal(output.world_info.diagnostics.activationTrace.find((item) => item.code === "probability_roll").randomValue, 0.25);
  assert.deepEqual(output.world_info.nextState, { sticky: [{ entryId: "kept", start: 1, end: 20, protected: false }], cooldown: [] });
  assert.ok(output.prompt_critical.promptManager);
});

test("turn.generate returns lifecycle frames and assistant outputs", () => {
  const output = turnHandlers[`${PACKAGE_ID}/turn.generate`]({
    id: "generate_test",
    chat: sampleChat,
    prompt_blocks: promptBlocks,
    model: "phase3-model",
    text: "sample response",
  });

  assert.deepEqual(output.frames.map((frame) => frame.type), ["started", "prompt_critical", "world_info_evaluated", "prompt_manager_compiled", "request_built", "stream_preview", "token", "completed"]);
  assert.equal(output.turn.role, "assistant");
  assert.equal(output.turn.variants[0].subs[0].text, "[ydltavern fake generation] sample response");
  assert.equal(output.message.mes, "[ydltavern fake generation] sample response");
  assert.equal(output.request_shape.model, "phase3-model");
});

test("turn.generate can build text completion and normalize stream preview", () => {
  const output = turnHandlers[`${PACKAGE_ID}/turn.generate`]({
    id: "generate_text_test",
    chat: sampleChat,
    prompt_blocks: promptBlocks,
    mode: "text",
    provider: "ollama",
    model: "phase3-text-model",
    max_prompt_tokens: 64,
    stream_preview: [
      { response: "hello", thinking: "plan" },
      { done: true, done_reason: "stop", eval_count: 3 },
    ],
  });

  const requestFrame = output.frames.find((item) => item.type === "request_built");
  const streamFrame = output.frames.find((item) => item.type === "stream_preview");
  assert.equal(output.request_shape.request.model, "phase3-text-model");
  assert.equal(output.request_shape.diagnostics.provider, "ollama");
  assert.equal(output.token_budget.tokenUsage.budget, 64);
  assert.ok(requestFrame.prompt_routing.length >= 0);
  assert.equal(streamFrame.frames[0].type, "delta");
  assert.equal(streamFrame.frames[1].type, "reasoning_delta");
  assert.equal(streamFrame.frames[2].type, "end");
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
  assert.ok(frame.full_world_info.nextState);
  assert.ok(frame.diagnostics.includedBlocks.includes("personaDescription"));
  assert.equal(output.world_info.activated[0].id, "engine-lore");
  assert.ok(output.prompt_critical.includedBlocks.includes("worldInfoBefore"));
});

function outputLikeTextFixture() {
  return "structure-only text fixture";
}

test("turn.generate exposes world info and prompt manager frames", () => {
  const output = turnHandlers[`${PACKAGE_ID}/turn.generate`]({
    id: "generate_advanced_frames_test",
    chat: sampleChat,
    world_book: loreBook,
    promptManager: {
      prompts: [
        { identifier: "worldInfoBefore", content: "", marker: true, role: "system" },
        { identifier: "chatHistory", content: "", marker: true, role: "system" },
      ],
      prompt_order: [
        { identifier: "worldInfoBefore", enabled: true, marker: true, order: 0 },
        { identifier: "chatHistory", enabled: true, marker: true, order: 1 },
      ],
    },
    model: "phase3-model",
  });

  const worldInfoFrame = output.frames.find((item) => item.type === "world_info_evaluated");
  const promptManagerFrame = output.frames.find((item) => item.type === "prompt_manager_compiled");
  assert.ok(worldInfoFrame);
  assert.equal(worldInfoFrame.world_info.activated[0].id, "engine-lore");
  assert.ok(worldInfoFrame.nextState);
  assert.ok(Array.isArray(worldInfoFrame.diagnostics.routingTrace));
  assert.ok(promptManagerFrame);
  assert.ok(promptManagerFrame.diagnostics);
  assert.ok(promptManagerFrame.mapping.some((item) => item.promptIdentifier === "worldInfoBefore"));
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

  const preset = assetHandlers[`${PACKAGE_ID}/asset.import_preset`]({
    payload: { name: "Preset", prompt_order: [{ identifier: "main" }], temperature: 0.5 },
  });
  const persona = assetHandlers[`${PACKAGE_ID}/asset.import_persona`]({ payload: { name: "Me", description: "Persona text" } });
  const theme = assetHandlers[`${PACKAGE_ID}/asset.import_theme`]({ payload: { name: "Dark", vars: { color: "#000" } } });
  const quickReplies = assetHandlers[`${PACKAGE_ID}/asset.import_quick_replies`]({ payload: { name: "Set", items: [{ label: "Hi", message: "/gen" }] } });
  const regex = assetHandlers[`${PACKAGE_ID}/asset.import_regex_scripts`]({ payload: { scripts: [{ scope: "PRESET", find: "foo", replace: "bar" }] } });
  const instruct = assetHandlers[`${PACKAGE_ID}/asset.import_instruct_preset`]({ payload: { name: "Instruct", system: "sys", user: "usr" } });
  const exportedPreset = assetHandlers[`${PACKAGE_ID}/asset.export_preset`]({ payload: { name: "Preset", temperature: 0.5 } });

  assert.equal(preset.kind, "preset");
  assert.equal(persona.description, "Persona text");
  assert.equal(theme.kind, "theme");
  assert.equal(quickReplies.sets[0].items[0].label, "Hi");
  assert.equal(regex.scripts[0].scope, "PRESET");
  assert.equal(instruct.system, "sys");
  assert.equal(exportedPreset.name, "Preset");
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
