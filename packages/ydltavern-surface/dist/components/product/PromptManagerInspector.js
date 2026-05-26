import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
    return (_jsxs("section", { className: "diag-panel diag-panel-prompt-manager", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "PromptManager inspector" })] }), _jsxs("p", { className: "diag-panel-lede", children: ["No compile result yet. The PromptManager inspector surfaces the effective prompt order after compilation \u2014 including marker resolution, override application, and generation-trigger filtering. Once the host bridge provides a ", _jsx("code", { children: "result" }), " prop, ordered prompts, overrides, and diagnostics will appear here."] })] }));
}
// ---------------------------------------------------------------------------
// Source badge helper
// ---------------------------------------------------------------------------
function SourceBadge({ source }) {
    const cls = source === 'input'
        ? 'diag-badge diag-badge-input'
        : source === 'default'
            ? 'diag-badge diag-badge-default'
            : source === 'anchor'
                ? 'diag-badge diag-badge-anchor'
                : 'diag-badge';
    const label = source ?? 'unknown';
    return _jsx("span", { className: cls, children: label });
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PromptManagerInspector({ result, }) {
    if (!result)
        return _jsx(EmptyState, {});
    const { prompts, collection, diagnostics } = result;
    const overrides = collection?.overriddenPrompts ?? [];
    const triggerSkipped = collection?.triggerSkipped ?? [];
    const warnings = diagnostics?.warnings ?? [];
    const disabledAnchored = [];
    if (prompts) {
        for (const p of prompts) {
            if (p.source === 'anchor' && p.enabled === false) {
                disabledAnchored.push(p.identifier);
            }
        }
    }
    return (_jsxs("section", { className: "diag-panel diag-panel-prompt-manager", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "PromptManager inspector" }), _jsx("p", { className: "diag-panel-lede", children: "Compiled prompt order from ST\u2019s PromptManager. Each entry shows identifier, role, marker badge, and source category. Disabled-but-anchored prompts are highlighted; overridden prompts appear with their status." })] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Effective prompt order", prompts ? _jsxs("span", { className: "diag-list-count", children: [" (", prompts.length, ")"] }) : null] }), !prompts || prompts.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No prompts in the compiled order." })) : (_jsx("ul", { className: "diag-list", role: "list", "aria-label": "Effective prompt order", children: prompts.map((entry, idx) => {
                            const isDisabledAnchor = entry.source === 'anchor' && entry.enabled === false;
                            const isTriggerSkipped = triggerSkipped.includes(entry.identifier);
                            const liClass = [
                                'diag-list-item',
                                isDisabledAnchor ? 'diag-highlight' : '',
                                isTriggerSkipped ? 'diag-trigger-skipped' : '',
                            ]
                                .filter(Boolean)
                                .join(' ');
                            return (_jsxs("li", { className: liClass, children: [_jsx("span", { className: "diag-list-key", children: entry.identifier }), entry.role ? (_jsx("span", { className: "diag-list-pos", children: entry.role })) : null, entry.marker ? (_jsx("span", { className: "diag-badge diag-badge-marker", children: "marker" })) : null, _jsx(SourceBadge, { source: entry.source }), _jsx("span", { className: "diag-list-text", children: entry.content
                                            ? entry.content.length > 80
                                                ? `${entry.content.slice(0, 77)}…`
                                                : entry.content
                                            : '(empty)' }), isDisabledAnchor ? (_jsx("span", { className: "diag-list-reason", children: "disabled anchor" })) : null, isTriggerSkipped ? (_jsx("span", { className: "diag-list-meta", children: "triggerSkipped" })) : null] }, entry.identifier ?? idx));
                        }) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Override status", overrides.length > 0 ? (_jsxs("span", { className: "diag-list-count", children: [" (", overrides.length, ")"] })) : null] }), overrides.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No prompt overrides applied." })) : (_jsx("ul", { className: "diag-list", role: "list", "aria-label": "Prompt overrides", children: overrides.map((ov, idx) => (_jsxs("li", { className: `diag-list-item${ov.status === 'blocked' ? ' diag-prompt-blocked' : ''}`, children: [_jsx("span", { className: "diag-list-key", children: ov.identifier }), _jsx("span", { className: ov.status === 'applied'
                                        ? 'diag-list-pos'
                                        : 'diag-list-reason', children: ov.status }), ov.reason ? (_jsx("span", { className: "diag-list-text", children: ov.reason })) : null] }, `${ov.identifier}-${idx}`))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Generation trigger filter", triggerSkipped.length > 0 ? (_jsxs("span", { className: "diag-list-count", children: [" (", triggerSkipped.length, ")"] })) : null] }), triggerSkipped.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No prompts were skipped by the generation trigger filter." })) : (_jsx("ul", { className: "diag-list", role: "list", "aria-label": "Trigger-skipped prompts", children: triggerSkipped.map((id) => (_jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [_jsx("span", { className: "diag-list-key", children: id }), _jsx("span", { className: "diag-list-reason", children: "triggerSkipped" })] }, id))) }))] }), warnings.length > 0 ? (_jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Warnings" }), _jsx("ul", { className: "diag-list", role: "list", "aria-label": "Diagnostic warnings", children: warnings.map((w, i) => (_jsx("li", { className: "diag-list-item diag-list-item-dim", children: _jsx("span", { className: "diag-list-text", children: w }) }, i))) })] })) : null] }));
}
//# sourceMappingURL=PromptManagerInspector.js.map