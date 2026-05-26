import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * Top-bar icons use FontAwesome class names (fa-solid fa-...).
 * The consumer/host page is responsible for loading the FA CSS/JS library.
 */
const ICONS = [
    { id: 'ai-config', icon: 'fa-sliders', label: 'AI Response Configuration' },
    { id: 'api-connections', icon: 'fa-plug', label: 'API Connections' },
    { id: 'advanced-formatting', icon: 'fa-font', label: 'Advanced Formatting' },
    { id: 'world-info', icon: 'fa-book-atlas', label: 'World Info / Lorebook' },
    { id: 'user-settings', icon: 'fa-user-cog', label: 'User Settings' },
    { id: 'backgrounds', icon: 'fa-panorama', label: 'Backgrounds' },
    { id: 'extensions', icon: 'fa-cubes', label: 'Extensions' },
    { id: 'persona', icon: 'fa-face-smile', label: 'Persona Management' },
    { id: 'characters', icon: 'fa-address-card', label: 'Character Management' },
];
export function TopBar({ drawers }) {
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "top-settings-holder", role: "toolbar", "aria-label": "Tavern top bar", children: ICONS.map((entry) => (_jsx("button", { type: "button", className: `drawer-icon ${drawers.openId === entry.id ? 'open' : ''}`, onClick: () => drawers.toggle(entry.id), "aria-label": entry.label, "aria-pressed": drawers.openId === entry.id, children: _jsx("i", { className: `fa-solid ${entry.icon}`, "aria-hidden": "true" }) }, entry.id))) }), _jsx("div", { id: "extensionsMenu", "data-extension-territory": true })] }));
}
//# sourceMappingURL=TopBar.js.map