import type { ExtensionDiagnostic } from './registry.js';

export type ExtensionPermissionName = 'file' | 'network' | 'dom' | 'storage' | 'slash' | 'prompt' | 'ui' | (string & Record<never, never>);

export interface LoadedExtensionManifest {
  readonly id: string;
  readonly name: string;
  readonly displayName?: string;
  readonly version: string;
  readonly author?: string;
  readonly js: readonly string[];
  readonly css: readonly string[];
  readonly loadingOrder: number;
  readonly requires: readonly string[];
  readonly optional: readonly string[];
  readonly permissions: readonly ExtensionPermissionName[];
  readonly settings: Record<string, unknown>;
  readonly template?: unknown;
  readonly raw: Record<string, unknown>;
}

export interface ExtensionManifestParseResult {
  readonly manifest?: LoadedExtensionManifest;
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface ExtensionBundleAsset {
  readonly type: 'js' | 'css' | 'template' | 'unknown';
  readonly path: string;
  readonly source: 'manifest' | 'bundle';
  readonly order: number;
}

export interface DiscoveredExtensionBundle {
  readonly id: string;
  readonly manifest?: LoadedExtensionManifest;
  readonly assets: readonly ExtensionBundleAsset[];
  readonly enabled: boolean;
  readonly installed: boolean;
  readonly diagnostics: readonly ExtensionDiagnostic[];
  readonly raw: unknown;
}

export interface DiscoverExtensionBundlesResult {
  readonly bundles: readonly DiscoveredExtensionBundle[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface STExtensionCompatibilityAdapter {
  readonly available: {
    readonly getContext: boolean;
    readonly eventSource: boolean;
    readonly registerSlashCommand: boolean;
    readonly extensionSettings: boolean;
    readonly templates: boolean;
    readonly panels: boolean;
  };
  readonly apiSurface: readonly string[];
  readonly summary: string;
  readonly executesExtensionJavaScript: false;
}

export type ExtensionHookKind = 'slash' | 'prompt' | 'events' | 'uiPanels';
export type ExtensionHookCallback = (payload: unknown) => unknown;

export interface ExtensionHookRegistration {
  readonly id: string;
  readonly extensionId: string;
  readonly kind: ExtensionHookKind;
  readonly deterministic: boolean;
}

export interface RegisterExtensionHookOptions {
  readonly id: string;
  readonly extensionId: string;
  readonly callback?: ExtensionHookCallback;
  readonly deterministic?: boolean;
}

export interface EmitExtensionHookResult {
  readonly kind: ExtensionHookKind;
  readonly results: readonly unknown[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface ExtensionHookRegistry {
  register(kind: ExtensionHookKind, options: RegisterExtensionHookOptions): readonly ExtensionDiagnostic[];
  emit(kind: ExtensionHookKind, payload?: unknown): EmitExtensionHookResult;
  list(kind?: ExtensionHookKind): readonly ExtensionHookRegistration[];
}

export interface ExtensionHostPermissionPolicy {
  readonly allow?: readonly ExtensionPermissionName[];
  readonly deny?: readonly ExtensionPermissionName[];
  readonly defaultAllow?: boolean;
  readonly permissions?: Partial<Record<'file' | 'network' | 'dom' | 'storage' | 'slash' | 'prompt' | 'ui', boolean>>;
}

export interface ExtensionPermissionResult {
  readonly allowed: boolean;
  readonly granted: readonly ExtensionPermissionName[];
  readonly denied: readonly ExtensionPermissionName[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface ExtensionLoadPlan {
  readonly id: string;
  readonly installed: boolean;
  readonly enabled: boolean;
  readonly executeJavaScript: false;
  readonly actions: readonly string[];
  readonly blockedPermissions: readonly ExtensionPermissionName[];
}

export interface PlanLoadExtensionResult {
  readonly manifest?: LoadedExtensionManifest;
  readonly sortedAssets: readonly ExtensionBundleAsset[];
  readonly permissionResult: ExtensionPermissionResult;
  readonly compat: STExtensionCompatibilityAdapter;
  readonly loadPlan: ExtensionLoadPlan;
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

const knownPermissions = new Set<string>(['file', 'network', 'dom', 'storage', 'slash', 'prompt', 'ui']);
const defaultRiskyPermissions = new Set<ExtensionPermissionName>(['file', 'network', 'dom', 'storage']);

export function parseExtensionManifest(input: unknown): ExtensionManifestParseResult {
  const diagnostics: ExtensionDiagnostic[] = [];
  if (!isRecord(input)) {
    return {
      diagnostics: [diagnostic('error', 'loader.manifest.invalid', 'Extension manifest must be an object.')],
    };
  }

  const id = stringField(input, 'id') ?? stringField(input, 'name');
  const name = stringField(input, 'name') ?? stringField(input, 'display_name') ?? id;
  const displayName = stringField(input, 'display_name');
  const version = stringField(input, 'version') ?? '0.0.0';
  const loadingOrder = numberField(input, 'loading_order', 100, diagnostics, id);

  if (id === undefined || id.trim() === '') {
    diagnostics.push(diagnostic('error', 'loader.manifest.id.empty', 'Extension manifest requires a non-empty id or name.'));
  }
  if (name === undefined || name.trim() === '') {
    diagnostics.push(diagnostic('error', 'loader.manifest.name.empty', 'Extension manifest requires a non-empty name or display_name.', id));
  }
  if (stringField(input, 'version') === undefined) {
    diagnostics.push(diagnostic('warning', 'loader.manifest.version.defaulted', 'Extension manifest version missing; defaulted to 0.0.0.', id));
  }

  const js = stringArrayField(input, 'js', diagnostics, id);
  const css = stringArrayField(input, 'css', diagnostics, id);
  const requires = stringArrayField(input, 'requires', diagnostics, id);
  const optional = stringArrayField(input, 'optional', diagnostics, id);
  const permissions = stringArrayField(input, 'permissions', diagnostics, id) as ExtensionPermissionName[];
  for (const permission of permissions) {
    if (!knownPermissions.has(permission)) {
      diagnostics.push(diagnostic('warning', 'loader.permission.unknown', `Unknown extension permission requested: ${permission}.`, id));
    }
  }

  if (id === undefined || id.trim() === '' || name === undefined || name.trim() === '') {
    return { diagnostics };
  }

  const settings = isRecord(input.settings) ? { ...input.settings } : {};
  if (input.settings !== undefined && !isRecord(input.settings)) {
    diagnostics.push(diagnostic('warning', 'loader.manifest.settings.invalid', 'Extension settings must be an object; ignored.', id));
  }

  return {
    manifest: {
      id: id.trim(),
      name: name.trim(),
      displayName,
      version: version.trim(),
      author: stringField(input, 'author'),
      js,
      css,
      loadingOrder,
      requires,
      optional,
      permissions,
      settings,
      template: input.template,
      raw: { ...input },
    },
    diagnostics,
  };
}

export function discoverExtensionBundles(inputs: readonly unknown[]): DiscoverExtensionBundlesResult {
  const bundles: DiscoveredExtensionBundle[] = [];
  const diagnostics: ExtensionDiagnostic[] = [];

  inputs.forEach((input, index) => {
    const bundleRecord = isRecord(input) ? input : undefined;
    const manifestInput = bundleRecord !== undefined && 'manifest' in bundleRecord ? bundleRecord.manifest : input;
    const parsed = parseExtensionManifest(manifestInput);
    const bundleDiagnostics = [...parsed.diagnostics];
    const fallbackId = `bundle:${index}`;
    const id = parsed.manifest?.id ?? stringField(bundleRecord, 'id') ?? fallbackId;

    if (parsed.manifest === undefined) {
      bundleDiagnostics.push(diagnostic('error', 'loader.bundle.manifest.missing', `Bundle ${id} does not contain a valid manifest.`, id));
    }

    const manifestAssets = parsed.manifest === undefined ? [] : assetsFromManifest(parsed.manifest);
    const bundleAssets = extractBundleAssets(bundleRecord?.assets, id, bundleDiagnostics);
    const bundle: DiscoveredExtensionBundle = {
      id,
      manifest: parsed.manifest,
      assets: [...manifestAssets, ...bundleAssets],
      enabled: booleanField(bundleRecord, 'enabled', true),
      installed: booleanField(bundleRecord, 'installed', true),
      diagnostics: bundleDiagnostics,
      raw: input,
    };
    bundles.push(bundle);
    diagnostics.push(...bundleDiagnostics);
  });

  return { bundles, diagnostics };
}

export function sortExtensionsByLoadingOrder(manifests: readonly LoadedExtensionManifest[]): readonly LoadedExtensionManifest[] {
  return manifests
    .map((manifest, index) => ({ manifest, index }))
    .sort((left, right) => {
      const order = left.manifest.loadingOrder - right.manifest.loadingOrder;
      if (order !== 0) {
        return order;
      }
      const name = left.manifest.name.localeCompare(right.manifest.name, undefined, { sensitivity: 'base' });
      if (name !== 0) {
        return name;
      }
      const id = left.manifest.id.localeCompare(right.manifest.id, undefined, { sensitivity: 'base' });
      return id === 0 ? left.index - right.index : id;
    })
    .map((entry) => entry.manifest);
}

export function createSTExtensionCompatibilityAdapter(): STExtensionCompatibilityAdapter {
  const apiSurface = [
    'getContext',
    'eventSource',
    'registerSlashCommand',
    'extensionSettings',
    'templates',
    'panels',
  ];
  return {
    available: {
      getContext: true,
      eventSource: true,
      registerSlashCommand: true,
      extensionSettings: true,
      templates: true,
      panels: true,
    },
    apiSurface,
    summary: `ST compatibility adapter exposes ${apiSurface.join(', ')} as availability flags only; extension JavaScript is not executed.`,
    executesExtensionJavaScript: false,
  };
}

export function createExtensionHookRegistry(): ExtensionHookRegistry {
  const handlers = new Map<ExtensionHookKind, Array<RegisterExtensionHookOptions & { deterministic: true }>>();

  return {
    register(kind, options) {
      const diagnostics: ExtensionDiagnostic[] = [];
      if (!isHookKind(kind)) {
        return [diagnostic('error', 'loader.hook.kind.invalid', `Unknown hook kind: ${kind}.`, options.extensionId)];
      }
      if (options.id.trim() === '' || options.extensionId.trim() === '') {
        return [diagnostic('error', 'loader.hook.id.empty', 'Hook id and extension id must be non-empty.', options.extensionId)];
      }
      if (options.callback !== undefined && options.deterministic !== true) {
        return [diagnostic('error', 'loader.hook.callback.denied', 'Hook callbacks must be marked deterministic for test-only execution.', options.extensionId)];
      }
      const current = handlers.get(kind) ?? [];
      current.push({ ...options, deterministic: true });
      handlers.set(kind, current);
      return diagnostics;
    },
    emit(kind, payload) {
      const diagnostics: ExtensionDiagnostic[] = [];
      const results: unknown[] = [];
      if (!isHookKind(kind)) {
        return {
          kind,
          results,
          diagnostics: [diagnostic('error', 'loader.hook.kind.invalid', `Unknown hook kind: ${kind}.`)],
        };
      }
      for (const handler of handlers.get(kind) ?? []) {
        if (handler.callback === undefined) {
          continue;
        }
        try {
          results.push(handler.callback(payload));
        } catch (error) {
          diagnostics.push(diagnostic(
            'error',
            'loader.hook.callback.failed',
            `Hook ${handler.id} failed: ${error instanceof Error ? error.message : String(error)}`,
            handler.extensionId,
          ));
        }
      }
      return { kind, results, diagnostics };
    },
    list(kind) {
      const entries = kind === undefined ? [...handlers.values()].flat() : handlers.get(kind) ?? [];
      return entries.map((entry) => ({
        id: entry.id,
        extensionId: entry.extensionId,
        kind,
        deterministic: entry.deterministic,
      })).map((entry, index) => ({
        id: entry.id,
        extensionId: entry.extensionId,
        kind: entry.kind ?? kindForEntry(handlers, entry.id, entry.extensionId) ?? 'events',
        deterministic: index >= 0 && entry.deterministic,
      }));
    },
  };
}

export function evaluateExtensionPermissions(
  manifest: Pick<LoadedExtensionManifest, 'id' | 'permissions'>,
  hostPolicy: ExtensionHostPermissionPolicy = {},
): ExtensionPermissionResult {
  const granted: ExtensionPermissionName[] = [];
  const denied: ExtensionPermissionName[] = [];
  const diagnostics: ExtensionDiagnostic[] = [];
  const allow = new Set(hostPolicy.allow ?? []);
  const deny = new Set(hostPolicy.deny ?? []);

  for (const permission of manifest.permissions) {
    const explicitlyDenied = deny.has(permission) || hostPolicy.permissions?.[permission as 'file' | 'network' | 'dom' | 'storage' | 'slash' | 'prompt' | 'ui'] === false;
    const explicitlyAllowed = allow.has(permission) || hostPolicy.permissions?.[permission as 'file' | 'network' | 'dom' | 'storage' | 'slash' | 'prompt' | 'ui'] === true;
    const known = knownPermissions.has(permission);
    const defaultAllowed = hostPolicy.defaultAllow ?? !defaultRiskyPermissions.has(permission);
    const allowed = known && !explicitlyDenied && (explicitlyAllowed || defaultAllowed);
    if (allowed) {
      granted.push(permission);
    } else {
      denied.push(permission);
      diagnostics.push(diagnostic(
        'warning',
        known ? 'loader.permission.denied' : 'loader.permission.unknown.denied',
        `Permission denied for extension ${manifest.id}: ${permission}.`,
        manifest.id,
      ));
    }
  }

  return { allowed: denied.length === 0, granted, denied, diagnostics };
}

export function planLoadExtension(bundleInput: unknown, hostPolicy: ExtensionHostPermissionPolicy = {}): PlanLoadExtensionResult {
  const discovered = discoverExtensionBundles([bundleInput]).bundles[0];
  const compat = createSTExtensionCompatibilityAdapter();
  const emptyPermissionResult: ExtensionPermissionResult = { allowed: false, granted: [], denied: [], diagnostics: [] };
  if (discovered === undefined || discovered.manifest === undefined) {
    const diagnostics = discovered?.diagnostics ?? [diagnostic('error', 'loader.bundle.missing', 'No extension bundle was provided.')];
    return {
      sortedAssets: [],
      permissionResult: { ...emptyPermissionResult, diagnostics },
      compat,
      loadPlan: {
        id: discovered?.id ?? 'bundle:0',
        installed: false,
        enabled: false,
        executeJavaScript: false,
        actions: ['reject:manifest-invalid'],
        blockedPermissions: [],
      },
      diagnostics,
    };
  }

  const sortedAssets = sortAssets(discovered.assets);
  const permissionResult = evaluateExtensionPermissions(discovered.manifest, hostPolicy);
  const diagnostics = [...discovered.diagnostics, ...permissionResult.diagnostics];
  const enabled = discovered.installed && discovered.enabled && permissionResult.allowed;
  const actions = [
    'register:installed',
    enabled ? 'register:enabled' : 'register:disabled',
    ...sortedAssets.map((asset) => `prepare:${asset.type}:${asset.path}`),
    'skip:execute-js',
  ];

  return {
    manifest: discovered.manifest,
    sortedAssets,
    permissionResult,
    compat,
    loadPlan: {
      id: discovered.manifest.id,
      installed: discovered.installed,
      enabled,
      executeJavaScript: false,
      actions,
      blockedPermissions: permissionResult.denied,
    },
    diagnostics,
  };
}

function diagnostic(
  level: ExtensionDiagnostic['level'],
  code: string,
  message: string,
  extensionId?: string,
): ExtensionDiagnostic {
  return { level, code, message, extensionId };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringField(record: Record<string, unknown> | undefined, key: string): string | undefined {
  if (record === undefined) {
    return undefined;
  }
  const value = record[key];
  return typeof value === 'string' && value.trim() !== '' ? value : undefined;
}

function booleanField(record: Record<string, unknown> | undefined, key: string, fallback: boolean): boolean {
  if (record === undefined) {
    return fallback;
  }
  return typeof record[key] === 'boolean' ? record[key] : fallback;
}

function numberField(
  record: Record<string, unknown>,
  key: string,
  fallback: number,
  diagnostics: ExtensionDiagnostic[],
  extensionId?: string,
): number {
  const value = record[key];
  if (value === undefined) {
    return fallback;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
    return Number(value);
  }
  diagnostics.push(diagnostic('warning', 'loader.manifest.loading_order.invalid', 'Extension loading_order must be numeric; defaulted.', extensionId));
  return fallback;
}

function stringArrayField(
  record: Record<string, unknown>,
  key: string,
  diagnostics: ExtensionDiagnostic[],
  extensionId?: string,
): string[] {
  const value = record[key];
  if (value === undefined) {
    return [];
  }
  if (typeof value === 'string') {
    return value.trim() === '' ? [] : [value];
  }
  if (Array.isArray(value)) {
    const strings = value.filter((item): item is string => typeof item === 'string' && item.trim() !== '').map((item) => item.trim());
    if (strings.length !== value.length) {
      diagnostics.push(diagnostic('warning', `loader.manifest.${key}.invalid`, `Extension manifest ${key} contains non-string entries; ignored.`, extensionId));
    }
    return strings;
  }
  diagnostics.push(diagnostic('warning', `loader.manifest.${key}.invalid`, `Extension manifest ${key} must be a string or string array; ignored.`, extensionId));
  return [];
}

function assetsFromManifest(manifest: LoadedExtensionManifest): ExtensionBundleAsset[] {
  return [
    ...manifest.css.map((path, index) => ({ type: 'css' as const, path, source: 'manifest' as const, order: index })),
    ...manifest.js.map((path, index) => ({ type: 'js' as const, path, source: 'manifest' as const, order: index })),
    ...(manifest.template === undefined ? [] : [{ type: 'template' as const, path: 'template', source: 'manifest' as const, order: 0 }]),
  ];
}

function extractBundleAssets(value: unknown, extensionId: string, diagnostics: ExtensionDiagnostic[]): ExtensionBundleAsset[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value)) {
    diagnostics.push(diagnostic('warning', 'loader.bundle.assets.invalid', 'Bundle assets must be an array; ignored.', extensionId));
    return [];
  }
  return value.flatMap((asset, index) => {
    if (typeof asset === 'string') {
      return [{ type: inferAssetType(asset), path: asset, source: 'bundle' as const, order: index }];
    }
    if (isRecord(asset)) {
      const path = stringField(asset, 'path') ?? stringField(asset, 'url') ?? stringField(asset, 'name');
      if (path === undefined) {
        diagnostics.push(diagnostic('warning', 'loader.bundle.asset.path.missing', 'Bundle asset requires path, url, or name; ignored.', extensionId));
        return [];
      }
      return [{
        type: normalizeAssetType(stringField(asset, 'type')) ?? inferAssetType(path),
        path,
        source: 'bundle' as const,
        order: typeof asset.order === 'number' && Number.isFinite(asset.order) ? asset.order : index,
      }];
    }
    diagnostics.push(diagnostic('warning', 'loader.bundle.asset.invalid', 'Bundle asset must be a string or object; ignored.', extensionId));
    return [];
  });
}

function sortAssets(assets: readonly ExtensionBundleAsset[]): readonly ExtensionBundleAsset[] {
  return assets
    .map((asset, index) => ({ asset, index }))
    .sort((left, right) => {
      const typeOrder = assetTypeOrder(left.asset.type) - assetTypeOrder(right.asset.type);
      if (typeOrder !== 0) {
        return typeOrder;
      }
      const order = left.asset.order - right.asset.order;
      if (order !== 0) {
        return order;
      }
      const path = left.asset.path.localeCompare(right.asset.path, undefined, { sensitivity: 'base' });
      return path === 0 ? left.index - right.index : path;
    })
    .map((entry) => entry.asset);
}

function inferAssetType(path: string): ExtensionBundleAsset['type'] {
  if (path.endsWith('.js') || path.endsWith('.mjs')) {
    return 'js';
  }
  if (path.endsWith('.css')) {
    return 'css';
  }
  if (path.endsWith('.html') || path.endsWith('.hbs') || path.endsWith('.tmpl')) {
    return 'template';
  }
  return 'unknown';
}

function normalizeAssetType(type: string | undefined): ExtensionBundleAsset['type'] | undefined {
  return type === 'js' || type === 'css' || type === 'template' || type === 'unknown' ? type : undefined;
}

function assetTypeOrder(type: ExtensionBundleAsset['type']): number {
  if (type === 'css') {
    return 0;
  }
  if (type === 'js') {
    return 1;
  }
  if (type === 'template') {
    return 2;
  }
  return 3;
}

function isHookKind(kind: string): kind is ExtensionHookKind {
  return kind === 'slash' || kind === 'prompt' || kind === 'events' || kind === 'uiPanels';
}

function kindForEntry(
  handlers: ReadonlyMap<ExtensionHookKind, readonly RegisterExtensionHookOptions[]>,
  id: string,
  extensionId: string,
): ExtensionHookKind | undefined {
  for (const [kind, entries] of handlers) {
    if (entries.some((entry) => entry.id === id && entry.extensionId === extensionId)) {
      return kind;
    }
  }
  return undefined;
}
