import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { DrawerShell } from '../DrawerShell';
import { ThemeForm, DEFAULT_THEME_SETTINGS } from '../../product/Settings/ThemeForm';
import { useTavern } from '../../../app/TavernProvider';
export function UserSettingsDrawer({ drawers }) {
    const tavern = useTavern();
    return (_jsxs(DrawerShell, { id: "user-settings", drawers: drawers, side: "left", title: "User Settings", children: [_jsxs("section", { className: "drawer-section", children: [_jsx("header", { className: "drawer-section-header", children: _jsx("h3", { children: "Theme" }) }), _jsx(ThemeForm, { settings: tavern.themeSettings ?? DEFAULT_THEME_SETTINGS, onChange: (next) => {
                            tavern.setThemeSettings(next);
                        } })] }), _jsxs("section", { className: "drawer-section", children: [_jsx("header", { className: "drawer-section-header", children: _jsx("h3", { children: "UI Preferences" }) }), _jsxs("label", { className: "checkbox_label", children: [_jsx("input", { type: "checkbox", checked: tavern.settings?.fastUImode ?? false, onChange: (e) => tavern.updateSettings({ fastUImode: e.target.checked }) }), _jsx("span", { children: "Fast UI mode (disable blur effects)" })] }), _jsxs("label", { className: "checkbox_label", children: [_jsx("input", { type: "checkbox", checked: tavern.settings?.reducedMotion ?? false, onChange: (e) => tavern.updateSettings({ reducedMotion: e.target.checked }) }), _jsx("span", { children: "Reduced motion (disable animations)" })] }), _jsxs("label", { className: "checkbox_label", children: [_jsx("input", { type: "checkbox", checked: tavern.settings?.showTimestamps ?? false, onChange: (e) => tavern.updateSettings({ showTimestamps: e.target.checked }) }), _jsx("span", { children: "Show timestamps on messages" })] }), _jsxs("label", { className: "checkbox_label", children: [_jsx("input", { type: "checkbox", checked: tavern.settings?.showTokenCounter ?? false, onChange: (e) => tavern.updateSettings({ showTokenCounter: e.target.checked }) }), _jsx("span", { children: "Show token counter on messages" })] }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsxs("span", { children: ["Font scale: ", _jsx("code", { children: tavern.settings?.fontScale ?? 1 })] }), _jsx("input", { type: "range", min: "0.6", max: "2", step: "0.05", value: tavern.settings?.fontScale ?? 1, className: "neo-range-input", onChange: (e) => tavern.updateSettings({ fontScale: Number.parseFloat(e.target.value) }) })] }) }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsxs("span", { children: ["Chat width: ", _jsxs("code", { children: [tavern.settings?.chatWidth ?? 50, "%"] })] }), _jsx("input", { type: "range", min: "40", max: "100", step: "5", value: tavern.settings?.chatWidth ?? 50, className: "neo-range-input", onChange: (e) => tavern.updateSettings({ chatWidth: Number.parseInt(e.target.value, 10) }) })] }) }), _jsx("div", { className: "range-block", children: _jsxs("label", { children: [_jsx("span", { children: "Avatar style:" }), _jsxs("select", { className: "text_pole", value: tavern.settings?.avatarStyle ?? 0, onChange: (e) => tavern.updateSettings({ avatarStyle: Number.parseInt(e.target.value, 10) }), children: [_jsx("option", { value: "0", children: "Square (2px radius)" }), _jsx("option", { value: "1", children: "Rounded (10px radius)" }), _jsx("option", { value: "2", children: "Circle" })] })] }) })] }), _jsxs("section", { className: "drawer-section", children: [_jsx("header", { className: "drawer-section-header", children: _jsx("h3", { children: "Persistence" }) }), _jsxs("div", { className: "preset-actions", children: [_jsxs("button", { type: "button", className: "menu_button", "aria-label": "Export settings", onClick: () => exportToFile({ settings: tavern.settings, themeSettings: tavern.themeSettings }, 'ydltavern-settings.json'), children: [_jsx("i", { className: "fa-solid fa-file-export" }), " Export"] }), _jsxs("label", { className: "menu_button", "aria-label": "Import settings", children: [_jsx("i", { className: "fa-solid fa-file-import" }), " Import", _jsx("input", { type: "file", accept: "application/json,.json", hidden: true, onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file)
                                                importSettingsFile(file, (data) => {
                                                    if (data.settings)
                                                        tavern.updateSettings(data.settings);
                                                    if (data.themeSettings)
                                                        tavern.setThemeSettings(data.themeSettings);
                                                });
                                            e.currentTarget.value = '';
                                        } })] }), _jsxs("button", { type: "button", className: "menu_button danger", "aria-label": "Reset to defaults", onClick: () => tavern.resetSettings(), children: [_jsx("i", { className: "fa-solid fa-rotate-left" }), " Reset"] })] })] })] }));
}
function exportToFile(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
function importSettingsFile(file, onImport) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            onImport(JSON.parse(String(reader.result)));
        }
        catch (error) {
            console.error('[YdlTavern] Failed to import settings', error);
        }
    };
    reader.readAsText(file);
}
//# sourceMappingURL=UserSettingsDrawer.js.map