import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { useTavern, type WorldEntry } from '../../../app/TavernProvider';

const POSITION_OPTIONS: { value: WorldEntry['position']; label: string }[] = [
  { value: 'before_char', label: 'Before character defs' },
  { value: 'after_char', label: 'After character defs' },
  { value: 'before_an', label: "Before author's note" },
  { value: 'after_an', label: "After author's note" },
  { value: 'at_depth', label: 'At depth' },
];

export function WorldInfoDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();
  const selectedBook = tavern.worldBooks.find((book) => book.id === tavern.activeWorldBookId) ?? tavern.worldBooks[0];
  const selectedEntry = selectedBook?.entries.find((entry) => entry.uid === tavern.selectedWorldEntryId) ?? selectedBook?.entries[0];

  const updateEntry = (partial: Partial<WorldEntry>) => {
    if (selectedBook === undefined || selectedEntry === undefined) return;
    tavern.updateWorldEntry(selectedBook.id, selectedEntry.uid, partial);
  };

  const createEntry = () => {
    if (selectedBook === undefined) return;
    tavern.createWorldEntry(selectedBook.id, { key: [], content: '' });
  };

  return (
    <DrawerShell id="world-info" drawers={drawers} side="left" title="World Info">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>World books</h3>
          <div className="preset-actions">
            <button
              type="button"
              className="menu_button"
              aria-label="Create world book"
              onClick={() => {
                const id = tavern.createWorldBook({ name: 'Untitled World Book' });
                tavern.setActiveWorldBook(id);
              }}
            >
              <i className="fa-solid fa-plus" aria-hidden="true" /> New
            </button>
            <button type="button" className="menu_button" aria-label="Import world book">
              <i className="fa-solid fa-file-import" aria-hidden="true" /> Import
            </button>
          </div>
        </header>

        <ul className="worldbook-list" role="list">
          {tavern.worldBooks.map((book) => (
            <li
              key={book.id}
              className={`worldbook-row ${selectedBook?.id === book.id ? 'active' : ''}`}
            >
              <button
                type="button"
                className="worldbook-row-button"
                onClick={() => {
                  tavern.setActiveWorldBook(book.id);
                  tavern.setSelectedWorldEntry(book.entries[0]?.uid ?? null);
                }}
                aria-pressed={selectedBook?.id === book.id}
              >
                <i
                  className={`fa-solid ${book.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}`}
                  aria-hidden="true"
                />
                <span className="worldbook-name">{book.name}</span>
                <span className="worldbook-count">{book.entries.length}</span>
              </button>
              <div className="worldbook-row-actions">
                <button
                  type="button"
                  className="mes_button"
                  aria-label={`Edit ${book.name}`}
                  onClick={() => {
                    tavern.setActiveWorldBook(book.id);
                    tavern.setSelectedWorldEntry(book.entries[0]?.uid ?? null);
                  }}
                >
                  <i className="fa-solid fa-pencil" aria-hidden="true" />
                </button>
                <button type="button" className="mes_button" aria-label={`Export ${book.name}`}>
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="mes_button danger"
                  aria-label={`Delete ${book.name}`}
                  onClick={() => tavern.deleteWorldBook(book.id)}
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
          <h3>Entry editor</h3>
          <small>Selected book: <code>{selectedBook?.name ?? 'None'}</code></small>
          {selectedBook !== undefined && (
            <div className="preset-actions">
              <button type="button" className="menu_button" aria-label="Create world entry" onClick={createEntry}>
                <i className="fa-solid fa-plus" aria-hidden="true" /> New entry
              </button>
            </div>
          )}
        </header>

        {selectedBook === undefined ? (
          <p className="drawer-coming-soon">Create a world book to edit entries.</p>
        ) : selectedEntry === undefined ? (
          <p className="drawer-coming-soon">Create an entry to edit this world book.</p>
        ) : (
          <>
            <div className="range-block">
              <label>
                <span>Primary keys (comma-separated):</span>
                <input
                  type="text"
                  className="text_pole"
                  value={selectedEntry.key.join(', ')}
                  onChange={(e) => updateEntry({ key: splitCsv(e.target.value) })}
                  placeholder="castle, fortress"
                />
              </label>
            </div>

            <div className="range-block">
              <label>
                <span>Secondary keys (optional):</span>
                <input
                  type="text"
                  className="text_pole"
                  value={(selectedEntry.secondaryKey ?? []).join(', ')}
                  onChange={(e) => updateEntry({ secondaryKey: splitCsv(e.target.value) })}
                  placeholder="ancient, ruins"
                />
              </label>
            </div>

            <div className="range-block">
              <label>
                <span>Content:</span>
                <textarea
                  className="textarea_compact"
                  rows={5}
                  value={selectedEntry.content}
                  onChange={(e) => updateEntry({ content: e.target.value })}
                  placeholder="The castle is an ancient fortress…"
                />
              </label>
            </div>

            <div className="range-block">
              <label>
                <span>Position:</span>
                <select
                  className="text_pole"
                  value={selectedEntry.position}
                  onChange={(e) => updateEntry({ position: e.target.value as WorldEntry['position'] })}
                >
                  {POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {selectedEntry.position === 'at_depth' && (
              <div className="range-block">
                <label>
                  <span>Depth: <code>{selectedEntry.depth ?? 4}</code></span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={selectedEntry.depth ?? 4}
                    onChange={(e) => updateEntry({ depth: Number(e.target.value) })}
                    className="neo-range-input"
                  />
                </label>
              </div>
            )}

            <div className="range-block">
              <label>
                <span>Scan depth: <code>{selectedEntry.scanDepth ?? 1}</code></span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={selectedEntry.scanDepth ?? 1}
                  onChange={(e) => updateEntry({ scanDepth: Number(e.target.value) })}
                  className="neo-range-input"
                />
              </label>
            </div>

            <div className="range-block">
              <label>
                <span>Probability: <code>{selectedEntry.probability}%</code></span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={selectedEntry.probability}
                  onChange={(e) => updateEntry({ probability: Number(e.target.value) })}
                  className="neo-range-input"
                />
              </label>
            </div>

            <div className="range-block">
              <label>
                <span>Order: <code>{selectedEntry.order}</code></span>
                <input
                  type="number"
                  className="text_pole"
                  value={selectedEntry.order}
                  onChange={(e) => updateEntry({ order: Number(e.target.value) || 0 })}
                />
              </label>
            </div>

            <label className="checkbox_label">
              <input
                type="checkbox"
                checked={selectedEntry.enabled}
                onChange={(e) => updateEntry({ enabled: e.target.checked })}
              />
              <span>Entry enabled</span>
            </label>

            <div className="preset-actions">
              <button type="button" className="menu_button" aria-label="Save entry">
                <i className="fa-solid fa-floppy-disk" aria-hidden="true" /> Save entry
              </button>
              <button
                type="button"
                className="menu_button"
                aria-label="Duplicate entry"
                onClick={() => tavern.duplicateWorldEntry(selectedBook.id, selectedEntry.uid)}
              >
                <i className="fa-solid fa-copy" aria-hidden="true" /> Duplicate
              </button>
              <button
                type="button"
                className="menu_button danger"
                aria-label="Delete entry"
                onClick={() => tavern.deleteWorldEntry(selectedBook.id, selectedEntry.uid)}
              >
                <i className="fa-solid fa-trash" aria-hidden="true" /> Delete
              </button>
            </div>
          </>
        )}
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Activation diagnostics</h3>
          <small>Last scan results across active world books.</small>
        </header>
        <div className="wi-diagnostics">
          <div className="wi-diagnostic-row">
            <span>Activated entries:</span>
            <code>0</code>
          </div>
          <div className="wi-diagnostic-row">
            <span>Budget used:</span>
            <code>0 / 0</code>
          </div>
          <div className="wi-diagnostic-row">
            <span>Scan iterations:</span>
            <code>0</code>
          </div>
        </div>
      </section>
    </DrawerShell>
  );
}

function splitCsv(value: string): string[] {
  return value.split(',').map((part) => part.trim()).filter(Boolean);
}
