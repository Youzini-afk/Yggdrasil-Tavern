import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { useTavern } from '../../../app/TavernProvider';

export function BackgroundsDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState<string>('All');

  const folders = ['All', ...Array.from(new Set(tavern.backgrounds.map((b) => b.folder ?? 'Default')))];
  const filtered = tavern.backgrounds.filter((b) =>
    (folder === 'All' || b.folder === folder) &&
    (!search.trim() || b.name.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <DrawerShell id="backgrounds" drawers={drawers} side="left" title="Backgrounds">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Library</h3>
          <div className="preset-actions">
            <label className="menu_button" aria-label="Upload background">
              <i className="fa-solid fa-upload" aria-hidden="true" /> Upload
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file, tavern.uploadBackground);
                  e.currentTarget.value = '';
                }}
              />
            </label>
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
              className={`bg-card ${tavern.activeBackgroundId === bg.id ? 'active' : ''}`}
              onClick={() => tavern.setActiveBackground(bg.id)}
              aria-pressed={tavern.activeBackgroundId === bg.id}
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
              value={tavern.backgroundDisplaySettings.fitMode}
              onChange={(e) => tavern.setBackgroundFitMode(e.target.value as typeof tavern.backgroundDisplaySettings.fitMode)}
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
            checked={tavern.backgroundDisplaySettings.autoSelectByCharacter}
            onChange={(e) => tavern.setBackgroundAutoSelect(e.target.checked)}
          />
          <span>Auto-select background per character</span>
        </label>
      </section>
    </DrawerShell>
  );
}

function handleFile(file: File, uploadBackground: (entry: { name: string; url: string; thumbnailUrl: string }) => string): void {
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = String(reader.result);
    uploadBackground({
      name: file.name.replace(/\.\w+$/, ''),
      url: dataUrl,
      thumbnailUrl: dataUrl,
    });
  };
  reader.readAsDataURL(file);
}
