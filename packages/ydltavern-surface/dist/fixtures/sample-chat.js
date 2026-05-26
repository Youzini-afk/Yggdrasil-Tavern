// A small fixture exercised by the bundled surfaces and any host-side
// demos/tests. All four sibling packages — types, st-compat, engine-core,
// importers — see the same Chat instance.
const calendarArguments = {
    day: 'tomorrow',
    tz: 'America/Los_Angeles',
};
const calendarResult = {
    events: [
        {
            title: 'Product review',
            start: '14:00',
            duration_min: 45,
            attendees: 6,
        },
    ],
};
export const sampleChat = {
    id: 'chat_demo_0001',
    meta: {
        title: 'Product review prep',
        character_id: 'char_demo_aria',
        persona_id: 'persona_demo_user',
        source_format: 'ydltavern_native',
    },
    turns: [
        {
            id: 'turn_user_0001',
            index: 0,
            role: 'user',
            speaker: { id: 'persona_demo_user', name: 'You', kind: 'user' },
            active_variant: 0,
            source: 'user_input',
            created_at: 1_726_300_000_000,
            variants: [
                {
                    id: 'variant_user_0001',
                    subs: [
                        {
                            kind: 'text',
                            text: "Help me plan tomorrow's product review. Pull the calendar entry " +
                                'and propose an agenda.',
                        },
                    ],
                    meta: {},
                    created_at: 1_726_300_000_000,
                },
            ],
        },
        {
            id: 'turn_assistant_0002',
            index: 1,
            role: 'assistant',
            speaker: { id: 'char_demo_aria', name: 'Aria', kind: 'character' },
            active_variant: 0,
            source: 'generation',
            created_at: 1_726_300_040_000,
            variants: [
                {
                    id: 'variant_assistant_0002a',
                    model: 'gpt-4o-mini',
                    subs: [
                        {
                            kind: 'thinking',
                            text: 'I should check the calendar before drafting an agenda. The user ' +
                                'said "tomorrow" so I will look up tomorrow\'s events first, then ' +
                                'draft a tight agenda that respects the meeting length.',
                            collapsed_by_default: true,
                        },
                        {
                            kind: 'tool_call',
                            call_id: 'call_cal_001',
                            tool: { provider: 'calendar', name: 'calendar.list_day' },
                            arguments: calendarArguments,
                        },
                        {
                            kind: 'tool_result',
                            call_id: 'call_cal_001',
                            status: 'ok',
                            result: calendarResult,
                        },
                        {
                            kind: 'text',
                            text: "Here's a 45-minute agenda for tomorrow's product review:\n\n" +
                                '1. Status (5m) — release health, blockers\n' +
                                '2. Demo (15m) — turn renderer + ST compat layer\n' +
                                '3. Discussion (20m) — extension surface tradeoffs\n' +
                                '4. Next steps (5m) — owners + dates',
                        },
                        {
                            kind: 'note',
                            text: 'agenda calibrated to 45m; trim discussion if demo runs over.',
                        },
                    ],
                    meta: {
                        model: 'gpt-4o-mini',
                        prompt_tokens: 612,
                        completion_tokens: 184,
                        tokens: 796,
                        latency_ms: 1450,
                        finish_reason: 'stop',
                    },
                    created_at: 1_726_300_040_000,
                },
                {
                    id: 'variant_assistant_0002b',
                    model: 'gpt-4o-mini',
                    subs: [
                        {
                            kind: 'text',
                            text: '(alternate variant — empty placeholder; swipe wiring is not implemented yet.)',
                        },
                    ],
                    meta: {
                        model: 'gpt-4o-mini',
                        finish_reason: 'placeholder',
                    },
                    created_at: 1_726_300_050_000,
                },
            ],
        },
    ],
};
//# sourceMappingURL=sample-chat.js.map