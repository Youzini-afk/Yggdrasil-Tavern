import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';

interface BackgroundEntry {
  id: string;
  name: string;
  url: string;
  folder?: string;
  thumbnailUrl?: string;
}

// TODO V7: wire to TavernProvider
const STUB_BGS: BackgroundEntry[] = [
  { id: 'bg-default', name: 'Default', url: '', folder: 'Default' },
];

type FitMode = 'cover' | 'contain' | 'tile';

export function BackgroundsDrawer({ drawers }: { drawers: DrawerState }) {
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState<string>('All');
  const [fitMode, setFitMode] = useState<FitMode>('cover');
  const [autoSelect, setAutoSelect] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const folders = ['All', ...Array.from(new Set(STUB_BGS.map((b) => b.folder ?? 'Default')))];
  const filtered = STUB_BGS.filter((b) =>
    (folder === 'All' || b.folder === folder) &&
    (!search.trim() || b.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DrawerShell id="backgrounds" drawers={drawers} side="left" title="Backgrounds">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Library</h3>
          <div className="preset-actions">
            <button type="button" className="menu_button" aria-label="Upload background">
              <i className="fa-solid fa-upload" aria-hidden="true" /> Upload
            </button>
            <button type="button" className="menu_button" aria-label="Open folder on disk">
              <i className="fa-solid fa-folder-open" aria-hidden="true" /> Folder
            </button>
          </div>
        </header>

        <div className="range-block">
          <label>
            <span>Folder:</span>
            <select className="text_pole" value={folder} onChange={(e) => setFolder(e.target.value)}>
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="range-block">
          <input
            type="search"
            className="text_pole"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search backgrounds…"
            aria-label="Search backgrounds"
          />
        </div>

        <div className="bg-grid">
          {filtered.length === 0 && (
            <div className="bg-empty">No backgrounds match this filter.</div>
          )}
          {filtered.map((bg) => (
            <button
              key={bg.id}
              type="button"
              className={`bg-card ${activeId === bg.id ? 'active' : ''}`}
              onClick={() => setActiveId(bg.id)}
              aria-pressed={activeId === bg.id}
              aria-label={`Use ${bg.name}`}
            >
              <div className="bg-card-thumb">
                {bg.thumbnailUrl ? (
                  <img src={bg.thumbnailUrl} alt="" />
                ) : (
                  <div className="bg-card-placeholder">
                    <i className="fa-solid fa-image" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="bg-card-name">{bg.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Display</h3>
        </header>

        <div className="range-block">
          <label>
            <span>Fit mode:</span>
            <select
              className="text_pole"
              value={fitMode}
              onChange={(e) => setFitMode(e.target.value as FitMode)}
            >
              <option value="cover">Cover (fill, may crop)</option>
              <option value="contain">Contain (fit, may letterbox)</option>
              <option value="tile">Tile (repeat)</option>
            </select>
          </label>
        </div>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={autoSelect}
            onChange={(e) => setAutoSelect(e.target.checked)}
          />
          <span>Auto-select background per character</span>
        </label>
      </section>
    </DrawerShell>
  );
}
