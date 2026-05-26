import { jsx as _jsx } from "react/jsx-runtime";
import { TavernProvider } from '../app/TavernProvider.js';
import { TavernShell } from '../app/TavernShell.js';
import { sampleChat } from '../fixtures/sample-chat.js';
const SURFACE_ROOT_CLASSES = ['ydltavern-surface', 'tavern-surface', 'tavern-surface-play'];
export function TavernPlaySurface({ chat = sampleChat, showDiagnostics = true, className, sessionId, projectId }) {
    return (_jsx("div", { className: composeClass(SURFACE_ROOT_CLASSES, className), children: _jsx(TavernProvider, { chat: chat, showDiagnostics: showDiagnostics, sessionId: sessionId, projectId: projectId, children: _jsx(TavernShell, {}) }) }));
}
function composeClass(base, extra) { return extra ? [...base, extra].join(' ') : base.join(' '); }
//# sourceMappingURL=TavernPlaySurface.js.map