import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
// Mirrors SillyTavern .swipeRightBlock
// @see SillyTavern/public/index.html lines 7452-7455
export function SwipeControls({ current, total, onRight }) {
    return (_jsxs("div", { className: "swipeRightBlock", children: [_jsx("button", { className: "swipe_right", type: "button", "aria-label": "Next swipe", onClick: onRight, disabled: total === 0, children: _jsx("i", { className: "fa-solid fa-chevron-right" }) }), _jsx("div", { className: "swipes-counter", children: total > 0 ? `${current + 1}/${total}` : '' })] }));
}
//# sourceMappingURL=SwipeControls.js.map