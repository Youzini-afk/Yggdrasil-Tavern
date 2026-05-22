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
  if (permissions.realExtensionLoad) sandbox.enableRealExtensionLoad(permissions);

  const plan = buildLoadPlan({
    id: input.record.id,
    manifest: input.record.manifest,
    basePath: input.basePath,
    ...(input.currentLocale ? { currentLocale: input.currentLocale } : {}),
  });
  const activationDeadline = Date.now() + (input.sandboxConfig?.activationTimeoutMs ?? 5000);
  const moduleSources = new Map<string, string>();
  const loadedModules = new Set<string>();
  if (permissions.realExtensionLoad) {
    moduleSources.set(ST_HOST_VIRTUAL_MODULE, stHostVirtualModuleSource());
    sandbox.setModuleLoader(
      (moduleName) => {
        const source = moduleSources.get(moduleName);
        if (source === undefined) throw new Error(`Sandbox module not preloaded: ${moduleName}`);
        return source;
      },
      (baseModuleName, requestedName) => normalizeModuleSpecifier(baseModuleName, requestedName),
    );
  }

  for (const step of plan.steps) {
    const remainingMs = Math.max(1, activationDeadline - Date.now());
    switch (step.kind) {
      case 'add_script': {
        const relPath = relativeScriptPath(input.basePath, String(step.data?.src ?? ''));
        const source = await input.readSource(relPath);
        if (permissions.realExtensionLoad) {
          moduleSources.set(normalizePath(relPath), source);
          await preloadModuleGraph({ relPath: normalizePath(relPath), source, readSource: input.readSource, moduleSources, loadedModules, sandbox, timeoutMs: remainingMs });
        } else {
          await sandbox.eval(source, relPath, remainingMs);
        }
        break;
      }
      case 'call_hook': {
        const hookExport = String(step.data?.export ?? '');
        if (permissions.realExtensionLoad) {
          const entryPath = String(plan.steps.find((s) => s.kind === 'add_script')?.data?.src ?? 'index.js');
          const entryRelPath = normalizePath(relativeScriptPath(input.basePath, entryPath));
          await sandbox.evalModule(callModuleHookSource(hookExport, input.hostBridge.getContextSnapshot(), entryRelPath), `<hook:${hookExport}>`, remainingMs);
        } else {
          await sandbox.eval(callHookSource(hookExport, input.hostBridge.getContextSnapshot()), `<hook:${hookExport}>`, remainingMs);
        }
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

const ST_HOST_IMPORT_RE = /(^|\/)\.\.\/\.\.\/\.\.\/(?:\.\.\/)?(?:script|extensions|openai)\.js$/;
const ST_HOST_VIRTUAL_MODULE = 'ygg-virtual:st-host';

interface PreloadModuleGraphInput {
  readonly relPath: string;
  readonly source: string;
  readonly readSource: (relPath: string) => Promise<string>;
  readonly moduleSources: Map<string, string>;
  readonly loadedModules: Set<string>;
  readonly sandbox: ExtensionSandbox;
  readonly timeoutMs: number;
}

async function preloadModuleGraph(input: PreloadModuleGraphInput): Promise<void> {
  const relPath = normalizePath(input.relPath);
  if (input.loadedModules.has(relPath)) return;
  input.moduleSources.set(relPath, input.source);

  for (const specifier of parseImportSpecifiers(input.source)) {
    const normalized = normalizeModuleSpecifier(relPath, specifier);
    if (normalized === ST_HOST_VIRTUAL_MODULE) continue;
    if (!isRelativeImport(specifier)) throw new Error('bare npm imports not supported in sandbox v1; vendor the dependency');
    const depSource = input.moduleSources.get(normalized) ?? await input.readSource(normalized);
    input.moduleSources.set(normalized, depSource);
    await preloadModuleGraph({ ...input, relPath: normalized, source: depSource });
  }

  await input.sandbox.evalModule(input.source, relPath, input.timeoutMs);
  input.loadedModules.add(relPath);
}

function parseImportSpecifiers(source: string): string[] {
  const specifiers: string[] = [];
  const importRe = /(^|[;\n\r])\s*import\s+(?!type\b)(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = importRe.exec(source)) !== null) {
    if (match[2]) specifiers.push(match[2]);
  }
  return specifiers;
}

function normalizeModuleSpecifier(baseModuleName: string, requestedName: string): string {
  if (ST_HOST_IMPORT_RE.test(requestedName)) return ST_HOST_VIRTUAL_MODULE;
  if (requestedName === ST_HOST_VIRTUAL_MODULE) return ST_HOST_VIRTUAL_MODULE;
  if (!isRelativeImport(requestedName)) throw new Error('bare npm imports not supported in sandbox v1; vendor the dependency');
  return normalizePath(`${dirname(baseModuleName)}/${requestedName}`);
}

function isRelativeImport(specifier: string): boolean {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

function dirname(path: string): string {
  const normalized = normalizePath(path);
  const index = normalized.lastIndexOf('/');
  return index === -1 ? '.' : normalized.slice(0, index);
}

function normalizePath(path: string): string {
  const out: string[] = [];
  for (const part of path.replace(/\\/g, '/').split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') out.pop();
    else out.push(part);
  }
  return out.join('/');
}

function stHostVirtualModuleSource(): string {
  return `
export const event_types = globalThis.event_types;
export const extension_prompt_types = globalThis.extension_prompt_types;
export const extension_prompt_roles = globalThis.extension_prompt_roles;
export const eventSource = globalThis.eventSource;
export const extension_settings = globalThis.extension_settings;
export const getContext = globalThis.getContext;
export const setExtensionPrompt = globalThis.setExtensionPrompt;
export const getExtensionPrompt = globalThis.getExtensionPrompt;
export const getRequestHeaders = globalThis.getRequestHeaders;
export const saveSettingsDebounced = globalThis.saveSettingsDebounced;
export const saveMetadata = globalThis.saveMetadata;
export const saveMetadataDebounced = globalThis.saveMetadataDebounced;
export const reloadCurrentChat = globalThis.reloadCurrentChat;
export const updateChatMetadata = globalThis.updateChatMetadata;
export const substituteParams = globalThis.substituteParams;
export const getTokenCountAsync = globalThis.getTokenCountAsync;
export const registerSlashCommand = globalThis.registerSlashCommand;
export const eventOn = globalThis.eventOn;
export const eventEmit = globalThis.eventEmit;
`;
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

function callModuleHookSource(hookExport: string, contextSnapshot: unknown, entryRelPath: string): string {
  const encodedHook = JSON.stringify(hookExport);
  const encodedContext = JSON.stringify(contextSnapshot);
  const encodedEntry = JSON.stringify(`./${entryRelPath}`);
  return `
import * as entry from ${encodedEntry};
const hook = ${encodedHook};
const snapshot = ${encodedContext};
const fn = entry[hook] || globalThis[hook] || (globalThis.__exports__ && globalThis.__exports__[hook]);
if (typeof fn !== 'function') throw new Error('Missing extension hook export: ' + hook);
fn(snapshot);`;
}
