import type { ExtensionPromptRoleValue, ExtensionPromptTypeValue, STContextDeep } from './context-st.js';
import { EXTENSION_PROMPT_ROLES, EXTENSION_PROMPT_TYPES } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { namedString, registerIfMissing, textValue, toBoolean, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

const PROMPT_ENTRY_OVERRIDE_KEY = 'ydltavern_prompt_manager_overrides';
const WORLD_INFO_METADATA_KEY = 'ydltavern_world_info';
const WORLD_INFO_COMPAT_KEY = 'world_info_enabled';

type PlainRecord = Record<string, unknown>;

export function registerBatchF(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'inject',
    rawQuotes: true,
    callback: (args, value) => {
      // ST source: public/scripts/slash-commands.js:2891-2940 registers /inject;
      // implementation persists script_injects and calls setExtensionPrompt at lines 3778-3842.
      const parsed = parseInjectionArgs(args, value);
      if (!parsed.id) throw new Error('Injection id cannot be empty.');
      ctx.extensionPrompts.set(parsed.id, parsed.content, parsed.position, parsed.depth, parsed.scan, parsed.role);
      mirrorScriptInject(ctx, parsed.id, parsed);
      ctx.saveMetadataDebounced();
      return parsed.id;
    },
    returns: 'injection ID',
  });

  registerIfMissing(registry, {
    name: 'listinjects',
    callback: () => {
      // ST source: slash-commands.js:2941-2956 registers /listinjects; formatter is lines 3845-3862.
      const entries = ctx.extensionPrompts.entries();
      if (entries.length === 0) return 'No injections';
      return entries.map(([id, e]) => `${id}: position=${e.position} depth=${e.depth} role=${e.role} scan=${e.scan} value=${preview(e.value)}`).join('\n');
    },
    returns: 'current injections',
  });

  registerIfMissing(registry, {
    name: 'flushinject',
    callback: (args, value) => {
      // ST source: slash-commands.js:2957-2970 registers /flushinject; removal loop is lines 3870-3889.
      const id = parseId(args, value);
      if (!id) return '';
      ctx.extensionPrompts.remove(id);
      removeMirroredScriptInject(ctx, id);
      ctx.saveMetadataDebounced();
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'flushinjects',
    callback: () => {
      // ST aliases /flushinjects to /flushinject with no id (slash-commands.js:2958-2959).
      ctx.extensionPrompts.clear();
      delete (ctx.chatMetadata as PlainRecord).script_injects;
      ctx.saveMetadataDebounced();
      return '';
    },
  });

  registerIfMissing(registry, {
    name: 'getpromptentry',
    aliases: ['getpromptentries'],
    callback: (args, value) => {
      // ST source: slash-commands.js:3007-3049 registers /getpromptentry; callback is lines 6400-6459.
      // st-compat does not own engine PromptManager state, so this is a delegated descriptor.
      const id = parseId(args, value, ['id', 'identifier', 'name']);
      const overrides = asRecord((ctx.extensionSettings as PlainRecord)[PROMPT_ENTRY_OVERRIDE_KEY]) ?? {};
      return descriptor({ planned: true, action: 'get_prompt_entry', id, entry: id ? overrides[id] : undefined, metadataKey: `extensionSettings.${PROMPT_ENTRY_OVERRIDE_KEY}`, delegatedTo: 'engine_prompt_manager' });
    },
    returns: 'plan-only prompt manager entry descriptor',
  });

  registerIfMissing(registry, {
    name: 'setpromptentry',
    aliases: ['setpromptentries'],
    callback: (args, value) => {
      // ST source: slash-commands.js:3050-3087 registers /setpromptentry; callback is lines 6469-6543.
      // st-compat records requested changes for the engine PromptManager to consume.
      const parsed = parsePromptEntrySet(args, value);
      const overrides = ensureRecord(ctx.extensionSettings as PlainRecord, PROMPT_ENTRY_OVERRIDE_KEY);
      overrides[parsed.id] = { ...(asRecord(overrides[parsed.id]) ?? {}), ...parsed.fields };
      ctx.saveSettingsDebounced();
      return descriptor({ planned: true, action: 'set_prompt_entry', id: parsed.id, fields: parsed.fields, metadataKey: `extensionSettings.${PROMPT_ENTRY_OVERRIDE_KEY}`, delegatedTo: 'engine_prompt_manager' });
    },
  });

  registerIfMissing(registry, {
    name: 'worldenable',
    callback: (args, value) => {
      // Frontier R2 command. No exact ST /worldenable slash registration was found in slash-commands.js.
      // World book assets are engine-side; st-compat writes chat metadata for that boundary.
      const name = parseName(args, value);
      setWorldBookEnabled(ctx, name, true);
      ctx.saveMetadataDebounced();
      return descriptor({ planned: true, action: 'world_enable', name, metadataKey: `chatMetadata.${WORLD_INFO_METADATA_KEY}.enabled_books`, delegatedTo: 'engine_world_info' });
    },
  });

  registerIfMissing(registry, {
    name: 'worlddisable',
    callback: (args, value) => {
      // Frontier R2 command. No exact ST /worlddisable slash registration was found in slash-commands.js.
      // World book assets are engine-side; st-compat writes chat metadata for that boundary.
      const name = parseName(args, value);
      setWorldBookEnabled(ctx, name, false);
      ctx.saveMetadataDebounced();
      return descriptor({ planned: true, action: 'world_disable', name, metadataKey: `chatMetadata.${WORLD_INFO_METADATA_KEY}.enabled_books`, delegatedTo: 'engine_world_info' });
    },
  });

  registerIfMissing(registry, {
    name: 'world-add',
    rawQuotes: true,
    callback: (args, value) => {
      // Frontier R2 plan-only command. No exact ST /world-add slash registration was found in slash-commands.js.
      return descriptor({ planned: true, action: 'add_world_entry', ...parseWorldAddArgs(args, value), delegatedTo: 'engine_world_info' });
    },
    returns: 'plan-only world entry descriptor',
  });
}

function parseInjectionArgs(args: Record<string, ScopeValue>, value: ScopeValue): { id: string; content: string; position: ExtensionPromptTypeValue; depth: number; scan: boolean; role: ExtensionPromptRoleValue } {
  const parsed = parseKnownArgs(args, value, ['id', 'position', 'depth', 'scan', 'role', 'content']);
  return { id: String(parsed.args.id ?? '').trim(), content: String(parsed.args.content ?? parsed.text ?? ''), position: parsePosition(parsed.args.position), depth: parseDepth(parsed.args.depth), scan: toBoolean(parsed.args.scan), role: parseRole(parsed.args.role) };
}

function parseKnownArgs(args: Record<string, ScopeValue>, value: ScopeValue, known: readonly string[]): { args: Record<string, ScopeValue>; text: string } {
  const parsedArgs: Record<string, ScopeValue> = { ...args };
  let text = textValue(value).trimStart();
  const knownSet = new Set(known);
  while (text.length > 0) {
    const match = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)=/u);
    if (!match) break;
    const key = match[1] ?? '';
    if (!knownSet.has(key)) break;
    const start = key.length + 1;
    if (key === 'content') { parsedArgs.content = unquote(text.slice(start).trimStart()); text = ''; break; }
    const parsed = readArgValue(text, start);
    parsedArgs[key] = parsed.value;
    text = text.slice(parsed.consumed).trimStart();
  }
  return { args: parsedArgs, text };
}

function readArgValue(input: string, start: number): { value: string; consumed: number } {
  const quote = input[start];
  if (quote === '"' || quote === "'") {
    let value = '';
    let index = start + 1;
    while (index < input.length) {
      const char = input[index] ?? '';
      if (char === '\\') { value += input[index + 1] ?? ''; index += 2; continue; }
      if (char === quote) return { value, consumed: index + 1 };
      value += char;
      index += 1;
    }
    return { value, consumed: input.length };
  }
  const nextSpace = input.slice(start).search(/\s/u);
  const end = nextSpace === -1 ? input.length : start + nextSpace;
  return { value: input.slice(start, end), consumed: end };
}

function parsePosition(raw: ScopeValue): ExtensionPromptTypeValue {
  if (raw === undefined || raw === null || String(raw).trim() === '') return EXTENSION_PROMPT_TYPES.IN_PROMPT;
  const named: Record<string, ExtensionPromptTypeValue> = { none: -1, '-1': -1, after: 0, in_prompt: 0, inprompt: 0, '0': 0, chat: 1, in_chat: 1, inchat: 1, '1': 1, before: 2, before_prompt: 2, beforeprompt: 2, '2': 2 };
  const key = String(raw).trim().toLowerCase();
  if (key in named) return named[key]!;
  throw new Error(`Invalid injection position: ${String(raw)}`);
}

function parseDepth(raw: ScopeValue): number {
  if (raw === undefined || raw === null || String(raw).trim() === '') return 4;
  const depth = Number(raw);
  if (!Number.isFinite(depth)) throw new Error(`Invalid injection depth: ${String(raw)}`);
  return depth;
}

function parseRole(raw: ScopeValue): ExtensionPromptRoleValue {
  if (raw === undefined || raw === null || String(raw).trim() === '') return EXTENSION_PROMPT_ROLES.SYSTEM;
  const named: Record<string, ExtensionPromptRoleValue> = { system: 0, '0': 0, user: 1, '1': 1, assistant: 2, '2': 2 };
  const key = String(raw).trim().toLowerCase();
  if (key in named) return named[key]!;
  throw new Error(`Invalid injection role: ${String(raw)}`);
}

function parseId(args: Record<string, ScopeValue>, value: ScopeValue, names: readonly string[] = ['id']): string {
  for (const name of names) {
    const candidate = namedString(args, name)?.trim();
    if (candidate) return candidate;
  }
  return textValue(value).trim();
}

function parseName(args: Record<string, ScopeValue>, value: ScopeValue): string {
  const name = parseId(args, value, ['name', 'book', 'id']);
  if (!name) throw new Error('World book name cannot be empty.');
  return name;
}

function parsePromptEntrySet(args: Record<string, ScopeValue>, value: ScopeValue): { id: string; fields: PlainRecord } {
  const parsed = parseKnownArgs(args, value, ['id', 'identifier', 'name', 'enabled', 'field', 'value', 'content', 'role', 'position']);
  const id = parseId(parsed.args, '', ['id', 'identifier', 'name']);
  if (!id) throw new Error('Prompt entry id cannot be empty.');
  const fields: PlainRecord = {};
  for (const [key, raw] of Object.entries(parsed.args)) if (!['id', 'identifier', 'name'].includes(key)) fields[key] = coerceField(raw);
  const text = parsed.text.trim();
  if (text) {
    const assignment = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)=([\s\S]*)$/u);
    if (assignment) fields[assignment[1]!] = coerceField(assignment[2] ?? '');
    else fields.enabled = parseToggle(text);
  }
  if (Object.keys(fields).length === 0) fields.enabled = true;
  return { id, fields };
}

function parseWorldAddArgs(args: Record<string, ScopeValue>, value: ScopeValue): PlainRecord {
  const parsed = parseKnownArgs(args, value, ['book', 'name', 'key', 'keys', 'content', 'position', 'depth', 'role', 'order']);
  const fields: PlainRecord = {};
  for (const [key, raw] of Object.entries(parsed.args)) fields[key] = coerceField(raw);
  const book = String(fields.book ?? fields.name ?? '').trim();
  const key = fields.key ?? fields.keys ?? '';
  const content = String(fields.content ?? parsed.text ?? '');
  delete fields.content;
  return { book, key, content, fields };
}

function coerceField(value: ScopeValue): unknown {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (/^(true|false)$/iu.test(trimmed)) return trimmed.toLowerCase() === 'true';
  if (/^-?\d+(?:\.\d+)?$/u.test(trimmed)) return Number(trimmed);
  try { return JSON.parse(trimmed) as unknown; } catch { return value; }
}

function parseToggle(value: string): boolean | string {
  const normalized = value.trim().toLowerCase();
  if (['on', 'true', '1', 'yes', 'enable', 'enabled'].includes(normalized)) return true;
  if (['off', 'false', '0', 'no', 'disable', 'disabled'].includes(normalized)) return false;
  return value;
}

function mirrorScriptInject(ctx: STContextDeep, id: string, parsed: { content: string; position: ExtensionPromptTypeValue; depth: number; scan: boolean; role: ExtensionPromptRoleValue }): void {
  const injects = ensureRecord(ctx.chatMetadata as PlainRecord, 'script_injects');
  injects[id] = { value: parsed.content, position: parsed.position, depth: parsed.depth, scan: parsed.scan, role: parsed.role };
}

function removeMirroredScriptInject(ctx: STContextDeep, id: string): void {
  const injects = asRecord((ctx.chatMetadata as PlainRecord).script_injects);
  if (injects) delete injects[id];
}

function setWorldBookEnabled(ctx: STContextDeep, name: string, enabled: boolean): void {
  const metadata = ctx.chatMetadata as PlainRecord;
  const state = ensureRecord(metadata, WORLD_INFO_METADATA_KEY);
  const enabledBooks = ensureRecord(state, 'enabled_books');
  enabledBooks[name] = enabled;
  metadata[WORLD_INFO_COMPAT_KEY] = enabledBooks;
}

function ensureRecord(target: PlainRecord, key: string): PlainRecord {
  const existing = asRecord(target[key]);
  if (existing) return existing;
  const created: PlainRecord = {};
  target[key] = created;
  return created;
}

function asRecord(value: unknown): PlainRecord | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as PlainRecord : undefined;
}

function preview(value: string): string {
  const compact = value.replace(/\s+/gu, ' ').trim();
  return compact.length > 60 ? `${compact.slice(0, 57)}...` : compact;
}

function unquote(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length >= 2 && ((trimmed[0] === '"' && trimmed.at(-1) === '"') || (trimmed[0] === "'" && trimmed.at(-1) === "'"))) return trimmed.slice(1, -1);
  return trimmed;
}

function descriptor(value: PlainRecord): string {
  return JSON.stringify(value);
}
