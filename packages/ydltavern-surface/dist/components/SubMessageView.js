import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @deprecated W4: replaced by MessageBubble + MessageList. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export function SubMessageView({ sub }) {
    switch (sub.kind) {
        case 'text':
            return (_jsx("p", { className: "sub sub-text", children: sub.text.split('\n').map((line, idx, lines) => (_jsxs("span", { children: [line, idx < lines.length - 1 ? _jsx("br", {}) : null] }, idx))) }));
        case 'thinking':
            return (_jsxs("details", { className: "sub sub-thinking", open: sub.collapsed_by_default !== true, children: [_jsxs("summary", { children: [_jsx("span", { className: "sub-tag", children: "thinking" }), _jsx("span", { className: "sub-summary-text", children: "internal reasoning" })] }), _jsx("p", { children: sub.text })] }));
        case 'tool_call':
            return (_jsxs("div", { className: "sub sub-tool-call", children: [_jsxs("header", { children: [_jsx("span", { className: "sub-tag tag-tool", children: "tool_call" }), _jsxs("span", { className: "tool-name", children: [sub.tool.provider !== undefined ? `${sub.tool.provider}.` : '', sub.tool.name] }), _jsxs("span", { className: "call-id", children: ["#", sub.call_id] })] }), _jsx("pre", { className: "json-block", children: JSON.stringify(sub.arguments, null, 2) })] }));
        case 'tool_result':
            return (_jsxs("div", { className: `sub sub-tool-result status-${sub.status}`, children: [_jsxs("header", { children: [_jsx("span", { className: "sub-tag tag-result", children: "tool_result" }), _jsx("span", { className: "status-pill", children: sub.status }), _jsxs("span", { className: "call-id", children: ["#", sub.call_id] })] }), _jsx("pre", { className: "json-block", children: JSON.stringify(sub.result, null, 2) })] }));
        case 'note':
            return (_jsxs("div", { className: "sub sub-note", children: [_jsx("span", { className: "sub-tag tag-note", children: "note" }), _jsx("span", { children: sub.text })] }));
        // The remaining kinds are intentionally not rendered in this scaffold.
        case 'skill_invoke':
        case 'agent_step':
        case 'image':
        case 'audio':
        case 'attachment':
        case 'file_embed':
            return (_jsxs("div", { className: "sub sub-placeholder", children: [_jsx("span", { className: "sub-tag tag-stub", children: sub.kind }), _jsx("span", { children: "not rendered in scaffold" })] }));
    }
}
//# sourceMappingURL=SubMessageView.js.map