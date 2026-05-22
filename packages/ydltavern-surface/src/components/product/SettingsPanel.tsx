import { useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import {
  ConnectionForm,
  type ConnectionSettings,
  DEFAULT_CONNECTION_SETTINGS,
  SamplerForm,
  type SamplerSettings,
  DEFAULT_SAMPLER_SETTINGS,
  PersonaForm,
  type PersonaSettings,
  DEFAULT_PERSONA_SETTINGS,
  ThemeForm,
  type TavernThemeSettings,
  DEFAULT_THEME_SETTINGS,
} from './Settings/index.js';

type SettingsTab = 'connection' | 'sampler' | 'persona' | 'theme';

const TABS: readonly { id: SettingsTab; label: string }[] = [
  { id: 'connection', label: 'Connection' },
  { id: 'sampler', label: 'Sampler' },
  { id: 'persona', label: 'Persona' },
  { id: 'theme', label: 'Theme' },
];

const lsConnection = (): ConnectionSettings => safeGet('ydltavern.connection', DEFAULT_CONNECTION_SETTINGS);
const lsSampler = (): SamplerSettings => safeGet('ydltavern.sampler', DEFAULT_SAMPLER_SETTINGS);
const lsPersona = (): PersonaSettings => safeGet('ydltavern.persona', DEFAULT_PERSONA_SETTINGS);
const lsTheme = (): TavernThemeSettings => safeGet('ydltavern.themeSettings', DEFAULT_THEME_SETTINGS);

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function debounceSet(key: string, value: unknown, delay = 300) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    }, delay);
  };
}

export interface SettingsPanelProps {
  readonly children?: ReactNode;
}

export function SettingsPanel({ children }: SettingsPanelProps): JSX.Element {
  const [activeTab, setActiveTab] = useState<SettingsTab>('connection');

  const initial = useMemo(() => ({
    connection: lsConnection(),
    sampler: lsSampler(),
    persona: lsPersona(),
    theme: lsTheme(),
  }), []);

  const [connection, setConnection] = useState(initial.connection);
  const [sampler, setSampler] = useState(initial.sampler);
  const [persona, setPersona] = useState(initial.persona);
  const [theme, setTheme] = useState(initial.theme);

  // Persist on change (debounced)
  useEffect(() => debounceSet('ydltavern.connection', connection)(), [connection]);
  useEffect(() => debounceSet('ydltavern.sampler', sampler)(), [sampler]);
  useEffect(() => debounceSet('ydltavern.persona', persona)(), [persona]);
  useEffect(() => debounceSet('ydltavern.themeSettings', theme)(), [theme]);

  const handleKeyNav = useCallback((e: React.KeyboardEvent) => {
    const idx = TABS.findIndex((t) => t.id === activeTab);
    if (e.key === 'ArrowRight') {
      const next = TABS[(idx + 1) % TABS.length];
      if (next) setActiveTab(next.id);
    } else if (e.key === 'ArrowLeft') {
      const next = TABS[(idx - 1 + TABS.length) % TABS.length];
      if (next) setActiveTab(next.id);
    }
  }, [activeTab]);

  return (
    <section className="drawer-panel product-settings-panel">
      <h2>Settings</h2>
      <nav className="settings-tabs" role="tablist" aria-label="Settings tabs" onKeyDown={handleKeyNav}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`settings-tab${activeTab === tab.id ? ' is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="settings-tab-content" role="tabpanel">
        {activeTab === 'connection' && <ConnectionForm settings={connection} onChange={setConnection} />}
        {activeTab === 'sampler' && <SamplerForm settings={sampler} onChange={setSampler} />}
        {activeTab === 'persona' && <PersonaForm settings={persona} onChange={setPersona} />}
        {activeTab === 'theme' && <ThemeForm settings={theme} onChange={setTheme} />}
        {children}
      </div>
    </section>
  );
}
