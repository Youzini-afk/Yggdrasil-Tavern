import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { normalizeQuickReplySets } from '@ydltavern/extensions';
import { SendForm } from '../components/product/Composer/SendForm.js';
import { MessageList } from '../components/product/MessageList.js';
import { QuickReplyBar } from '../components/product/QuickReplyBar.js';
import { ThemedRoot } from '../components/product/themes/ThemedRoot.js';
import { useTavern } from './TavernProvider.js';
import { TopBar } from '../components/shell/TopBar.js';
import { Sheld } from '../components/shell/Sheld.js';
import { useDrawers } from '../components/shell/useDrawers.js';
import { AIConfigDrawer, APIConnectionsDrawer, AdvancedFormattingDrawer, WorldInfoDrawer, UserSettingsDrawer, BackgroundsDrawer, ExtensionsDrawer, PersonaDrawer, CharactersDrawer, } from '../components/shell/drawers/index.js';
export function TavernShell() {
    const tavern = useTavern();
    const drawers = useDrawers();
    // Build quick reply sets from demo/extension data
    const qrSets = useQuickReplySets(tavern.extensionRecords);
    useEffect(() => {
        if (tavern.needsApiConnection) {
            drawers.open('api-connections');
        }
    }, [tavern.needsApiConnection, drawers]);
    // Escape closes active drawer unless focus is inside a textarea/input
    useEffect(() => {
        const handler = (e) => {
            if (e.key !== 'Escape')
                return;
            if (!drawers.openId)
                return;
            const active = document.activeElement;
            if (active instanceof HTMLTextAreaElement)
                return;
            if (active instanceof HTMLInputElement && (active.type === 'text' || active.type === 'search'))
                return;
            e.preventDefault();
            drawers.close();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [drawers]);
    const handleQuickReply = (id) => {
        if (!id)
            return;
        tavern.pushSystemNotice('Quick reply is not yet available on this surface.');
    };
    return (_jsx(ThemedRoot, { theme: tavern.theme, children: _jsxs("div", { className: "ydltavern-surface tavern-shell", "data-drawer-open": drawers.openId ?? 'none', children: [_jsx(TopBar, { drawers: drawers }), _jsxs("div", { className: "drawer-rail drawer-rail-left", children: [_jsx(AIConfigDrawer, { drawers: drawers }), _jsx(APIConnectionsDrawer, { drawers: drawers }), _jsx(AdvancedFormattingDrawer, { drawers: drawers }), _jsx(WorldInfoDrawer, { drawers: drawers }), _jsx(UserSettingsDrawer, { drawers: drawers }), _jsx(BackgroundsDrawer, { drawers: drawers }), _jsx(ExtensionsDrawer, { drawers: drawers }), _jsx(PersonaDrawer, { drawers: drawers })] }), _jsxs(Sheld, { children: [_jsx(MessageList, { onOpenApiConnections: () => drawers.open('api-connections'), onOpenCharacters: () => drawers.open('characters'), onOpenExtensions: () => drawers.open('extensions') }), _jsx(QuickReplyBar, { sets: qrSets, onTrigger: handleQuickReply }), _jsx(SendForm, { onSend: (text) => tavern.sendMessage(text), onContinue: () => tavern.continueLastReply(), onImpersonate: () => tavern.impersonate(), onStop: () => tavern.cancelGeneration(), onOptions: () => {
                                // TODO Phase B: open options menu (slash commands, attach, etc.)
                            }, isGenerating: tavern.isGenerating, needsApiConnection: tavern.needsApiConnection, onOpenApiConnections: () => drawers.open('api-connections') })] }), _jsx("div", { id: "movingDivs", "data-extension-territory": true }), _jsxs("div", { style: { display: 'none' }, "aria-hidden": "true", children: [_jsx("div", { id: "extensions_settings", "data-extension-territory": true }), _jsx("div", { id: "extensions_settings2", "data-extension-territory": true })] }), _jsx("div", { className: "drawer-rail drawer-rail-right", children: _jsx(CharactersDrawer, { drawers: drawers }) }), drawers.openId && (_jsx("button", { type: "button", className: "drawer-backdrop", onClick: drawers.close, "aria-label": "Close drawer" }))] }) }));
}
function useQuickReplySets(records) {
    if (records.length === 0)
        return [];
    const _qrRecord = records.find((r) => r.id === 'quick-reply');
    void _qrRecord;
    // Minimal demo to prove the bar works
    const demo = normalizeQuickReplySets([
        {
            id: 'demo',
            name: 'Demo Set',
            enabled: true,
            items: [
                { id: 'demo_1', label: 'Continue', slashCommand: '/continue' },
                { id: 'demo_2', label: 'Regenerate', slashCommand: '/regenerate' },
                { id: 'demo_3', label: 'Summarize', slashCommand: '/summarize' },
            ],
        },
    ]);
    return demo.sets.map((s) => ({
        id: s.id,
        name: s.name,
        enabled: s.enabled,
        items: s.items.map((i) => ({ id: i.id, label: i.label })),
    }));
}
//# sourceMappingURL=TavernShell.js.map