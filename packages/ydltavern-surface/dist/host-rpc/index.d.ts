export interface HostRpcBridgeConfig {
    targetOrigin?: string | null;
    expectedSource?: MessageEventSource | null;
    bridgeToken?: string | null;
}
export interface ResolvedHostRpcBridgeConfig {
    readonly targetOrigin: string;
    readonly expectedSource: MessageEventSource;
    readonly bridgeToken: string;
}
export declare function setActiveSessionId(sessionId: string | undefined): void;
export declare function getActiveSessionId(): string | undefined;
export declare function configureHostRpcBridge(config: HostRpcBridgeConfig): void;
export declare function configureHostRpcBridgeFromProps(props: Record<string, unknown>): void;
export declare function resetHostRpcBridgeConfig(): void;
export declare function getResolvedHostRpcBridgeConfig(): ResolvedHostRpcBridgeConfig;
export declare function ensureStandaloneHostRpcBridgeConfigured(): void;
export declare function isTrustedBridgeEvent(event: MessageEvent, data: {
    bridge_token?: string;
}, expected: ResolvedHostRpcBridgeConfig): boolean;
export declare function callHostRpc(method: string, params: unknown, timeoutMs?: number): Promise<unknown>;
export declare function invokeCapability(capabilityId: string, input: unknown): Promise<unknown>;
export { streamCapability, type StreamFrame, type StreamHandle } from './stream.js';
//# sourceMappingURL=index.d.ts.map