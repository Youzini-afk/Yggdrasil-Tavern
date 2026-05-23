export interface SandboxPermissions {
  /** Can read getContext() / chat[] / characters[]. Always allowed for now. */
  readonly readContext: boolean;
  /** Can call setExtensionPrompt. */
  readonly extensionPrompts: boolean;
  /** Can call eventSource.on/once/off/emit. */
  readonly events: boolean;
  /** Can call registerSlashCommand. */
  readonly slashCommands: boolean;
  /** Can read/write extension_settings[extensionId]. */
  readonly settings: boolean;
  /** Can call kernel.v1.outbound.* via host bridge (NOT exposed in v0). */
  readonly network: boolean;
  /** Opt-in for real third-party ST extension loading: ESM, browser stubs, extended ST globals. */
  readonly realExtensionLoad: boolean;
}

export const DEFAULT_PERMISSIONS: SandboxPermissions = {
  readContext: true,
  extensionPrompts: true,
  events: true,
  slashCommands: true,
  settings: true,
  network: false,
  realExtensionLoad: false,
};

export function mergeSandboxPermissions(permissions?: Partial<SandboxPermissions>): SandboxPermissions {
  return { ...DEFAULT_PERMISSIONS, ...permissions, network: false };
}
