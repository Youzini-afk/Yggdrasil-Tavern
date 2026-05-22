import { useCallback, useState, type ChangeEvent } from 'react';

export interface PersonaSettings {
  readonly name: string;
  readonly description: string;
  readonly avatarUrl: string;
}

const DEFAULT_PERSONA: PersonaSettings = {
  name: 'User',
  description: '',
  avatarUrl: '',
};

export interface PersonaFormProps {
  readonly settings: PersonaSettings;
  readonly onChange: (settings: PersonaSettings) => void;
}

export function PersonaForm({ settings, onChange }: PersonaFormProps): JSX.Element {
  const [draft, setDraft] = useState(settings);

  const commit = useCallback(() => {
    onChange(draft);
  }, [draft, onChange]);

  const updateField = useCallback(<K extends keyof PersonaSettings>(key: K, value: PersonaSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <section className="settings-form-section">
      <h3 className="settings-form-title">Persona</h3>
      <div className="settings-form-grid">
        <label className="settings-field">
          <span className="settings-label">Persona Name</span>
          <input
            className="settings-input"
            type="text"
            value={draft.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
            onBlur={commit}
            placeholder="User"
          />
        </label>
        <label className="settings-field settings-field-textarea">
          <span className="settings-label">Description</span>
          <textarea
            className="settings-textarea"
            value={draft.description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateField('description', e.target.value)}
            onBlur={commit}
            placeholder="Describe your persona..."
            rows={4}
          />
        </label>
        <label className="settings-field">
          <span className="settings-label">Avatar URL</span>
          <input
            className="settings-input"
            type="text"
            value={draft.avatarUrl}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('avatarUrl', e.target.value)}
            onBlur={commit}
            placeholder="https://example.com/avatar.png"
          />
        </label>
      </div>
    </section>
  );
}

export { DEFAULT_PERSONA as DEFAULT_PERSONA_SETTINGS };
