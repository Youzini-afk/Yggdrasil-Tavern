// Deep port of SillyTavern extension loader.
//
// References (read at port time):
//   public/scripts/extensions.js — discovery, manifests, activation, hooks
//   public/scripts/extensions.js:298-312 settings load + EXTENSIONS_FIRST_LOAD
//   public/scripts/extensions.js:537-666 manifest schema + activation
//   public/scripts/extensions.js:781-877 enable/disable + hook dispatch
//   public/scripts/extensions.js:1783-1808 generate_interceptor wiring
//   public/scripts/extensions.js:388-465 hook dispatch error aggregation
//
// This module ports the algorithm faithfully but DOES NOT execute extension
// JavaScript, fetch real files, or perform real network requests. It produces
// load plans that a host (Yggdrasil) can choose to execute under sandbox.

// ---------------------------------------------------------------------------
// Manifest schema (extensions.js manifest examples)

export interface STExtensionManifest {
  display_name: string;
  loading_order?: number;
  requires?: readonly string[]; // Extras module names
  optional?: readonly string[];
  dependencies?: readonly string[]; // Other extension IDs
  minimum_client_version?: string; // semver-like
  js?: string;
  css?: string;
  author?: string;
  version?: string;
  homePage?: string;
  homepage?: string;
  hooks?: Readonly<Partial<Record<STExtensionHookName, string>>>;
  i18n?: Readonly<Record<string, string>>; // locale → JSON file path
  auto_update?: boolean;
  generate_interceptor?: string; // global function name
  // Allow forward-compatible unknown fields
  [key: string]: unknown;
}

export type STExtensionHookName =
  | 'install'
  | 'update'
  | 'delete'
  | 'clean'
  | 'enable'
  | 'disable'
  | 'activate';

export const ST_EXTENSION_HOOK_NAMES: readonly STExtensionHookName[] = [
  'install', 'update', 'delete', 'clean', 'enable', 'disable', 'activate',
];

// Discovery record (per /api/extensions/discover backend response)
export interface STExtensionDiscoveryRecord {
  name: string; // extension folder name
  type: 'system' | 'local' | 'global';
}

// ---------------------------------------------------------------------------
// Manifest parsing / validation

export interface STManifestParseResult {
  manifest?: STExtensionManifest;
  errors: readonly string[];
  warnings: readonly string[];
}

const REQUIRED_FIELDS: readonly (keyof STExtensionManifest)[] = ['display_name'];
const KNOWN_FIELDS = new Set([
  'display_name', 'loading_order', 'requires', 'optional', 'dependencies',
  'minimum_client_version', 'js', 'css', 'author', 'version', 'homePage',
  'homepage', 'hooks', 'i18n', 'auto_update', 'generate_interceptor',
]);

export function parseSTManifest(raw: unknown): STManifestParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    return { errors: ['manifest must be a JSON object'], warnings };
  }

  const obj = raw as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (!(field in obj)) errors.push(`missing required field: ${field}`);
  }
  if (typeof obj.display_name !== 'string' || (obj.display_name as string).trim() === '') {
    errors.push('display_name must be a non-empty string');
  }
  if (obj.loading_order !== undefined && typeof obj.loading_order !== 'number') {
    errors.push('loading_order must be a number');
  }
  for (const arrField of ['requires', 'optional', 'dependencies']) {
    const v = obj[arrField];
    if (v !== undefined && (!Array.isArray(v) || !v.every((x) => typeof x === 'string'))) {
      errors.push(`${arrField} must be an array of strings`);
    }
  }
  if (obj.hooks !== undefined && (typeof obj.hooks !== 'object' || obj.hooks === null)) {
    errors.push('hooks must be an object');
  }
  if (obj.i18n !== undefined && (typeof obj.i18n !== 'object' || obj.i18n === null)) {
    errors.push('i18n must be an object');
  }
  for (const k of Object.keys(obj)) {
    if (!KNOWN_FIELDS.has(k)) warnings.push(`unknown manifest field: ${k}`);
  }

  if (errors.length > 0) return { errors, warnings };
  return { manifest: obj as STExtensionManifest, errors, warnings };
}

// ---------------------------------------------------------------------------
// Activation eligibility

export interface STActivationContext {
  installedExtras: ReadonlySet<string>;
  installedExtensions: ReadonlySet<string>; // ext IDs already activated
  disabledExtensions: ReadonlySet<string>;
  clientVersion: string;
}

export interface STActivationDecision {
  eligible: boolean;
  reasons: readonly string[];
}

export function isActivationEligible(
  id: string,
  manifest: STExtensionManifest,
  ctx: STActivationContext,
): STActivationDecision {
  const reasons: string[] = [];

  if (ctx.disabledExtensions.has(id)) {
    return { eligible: false, reasons: ['user-disabled'] };
  }

  for (const req of manifest.requires ?? []) {
    if (!ctx.installedExtras.has(req)) reasons.push(`missing extras module: ${req}`);
  }
  for (const dep of manifest.dependencies ?? []) {
    if (!ctx.installedExtensions.has(dep)) reasons.push(`missing dependency: ${dep}`);
    if (ctx.disabledExtensions.has(dep)) reasons.push(`dependency disabled: ${dep}`);
  }
  if (manifest.minimum_client_version && !meetsVersion(ctx.clientVersion, manifest.minimum_client_version)) {
    reasons.push(`client version ${ctx.clientVersion} < required ${manifest.minimum_client_version}`);
  }

  return { eligible: reasons.length === 0, reasons };
}

function meetsVersion(actual: string, required: string): boolean {
  const a = parseSemver(actual);
  const r = parseSemver(required);
  for (let i = 0; i < 3; i++) {
    if (a[i]! > r[i]!) return true;
    if (a[i]! < r[i]!) return false;
  }
  return true;
}

function parseSemver(s: string): [number, number, number] {
  const parts = s.replace(/^v/, '').split(/[.-]/).slice(0, 3).map((p) => Number.parseInt(p, 10));
  return [parts[0] || 0, parts[1] || 0, parts[2] || 0];
}

// ---------------------------------------------------------------------------
// Activation order — loading_order ASC then display_name ASC

export interface STExtensionRecord {
  id: string;
  manifest: STExtensionManifest;
}

export function sortByActivationOrder(
  extensions: readonly STExtensionRecord[],
): readonly STExtensionRecord[] {
  return [...extensions].sort((a, b) => {
    const ao = a.manifest.loading_order ?? 1000;
    const bo = b.manifest.loading_order ?? 1000;
    if (ao !== bo) return ao - bo;
    return a.manifest.display_name.localeCompare(b.manifest.display_name);
  });
}

// ---------------------------------------------------------------------------
// Plan-only load step (real exec deferred to host sandbox)

export interface STLoadPlanStep {
  kind: 'add_locale' | 'add_script' | 'add_style' | 'call_hook' | 'register_interceptor' | 'mark_active';
  description: string;
  // For inspection / sandboxed exec:
  data?: Record<string, unknown>;
}

export interface STLoadPlan {
  id: string;
  manifest: STExtensionManifest;
  steps: readonly STLoadPlanStep[];
}

export interface BuildLoadPlanInput {
  id: string;
  manifest: STExtensionManifest;
  basePath: string; // e.g. /scripts/extensions/<id>
  currentLocale?: string;
}

export function buildLoadPlan(input: BuildLoadPlanInput): STLoadPlan {
  const { id, manifest, basePath, currentLocale } = input;
  const steps: STLoadPlanStep[] = [];

  // 1. Locale (i18n) load
  if (manifest.i18n && currentLocale && manifest.i18n[currentLocale]) {
    steps.push({
      kind: 'add_locale',
      description: `load locale ${currentLocale} from ${manifest.i18n[currentLocale]}`,
      data: { locale: currentLocale, file: `${basePath}/${manifest.i18n[currentLocale]}` },
    });
  }

  // 2. Script injection (ES module)
  if (manifest.js) {
    steps.push({
      kind: 'add_script',
      description: `inject <script type="module" src="${basePath}/${manifest.js}">`,
      data: { src: `${basePath}/${manifest.js}`, type: 'module' },
    });
  }

  // 3. Style injection
  if (manifest.css) {
    steps.push({
      kind: 'add_style',
      description: `inject <link rel="stylesheet" href="${basePath}/${manifest.css}">`,
      data: { href: `${basePath}/${manifest.css}` },
    });
  }

  // 4. generate_interceptor registration
  if (manifest.generate_interceptor) {
    steps.push({
      kind: 'register_interceptor',
      description: `expose globalThis.${manifest.generate_interceptor} as generation interceptor`,
      data: { name: manifest.generate_interceptor },
    });
  }

  // 5. Activate hook
  const activateExport = manifest.hooks?.activate;
  if (activateExport) {
    steps.push({
      kind: 'call_hook',
      description: `call exported '${activateExport}' as activate hook`,
      data: { hook: 'activate', export: activateExport },
    });
  }

  // 6. Mark active
  steps.push({
    kind: 'mark_active',
    description: `mark extension '${id}' as active`,
    data: { id },
  });

  return { id, manifest, steps };
}

// ---------------------------------------------------------------------------
// Hook dispatch (error-aggregating, never blocks others)

export interface STHookDispatchResult {
  ok: number;
  failed: readonly { id: string; hook: STExtensionHookName; error: string }[];
}

export interface STExtensionHookSnapshot {
  id: string;
  hookExport: string;
  // Real execution would call globalThis[hookExport]; we just record the plan.
}

export function planHookDispatch(
  hook: STExtensionHookName,
  records: readonly STExtensionRecord[],
): readonly STExtensionHookSnapshot[] {
  const out: STExtensionHookSnapshot[] = [];
  for (const r of records) {
    const exp = r.manifest.hooks?.[hook];
    if (typeof exp === 'string' && exp.length > 0) {
      out.push({ id: r.id, hookExport: exp });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Disable / enable persistence (extension_settings.disabledExtensions)

export class STDisabledExtensionsStore {
  private disabled: Set<string>;

  constructor(initial: readonly string[] = []) {
    this.disabled = new Set(initial);
  }

  isDisabled(id: string): boolean { return this.disabled.has(id); }
  list(): readonly string[] { return [...this.disabled]; }
  disable(id: string): void { this.disabled.add(id); }
  enable(id: string): void { this.disabled.delete(id); }
  serialize(): string[] { return [...this.disabled]; }
}

// ---------------------------------------------------------------------------
// Full activation pipeline (plan-only)

export interface STActivationPlan {
  activated: readonly STLoadPlan[];
  skipped: readonly { id: string; reasons: readonly string[] }[];
  hookFailures: readonly { id: string; reason: string }[];
}

export interface ActivateAllInput {
  records: readonly STExtensionRecord[];
  ctx: STActivationContext;
  basePath: (id: string) => string;
  currentLocale?: string;
}

export function planActivateAll(input: ActivateAllInput): STActivationPlan {
  const sorted = sortByActivationOrder(input.records);
  const activated: STLoadPlan[] = [];
  const skipped: { id: string; reasons: readonly string[] }[] = [];

  // Track installed extensions as activation progresses (for dependency check)
  const installed = new Set(input.ctx.installedExtensions);
  for (const r of sorted) {
    const decision = isActivationEligible(
      r.id,
      r.manifest,
      { ...input.ctx, installedExtensions: installed },
    );
    if (!decision.eligible) {
      skipped.push({ id: r.id, reasons: decision.reasons });
      continue;
    }
    const plan = buildLoadPlan({
      id: r.id,
      manifest: r.manifest,
      basePath: input.basePath(r.id),
      ...(input.currentLocale ? { currentLocale: input.currentLocale } : {}),
    });
    activated.push(plan);
    installed.add(r.id);
  }

  return { activated, skipped, hookFailures: [] };
}
