import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { evaluateWorldInfo, buildPromptCriticalBlocks, substituteMacros, } from '@ydltavern/engine-core';
const FIXTURE_BOOK = {
    name: 'surface-wi-fixture',
    entries: [
        {
            uid: 'wi_surf_01',
            comment: 'Activates on "product" — inserted before instruction.',
            key: ['product'],
            content: 'Cross-reference release notes before proposing the agenda.',
            position: 'before',
            order: 0,
        },
        {
            uid: 'wi_surf_02',
            comment: 'Activates on "calendar" — inserted after history.',
            key: ['calendar'],
            content: 'The calendar tool returns events in the Los Angeles timezone.',
            position: 'after',
            order: 10,
        },
        {
            uid: 'wi_surf_03',
            comment: 'AuthorNote top — activated by "review".',
            key: ['review'],
            content: 'Attendee list: Product, Engineering, Design, QA.',
            position: 'ANTop',
            order: 20,
        },
        {
            uid: 'wi_surf_04',
            comment: 'AuthorNote bottom — activated by "agenda".',
            key: ['agenda'],
            content: 'Keep total runtime under 45 minutes unless flagged.',
            position: 'ANBottom',
            order: 30,
        },
        {
            uid: 'wi_surf_05_depth',
            comment: 'atDepth assistant injection preview — activated by "review".',
            key: ['review'],
            content: 'Depth reminder: compare the last assistant answer against the agenda.',
            position: 'atDepth',
            depth: 1,
            role: 'assistant',
            order: 35,
        },
        {
            uid: 'wi_surf_06_group_a',
            comment: 'Seeded group candidate A.',
            key: ['product'],
            content: 'Group A: emphasize release risk.',
            position: 'before',
            group: 'surface-group',
            useProbability: true,
            probability: 100,
            groupWeight: 1,
            order: 40,
        },
        {
            uid: 'wi_surf_07_group_b',
            comment: 'Seeded group candidate B.',
            key: ['product'],
            content: 'Group B: emphasize customer impact.',
            position: 'before',
            group: 'surface-group',
            useProbability: true,
            probability: 100,
            groupWeight: 3,
            order: 41,
        },
        {
            uid: 'wi_surf_08_timed',
            comment: 'Sticky/cooldown preview — activated by "calendar".',
            key: ['calendar'],
            content: 'Sticky note: check calendar conflicts before finalizing.',
            position: 'after',
            sticky: 2,
            cooldown: 1,
            order: 45,
        },
        {
            uid: 'wi_surf_09',
            comment: 'Disabled entry — should always be skipped.',
            key: ['demo'],
            content: 'This content should never appear.',
            disabled: true,
            position: 'before',
            order: 5,
        },
    ],
};
function usePromptCritical(runtime, chat) {
    const ctx = runtime.getContext();
    return useMemo(() => {
        const wi = evaluateWorldInfo({
            chat,
            book: FIXTURE_BOOK,
            scanDepth: 4,
            budget: { type: 'characters', max: 2000 },
            generationType: 'normal',
            chatLength: chat.turns.length,
            randomValues: [0.72, 0.24, 0.83],
            authorNote: 'Always include time-boxed agenda items.',
            macroContext: {
                user: ctx.name1,
                char: ctx.name2,
            },
        });
        const critical = buildPromptCriticalBlocks({
            userName: ctx.name1,
            character: {
                name: ctx.name2,
                description: 'A meticulous executive assistant who values calendar accuracy and tight agendas.',
                personality: 'Organized, concise, proactive.',
                scenario: 'You are preparing for a product review meeting with cross-functional stakeholders.',
            },
            persona: 'Focused professional',
            authorNote: 'Always include time-boxed agenda items.',
            instruct: 'You are {{char}}. {{user}} is your team lead.',
            postHistory: 'End every response with a concrete next step.',
            worldInfo: wi,
            promptManager: {
                generationType: 'normal',
                prompts: [
                    { identifier: 'main', content: 'Surface main prompt for {{char}}.', marker: false, role: 'system' },
                    { identifier: 'worldInfoBefore', marker: true, role: 'system' },
                    { identifier: 'personaDescription', marker: true, role: 'system' },
                    { identifier: 'charDescription', marker: true, role: 'system' },
                    { identifier: 'scenario', marker: true, role: 'system' },
                    { identifier: 'worldInfoAfter', marker: true, role: 'system' },
                    { identifier: 'chatHistory', marker: true, role: 'system' },
                    { identifier: 'jailbreak', marker: true, role: 'system' },
                ],
                prompt_order: [
                    { identifier: 'main', enabled: true },
                    { identifier: 'worldInfoBefore', enabled: true },
                    { identifier: 'personaDescription', enabled: true },
                    { identifier: 'charDescription', enabled: true },
                    { identifier: 'scenario', enabled: true },
                    { identifier: 'worldInfoAfter', enabled: true },
                    { identifier: 'chatHistory', enabled: true },
                    { identifier: 'jailbreak', enabled: true },
                ],
            },
        });
        const macroPreview = substituteMacros('Hello {{char}}, it is {{time}} and {{user}} needs help.', {
            user: ctx.name1,
            char: ctx.name2,
        }).text;
        return { wi, critical, macroPreview };
    }, [chat, ctx.name1, ctx.name2]);
}
export function PromptCriticalPanel({ runtime, chat }) {
    const { wi, critical, macroPreview } = usePromptCritical(runtime, chat);
    return (_jsxs("section", { className: "diag-panel diag-panel-prompt-critical", children: [_jsxs("header", { className: "diag-panel-header", children: [_jsx("span", { className: "diag-panel-eyebrow", children: "@ydltavern/engine-core" }), _jsx("h2", { children: "Prompt-critical & World Info" }), _jsxs("p", { className: "diag-panel-lede", children: [_jsx("code", { children: "evaluateWorldInfo" }), " scans the live Chat;", ' ', _jsx("code", { children: "buildPromptCriticalBlocks" }), " assembles character fields, instruct, author notes and WI buckets into ordered system blocks. Macro substitution is traced per field."] })] }), _jsxs("dl", { className: "diag-grid", children: [_jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "WI activated" }), _jsx("dd", { className: "value-large", children: wi.activated.length })] }), _jsxs("div", { className: "diag-cell", children: [_jsx("dt", { children: "WI skipped" }), _jsx("dd", { className: "value-large", children: wi.skipped.length })] }), _jsxs("div", { className: "diag-cell diag-cell-wide", children: [_jsx("dt", { children: "prompt manager" }), _jsx("dd", { children: critical.diagnostics.markerMapping.map((entry) => entry.promptIdentifier).join(' / ') || 'legacy order' })] }), _jsxs("div", { className: "diag-cell diag-cell-wide", children: [_jsx("dt", { children: "blocks included" }), _jsx("dd", { children: critical.diagnostics.includedBlocks.join(' / ') || '—' })] }), _jsxs("div", { className: "diag-cell diag-cell-wide", children: [_jsx("dt", { children: "skipped fields" }), _jsx("dd", { children: critical.diagnostics.skippedFields.join(' / ') || '—' })] })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "PromptManager marker mapping" }), critical.diagnostics.markerMapping.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No PromptManager mapping; using legacy fallback order." })) : (_jsx("ul", { className: "diag-list", children: critical.diagnostics.markerMapping.map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.promptIdentifier }), _jsx("span", { className: "diag-list-pos", children: entry.marker ? 'marker' : entry.source }), _jsx("span", { className: "diag-list-text", children: String(entry.blockIdentifier) }), _jsxs("span", { className: "diag-list-meta", children: ["order ", entry.order] })] }, `${entry.promptIdentifier}-${idx}`))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "World Info activated entries" }), wi.activated.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No activated entries for the current scan depth." })) : (_jsx("ul", { className: "diag-list", children: wi.activated.map((entry) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.id }), _jsx("span", { className: "diag-list-pos", children: entry.position }), _jsx("span", { className: "diag-list-text", children: entry.content }), _jsxs("span", { className: "diag-list-meta", children: ["keys: ", entry.matchedKeys.join(', ') || '—'] })] }, entry.id))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "World Info skipped entries" }), wi.skipped.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "Nothing skipped." })) : (_jsx("ul", { className: "diag-list", children: wi.skipped.map((entry) => (_jsxs("li", { className: "diag-list-item diag-list-item-dim", children: [_jsx("span", { className: "diag-list-key", children: entry.id }), _jsx("span", { className: "diag-list-reason", children: entry.reason })] }, entry.id))) }))] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "WI buckets" }), _jsx("ul", { className: "diag-list", children: ['before', 'after', 'atDepth', 'ANTop', 'ANBottom', 'outlet'].map((pos) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: pos }), _jsxs("span", { className: "diag-list-count", children: [wi.buckets[pos].length, " entr", wi.buckets[pos].length === 1 ? 'y' : 'ies'] }), wi.buckets[pos].map((text, i) => (_jsx("span", { className: "diag-list-text", children: text }, i)))] }, pos))) })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "WI routing trace" }), _jsx("ul", { className: "diag-list", children: wi.diagnostics.routingTrace.map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.entryId }), _jsx("span", { className: "diag-list-pos", children: entry.bucket }), _jsx("span", { className: "diag-list-text", children: entry.inserted ? 'inserted into prompt-critical bucket' : entry.note || 'diagnostic route only' }), _jsx("span", { className: "diag-list-meta", children: entry.depth !== undefined ? `depth ${entry.depth}` : entry.outletName ? `outlet ${entry.outletName}` : entry.position })] }, `${entry.entryId}-${idx}`))) })] }), _jsxs("div", { className: "diag-subsection diag-split", children: [_jsxs("div", { children: [_jsx("h3", { children: "atDepth / EM / outlet" }), _jsxs("ul", { className: "diag-list", children: [wi.buckets.depthEntries.map((bucket) => (_jsxs("li", { className: "diag-list-item", children: [_jsxs("span", { className: "diag-list-key", children: ["depth ", bucket.depth] }), _jsx("span", { className: "diag-list-pos", children: bucket.role }), _jsx("span", { className: "diag-list-text", children: bucket.content })] }, `${bucket.depth}-${bucket.role}`))), wi.buckets.em.map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsxs("span", { className: "diag-list-key", children: ["EM ", entry.position] }), _jsx("span", { className: "diag-list-text", children: entry.content })] }, `em-${idx}`))), Object.entries(wi.buckets.outlets).map(([name, bucket]) => (_jsxs("li", { className: "diag-list-item", children: [_jsxs("span", { className: "diag-list-key", children: ["outlet ", name] }), _jsx("span", { className: "diag-list-text", children: bucket.content.join(' / ') })] }, name)))] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Author Note patch" }), _jsx("pre", { className: "diag-code-block", children: wi.buckets.anPatch.patched || '—' })] })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "WI advanced trace" }), _jsx("ul", { className: "diag-list", children: wi.diagnostics.activationTrace
                            .filter((entry) => ['probability_roll', 'probability_failed', 'group_candidate', 'group_winner', 'group_loser', 'group_scoring_loser', 'sticky_active', 'cooldown_active', 'delay_active'].includes(entry.code))
                            .slice(0, 12)
                            .map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.code }), _jsx("span", { className: "diag-list-pos", children: entry.entryId }), _jsx("span", { className: "diag-list-text", children: entry.reason }), _jsx("span", { className: "diag-list-meta", children: entry.group ? `group ${entry.group}` : entry.roll !== undefined ? `roll ${entry.roll.toFixed(2)}` : '' })] }, `${entry.entryId}-${entry.code}-${idx}`))) }), _jsxs("p", { className: "diag-footnote", children: ["nextState sticky: ", wi.nextState.sticky?.length ?? 0, "; cooldown: ", wi.nextState.cooldown?.length ?? 0] })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Prompt-critical blocks" }), _jsx("ul", { className: "diag-list", children: critical.blocks.map((block) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: String(block.identifier) }), _jsx("span", { className: "diag-list-pos", children: block.role }), _jsx("span", { className: "diag-list-text", children: block.content })] }, block.identifier))) })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Macro trace" }), critical.diagnostics.macroTrace.length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No macros substituted in prompt-critical fields." })) : (_jsx("ul", { className: "diag-list", children: critical.diagnostics.macroTrace.map((entry, idx) => (_jsxs("li", { className: "diag-list-item", children: [_jsx("span", { className: "diag-list-key", children: entry.name }), _jsx("span", { className: "diag-list-pos", children: entry.source }), _jsx("span", { className: "diag-list-text", children: entry.preview })] }, `${entry.name}-${idx}`))) })), _jsxs("p", { className: "diag-footnote", children: ["Quick macro preview: ", _jsx("code", { children: macroPreview })] })] }), _jsxs("div", { className: "diag-subsection", children: [_jsx("h3", { children: "Diagnostics warnings" }), [...wi.diagnostics.warnings, ...critical.diagnostics.warnings].length === 0 ? (_jsx("p", { className: "diag-footnote", children: "No warnings." })) : (_jsx("ul", { className: "diag-list", children: [...wi.diagnostics.warnings, ...critical.diagnostics.warnings].map((w, i) => (_jsx("li", { className: "diag-list-item diag-list-item-dim", children: _jsx("span", { className: "diag-list-text", children: w }) }, i))) })), critical.diagnostics.knownDeltas.length > 0 && (_jsxs("p", { className: "diag-footnote", children: ["Known deltas: ", critical.diagnostics.knownDeltas.join(' / ')] }))] })] }));
}
//# sourceMappingURL=PromptCriticalPanel.js.map