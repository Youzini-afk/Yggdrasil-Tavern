import {
  getQuickJS,
  type QuickJSContext,
  type QuickJSHandle,
  type QuickJSWASMModule,
} from 'quickjs-emscripten';

export interface SandboxConfig {
  /** Memory limit in bytes (default 32MB). */
  readonly memoryLimitBytes?: number;
  /** Stack size limit (default 1MB). */
  readonly stackSizeBytes?: number;
  /** Per-call timeout in ms (default 1000ms). */
  readonly callTimeoutMs?: number;
  /** Total execution budget for activation in ms (default 5000ms). */
  readonly activationTimeoutMs?: number;
}

export interface AuditEntry {
  ts: number;
  api: string;
  args_shape: unknown;
}

export class ExtensionSandbox {
  private quickjs?: QuickJSWASMModule;
  private context?: QuickJSContext;
  private bridges = new Map<string, (...args: unknown[]) => unknown>();
  private auditLog: AuditEntry[] = [];
  private callbackIds = new Set<string>();
  private destroyed = false;

  constructor(
    public readonly extensionId: string,
    private readonly config: SandboxConfig = {},
  ) {}

  async init(): Promise<void> {
    if (this.context !== undefined) return;
    // v0 uses quickjs-emscripten's standard shared release-sync variant via
    // getQuickJS(). It is fast and small enough for extension activation; future
    // hardening can switch to per-extension WASM modules for stronger process-like
    // isolation at higher memory/startup cost.
    this.quickjs = await getQuickJS();
    this.context = this.quickjs.newContext();

    this.context.runtime.setMemoryLimit(this.config.memoryLimitBytes ?? 32 * 1024 * 1024);
    this.context.runtime.setMaxStackSize(this.config.stackSizeBytes ?? 1024 * 1024);
    this.installSafeGlobals();

    for (const [name, fn] of this.bridges) {
      this.installHostFunction(name, fn);
    }
  }

  get vm(): QuickJSContext {
    if (this.destroyed) throw new Error('Sandbox destroyed');
    if (!this.context) throw new Error('Sandbox not initialized');
    return this.context;
  }

  async eval(code: string, source = '<extension>', timeoutMs = this.config.callTimeoutMs ?? 1000): Promise<unknown> {
    if (this.destroyed) throw new Error('Sandbox destroyed');
    if (!this.context) throw new Error('Sandbox not initialized');

    const deadline = Date.now() + timeoutMs;
    this.context.runtime.setInterruptHandler(() => Date.now() > deadline);
    try {
      const result = this.context.evalCode(code, source, { type: 'global' });
      if (result.error) {
        const err = this.context.dump(result.error);
        result.error.dispose();
        throw new Error(`Extension eval error: ${formatGuestError(err)}`);
      }
      const value = this.context.dump(result.value);
      result.value.dispose();
      return value;
    } finally {
      this.context.runtime.removeInterruptHandler();
    }
  }

  async callCallback(callbackId: string, payload?: unknown): Promise<unknown> {
    const encodedId = JSON.stringify(callbackId);
    const encodedPayload = JSON.stringify(payload ?? null);
    return this.eval(
      `globalThis.__ydlTavern__.invokeCallback(${encodedId}, ${encodedPayload})`,
      `<callback:${callbackId}>`,
    );
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.bridges.clear();
    this.callbackIds.clear();
    this.context?.dispose();
  }

  registerHostFunction(name: string, fn: (...args: unknown[]) => unknown): void {
    this.bridges.set(name, fn);
    if (this.context !== undefined) {
      this.installHostFunction(name, fn);
    }
  }

  recordAudit(entry: AuditEntry): void {
    this.auditLog.push(entry);
  }

  getAuditLog(): readonly AuditEntry[] {
    return [...this.auditLog];
  }

  registerCallback(callbackId: string): void {
    if (callbackId.trim().length > 0) this.callbackIds.add(callbackId);
  }

  getRegisteredCallbacks(): ReadonlySet<string> {
    return new Set(this.callbackIds);
  }

  private installHostFunction(name: string, fn: (...args: unknown[]) => unknown): void {
    const context = this.vm;
    const handle = context.newFunction(name, (...args: QuickJSHandle[]) => {
      const nativeArgs = args.map((arg) => context.dump(arg));
      const result = fn(...nativeArgs);
      return valueToHandle(context, result);
    });
    context.setProp(context.global, name, handle);
    handle.dispose();
  }

  private installSafeGlobals(): void {
    // QuickJS does not provide browser, Node, or CommonJS globals by default.
    // Define them as non-writable undefined anyway so extensions cannot mistake
    // a host-provided escape hatch for an allowed API surface.
    const blockedGlobals = ['fetch', 'XMLHttpRequest', 'require', 'process', 'WebSocket', 'Worker'];
    const code = blockedGlobals
      .map((name) => `Object.defineProperty(globalThis, ${JSON.stringify(name)}, { value: undefined, writable: false, configurable: false });`)
      .join('\n');
    const result = this.vm.evalCode(code, '<safe-globals>', { type: 'global' });
    result.dispose();
  }
}

function valueToHandle(context: QuickJSContext, value: unknown): QuickJSHandle {
  if (value === undefined) return context.undefined;
  if (value === null) return context.null;
  if (typeof value === 'boolean') return value ? context.true : context.false;
  if (typeof value === 'number') return context.newNumber(Number.isFinite(value) ? value : 0);
  if (typeof value === 'string') return context.newString(value);
  return context.newString(JSON.stringify(value));
}

function formatGuestError(error: unknown): string {
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
