import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ConnectionForm, DEFAULT_CONNECTION_SETTINGS, SamplerForm, DEFAULT_SAMPLER_SETTINGS, PersonaForm, DEFAULT_PERSONA_SETTINGS, ThemeForm, DEFAULT_THEME_SETTINGS, } from './Settings/index.js';
const TABS = [
    { id: 'connection', label: 'Connection' },
    { id: 'sampler', label: 'Sampler' },
    { id: 'persona', label: 'Persona' },
    { id: 'theme', label: 'Theme' },
];
const lsConnection = () => safeGet('ydltavern.connection', DEFAULT_CONNECTION_SETTINGS);
const lsSampler = () => safeGet('ydltavern.sampler', DEFAULT_SAMPLER_SETTINGS);
const lsPersona = () => safeGet('ydltavern.persona', DEFAULT_PERSONA_SETTINGS);
const lsTheme = () => safeGet('ydltavern.themeSettings', DEFAULT_THEME_SETTINGS);
function safeGet(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch {
        return fallback;
    }
}
function debounceSet(key, value, delay = 300) {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            }
            catch { /* ignore */ }
        }, delay);
    };
}
export function SettingsPanel({ children }) {
    const [activeTab, setActiveTab] = useState('connection');
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
    const handleKeyNav = useCallback((e) => {
        const idx = TABS.findIndex((t) => t.id === activeTab);
        if (e.key === 'ArrowRight') {
            const next = TABS[(idx + 1) % TABS.length];
            if (next)
                setActiveTab(next.id);
        }
        else if (e.key === 'ArrowLeft') {
            const next = TABS[(idx - 1 + TABS.length) % TABS.length];
            if (next)
                setActiveTab(next.id);
        }
    }, [activeTab]);
    return (_jsxs("section", { className: "drawer-panel product-settings-panel", children: [_jsx("h2", { children: "Settings" }), _jsx("nav", { className: "settings-tabs", role: "tablist", "aria-label": "Settings tabs", onKeyDown: handleKeyNav, children: TABS.map((tab) => (_jsx("button", { type: "button", role: "tab", "aria-selected": activeTab === tab.id, className: `settings-tab${activeTab === tab.id ? ' is-active' : ''}`, onClick: () => setActiveTab(tab.id), children: tab.label }, tab.id))) }), _jsxs("div", { className: "settings-tab-content", role: "tabpanel", children: [activeTab === 'connection' && _jsx(ConnectionForm, { settings: connection, onChange: setConnection }), activeTab === 'sampler' && _jsx(SamplerForm, { settings: sampler, onChange: setSampler }), activeTab === 'persona' && _jsx(PersonaForm, { settings: persona, onChange: setPersona }), activeTab === 'theme' && _jsx(ThemeForm, { settings: theme, onChange: setTheme }), children] })] }));
}
//# sourceMappingURL=SettingsPanel.js.map