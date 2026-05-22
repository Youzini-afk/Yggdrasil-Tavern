export type ExtensionHookName =
  | 'beforePrompt'
  | 'afterPrompt'
  | 'response'
  | 'userInput'
  | (string & Record<never, never>);

export interface ExtensionDiagnostic {
  readonly level: 'info' | 'warning' | 'error';
  readonly code: string;
  readonly message: string;
  readonly extensionId?: string;
  readonly hook?: ExtensionHookName;
}

export interface ExtensionManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly builtIn?: boolean;
  readonly hooks?: readonly ExtensionHookName[];
  readonly defaultEnabled?: boolean;
  readonly defaultSettings?: Record<string, unknown>;
}

export interface RegisteredExtension {
  readonly manifest: ExtensionManifest;
  readonly installed: boolean;
  readonly enabled: boolean;
  readonly settings: Record<string, unknown>;
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface ExtensionRegistrySnapshot {
  readonly extensions: readonly RegisteredExtension[];
  readonly diagnostics: readonly ExtensionDiagnostic[];
}

export interface RegisterExtensionOptions {
  readonly enabled?: boolean;
  readonly settings?: Record<string, unknown>;
  readonly diagnostics?: readonly ExtensionDiagnostic[];
}

export interface ExtensionRegistry {
  install(manifest: ExtensionManifest, options?: RegisterExtensionOptions): RegisteredExtension;
  uninstall(id: string): boolean;
  setEnabled(id: string, enabled: boolean): RegisteredExtension;
  updateSettings(id: string, settings: Record<string, unknown>): RegisteredExtension;
  get(id: string): RegisteredExtension | undefined;
  list(): readonly RegisteredExtension[];
  diagnostics(hook?: ExtensionHookName): readonly ExtensionDiagnostic[];
  snapshot(): ExtensionRegistrySnapshot;
}

interface MutableRegisteredExtension {
  manifest: ExtensionManifest;
  installed: boolean;
  enabled: boolean;
  settings: Record<string, unknown>;
  diagnostics: ExtensionDiagnostic[];
}

export function createExtensionRegistry(manifests: readonly ExtensionManifest[] = []): ExtensionRegistry {
  const entries = new Map<string, MutableRegisteredExtension>();
  const registryDiagnostics: ExtensionDiagnostic[] = [];

  function freezeEntry(entry: MutableRegisteredExtension): RegisteredExtension {
    return {
      manifest: entry.manifest,
      installed: entry.installed,
      enabled: entry.enabled,
      settings: { ...entry.settings },
      diagnostics: [...entry.diagnostics],
    };
  }

  const registry: ExtensionRegistry = {
    install(manifest: ExtensionManifest, options: RegisterExtensionOptions = {}): RegisteredExtension {
      const manifestDiagnostics = validateManifest(manifest);
      if (entries.has(manifest.id)) {
        const duplicateDiagnostic = diagnostic('warning', 'extension.duplicate', `Extension ${manifest.id} is already installed.`, manifest.id);
        registryDiagnostics.push(duplicateDiagnostic);
        const current = entries.get(manifest.id);
        if (current === undefined) {
          throw new Error(`Extension ${manifest.id} disappeared during duplicate install.`);
        }
        current.diagnostics.push(duplicateDiagnostic);
        return freezeEntry(current);
      }

      const entry: MutableRegisteredExtension = {
        manifest,
        installed: true,
        enabled: options.enabled ?? manifest.defaultEnabled ?? true,
        settings: { ...(manifest.defaultSettings ?? {}), ...(options.settings ?? {}) },
        diagnostics: [...manifestDiagnostics, ...(options.diagnostics ?? [])],
      };
      entries.set(manifest.id, entry);
      registryDiagnostics.push(...manifestDiagnostics);
      return freezeEntry(entry);
    },
    uninstall(id: string): boolean {
      return entries.delete(id);
    },
    setEnabled(id: string, enabled: boolean): RegisteredExtension {
      const entry = requireEntry(entries, id);
      entry.enabled = enabled;
      return freezeEntry(entry);
    },
    updateSettings(id: string, settings: Record<string, unknown>): RegisteredExtension {
      const entry = requireEntry(entries, id);
      entry.settings = { ...entry.settings, ...settings };
      return freezeEntry(entry);
    },
    get(id: string): RegisteredExtension | undefined {
      const entry = entries.get(id);
      return entry === undefined ? undefined : freezeEntry(entry);
    },
    list(): readonly RegisteredExtension[] {
      return [...entries.values()].map(freezeEntry);
    },
    diagnostics(hook?: ExtensionHookName): readonly ExtensionDiagnostic[] {
      const all = [...registryDiagnostics, ...[...entries.values()].flatMap((entry) => entry.diagnostics)];
      return hook === undefined ? all : all.filter((item) => item.hook === hook);
    },
    snapshot(): ExtensionRegistrySnapshot {
      return {
        extensions: registry.list(),
        diagnostics: registry.diagnostics(),
      };
    },
  };

  for (const manifest of manifests) {
    registry.install(manifest);
  }

  return registry;
}

function requireEntry(entries: ReadonlyMap<string, MutableRegisteredExtension>, id: string): MutableRegisteredExtension {
  const entry = entries.get(id);
  if (entry === undefined) {
    throw new Error(`Extension is not installed: ${id}`);
  }
  return entry;
}

function validateManifest(manifest: ExtensionManifest): readonly ExtensionDiagnostic[] {
  const diagnostics: ExtensionDiagnostic[] = [];
  if (manifest.id.trim() === '') {
    diagnostics.push(diagnostic('error', 'extension.id.empty', 'Extension id must not be empty.', manifest.id));
  }
  if (manifest.name.trim() === '') {
    diagnostics.push(diagnostic('error', 'extension.name.empty', 'Extension name must not be empty.', manifest.id));
  }
  if (manifest.version.trim() === '') {
    diagnostics.push(diagnostic('error', 'extension.version.empty', 'Extension version must not be empty.', manifest.id));
  }
  return diagnostics;
}

function diagnostic(
  level: ExtensionDiagnostic['level'],
  code: string,
  message: string,
  extensionId?: string,
  hook?: ExtensionHookName,
): ExtensionDiagnostic {
  return { level, code, message, extensionId, hook };
}
