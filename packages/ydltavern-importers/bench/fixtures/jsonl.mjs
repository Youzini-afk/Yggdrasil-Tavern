function turnLine(i) {
  return JSON.stringify({
    name: i % 2 ? 'User' : 'Char',
    is_user: i % 2 === 1,
    is_system: false,
    mes: `Turn ${i}: ${'msg '.repeat(20)}`,
    send_date: '2026-01-01T00:00:00Z',
  });
}

export const smallChatJsonl = Array.from({ length: 100 }, (_, i) => turnLine(i)).join('\n');
export const largeChatJsonl = Array.from({ length: 10000 }, (_, i) => turnLine(i)).join('\n');
