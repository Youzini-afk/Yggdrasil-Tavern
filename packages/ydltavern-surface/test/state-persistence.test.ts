import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { DEFAULT_SAMPLER } from '../src/state/defaults.ts';
import { readConnectionState, readPersisted, readSamplerSettings, STORAGE_KEYS, writePersisted } from '../src/state/persistence.ts';

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

  it('drops invalid connection secret refs when loading persisted state', () => {
    localStorage.setItem(STORAGE_KEYS.connection, JSON.stringify({
      current: { provider: 'openai', model: 'gpt-4o-mini', secretRef: 'secret_ref:inline:OPENAI_API_KEY' },
      profiles: {
        good: { provider: 'openai', model: 'gpt-4o-mini', secretRef: 'secret_ref:env:OPENAI_API_KEY' },
        bad: { provider: 'openai', model: 'gpt-4o-mini', secretRef: 'Bearer test-key' },
      },
    }));

    const state = readConnectionState();
    assert.equal(state.current.secretRef, undefined);
    assert.equal(state.profiles.good?.secretRef, 'secret_ref:env:OPENAI_API_KEY');
    assert.equal(state.profiles.bad?.secretRef, undefined);
  });
});
