export interface StreamFrame {
    kind: 'started' | 'chunk' | 'progress' | 'ended' | 'error' | 'cancelled' | 'timeout';
    payload: unknown;
}
export interface StreamHandle {
    streamId: string;
    frames: AsyncIterable<StreamFrame>;
    cancel(): Promise<void>;
}
/**
 * Start a streaming capability invocation.
 *
 * Calls kernel.v1.capability.stream to obtain stream_id, then subscribes via
 * postMessage. Returns a handle whose `frames` is an AsyncIterable. Caller must
 * either consume to completion (which auto-cleans up) or call cancel().
 */
export declare function streamCapability(capabilityId: string, input: unknown): Promise<StreamHandle>;
//# sourceMappingURL=stream.d.ts.map