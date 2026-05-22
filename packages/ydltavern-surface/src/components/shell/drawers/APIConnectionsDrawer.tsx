import React, { useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { ConnectionForm } from '../../product/Settings/ConnectionForm';
import type { ConnectionSettings as ConnectionFormSettings } from '../../product/Settings/ConnectionForm';
import { useTavern } from '../../../app/TavernProvider';

const PROVIDER_GROUPS = [
  {
    label: 'Chat completion',
    providers: [
      { value: 'openai', label: 'OpenAI', requires: ['baseURL', 'apiKey', 'model'] as const },
      { value: 'anthropic', label: 'Anthropic Claude', requires: ['apiKey', 'model'] as const },
      { value: 'gemini', label: 'Google Gemini', requires: ['apiKey', 'model'] as const },
      { value: 'mistral', label: 'Mistral', requires: ['apiKey', 'model'] as const },
      { value: 'deepseek', label: 'DeepSeek', requires: ['apiKey', 'model'] as const },
      { value: 'openrouter', label: 'OpenRouter', requires: ['apiKey', 'model'] as const },
      { value: 'cohere', label: 'Cohere', requires: ['apiKey', 'model'] as const },
      { value: 'groq', label: 'Groq', requires: ['apiKey', 'model'] as const },
      { value: 'custom-openai', label: 'Custom (OpenAI-compatible)', requires: ['baseURL', 'apiKey', 'model'] as const },
    ],
  },
  {
    label: 'Text completion',
    providers: [
      { value: 'kobold', label: 'KoboldAI Classic', requires: ['baseURL'] as const },
      { value: 'koboldcpp', label: 'KoboldCPP', requires: ['baseURL'] as const },
      { value: 'textgen-webui', label: 'TextGen WebUI', requires: ['baseURL'] as const },
      { value: 'ollama', label: 'Ollama', requires: ['baseURL', 'model'] as const },
      { value: 'llama-cpp', label: 'Llama.cpp Server', requires: ['baseURL'] as const },
      { value: 'horde', label: 'AI Horde', requires: ['apiKey', 'model'] as const },
      { value: 'novelai', label: 'NovelAI', requires: ['apiKey', 'model'] as const },
      { value: 'mancer', label: 'Mancer', requires: ['apiKey', 'baseURL'] as const },
      { value: 'aphrodite', label: 'Aphrodite', requires: ['baseURL'] as const },
      { value: 'tabbyapi', label: 'TabbyAPI', requires: ['baseURL', 'apiKey'] as const },
    ],
  },
];

export function APIConnectionsDrawer({ drawers }: { drawers: DrawerState }) {
  const tavern = useTavern();
  const [profileName, setProfileName] = useState('');

  const connectionFormSettings: ConnectionFormSettings = {
    provider: tavern.connectionSettings.provider,
    model: tavern.connectionSettings.model,
    secretRef: tavern.connectionSettings.secretRef ?? '',
    apiBaseUrl: tavern.connectionSettings.baseUrl ?? '',
    stream: tavern.settings.streaming,
  };

  const updateConnectionFormSettings = (next: ConnectionFormSettings) => {
    tavern.updateConnectionSettings({
      provider: next.provider,
      model: next.model,
      secretRef: next.secretRef,
      baseUrl: next.apiBaseUrl,
    });
    tavern.updateSettings({ streaming: next.stream });
  };

  return (
    <DrawerShell id="api-connections" drawers={drawers} side="left" title="API Connections">
      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Provider</h3>
          <small>All connections route through Yggdrasil's outbound substrate. Secrets use secret_ref only.</small>
        </header>
        <div className="range-block">
          <label>
            <span>Active provider:</span>
            <select
              className="text_pole"
              value={tavern.connectionSettings.provider}
              onChange={(e) => tavern.updateConnectionSettings({ provider: e.target.value })}
            >
              {PROVIDER_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.providers.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Configuration</h3>
        </header>
        <div className="range-block">
          <label>
            <span>Saved profile:</span>
            <select
              className="text_pole"
              value={tavern.activeConnectionProfile ?? ''}
              onChange={(e) => {
                if (e.target.value) tavern.loadConnectionProfile(e.target.value);
              }}
            >
              <option value="">— Pick a profile —</option>
              {Object.keys(tavern.connectionProfiles).map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>
        </div>
        <ConnectionForm
          key={`${tavern.activeConnectionProfile ?? 'current'}:${tavern.connectionSettings.provider}:${tavern.connectionSettings.model}`}
          settings={connectionFormSettings}
          onChange={updateConnectionFormSettings}
        />
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Connection profiles</h3>
          <small>Save and switch between named connection profiles.</small>
        </header>
        <div className="range-block">
          <label>
            <span>Profile name:</span>
            <input
              type="text"
              className="text_pole"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="My OpenAI Profile"
            />
          </label>
        </div>
        <div className="preset-actions">
          <button
            type="button"
            className="menu_button"
            aria-label="Save connection profile"
            onClick={() => {
              tavern.saveConnectionProfile(profileName);
              setProfileName('');
            }}
            disabled={profileName.trim().length === 0}
          >
            <i className="fa-solid fa-floppy-disk" aria-hidden="true" /> Save profile
          </button>
          <button type="button" className="menu_button" aria-label="Test connection">
            <i className="fa-solid fa-plug-circle-check" aria-hidden="true" /> Test
          </button>
          <button
            type="button"
            className="menu_button"
            aria-label="Delete profile"
            onClick={() => tavern.deleteConnectionProfile(tavern.activeConnectionProfile ?? profileName)}
            disabled={(tavern.activeConnectionProfile ?? profileName).trim().length === 0}
          >
            <i className="fa-solid fa-trash" aria-hidden="true" /> Delete
          </button>
        </div>
      </section>

      <section className="drawer-section">
        <header className="drawer-section-header">
          <h3>Status</h3>
        </header>
        <div className="connection-status">
          <span className="status-dot status-dot-idle" aria-hidden="true" />
          <span>Not connected</span>
        </div>
      </section>
    </DrawerShell>
  );
}
