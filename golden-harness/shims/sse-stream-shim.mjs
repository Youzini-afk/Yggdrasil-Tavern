// sse-stream-shim.mjs: Replaces ST's sse-stream.js
export function getEventSourceStream() {
  return { readable: { getReader: () => ({ read: () => Promise.resolve({ done: true }) }) } };
}
