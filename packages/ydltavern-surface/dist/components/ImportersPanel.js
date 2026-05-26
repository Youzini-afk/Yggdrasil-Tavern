import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { importCharacterCard, importChatHistory } from '@ydltavern/importers';
// Inline ST-style fixtures kept tiny on purpose. We're proving the importers
// package wires at build time and produces normalized Turn-shaped output, not
// auditing import quality (that lives in the importers package's own tests).
const CHARACTER_FIXTURE = {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: {
        name: 'Aria',
        description: 'Meticulous executive assistant. Calendar-first, agenda-driven.',
        personality: 'Precise, warm, allergic to vague action items.',
        first_mes: 'Morning. What are we trying to ship today?',
        tags: ['assistant', 'planning'],
    },
};
const CHAT_FIXTURE_JSONL = [
    JSON.stringify({
        user_name: 'You',
        character_name: 'Aria',
        chat_metadata: { tainted: false },
    }),
    JSON.stringify({
        name: 'You',
        is_user: true,
        send_date: '2026-05-20T16:00:00.000Z',
        mes: 'Pull tomorrow\'s calendar and draft an agenda.',
    }),
    JSON.stringify({
        name: 'Aria',
        is_user: false,
        send_date: '2026-05-20T16:00:42.000Z',
        mes: 'On it. 45 minutes, four blocks.',
    }),
].join('\n');
export function ImportersPanel() {
    const { card, history } = useMemo(() => {
        return {
            card: importCharacterCard(CHARACTER_FIXTURE),
            history: importChatHistory(CHAT_FIXTURE_JSONL),
        };
    }, []);
    return (_jsxs("section", { className: "diag-panel diag-panel-importers", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/importers" }), _jsx("h2", { children: "SillyTavern asset roundtrip" }), _jsxs("p", { className: "diag-panel-lede", children: ["Two tiny inline fixtures fed through ", _jsx("code", { children: "importCharacterCard" }), " and", _jsx("code", { children: "importChatHistory" }), "; output is the same Turn / Chat shape the renderer above consumes."] })] }), _jsxs("dl", { className: "diag-grid", children: [_jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "card.format" }), _jsx("dd", { children: _jsx("code", { children: card.format }) })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "card.name" }), _jsx("dd", { children: card.name })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "chat.turns" }), _jsx("dd", { className: "value-large", children: history.chat.turns.length })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "source_format" }), _jsx("dd", { children: _jsx("code", { children: history.chat.meta.source_format ?? '—' }) })] }), _jsxs("div", { className: "diag-cell diag-cell-full", children: [_jsx("dt", { children: "diagnostics" }), _jsx("dd", { children: card.diagnostics.length + history.diagnostics.length === 0
                                    ? 'no warnings'
                                    : [...card.diagnostics, ...history.diagnostics]
                                        .map((d) => d.message)
                                        .join('; ') })] })] }), _jsxs("p", { className: "diag-footnote", children: ["Imported turns carry ", _jsx("code", { children: "source: \u2018imported\u2019" }), " and a", _jsx("code", { children: "preserved" }), " payload so the original ST blob round-trips losslessly."] })] }));
}
//# sourceMappingURL=ImportersPanel.js.map