import { useCallback, useState, type ChangeEvent, type FocusEvent } from 'react';
import { validateSecretRef } from '../../../state/secrets.js';

export interface ConnectionSettings {
  readonly provider: string;
  readonly model: string;
  readonly secretRef: string;
  readonly apiBaseUrl: string;
  readonly stream: boolean;
}

const DEFAULT_CONNECTION: ConnectionSettings = {
  provider: 'openai',
  model: 'gpt-4o-mini',
  secretRef: 'secret_ref:store:OPENAI_API_KEY',
  apiBaseUrl: '',
  stream: true,
};

const PROVIDERS = [
  'openai', 'deepseek', 'anthropic', 'openrouter', 'custom',
] as const;

const ENGINE_SUPPORTED_PROVIDERS = new Set(['openai', 'deepseek', 'anthropic', 'openrouter']);

export interface ConnectionFormProps {
  readonly settings: ConnectionSettings;
  readonly onChange: (settings: ConnectionSettings) => void;
}

export function ConnectionForm({ settings, onChange }: ConnectionFormProps): JSX.Element {
  const [draft, setDraft] = useState(settings);
  const [secretError, setSecretError] = useState<string | undefined>();

  const commit = useCallback((nextDraft: ConnectionSettings = draft) => {
    const error = validateSecretRef(nextDraft.secretRef);
    setSecretError(error);
    if (error !== undefined) return;
    onChange(nextDraft);
  }, [draft, onChange]);

  const handleCommitBlur = useCallback(() => {
    commit();
  }, [commit]);

  const updateField = useCallback(<K extends keyof ConnectionSettings>(key: K, value: ConnectionSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleChange = useCallback((key: keyof ConnectionSettings) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    if (key === 'secretRef') {
      setSecretError(validateSecretRef(String(value)));
    }
    updateField(key, value as never);
  }, [updateField]);

  const handleSecretChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const nextDraft = { ...draft, secretRef: e.target.value };
    setDraft(nextDraft);
    setSecretError(validateSecretRef(nextDraft.secretRef));
  }, [draft]);

  const handleSecretBlurCurrent = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const nextDraft = { ...draft, secretRef: e.target.value };
    setDraft(nextDraft);
    commit(nextDraft);
  }, [draft, commit]);

  return (
    <section className="settings-form-section">
      <h3 className="settings-form-title">Connection</h3>
      <div className="settings-form-grid">
        <label className="settings-field">
          <span className="settings-label">Provider</span>
          <select
            className="settings-input"
            value={draft.provider}
            onChange={handleChange('provider')}
            onBlur={handleCommitBlur}
          >
            {PROVIDERS.map((p) => (
              <option key={p} value={p} disabled={!ENGINE_SUPPORTED_PROVIDERS.has(p)}>{p}{ENGINE_SUPPORTED_PROVIDERS.has(p) ? '' : ' (unsupported)'}</option>
            ))}
          </select>
        </label>
        <label className="settings-field">
          <span className="settings-label">Model</span>
          <input
            className="settings-input"
            type="text"
            value={draft.model}
            onChange={handleChange('model')}
            onBlur={handleCommitBlur}
            placeholder="gpt-4o-mini"
          />
        </label>
        <label className="settings-field">
          <span className="settings-label">Secret Ref</span>
          <input
            className={`settings-input${secretError ? ' settings-input-error' : ''}`}
            type="text"
            value={draft.secretRef}
            onChange={handleSecretChange}
            onBlur={handleSecretBlurCurrent}
            placeholder="secret_ref:store:OPENAI_API_KEY"
          />
          {secretError !== undefined ? (
            <span className="settings-field-error">{secretError}</span>
          ) : null}
        </label>
        <label className="settings-field">
          <span className="settings-label">API Base URL (not used for live calls)</span>
          <input
            className="settings-input"
            type="text"
            value={draft.apiBaseUrl}
            onChange={handleChange('apiBaseUrl')}
            onBlur={handleCommitBlur}
            placeholder="https://api.openai.com/v1"
          />
          <span className="settings-help-text">Live provider calls use fixed engine host mappings; this does not override outbound host.</span>
        </label>
        <label className="settings-field settings-field-row">
          <span className="settings-label">Stream</span>
          <input
            className="settings-checkbox"
            type="checkbox"
            checked={draft.stream}
            onChange={handleChange('stream')}
            onBlur={handleCommitBlur}
          />
        </label>
      </div>
      <div className="settings-form-actions">
        <button
          type="button"
          className="settings-button"
          disabled
          title="Save a profile, then send a message to verify the connection through Yggdrasil."
        >
          Test after save
        </button>
      </div>
    </section>
  );
}

export { DEFAULT_CONNECTION as DEFAULT_CONNECTION_SETTINGS };
