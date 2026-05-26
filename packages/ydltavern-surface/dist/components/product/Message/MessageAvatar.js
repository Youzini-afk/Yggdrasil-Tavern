import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
// Mirrors SillyTavern mesAvatarWrapper (#message_template)
// @see SillyTavern/public/index.html lines 7380-7387
export function MessageAvatar({ avatarUrl, mesId, timer, tokenCount }) {
    return (_jsxs("div", { className: "mesAvatarWrapper", children: [_jsx("div", { className: "avatar", children: avatarUrl ? _jsx("img", { src: avatarUrl, alt: "" }) : _jsx("div", { className: "avatar-placeholder" }) }), _jsx("div", { className: "mesIDDisplay", children: mesId }), typeof timer === 'number' && (_jsxs("div", { className: "mes_timer", title: "Generation time (ms)", children: [timer, "ms"] })), typeof tokenCount === 'number' && (_jsxs("div", { className: "tokenCounterDisplay", title: "Token count", children: [tokenCount, "t"] }))] }));
}
//# sourceMappingURL=MessageAvatar.js.map