import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { SEED_BACKGROUND, SEED_CHARACTER, SEED_PERSONA, SEED_WORLDBOOK } from '../src/state/defaults.ts';
import { readBackgrounds, readCharacters, readPersonas, readWorldBooks, STORAGE_KEYS } from '../src/state/persistence.ts';

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
  clear(): void { this.data.clear(); }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
});

describe('state seed data', () => {
  it('empty localStorage produces seed entries', () => {
    assert.deepEqual(readPersonas(), [SEED_PERSONA]);
    assert.deepEqual(readCharacters(), [SEED_CHARACTER]);
    assert.deepEqual(readWorldBooks(), [SEED_WORLDBOOK]);
    assert.deepEqual(readBackgrounds(), [SEED_BACKGROUND]);
  });

  it('empty persisted arrays fall back to seed entries', () => {
    localStorage.setItem(STORAGE_KEYS.characters, '[]');
    localStorage.setItem(STORAGE_KEYS.personas, '[]');
    assert.deepEqual(readCharacters(), [SEED_CHARACTER]);
    assert.deepEqual(readPersonas(), [SEED_PERSONA]);
  });
});
