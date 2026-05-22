import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { ThemeForm, DEFAULT_THEME_SETTINGS } from '../../product/Settings/ThemeForm';
import { useTavern } from '../../../app/TavernProvider';

export function UserSettingsDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();

  return (
    <DrawerShell id="user-settings" drawers={drawers} side="left" title="User Settings">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Theme</h3>
        </header>
        <ThemeForm
          settings={tavern.themeSettings ?? DEFAULT_THEME_SETTINGS}
          onChange={(next) => {
            tavern.setThemeSettings(next);
          }}
        />
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>UI Preferences</h3>
        </header>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={tavern.settings?.fastUImode ?? false}
            onChange={(e) => tavern.updateSettings({ fastUImode: e.target.checked })}
          />
          <span>Fast UI mode (disable blur effects)</span>
        </label>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={tavern.settings?.reducedMotion ?? false}
            onChange={(e) => tavern.updateSettings({ reducedMotion: e.target.checked })}
          />
          <span>Reduced motion (disable animations)</span>
        </label>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={tavern.settings?.showTimestamps ?? false}
            onChange={(e) => tavern.updateSettings({ showTimestamps: e.target.checked })}
          />
          <span>Show timestamps on messages</span>
        </label>

        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={tavern.settings?.showTokenCounter ?? false}
            onChange={(e) => tavern.updateSettings({ showTokenCounter: e.target.checked })}
          />
          <span>Show token counter on messages</span>
        </label>

        <div className="range-block">
          <label>
            <span>
              Font scale: <code>{tavern.settings?.fontScale ?? 1}</code>
            </span>
            <input
              type="range"
              min="0.6"
              max="2"
              step="0.05"
              value={tavern.settings?.fontScale ?? 1}
              className="neo-range-input"
              onChange={(e) => tavern.updateSettings({ fontScale: Number.parseFloat(e.target.value) })}
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>
              Chat width: <code>{tavern.settings?.chatWidth ?? 50}%</code>
            </span>
            <input
              type="range"
              min="40"
              max="100"
              step="5"
              value={tavern.settings?.chatWidth ?? 50}
              className="neo-range-input"
              onChange={(e) => tavern.updateSettings({ chatWidth: Number.parseInt(e.target.value, 10) })}
            />
          </label>
        </div>

        <div className="range-block">
          <label>
            <span>Avatar style:</span>
            <select
              className="text_pole"
              value={tavern.settings?.avatarStyle ?? 0}
              onChange={(e) => tavern.updateSettings({ avatarStyle: Number.parseInt(e.target.value, 10) })}
            >
              <option value="0">Square (2px radius)</option>
              <option value="1">Rounded (10px radius)</option>
              <option value="2">Circle</option>
            </select>
          </label>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Persistence</h3>
        </header>
        <div className="preset-actions">
          <button type="button" className="menu_button" aria-label="Export settings">
            <i className="fa-solid fa-file-export" /> Export
          </button>
          <button type="button" className="menu_button" aria-label="Import settings">
            <i className="fa-solid fa-file-import" /> Import
          </button>
          <button type="button" className="menu_button danger" aria-label="Reset to defaults">
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
        </div>
      </section>
    </DrawerShell>
  );
}
