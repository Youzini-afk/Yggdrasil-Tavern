import assert from "node:assert/strict";
import test from "node:test";

import { deepPortHandlers } from "../dist/capabilities/deep-port.js";

const PKG = "ydltavern/engine";

// ---------------------------------------------------------------------------
// 1. prompt.manager.compile

test("prompt.manager.compile produces chat array from prompts", () => {
  const handler = deepPortHandlers[`${PKG}/prompt.manager.compile`];
  const output = handler({
    prompts: [
      { identifier: "main", role: "system", content: "You are helpful." },
      { identifier: "chatHistory", content: "", marker: true, role: "system" },
    ],
    openai_max_context: 2048,
    openai_max_tokens: 256,
  });

  assert.ok(Array.isArray(output.chat));
  assert.equal(output.chat.length, 1);
  assert.equal(output.chat[0].role, "system");
  assert.equal(output.chat[0].content, "You are helpful.");
  assert.ok(Array.isArray(output.prompts));
  assert.ok(Array.isArray(output.diagnostics.disabledSkipped));
});

test("prompt.manager.compile fills marker content from input", () => {
  const handler = deepPortHandlers[`${PKG}/prompt.manager.compile`];
  const output = handler({
    prompts: [
      { identifier: "main", role: "system", content: "System prompt." },
      { identifier: "worldInfoBefore", content: "", marker: true, role: "system" },
      { identifier: "chatHistory", content: "", marker: true, role: "system" },
    ],
    worldInfoBefore: "Dragons exist.",
    openai_max_context: 2048,
    openai_max_tokens: 256,
  });

  const contents = output.chat.map((m) => m.content);
  assert.ok(contents.includes("Dragons exist."));
  assert.ok(output.diagnostics.overriddenPrompts !== undefined);
});

// ---------------------------------------------------------------------------
// 2. world_info.route

test("world_info.route routes entries into correct buckets", () => {
  const handler = deepPortHandlers[`${PKG}/world_info.route`];
  const output = handler({
    activated: [
      { content: "Before lore.", position: 0, order: 10 },
      { content: "After lore.", position: 1, order: 5 },
    ],
  });

  assert.deepEqual(output.before, ["Before lore."]);
  assert.deepEqual(output.after, ["After lore."]);
  assert.ok(output.authorNote);
  assert.equal(output.authorNote.originalAuthorNote, "");
});

test("world_info.route patches author note", () => {
  const handler = deepPortHandlers[`${PKG}/world_info.route`];
  const output = handler({
    activated: [
      { content: "Top note.", position: 2, order: 0 },
      { content: "Bottom note.", position: 3, order: 0 },
    ],
    originalAuthorNote: "Original AN",
  });

  assert.equal(output.authorNote.top, "Top note.");
  assert.equal(output.authorNote.bottom, "Bottom note.");
  assert.equal(output.authorNote.originalAuthorNote, "Original AN");
  assert.ok(output.authorNote.patched.includes("Original AN"));
});

// ---------------------------------------------------------------------------
// 3. world_info.match_keys

test("world_info.match_keys detects primary match and selective logic", () => {
  const handler = deepPortHandlers[`${PKG}/world_info.match_keys`];
  const output = handler({
    haystack: "the dragon flies over the castle",
    primaryKey: "dragon",
    secondaryKeys: ["castle"],
    logic: 0,
  });

  assert.equal(output.primaryMatched, true);
  assert.equal(output.activated, true);
});

test("world_info.match_keys rejects when primary absent", () => {
  const handler = deepPortHandlers[`${PKG}/world_info.match_keys`];
  const output = handler({
    haystack: "the unicorn prances",
    primaryKey: "dragon",
  });

  assert.equal(output.primaryMatched, false);
  assert.equal(output.activated, false);
});

test("world_info.match_keys applies AND_ALL logic", () => {
  const handler = deepPortHandlers[`${PKG}/world_info.match_keys`];
  const output = handler({
    haystack: "dragon and castle",
    primaryKey: "dragon",
    secondaryKeys: ["castle", "absent"],
    logic: 3, // AND_ALL
  });

  assert.equal(output.primaryMatched, true);
  assert.equal(output.activated, false);
});

// ---------------------------------------------------------------------------
// 4. provider.chat.build_request

test("provider.chat.build_request produces OpenAI body", () => {
  const handler = deepPortHandlers[`${PKG}/provider.chat.build_request`];
  const output = handler({
    source: "openai",
    model: "gpt-4o",
    messages: [{ role: "user", content: "Hello" }],
    settings: { temp_openai: 0.7, stream_openai: false },
  });

  assert.equal(output.body.model, "gpt-4o");
  assert.equal(output.body.chat_completion_source, "openai");
  assert.equal(output.body.temperature, 0.7);
  assert.equal(output.body.stream, false);
  assert.ok(Array.isArray(output.diagnostics.stripped));
});

test("provider.chat.build_request strips fields for o1 models", () => {
  const handler = deepPortHandlers[`${PKG}/provider.chat.build_request`];
  const output = handler({
    source: "openai",
    model: "o1-mini",
    messages: [{ role: "system", content: "Sys" }, { role: "user", content: "Hi" }],
    settings: { temp_openai: 1.0, stream_openai: false },
  });

  assert.ok(output.diagnostics.stripped.includes("temperature"));
  assert.equal(output.body.messages[0].role, "user"); // system → user conversion for o1
});

// ---------------------------------------------------------------------------
// 5. provider.text.build_request

test("provider.text.build_request produces ooba body", () => {
  const handler = deepPortHandlers[`${PKG}/provider.text.build_request`];
  const output = handler({
    source: "ooba",
    prompt: "Once upon a time",
    settings: { temperature: 0.8, max_new_tokens: 100, api_server: "http://localhost:5000" },
    stream: false,
  });

  assert.equal(output.body.api_type, "ooba");
  assert.equal(output.body.prompt, "Once upon a time");
  assert.equal(output.body.max_new_tokens, 100);
  assert.equal(output.diagnostics.server, "http://localhost:5000");
});

test("provider.text.build_request resolves koboldcpp server", () => {
  const handler = deepPortHandlers[`${PKG}/provider.text.build_request`];
  const output = handler({
    source: "koboldcpp",
    prompt: "test",
    settings: {},
  });

  assert.equal(output.body.api_type, "koboldcpp");
});

// ---------------------------------------------------------------------------
// 6. provider.text.plan_horde

test("provider.text.plan_horde enforces min length", () => {
  const handler = deepPortHandlers[`${PKG}/provider.text.plan_horde`];
  const output = handler({
    prompt: "Generate a story",
    params: { max_length: 5 },
  });

  assert.equal(output.minLength, 16);
  assert.equal(output.request.params.max_length, 16);
  assert.equal(output.maxRetries, 480);
});

test("provider.text.plan_horde accepts valid length", () => {
  const handler = deepPortHandlers[`${PKG}/provider.text.plan_horde`];
  const output = handler({
    prompt: "Continue",
    params: { max_length: 50 },
    trustedWorkers: true,
    models: ["model-a"],
  });

  assert.equal(output.request.trusted_workers, true);
  assert.deepEqual(output.request.models, ["model-a"]);
});

// ---------------------------------------------------------------------------
// 7. instruct.format_chat

test("instruct.format_chat formats user message with ChatML", () => {
  const handler = deepPortHandlers[`${PKG}/instruct.format_chat`];
  const output = handler({
    message: { role: "user", content: "Hello there" },
    template: {
      input_sequence: "<|im_start|>user\n",
      input_suffix: "<|im_end|>",
      wrap: true,
    },
  });

  assert.equal(output.text, "<|im_start|>user\nHello there<|im_end|>");
});

test("instruct.format_chat substitutes {{name}} in sequences", () => {
  const handler = deepPortHandlers[`${PKG}/instruct.format_chat`];
  const output = handler({
    message: { role: "assistant", content: "Hi!" },
    template: {
      output_sequence: "{{name}}:\n",
      output_suffix: "\n",
    },
    charName: "Alice",
  });

  assert.ok(output.text.startsWith("Alice:"));
});

// ---------------------------------------------------------------------------
// 8. instruct.stopping_sequences

test("instruct.stopping_sequences extracts unique stop strings", () => {
  const handler = deepPortHandlers[`${PKG}/instruct.stopping_sequences`];
  const output = handler({
    template: {
      stop_sequence: "</s>",
      sequences_as_stop_strings: true,
      input_sequence: "User:",
      output_sequence: "Assistant:",
      wrap: false,
    },
  });

  assert.ok(output.sequences.includes("</s>"));
  assert.ok(output.sequences.includes("User:"));
  assert.ok(output.sequences.includes("Assistant:"));
});

test("instruct.stopping_sequences includes chatStart when provided", () => {
  const handler = deepPortHandlers[`${PKG}/instruct.stopping_sequences`];
  const output = handler({
    template: { stop_sequence: "[END]" },
    options: { chatStart: "[NEWCHAT]" },
  });

  assert.ok(output.sequences.includes("[END]"));
  assert.ok(output.sequences.includes("[NEWCHAT]"));
});

// ---------------------------------------------------------------------------
// 9. tokenizer.best_match

test("tokenizer.best_match returns OPENAI for openai api", () => {
  const handler = deepPortHandlers[`${PKG}/tokenizer.best_match`];
  const output = handler({ api: "openai", model: "gpt-4o" });

  assert.equal(output.tokenizer, "OPENAI");
});

test("tokenizer.best_match returns CLAUDE for claude model via openai api", () => {
  const handler = deepPortHandlers[`${PKG}/tokenizer.best_match`];
  const output = handler({ api: "openai", model: "claude-3-opus" });

  assert.equal(output.tokenizer, "CLAUDE");
});

test("tokenizer.best_match returns LLAMA3 for llama-3 on kobold", () => {
  const handler = deepPortHandlers[`${PKG}/tokenizer.best_match`];
  const output = handler({ api: "kobold", model: "llama-3-8b" });

  assert.equal(output.tokenizer, "LLAMA3");
});

// ---------------------------------------------------------------------------
// 10. tokenizer.guesstimate

test("tokenizer.guesstimate returns byte-length-based estimate", () => {
  const handler = deepPortHandlers[`${PKG}/tokenizer.guesstimate`];
  const output = handler({ text: "Hello world" });

  assert.ok(output.tokens > 0);
  assert.equal(output.charCount, 11);
  // guesstimate = ceil(byteLength / 3.35); "Hello world" is 11 ASCII bytes
  assert.equal(output.tokens, Math.ceil(11 / 3.35));
});

test("tokenizer.guesstimate handles empty string", () => {
  const handler = deepPortHandlers[`${PKG}/tokenizer.guesstimate`];
  const output = handler({ text: "" });

  assert.equal(output.tokens, 0);
  assert.equal(output.charCount, 0);
});

// ---------------------------------------------------------------------------
// 11. script.macro.expand

test("script.macro.expand substitutes env macros", () => {
  const handler = deepPortHandlers[`${PKG}/script.macro.expand`];
  const output = handler({
    text: "Hello {{user}}, I am {{char}}.",
    env: { user: "Tester", char: "Assistant" },
    seed: 42,
  });

  assert.equal(output.text, "Hello Tester, I am Assistant.");
  assert.ok(output.trace.length >= 2);
  assert.ok(output.iterations >= 1);
});

test("script.macro.expand preserves unknown macros by default", () => {
  const handler = deepPortHandlers[`${PKG}/script.macro.expand`];
  const output = handler({
    text: "This {{unknown_macro}} stays.",
    seed: 1,
  });

  assert.ok(output.text.includes("{{unknown_macro}}"));
});

test("script.macro.expand empties unknown macros when unknownMacro=empty", () => {
  const handler = deepPortHandlers[`${PKG}/script.macro.expand`];
  const output = handler({
    text: "Before {{unknown_x}} after",
    unknownMacro: "empty",
    seed: 1,
  });

  assert.equal(output.text, "Before  after");
});

test("script.macro.expand handles variable macros with localVars", () => {
  const handler = deepPortHandlers[`${PKG}/script.macro.expand`];
  const output = handler({
    text: "{{setvar::mood::happy}}Mood: {{getvar::mood}}",
    localVars: {},
    seed: 1,
  });

  assert.ok(output.text.includes("happy"));
});

// ---------------------------------------------------------------------------
// 12. extension.regex.apply_st

test("extension.regex.apply_st applies ST regex script", () => {
  const handler = deepPortHandlers[`${PKG}/extension.regex.apply_st`];
  const output = handler({
    text: "The cat sat on the mat.",
    scripts: [
      {
        id: "r1",
        scriptName: "Replace cat",
        findRegex: "/cat/g",
        replaceString: "dog",
        placement: [1], // USER_INPUT
        disabled: false,
      },
    ],
    options: { placement: 1 },
  });

  assert.equal(output.text, "The dog sat on the mat.");
});

test("extension.regex.apply_st skips disabled scripts", () => {
  const handler = deepPortHandlers[`${PKG}/extension.regex.apply_st`];
  const output = handler({
    text: "hello world",
    scripts: [
      {
        id: "r2",
        scriptName: "Disabled script",
        findRegex: "/world/g",
        replaceString: "earth",
        placement: [1],
        disabled: true,
      },
    ],
    options: { placement: 1 },
  });

  assert.equal(output.text, "hello world");
});

// ---------------------------------------------------------------------------
// 13. extension.loader.parse_manifest

test("extension.loader.parse_manifest validates required fields", () => {
  const handler = deepPortHandlers[`${PKG}/extension.loader.parse_manifest`];
  const output = handler({
    manifest: { display_name: "My Extension", js: "index.js" },
  });

  assert.ok(output.manifest);
  assert.equal(output.manifest.display_name, "My Extension");
  assert.equal(output.errors.length, 0);
});

test("extension.loader.parse_manifest reports missing display_name", () => {
  const handler = deepPortHandlers[`${PKG}/extension.loader.parse_manifest`];
  const output = handler({
    manifest: { js: "index.js" },
  });

  assert.ok(output.errors.length > 0);
  assert.ok(output.errors[0].includes("display_name"));
});

// ---------------------------------------------------------------------------
// 14. extension.loader.plan_activate_all

test("extension.loader.plan_activate_all produces load plans", () => {
  const handler = deepPortHandlers[`${PKG}/extension.loader.plan_activate_all`];
  const output = handler({
    records: [
      { id: "ext-a", manifest: { display_name: "Extension A", loading_order: 10 } },
    ],
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(),
      clientVersion: "1.12.0",
    },
    basePath: "/scripts/extensions",
  });

  assert.equal(output.activated.length, 1);
  assert.equal(output.activated[0].id, "ext-a");
  assert.ok(output.activated[0].steps.length > 0);
});

test("extension.loader.plan_activate_all skips disabled extensions", () => {
  const handler = deepPortHandlers[`${PKG}/extension.loader.plan_activate_all`];
  const output = handler({
    records: [
      { id: "disabled-ext", manifest: { display_name: "Disabled" } },
    ],
    ctx: {
      installedExtras: new Set(),
      installedExtensions: new Set(),
      disabledExtensions: new Set(["disabled-ext"]),
      clientVersion: "1.12.0",
    },
  });

  assert.equal(output.activated.length, 0);
  assert.equal(output.skipped.length, 1);
  assert.ok(output.skipped[0].reasons.includes("user-disabled"));
});

// ---------------------------------------------------------------------------
// 15. extension.caption.plan

test("extension.caption.plan produces caption plan", () => {
  const handler = deepPortHandlers[`${PKG}/extension.caption.plan`];
  const output = handler({
    settings: {
      source: "multimodal",
      prompt: "Describe this image",
      template: "[{{user}} sends {{char}} a picture: {{caption}}]",
      refine_mode: false,
      prompt_ask: false,
      show_in_chat: true,
    },
    imageRef: "img001.png",
  });

  assert.equal(output.source, "multimodal");
  assert.equal(output.prompt, "Describe this image");
  assert.equal(output.refine, false);
});

test("extension.caption.plan renders template when caption provided", () => {
  const handler = deepPortHandlers[`${PKG}/extension.caption.plan`];
  const output = handler({
    settings: {
      source: "extras",
      prompt: "Describe",
      template: "[Caption: {{caption}}]",
      refine_mode: true,
      prompt_ask: false,
      show_in_chat: true,
    },
    imageRef: "img.png",
    caption: "a sunset",
    user: "User",
    char: "Bot",
  });

  assert.equal(output.rendered, "[Caption: a sunset]");
  assert.equal(output.refine, true);
});

// ---------------------------------------------------------------------------
// 16. extension.tts.plan_narration

test("extension.tts.plan_narration returns empty when disabled", () => {
  const handler = deepPortHandlers[`${PKG}/extension.tts.plan_narration`];
  const output = handler({
    settings: {
      enabled: false,
      provider: "System",
      auto_generation: false,
      periodic_auto_generation: false,
      narrate_by_paragraphs: false,
      narrate_dialogues_only: false,
      narrate_quoted_only: false,
      narrate_translated_only: false,
      narrate_user: false,
      voice_per_character: {},
    },
    messageId: 0,
    characterName: "Alice",
    text: "Hello there!",
  });

  assert.equal(output.candidates.length, 0);
});

test("extension.tts.plan_narration segments by paragraph when enabled", () => {
  const handler = deepPortHandlers[`${PKG}/extension.tts.plan_narration`];
  const output = handler({
    settings: {
      enabled: true,
      provider: "System",
      auto_generation: true,
      periodic_auto_generation: false,
      narrate_by_paragraphs: true,
      narrate_dialogues_only: false,
      narrate_quoted_only: false,
      narrate_translated_only: false,
      narrate_user: false,
      voice_per_character: { Alice: "voice-alice" },
    },
    messageId: 5,
    characterName: "Alice",
    text: "First paragraph.\n\nSecond paragraph.",
  });

  assert.equal(output.candidates.length, 2);
  assert.equal(output.candidates[0].voiceId, "voice-alice");
});

// ---------------------------------------------------------------------------
// 17. extension.translate.plan

test("extension.translate.plan produces translation plan", () => {
  const handler = deepPortHandlers[`${PKG}/extension.translate.plan`];
  const output = handler({
    text: "Bonjour le monde",
    settings: {
      provider: "google",
      target_language: "en",
      auto_mode: "off",
      show_original: false,
    },
  });

  assert.equal(output.provider, "google");
  assert.equal(output.target, "en");
  assert.ok(output.endpoint.includes("google"));
  assert.equal(output.text, "Bonjour le monde");
});

// ---------------------------------------------------------------------------
// 18. extension.connection_profile.snapshot

test("extension.connection_profile.snapshot captures current settings", () => {
  const handler = deepPortHandlers[`${PKG}/extension.connection_profile.snapshot`];
  const output = handler({
    current: { mode: "cc", api: "openai", model: "gpt-4o", preset: "default" },
    partial: { name: "Test Profile" },
  });

  assert.ok(output.profile);
  assert.equal(output.profile.name, "Test Profile");
  assert.equal(output.profile.mode, "cc");
  assert.equal(output.profile.api, "openai");
  assert.equal(output.profile.model, "gpt-4o");
});

test("extension.connection_profile.snapshot respects exclude list", () => {
  const handler = deepPortHandlers[`${PKG}/extension.connection_profile.snapshot`];
  const output = handler({
    current: { mode: "cc", api: "openai", model: "gpt-4o" },
    partial: { name: "Excl", exclude: ["model"] },
  });

  assert.equal(output.profile.model, undefined);
  assert.ok(output.excluded.includes("model"));
});

// ---------------------------------------------------------------------------
// 19. extension.connection_profile.apply_plan

test("extension.connection_profile.apply_plan produces commands", () => {
  const handler = deepPortHandlers[`${PKG}/extension.connection_profile.apply_plan`];
  const output = handler({
    profile: {
      id: "p1",
      name: "Profile 1",
      mode: "cc",
      api: "openai",
      model: "gpt-4o",
    },
  });

  assert.ok(output.commands.length >= 2);
  const apiCmd = output.commands.find((c) => c.command === "api");
  assert.ok(apiCmd);
  assert.equal(apiCmd.value, "openai");
});

// ---------------------------------------------------------------------------
// 20. extension.sd.process_triggers

test("extension.sd.process_triggers detects character trigger", () => {
  const handler = deepPortHandlers[`${PKG}/extension.sd.process_triggers`];
  const output = handler({
    text: "She draws an image of a beautiful sunset over the ocean.",
  });

  assert.equal(output.trigger, "character");
  assert.ok(output.subject);
  assert.equal(output.abort, false);
});

test("extension.sd.process_triggers returns empty for no match", () => {
  const handler = deepPortHandlers[`${PKG}/extension.sd.process_triggers`];
  const output = handler({
    text: "The weather is nice today.",
  });

  assert.equal(output.trigger, undefined);
  assert.equal(output.abort, false);
});

test("extension.sd.process_triggers handles empty text", () => {
  const handler = deepPortHandlers[`${PKG}/extension.sd.process_triggers`];
  const output = handler({ text: "" });

  assert.equal(output.trigger, undefined);
  assert.equal(output.abort, false);
});

// ---------------------------------------------------------------------------
// Integration: verify all 20 deep-port capabilities are registered in handlers

test("all 20 deep-port capability IDs are registered", () => {
  const expectedIds = [
    "prompt.manager.compile",
    "world_info.route",
    "world_info.match_keys",
    "provider.chat.build_request",
    "provider.text.build_request",
    "provider.text.plan_horde",
    "instruct.format_chat",
    "instruct.stopping_sequences",
    "tokenizer.best_match",
    "tokenizer.guesstimate",
    "script.macro.expand",
    "extension.regex.apply_st",
    "extension.loader.parse_manifest",
    "extension.loader.plan_activate_all",
    "extension.caption.plan",
    "extension.tts.plan_narration",
    "extension.translate.plan",
    "extension.connection_profile.snapshot",
    "extension.connection_profile.apply_plan",
    "extension.sd.process_triggers",
  ];

  for (const suffix of expectedIds) {
    const fullId = `${PKG}/${suffix}`;
    assert.ok(deepPortHandlers[fullId], `Missing handler for ${fullId}`);
    assert.equal(typeof deepPortHandlers[fullId], "function", `Handler for ${fullId} is not a function`);
  }
});
