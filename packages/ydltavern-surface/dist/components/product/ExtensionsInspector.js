import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function countHooks(activated) {
    const counts = {};
    for (const ext of activated) {
        // Each extension step can represent a hook dispatch
        for (const step of ext.steps) {
            const event = step.kind;
            if (event) {
                counts[event] = (counts[event] ?? 0) + 1;
            }
        }
    }
    return counts;
}
// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
    return (_jsxs("section", { className: "diag-panel diag-panel-extensions", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "Extensions inspector" })] }), _jsxs("p", { className: "diag-panel-lede", children: ["No extension loader state available yet. The Extensions inspector surfaces the activation plan (which extensions were activated or skipped, and why), the disabled extensions store, registered generate interceptors, and a hook dispatch summary. Provide an ", _jsx("code", { children: "activationPlan" }), " and", ' ', _jsx("code", { children: "disabled" }), " prop to populate this panel."] })] }));
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ExtensionsInspector({ activationPlan, disabled, }) {
    if (!activationPlan && !disabled)
        return _jsx(EmptyState, {});
    const activated = activationPlan?.activated ?? [];
    const skipped = activationPlan?.skipped ?? [];
    const interceptors = activated
        .filter((ext) => ext.manifest.generate_interceptor)
        .map((ext) => ({
        id: ext.id,
        name: ext.manifest.generate_interceptor,
    }));
    const hookCounts = countHooks(activated);
    return (_jsxs("section", { className: "diag-panel diag-panel-extensions", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "Extensions inspector" }), _jsx("p", { className: "diag-panel-lede", children: "Extension loader activation plan and runtime state \u2014 which extensions were loaded, skipped, or disabled, and their hook dispatch footprint." })] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Activated extensions", activated.length > 0 ? (_jsxs("span", { className: "diag-list-count", children: [" (", activated.length, ")"] })) : null] }), activated.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No extensions activated." })) : (_jsx("ul", { className: "diag-list", role: "list", "aria-label": "Activated extensions", children: activated.map((ext) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: ext.id }), _jsx("span", { className: "diag-list-text", children: ext.manifest.display_name }), _jsxs("span", { className: "diag-ext-steps", children: [ext.steps.length, " step", ext.steps.length === 1 ? '' : 's'] }), ext.manifest.generate_interceptor ? (_jsxs("span", { className: "diag-ext-interceptor", children: ["interceptor: ", ext.manifest.generate_interceptor] })) : null] }, ext.id))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Skipped extensions", skipped.length > 0 ? (_jsxs("span", { className: "diag-list-count", children: [" (", skipped.length, ")"] })) : null] }), skipped.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No extensions were skipped." })) : (_jsx("ul", { className: "diag-list", role: "list", "aria-label": "Skipped extensions", children: skipped.map((ext) => (_jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [_jsx("span", { className: "diag-list-key", children: ext.id }), ext.reasons.map((reason, i) => (_jsx("span", { className: "diag-list-reason", children: reason }, i)))] }, ext.id))) }))] }), disabled && disabled.length > 0 ? (_jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Disabled extensions store", _jsxs("span", { className: "diag-list-count", children: [" (", disabled.length, ")"] })] }), _jsx("ul", { className: "diag-list", role: "list", "aria-label": "Disabled extension IDs", children: disabled.map((id) => (_jsx("li", { className: "diag-list-item diag-list-item-dim", children: _jsx("span", { className: "diag-list-key", children: id }) }, id))) })] })) : null, interceptors.length > 0 ? (_jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Generate interceptors", _jsxs("span", { className: "diag-list-count", children: [" (", interceptors.length, ")"] })] }), _jsx("ul", { className: "diag-list", role: "list", "aria-label": "Generate interceptors", children: interceptors.map((ext) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: ext.id }), _jsx("span", { className: "diag-list-text", children: ext.name })] }, ext.id))) })] })) : null, Object.keys(hookCounts).length > 0 ? (_jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Hook dispatch summary", _jsxs("span", { className: "diag-list-count", children: [' ', "(", Object.keys(hookCounts).length, " event", Object.keys(hookCounts).length === 1 ? '' : 's', ")"] })] }), _jsx("div", { className: "diag-hook-summary", role: "list", "aria-label": "Hook dispatch counts per event", children: Object.entries(hookCounts)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([event, count]) => (_jsxs("div", { className: "diag-hook-cell", role: "listitem", children: [_jsx("span", { className: "diag-hook-event", children: event }), _jsx("span", { className: "diag-hook-count", children: count })] }, event))) })] })) : null] }));
}
//# sourceMappingURL=ExtensionsInspector.js.map