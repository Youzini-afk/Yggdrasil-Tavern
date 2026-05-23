function prompt(identifier, content, role = 'system') {
  return { identifier, content, role, marker: identifier === 'chatHistory' || identifier === 'dialogueExamples' };
}

function turn(i) {
  const isUser = i % 2 === 1;
  return {
    role: isUser ? 'user' : 'assistant',
    name: isUser ? 'User' : 'Char',
    is_user: isUser,
    is_system: false,
    content: `Message ${i}: ${'chat '.repeat(16)} key${i % 64}`,
  };
}

function extensionPrompt(i) {
  return {
    value: `World info match ${i}: ${'lore '.repeat(20)} key${i}`,
    position: 0,
    depth: i % 4,
    scan: false,
    role: 0,
  };
}

function makePromptFixture(promptCount, messageCount, worldInfoCount) {
  const base = [
    prompt('main', 'Main system prompt. {{char}} follows scenario rules. ' + 'x'.repeat(80)),
    prompt('worldInfoBefore', ''),
    prompt('personaDescription', ''),
    prompt('charDescription', ''),
    prompt('charPersonality', ''),
    prompt('scenario', ''),
    prompt('dialogueExamples', ''),
    prompt('chatHistory', ''),
    prompt('jailbreak', 'Stay in character and continue the scene.'),
  ];
  const extras = Array.from({ length: Math.max(0, promptCount - base.length) }, (_, i) =>
    prompt(`extra_${i}`, `Extra prompt ${i}: ${'detail '.repeat(12)} marker ${i % 17}`),
  );
  const prompts = [...base, ...extras].slice(0, promptCount);
  const prompt_order = [{ character_id: 'bench_char', order: prompts.map((p) => ({ identifier: p.identifier, enabled: true })) }];
  const extensionPrompts = Object.fromEntries(
    Array.from({ length: worldInfoCount }, (_, i) => [`wi_${i}`, extensionPrompt(i)]),
  );

  return {
    prompts,
    prompt_order,
    active_character: { id: 'bench_char' },
    charDescription: `Char is a deterministic benchmark character. ${'description '.repeat(20)}`,
    charPersonality: `Helpful, concise, curious. ${'personality '.repeat(10)}`,
    scenario: `A reproducible synthetic tavern conversation. ${'scenario '.repeat(12)}`,
    personaDescription: `User persona for prompt assembly. ${'persona '.repeat(8)}`,
    worldInfoBefore: `Before-world-info ${'before '.repeat(Math.max(1, worldInfoCount))}`,
    worldInfoAfter: `After-world-info ${'after '.repeat(Math.max(1, Math.floor(worldInfoCount / 2)))}`,
    extensionPrompts,
    openai_max_context: Math.max(8192, messageCount * 80),
    openai_max_tokens: 512,
    names_behavior: 2,
    substituteParams: (text) => text.replace(/{{char}}/g, 'Char').replace(/{{user}}/g, 'User'),
    chat: Array.from({ length: messageCount }, (_, i) => turn(i)),
    examples: Array.from({ length: Math.max(1, Math.floor(promptCount / 5)) }, (_, i) =>
      `<START>\n{{user}}: Example user ${i}\nChar: Example reply ${i} ${'example '.repeat(8)}`,
    ),
  };
}

export const promptSmall = makePromptFixture(5, 10, 0);
export const promptMedium = makePromptFixture(20, 100, 50);
export const promptLarge = makePromptFixture(50, 1000, 500);
