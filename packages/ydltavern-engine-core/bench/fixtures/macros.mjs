export const macroContext = {
  user: 'User',
  char: 'Char',
  description: 'A deterministic benchmark character.',
  personality: 'Helpful and direct.',
  scenario: 'A synthetic test scene.',
  persona: 'Benchmark persona.',
  now: '2026-01-01T00:00:00.000Z',
  dynamic: {
    foo: 'foo-value',
    bar: 'bar-value',
    nested: '{{user}} meets {{char}}',
  },
};

export const macroOptions = {
  now: '2026-01-01T00:00:00.000Z',
  random: () => 0.25,
  pickSeed: () => 0.75,
  maxIterations: 10,
};

export const macrosShort = '{{user}} {{char}} '.repeat(50);
export const macrosLong = '{{user}} {{char}} {{random:foo,bar,baz}} {{pick:1,2,3}} {{time}} {{date}} '.repeat(500);
