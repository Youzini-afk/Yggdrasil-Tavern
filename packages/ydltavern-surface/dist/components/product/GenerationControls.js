import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTavern } from '../../app/TavernProvider.js';
export function GenerationControls() {
    const tavern = useTavern();
    return _jsxs("section", { className: "product-control-card", children: [_jsx("h3", { children: "Generation" }), _jsx("button", { type: "button", onClick: tavern.generateReply, children: "Generate" }), _jsx("button", { type: "button", onClick: tavern.regenerateReply, children: "Regenerate" }), _jsx("button", { type: "button", onClick: tavern.swipeReply, children: "Swipe" }), _jsx("button", { type: "button", onClick: tavern.editFirstMessage, children: "Edit first" }), _jsx("p", { children: "Controls call the live ST context. Real model routing lands later through Yggdrasil public protocol." })] });
}
//# sourceMappingURL=GenerationControls.js.map