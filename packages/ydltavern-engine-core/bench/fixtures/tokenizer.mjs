export const text100 = 'Deterministic tokenizer sample with simple ASCII words and punctuation. '.padEnd(100, 'x');
export const text10k = Array.from({ length: 200 }, (_, i) =>
  `Line ${i}: deterministic tokenizer benchmark text with key${i % 31}, punctuation, and repeated words.`,
).join('\n').padEnd(10_000, 'x');
