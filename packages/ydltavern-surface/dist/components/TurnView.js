import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { activeVariant } from '@ydltavern/types';
import { SubMessageView } from './SubMessageView.js';
const ROLE_LABEL = {
    user: 'User',
    assistant: 'Assistant',
    system: 'System',
    tool: 'Tool',
};
/**
 * @deprecated W4: replaced by MessageBubble + MessageList. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export function TurnView({ turn }) {
    const variant = activeVariant(turn);
    const variantCount = turn.variants.length;
    const speakerName = turn.speaker?.name ?? ROLE_LABEL[turn.role];
    const swipePosition = `${turn.active_variant + 1} / ${variantCount}`;
    return (_jsxs("article", { className: `turn turn-role-${turn.role}`, "data-turn-index": turn.index, children: [_jsxs("header", { className: "turn-header", children: [_jsxs("div", { className: "turn-identity", children: [_jsx("span", { className: "turn-role", children: ROLE_LABEL[turn.role] }), _jsx("span", { className: "turn-speaker", children: speakerName })] }), _jsxs("div", { className: "turn-meta", children: [_jsx("button", { type: "button", className: "swipe swipe-prev", disabled: true, "aria-label": "Previous variant", children: "\u2039" }), _jsx("span", { className: "swipe-position", title: "active variant / total variants", children: swipePosition }), _jsx("button", { type: "button", className: "swipe swipe-next", disabled: true, "aria-label": "Next variant", children: "\u203A" })] })] }), variant === undefined ? (_jsx("p", { className: "turn-empty", children: "No active variant." })) : (_jsx("div", { className: "turn-body", children: variant.subs.map((sub, idx) => (_jsx(SubMessageView, { sub: sub }, `${turn.id}-sub-${idx}`))) })), variant !== undefined && hasMeta(variant.meta) ? (_jsxs("footer", { className: "turn-footer", children: [variant.meta.model !== undefined ? _jsxs("span", { children: ["model: ", variant.meta.model] }) : null, variant.meta.tokens !== undefined ? _jsxs("span", { children: ["tokens: ", variant.meta.tokens] }) : null, variant.meta.latency_ms !== undefined ? (_jsxs("span", { children: ["latency: ", variant.meta.latency_ms, "ms"] })) : null, variant.meta.finish_reason !== undefined ? (_jsxs("span", { children: ["finish: ", variant.meta.finish_reason] })) : null] })) : null] }));
}
function hasMeta(meta) {
    return (meta.model !== undefined ||
        meta.tokens !== undefined ||
        meta.latency_ms !== undefined ||
        meta.finish_reason !== undefined);
}
//# sourceMappingURL=TurnView.js.map