const SEEDRANDOM_WIDTH = 256;
const SEEDRANDOM_CHUNKS = 6;
const SEEDRANDOM_DIGITS = 52;
const SEEDRANDOM_START_DENOMINATOR = SEEDRANDOM_WIDTH ** SEEDRANDOM_CHUNKS;
const SEEDRANDOM_SIGNIFICANCE = 2 ** SEEDRANDOM_DIGITS;
const SEEDRANDOM_OVERFLOW = SEEDRANDOM_SIGNIFICANCE * 2;
const SEEDRANDOM_MASK = SEEDRANDOM_WIDTH - 1;

// David Bau seedrandom-compatible ARC4 path used by SillyTavern's deterministic
// harness shims (golden-harness/shims/rng.mjs) without adding a runtime dep.
export function createSeededRandom(seed: string): () => number {
  const key = mixSeedrandomKey(seed, SEEDRANDOM_MASK);
  const arc4 = createArc4(key, SEEDRANDOM_WIDTH, SEEDRANDOM_MASK);

  return () => {
    let numerator = arc4(SEEDRANDOM_CHUNKS);
    let denominator = SEEDRANDOM_START_DENOMINATOR;
    let extra = 0;
    while (numerator < SEEDRANDOM_SIGNIFICANCE) {
      numerator = (numerator + extra) * SEEDRANDOM_WIDTH;
      denominator *= SEEDRANDOM_WIDTH;
      extra = arc4(1);
    }
    while (numerator >= SEEDRANDOM_OVERFLOW) {
      numerator /= 2;
      denominator /= 2;
      extra >>>= 1;
    }
    return (numerator + extra) / denominator;
  };
}

function mixSeedrandomKey(seed: string, mask: number): number[] {
  const key: number[] = [];
  let smear = 0;
  for (let index = 0; index < seed.length; index += 1) {
    const keyIndex = mask & index;
    key[keyIndex] = mask & ((smear ^= (key[keyIndex] ?? 0) * 19) + seed.charCodeAt(index));
  }
  return key;
}

function createArc4(key: readonly number[], width: number, mask: number): (count: number) => number {
  const state: number[] = [];
  const effectiveKey = key.length === 0 ? [0] : key;
  let arcIndex = 0;
  let arcJ = 0;

  while (arcIndex < width) {
    state[arcIndex] = arcIndex;
    arcIndex += 1;
  }
  arcIndex = 0;
  while (arcIndex < width) {
    const stateAtIndex = state[arcIndex] ?? 0;
    arcJ = mask & (arcJ + (effectiveKey[arcIndex % effectiveKey.length] ?? 0) + stateAtIndex);
    state[arcIndex] = state[arcJ] ?? 0;
    state[arcJ] = stateAtIndex;
    arcIndex += 1;
  }

  let outputIndex = 0;
  let outputJ = 0;
  const next = (count: number) => {
    let result = 0;
    while (count > 0) {
      outputIndex = mask & (outputIndex + 1);
      const stateAtIndex = state[outputIndex] ?? 0;
      outputJ = mask & (outputJ + stateAtIndex);
      const stateAtJ = state[outputJ] ?? 0;
      state[outputIndex] = stateAtJ;
      state[outputJ] = stateAtIndex;
      result = result * width + (state[mask & ((state[outputIndex] ?? 0) + (state[outputJ] ?? 0))] ?? 0);
      count -= 1;
    }
    return result;
  };
  next(width);
  return next;
}
