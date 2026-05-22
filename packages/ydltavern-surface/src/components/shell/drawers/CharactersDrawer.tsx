import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

interface CharacterSummary {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  avatarUrl?: string;
  isGroup?: boolean;
  members?: string[];
}

const STUB_CHARACTERS: CharacterSummary[] = [
  { id: 'sample-aria', name: 'Aria', description: 'Cheerful traveler. Sample character card.', tags: ['fantasy'] },
];

export function CharactersDrawer({ drawers }: { drawers: DrawerState }) {
  const [search, setSearch] = useState('');
  const characters = STUB_CHARACTERS; // TODO V7: wire to TavernProvider

  const filtered = characters.filter((c) =>
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
            <button type="button" className="menu_button" aria-label="Create character">
              <i className="fa-solid fa-plus" aria-hidden="true" /> New
            </button>
            <button type="button" className="menu_button" aria-label="Import character card">
              <i className="fa-solid fa-file-import" aria-hidden="true" /> Import
            </button>
            <button type="button" className="menu_button" aria-label="Create group chat">
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
                className="character-row-button"
                aria-label={`Open ${c.name}`}
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
                <button type="button" className="mes_button" aria-label={`Edit ${c.name}`}>
                  <i className="fa-solid fa-pencil" aria-hidden="true" />
                </button>
                <button type="button" className="mes_button" aria-label={`Duplicate ${c.name}`}>
                  <i className="fa-solid fa-copy" aria-hidden="true" />
                </button>
                <button type="button" className="mes_button" aria-label={`Export ${c.name}`}>
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </button>
                <button type="button" className="mes_button" aria-label={`Delete ${c.name}`}>
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
        <p className="drawer-coming-soon">No active group chat.</p>
      </section>
    </DrawerShell>
  );
}
