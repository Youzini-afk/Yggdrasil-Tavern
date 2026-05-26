import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { DrawerShell } from '../DrawerShell';
import { ExtensionsPanel } from '../../product/ExtensionsPanel';
import { useTavern } from '../../../app/TavernProvider';
export function ExtensionsDrawer({ drawers }) {
    const tavern = useTavern();
    return (_jsxs(_Fragment, { children: [_jsxs("div", { style: { display: 'none' }, "aria-hidden": "true", children: [_jsx("div", { id: "extensions_settings", "data-extension-territory": true }), _jsx("div", { id: "extensions_settings2", "data-extension-territory": true })] }), _jsx(DrawerShell, { id: "extensions", drawers: drawers, side: "left", title: "Extensions", children: _jsxs("section", { className: "drawer-section", children: [_jsxs("header", { className: "drawer-section-header", children: [_jsx("h3", { children: "Installed" }), _jsxs("div", { className: "preset-actions", children: [_jsxs("button", { type: "button", className: "menu_button", "aria-label": "Install extension", children: [_jsx("i", { className: "fa-solid fa-plus" }), " Install"] }), _jsxs("button", { type: "button", className: "menu_button", "aria-label": "Refresh extensions", children: [_jsx("i", { className: "fa-solid fa-arrows-rotate" }), " Refresh"] })] })] }), _jsx(ExtensionsPanel, { records: tavern.extensionRecords, activationContext: tavern.extensionActivationContext })] }) })] }));
}
//# sourceMappingURL=ExtensionsDrawer.js.map