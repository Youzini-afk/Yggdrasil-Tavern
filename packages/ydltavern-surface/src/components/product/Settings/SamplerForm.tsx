import { useCallback, useState, type ChangeEvent } from 'react';

export interface SamplerSettings {
  readonly temperature: number;
  readonly topP: number;
  readonly topK: number;
  readonly frequencyPenalty: number;
  readonly presencePenalty: number;
  readonly maxTokens: number;
}

const DEFAULT_SAMPLER: SamplerSettings = {
  temperature: 0.8,
  topP: 0.9,
  topK: 40,
  frequencyPenalty: 0.0,
  presencePenalty: 0.0,
  maxTokens: 2048,
};

export interface SamplerFormProps {
  readonly settings: SamplerSettings;
  readonly onChange: (settings: SamplerSettings) => void;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  onCommit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  onCommit: () => void;
}): JSX.Element {
  return (
    <label className="settings-field">
      <span className="settings-label">
        {label}
        <span className="settings-value-indicator">{value.toFixed(step < 0.1 ? 2 : 1)}</span>
      </span>
      <input
        className="settings-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(Number.parseFloat(e.target.value))}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
      />
    </label>
  );
}

export function SamplerForm({ settings, onChange }: SamplerFormProps): JSX.Element {
  const [draft, setDraft] = useState(settings);

  const commit = useCallback(() => {
    onChange(draft);
  }, [draft, onChange]);

  const updateField = useCallback(<K extends keyof SamplerSettings>(key: K, value: SamplerSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <section className="settings-form-section">
      <h3 className="settings-form-title">Sampler</h3>
      <div className="settings-form-sliders">
        <SliderInput
          label="Temperature"
          value={draft.temperature}
          min={0}
          max={2}
          step={0.01}
          onChange={(v) => updateField('temperature', v)}
          onCommit={commit}
        />
        <SliderInput
          label="Top P"
          value={draft.topP}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => updateField('topP', v)}
          onCommit={commit}
        />
        <label className="settings-field">
          <span className="settings-label">Top K</span>
          <input
            className="settings-input"
            type="number"
            min={0}
            max={500}
            value={draft.topK}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('topK', Number.parseInt(e.target.value, 10) || 0)}
            onBlur={commit}
          />
        </label>
        <SliderInput
          label="Frequency Penalty"
          value={draft.frequencyPenalty}
          min={-2}
          max={2}
          step={0.01}
          onChange={(v) => updateField('frequencyPenalty', v)}
          onCommit={commit}
        />
        <SliderInput
          label="Presence Penalty"
          value={draft.presencePenalty}
          min={-2}
          max={2}
          step={0.01}
          onChange={(v) => updateField('presencePenalty', v)}
          onCommit={commit}
        />
        <label className="settings-field">
          <span className="settings-label">Max Tokens</span>
          <input
            className="settings-input"
            type="number"
            min={1}
            max={131072}
            step={1}
            value={draft.maxTokens}
            onChange={(e: ChangeEvent<HTMLInputElement>) => updateField('maxTokens', Number.parseInt(e.target.value, 10) || 2048)}
            onBlur={commit}
          />
        </label>
      </div>
    </section>
  );
}

export { DEFAULT_SAMPLER as DEFAULT_SAMPLER_SETTINGS };
