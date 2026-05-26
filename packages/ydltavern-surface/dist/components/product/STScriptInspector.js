import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState() {
    return (_jsxs("section", { className: "diag-panel diag-panel-stscript", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "STScript inspector" })] }), _jsxs("p", { className: "diag-panel-lede", children: ["No STScript runtime state available yet. The STScript inspector surfaces the command registry (registered commands with aliases), the scope chain (current variables and parent context), recent pipe values, and parser flag status. Connect a runtime via the ", _jsx("code", { children: "registry" }), ",", ' ', _jsx("code", { children: "scope" }), ", ", _jsx("code", { children: "pipeHistory" }), ", and ", _jsx("code", { children: "flags" }), " props to populate this panel."] })] }));
}
// ---------------------------------------------------------------------------
// Value renderer
// ---------------------------------------------------------------------------
function renderValue(value) {
    if (value === null)
        return 'null';
    if (value === undefined)
        return 'undefined';
    if (typeof value === 'string') {
        return value.length > 60 ? `${value.slice(0, 57)}…` : value;
    }
    if (typeof value === 'object') {
        try {
            const s = JSON.stringify(value);
            return s.length > 60 ? `${s.slice(0, 57)}…` : s;
        }
        catch {
            return String(value);
        }
    }
    return String(value);
}
function renderPipeValue(value) {
    if (value === null)
        return 'null';
    if (value === undefined)
        return 'undefined';
    if (typeof value === 'string') {
        return value.length > 120 ? `${value.slice(0, 117)}…` : value;
    }
    if (typeof value === 'object') {
        try {
            const s = JSON.stringify(value);
            return s.length > 120 ? `${s.slice(0, 117)}…` : s;
        }
        catch {
            return String(value);
        }
    }
    return String(value);
}
// ---------------------------------------------------------------------------
// Scope chain renderer
// ---------------------------------------------------------------------------
function ScopeChain({ scope }) {
    const varEntries = Object.entries(scope.variables);
    return (_jsxs("div", { className: "diag-scope-card", role: "region", "aria-label": "Scope chain", children: [_jsxs("div", { className: "diag-scope-header", children: [_jsx("span", { children: "Scope" }), _jsxs("span", { className: "diag-scope-depth", children: [varEntries.length, " variable", varEntries.length === 1 ? '' : 's'] })] }), varEntries.length === 0 ? (_jsx("div", { className: "diag-scope-vars", children: _jsx("span", { className: "diag-scope-var-value", style: { fontStyle: 'italic' }, children: "No variables in this scope" }) })) : (_jsx("div", { className: "diag-scope-vars", children: varEntries.map(([name, val]) => (_jsxs("div", { className: "diag-scope-var", children: [_jsx("span", { className: "diag-scope-var-name", children: name }), _jsx("span", { className: "diag-scope-var-value", title: String(val), children: renderValue(val) })] }, name))) })), scope.parent ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "diag-scope-parent", children: "\u2191 parent scope" }), _jsx(ScopeChain, { scope: scope.parent })] })) : null] }));
}
// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function STScriptInspector({ registry, scope, pipeHistory, flags, }) {
    if (!registry && !scope && !pipeHistory && !flags)
        return _jsx(EmptyState, {});
    return (_jsxs("section", { className: "diag-panel diag-panel-stscript", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/deep-port" }), _jsx("h2", { children: "STScript inspector" }), _jsx("p", { className: "diag-panel-lede", children: "STScript runtime state \u2014 command registry, scope chain, pipe history, and parser flags." })] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Command registry", registry ? (_jsxs("span", { className: "diag-list-count", children: [" (", registry.length, ")"] })) : null] }), !registry || registry.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No commands registered." })) : (_jsx("ul", { className: "diag-list", role: "list", "aria-label": "Registered commands", children: registry.map((cmd, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsxs("div", { className: "diag-command-row", children: [_jsx("span", { className: "diag-command-name", children: cmd.name }), cmd.aliases && cmd.aliases.length > 0 ? (_jsxs("span", { className: "diag-command-aliases", children: ["aliases: ", cmd.aliases.join(', ')] })) : null] }), cmd.helpString ? (_jsx("span", { className: "diag-command-help", children: cmd.helpString })) : null] }, cmd.name ?? idx))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Scope chain" }), !scope ? (_jsx("p", { className: "diag-footnote", children: "No scope state available." })) : (_jsx(ScopeChain, { scope: scope }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsxs("h3", { children: ["Pipe history", pipeHistory ? (_jsxs("span", { className: "diag-list-count", children: [" (", pipeHistory.length, ")"] })) : null] }), !pipeHistory || pipeHistory.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No pipe values recorded yet." })) : (_jsx("div", { className: "diag-pipe-history", role: "list", "aria-label": "Pipe history", children: pipeHistory.map((val, idx) => (_jsxs("div", { className: "diag-pipe-item", role: "listitem", children: ["[", pipeHistory.length - 1 - idx, "] ", renderPipeValue(val)] }, idx))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Parser flags" }), !flags ? (_jsx("p", { className: "diag-footnote", children: "No parser flags available." })) : (_jsxs("ul", { className: "diag-flag-list", role: "list", "aria-label": "Parser flags", children: [_jsxs("li", { className: `diag-flag-item${flags.STRICT_ESCAPING ? ' diag-flag-on' : ' diag-flag-off'}`, children: [_jsx("span", { children: "STRICT_ESCAPING" }), _jsx("span", { children: flags.STRICT_ESCAPING ? 'ON' : 'OFF' })] }), _jsxs("li", { className: `diag-flag-item${flags.REPLACE_GETVAR ? ' diag-flag-on' : ' diag-flag-off'}`, children: [_jsx("span", { children: "REPLACE_GETVAR" }), _jsx("span", { children: flags.REPLACE_GETVAR ? 'ON' : 'OFF' })] })] }))] })] }));
}
//# sourceMappingURL=STScriptInspector.js.map