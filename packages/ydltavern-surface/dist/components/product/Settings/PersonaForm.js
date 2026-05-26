import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
const DEFAULT_PERSONA = {
    name: 'User',
    description: '',
    avatarUrl: '',
};
export function PersonaForm({ settings, onChange }) {
    const [draft, setDraft] = useState(settings);
    const commit = useCallback(() => {
        onChange(draft);
    }, [draft, onChange]);
    const updateField = useCallback((key, value) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }, []);
    return (_jsxs("section", { className: "settings-form-section", children: [_jsx("h3", { className: "settings-form-title", children: "Persona" }), _jsxs("div", { className: "settings-form-grid", children: [_jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Persona Name" }), _jsx("input", { className: "settings-input", type: "text", value: draft.name, onChange: (e) => updateField('name', e.target.value), onBlur: commit, placeholder: "User" })] }), _jsxs("label", { className: "settings-field settings-field-textarea", children: [_jsx("span", { className: "settings-label", children: "Description" }), _jsx("textarea", { className: "settings-textarea", value: draft.description, onChange: (e) => updateField('description', e.target.value), onBlur: commit, placeholder: "Describe your persona...", rows: 4 })] }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Avatar URL" }), _jsx("input", { className: "settings-input", type: "text", value: draft.avatarUrl, onChange: (e) => updateField('avatarUrl', e.target.value), onBlur: commit, placeholder: "https://example.com/avatar.png" })] })] })] }));
}
export { DEFAULT_PERSONA as DEFAULT_PERSONA_SETTINGS };
//# sourceMappingURL=PersonaForm.js.map