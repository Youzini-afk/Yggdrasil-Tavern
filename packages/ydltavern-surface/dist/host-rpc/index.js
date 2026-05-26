//! Surface-side helper for calling Yggdrasil host RPC methods through the
//! iframe postMessage bridge.
let nextRpcId = 1;
let activeSessionId;
let configuredTargetOrigin;
let configuredExpectedSource;
let configuredBridgeToken;
let checkedLocationBridgeConfig = false;
const pending = new Map();
let listenerWindow;
const TARGET_ORIGIN_KEYS = [
    'targetOrigin',
    'target_origin',
    'bridgeTargetOrigin',
    'bridge_target_origin',
    'hostOrigin',
    'host_origin',
    'rpcTargetOrigin',
    'rpc_target_origin',
];
const BRIDGE_TOKEN_KEYS = [
    'bridgeToken',
    'bridge_token',
    'bridgeNonce',
    'bridge_nonce',
    'hostRpcBridgeToken',
    'host_rpc_bridge_token',
];
function ensureRpcListener() {
    if (typeof window === 'undefined' || listenerWindow === window)
        return;
    listenerWindow = window;
    window.addEventListener('message', (e) => {
        const msg = e.data;
        if (msg?.type !== 'rpc.result')
            return;
        const handler = pending.get(msg.id);
        if (!handler)
            return;
        if (!isTrustedBridgeEvent(e, msg, handler))
            return;
        pending.delete(msg.id);
        if (msg.error) {
            handler.reject(new Error(`${msg.error.code}: ${msg.error.message}`));
        }
        else {
            handler.resolve(msg.result);
        }
    });
}
// One global listener registered at module load when possible, and lazily in
// callHostRpc for tests/modules that import before a DOM window exists.
ensureRpcListener();
export function setActiveSessionId(sessionId) {
    activeSessionId = sessionId;
}
export function getActiveSessionId() {
    return activeSessionId;
}
export function configureHostRpcBridge(config) {
    if ('targetOrigin' in config) {
        configuredTargetOrigin = config.targetOrigin == null ? undefined : normalizeTargetOrigin(config.targetOrigin);
    }
    if ('expectedSource' in config) {
        configuredExpectedSource = config.expectedSource ?? undefined;
    }
    if ('bridgeToken' in config) {
        configuredBridgeToken = normalizeToken(config.bridgeToken);
    }
    if (!configuredBridgeToken && (configuredTargetOrigin || config.bridgeToken === undefined)) {
        configuredBridgeToken = createBridgeToken();
    }
}
export function configureHostRpcBridgeFromProps(props) {
    const targetOrigin = readStringFromRecord(props, TARGET_ORIGIN_KEYS);
    const bridgeToken = readStringFromRecord(props, BRIDGE_TOKEN_KEYS);
    const config = {};
    let hasConfig = false;
    if (targetOrigin !== undefined) {
        config.targetOrigin = targetOrigin;
        hasConfig = true;
    }
    if (bridgeToken !== undefined) {
        config.bridgeToken = bridgeToken;
        hasConfig = true;
    }
    if (hasConfig && typeof window !== 'undefined' && window.parent) {
        config.expectedSource = window.parent;
    }
    if (hasConfig)
        configureHostRpcBridge(config);
}
export function resetHostRpcBridgeConfig() {
    configuredTargetOrigin = undefined;
    configuredExpectedSource = undefined;
    configuredBridgeToken = undefined;
    checkedLocationBridgeConfig = false;
}
export function getResolvedHostRpcBridgeConfig() {
    configureHostRpcBridgeFromLocation();
    const targetOrigin = configuredTargetOrigin ?? getStandaloneSameOriginFallback();
    if (!targetOrigin) {
        throw new Error('host RPC unavailable: bridge targetOrigin is not configured');
    }
    const expectedSource = configuredExpectedSource ?? getDefaultExpectedSource();
    if (!expectedSource) {
        throw new Error('host RPC unavailable: bridge expectedSource is not configured');
    }
    if (!configuredBridgeToken)
        configuredBridgeToken = createBridgeToken();
    return {
        targetOrigin,
        expectedSource,
        bridgeToken: configuredBridgeToken,
    };
}
export function ensureStandaloneHostRpcBridgeConfigured() {
    configureHostRpcBridgeFromLocation();
    if (configuredTargetOrigin)
        return;
    const targetOrigin = getStandaloneSameOriginFallback();
    if (!targetOrigin)
        return;
    configureHostRpcBridge({
        targetOrigin,
        expectedSource: getDefaultExpectedSource(),
    });
}
export function isTrustedBridgeEvent(event, data, expected) {
    if (event.source !== expected.expectedSource)
        return false;
    if (event.origin !== expected.targetOrigin)
        return false;
    if (data.bridge_token !== expected.bridgeToken)
        return false;
    return true;
}
export async function callHostRpc(method, params, timeoutMs = 30000) {
    if (typeof window === 'undefined' || !window.parent) {
        throw new Error('host RPC unavailable: not running in surface iframe');
    }
    ensureRpcListener();
    const bridge = getResolvedHostRpcBridgeConfig();
    const id = `rpc-${nextRpcId++}-${Date.now()}`;
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            pending.delete(id);
            reject(new Error(`host RPC timeout after ${timeoutMs}ms (method=${method})`));
        }, timeoutMs);
        pending.set(id, {
            resolve: (v) => { clearTimeout(timer); resolve(v); },
            reject: (e) => { clearTimeout(timer); reject(e); },
            targetOrigin: bridge.targetOrigin,
            expectedSource: bridge.expectedSource,
            bridgeToken: bridge.bridgeToken,
        });
        const message = {
            type: 'rpc.call',
            id,
            method,
            params,
            bridge_token: bridge.bridgeToken,
        };
        if (activeSessionId)
            message.session_id = activeSessionId;
        window.parent.postMessage(message, bridge.targetOrigin);
    });
}
function configureHostRpcBridgeFromLocation() {
    if (checkedLocationBridgeConfig)
        return;
    checkedLocationBridgeConfig = true;
    if (typeof window === 'undefined')
        return;
    const searchParams = getLocationSearchParams();
    const hashParams = getLocationHashParams();
    const targetOrigin = readStringFromSearchParams(searchParams, TARGET_ORIGIN_KEYS)
        ?? readStringFromSearchParams(hashParams, TARGET_ORIGIN_KEYS);
    const bridgeToken = readStringFromSearchParams(searchParams, BRIDGE_TOKEN_KEYS)
        ?? readStringFromSearchParams(hashParams, BRIDGE_TOKEN_KEYS);
    const config = {};
    let hasConfig = false;
    if (targetOrigin !== undefined) {
        config.targetOrigin = targetOrigin;
        hasConfig = true;
    }
    if (bridgeToken !== undefined) {
        config.bridgeToken = bridgeToken;
        hasConfig = true;
    }
    if (hasConfig && window.parent)
        config.expectedSource = window.parent;
    if (hasConfig)
        configureHostRpcBridge(config);
}
function getLocationSearchParams() {
    try {
        return new URLSearchParams(window.location?.search ?? '');
    }
    catch {
        return new URLSearchParams();
    }
}
function getLocationHashParams() {
    try {
        const rawHash = window.location?.hash ?? '';
        const hash = rawHash.startsWith('#') ? rawHash.slice(1) : rawHash;
        const query = hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : hash;
        return new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
    }
    catch {
        return new URLSearchParams();
    }
}
function getStandaloneSameOriginFallback() {
    if (typeof window === 'undefined')
        return undefined;
    if (isEmbeddedFrame())
        return undefined;
    const origin = window.location?.origin;
    return typeof origin === 'string' && origin.length > 0 && origin !== 'null' ? origin : undefined;
}
function getDefaultExpectedSource() {
    if (typeof window === 'undefined' || !window.parent)
        return undefined;
    return window.parent;
}
function isEmbeddedFrame() {
    if (typeof window === 'undefined' || !window.parent)
        return false;
    try {
        return window.parent !== window;
    }
    catch {
        return true;
    }
}
function normalizeTargetOrigin(value) {
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed === '*') {
        throw new Error('host RPC bridge targetOrigin must be an explicit origin');
    }
    try {
        const base = typeof window !== 'undefined' ? window.location?.href : undefined;
        const parsed = base ? new URL(trimmed, base) : new URL(trimmed);
        if (parsed.origin === 'null')
            throw new Error('opaque origin');
        return parsed.origin;
    }
    catch {
        throw new Error(`host RPC bridge targetOrigin is invalid: ${trimmed}`);
    }
}
function normalizeToken(value) {
    if (value == null)
        return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}
function createBridgeToken() {
    const cryptoApi = globalThis.crypto;
    if (cryptoApi?.randomUUID)
        return cryptoApi.randomUUID();
    if (cryptoApi?.getRandomValues) {
        const bytes = new Uint8Array(16);
        cryptoApi.getRandomValues(bytes);
        return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
    }
    return `bridge-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function readStringFromRecord(props, keys) {
    for (const key of keys) {
        const value = props[key];
        if (typeof value === 'string' && value.length > 0)
            return value;
    }
    return undefined;
}
function readStringFromSearchParams(params, keys) {
    for (const key of keys) {
        const value = params.get(key);
        if (value !== null && value.length > 0)
            return value;
    }
    return undefined;
}
export async function invokeCapability(capabilityId, input) {
    const result = await callHostRpc('kernel.v1.capability.invoke', {
        capability_id: capabilityId,
        input,
    });
    return result.output;
}
export { streamCapability } from './stream.js';
//# sourceMappingURL=index.js.map