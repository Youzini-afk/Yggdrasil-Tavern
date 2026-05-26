import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
const DEFAULT_SAMPLER = {
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    maxTokens: 2048,
};
function SliderInput({ label, value, min, max, step, onChange, onCommit, }) {
    return (_jsxs("label", { className: "settings-field", children: [_jsxs("span", { className: "settings-label", children: [label, _jsx("span", { className: "settings-value-indicator", children: value.toFixed(step < 0.1 ? 2 : 1) })] }), _jsx("input", { className: "settings-slider", type: "range", min: min, max: max, step: step, value: value, onChange: (e) => onChange(Number.parseFloat(e.target.value)), onMouseUp: onCommit, onTouchEnd: onCommit })] }));
}
export function SamplerForm({ settings, onChange }) {
    const [draft, setDraft] = useState(settings);
    const commit = useCallback(() => {
        onChange(draft);
    }, [draft, onChange]);
    const updateField = useCallback((key, value) => {
        setDraft((prev) => ({ ...prev, [key]: value }));
    }, []);
    return (_jsxs("section", { className: "settings-form-section", children: [_jsx("h3", { className: "settings-form-title", children: "Sampler" }), _jsxs("div", { className: "settings-form-sliders", children: [_jsx(SliderInput, { label: "Temperature", value: draft.temperature, min: 0, max: 2, step: 0.01, onChange: (v) => updateField('temperature', v), onCommit: commit }), _jsx(SliderInput, { label: "Top P", value: draft.topP, min: 0, max: 1, step: 0.01, onChange: (v) => updateField('topP', v), onCommit: commit }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Top K" }), _jsx("input", { className: "settings-input", type: "number", min: 0, max: 500, value: draft.topK, onChange: (e) => updateField('topK', Number.parseInt(e.target.value, 10) || 0), onBlur: commit })] }), _jsx(SliderInput, { label: "Frequency Penalty", value: draft.frequencyPenalty, min: -2, max: 2, step: 0.01, onChange: (v) => updateField('frequencyPenalty', v), onCommit: commit }), _jsx(SliderInput, { label: "Presence Penalty", value: draft.presencePenalty, min: -2, max: 2, step: 0.01, onChange: (v) => updateField('presencePenalty', v), onCommit: commit }), _jsxs("label", { className: "settings-field", children: [_jsx("span", { className: "settings-label", children: "Max Tokens" }), _jsx("input", { className: "settings-input", type: "number", min: 1, max: 131072, step: 1, value: draft.maxTokens, onChange: (e) => updateField('maxTokens', Number.parseInt(e.target.value, 10) || 2048), onBlur: commit })] })] })] }));
}
export { DEFAULT_SAMPLER as DEFAULT_SAMPLER_SETTINGS };
//# sourceMappingURL=SamplerForm.js.map