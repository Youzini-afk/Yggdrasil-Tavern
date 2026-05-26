import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { validateSecretRef } from '../../../state/secrets.js';
const DEFAULT_CONNECTION = {
    provider: 'openai',
    model: 'gpt-4o-mini',
    secretRef: 'secret_ref:store:OPENAI_API_KEY',
    apiBaseUrl: '',
    stream: true,
};
const PROVIDERS = [
    'openai', 'deepseek', 'anthropic', 'openrouter', 'custom',
];
const ENGINE_SUPPORTED_PROVIDERS = new Set(['openai', 'deepseek', 'anthropic', 'openrouter']);
export function ConnectionForm({ settings, onChange }) {
    const [draft, setDraft] = useState(settings);
    const [secretError, setSecretError] = useState();
    const commit = useCallback((nextDraft = draft) => {
        const error = validateSecretRef(nextDraft.secretRef);
        setSecretError(error);
        if (error !== undefined)
            return;
        onChange(nextDraft);
    }, [draft, onChange]);
    const handleCommitBlur = useCallback(() => {
        commit();
    }, [commit]);
    const updateField = useCallback((key, value) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }, []);
    const handleChange = useCallback((key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (key === 'secretRef') {
            setSecretError(validateSecretRef(String(value)));
        }
        updateField(key, value);
    }, [updateField]);
    const handleSecretChange = useCallback((e) => {
        const nextDraft = { ...draft, secretRef: e.target.value };
        setDraft(nextDraft);
        setSecretError(validateSecretRef(nextDraft.secretRef));
    }, [draft]);
    const handleSecretBlurCurrent = useCallback((e) => {
        const nextDraft = { ...draft, secretRef: e.target.value };
        setDraft(nextDraft);
        commit(nextDraft);
    }, [draft, commit]);
    return (_jsxs("section", { className: "settings-form-section", children: [_jsx("h3", { className: "settings-form-title", children: "Connection" }), _jsxs("div", { className: "settings-form-grid", children: [_jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Provider" }), _jsx("select", { className: "settings-input", value: draft.provider, onChange: handleChange('provider'), onBlur: handleCommitBlur, children: PROVIDERS.map((p) => (_jsxs("option", { value: p, disabled: !ENGINE_SUPPORTED_PROVIDERS.has(p), children: [p, ENGINE_SUPPORTED_PROVIDERS.has(p) ? '' : ' (unsupported)'] }, p))) })] }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Model" }), _jsx("input", { className: "settings-input", type: "text", value: draft.model, onChange: handleChange('model'), onBlur: handleCommitBlur, placeholder: "gpt-4o-mini" })] }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Secret Ref" }), _jsx("input", { className: `settings-input${secretError ? ' settings-input-error' : ''}`, type: "text", value: draft.secretRef, onChange: handleSecretChange, onBlur: handleSecretBlurCurrent, placeholder: "secret_ref:store:OPENAI_API_KEY" }), secretError !== undefined ? (_jsx("span", { className: "settings-field-error", children: secretError })) : null] }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "API Base URL (not used for live calls)" }), _jsx("input", { className: "settings-input", type: "text", value: draft.apiBaseUrl, onChange: handleChange('apiBaseUrl'), onBlur: handleCommitBlur, placeholder: "https://api.openai.com/v1" }), _jsx("span", { className: "settings-help-text", children: "Live provider calls use fixed engine host mappings; this does not override outbound host." })] }), _jsxs("label", { className: "settings-field settings-field-row", children: [_jsx("span", { className: "settings-label", children: "Stream" }), _jsx("input", { className: "settings-checkbox", type: "checkbox", checked: draft.stream, onChange: handleChange('stream'), onBlur: handleCommitBlur })] })] }), _jsx("div", { className: "settings-form-actions", children: _jsx("button", { type: "button", className: "settings-button", disabled: true, title: "Save a profile, then send a message to verify the connection through Yggdrasil.", children: "Test after save" }) })] }));
}
export { DEFAULT_CONNECTION as DEFAULT_CONNECTION_SETTINGS };
//# sourceMappingURL=ConnectionForm.js.map