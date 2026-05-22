import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

interface WorldBookSummary {
  id: string;
  name: string;
  enabled: boolean;
  entryCount: number;
}

interface WorldEntry {
  uid: string;
  key: string[];
  secondaryKey?: string[];
  content: string;
  position: 'before_char' | 'after_char' | 'before_an' | 'after_an' | 'at_depth';
  depth?: number;
  scanDepth?: number;
  probability: number;
  order: number;
  enabled: boolean;
}

// TODO V7: wire to TavernProvider
const STUB_BOOKS: WorldBookSummary[] = [
  { id: 'main-lore', name: 'Main lore', enabled: true, entryCount: 3 },
  { id: 'character-knowledge', name: 'Character knowledge', enabled: false, entryCount: 7 },
];

const STUB_ENTRY: WorldEntry = {
  uid: 'stub-entry',
  key: ['castle'],
  secondaryKey: [],
  content: '',
  position: 'before_char',
  depth: 4,
  scanDepth: 1,
  probability: 100,
  order: 100,
  enabled: true,
};

const POSITION_OPTIONS: { value: WorldEntry['position']; label: string }[] = [
  { value: 'before_char', label: 'Before character defs' },
  { value: 'after_char', label: 'After character defs' },
  { value: 'before_an', label: "Before author's note" },
  { value: 'after_an', label: "After author's note" },
  { value: 'at_depth', label: 'At depth' },
];

export function WorldInfoDrawer({ drawers }: { drawers: DrawerState }) {
  const [selectedBookId, setSelectedBookId] = useState<string>(STUB_BOOKS[0]!.id);
  const [entry, setEntry] = useState<WorldEntry>(STUB_ENTRY);

  return (
    <DrawerShell id="world-info" drawers={drawers} side="left" title="World Info">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>World books</h3>
          <div className="preset-actions">
            <button type="button" className="menu_button" aria-label="Create world book">
              <i className="fa-solid fa-plus" aria-hidden="true" /> New
            </button>
            <button type="button" className="menu_button" aria-label="Import world book">
              <i className="fa-solid fa-file-import" aria-hidden="true" /> Import
            </button>
          </div>
        </header>

        <ul className="worldbook-list" role="list">
          {STUB_BOOKS.map((book) => (
            <li
              key={book.id}
              className={`worldbook-row ${selectedBookId === book.id ? 'active' : ''}`}
            >
              <button
                type="button"
                className="worldbook-row-button"
                onClick={() => setSelectedBookId(book.id)}
                aria-pressed={selectedBookId === book.id}
              >
                <i
                  className={`fa-solid ${book.enabled ? 'fa-toggle-on' : 'fa-toggle-off'}`}
                  aria-hidden="true"
                />
                <span className="worldbook-name">{book.name}</span>
                <span className="worldbook-count">{book.entryCount}</span>
              </button>
              <div className="worldbook-row-actions">
                <button type="button" className="mes_button" aria-label={`Edit ${book.name}`}>
                  <i className="fa-solid fa-pencil" aria-hidden="true" />
                </button>
                <button type="button" className="mes_button" aria-label={`Export ${book.name}`}>
                  <i className="fa-solid fa-download" aria-hidden="true" />
                </button>
                <button type="button" className="mes_button danger" aria-label={`Delete ${book.name}`}>
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
          <small>Selected book: <code>{STUB_BOOKS.find((b) => b.id === selectedBookId)?.name}</code></small>
        </header>

        <div className="range-block">
          <label>
            <span>Primary keys (comma-separated):</span>
            <input
              type="text"
              className="text_pole"
              value={entry.key.join(', ')}
              onChange={(e) =>
                setEntry((prev) => ({ ...prev, key: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) }))
              }
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
              value={(entry.secondaryKey ?? []).join(', ')}
              onChange={(e) =>
                setEntry((prev) => ({ ...prev, secondaryKey: e.target.value.split(',').map((k) => k.trim()).filter(Boolean) }))
              }
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
              value={entry.content}
              onChange={(e) => setEntry((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="The castle is an ancient fortress…"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Position:</span>
            <select
              className="text_pole"
              value={entry.position}
              onChange={(e) => setEntry((prev) => ({ ...prev, position: e.target.value as WorldEntry['position'] }))}
            >
              {POSITION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
        </div>

        {entry.position === 'at_depth' && (
          <div className="range-block">
            <label>
              <span>Depth: <code>{entry.depth ?? 4}</code></span>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={entry.depth ?? 4}
                onChange={(e) => setEntry((prev) => ({ ...prev, depth: Number(e.target.value) }))}
                className="neo-range-input"
              />
            </label>
          </div>
        )}

        <div className="range-block">
          <label>
            <span>Scan depth: <code>{entry.scanDepth ?? 1}</code></span>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={entry.scanDepth ?? 1}
              onChange={(e) => setEntry((prev) => ({ ...prev, scanDepth: Number(e.target.value) }))}
              className="neo-range-input"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Probability: <code>{entry.probability}%</code></span>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={entry.probability}
              onChange={(e) => setEntry((prev) => ({ ...prev, probability: Number(e.target.value) }))}
              className="neo-range-input"
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Order: <code>{entry.order}</code></span>
            <input
              type="number"
              className="text_pole"
              value={entry.order}
              onChange={(e) => setEntry((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
            />
          </label>
        </div>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={entry.enabled}
            onChange={(e) => setEntry((prev) => ({ ...prev, enabled: e.target.checked }))}
          />
          <span>Entry enabled</span>
        </label>

        <div className="preset-actions">
          <button type="button" className="menu_button" aria-label="Save entry">
            <i className="fa-solid fa-floppy-disk" aria-hidden="true" /> Save entry
          </button>
          <button type="button" className="menu_button" aria-label="Duplicate entry">
            <i className="fa-solid fa-copy" aria-hidden="true" /> Duplicate
          </button>
          <button type="button" className="menu_button danger" aria-label="Delete entry">
            <i className="fa-solid fa-trash" aria-hidden="true" /> Delete
          </button>
        </div>
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
