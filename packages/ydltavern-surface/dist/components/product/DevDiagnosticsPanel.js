import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { EngineCorePreviewPanel } from '../EngineCorePreviewPanel.js';
import { ImportersPanel } from '../ImportersPanel.js';
import { PromptCriticalPanel } from '../PromptCriticalPanel.js';
import { SlashDiagnosticsPanel } from '../SlashDiagnosticsPanel.js';
import { STDiagnosticsPanel } from '../STDiagnosticsPanel.js';
import { PromptManagerInspector } from './PromptManagerInspector.js';
import { WorldInfoInspector } from './WorldInfoInspector.js';
import { STScriptInspector } from './STScriptInspector.js';
import { ExtensionsInspector } from './ExtensionsInspector.js';
import { ConnectorInspector } from './ConnectorInspector.js';
import { useTavern } from '../../app/TavernProvider.js';
export function DevDiagnosticsPanel() {
    const tavern = useTavern();
    if (!tavern.showDiagnostics)
        return _jsxs("section", { className: "drawer-panel", children: [_jsx("h2", { children: "Dev diagnostics" }), _jsx("p", { children: "Diagnostics are disabled by the host." })] });
    return (_jsxs("section", { className: "drawer-panel product-dev-panel", children: [_jsx("h2", { children: "Dev diagnostics" }), _jsxs("div", { className: "diag-stack compact", children: [_jsx(STDiagnosticsPanel, { runtime: tavern.runtime }), _jsx(EngineCorePreviewPanel, { chat: tavern.liveChat }), _jsx(PromptCriticalPanel, { runtime: tavern.runtime, chat: tavern.liveChat }), _jsx(SlashDiagnosticsPanel, { runtime: tavern.runtime }), _jsx(ImportersPanel, {}), _jsx(PromptManagerInspector, { result: null }), _jsx(WorldInfoInspector, { result: null }), _jsx(STScriptInspector, { registry: null, scope: null, pipeHistory: null, flags: null }), _jsx(ExtensionsInspector, { activationPlan: null, disabled: null }), _jsx(ConnectorInspector, { requests: null })] })] }));
}
//# sourceMappingURL=DevDiagnosticsPanel.js.map