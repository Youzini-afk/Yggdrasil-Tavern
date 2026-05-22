import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { useTavern, type CharacterEntry } from '../../../app/TavernProvider';

export function CharactersDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();
  const [search, setSearch] = useState('');

  const activeCharacter = tavern.characters.find((character) => character.id === tavern.activeCharacterId);
  const filtered = tavern.characters.filter((c) =>
    !search.trim() ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DrawerShell id="characters" drawers={drawers} side="right" title="Characters">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Library</h3>
          <div className="preset-actions">
            <button
              type="button"
              className="menu_button"
              aria-label="Create character"
              onClick={() => {
                const id = tavern.createCharacter({ name: 'New Character' });
                tavern.setActiveCharacter(id);
              }}
            >
              <i className="fa-solid fa-plus" aria-hidden="true" /> New
            </button>
            <label className="menu_button" aria-label="Import character card">
              <i className="fa-solid fa-file-import" aria-hidden="true" /> Import
              <input
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) importCharacterFile(file, (entry) => tavern.importCharacter(entry));
                  e.currentTarget.value = '';
                }}
              />
            </label>
            <button
              type="button"
              className="menu_button"
              aria-label="Create group chat"
              onClick={() => {
                const id = tavern.createCharacter({ isGroup: true, name: 'New Group', members: [] });
                tavern.setActiveCharacter(id);
              }}
            >
              <i className="fa-solid fa-users" aria-hidden="true" /> Group
            </button>
          </div>
        </header>

        <div className="range-block">
          <input
            type="search"
            className="text_pole"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search characters or tags…"
            aria-label="Search characters"
          />
        </div>

        <ul className="character-list" role="list">
          {filtered.length === 0 && (
            <li className="character-empty">
              <p>No characters match this search.</p>
            </li>
          )}
          {filtered.map((c) => (
            <li key={c.id} className="character-row">
              <button
                type="button"
                className={`character-row-button ${tavern.activeCharacterId === c.id ? 'active' : ''}`}
                aria-label={`Open ${c.name}`}
                aria-pressed={tavern.activeCharacterId === c.id}
                onClick={() => tavern.setActiveCharacter(c.id)}
              >
                <div className="character-avatar">
                  {c.avatarUrl ? (
                    <img src={c.avatarUrl} alt="" />
                  ) : (
                    <div className="character-avatar-placeholder">
                      <i className={`fa-solid ${c.isGroup ? 'fa-users' : 'fa-user'}`} aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="character-meta">
                  <div className="character-name">{c.name}</div>
                  {c.description && (
                    <div className="character-description">{c.description}</div>
                  )}
                  {c.tags && c.tags.length > 0 && (
                    <div className="character-tags">
                      {c.tags.map((t) => (
                        <span key={t} className="character-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </button>
              <div className="character-row-actions">
                <button
                  type="button"
                  className="mes_button"
                  aria-label={`Edit ${c.name}`}
                  onClick={() => tavern.setActiveCharacter(c.id)}
                >
                  <i className="fa-solid fa-pencil" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="mes_button"
                  aria-label={`Duplicate ${c.name}`}
                  onClick={() => tavern.duplicateCharacter(c.id)}
                >
                  <i className="fa-solid fa-copy" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="mes_button"
                  aria-label={`Export ${c.name}`}
                  onClick={() => {
                    const data = tavern.exportCharacter(c.id);
                    if (data) exportToFile(data, `${safeFilename(data.name)}.json`);
                  }}
                >
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="mes_button"
                  aria-label={`Delete ${c.name}`}
                  onClick={() => tavern.deleteCharacter(c.id)}
                >
                  <i className="fa-solid fa-trash" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Group chat members</h3>
          <small>Visible when a group chat is active.</small>
        </header>
        {activeCharacter?.isGroup ? (
          <p className="drawer-coming-soon">
            {(activeCharacter.members ?? []).length} member{(activeCharacter.members ?? []).length === 1 ? '' : 's'} in {activeCharacter.name}.
          </p>
        ) : (
          <p className="drawer-coming-soon">No active group chat.</p>
        )}
      </section>
    </DrawerShell>
  );
}

function exportToFile(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function importCharacterFile(file: File, onImport: (entry: CharacterEntry) => void): void {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      onImport(JSON.parse(String(reader.result)) as CharacterEntry);
    } catch (error) {
      console.error('[YdlTavern] Failed to import character', error);
    }
  };
  reader.readAsText(file);
}

function safeFilename(value: string): string {
  return value.replace(/[^a-z0-9-_]+/gi, '_').replace(/^_+|_+$/g, '') || 'character';
}
