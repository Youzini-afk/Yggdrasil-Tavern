import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BUCKET_LABELS = {
    before: 'Before',
    after: 'After',
    ANTop: 'AN Top',
    ANBottom: 'AN Bottom',
    atDepth: 'At Depth',
    EM: 'EM',
};
// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
    return (_jsxs("section", { className: "diag-panel diag-panel-world-info", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "World Info inspector" })] }), _jsxs("p", { className: "diag-panel-lede", children: ["No routing result yet. The World Info inspector displays activated entries grouped by bucket (before, after, ANTop, ANBottom, atDepth, EM, outlets), author note patch breakdown, and outlet summaries. Once the host bridge provides a ", _jsx("code", { children: "result" }), " prop, the full routing output will appear here."] })] }));
}
// ---------------------------------------------------------------------------
// Content preview helper
// ---------------------------------------------------------------------------
function truncate(text, max = 120) {
    if (text.length <= max)
        return text;
    return `${text.slice(0, max - 3)}…`;
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function WorldInfoInspector({ result, }) {
    if (!result)
        return _jsx(EmptyState, {});
    const { buckets, anPatch } = result;
    const bucketKeys = [
        'before',
        'after',
        'ANTop',
        'ANBottom',
        'EM',
    ];
    return (_jsxs("section", { className: "diag-panel diag-panel-world-info", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "World Info inspector" }), _jsx("p", { className: "diag-panel-lede", children: "Routed World Info entries grouped by insertion bucket. Each entry shows its order and truncated content preview. Author note patches detail how AN content is assembled from top, original, and bottom fragments." })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Activated entries by bucket" }), _jsxs("ul", { className: "diag-bucket-list", role: "list", "aria-label": "World Info buckets", children: [bucketKeys.map((key) => {
                                const entries = buckets[key];
                                if (!entries || entries.length === 0)
                                    return null;
                                const label = BUCKET_LABELS[key] ?? key;
                                const count = entries.length;
                                return (_jsxs("details", { className: "diag-bucket-item", open: true, children: [_jsxs("summary", { className: "diag-bucket-header", role: "button", "aria-label": `${label} bucket`, children: [label, _jsxs("span", { className: "diag-bucket-count", children: [count, " entr", count === 1 ? 'y' : 'ies'] })] }), _jsx("div", { className: "diag-bucket-body", children: _jsx("ul", { className: "diag-list", role: "list", "aria-label": `${label} entries`, children: entries.map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.id }), _jsxs("span", { className: "diag-list-pos", children: ["order ", entry.order] }), _jsx("span", { className: "diag-list-text", children: truncate(entry.content) })] }, entry.id ?? idx))) }) })] }, key));
                            }), buckets.outlets && Object.keys(buckets.outlets).length > 0 ? (Object.entries(buckets.outlets).map(([name, outlet]) => {
                                const count = outlet.entries.length;
                                return (_jsxs("details", { className: "diag-bucket-item", open: true, children: [_jsxs("summary", { className: "diag-bucket-header", role: "button", "aria-label": `Outlet ${name}`, children: ["outlet: ", name, _jsxs("span", { className: "diag-bucket-count", children: [count, " entr", count === 1 ? 'y' : 'ies'] })] }), _jsx("div", { className: "diag-bucket-body", children: _jsx("ul", { className: "diag-list", role: "list", "aria-label": `Outlet ${name} entries`, children: outlet.entries.map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.id }), _jsxs("span", { className: "diag-list-pos", children: ["order ", entry.order] }), _jsx("span", { className: "diag-list-text", children: truncate(entry.content) })] }, entry.id ?? idx))) }) })] }, `outlet-${name}`));
                            })) : (_jsx("p", { className: "diag-footnote", children: "No outlet entries routed." })), buckets.atDepth && buckets.atDepth.length > 0 ? null : (_jsx("p", { className: "diag-footnote", children: "No atDepth entries routed." }))] })] }), anPatch ? (_jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Author note patch" }), _jsxs("div", { className: "diag-an-patch", "aria-label": "Author note patch breakdown", children: [_jsxs("div", { className: "diag-an-patch-row", children: [_jsx("span", { className: "diag-an-patch-label", children: "top" }), _jsx("span", { className: "diag-list-text", children: truncate(anPatch.top, 80) })] }), _jsxs("div", { className: "diag-an-patch-row", children: [_jsx("span", { className: "diag-an-patch-label", children: "original" }), _jsx("span", { className: "diag-list-text", children: truncate(anPatch.original, 80) })] }), _jsxs("div", { className: "diag-an-patch-row", children: [_jsx("span", { className: "diag-an-patch-label", children: "bottom" }), _jsx("span", { className: "diag-list-text", children: truncate(anPatch.bottom, 80) })] }), _jsxs("div", { className: "diag-an-patch-row", children: [_jsx("span", { className: "diag-an-patch-label" }), _jsx("span", { className: "diag-badge diag-badge-input", children: "\u2192" }), _jsx("span", { className: "diag-list-text diag-an-patch-arrow", children: truncate(anPatch.patched, 120) })] })] })] })) : null] }));
}
//# sourceMappingURL=WorldInfoInspector.js.map