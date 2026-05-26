import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { BUILT_IN_THEMES, getThemeById, DARK_THEME } from '../themes/built-in-themes.js';
const DENSITY_OPTIONS = [
    { value: 'compact', label: 'Compact' },
    { value: 'comfortable', label: 'Comfortable' },
    { value: 'spacious', label: 'Spacious' },
];
const FONT_FAMILIES = [
    { value: '"Inter", ui-sans-serif, system-ui, sans-serif', label: 'Inter (Sans)' },
    { value: '"Fraunces", "Iowan Old Style", Georgia, serif', label: 'Fraunces (Serif)' },
    { value: '"JetBrains Mono", "SF Mono", Menlo, monospace', label: 'JetBrains Mono (Mono)' },
    { value: '"Iowan Old Style", Georgia, serif', label: 'Iowan (Serif)' },
    { value: 'ui-sans-serif, system-ui, sans-serif', label: 'System UI (Sans)' },
];
function ThemePreviewCard({ themeId, selected, onSelect, }) {
    const theme = getThemeById(themeId);
    return (_jsxs("button", { type: "button", className: `theme-card${selected ? ' theme-card-selected' : ''}`, onClick: onSelect, "aria-pressed": selected, children: [_jsx("span", { className: "theme-card-swatch", style: {
                    background: `linear-gradient(135deg, ${theme.tokens.bgPrimary}, ${theme.tokens.bgSecondary})`,
                    border: `1px solid ${theme.tokens.border}`,
                    color: theme.tokens.fgPrimary,
                }, children: _jsx("span", { className: "theme-card-swatch-text", children: "Aa" }) }), _jsx("span", { className: "theme-card-name", children: theme.label ?? theme.name })] }));
}
export function ThemeForm({ settings, onChange }) {
    const currentTheme = getThemeById(settings.themeId);
    const handleThemeSelect = useCallback((themeId) => {
        onChange({ ...settings, themeId });
    }, [settings, onChange]);
    const handleDensityChange = useCallback((e) => {
        onChange({ ...settings, density: e.target.value });
    }, [settings, onChange]);
    const handleFontChange = useCallback((e) => {
        onChange({ ...settings, fontFamily: e.target.value });
    }, [settings, onChange]);
    return (_jsxs("section", { className: "settings-form-section", children: [_jsx("h3", { className: "settings-form-title", children: "Theme" }), _jsxs("div", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Color Theme" }), _jsx("div", { className: "theme-card-grid", children: BUILT_IN_THEMES.map((t) => (_jsx(ThemePreviewCard, { themeId: t.name, selected: currentTheme.name === t.name, onSelect: () => handleThemeSelect(t.name) }, t.name))) })] }), _jsxs("div", { className: "settings-form-grid", children: [_jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Density" }), _jsx("select", { className: "settings-input", value: settings.density, onChange: handleDensityChange, children: DENSITY_OPTIONS.map((d) => (_jsx("option", { value: d.value, children: d.label }, d.value))) })] }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Font Family" }), _jsx("select", { className: "settings-input", value: settings.fontFamily, onChange: handleFontChange, children: FONT_FAMILIES.map((f) => (_jsx("option", { value: f.value, children: f.label }, f.value))) })] })] })] }));
}
export const DEFAULT_THEME_SETTINGS = {
    themeId: DARK_THEME.name,
    density: DARK_THEME.density,
    fontFamily: DARK_THEME.font.family,
};
//# sourceMappingURL=ThemeForm.js.map