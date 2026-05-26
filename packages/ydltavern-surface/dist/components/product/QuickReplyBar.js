import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function QuickReplyBar({ sets, onTrigger }) {
    const visible = sets.filter((s) => s.enabled && s.items.length > 0);
    if (visible.length === 0)
        return null;
    return (_jsx("section", { className: "tavern-quick-reply-bar", children: visible.map((set) => (_jsxs("div", { className: "qr-set", "data-set-id": set.id, children: [set.name !== set.id ? (_jsx("span", { className: "qr-set-label", children: set.name })) : null, _jsx("div", { className: "qr-items", role: "group", "aria-label": set.name, children: set.items.map((item) => (_jsx("button", { type: "button", className: "qr-button", onClick: () => onTrigger(item.id), title: item.label, children: item.label }, item.id))) })] }, set.id))) }));
}
//# sourceMappingURL=QuickReplyBar.js.map