function turn(i) {
  return {
    id: `turn_${i}`,
    index: i,
    role: i % 2 ? 'user' : 'assistant',
    speaker: { name: i % 2 ? 'User' : 'Char', kind: i % 2 ? 'user' : 'character' },
    variants: [{ id: `variant_${i}`, subs: [{ kind: 'text', text: `Turn ${i} mentions key${i % 500} and topic${i % 37}.` }], created_at: 0 }],
    active_variant: 0,
    source: 'synthetic',
    created_at: 0,
  };
}

function entry(i, options = {}) {
  const recursive = options.recursive === true && i % 10 === 0;
  const decorated = options.decorators === true && i % 25 === 0;
  return {
    uid: i,
    key: [`key${i}`, `topic${i % 37}`],
    keysecondary: i % 3 === 0 ? [`secondary${i % 11}`] : [],
    logic: i % 3 === 0 ? 'AND_ANY' : 'NOT_ANY',
    content: `${decorated ? '@@activate\n' : ''}Entry ${i}: ${'lore '.repeat(12)} ${recursive ? `key${(i + 1) % Math.max(1, options.count ?? 1)}` : ''}`,
    position: i % 7,
    depth: i % 5,
    role: i % 3,
    order: i % 100,
    probability: 100,
    useProbability: true,
    constant: i % 97 === 0,
    sticky: i % 53 === 0 ? 2 : 0,
    cooldown: i % 53 === 0 ? 3 : 0,
    matchWholeWords: i % 2 === 0,
    preventRecursion: !recursive,
  };
}

function makeWorldInfoFixture(count, matchingKeyCount, options = {}) {
  const keys = Array.from({ length: matchingKeyCount }, (_, i) => `key${i}`).join(' ');
  const secondary = Array.from({ length: Math.min(20, matchingKeyCount) }, (_, i) => `secondary${i % 11}`).join(' ');
  return {
    book: {
      name: `bench_${count}`,
      entries: Array.from({ length: count }, (_, i) => entry(i, { ...options, count })),
    },
    chat: {
      id: `chat_${count}`,
      meta: { title: `Bench ${count}` },
      turns: Array.from({ length: Math.max(10, Math.min(1000, matchingKeyCount * 2)) }, (_, i) => turn(i)),
    },
    scanData: `sample text containing ${keys} ${secondary}`,
    scanDepth: Math.min(64, Math.max(4, matchingKeyCount)),
    maxRecursion: options.recursive === true ? 3 : 1,
    budget: { type: 'characters', max: Math.max(100_000, count * 400) },
    macroContext: { user: 'User', char: 'Char', now: '2026-01-01T00:00:00.000Z' },
    randomValues: Array.from({ length: count }, (_, i) => ((i * 37) % 100) / 100),
    dryRun: true,
  };
}

export const wiSmall = makeWorldInfoFixture(10, 5);
export const wiMedium = makeWorldInfoFixture(100, 50, { recursive: true });
export const wiLarge = makeWorldInfoFixture(1000, 500, { recursive: true, decorators: true });
