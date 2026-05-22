// SillyTavern globals bootstrap.
//
// Mounts SillyTavern-expected globals on globalThis/window so unmodified
// ST extensions can resolve `window.SillyTavern`, `window.eventSource`,
// `window.chat`, `window.SlashCommandParser`, etc.
//
// Reference: SillyTavern public/script.js:292-295 (globalThis.SillyTavern),
// public/lib.js:34-82 (legacy library shims).

import type { STContextDeep } from './context-st.js';
import { EXTENSION_PROMPT_ROLES, EXTENSION_PROMPT_TYPES } from './context-st.js';

// Optional library handles caller can pass through (so we don't bundle them here)
export interface MountSTGlobalsOptions {
  context: STContextDeep;
  jQuery?: any;
  showdown?: any;
  dompurify?: any;
  hljs?: any;
  Handlebars?: any;
  moment?: any;
  Popper?: any;
  Fuse?: any;
  localforage?: any;
  diff_match_patch?: any;
  SVGInject?: any;
  droll?: any;
  toastr?: any;
  /** If true, do not overwrite globals already set (idempotent re-mount). Default: false (overwrite). */
  skipExisting?: boolean;
  /** Optional target; defaults to globalThis */
  target?: any;
}

export interface MountSTGlobalsResult {
  /** Restore globals to their pre-mount values */
  unmount: () => void;
  /** Names of globals that were mounted (for diagnostics) */
  mounted: string[];
}

interface PreviousGlobal {
  existed: boolean;
  value: any;
}

const previousByTarget = new WeakMap<object, Map<string, PreviousGlobal>>();

export function mountSTGlobals(opts: MountSTGlobalsOptions): MountSTGlobalsResult {
  const ctx = opts.context;
  const target = opts.target ?? (globalThis as any);
  const skipExisting = !!opts.skipExisting;

  const mounted: string[] = [];
  const mountedSet = new Set<string>();
  const previous = getPreviousMap(target);
  let unmounted = false;

  const set = (key: string, value: any) => {
    if (skipExisting && key in target && target[key] !== undefined) {
      return;
    }
    if (!previous.has(key)) {
      previous.set(key, {
        existed: key in target,
        value: target[key],
      });
    }
    target[key] = value;
    mounted.push(key);
    mountedSet.add(key);
  };

  // 1. SillyTavern.{libs, getContext}  (script.js:292-295)
  const libs: Record<string, any> = {};
  if (opts.dompurify) libs.DOMPurify = opts.dompurify;
  if (opts.showdown) libs.showdown = opts.showdown;
  if (opts.hljs) libs.hljs = opts.hljs;
  if (opts.Handlebars) libs.Handlebars = opts.Handlebars;
  if (opts.moment) libs.moment = opts.moment;
  if (opts.Popper) libs.Popper = opts.Popper;
  if (opts.Fuse) libs.Fuse = opts.Fuse;
  if (opts.localforage) libs.localforage = opts.localforage;
  if (opts.diff_match_patch) libs.diff_match_patch = opts.diff_match_patch;
  if (opts.SVGInject) libs.SVGInject = opts.SVGInject;
  if (opts.droll) libs.droll = opts.droll;

  set('SillyTavern', {
    libs,
    getContext: () => ctx,
  });

  // 2. Live-data globals (ST exposes these via ESM exports; we mirror to window)
  set('eventSource', ctx.eventSource);
  set('event_types', ctx.event_types);
  set('chat', ctx.chat);
  set('characters', ctx.characters);
  set('this_chid', ctx.characterId);
  set('chat_metadata', ctx.chatMetadata);
  set('extension_settings', ctx.extensionSettings);
  set('extension_prompt_types', EXTENSION_PROMPT_TYPES);
  set('extension_prompt_roles', EXTENSION_PROMPT_ROLES);
  set('extension_prompts', ctx.extensionPrompts);
  set('groups', ctx.groups);
  set('selected_group', ctx.groupId);
  set('name1', ctx.name1);
  set('name2', ctx.name2);
  set('mainApi', ctx.mainApi);

  // 3. Functions
  const fwd = (name: string, fn: any) => {
    if (typeof fn === 'function') set(name, fn);
  };
  fwd('getRequestHeaders', ctx.getRequestHeaders);
  fwd('saveSettingsDebounced', ctx.saveSettingsDebounced);
  fwd('saveMetadata', ctx.saveMetadata);
  fwd('saveMetadataDebounced', ctx.saveMetadataDebounced);
  fwd('reloadCurrentChat', ctx.reloadCurrentChat);
  fwd('saveChat', ctx.saveChat);
  fwd('updateChatMetadata', ctx.updateChatMetadata);
  fwd('addOneMessage', ctx.addOneMessage);
  fwd('deleteLastMessage', ctx.deleteLastMessage);
  fwd('substituteParams', ctx.substituteParams);
  fwd('messageFormatting', (ctx as any).messageFormatting);
  fwd('setExtensionPrompt', ctx.setExtensionPrompt);
  fwd('getExtensionPrompt', ctx.getExtensionPrompt);
  fwd('getExtensionPromptMaxDepth', ctx.getExtensionPromptMaxDepth);
  fwd('removeDepthPrompts', ctx.removeDepthPrompts);
  fwd('getCurrentChatId', ctx.getCurrentChatId);
  fwd('getTokenCountAsync', ctx.getTokenCountAsync);
  fwd('generate', ctx.generate);
  fwd('generateRaw', ctx.generateRaw);
  fwd('callPopup', ctx.callPopup);
  fwd('renderExtensionTemplateAsync', ctx.renderExtensionTemplateAsync);
  fwd('doExtrasFetch', (ctx as any).doExtrasFetch);
  fwd('getApiUrl', (ctx as any).getApiUrl);

  // 4. SlashCommandParser
  if ((ctx as any).SlashCommandParser) {
    set('SlashCommandParser', (ctx as any).SlashCommandParser);
  } else if (ctx.slashCommandRegistry) {
    // Wrap our slash registry in a ST-shaped facade
    set('SlashCommandParser', wrapSlashRegistry(ctx.slashCommandRegistry));
  }

  // 5. registerSlashCommand top-level shim (legacy ST API)
  fwd('registerSlashCommand', ctx.registerSlashCommand);

  // 6. Library shims (lib.js:34-82). Only set if caller provided.
  if (opts.jQuery) {
    set('$', opts.jQuery);
    set('jQuery', opts.jQuery);
  }
  if (opts.showdown) set('showdown', opts.showdown);
  if (opts.dompurify) set('DOMPurify', opts.dompurify);
  if (opts.hljs) set('hljs', opts.hljs);
  if (opts.Handlebars) set('Handlebars', opts.Handlebars);
  if (opts.moment) set('moment', opts.moment);
  if (opts.Popper) set('Popper', opts.Popper);
  if (opts.Fuse) set('Fuse', opts.Fuse);
  if (opts.localforage) set('localforage', opts.localforage);
  if (opts.diff_match_patch) set('diff_match_patch', opts.diff_match_patch);
  if (opts.SVGInject) set('SVGInject', opts.SVGInject);
  if (opts.droll) set('droll', opts.droll);
  if (opts.toastr) set('toastr', opts.toastr);

  return {
    mounted,
    unmount: () => {
      if (unmounted) return;
      unmounted = true;

      for (const key of mountedSet) {
        const prev = previous.get(key);
        if (!prev) continue;
        if (prev.existed) target[key] = prev.value;
        else delete target[key];
        previous.delete(key);
      }
    },
  };
}

// Minimal SlashCommandParser facade — wraps our slash registry in an ST-shaped object.
function wrapSlashRegistry(registry: any): any {
  return {
    addCommandObject(spec: any) {
      if (typeof registry.register === 'function') {
        registry.register(spec);
      }
    },
    commands: registry,
    parse: (input: string) => registry.parse?.(input),
    execute: (input: string, scope?: any) => registry.executeSlashCommands?.(input, scope) ?? registry.execute?.(input),
  };
}

function getPreviousMap(target: any): Map<string, PreviousGlobal> {
  if (target === null || (typeof target !== 'object' && typeof target !== 'function')) {
    throw new TypeError('mountSTGlobals target must be an object');
  }

  let previous = previousByTarget.get(target);
  if (!previous) {
    previous = new Map();
    previousByTarget.set(target, previous);
  }
  return previous;
}
