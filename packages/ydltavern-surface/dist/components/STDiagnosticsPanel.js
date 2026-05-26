import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
const WATCHED_EVENT_NAMES = [
    'MESSAGE_SENT',
    'MESSAGE_RECEIVED',
    'GENERATION_STARTED',
    'STREAM_TOKEN_RECEIVED',
    'GENERATION_ENDED',
];
export function STDiagnosticsPanel({ runtime }) {
    const ctx = runtime.getContext();
    const firstMessage = ctx.chat[0];
    const firstMes = typeof firstMessage?.mes === 'string' ? firstMessage.mes : '';
    const firstMesPreview = firstMes.length > 140 ? `${firstMes.slice(0, 137)}…` : firstMes;
    const [recentEvents, setRecentEvents] = useState([]);
    const handlersRef = useRef(new Map());
    useEffect(() => {
        const source = ctx.eventSource;
        // Resolve the actual event type keys from the runtime's event_types constant.
        const entries = WATCHED_EVENT_NAMES
            .map((name) => {
            const key = ctx.event_types[name];
            return key ? [name, key] : undefined;
        })
            .filter((x) => x !== undefined);
        entries.forEach(([name, key]) => {
            const handler = (...args) => {
                setRecentEvents((prev) => {
                    const payload = JSON.stringify(args).slice(0, 180);
                    const next = [
                        { type: name, time: new Date().toLocaleTimeString(), payload },
                        ...prev,
                    ];
                    return next.slice(0, 10);
                });
            };
            handlersRef.current.set(key, handler);
            source.on(key, handler);
        });
        return () => {
            entries.forEach(([_name, key]) => {
                const handler = handlersRef.current.get(key);
                if (handler) {
                    source.off(key, handler);
                    handlersRef.current.delete(key);
                }
            });
        };
    }, [ctx.eventSource, ctx.event_types]);
    return (_jsxs("section", { className: "diag-panel diag-panel-st", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/st-compat" }), _jsx("h2", { children: "ST compatibility projection" }), _jsxs("p", { className: "diag-panel-lede", children: ["The Turn-shaped chat projected through the legacy SillyTavern", ' ', _jsx("code", { children: "chat[]" }), " / ", _jsx("code", { children: "eventSource" }), " / ", _jsx("code", { children: "getContext()" }), ' ', "surface. This panel is wired to a live runtime \u2014 addOneMessage, Generate, and proxy edits are all functional contract-backed operations."] })] }), _jsxs("dl", { className: "diag-grid", children: [_jsxs("div", { className: "diag-cell diag-cell-wide", children: [_jsx("dt", { children: "chat.length" }), _jsx("dd", { className: "value-large", children: ctx.chat.length })] }), _jsxs("div", { className: "diag-cell diag-cell-wide", children: [_jsx("dt", { children: "chat[0].is_user" }), _jsx("dd", { children: String(firstMessage?.is_user ?? false) })] }), _jsxs("div", { className: "diag-cell diag-cell-full", children: [_jsx("dt", { children: "chat[0].mes" }), _jsxs("dd", { className: "value-quote", children: ["\u201C", firstMesPreview, "\u201D"] })] })] }), _jsxs("div", { className: "diag-events", children: [_jsx("h3", { children: "Recent events" }), recentEvents.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No events yet \u2014 send a message or run Fake Generate to populate." })) : (_jsx("ul", { className: "event-log", children: recentEvents.map((entry, idx) => (_jsxs("li", { className: "event-log-item", children: [_jsx("span", { className: "event-log-time", children: entry.time }), _jsx("span", { className: "event-log-type", children: entry.type }), _jsx("span", { className: "event-log-payload", children: entry.payload })] }, `${entry.type}-${entry.time}-${idx}`))) })), _jsx("p", { className: "diag-footnote", children: "Listening to MESSAGE_SENT, MESSAGE_RECEIVED, GENERATION_STARTED, STREAM_TOKEN_RECEIVED, GENERATION_ENDED via eventSource." })] })] }));
}
//# sourceMappingURL=STDiagnosticsPanel.js.map