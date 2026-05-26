import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * Optimized drawer shell for YdlTavern.
 * - Only renders children when the drawer has been open at least once.
 * - Keeps the drawer DOM hidden when not open so ST extensions can mount
 *   into territory nodes inside drawers even while closed.
 */
export function DrawerShell({ id, drawers, side, title, children }) {
    const isOpen = drawers.openId === id;
    const hasBeenOpenRef = React.useRef(false);
    if (isOpen)
        hasBeenOpenRef.current = true;
    const shouldRenderChildren = hasBeenOpenRef.current;
    return (_jsxs("aside", { className: `drawer-content drawer-${side} ${isOpen ? 'openDrawer' : ''}`, "data-drawer-id": id, "aria-hidden": !isOpen, "aria-labelledby": `drawer-title-${id}`, children: [_jsxs("header", { className: "drawer-header", children: [_jsx("h2", { id: `drawer-title-${id}`, className: "drawer-title", children: title }), _jsx("button", { type: "button", className: "drawer-close", onClick: drawers.close, "aria-label": "Close drawer", children: _jsx("i", { className: "fa-solid fa-xmark", "aria-hidden": "true" }) })] }), _jsx("div", { className: "drawer-body", hidden: !isOpen, "aria-hidden": !isOpen, children: shouldRenderChildren ? children : null })] }));
}
//# sourceMappingURL=DrawerShell.js.map