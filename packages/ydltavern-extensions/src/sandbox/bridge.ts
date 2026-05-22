import type { ExtensionSandbox } from './runtime.js';
import type { SandboxPermissions } from './permissions.js';
import { auditArgsShape } from './audit.js';

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
    ((name === 'getSettings' || name === 'setSettings') && permissions.settings);
  if (!allowed) throw new Error(`Sandbox permission denied for ${name}`);
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
