import React, { useEffect, useState } from 'react';
import { DrawerShell } from '../DrawerShell';
import type { DrawerState } from '../useDrawers';
import { ConnectionForm } from '../../product/Settings/ConnectionForm';
import type { ConnectionSettings as ConnectionFormSettings } from '../../product/Settings/ConnectionForm';
import { useTavern } from '../../../app/TavernProvider';
import {
  defaultSecretName,
  deleteSecret,
  listSecrets,
  normalizeSecretRef,
  secretRefForProject,
  secretRefForStore,
  secretStoreHealth,
  storeProjectSecret,
  storeSecret,
  validateSecretRef,
} from '../../../state/secrets.js';

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

const ENGINE_SUPPORTED_PROVIDERS = new Set(['openai', 'anthropic', 'deepseek', 'openrouter']);

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
    if (validateSecretRef(next.secretRef) !== undefined) return;
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
              onChange={(e) => {
                if (ENGINE_SUPPORTED_PROVIDERS.has(e.target.value)) tavern.updateConnectionSettings({ provider: e.target.value });
              }}
            >
              {PROVIDER_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.providers.map((p) => (
                    <option key={p.value} value={p.value} disabled={!ENGINE_SUPPORTED_PROVIDERS.has(p.value)}>
                      {p.label}{ENGINE_SUPPORTED_PROVIDERS.has(p.value) ? '' : ' (unsupported)'}
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
        <p className="settings-help-text">
          Custom API base URLs are stored for profile metadata only and are not used for live provider calls.
        </p>
      </section>

      <APIKeySection
        provider={tavern.connectionSettings.provider}
        currentSecretRef={tavern.connectionSettings.secretRef ?? ''}
        projectId={tavern.projectId}
        onSecretRefChange={(ref) => {
          const normalized = normalizeSecretRef(ref);
          if (normalized !== undefined) tavern.updateConnectionSettings({ secretRef: normalized });
        }}
      />

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

      <StatusSection secretRef={tavern.connectionSettings.secretRef ?? ''} />
    </DrawerShell>
  );
}

export function APIKeySection({ provider, currentSecretRef, projectId, onSecretRefChange }: {
  provider: string;
  currentSecretRef: string;
  projectId?: string;
  onSecretRefChange: (ref: string) => void;
}) {
  const defaultName = defaultSecretName(provider);
  const [scope, setScope] = useState<'platform' | 'project'>(currentSecretRef.startsWith('secret_ref:project:') ? 'project' : 'platform');
  const [secretName, setSecretName] = useState(defaultName);
  const [keyValue, setKeyValue] = useState('');
  const [savedKeys, setSavedKeys] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'err' | 'idle'; message: string }>({ kind: 'idle', message: '' });
  const [storeAvailable, setStoreAvailable] = useState<boolean | null>(null);

  const refresh = async () => {
    try {
      const names = await listSecrets();
      setSavedKeys(names);
      setStoreAvailable(true);
    } catch (err) {
      setStoreAvailable(false);
      setStatus({ kind: 'err', message: `secret-store unavailable: ${(err as Error).message}` });
    }
  };

  useEffect(() => { refresh().catch(() => {}); }, []);

  useEffect(() => { setSecretName(defaultSecretName(provider)); }, [provider]);

  useEffect(() => {
    setScope(currentSecretRef.startsWith('secret_ref:project:') ? 'project' : 'platform');
  }, [currentSecretRef]);

  const onSave = async () => {
    if (!keyValue.trim() || !secretName.trim()) return;
    const trimmedName = secretName.trim();
    setBusy(true);
    setStatus({ kind: 'idle', message: '' });
    try {
      const nextRef = scope === 'project' ? secretRefForProject(trimmedName) : secretRefForStore(trimmedName);
      const result = scope === 'project'
        ? await storeProjectSecret(projectId, trimmedName, keyValue)
        : await storeSecret(trimmedName, keyValue);
      setKeyValue('');
      setStatus({
        kind: 'ok',
        message: result.created ? `Saved ${scope} key as ${trimmedName}` : `Updated ${scope} key ${trimmedName}`,
      });
      onSecretRefChange(nextRef);
      if (scope === 'platform') await refresh();
    } catch (err) {
      setStatus({ kind: 'err', message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (name: string) => {
    setBusy(true);
    try {
      await deleteSecret(name);
      if (currentSecretRef === secretRefForStore(name)) {
        onSecretRefChange('');
      }
      await refresh();
      setStatus({ kind: 'ok', message: `Removed ${name}` });
    } catch (err) {
      setStatus({ kind: 'err', message: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const onUseExisting = (name: string) => {
    setSecretName(name);
    onSecretRefChange(secretRefForStore(name));
  };

  return (
    <section className="drawer-section">
      <header className="drawer-section-header">
        <h3>API Key</h3>
        <small>
          Stored encrypted in the host secret store. Never sent to model providers except as request headers.
        </small>
      </header>

      {storeAvailable === false && (
        <div className="connection-status status-error">
          Secret store unavailable. Verify <code>official/secret-store-lab</code> is loaded
          in your host profile.
        </div>
      )}

      <div className="range-block">
        <label>
          <input
            type="radio"
            name="api-key-scope"
            value="platform"
            checked={scope === 'platform'}
            onChange={() => setScope('platform')}
          />
          <span>Platform-wide (shared with all projects)</span>
        </label>
        <label>
          <input
            type="radio"
            name="api-key-scope"
            value="project"
            checked={scope === 'project'}
            onChange={() => setScope('project')}
          />
          <span>This project only</span>
        </label>
      </div>

      <div className="range-block">
        <label>
          <span>Secret name:</span>
          <input
            type="text"
            className="text_pole"
            value={secretName}
            onChange={(e) => setSecretName(e.target.value)}
            placeholder={defaultName}
          />
        </label>
      </div>
      <div className="range-block">
        <label>
          <span>API key:</span>
          <input
            type="password"
            className="text_pole"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            placeholder="Paste key, then save"
            autoComplete="off"
          />
        </label>
      </div>
      <div className="preset-actions">
        <button
          type="button"
          className="menu_button"
          onClick={onSave}
          disabled={busy || !keyValue.trim() || !secretName.trim()}
        >
          <i className="fa-solid fa-floppy-disk" aria-hidden="true" /> Save key
        </button>
      </div>

      {savedKeys.length > 0 && (
        <div className="range-block">
          <label className="ydl-saved-keys-label">
            <span>Saved keys:</span>
          </label>
          <ul className="ydl-saved-keys-list">
            {savedKeys.map((name) => {
              const ref = secretRefForStore(name);
              const inUse = currentSecretRef === ref;
              return (
                <li key={name} className="ydl-saved-key-row">
                  <span className="ydl-saved-key-name">
                    {name} {inUse && <em>(in use)</em>}
                  </span>
                  <span className="ydl-saved-key-actions">
                    {!inUse && (
                      <button
                        type="button"
                        className="menu_button menu_button_compact"
                        onClick={() => onUseExisting(name)}
                      >
                        Use
                      </button>
                    )}
                    <button
                      type="button"
                      className="menu_button menu_button_compact menu_button_danger"
                      onClick={() => onDelete(name)}
                      disabled={busy}
                    >
                      <i className="fa-solid fa-trash" aria-hidden="true" />
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {status.kind !== 'idle' && (
        <div className={`connection-status ${status.kind === 'ok' ? 'status-ok' : 'status-error'}`}>
          {status.message}
        </div>
      )}
    </section>
  );
}

function StatusSection({ secretRef }: { secretRef: string }) {
  const [storeStatus, setStoreStatus] = useState<{
    kind: 'ok' | 'err' | 'unknown';
    keySource?: string;
    secretCount?: number;
  }>({ kind: 'unknown' });

  useEffect(() => {
    secretStoreHealth()
      .then((h) => setStoreStatus({ kind: 'ok', keySource: h.key_source, secretCount: h.secret_count }))
      .catch(() => setStoreStatus({ kind: 'err' }));
  }, []);

  const hasSecret = normalizeSecretRef(secretRef) !== undefined;
  const hasProjectSecret = secretRef.startsWith('secret_ref:project:');

  return (
    <section className="drawer-section">
      <header className="drawer-section-header">
        <h3>Status</h3>
      </header>
      <div className="connection-status">
        <span
          className={`status-dot ${
            storeStatus.kind === 'ok' && hasSecret ? 'status-dot-ok' : 'status-dot-idle'
          }`}
          aria-hidden="true"
        />
        <span>
          {storeStatus.kind === 'unknown' && 'Checking secret store…'}
          {storeStatus.kind === 'err' && 'Secret store unavailable'}
          {storeStatus.kind === 'ok' && (
            <>
              Secret store ready ({storeStatus.secretCount} stored, key via {storeStatus.keySource}).
              {!hasSecret && ' No API key selected for this profile.'}
              {hasSecret && (hasProjectSecret ? ' Project API key configured.' : ' API key configured.')}
            </>
          )}
        </span>
      </div>
    </section>
  );
}
