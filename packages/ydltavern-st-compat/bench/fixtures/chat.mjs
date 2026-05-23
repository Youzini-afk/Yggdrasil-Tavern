export function createChat(turns = 1000) {
  return {
    id: 'bench-chat',
    meta: { title: 'Benchmark Chat' },
    turns: Array.from({ length: turns }, (_, i) => ({
      id: `turn-${i}`,
      index: i,
      role: i % 2 === 0 ? 'user' : 'assistant',
      speaker: { name: i % 2 === 0 ? 'User' : 'Assistant', kind: i % 2 === 0 ? 'user' : 'character' },
      variants: [{
        id: `variant-${i}`,
        subs: [{ kind: 'text', text: `m${i}`, segment_role: 'main' }],
        meta: {},
        created_at: 1_700_000_000_000 + i,
      }],
      active_variant: 0,
      source: i % 2 === 0 ? 'user_input' : 'generation',
      created_at: 1_700_000_000_000 + i,
    })),
  };
}
