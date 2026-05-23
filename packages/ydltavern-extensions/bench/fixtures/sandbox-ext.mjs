export const microStExtensionSource = `
const { eventSource, event_types } = globalThis;
eventSource?.on?.(event_types?.MESSAGE_RECEIVED ?? 'MESSAGE_RECEIVED', () => {});
`;
