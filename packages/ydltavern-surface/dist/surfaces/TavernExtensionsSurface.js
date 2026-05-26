import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ExtensionsPanel } from '../components/product/ExtensionsPanel.js';
const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-extensions'];
const PENDING_ITEMS = ['Extension loader & sandbox boundary', 'Registry, install, version pinning', 'STScript / slash command host', 'Built-in extensions catalog'];
export function TavernExtensionsSurface({ className }) {
    const records = [
        {
            id: 'token-counter',
            manifest: {
                display_name: 'Token analysis and prompt chunk accounting',
                version: '1.0',
                hooks: { activate: 'Activate' },
            },
        },
        {
            id: 'regex',
            manifest: {
                display_name: 'GLOBAL/PRESET/SCOPED text transforms',
                version: '2.1',
                hooks: {},
            },
        },
        {
            id: 'quick-reply',
            manifest: {
                display_name: 'Quick reply sets and slash triggers',
                version: '1.5',
                hooks: { activate: 'Activate', install: 'Install' },
            },
        },
        {
            id: 'memory',
            manifest: {
                display_name: 'Summary insertion and update plans',
                version: '1.0',
                hooks: { activate: 'Activate' },
            },
        },
        {
            id: 'vectors',
            manifest: {
                display_name: 'Retrieval index/query/injection plans',
                version: '0.9',
                hooks: {},
            },
        },
        {
            id: 'loader',
            manifest: {
                display_name: 'ST-style manifest discovery, permission gate, load plan',
                version: '1.0.0',
                hooks: {},
            },
        },
    ];
    const activationContext = {
        installedExtras: new Set(),
        installedExtensions: new Set(records.map((r) => r.id)),
        disabledExtensions: new Set(['memory']),
        clientVersion: '1.13.0',
    };
    return (_jsxs("div", { className: composeClass(SURFACE_ROOT_CLASSES, className), children: [_jsx(ExtensionsPanel, { records: records, activationContext: activationContext }), _jsxs("aside", { className: "placeholder-card compact-card", children: [_jsx("span", { className: "placeholder-card-eyebrow", children: "next wiring" }), _jsx("ul", { className: "placeholder-list", children: PENDING_ITEMS.map((item) => (_jsx("li", { children: item }, item))) })] })] }));
}
function composeClass(base, extra) { return extra ? [...base, extra].join(' ') : base.join(' '); }
//# sourceMappingURL=TavernExtensionsSurface.js.map