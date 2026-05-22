import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createCharacterEntry, deleteById, importById, updateById } from '../src/state/library-crud.ts';
import type { CharacterEntry } from '../src/types/state.ts';

describe('state CRUD helpers', () => {
  it('createCharacterEntry generates an id and default timestamps', () => {
    const created = createCharacterEntry({ name: 'Nyx' }, () => 'char-test', () => '2026-01-01T00:00:00.000Z');
    assert.equal(created.id, 'char-test');
    assert.equal(created.name, 'Nyx');
    assert.equal(created.createdAt, '2026-01-01T00:00:00.000Z');
    assert.equal(created.updatedAt, '2026-01-01T00:00:00.000Z');
  });

  it('updateById mutates matching character fields', () => {
    const entries: CharacterEntry[] = [{ id: 'a', name: 'Aria' }];
    assert.deepEqual(updateById(entries, 'a', { description: 'Updated' }), [{ id: 'a', name: 'Aria', description: 'Updated' }]);
  });

  it('deleteById removes matching character', () => {
    const entries: CharacterEntry[] = [{ id: 'a', name: 'Aria' }, { id: 'b', name: 'Bryn' }];
    assert.deepEqual(deleteById(entries, 'a'), [{ id: 'b', name: 'Bryn' }]);
  });

  it('importById preserves imported id and upserts', () => {
    const entries: CharacterEntry[] = [{ id: 'a', name: 'Aria' }];
    assert.deepEqual(importById(entries, { id: 'a', name: 'Imported' }), [{ id: 'a', name: 'Imported' }]);
    assert.deepEqual(importById(entries, { id: 'c', name: 'Cora' }), [{ id: 'a', name: 'Aria' }, { id: 'c', name: 'Cora' }]);
  });
});
