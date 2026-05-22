import { buildLoadPlan, type STActivationContext, type STExtensionRecord } from '../loader-st.js';
import { bindHostBridge, type STHostBridge } from './bridge.js';
import { DEFAULT_PERMISSIONS, mergeSandboxPermissions, type SandboxPermissions } from './permissions.js';
import { ExtensionSandbox, type SandboxConfig } from './runtime.js';

export interface LoadExtensionInput {
  readonly record: STExtensionRecord;
  readonly activationContext: STActivationContext;
  readonly basePath: string;
  /** Source resolver: given a JS path relative to extension folder, return source code. */
  readonly readSource: (relPath: string) => Promise<string>;
  readonly hostBridge: STHostBridge;
  readonly permissions?: Partial<SandboxPermissions>;
  readonly currentLocale?: string;
  readonly sandboxConfig?: SandboxConfig;
}

export interface LoadedExtension {
  readonly id: string;
  readonly sandbox: ExtensionSandbox;
  readonly registeredCallbacks: ReadonlySet<string>;
  destroy(): void;
}

export async function loadExtensionInSandbox(input: LoadExtensionInput): Promise<LoadedExtension> {
  const permissions = mergeSandboxPermissions(deriveManifestPermissions(input.record.manifest.requires, input.permissions));
  const sandbox = new ExtensionSandbox(input.record.id, input.sandboxConfig);
  await sandbox.init();
  bindHostBridge(sandbox, permissions, input.hostBridge);

  const plan = buildLoadPlan({
    id: input.record.id,
    manifest: input.record.manifest,
    basePath: input.basePath,
    ...(input.currentLocale ? { currentLocale: input.currentLocale } : {}),
  });
  const activationDeadline = Date.now() + (input.sandboxConfig?.activationTimeoutMs ?? 5000);

  for (const step of plan.steps) {
    const remainingMs = Math.max(1, activationDeadline - Date.now());
    switch (step.kind) {
      case 'add_script': {
        const relPath = relativeScriptPath(input.basePath, String(step.data?.src ?? ''));
        const source = await input.readSource(relPath);
        await sandbox.eval(source, relPath, remainingMs);
        break;
      }
      case 'call_hook': {
        const hookExport = String(step.data?.export ?? '');
        await sandbox.eval(callHookSource(hookExport, input.hostBridge.getContextSnapshot()), `<hook:${hookExport}>`, remainingMs);
        break;
      }
      case 'register_interceptor':
        if (typeof step.data?.name === 'string') sandbox.registerCallback(step.data.name);
        break;
      case 'add_locale':
      case 'add_style':
      case 'mark_active':
        // v0 has no DOM or stylesheet/i18n injection inside the sandbox.
        break;
    }
  }

  return {
    id: input.record.id,
    sandbox,
    get registeredCallbacks() {
      return sandbox.getRegisteredCallbacks();
    },
    destroy() {
      sandbox.destroy();
    },
  };
}

function deriveManifestPermissions(
  requires: readonly string[] | undefined,
  requested: Partial<SandboxPermissions> | undefined,
): Partial<SandboxPermissions> {
  const reqs = new Set((requires ?? []).map((req) => req.toLowerCase()));
  return {
    ...DEFAULT_PERMISSIONS,
    ...requested,
    // Permission gate exists now, but v0 intentionally never exposes network or
    // kernel.outbound.*. Revisit once a threat model and outbound broker land.
    network: false && (requested?.network === true || reqs.has('network') || reqs.has('internet')),
  };
}

function relativeScriptPath(basePath: string, src: string): string {
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  return src.startsWith(normalizedBase) ? src.slice(normalizedBase.length) : src.replace(/^\/+/, '');
}

function callHookSource(hookExport: string, contextSnapshot: unknown): string {
  const encodedHook = JSON.stringify(hookExport);
  const encodedContext = JSON.stringify(contextSnapshot);
  return `
(function () {
  const hook = ${encodedHook};
  const snapshot = ${encodedContext};
  let fn = globalThis[hook];
  if (typeof fn !== 'function' && globalThis.__exports__ && typeof globalThis.__exports__[hook] === 'function') {
    fn = globalThis.__exports__[hook];
  }
  if (typeof fn !== 'function') throw new Error('Missing extension hook export: ' + hook);
  return fn(snapshot);
})();`;
}
