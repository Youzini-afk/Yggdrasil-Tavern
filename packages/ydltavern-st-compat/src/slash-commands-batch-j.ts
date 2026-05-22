// Batch J: character/group/persona/tags extras.
// Aligns with ST canonical registrations in SillyTavern/public/scripts/slash-commands.js:1045-2067,
// tags.js:2347-2521, and personas.js:2557-2864.

import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { namedString, registerIfMissing, registerPlanOnly, textValue, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

type MutableRecord = Record<string, unknown>;

interface PersonaCapableContext extends STContextDeep {
  power_user?: { personas?: unknown };
  user_avatar?: string;
  createPersona?: (fields: MutableRecord) => Promise<unknown> | unknown;
}

interface MemberMatch {
  readonly memberIndex: number;
  readonly characterIndex: number;
  readonly key: string;
  readonly name: string;
  readonly entry: unknown;
}

export function registerBatchJ(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as PersonaCapableContext;

  registerIfMissing(registry, {
    name: 'char-get',
    aliases: ['char-data'],
    helpString: 'Get character data by name or id. Optional field= extracts a single field.',
    callback: (args, value) => {
      // ST source: slash-commands.js:1045-1109 registers /char-get; callback returns full data or a field.
      const nameArg = firstText(args, value, ['name', 'char']).trim();
      const idArg = args.id !== undefined ? String(args.id).trim() : '';
      const field = namedString(args, 'field')?.trim();
      const target = idArg ? findCharacterById(ctx, idArg) : nameArg ? findCharacter(ctx, nameArg) : currentCharacter(ctx);
      if (!target) throw new Error('char-get: character not found');
      if (field) return String(target[field] ?? '');
      return JSON.stringify(target, null, 2);
    },
    returns: 'character JSON or field value',
  });

  registerPlanOnly(registry, {
    name: 'rename-char',
    action: 'rename_character',
    fields: ['old', 'new', 'silent', 'chats'],
    helpString: 'Plan-only: rename character asset; host-managed file mutation required.',
  });

  registerIfMissing(registry, {
    name: 'member-get',
    aliases: ['getmember', 'memberget'],
    callback: (args, value) => {
      // ST source: slash-commands.js:1881-1930; st-compat returns a JSON descriptor by default.
      const group = requireActiveGroup(ctx, 'member-get');
      const match = requireMember(ctx, group, requiredName(args, value, 'member-get'));
      const descriptor = memberJsonDescriptor(ctx, match);
      const field = namedString(args, 'field')?.trim();
      if (field) return String(descriptor[field] ?? '');
      return JSON.stringify(descriptor);
    },
    returns: 'group member descriptor as JSON',
  });

  registerIfMissing(registry, {
    name: 'member-up',
    aliases: ['upmember', 'memberup'],
    callback: (args, value) => {
      // ST source: slash-commands.js:2012-2025; callback reorders the active group member list.
      return moveMember(ctx, 'member-up', requiredName(args, value, 'member-up'), -1);
    },
    returns: 'moved member name',
  });

  registerIfMissing(registry, {
    name: 'member-down',
    aliases: ['downmember', 'memberdown'],
    callback: (args, value) => {
      // ST source: slash-commands.js:2026-2039; callback reorders the active group member list.
      return moveMember(ctx, 'member-down', requiredName(args, value, 'member-down'), 1);
    },
    returns: 'moved member name',
  });

  registerPlanOnly(registry, {
    name: 'member-peek',
    aliases: ['peek', 'memberpeek', 'peekmember'],
    action: 'member_peek',
    fields: ['name', 'field'],
    helpString: 'Plan-only: previewing a member card/draft requires host UI or generation runtime.',
  });

  registerIfMissing(registry, {
    name: 'member-count',
    aliases: ['countmember', 'membercount'],
    callback: () => {
      // ST source: slash-commands.js:2067-2072.
      const group = requireActiveGroup(ctx, 'member-count');
      return String(groupMembers(group).length);
    },
    returns: 'number of group members',
  });

  registerIfMissing(registry, {
    name: 'tag-add',
    callback: (args, value) => {
      // ST source: tags.js:2347-2393. st-compat mutates the loaded character object's tags array only.
      const character = requireCharacterForTag(ctx, args, value, 'tag-add');
      const tag = requiredTag(args, value, 'tag-add');
      const tags = characterTags(character);
      if (!tags.includes(tag)) tags.push(tag);
      return tag;
    },
    returns: 'added tag name',
  });

  registerIfMissing(registry, {
    name: 'tag-remove',
    callback: (args, value) => {
      // ST source: tags.js:2394-2439. st-compat mutates the loaded character object's tags array only.
      const character = requireCharacterForTag(ctx, args, value, 'tag-remove');
      const tag = requiredTag(args, value, 'tag-remove');
      const tags = characterTags(character);
      const index = tags.indexOf(tag);
      if (index !== -1) tags.splice(index, 1);
      return tag;
    },
    returns: 'removed tag name',
  });

  registerIfMissing(registry, {
    name: 'tag-exists',
    callback: (args, value) => {
      // ST source: tags.js:2440-2483.
      const character = requireCharacterForTag(ctx, args, value, 'tag-exists');
      const tag = requiredTag(args, value, 'tag-exists');
      return String(characterTags(character).includes(tag));
    },
    returns: 'true or false',
  });

  registerIfMissing(registry, {
    name: 'tag-list',
    callback: (args, value) => {
      // ST source: tags.js:2484-2519.
      const character = requireCharacterForTag(ctx, args, value, 'tag-list');
      return characterTags(character).join(', ');
    },
    returns: 'comma-separated tags',
  });

  registerPlanOnly(registry, {
    name: 'tag-import',
    action: 'tag_import',
    fields: ['file', 'name', 'mode'],
    helpString: 'Plan-only: importing tags from cards/files requires host-managed asset parsing.',
  });

  registerIfMissing(registry, {
    name: 'persona-create',
    callback: async (args) => {
      // ST source: personas.js:2557-2600. Host may expose createPersona; otherwise return a plan.
      const fields = { ...args } as MutableRecord;
      const name = String(fields.name ?? '').trim();
      if (!name) throw new Error('persona-create requires name');
      if (ctx.createPersona) {
        const created = await ctx.createPersona(fields);
        if (typeof created === 'string') {
          if (isTruthy(fields.select, true)) ctx.user_avatar = created;
          return created;
        }
        return stringify(created);
      }
      return JSON.stringify({ planned: true, action: 'create_persona', fields });
    },
    returns: 'created persona id or plan descriptor JSON',
  });

  registerIfMissing(registry, {
    name: 'persona-get',
    aliases: ['persona-data'],
    callback: (args) => {
      // ST source: personas.js:2637-2694.
      const idArg = String(args.id ?? args.persona ?? args.name ?? '').trim();
      const persona = findPersona(ctx, idArg);
      if (!persona) throw new Error('persona-get: persona not found');
      const field = namedString(args, 'field')?.trim();
      if (field) return String(persona.data[field] ?? '');
      return JSON.stringify(persona.data, null, 2);
    },
    returns: 'persona JSON or field value',
  });

  registerIfMissing(registry, {
    name: 'persona-set',
    aliases: ['persona', 'name'],
    callback: (args, value) => {
      // ST source: personas.js:2822-2862; supports lookup, temp, and all modes.
      const nameArg = String(textValue(value) || args.name || args.persona || '').trim();
      if (!nameArg) throw new Error('persona-set requires a name');
      const mode = String(args.mode ?? 'all').toLowerCase();
      const persona = mode === 'temp' ? undefined : findPersona(ctx, nameArg);
      if (!persona && mode === 'lookup') throw new Error(`persona-set: persona '${nameArg}' not found`);
      if (persona) {
        ctx.user_avatar = persona.id;
        ctx.name1 = String(persona.data.name ?? nameArg);
        ctx.chatMetadata.persona_name = ctx.name1;
        ctx.chatMetadata.user_avatar = persona.id;
        return ctx.name1;
      }
      ctx.name1 = nameArg;
      ctx.chatMetadata.persona_name = nameArg;
      return nameArg;
    },
    returns: 'active persona name',
  });

  registerPlanOnly(registry, {
    name: 'persona-lock',
    aliases: ['lock', 'bind'],
    action: 'persona_lock',
    fields: ['type', 'state', 'value'],
    helpString: 'Plan-only: locking personas requires host-managed persona connection persistence.',
  });

  registerPlanOnly(registry, {
    name: 'persona-sync',
    aliases: ['sync'],
    action: 'persona_sync',
    fields: ['from', 'quiet', 'range'],
    helpString: 'Plan-only: syncing persona data into chat messages requires host-managed message rewrite.',
  });
}

function characters(ctx: STContextDeep): MutableRecord[] {
  return ctx.characters as unknown as MutableRecord[];
}

function findCharacter(ctx: STContextDeep, query: string): MutableRecord | undefined {
  const wanted = normalize(query);
  return characters(ctx).find((character) => {
    const name = normalize(stringField(character, 'name'));
    const avatar = stringField(character, 'avatar');
    const avatarNorm = normalize(avatar);
    const avatarWithoutExt = avatar.endsWith('.png') ? avatarNorm.slice(0, -4) : avatarNorm;
    return name === wanted || avatarNorm === wanted || avatarWithoutExt === wanted;
  });
}

function findCharacterById(ctx: STContextDeep, id: string): MutableRecord | undefined {
  const index = Number(id);
  if (Number.isInteger(index) && index >= 0 && characters(ctx)[index]) return characters(ctx)[index];
  return characters(ctx).find((character) => String(character.id ?? '') === id || stringField(character, 'avatar') === id);
}

function currentCharacter(ctx: STContextDeep): MutableRecord | undefined {
  if (ctx.characterId === undefined || ctx.characterId === null || String(ctx.characterId) === '') return undefined;
  return findCharacterById(ctx, String(ctx.characterId));
}

function groups(ctx: STContextDeep): MutableRecord[] {
  return ctx.groups as unknown as MutableRecord[];
}

function requireActiveGroup(ctx: STContextDeep, command: string): MutableRecord {
  if (ctx.groupId === undefined || ctx.groupId === null || String(ctx.groupId) === '') throw new Error(`${command}: no active group`);
  const groupId = String(ctx.groupId);
  const byId = groups(ctx).find((group) => String(group.id ?? '') === groupId);
  if (byId) return byId;
  const index = Number(ctx.groupId);
  if (Number.isInteger(index) && groups(ctx)[index]) return groups(ctx)[index]!;
  if (Array.isArray(ctx.chatMetadata.members) || Array.isArray(ctx.chatMetadata.groupMembers) || Array.isArray(ctx.chatMetadata.group_order)) return ctx.chatMetadata as MutableRecord;
  throw new Error(`${command}: active group not found`);
}

function groupMembers(group: MutableRecord): unknown[] {
  const existing = Array.isArray(group.members) ? group.members : Array.isArray(group.groupMembers) ? group.groupMembers : Array.isArray(group.group_order) ? group.group_order : undefined;
  if (existing) return existing;
  const created: unknown[] = [];
  group.members = created;
  return created;
}

function requireMember(ctx: STContextDeep, group: MutableRecord, query: string): MemberMatch {
  const match = findMember(ctx, group, query);
  if (!match) throw new Error(`group member not found: ${query}`);
  return match;
}

function findMember(ctx: STContextDeep, group: MutableRecord, query: string): MemberMatch | undefined {
  const members = groupMembers(group);
  const numeric = Number(query);
  if (Number.isInteger(numeric) && numeric >= 0 && numeric < members.length) return describeMember(ctx, numeric, members[numeric]);
  const wanted = normalize(query);
  for (let index = 0; index < members.length; index += 1) {
    const match = describeMember(ctx, index, members[index]);
    if (normalize(match.key) === wanted || normalize(match.name) === wanted) return match;
  }
  return undefined;
}

function describeMember(ctx: STContextDeep, memberIndex: number, entry: unknown): MemberMatch {
  const key = isRecord(entry) ? String(entry.avatar ?? entry.id ?? entry.name ?? '') : String(entry ?? '');
  const characterIndex = characters(ctx).findIndex((character) => stringField(character, 'avatar') === key || normalize(stringField(character, 'name')) === normalize(key));
  const character = characterIndex >= 0 ? characters(ctx)[characterIndex] : undefined;
  const name = isRecord(entry) ? String(entry.name ?? character?.name ?? key) : String(character?.name ?? key);
  return { memberIndex, characterIndex, key, name, entry };
}

function memberJsonDescriptor(ctx: STContextDeep, match: MemberMatch): MutableRecord {
  return {
    name: match.name,
    index: match.memberIndex,
    id: match.characterIndex,
    avatar: match.key,
    key: match.key,
    disabled: isRecord(match.entry) ? match.entry.disabled === true : false,
  };
}

function moveMember(ctx: STContextDeep, command: string, query: string, delta: -1 | 1): string {
  const group = requireActiveGroup(ctx, command);
  const members = groupMembers(group);
  const match = requireMember(ctx, group, query);
  const nextIndex = match.memberIndex + delta;
  if (nextIndex < 0 || nextIndex >= members.length) return match.name;
  const [entry] = members.splice(match.memberIndex, 1);
  members.splice(nextIndex, 0, entry);
  reorderChatMetadataGroupOrder(ctx, match, delta);
  return match.name;
}

function reorderChatMetadataGroupOrder(ctx: STContextDeep, match: MemberMatch, delta: -1 | 1): void {
  const order = ctx.chatMetadata.group_order;
  if (!Array.isArray(order)) return;
  const index = order.findIndex((entry) => normalize(memberOrderKey(entry)) === normalize(match.key) || normalize(memberOrderKey(entry)) === normalize(match.name));
  const nextIndex = index + delta;
  if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
  const [entry] = order.splice(index, 1);
  order.splice(nextIndex, 0, entry);
}

function memberOrderKey(entry: unknown): string {
  return isRecord(entry) ? String(entry.avatar ?? entry.id ?? entry.name ?? '') : String(entry ?? '');
}

function requireCharacterForTag(ctx: STContextDeep, args: Record<string, ScopeValue>, value: ScopeValue, command: string): MutableRecord {
  const charName = String(args.name ?? args.char ?? '').trim();
  if (!charName) throw new Error(`${command} requires character name`);
  const character = findCharacter(ctx, charName);
  if (!character) throw new Error(`${command}: character '${charName}' not found`);
  void value;
  return character;
}

function characterTags(character: MutableRecord): string[] {
  // STContextDeep exposes characters as readonly for host safety, but ST's loaded runtime mutates
  // character tag state in place. Cast through the record and keep mutation scoped to `tags`.
  if (Array.isArray(character.tags)) return character.tags as string[];
  const tags: string[] = [];
  character.tags = tags;
  return tags;
}

function requiredTag(args: Record<string, ScopeValue>, value: ScopeValue, command: string): string {
  const tag = String(args.tag ?? textValue(value)).trim();
  if (!tag) throw new Error(`${command} requires tag`);
  return tag;
}

function personaEntries(ctx: PersonaCapableContext): Array<{ id: string; data: MutableRecord }> {
  const raw = ctx.power_user?.personas ?? ctx.powerUserSettings.personas;
  if (Array.isArray(raw)) {
    return raw.filter(isRecord).map((entry, index) => personaData(String(entry.id ?? entry.avatar ?? index), entry));
  }
  if (!isRecord(raw)) return [];
  return Object.entries(raw).map(([id, value]) => {
    if (isRecord(value)) return personaData(id, value);
    return personaData(id, { name: String(value ?? ''), avatar: id });
  });
}

function personaData(id: string, value: MutableRecord): { id: string; data: MutableRecord } {
  return { id, data: { avatar: String(value.avatar ?? id), id, ...value, name: String(value.name ?? value.title ?? id) } };
}

function findPersona(ctx: PersonaCapableContext, query: string): { id: string; data: MutableRecord } | undefined {
  const personas = personaEntries(ctx);
  const target = query || ctx.user_avatar || '';
  if (!target && personas.length === 1) return personas[0];
  const wanted = normalize(target);
  return personas.find((persona) => normalize(persona.id) === wanted || normalize(String(persona.data.avatar ?? '')) === wanted || normalize(String(persona.data.name ?? '')) === wanted);
}

function firstText(args: Record<string, ScopeValue>, value: ScopeValue, names: readonly string[]): string {
  for (const name of names) {
    const found = namedString(args, name);
    if (found !== undefined) return found;
  }
  return stripLeadingNamedArgs(textValue(value), names);
}

function stripLeadingNamedArgs(value: string, names: readonly string[]): string {
  let text = value.trimStart();
  const nameSet = new Set(names);
  while (text.length > 0) {
    const match = text.match(/^([A-Za-z_][A-Za-z0-9_-]*)=/u);
    if (!match) break;
    const key = match[1] ?? '';
    if (!nameSet.has(key)) break;
    const parsed = readArgValue(text, key.length + 1);
    text = text.slice(parsed.consumed).trimStart();
  }
  return text.trim();
}

function readArgValue(input: string, start: number): { consumed: number } {
  const quote = input[start];
  if (quote === '"' || quote === "'") {
    let index = start + 1;
    while (index < input.length) {
      const char = input[index] ?? '';
      if (char === '\\') {
        index += 2;
        continue;
      }
      if (char === quote) return { consumed: index + 1 };
      index += 1;
    }
    return { consumed: input.length };
  }
  const nextSpace = input.slice(start).search(/\s/u);
  return { consumed: nextSpace === -1 ? input.length : start + nextSpace };
}

function requiredName(args: Record<string, ScopeValue>, value: ScopeValue, command: string): string {
  const name = firstText(args, value, ['name']).trim();
  if (!name) throw new Error(`${command} requires name`);
  return name;
}

function isTruthy(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null || value === '') return defaultValue;
  const normalized = String(value).trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'on' || normalized === 'yes';
}

function stringify(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function stringField(record: MutableRecord, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function isRecord(value: unknown): value is MutableRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
