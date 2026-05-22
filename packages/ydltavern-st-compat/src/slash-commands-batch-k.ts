// Batch K: world-info / lorebook commands.
// Aligns with ST canonical registrations in SillyTavern/public/scripts/world-info.js:1616-2008.

import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { registerIfMissing, registerPlanOnly, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type PlainRecord = Record<string, unknown>;

interface WorldBookEntry extends PlainRecord {
  uid?: string | number;
  keys?: unknown;
  key?: unknown;
}

interface WorldBook extends PlainRecord {
  entries?: Record<string, WorldBookEntry> | WorldBookEntry[];
}

export function registerBatchK(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;
  const compat = ctx as STContextDeep & PlainRecord;

  registerIfMissing(registry, {
    name: 'world',
    helpString: 'Set the active world book by name.',
    callback: async (args, value) => {
      // ST source: world-info.js:1616-1640 registers /world; full ST toggles selected global worlds.
      // st-compat records the active chat world book in metadata for host/worldbook runtime handoff.
      const name = String(args._unnamed ?? args.name ?? value ?? '').trim();
      const metadata = ctx.chatMetadata as PlainRecord;
      if (!name) return String(metadata.world_info ?? compat.world_info_active ?? '');
      metadata.world_info = name;
      compat.world_info_active = name;
      ctx.saveMetadataDebounced();
      return name;
    },
    returns: 'world book name',
  });

  registerIfMissing(registry, {
    name: 'getchatbook',
    aliases: ['getchatlore', 'getchatwi'],
    helpString: 'Get current chat-bound world book name.',
    callback: async () => {
      // ST source: world-info.js:1641-1665.
      return String((ctx.chatMetadata as PlainRecord).world_info ?? '');
    },
    returns: 'lorebook name',
  });

  registerIfMissing(registry, {
    name: 'getglobalbooks',
    aliases: ['getgloballore', 'getglobalwi'],
    helpString: 'Get active global world book names (comma-separated).',
    callback: async () => {
      // ST source: world-info.js:1666-1672.
      const powerUser = getPowerUser(ctx);
      const books = powerUser.world_info_active_books;
      return Array.isArray(books) ? books.map((book) => String(book)).join(', ') : '';
    },
    returns: 'list of selected lorebook names',
  });

  registerIfMissing(registry, {
    name: 'getpersonabook',
    aliases: ['getpersonalore', 'getpersonawi'],
    helpString: 'Get persona-bound world book name.',
    callback: async () => {
      // ST source: world-info.js:1673-1698.
      const powerUser = getPowerUser(ctx);
      const personas = asRecord(powerUser.persona_descriptions);
      const userAvatar = stringValue(compat.user_avatar);
      if (!personas || !userAvatar) return '';
      const persona = asRecord(personas[userAvatar]);
      return String(persona?.lorebook ?? '');
    },
    returns: 'lorebook name',
  });

  registerIfMissing(registry, {
    name: 'getcharbook',
    aliases: ['getcharlore', 'getcharwi'],
    helpString: 'Get character-bound world book name.',
    callback: async (args, value) => {
      // ST source: world-info.js:1699-1738.
      const charName = String(args.name ?? value ?? '').trim();
      const characters = ctx.characters as Array<PlainRecord>;
      let target: PlainRecord | undefined;
      if (charName) {
        target = characters.find((character) => matchesCharacter(character, charName));
      } else if (ctx.characterId !== undefined) {
        target = characters[Number(ctx.characterId)];
      }
      if (!target) return '';
      const data = asRecord(target.data);
      return String(data?.character_book ?? target.character_book ?? '');
    },
    returns: 'lorebook name',
  });

  registerIfMissing(registry, {
    name: 'findentry',
    aliases: ['findlore', 'findwi'],
    helpString: 'Find world book entry UID by key. Returns UID or empty.',
    callback: async (args, value) => {
      // ST source: world-info.js:1740-1779.
      const parsed = parseKnownArgs(args, value, ['book', 'file', 'key']);
      const bookName = String(parsed.args.book ?? parsed.args.file ?? '').trim();
      const key = String(parsed.args.key ?? parsed.args._unnamed ?? parsed.text).trim();
      if (!bookName) throw new Error('findentry requires book=NAME');
      if (!key) throw new Error('findentry requires key=KEY');
      const book = getWorldBook(ctx, bookName);
      if (!book?.entries) return '';
      for (const [uid, entry] of entriesOf(book.entries)) {
        if (entryKeys(entry).some((entryKey) => entryKey.toLowerCase() === key.toLowerCase())) return uid;
      }
      return '';
    },
    returns: 'UID',
  });

  registerIfMissing(registry, {
    name: 'getentryfield',
    aliases: ['getlorefield', 'getwifield'],
    helpString: 'Get entry field value. Required: book, uid, field.',
    callback: async (args, value) => {
      // ST source: world-info.js:1780-1822.
      const parsed = parseKnownArgs(args, value, ['book', 'file', 'uid', 'field']);
      const bookName = String(parsed.args.book ?? parsed.args.file ?? '').trim();
      const uid = String(parsed.args.uid ?? parsed.args._unnamed ?? parsed.text).trim();
      const field = String(parsed.args.field ?? '').trim();
      if (!bookName || !uid || !field) throw new Error('getentryfield requires book, uid, field');
      const entry = getWorldBookEntry(ctx, bookName, uid);
      if (!entry) return '';
      return stringifyField(entry[field]);
    },
    returns: 'field value',
  });

  // ST source: world-info.js:1823-1904 mutates worldbook entries via backend world-info runtime.
  registerPlanOnly(registry, {
    name: 'createentry',
    aliases: ['createlore', 'createwi'],
    action: 'world_info.entry.create',
    fields: ['book', 'key', 'content', 'position', 'depth', 'order'],
  });

  registerPlanOnly(registry, {
    name: 'setentryfield',
    aliases: ['setlorefield', 'setwifield'],
    action: 'world_info.entry.update',
    fields: ['book', 'uid', 'field', 'value'],
  });

  // ST source: world-info.js:1905-2008 applies timed effects to active chat state.
  registerPlanOnly(registry, {
    name: 'wi-set-timed-effect',
    action: 'world_info.timed_effect.set',
    fields: ['uid', 'effect', 'duration'],
  });

  registerPlanOnly(registry, {
    name: 'wi-get-timed-effect',
    action: 'world_info.timed_effect.get',
    fields: ['uid'],
  });
}

function getPowerUser(ctx: STContextDeep): PlainRecord {
  const compat = ctx as STContextDeep & PlainRecord;
  return asRecord(compat.power_user) ?? ctx.powerUserSettings as PlainRecord;
}

function getWorldBooks(ctx: STContextDeep): Record<string, WorldBook> {
  const powerUser = getPowerUser(ctx);
  const powerUserBooks = asWorldBooks(powerUser.world_info_books);
  if (powerUserBooks) return powerUserBooks;
  const metadata = ctx.chatMetadata as PlainRecord;
  return asWorldBooks(metadata.ydltavern_worldbooks) ?? {};
}

function getWorldBook(ctx: STContextDeep, name: string): WorldBook | undefined {
  return getWorldBooks(ctx)[name];
}

function getWorldBookEntry(ctx: STContextDeep, bookName: string, uid: string): WorldBookEntry | undefined {
  const entries = getWorldBook(ctx, bookName)?.entries;
  if (!entries) return undefined;
  if (Array.isArray(entries)) {
    return entries.find((entry, index) => String(entry.uid ?? index) === uid);
  }
  return entries[uid];
}

function entriesOf(entries: Record<string, WorldBookEntry> | WorldBookEntry[]): Array<[string, WorldBookEntry]> {
  if (Array.isArray(entries)) return entries.map((entry, index) => [String(entry.uid ?? index), entry]);
  return Object.entries(entries).map(([uid, entry]) => [String(entry.uid ?? uid), entry]);
}

function entryKeys(entry: WorldBookEntry): string[] {
  if (Array.isArray(entry.keys)) return entry.keys.map((key) => String(key));
  if (Array.isArray(entry.key)) return entry.key.map((key) => String(key));
  if (entry.key !== undefined) return [String(entry.key)];
  return [];
}

function parseKnownArgs(args: Record<string, ScopeValue>, value: ScopeValue, known: readonly string[]): { args: Record<string, ScopeValue>; text: string } {
  const parsedArgs: Record<string, ScopeValue> = { ...args };
  let text = stringValue(value);
  const knownSet = new Set(known);
  while (text.length > 0) {
    const match = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)=/u);
    if (!match) break;
    const key = match[1] ?? '';
    if (!knownSet.has(key)) break;
    const parsed = readArgValue(text, key.length + 1);
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
      if (char === '\\') {
        value += input[index + 1] ?? '';
        index += 2;
        continue;
      }
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

function matchesCharacter(character: PlainRecord, name: string): boolean {
  const normalized = name.toLowerCase();
  return [character.name, character.avatar, character.avatarKey]
    .some((candidate) => String(candidate ?? '').toLowerCase() === normalized);
}

function asWorldBooks(value: unknown): Record<string, WorldBook> | undefined {
  return asRecord(value) as Record<string, WorldBook> | undefined;
}

function asRecord(value: unknown): PlainRecord | undefined {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as PlainRecord : undefined;
}

function stringValue(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim();
}

function stringifyField(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
