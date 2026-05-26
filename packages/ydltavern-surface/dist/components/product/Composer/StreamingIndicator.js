import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * ST-equivalent #mes_stop indicator. Shows when generation is in flight
 * with a stop button.
 */
export function StreamingIndicator({ onStop, label = 'Generating\u2026' }) {
    return (_jsxs("div", { className: "streaming_indicator", role: "status", "aria-live": "polite", children: [_jsxs("span", { className: "streaming_dots", "aria-hidden": "true", children: [_jsx("span", { className: "streaming_dot" }), _jsx("span", { className: "streaming_dot" }), _jsx("span", { className: "streaming_dot" })] }), _jsx("span", { className: "streaming_label", children: label }), onStop && (_jsxs("button", { type: "button", id: "mes_stop", className: "streaming_stop mes_button", onClick: onStop, "aria-label": "Stop generation", children: [_jsx("i", { className: "fa-solid fa-circle-stop", "aria-hidden": "true" }), _jsx("span", { children: "Stop" })] }))] }));
}
//# sourceMappingURL=StreamingIndicator.js.map