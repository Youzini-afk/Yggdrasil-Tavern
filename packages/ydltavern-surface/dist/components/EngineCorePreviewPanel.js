import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { buildPrompt, buildOpenAIChatRequest, normalizeSamplerSettings, } from '@ydltavern/engine-core';
const PROMPT_BLOCKS = [
    {
        identifier: 'main',
        role: 'system',
        content: 'You are Aria, a meticulous executive assistant. Be concise and propose concrete next steps.',
        order: 0,
    },
    {
        identifier: 'charDescription',
        role: 'system',
        content: 'Aria values calendar accuracy and tight agendas.',
        order: 1,
    },
    {
        identifier: 'chatHistory',
        role: 'system',
        content: '',
        order: 2,
    },
];
const SAMPLER_INPUT = {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    max_tokens: 512,
    stream: false,
};
export function EngineCorePreviewPanel({ chat }) {
    const { prompt, request, sampler } = useMemo(() => {
        const built = buildPrompt(PROMPT_BLOCKS, chat, { mode: 'chat' });
        const normalized = normalizeSamplerSettings(SAMPLER_INPUT);
        const built_request = buildOpenAIChatRequest({
            model: 'gpt-4o-mini',
            messages: built.messages.map((message) => ({
                role: message.role,
                content: message.content,
            })),
            sampler: normalized,
        });
        return { prompt: built, request: built_request, sampler: normalized };
    }, [chat]);
    const requestPreview = JSON.stringify(request, null, 2);
    return (_jsxs("section", { className: "diag-panel diag-panel-engine", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/engine-core" }), _jsx("h2", { children: "Engine prompt & request preview" }), _jsxs("p", { className: "diag-panel-lede", children: [_jsx("code", { children: "buildPrompt" }), " assembles ST prompt blocks + Turn history;", _jsx("code", { children: "buildOpenAIChatRequest" }), " shapes the wire payload."] })] }), _jsxs("dl", { className: "diag-grid", children: [_jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "messages emitted" }), _jsx("dd", { className: "value-large", children: prompt.messages.length })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "history turns" }), _jsx("dd", { className: "value-large", children: prompt.diagnostics.insertedHistoryTurns })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "blocks included" }), _jsx("dd", { children: prompt.diagnostics.includedBlocks.join(' / ') })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "warnings" }), _jsx("dd", { children: prompt.diagnostics.warnings.length === 0
                                    ? 'none'
                                    : prompt.diagnostics.warnings.join('; ') })] }), _jsxs("div", { className: "diag-cell diag-cell-wide", children: [_jsx("dt", { children: "sampler.normalized" }), _jsxs("dd", { className: "value-row", children: [_jsxs("span", { children: ["temp ", sampler.temperature ?? '—'] }), _jsxs("span", { children: ["top_p ", sampler.top_p ?? '—'] }), _jsxs("span", { children: ["top_k ", sampler.top_k ?? '—'] }), _jsxs("span", { children: ["max ", sampler.max_tokens ?? '—'] })] })] })] }), _jsxs("div", { className: "diag-payload", children: [_jsx("h3", { children: "OpenAI chat request shape" }), _jsx("pre", { className: "json-block", children: requestPreview }), _jsxs("p", { className: "diag-footnote", children: ["ST ", _jsx("code", { children: "top_k" }), " doesn\u2019t cross to the OpenAI surface; engine-core surfaces that via diagnostics rather than silently dropping it."] })] })] }));
}
//# sourceMappingURL=EngineCorePreviewPanel.js.map