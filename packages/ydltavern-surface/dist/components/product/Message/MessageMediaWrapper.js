import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
// Mirrors SillyTavern .mes_media_wrapper / .mes_file_wrapper
// @see SillyTavern/public/index.html lines 7448-7449
export function MessageMediaWrapper({ items }) {
    return (_jsx("div", { className: "mes_media_wrapper", children: items.map((item, i) => {
            if (item.kind === 'image') {
                return _jsx("img", { src: item.url, alt: item.alt ?? '', className: "mes_media_image" }, i);
            }
            return (_jsxs("a", { href: item.url, className: "mes_media_file", target: "_blank", rel: "noreferrer", children: [_jsx("i", { className: "fa-solid fa-paperclip" }), " ", item.alt ?? item.url] }, i));
        }) }));
}
//# sourceMappingURL=MessageMediaWrapper.js.map