// Deep port of SillyTavern getContext() runtime surface.
//
// References (read at port time):
//   public/scripts/st-context.js — full bridge object
//   public/script.js — eventSource, event_types, addOneMessage, Generate,
//     setExtensionPrompt, getExtensionPrompt, extension_prompt_types,
//     extension_prompt_roles
//
// This module exposes the ST `getContext()` shape that extensions consume.
// Many implementations are placeholders that route through a host-supplied
// adapter. ST extensions accessing these symbols should at least find them
// present with the right call signatures.

import type { Chat, STChatMessage } from '@ydltavern/types';
import { ST_EVENT_TYPES } from '@ydltavern/types/st';
import type { STEventSource } from './events.js';

// ---------------------------------------------------------------------------
// Constants

export const EXTENSION_PROMPT_TYPES = {
  NONE: -1,
  IN_PROMPT: 0,
  IN_CHAT: 1,
  BEFORE_PROMPT: 2,
} as const;
export type ExtensionPromptTypeValue =
  (typeof EXTENSION_PROMPT_TYPES)[keyof typeof EXTENSION_PROMPT_TYPES];

export const EXTENSION_PROMPT_ROLES = {
  SYSTEM: 0,
  USER: 1,
  ASSISTANT: 2,
} as const;
export type ExtensionPromptRoleValue =
  (typeof EXTENSION_PROMPT_ROLES)[keyof typeof EXTENSION_PROMPT_ROLES];

// ---------------------------------------------------------------------------
// Extension prompt store

export interface ExtensionPromptEntry {
  value: string;
  position: ExtensionPromptTypeValue;
  depth: number;
  scan: boolean;
  role: ExtensionPromptRoleValue;
  filter?: () => boolean | Promise<boolean>;
}

export class ExtensionPromptStore {
  private prompts = new Map<string, ExtensionPromptEntry>();

  set(
    key: string,
    value: string,
    position: ExtensionPromptTypeValue = EXTENSION_PROMPT_TYPES.IN_PROMPT,
    depth = 4,
    scan = false,
    role: ExtensionPromptRoleValue = EXTENSION_PROMPT_ROLES.SYSTEM,
    filter?: () => boolean | Promise<boolean>,
  ): void {
    this.prompts.set(key, { value, position, depth, scan, role, filter });
  }

  remove(key: string): void {
    this.prompts.delete(key);
  }

  get(key: string): ExtensionPromptEntry | undefined {
    return this.prompts.get(key);
  }

  values(): readonly ExtensionPromptEntry[] {
    return [...this.prompts.values()];
  }

  entries(): readonly [string, ExtensionPromptEntry][] {
    return [...this.prompts.entries()];
  }

  keys(): readonly string[] {
    return [...this.prompts.keys()];
  }

  clear(): void {
    this.prompts.clear();
  }

  // Port of getExtensionPrompt(position, depth, separator, role, wrap)
  async render(
    position?: ExtensionPromptTypeValue,
    depth?: number,
    separator = '\n',
    role?: ExtensionPromptRoleValue,
    wrap = false,
  ): Promise<string> {
    const filtered: ExtensionPromptEntry[] = [];
    for (const [, entry] of this.prompts) {
      if (position !== undefined && entry.position !== position) continue;
      if (depth !== undefined && entry.depth !== depth) continue;
      if (role !== undefined && entry.role !== role) continue;
      if (entry.filter) {
        const ok = await entry.filter();
        if (!ok) continue;
      }
      filtered.push(entry);
    }
    if (filtered.length === 0) return '';
    const joined = filtered
      .map((e) => e.value)
      .filter((v) => v.length > 0)
      .join(separator);
    if (joined.length === 0) return '';
    return wrap ? `${separator}${joined}${separator}` : joined;
  }

  maxDepth(): number {
    let max = 0;
    for (const [, e] of this.prompts) {
      if (e.position === EXTENSION_PROMPT_TYPES.IN_CHAT && e.depth > max) max = e.depth;
    }
    return max;
  }

  removeDepthPrompts(): void {
    for (const [k, e] of [...this.prompts.entries()]) {
      if (e.position === EXTENSION_PROMPT_TYPES.IN_CHAT) this.prompts.delete(k);
    }
  }
}

// ---------------------------------------------------------------------------
// Variable store (chat metadata + global)

export interface VariableScope {
  get(key: string): unknown;
  set(key: string, value: unknown): void;
  add(key: string, value: unknown): void;
  inc(key: string): void;
  dec(key: string): void;
  has(key: string): boolean;
  del(key: string): void;
  list(): Readonly<Record<string, unknown>>;
}

export function createVariableScope(initial: Readonly<Record<string, unknown>> = {}): VariableScope {
  const store = new Map<string, unknown>(Object.entries(initial));
  return {
    get(key) { return store.get(key); },
    set(key, value) { store.set(key, value); },
    add(key, value) {
      const cur = store.get(key);
      if (typeof cur === 'number' && typeof value === 'number') store.set(key, cur + value);
      else store.set(key, String(cur ?? '') + String(value));
    },
    inc(key) {
      const n = Number(store.get(key) ?? 0);
      store.set(key, Number.isFinite(n) ? n + 1 : 1);
    },
    dec(key) {
      const n = Number(store.get(key) ?? 0);
      store.set(key, Number.isFinite(n) ? n - 1 : -1);
    },
    has(key) { return store.has(key); },
    del(key) { store.delete(key); },
    list() {
      const out: Record<string, unknown> = {};
      for (const [k, v] of store) out[k] = v;
      return out;
    },
  };
}

// ---------------------------------------------------------------------------
// Swipe namespace (shape only — host wires real behavior)

export interface SwipeState {
  index: number;
  count: number;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
}

export interface SwipeNamespace {
  left(): Promise<void> | void;
  right(): Promise<void> | void;
  to(index: number): Promise<void> | void;
  show(index: number): Promise<void> | void;
  hide(index: number): Promise<void> | void;
  refresh(): Promise<void> | void;
  isAllowed(): boolean;
  state(): SwipeState;
}

// ---------------------------------------------------------------------------
// Tool manager (placeholder shape per ST ToolManager)

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Readonly<Record<string, unknown>>;
  shouldRegister?: () => boolean;
  toFunctionOpenAI?: () => { type: 'function'; function: { name: string; description: string; parameters: unknown } };
}

export interface ToolManagerNamespace {
  registerFunctionTool(def: ToolDefinition): void;
  unregisterFunctionTool(name: string): void;
  isToolCallingSupported(api: string, model: string): boolean;
  canPerformToolCalls(type: string, settings: unknown, model: string): boolean;
}

export function createToolManager(): ToolManagerNamespace {
  const tools = new Map<string, ToolDefinition>();
  return {
    registerFunctionTool(def) { tools.set(def.name, def); },
    unregisterFunctionTool(name) { tools.delete(name); },
    isToolCallingSupported(api, model) {
      // Defaults; host can override by wrapping
      void api; void model;
      return true;
    },
    canPerformToolCalls(type, settings, model) {
      void type; void settings; void model;
      return tools.size > 0;
    },
  };
}

// ---------------------------------------------------------------------------
// STContext shape — mirror of ST st-context.js

export interface STContextHostBridge {
  // State
  chat: STChatMessage[];
  characters: readonly unknown[];
  groups: readonly unknown[];
  characterId?: number | string;
  groupId?: number | string;
  chatId?: string;
  name1: string;
  name2: string;
  mainApi: string;
  onlineStatus: string;
  maxContext: number;
  chatMetadata: Record<string, unknown>;
  menuType: string;
  extensionSettings: Record<string, unknown>;
  powerUserSettings: Record<string, unknown>;
  tags: readonly unknown[];
  tagMap: Record<string, unknown>;

  // Bridges
  eventSource: STEventSource;
  extensionPrompts: ExtensionPromptStore;
  variables: { local: VariableScope; global: VariableScope };
  swipe: SwipeNamespace;
  toolManager: ToolManagerNamespace;

  // Functions (sync defaults; host can swap to async)
  getCurrentChatId(): string | undefined;
  reloadCurrentChat(): Promise<void> | void;
  saveChat(): Promise<void> | void;
  saveSettingsDebounced(): void;
  saveMetadata(): Promise<void> | void;
  saveMetadataDebounced(): void;
  updateChatMetadata(values: Record<string, unknown>, reset: boolean): void;
  addOneMessage(message: STChatMessage, options?: Record<string, unknown>): void;
  deleteLastMessage(): Promise<void> | void;
  generate?: (...args: unknown[]) => Promise<unknown>;
  generateRaw?: (input: { prompt: string; api?: string; instructOverride?: boolean; quietToLoud?: boolean; systemPrompt?: string; responseLength?: number; trimNames?: boolean; prefill?: string; jsonSchema?: unknown }) => Promise<string>;
  substituteParams(text: string): string;
  substituteParamsExtended(text: string, extra?: Record<string, unknown>): string;
  setExtensionPrompt: ExtensionPromptStore['set'];
  getExtensionPrompt: ExtensionPromptStore['render'];
  getExtensionPromptMaxDepth: ExtensionPromptStore['maxDepth'];
  removeDepthPrompts: ExtensionPromptStore['removeDepthPrompts'];
  registerSlashCommand?: (...args: unknown[]) => void;
  executeSlashCommandsWithOptions?: (text: string, options?: Record<string, unknown>) => Promise<unknown>;
  callPopup?: (...args: unknown[]) => Promise<unknown>;
  callGenericPopup?: (...args: unknown[]) => Promise<unknown>;
  showLoader?: () => void;
  hideLoader?: () => void;
  getRequestHeaders(): Record<string, string>;
  getTokenCountAsync(text: string): Promise<number> | number;
  getTextTokens?: (tokenizerId: string, text: string) => Promise<number[]> | number[];
  getTokenizerModel?: () => string;
  isMobile(): boolean;
  shouldSendOnEnter(): boolean;
}

export interface STContextDeep extends STContextHostBridge {
  // Legacy aliases
  event_types: typeof ST_EVENT_TYPES;
  eventTypes: typeof ST_EVENT_TYPES;
  main_api: string;
  online_status: string;
  // ST symbols / constants
  symbols: { ignore: symbol };
  constants: { unset: symbol };
  // Deprecated stubs
  registerHelper?: () => void;
  executeSlashCommands?: (text: string) => Promise<unknown>;
  getTokenCount?: (text: string) => number;
  renderExtensionTemplate?: (...args: unknown[]) => string;
  renderExtensionTemplateAsync?: (...args: unknown[]) => Promise<string>;
}

export interface CreateSTContextDeepOptions {
  chat?: Chat;
  hostBridge?: Partial<STContextHostBridge>;
  eventSource: STEventSource;
  substituteParams?: (text: string) => string;
}

export function createSTContextDeep(options: CreateSTContextDeepOptions): STContextDeep {
  const ignore = Symbol('ydltavern.ignore');
  const unset = Symbol('ydltavern.unset');
  const extensionPrompts = options.hostBridge?.extensionPrompts ?? new ExtensionPromptStore();
  const local = options.hostBridge?.variables?.local ?? createVariableScope();
  const global = options.hostBridge?.variables?.global ?? createVariableScope();

  const subst = options.substituteParams ?? ((s: string) => s);
  const noopAsync = async (): Promise<void> => undefined;
  const noopSync = (): void => undefined;

  const swipe: SwipeNamespace = options.hostBridge?.swipe ?? {
    left: noopAsync,
    right: noopAsync,
    to: noopAsync,
    show: noopAsync,
    hide: noopAsync,
    refresh: noopAsync,
    isAllowed: () => true,
    state: () => ({ index: 0, count: 1, canSwipeLeft: false, canSwipeRight: false }),
  };

  const toolManager = options.hostBridge?.toolManager ?? createToolManager();

  const ctx: STContextDeep = {
    chat: options.hostBridge?.chat ?? [],
    characters: options.hostBridge?.characters ?? [],
    groups: options.hostBridge?.groups ?? [],
    characterId: options.hostBridge?.characterId,
    groupId: options.hostBridge?.groupId,
    chatId: options.hostBridge?.chatId,
    name1: options.hostBridge?.name1 ?? 'You',
    name2: options.hostBridge?.name2 ?? 'Assistant',
    mainApi: options.hostBridge?.mainApi ?? 'openai',
    onlineStatus: options.hostBridge?.onlineStatus ?? 'no_connection',
    maxContext: options.hostBridge?.maxContext ?? 4096,
    chatMetadata: options.hostBridge?.chatMetadata ?? {},
    menuType: options.hostBridge?.menuType ?? '',
    extensionSettings: options.hostBridge?.extensionSettings ?? {},
    powerUserSettings: options.hostBridge?.powerUserSettings ?? {},
    tags: options.hostBridge?.tags ?? [],
    tagMap: options.hostBridge?.tagMap ?? {},

    eventSource: options.eventSource,
    extensionPrompts,
    variables: { local, global },
    swipe,
    toolManager,

    getCurrentChatId: options.hostBridge?.getCurrentChatId ?? (() => options.hostBridge?.chatId),
    reloadCurrentChat: options.hostBridge?.reloadCurrentChat ?? noopAsync,
    saveChat: options.hostBridge?.saveChat ?? noopAsync,
    saveSettingsDebounced: options.hostBridge?.saveSettingsDebounced ?? noopSync,
    saveMetadata: options.hostBridge?.saveMetadata ?? noopAsync,
    saveMetadataDebounced: options.hostBridge?.saveMetadataDebounced ?? noopSync,
    updateChatMetadata: options.hostBridge?.updateChatMetadata ?? ((values, reset) => {
      if (reset) {
        for (const k of Object.keys(ctx.chatMetadata)) delete ctx.chatMetadata[k];
      }
      Object.assign(ctx.chatMetadata, values);
    }),
    addOneMessage: options.hostBridge?.addOneMessage ?? ((message) => {
      ctx.chat.push(message);
    }),
    deleteLastMessage: options.hostBridge?.deleteLastMessage ?? noopAsync,
    generate: options.hostBridge?.generate,
    generateRaw: options.hostBridge?.generateRaw,
    substituteParams: subst,
    substituteParamsExtended: options.hostBridge?.substituteParamsExtended ?? ((text) => subst(text)),
    setExtensionPrompt: extensionPrompts.set.bind(extensionPrompts),
    getExtensionPrompt: extensionPrompts.render.bind(extensionPrompts),
    getExtensionPromptMaxDepth: extensionPrompts.maxDepth.bind(extensionPrompts),
    removeDepthPrompts: extensionPrompts.removeDepthPrompts.bind(extensionPrompts),
    registerSlashCommand: options.hostBridge?.registerSlashCommand,
    executeSlashCommandsWithOptions: options.hostBridge?.executeSlashCommandsWithOptions,
    callPopup: options.hostBridge?.callPopup,
    callGenericPopup: options.hostBridge?.callGenericPopup,
    showLoader: options.hostBridge?.showLoader,
    hideLoader: options.hostBridge?.hideLoader,
    getRequestHeaders: options.hostBridge?.getRequestHeaders ?? (() => ({ 'Content-Type': 'application/json' })),
    getTokenCountAsync: options.hostBridge?.getTokenCountAsync ?? ((text) => Math.ceil(text.length / 4)),
    getTextTokens: options.hostBridge?.getTextTokens,
    getTokenizerModel: options.hostBridge?.getTokenizerModel,
    isMobile: options.hostBridge?.isMobile ?? (() => false),
    shouldSendOnEnter: options.hostBridge?.shouldSendOnEnter ?? (() => true),

    // Legacy aliases
    event_types: ST_EVENT_TYPES,
    eventTypes: ST_EVENT_TYPES,
    main_api: options.hostBridge?.mainApi ?? 'openai',
    online_status: options.hostBridge?.onlineStatus ?? 'no_connection',
    symbols: { ignore },
    constants: { unset },

    // Deprecated stubs
    registerHelper: () => undefined,
    executeSlashCommands: options.hostBridge?.executeSlashCommandsWithOptions
      ? (text) => options.hostBridge!.executeSlashCommandsWithOptions!(text)
      : undefined,
    getTokenCount: (text) => Math.ceil(text.length / 4),
  };

  return ctx;
}
