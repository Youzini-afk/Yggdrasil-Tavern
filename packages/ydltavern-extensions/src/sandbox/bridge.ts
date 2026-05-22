import type { ExtensionSandbox } from './runtime.js';
import type { SandboxPermissions } from './permissions.js';
import { auditArgsShape } from './audit.js';
import { ST_EVENT_TYPES } from '@ydltavern/types/st';
import { EXTENSION_PROMPT_ROLES, EXTENSION_PROMPT_TYPES, ExtensionPromptStore } from '@ydltavern/st-compat';

export interface STHostBridge {
  /** Called from host to read current chat — returns a JSON-serializable copy. */
  getContextSnapshot(): unknown;
  /** Called from host to handle setExtensionPrompt. */
  setExtensionPrompt(key: string, value: string, position?: number, depth?: number, scan?: boolean, role?: number): void;
  /** Called from host to handle registerSlashCommand (with sanitized handler that proxies into sandbox). */
  registerSlashCommand(name: string, callbackId: string, helpString?: string): void;
  /** Called from host to handle eventSource.on / off / emit. */
  eventOn(eventName: string, callbackId: string): void;
  eventEmit(eventName: string, payload: unknown): void;
  /** Read/write extension_settings[extensionId]. */
  getSettings(): unknown;
  setSettings(value: unknown): void;
  /** Optional shared ST ExtensionPromptStore backing getExtensionPrompt. */
  extensionPrompts?: ExtensionPromptStore;
  updateChatMetadata?(values: unknown, reset?: boolean): unknown;
  getExtensionPrompt?(position?: number, depth?: number, separator?: string, role?: number, wrap?: boolean): Promise<string> | string;
  substituteParams?(text: string): Promise<string> | string;
  getTokenCountAsync?(text: string): Promise<number> | number;
  saveSettingsDebounced?(): void;
  saveMetadata?(): void;
  saveMetadataDebounced?(): void;
  reloadCurrentChat?(): void;
}

export function bindHostBridge(
  sandbox: ExtensionSandbox,
  permissions: SandboxPermissions,
  hostBridge: STHostBridge,
): void {
  sandbox.registerHostFunction('__ydlHostCall', (api, argsJson) => {
    const args = parseArgs(argsJson);
    assertAllowed(api, permissions);
    sandbox.recordAudit({ ts: Date.now(), api: String(api), args_shape: auditArgsShape(args) });

    switch (api) {
      case 'getContext':
        return JSON.stringify(hostBridge.getContextSnapshot());
      case 'setExtensionPrompt':
        hostBridge.setExtensionPrompt(
          stringArg(args[0]),
          stringArg(args[1]),
          optionalNumberArg(args[2]),
          optionalNumberArg(args[3]),
          optionalBooleanArg(args[4]),
          optionalNumberArg(args[5]),
        );
        hostBridge.extensionPrompts?.set(
          stringArg(args[0]),
          stringArg(args[1]),
          optionalNumberArg(args[2]) as never,
          optionalNumberArg(args[3]),
          optionalBooleanArg(args[4]),
          optionalNumberArg(args[5]) as never,
        );
        return JSON.stringify(null);
      case 'registerSlashCommand': {
        const callbackId = stringArg(args[1]);
        sandbox.registerCallback(callbackId);
        hostBridge.registerSlashCommand(stringArg(args[0]), callbackId, optionalStringArg(args[2]));
        return JSON.stringify(null);
      }
      case 'eventOn': {
        const callbackId = stringArg(args[1]);
        sandbox.registerCallback(callbackId);
        hostBridge.eventOn(stringArg(args[0]), callbackId);
        return JSON.stringify(null);
      }
      case 'eventEmit':
        hostBridge.eventEmit(stringArg(args[0]), args[1]);
        return JSON.stringify(null);
      case 'getSettings':
        return JSON.stringify(hostBridge.getSettings());
      case 'setSettings':
        hostBridge.setSettings(args[0]);
        return JSON.stringify(null);
      case 'getRequestHeaders':
        return JSON.stringify({ 'Content-Type': 'application/json' });
      case 'saveSettingsDebounced':
        hostBridge.saveSettingsDebounced?.();
        return JSON.stringify(null);
      case 'saveMetadata':
        hostBridge.saveMetadata?.();
        return JSON.stringify(null);
      case 'saveMetadataDebounced':
        hostBridge.saveMetadataDebounced?.();
        return JSON.stringify(null);
      case 'reloadCurrentChat':
        hostBridge.reloadCurrentChat?.();
        return JSON.stringify(null);
      case 'updateChatMetadata':
        return JSON.stringify(updateChatMetadata(hostBridge, args[0], optionalBooleanArg(args[1])));
      case 'getExtensionPrompt':
        return JSON.stringify(getExtensionPrompt(hostBridge, args));
      case 'substituteParams':
        return JSON.stringify(substituteParams(hostBridge, stringArg(args[0])));
      case 'getTokenCountAsync':
        return JSON.stringify(getTokenCountAsync(hostBridge, stringArg(args[0])));
      default:
        throw new Error(`Unknown sandbox host API: ${String(api)}`);
    }
  });

  const bootstrap = makeBootstrapSource(sandbox.extensionId, permissions);
  void sandbox.eval(bootstrap, '<ydltavern-host-bridge>');
}

function makeBootstrapSource(extensionId: string, permissions: SandboxPermissions): string {
  return `
(function () {
  const extensionId = ${JSON.stringify(extensionId)};
  const permissions = ${JSON.stringify(permissions)};
  const callbacks = Object.create(null);
  let nextCallbackId = 0;
  function host(api, args) {
    return JSON.parse(globalThis.__ydlHostCall(api, JSON.stringify(args || [])));
  }
  function callbackIdFor(value, prefix) {
    if (typeof value === 'string') return value;
    if (typeof value !== 'function') throw new TypeError(prefix + ' callback must be a function or callback id string');
    const id = prefix + '-' + (++nextCallbackId);
    callbacks[id] = value;
    return id;
  }
  const ydl = {
    callbacks,
    invokeCallback(id, payload) {
      if (typeof callbacks[id] !== 'function') throw new Error('Unknown sandbox callback: ' + id);
      return callbacks[id](payload);
    },
  };
  Object.defineProperty(globalThis, '__ydlTavern__', { value: ydl, writable: false, configurable: false });

  if (permissions.readContext) {
    globalThis.getContext = function getContext() { return host('getContext'); };
  }
  if (permissions.extensionPrompts) {
    globalThis.setExtensionPrompt = function setExtensionPrompt(key, value, position, depth, scan, role) {
      return host('setExtensionPrompt', [key, value, position, depth, scan, role]);
    };
  }
  if (permissions.slashCommands) {
    globalThis.registerSlashCommand = function registerSlashCommand(name, callbackOrId, helpString) {
      return host('registerSlashCommand', [name, callbackIdFor(callbackOrId, 'slash'), helpString]);
    };
  }
  if (permissions.events) {
    globalThis.eventOn = function eventOn(eventName, callbackOrId) {
      return host('eventOn', [eventName, callbackIdFor(callbackOrId, 'event')]);
    };
    globalThis.eventEmit = function eventEmit(eventName, payload) {
      return host('eventEmit', [eventName, payload]);
    };
    globalThis.eventSource = Object.freeze({
      on(eventName, callbackOrId) { globalThis.eventOn(eventName, callbackOrId); return this; },
      once(eventName, callbackOrId) { globalThis.eventOn(eventName, callbackOrId); return this; },
      off() { return this; },
      emit(eventName, payload) { globalThis.eventEmit(eventName, payload); return true; },
    });
  }
  if (permissions.settings) {
    globalThis.getExtensionSettings = function getExtensionSettings() { return host('getSettings'); };
    globalThis.setExtensionSettings = function setExtensionSettings(value) { return host('setSettings', [value]); };
    const extensionSettings = {};
    Object.defineProperty(extensionSettings, extensionId, {
      enumerable: true,
      configurable: false,
      get() { return globalThis.getExtensionSettings(); },
      set(value) { globalThis.setExtensionSettings(value); },
    });
    Object.defineProperty(globalThis, 'extension_settings', { value: extensionSettings, writable: false, configurable: false });
  }
  if (permissions.realExtensionLoad) {
    // ST globals from public/script.js and public/scripts/st-context.js; see
    // packages/ydltavern-st-compat/src/context-st.ts refs for source lines.
    globalThis.event_types = ${JSON.stringify(ST_EVENT_TYPES)};
    globalThis.extension_prompt_types = ${JSON.stringify(EXTENSION_PROMPT_TYPES)};
    globalThis.extension_prompt_roles = ${JSON.stringify(EXTENSION_PROMPT_ROLES)};
    globalThis.getRequestHeaders = function getRequestHeaders() { return host('getRequestHeaders'); };
    globalThis.saveSettingsDebounced = function saveSettingsDebounced() { return host('saveSettingsDebounced'); };
    globalThis.saveMetadata = function saveMetadata() { return host('saveMetadata'); };
    globalThis.saveMetadataDebounced = function saveMetadataDebounced() { return host('saveMetadataDebounced'); };
    globalThis.reloadCurrentChat = function reloadCurrentChat() { return host('reloadCurrentChat'); };
    globalThis.updateChatMetadata = function updateChatMetadata(values, reset) { return host('updateChatMetadata', [values, reset]); };
    globalThis.getExtensionPrompt = function getExtensionPrompt(position, depth, separator, role, wrap) { return host('getExtensionPrompt', [position, depth, separator, role, wrap]); };
    globalThis.substituteParams = function substituteParams(text) { return host('substituteParams', [text]); };
    globalThis.getTokenCountAsync = function getTokenCountAsync(text) { return host('getTokenCountAsync', [text]); };
  }
  Object.defineProperty(globalThis, 'kernel', { value: undefined, writable: false, configurable: false });
})();`;
}

function parseArgs(value: unknown): unknown[] {
  if (typeof value !== 'string') return [];
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) ? parsed : [];
}

function assertAllowed(api: unknown, permissions: SandboxPermissions): void {
  const name = String(api);
  const allowed =
    (name === 'getContext' && permissions.readContext) ||
    (name === 'setExtensionPrompt' && permissions.extensionPrompts) ||
    ((name === 'eventOn' || name === 'eventEmit') && permissions.events) ||
    (name === 'registerSlashCommand' && permissions.slashCommands) ||
    ((name === 'getSettings' || name === 'setSettings') && permissions.settings) ||
    (permissions.realExtensionLoad && EXTENDED_REAL_LOAD_APIS.has(name));
  if (!allowed) throw new Error(`Sandbox permission denied for ${name}`);
}

const EXTENDED_REAL_LOAD_APIS = new Set([
  'getRequestHeaders',
  'saveSettingsDebounced',
  'saveMetadata',
  'saveMetadataDebounced',
  'reloadCurrentChat',
  'updateChatMetadata',
  'getExtensionPrompt',
  'substituteParams',
  'getTokenCountAsync',
]);

function updateChatMetadata(hostBridge: STHostBridge, values: unknown, reset: boolean | undefined): unknown {
  if (hostBridge.updateChatMetadata) return hostBridge.updateChatMetadata(values, reset);
  const snapshot = hostBridge.getContextSnapshot();
  if (snapshot && typeof snapshot === 'object') {
    const target = snapshot as { chatMetadata?: Record<string, unknown> };
    const next = values && typeof values === 'object' ? values as Record<string, unknown> : {};
    target.chatMetadata = reset ? { ...next } : { ...(target.chatMetadata ?? {}), ...next };
    return target.chatMetadata;
  }
  return values;
}

function getExtensionPrompt(hostBridge: STHostBridge, args: unknown[]): string {
  const position = optionalNumberArg(args[0]);
  const depth = optionalNumberArg(args[1]);
  const separator = optionalStringArg(args[2]) ?? '\n';
  const role = optionalNumberArg(args[3]);
  const wrap = optionalBooleanArg(args[4]) ?? false;
  if (hostBridge.getExtensionPrompt) {
    const value = hostBridge.getExtensionPrompt(
      position,
      depth,
      separator,
      role,
      wrap,
    );
    return typeof value === 'string' ? value : '';
  }
  if (hostBridge.extensionPrompts) return renderPromptStoreSync(hostBridge.extensionPrompts, position, depth, separator, role, wrap);
  return '';
}

function renderPromptStoreSync(
  store: ExtensionPromptStore,
  position: number | undefined,
  depth: number | undefined,
  separator: string,
  role: number | undefined,
  wrap: boolean,
): string {
  const values = store.values()
    .filter((entry) => position === undefined || entry.position === position)
    .filter((entry) => depth === undefined || entry.depth === depth)
    .filter((entry) => role === undefined || entry.role === role)
    .map((entry) => entry.value)
    .filter((value) => value.length > 0);
  const joined = values.join(separator);
  return joined.length > 0 && wrap ? `${separator}${joined}${separator}` : joined;
}

function substituteParams(hostBridge: STHostBridge, text: string): string {
  const value = hostBridge.substituteParams?.(text);
  return typeof value === 'string' ? value : text;
}

function getTokenCountAsync(hostBridge: STHostBridge, text: string): number {
  const value = hostBridge.getTokenCountAsync?.(text);
  return typeof value === 'number' && Number.isFinite(value) ? value : Math.ceil(text.length / 3.35);
}

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : String(value ?? '');
}

function optionalStringArg(value: unknown): string | undefined {
  return value === undefined || value === null ? undefined : stringArg(value);
}

function optionalNumberArg(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function optionalBooleanArg(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined;
}
