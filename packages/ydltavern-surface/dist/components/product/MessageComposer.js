import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTavern } from '../../app/TavernProvider.js';
/**
 * @deprecated W4: replaced by SendForm + StreamingIndicator. Will be removed in
 * a future round. Keep for backward compat with any external consumers that
 * still import this.
 */
export function MessageComposer() {
    const tavern = useTavern();
    return _jsxs("section", { className: "product-composer", children: [_jsx("textarea", { value: tavern.input, onChange: (event) => tavern.setInput(event.target.value), onKeyDown: (event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter')
                    void tavern.sendMessage(); }, placeholder: "Type a message. Ctrl/\u2318 + Enter sends." }), _jsxs("div", { className: "composer-actions", children: [_jsx("button", { type: "button", onClick: () => { void tavern.sendMessage(); }, children: "Send" }), _jsx("button", { type: "button", onClick: tavern.generateReply, children: "Generate" })] })] });
}
//# sourceMappingURL=MessageComposer.js.map