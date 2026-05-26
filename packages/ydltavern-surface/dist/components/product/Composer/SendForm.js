import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ComposerToolbar } from './ComposerToolbar';
import { StreamingIndicator } from './StreamingIndicator';
const MAX_TEXTAREA_HEIGHT = 320; // px
export function SendForm(props) {
    const [text, setText] = useState(props.initialText ?? '');
    const textareaRef = useRef(null);
    const resizeTextarea = useCallback(() => {
        const el = textareaRef.current;
        if (!el)
            return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }, []);
    const handleSend = useCallback(async () => {
        if (!text.trim() || props.disabled || props.isGenerating)
            return;
        const value = text;
        setText('');
        const el = textareaRef.current;
        if (el) {
            el.style.height = 'auto';
        }
        await props.onSend(value);
        textareaRef.current?.focus();
    }, [text, props.disabled, props.isGenerating, props.onSend]);
    const handleKeyDown = useCallback((e) => {
        // Ctrl/Cmd+Enter sends; Shift+Enter newline; plain Enter sends (ST convention)
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleSend();
            return;
        }
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);
    useEffect(() => {
        if (!props.isGenerating) {
            try {
                textareaRef.current?.focus();
            }
            catch {
                // ignore focus failures in test envs without full focus support
            }
        }
    }, [props.isGenerating]);
    useEffect(() => {
        resizeTextarea();
    }, [text, resizeTextarea]);
    return (_jsxs("form", { id: "send_form", className: "send_form", onSubmit: (e) => {
            e.preventDefault();
            handleSend();
        }, "aria-label": "Send message", children: [props.isGenerating && _jsx(StreamingIndicator, { onStop: props.onStop }), props.needsApiConnection && (_jsxs("div", { className: "ydl-api-callout", role: "alert", children: [_jsx("span", { className: "ydl-api-callout-text", children: "No API connection configured. Set a provider and key to send messages." }), props.onOpenApiConnections && (_jsxs("button", { type: "button", className: "menu_button", onClick: props.onOpenApiConnections, "aria-label": "Open API Connections", children: [_jsx("i", { className: "fa-solid fa-plug", "aria-hidden": "true" }), " Open API Connections"] }))] })), _jsxs("div", { className: "send_form_row", children: [_jsx("div", { id: "leftSendForm", "data-extension-territory": true, children: _jsx(ComposerToolbar, { onOptions: props.onOptions, onContinue: props.onContinue, onImpersonate: props.onImpersonate, isGenerating: props.isGenerating }) }), _jsx("textarea", { ref: textareaRef, id: "send_textarea", className: "send_textarea", value: text, onChange: (e) => setText(e.target.value), onKeyDown: handleKeyDown, placeholder: props.placeholder ?? 'Type a message\u2026', rows: 1, disabled: props.disabled || props.isGenerating, "aria-label": "Message input", style: { overflowY: 'auto' } }), _jsx("div", { id: "rightSendForm", "data-extension-territory": true, children: props.isGenerating ? (_jsx("button", { type: "button", id: "send_but", className: "send_but composer_stop_button mes_button", onClick: props.onStop, "aria-label": "Stop generation", children: _jsx("i", { className: "fa-solid fa-circle-stop", "aria-hidden": "true" }) })) : (_jsx("button", { type: "submit", id: "send_but", className: "send_but mes_button", disabled: !text.trim() || props.disabled, "aria-label": "Send message", children: _jsx("i", { className: "fa-solid fa-paper-plane", "aria-hidden": "true" }) })) })] })] }));
}
//# sourceMappingURL=SendForm.js.map