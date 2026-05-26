import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
    return (_jsxs("section", { className: "diag-panel diag-panel-connector", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "Connector inspector" })] }), _jsxs("p", { className: "diag-panel-lede", children: ["No provider requests captured yet. The Connector inspector displays the request body per source, highlights stripped fields, and surfaces diagnostics notes. Provide a ", _jsx("code", { children: "requests" }), " array with source, body, and diagnostics to populate this panel."] })] }));
}
// ---------------------------------------------------------------------------
// JSON pretty printer with 600-char preview
// ---------------------------------------------------------------------------
function prettyJSON(body, max = 600) {
    try {
        const formatted = JSON.stringify(body, null, 2);
        if (formatted.length <= max)
            return formatted;
        return `${formatted.slice(0, max - 3)}…`;
    }
    catch {
        return String(body);
    }
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ConnectorInspector({ requests, }) {
    if (!requests || requests.length === 0)
        return _jsx(EmptyState, {});
    return (_jsxs("section", { className: "diag-panel diag-panel-connector", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "Connector inspector" }), _jsx("p", { className: "diag-panel-lede", children: "Provider request body diff per source. Each entry shows the source name, the pretty-printed JSON payload, fields that were stripped before sending, and any diagnostic notes from the connector." })] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Provider requests", _jsxs("span", { className: "diag-list-count", children: [" (", requests.length, ")"] })] }), _jsx("div", { role: "list", "aria-label": "Provider request snapshots", children: requests.map((req, idx) => (_jsxs("details", { className: "diag-request-card", open: idx === 0, children: [_jsx("summary", { className: "diag-request-header", role: "button", "aria-label": `Request from ${req.source}`, children: _jsx("span", { className: "diag-request-source", children: req.source }) }), _jsxs("div", { className: "diag-request-body", children: [req.diagnostics.stripped.length > 0 ? (_jsxs("div", { className: "diag-subsection", style: { marginBottom: 8 }, children: [_jsxs("h3", { children: ["Stripped fields", _jsxs("span", { className: "diag-list-count", children: [' ', "(", req.diagnostics.stripped.length, ")"] })] }), _jsx("div", { style: { display: 'flex', flexWrap: 'wrap', gap: 4 }, children: req.diagnostics.stripped.map((field) => (_jsx("span", { className: "diag-stripped-tag", children: field }, field))) })] })) : null, req.diagnostics.notes.length > 0 ? (_jsxs("div", { className: "diag-subsection", style: { marginBottom: 8 }, children: [_jsx("h3", { children: "Notes" }), _jsx("ul", { className: "diag-notes-list", role: "list", "aria-label": "Diagnostic notes", children: req.diagnostics.notes.map((note, i) => (_jsxs("li", { className: "diag-notes-item", children: [_jsx("span", { className: "diag-notes-bullet", children: "*" }), _jsx("span", { children: note })] }, i))) })] })) : null, _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Request body" }), _jsx("pre", { className: "json-block", children: prettyJSON(req.body) })] })] })] }, req.source ?? idx))) })] })] }));
}
//# sourceMappingURL=ConnectorInspector.js.map