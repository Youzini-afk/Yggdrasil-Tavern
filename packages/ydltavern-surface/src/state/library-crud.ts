import type { CharacterEntry } from '../types/state.js';

export function createCharacterEntry(entry: Partial<CharacterEntry>, createId: () => string, now: () => string): CharacterEntry {
  const timestamp = now();
  return {
    id: entry.id ?? createId(),
    name: entry.name ?? 'New Character',
    ...entry,
    createdAt: entry.createdAt ?? timestamp,
    updatedAt: entry.updatedAt ?? timestamp,
  };
}

export function updateById<T extends { readonly id: string }>(entries: readonly T[], id: string, partial: Partial<T>): T[] {
  return entries.map((entry) => entry.id === id ? { ...entry, ...partial, id } : entry);
}

export function deleteById<T extends { readonly id: string }>(entries: readonly T[], id: string): T[] {
  return entries.filter((entry) => entry.id !== id);
}

export function importById<T extends { readonly id: string }>(entries: readonly T[], imported: T): T[] {
  const exists = entries.some((entry) => entry.id === imported.id);
  return exists ? entries.map((entry) => entry.id === imported.id ? imported : entry) : [...entries, imported];
}
