import React from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { SamplerForm } from '../../product/Settings/SamplerForm';
import { useTavern } from '../../../app/TavernProvider';

export function AIConfigDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();

  return (
    <DrawerShell id="ai-config" drawers={drawers} side="left" title="AI Response Configuration">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Preset</h3>
        </header>
        <div className="range-block">
          <label className="checkbox_label">
            <span>Active preset:</span>
            <select
              className="text_pole"
              value={tavern.settings.activePreset}
              onChange={(e) => tavern.setActivePreset(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="creative">Creative</option>
              <option value="precise">Precise</option>
              <option value="custom">Custom...</option>
            </select>
          </label>
          <div className="preset-actions">
            <button type="button" className="menu_button" aria-label="Save preset">
              <i className="fa-solid fa-save" /> Save
            </button>
            <button type="button" className="menu_button" aria-label="Import preset">
              <i className="fa-solid fa-file-import" /> Import
            </button>
            <button type="button" className="menu_button" aria-label="Export preset">
              <i className="fa-solid fa-file-export" /> Export
            </button>
            <button type="button" className="menu_button danger" aria-label="Delete preset">
              <i className="fa-solid fa-trash" /> Delete
            </button>
          </div>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Sampler</h3>
        </header>
        <SamplerForm
          settings={tavern.samplerSettings}
          onChange={(next) => tavern.updateSamplerSettings(next)}
        />
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Streaming</h3>
        </header>
        <label className="checkbox_label">
          <input
            type="checkbox"
            checked={tavern.settings?.streaming ?? true}
            onChange={(e) => {
              tavern.updateSettings({ streaming: e.target.checked });
            }}
          />
          <span>Enable streaming responses</span>
        </label>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Banned Tokens</h3>
          <small>One per line. Tokens listed here will be excluded from generation.</small>
        </header>
        <textarea
          className="textarea_compact"
          rows={3}
          placeholder="banned_token_1&#10;banned_token_2"
          aria-label="Banned tokens"
          value={tavern.settings?.bannedTokens ?? ''}
          onChange={(e) => {
            tavern.updateSettings({ bannedTokens: e.target.value });
          }}
        />
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Logit Bias</h3>
          <small>Token:bias pairs (e.g., &quot;the:-100&quot;). Empty for none.</small>
        </header>
        <textarea
          className="textarea_compact"
          rows={3}
          placeholder="token1:-50&#10;token2:100"
          aria-label="Logit bias"
          value={tavern.settings?.logitBias ?? ''}
          onChange={(e) => {
            tavern.updateSettings({ logitBias: e.target.value });
          }}
        />
      </section>
    </DrawerShell>
  );
}
