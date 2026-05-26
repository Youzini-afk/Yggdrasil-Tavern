//! Streaming capability invocation over the surface-host postMessage bridge.
//!
//! Returns an AsyncIterable<StreamFrame> that the caller awaits. When the caller
//! is done (or wants to abort), call handle.cancel() to send
//! kernel.v1.capability.cancel and unsubscribe.
import { callHostRpc, getActiveSessionId, getResolvedHostRpcBridgeConfig, isTrustedBridgeEvent } from './index.js';
let nextSubscriptionId = 1;
function newSubscriptionId() {
    return `sub-${nextSubscriptionId++}-${Date.now()}`;
}
/**
 * Minimal async queue with push + close + iter.
 * Allows producer (postMessage handler) and consumer (for-await) to be decoupled.
 */
class AsyncQueue {
    items = [];
    resolvers = [];
    closed = false;
    push(item) {
        if (this.closed)
            return;
        const r = this.resolvers.shift();
        if (r)
            r({ value: item, done: false });
        else
            this.items.push(item);
    }
    close() {
        if (this.closed)
            return;
        this.closed = true;
        for (const r of this.resolvers)
            r({ value: undefined, done: true });
        this.resolvers.length = 0;
    }
    iter() {
        const queue = this;
        return {
            [Symbol.asyncIterator]() {
                return {
                    next() {
                        const item = queue.items.shift();
                        if (item !== undefined)
                            return Promise.resolve({ value: item, done: false });
                        if (queue.closed)
                            return Promise.resolve({ value: undefined, done: true });
                        return new Promise((resolve) => queue.resolvers.push(resolve));
                    },
                    return() {
                        queue.close();
                        return Promise.resolve({ value: undefined, done: true });
                    },
                };
            },
        };
    }
}
/**
 * Start a streaming capability invocation.
 *
 * Calls kernel.v1.capability.stream to obtain stream_id, then subscribes via
 * postMessage. Returns a handle whose `frames` is an AsyncIterable. Caller must
 * either consume to completion (which auto-cleans up) or call cancel().
 */
export async function streamCapability(capabilityId, input) {
    const sessionId = getActiveSessionId();
    if (!sessionId) {
        throw new Error('streamCapability requires active session id (set via mount initialProps)');
    }
    const bridge = getResolvedHostRpcBridgeConfig();
    // 1. Start stream via kernel.v1.capability.stream
    const start = await callHostRpc('kernel.v1.capability.stream', {
        capability_id: capabilityId,
        input,
    });
    const streamId = start.stream_id ?? start.output?.stream_id;
    if (!streamId) {
        throw new Error('kernel.v1.capability.stream did not return stream_id');
    }
    // 2. Subscribe to stream frames via postMessage
    const subscriptionId = newSubscriptionId();
    const queue = new AsyncQueue();
    let cleanedUp = false;
    const cleanup = () => {
        if (cleanedUp)
            return;
        cleanedUp = true;
        if (typeof window !== 'undefined') {
            window.removeEventListener('message', onMessage);
            // Tell host to drop its subscription too
            try {
                window.parent?.postMessage({
                    type: 'stream.unsubscribe',
                    subscription_id: subscriptionId,
                    session_id: sessionId,
                    bridge_token: bridge.bridgeToken,
                }, bridge.targetOrigin);
            }
            catch { /* ignore */ }
        }
        queue.close();
    };
    const frames = {
        [Symbol.asyncIterator]() {
            const iterator = queue.iter()[Symbol.asyncIterator]();
            return {
                next: () => iterator.next(),
                return: async () => {
                    cleanup();
                    if (iterator.return)
                        return iterator.return();
                    return { value: undefined, done: true };
                },
            };
        },
    };
    const onMessage = (e) => {
        const data = e.data;
        if (!data || typeof data !== 'object')
            return;
        if (data.subscription_id !== subscriptionId)
            return;
        if (data.session_id !== sessionId)
            return;
        if (!isTrustedBridgeEvent(e, data, bridge))
            return;
        if (data.type === 'stream.frame') {
            queue.push({ kind: data.kind, payload: data.payload });
        }
        else if (data.type === 'stream.ended') {
            queue.push({ kind: 'ended', payload: null });
            cleanup();
        }
        else if (data.type === 'stream.error') {
            queue.push({ kind: 'error', payload: data.error });
            cleanup();
        }
    };
    if (typeof window !== 'undefined' && window.parent) {
        window.addEventListener('message', onMessage);
        window.parent.postMessage({
            type: 'stream.subscribe',
            id: subscriptionId,
            subscription_id: subscriptionId,
            stream_id: streamId,
            session_id: sessionId,
            bridge_token: bridge.bridgeToken,
        }, bridge.targetOrigin);
    }
    else {
        // No window/parent (e.g., test environment without bridge): immediately error
        queue.push({
            kind: 'error',
            payload: { code: 'no_window', message: 'streamCapability requires window.parent' },
        });
        cleanup();
    }
    return {
        streamId,
        frames,
        async cancel() {
            try {
                await callHostRpc('kernel.v1.capability.cancel', { stream_id: streamId });
            }
            catch {
                // best-effort; cleanup anyway
            }
            finally {
                cleanup();
            }
        },
    };
}
//# sourceMappingURL=stream.js.map