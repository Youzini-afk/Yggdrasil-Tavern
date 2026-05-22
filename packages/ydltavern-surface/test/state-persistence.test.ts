import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { DEFAULT_SAMPLER } from '../src/state/defaults.ts';
import { readPersisted, readSamplerSettings, STORAGE_KEYS, writePersisted } from '../src/state/persistence.ts';

class MemoryStorage {
  private readonly data = new Map<string, string>();

  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
  removeItem(key: string): void { this.data.delete(key); }
  clear(): void { this.data.clear(); }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: new MemoryStorage(),
    configurable: true,
  });
});

describe('state persistence', () => {
  it('round-trips JSON through localStorage', () => {
    const value = { temperature: 0.7, topP: 0.8 };
    writePersisted(STORAGE_KEYS.sampler, value);
    assert.deepEqual(readPersisted(STORAGE_KEYS.sampler, DEFAULT_SAMPLER), { ...DEFAULT_SAMPLER, ...value });
  });

  it('returns fallback for corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEYS.sampler, '{not-json');
    assert.deepEqual(readSamplerSettings(), DEFAULT_SAMPLER);
  });
});
