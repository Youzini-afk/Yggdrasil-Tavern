import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * ST-equivalent #nonQRFormItems toolbar to the left of the textarea.
 * Mirrors ST send form: options/menu, continue, impersonate.
 */
export function ComposerToolbar(props) {
    return (_jsxs("div", { id: "nonQRFormItems", className: "composer_toolbar", role: "toolbar", "aria-label": "Composer actions", children: [_jsx("button", { type: "button", id: "options_button", className: "composer_button mes_button", onClick: props.onOptions, "aria-label": "Options menu", children: _jsx("i", { className: "fa-solid fa-bars", "aria-hidden": "true" }) }), props.onContinue && (_jsx("button", { type: "button", id: "mes_continue", className: "composer_button mes_button", onClick: props.onContinue, disabled: props.isGenerating, "aria-label": "Continue last response", title: "Continue", children: _jsx("i", { className: "fa-solid fa-forward", "aria-hidden": "true" }) })), props.onImpersonate && (_jsx("button", { type: "button", id: "mes_impersonate", className: "composer_button mes_button", onClick: props.onImpersonate, disabled: props.isGenerating, "aria-label": "Impersonate user", title: "Impersonate", children: _jsx("i", { className: "fa-solid fa-masks-theater", "aria-hidden": "true" }) }))] }));
}
//# sourceMappingURL=ComposerToolbar.js.map