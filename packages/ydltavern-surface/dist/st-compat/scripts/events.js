// SillyTavern public/scripts/events.js compatibility shim.

const g = globalThis;

export const event_types = g.event_types ?? {};
export const eventSource = g.eventSource;
