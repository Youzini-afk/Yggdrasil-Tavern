import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
/**
 * ST-equivalent #bg1 layer. Renders a fixed-position background image
 * behind the surface. Set imageUrl to a wallpaper; the surface's chat
 * tint and blur effects layer on top.
 */
export function BackgroundLayer({ imageUrl, fit = 'cover', overlay }) {
    const style = {};
    if (imageUrl) {
        style.backgroundImage = `url(${imageUrl})`;
        if (fit === 'tile') {
            style.backgroundSize = 'auto';
            style.backgroundRepeat = 'repeat';
        }
        else {
            style.backgroundSize = fit === 'contain' ? 'contain' : 'cover';
            style.backgroundRepeat = 'no-repeat';
            style.backgroundPosition = 'center center';
        }
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { id: "bg1", className: "background_layer", "aria-hidden": "true", style: style }), overlay && (_jsx("div", { className: "background_overlay", "aria-hidden": "true", style: { background: overlay } }))] }));
}
//# sourceMappingURL=BackgroundLayer.js.map