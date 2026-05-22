import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { migrateSettingsV1ToV2, STORAGE_KEYS } from '../src/state/persistence.ts';

class MemoryStorage {
  private readonly data = new Map<string, string>();
  getItem(key: string): string | null { return this.data.get(key) ?? null; }
  setItem(key: string, value: string): void { this.data.set(key, value); }
  clear(): void { this.data.clear(); }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true });
});

describe('state migration', () => {
  it('migrates v1 settings into v2 settings and selection active preset', () => {
    localStorage.setItem('ydltavern.settings', JSON.stringify({
      activePreset: 'creative',
      streaming: false,
      bannedTokens: 'bad',
      logitBias: '42:-1',
      fastUImode: true,
      reducedMotion: true,
      showTimestamps: true,
      showTokenCounter: true,
      fontScale: 1.2,
      chatWidth: 65,
      avatarStyle: 2,
    }));

    migrateSettingsV1ToV2();

    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? '{}') as Record<string, unknown>;
    const selection = JSON.parse(localStorage.getItem(STORAGE_KEYS.selection) ?? '{}') as Record<string, unknown>;
    assert.equal(settings.activePreset, 'creative');
    assert.equal(settings.streaming, false);
    assert.equal(settings.fastUImode, true);
    assert.equal(settings.chatWidth, 65);
    assert.equal(selection.activePreset, 'creative');
  });

  it('does not overwrite existing v2 settings', () => {
    localStorage.setItem('ydltavern.settings', JSON.stringify({ activePreset: 'legacy' }));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ activePreset: 'v2' }));
    migrateSettingsV1ToV2();
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) ?? '{}') as Record<string, unknown>;
    assert.equal(settings.activePreset, 'v2');
  });
});
