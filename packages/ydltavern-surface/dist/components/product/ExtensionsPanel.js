import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { planActivateAll, STDisabledExtensionsStore, } from '@ydltavern/extensions';
import { useState, useMemo, useCallback } from 'react';
export function ExtensionsPanel({ records = [], activationContext, }) {
    const [disabledStore] = useState(() => new STDisabledExtensionsStore(readDisabledFromLs()));
    const [, refresh] = useState(0);
    const plan = useMemo(() => {
        if (records.length === 0 || activationContext === undefined)
            return undefined;
        return planActivateAll({
            records,
            ctx: activationContext,
            basePath: (id) => `/scripts/extensions/${id}`,
        });
    }, [records, activationContext]);
    const handleToggle = useCallback((id) => {
        if (disabledStore.isDisabled(id)) {
            disabledStore.enable(id);
        }
        else {
            disabledStore.disable(id);
        }
        saveDisabledToLs(disabledStore.list());
        refresh((r) => r + 1);
    }, [disabledStore]);
    // Recompute with current disabled state
    const livePlan = useMemo(() => {
        if (records.length === 0 || activationContext === undefined)
            return undefined;
        const ctx = {
            ...activationContext,
            disabledExtensions: new Set(disabledStore.list()),
        };
        return planActivateAll({
            records,
            ctx,
            basePath: (id) => `/scripts/extensions/${id}`,
        });
    }, [records, activationContext, disabledStore]);
    return (_jsxs("section", { className: "drawer-panel product-extensions-panel", children: [_jsx("h2", { children: "Extensions" }), records.length === 0 ? (_jsx("div", { className: "panel-row", children: _jsx("span", { children: "No extensions registered. Install extensions to see them here." }) })) : null, livePlan && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "extension-summary", children: [_jsxs("span", { className: "ext-count-badge ext-activated", children: [livePlan.activated.length, " activated"] }), livePlan.skipped.length > 0 ? (_jsxs("span", { className: "ext-count-badge ext-skipped", children: [livePlan.skipped.length, " skipped"] })) : null] }), _jsx("div", { className: "extension-list", children: records.map((r) => {
                            const isDisabled = disabledStore.isDisabled(r.id);
                            const skipReasons = livePlan.skipped
                                .filter((s) => s.id === r.id)
                                .flatMap((s) => s.reasons);
                            const activated = !isDisabled && skipReasons.length === 0;
                            return (_jsxs("article", { className: `panel-row ext-row${activated ? '' : ' ext-row-inactive'}`, children: [_jsxs("div", { className: "ext-row-header", children: [_jsxs("div", { className: "ext-info", children: [_jsx("strong", { className: "ext-id", children: r.id }), _jsx("span", { className: "ext-display-name", children: r.manifest.display_name }), r.manifest.version ? (_jsxs("span", { className: "ext-version", children: ["v", r.manifest.version] })) : null] }), _jsxs("div", { className: "ext-actions", children: [_jsx("span", { className: `ext-status${activated ? ' ext-status-ok' : skipReasons.length > 0 ? ' ext-status-skipped' : ' ext-status-disabled'}`, children: activated ? 'activated' : skipReasons.length > 0 ? 'skipped' : 'disabled' }), _jsx("button", { type: "button", className: "ext-toggle", onClick: () => handleToggle(r.id), "aria-pressed": !isDisabled, children: isDisabled ? 'Enable' : 'Disable' })] })] }), skipReasons.length > 0 ? (_jsx("ul", { className: "ext-reasons", children: skipReasons.map((reason, idx) => (_jsx("li", { className: "ext-reason", children: reason }, idx))) })) : null, r.manifest.hooks && Object.keys(r.manifest.hooks).length > 0 ? (_jsx("div", { className: "ext-hooks", children: Object.entries(r.manifest.hooks).map(([hook, exp]) => (_jsxs("span", { className: "ext-hook-badge", children: [hook, ":", exp] }, hook))) })) : null] }, r.id));
                        }) })] })), plan === undefined && records.length > 0 && (_jsxs("div", { className: "permission-card", children: [_jsx("strong", { children: "Activation Context Missing" }), _jsx("p", { children: "Extension activation plan cannot be computed without an activation context." })] }))] }));
}
function readDisabledFromLs() {
    try {
        const raw = localStorage.getItem('ydltavern.disabledExtensions');
        return raw ? JSON.parse(raw) : [];
    }
    catch {
        return [];
    }
}
function saveDisabledToLs(list) {
    try {
        localStorage.setItem('ydltavern.disabledExtensions', JSON.stringify(list));
    }
    catch { /* ignore */ }
}
//# sourceMappingURL=ExtensionsPanel.js.map