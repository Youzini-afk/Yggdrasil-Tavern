function entry(i) {
  return {
    key: [`k${i}`, `kk${i}`],
    content: `World book content ${i}: ${'c'.repeat(200)}`,
    comment: `entry ${i}`,
    position: i % 7,
    order: i,
    probability: 100,
    depth: i % 5,
    selective: i % 3 === 0,
    constant: i % 17 === 0,
    extensions: { bench: true, index: i },
  };
}

function worldBook(count) {
  return JSON.stringify({
    name: `bench_world_${count}`,
    entries: Object.fromEntries(Array.from({ length: count }, (_, i) => [String(i), entry(i)])),
  });
}

export const smallWorldBook = worldBook(10);
export const largeWorldBook = worldBook(1000);
