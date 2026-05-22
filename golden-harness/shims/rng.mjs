/**
 * RNG shim: Replaces Math.random with seedrandom for deterministic output.
 * Seed: 'ydltavern-fixture-v1'
 */

import originalSeedrandom from 'seedrandom';

const SEED = 'ydltavern-fixture-v1';
const rng = originalSeedrandom(SEED);

function seedrandom(seed, options, callback) {
  // ST's {{random}} macro creates seedrandom('added entropy.', { entropy: true })
  // (SillyTavern public/scripts/macros.js:491-505). In Node, entropy:true mixes
  // process/global entropy and makes fixtures drift between harness runs. Keep
  // the requested seed but suppress entropy mixing for deterministic ST output.
  if (options && typeof options === 'object' && options.entropy === true) {
    return originalSeedrandom(seed, { ...options, entropy: false }, callback);
  }

  return originalSeedrandom(seed, options, callback);
}

// Save original
const _realRandom = Math.random;

// Override Math.random with seeded version
Math.random = () => rng();

// Also override for droll (dice rolling) — we provide deterministic dice
const deterministicDroll = {
  validate: () => true,
  roll: (notation) => {
    // Simple deterministic dice: return fixed value based on notation
    // In real ST, droll parses "2d6+3" etc. We just return 1 for all dice.
    return { rolls: [1], modifier: 0, total: 1, notation: notation || '1d1' };
  },
  parse: (notation) => ({ count: 1, sides: 1, modifier: 0, notation }),
};

globalThis.droll = deterministicDroll;

export { rng, SEED, deterministicDroll, seedrandom };
