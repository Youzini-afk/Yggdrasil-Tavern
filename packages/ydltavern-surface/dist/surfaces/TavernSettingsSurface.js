import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SettingsPanel } from '../components/product/SettingsPanel.js';
const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-settings'];
const PENDING_ITEMS = ['Connection profiles & secret refs', 'Sampler defaults & preset import', 'Persona, avatar, theme', 'Extension permissions & install'];
export function TavernSettingsSurface({ className }) {
    return (_jsxs("div", { className: composeClass(SURFACE_ROOT_CLASSES, className), children: [_jsx(SettingsPanel, {}), _jsxs("aside", { className: "placeholder-card compact-card", children: [_jsx("span", { className: "placeholder-card-eyebrow", children: "next wiring" }), _jsx("ul", { className: "placeholder-list", children: PENDING_ITEMS.map((item) => (_jsx("li", { children: item }, item))) })] })] }));
}
function composeClass(base, extra) { return extra ? [...base, extra].join(' ') : base.join(' '); }
//# sourceMappingURL=TavernSettingsSurface.js.map