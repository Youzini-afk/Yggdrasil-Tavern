import { useCallback } from 'react';
import { BUILT_IN_THEMES, getThemeById, DARK_THEME } from '../themes/built-in-themes.js';
import type { TavernThemeSettings, ThemeDensity } from '../themes/theme-types.js';

const DENSITY_OPTIONS: readonly { value: ThemeDensity; label: string }[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
];

const FONT_FAMILIES: readonly { value: string; label: string }[] = [
  { value: '"Inter", ui-sans-serif, system-ui, sans-serif', label: 'Inter (Sans)' },
  { value: '"Fraunces", "Iowan Old Style", Georgia, serif', label: 'Fraunces (Serif)' },
  { value: '"JetBrains Mono", "SF Mono", Menlo, monospace', label: 'JetBrains Mono (Mono)' },
  { value: '"Iowan Old Style", Georgia, serif', label: 'Iowan (Serif)' },
  { value: 'ui-sans-serif, system-ui, sans-serif', label: 'System UI (Sans)' },
];

export interface ThemeFormProps {
  readonly settings: TavernThemeSettings;
  readonly onChange: (settings: TavernThemeSettings) => void;
}

function ThemePreviewCard({
  themeId,
  selected,
  onSelect,
}: {
  themeId: string;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  const theme = getThemeById(themeId);
  return (
    <button
      type="button"
      className={`theme-card${selected ? ' theme-card-selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span
        className="theme-card-swatch"
        style={{
          background: `linear-gradient(135deg, ${theme.tokens.bgPrimary}, ${theme.tokens.bgSecondary})`,
          border: `1px solid ${theme.tokens.border}`,
          color: theme.tokens.fgPrimary,
        }}
      >
        <span className="theme-card-swatch-text">Aa</span>
      </span>
      <span className="theme-card-name">{theme.label ?? theme.name}</span>
    </button>
  );
}

export function ThemeForm({ settings, onChange }: ThemeFormProps): JSX.Element {
  const currentTheme = getThemeById(settings.themeId);

  const handleThemeSelect = useCallback((themeId: string) => {
    onChange({ ...settings, themeId });
  }, [settings, onChange]);

  const handleDensityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, density: e.target.value as ThemeDensity });
  }, [settings, onChange]);

  const handleFontChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...settings, fontFamily: e.target.value });
  }, [settings, onChange]);

  return (
    <section className="settings-form-section">
      <h3 className="settings-form-title">Theme</h3>

      <div className="settings-field">
        <span className="settings-label">Color Theme</span>
        <div className="theme-card-grid">
          {BUILT_IN_THEMES.map((t) => (
            <ThemePreviewCard
              key={t.name}
              themeId={t.name}
              selected={currentTheme.name === t.name}
              onSelect={() => handleThemeSelect(t.name)}
            />
          ))}
        </div>
      </div>

      <div className="settings-form-grid">
        <label className="settings-field">
          <span className="settings-label">Density</span>
          <select
            className="settings-input"
            value={settings.density}
            onChange={handleDensityChange}
          >
            {DENSITY_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </label>
        <label className="settings-field">
          <span className="settings-label">Font Family</span>
          <select
            className="settings-input"
            value={settings.fontFamily}
            onChange={handleFontChange}
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}

export const DEFAULT_THEME_SETTINGS: TavernThemeSettings = {
  themeId: DARK_THEME.name,
  density: DARK_THEME.density,
  fontFamily: DARK_THEME.font.family,
};

export type { TavernThemeSettings };
