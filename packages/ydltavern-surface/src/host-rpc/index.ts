//! Surface-side helper for calling Yggdrasil host RPC methods through the
//! iframe postMessage bridge.

interface RpcCallMessage {
  type: 'rpc.call';
  id: string;
  method: string;
  params: unknown;
  session_id?: string;
}

interface RpcResultMessage {
  type: 'rpc.result';
  id: string;
  result?: unknown;
  error?: { code: string; message: string };
}

let nextRpcId = 1;
let activeSessionId: string | undefined;
const pending = new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
let listenerWindow: Window | undefined;

function ensureRpcListener(): void {
  if (typeof window === 'undefined' || listenerWindow === window) return;
  listenerWindow = window;
  window.addEventListener('message', (e: MessageEvent) => {
    const msg = e.data as RpcResultMessage;
    if (msg?.type !== 'rpc.result') return;
    const handler = pending.get(msg.id);
    if (!handler) return;
    pending.delete(msg.id);
    if (msg.error) {
      handler.reject(new Error(`${msg.error.code}: ${msg.error.message}`));
    } else {
      handler.resolve(msg.result);
    }
  });
}

// One global listener registered at module load when possible, and lazily in
// callHostRpc for tests/modules that import before a DOM window exists.
ensureRpcListener();

export function setActiveSessionId(sessionId: string | undefined): void {
  activeSessionId = sessionId;
}

export function getActiveSessionId(): string | undefined {
  return activeSessionId;
}

export async function callHostRpc(method: string, params: unknown, timeoutMs = 30000): Promise<unknown> {
  if (typeof window === 'undefined' || !window.parent) {
    throw new Error('host RPC unavailable: not running in surface iframe');
  }
  ensureRpcListener();
  const id = `rpc-${nextRpcId++}-${Date.now()}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`host RPC timeout after ${timeoutMs}ms (method=${method})`));
    }, timeoutMs);
    pending.set(id, {
      resolve: (v) => { clearTimeout(timer); resolve(v); },
      reject: (e) => { clearTimeout(timer); reject(e); },
    });
    const message: RpcCallMessage = {
      type: 'rpc.call',
      id,
      method,
      params,
    };
    if (activeSessionId) message.session_id = activeSessionId;
    window.parent.postMessage(message, '*');
  });
}

export async function invokeCapability(capabilityId: string, input: unknown): Promise<unknown> {
  const result = await callHostRpc('kernel.v1.capability.invoke', {
    capability_id: capabilityId,
    input,
  }) as { output: unknown };
  return result.output;
}

export { streamCapability, type StreamFrame, type StreamHandle } from './stream.js';
