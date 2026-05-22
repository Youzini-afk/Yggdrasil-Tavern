import type { STContextDeep } from './context-st.js';
import type { ScopeValue } from './stscript-st.js';
import { namedString, registerIfMissing, SlashCommandUnsupportedError, textValue, type BatchSlashOptions, type BatchSlashRegistry } from './slash-commands-common.js';

/*
 * Batch D intentionally performs small in-memory mutations against ST-compatible
 * character/group collections that are declared readonly on STContextDeep. This
 * mirrors SillyTavern's loaded-runtime behavior (for example, char updates build
 * data from `characters[...]`; ST source: public/scripts/slash-commands.js:5286-5444),
 * but remains plan-only for host-managed asset operations: no files are written,
 * no character/group assets are created, and destructive character deletion is
 * rejected explicitly.
 */

type MutableRecord = Record<string, unknown>;

const CHARACTER_FIELDS = new Set(['name', 'description', 'personality', 'scenario', 'first_mes', 'mes_example', 'creator_notes', 'tags']);
const TARGET_ARGS = new Set(['char', 'target']);

export function registerBatchD(registry: BatchSlashRegistry, options: BatchSlashOptions): void {
  const ctx = options.ctx as unknown as STContextDeep;

  registerIfMissing(registry, {
    name: 'char-find',
    aliases: ['findchar'],
    callback: (args, value) => {
      // ST source: slash-commands.js:707-769; findChar tag filtering is in utils.js:2708-2752.
      const name = requiredName(args, value, 'character name');
      const tags = parseList(namedString(args, 'tag'));
      const character = findCharacter(ctx, name, tags);
      return character ? JSON.stringify(character) : '';
    },
    returns: 'matching character descriptor as JSON',
  });

  registerIfMissing(registry, {
    name: 'char-update',
    callback: (args, value) => {
      // ST source: slash-commands.js:955-998 registers /char-update; update callback maps fields at 5286-5444.
      const updates = characterUpdates(args);
      if (Object.keys(updates).length === 0) throw new Error('char-update requires at least one supported field to update');
      const targetName = targetCharacterName(args, value);
      const character = findCharacter(ctx, targetName);
      if (!character) throw new Error(`character not found: ${targetName}`);
      for (const [field, fieldValue] of Object.entries(updates)) setCharacterField(character, field, fieldValue);
      return JSON.stringify({ planned: true, action: 'update', name: targetName, fields: updates });
    },
    returns: 'plan-only update descriptor as JSON',
  });

  registerIfMissing(registry, {
    name: 'char-create',
    callback: (args, value) => {
      // ST source: slash-commands.js:908-953 registers /char-create. st-compat plans only; host writes assets.
      const fields = planCharacterFields(args);
      const name = String(fields.name ?? textValue(value).trim()).trim();
      if (!name) throw new Error('char-create requires name');
      delete fields.name;
      return JSON.stringify({ planned: true, action: 'create', name, fields });
    },
    returns: 'plan-only character creation descriptor as JSON',
  });

  registerIfMissing(registry, {
    name: 'char-delete',
    helpString: 'Unsupported: destructive char delete must go through host-managed asset capability',
    callback: async () => {
      // ST source: slash-commands.js:1111-1160 registers destructive /char-delete; st-compat refuses it.
      throw new SlashCommandUnsupportedError('char-delete is unsupported by st-compat (destructive op)');
    },
  });

  registerIfMissing(registry, {
    name: 'member-add',
    aliases: ['addmember', 'memberadd'],
    callback: (args, value) => {
      // ST source: slash-commands.js:1960-1984 registers /member-add; callback mutates group.members at 4947-4983.
      const group = requireActiveGroup(ctx, 'member-add');
      const name = requiredName(args, value, 'member name');
      const character = findCharacter(ctx, name);
      if (!character) throw new Error(`character not found: ${name}`);
      const members = groupMembers(group);
      const descriptor = memberDescriptor(character, name, members);
      if (!findMember(ctx, group, name) && !findMember(ctx, group, descriptor.key)) members.push(descriptor.entry);
      return descriptor.name;
    },
  });

  registerIfMissing(registry, {
    name: 'member-remove',
    aliases: ['removemember', 'memberremove'],
    callback: (args, value) => {
      // ST source: slash-commands.js:1986-2011 registers /member-remove; callback delegates at 4930-4944.
      const group = requireActiveGroup(ctx, 'member-remove');
      const name = requiredName(args, value, 'member name');
      const match = requireMember(ctx, group, name);
      groupMembers(group).splice(match.memberIndex, 1);
      removeDisabledReference(group, match.key);
      return match.name;
    },
  });

  registerIfMissing(registry, {
    name: 'member-disable',
    aliases: ['disable', 'disablemember', 'memberdisable'],
    callback: (args, value) => {
      // ST source: slash-commands.js:1932-1944 registers /member-disable; callback delegates at 4831-4845.
      const group = requireActiveGroup(ctx, 'member-disable');
      const match = requireMember(ctx, group, requiredName(args, value, 'member name'));
      setMemberDisabled(group, match, true);
      return match.name;
    },
  });

  registerIfMissing(registry, {
    name: 'member-enable',
    aliases: ['enable', 'enablemember', 'memberenable'],
    callback: (args, value) => {
      // ST source: slash-commands.js:1946-1958 registers /member-enable; callback delegates at 4848-4862.
      const group = requireActiveGroup(ctx, 'member-enable');
      const match = requireMember(ctx, group, requiredName(args, value, 'member name'));
      setMemberDisabled(group, match, false);
      return match.name;
    },
  });

  registerIfMissing(registry, {
    name: 'group-create',
    callback: (args, value) => {
      const name = requiredName(args, value, 'group name');
      const members = parseList(namedString(args, 'members'));
      return JSON.stringify({ planned: true, action: 'create_group', name, members });
    },
    returns: 'plan-only group creation descriptor as JSON',
  });

  registerIfMissing(registry, {
    name: 'trigger',
    aliases: ['go'],
    callback: (args, value) => {
      // ST source: slash-commands.js:1805-1833 registers /trigger; group generation emits GROUP_MEMBER_DRAFTED at group-chats.js:1059.
      const group = requireActiveGroup(ctx, 'trigger');
      const requested = optionalName(args, value);
      const match = requested ? requireMember(ctx, group, requested) : nextRotatingMember(ctx, group);
      ctx.eventSource.emit(ctx.eventTypes.GROUP_MEMBER_DRAFTED, match.name, { index: match.memberIndex, key: match.key, characterIndex: match.characterIndex });
      return match.name;
    },
    returns: 'drafted group member name',
  });
}

function characters(ctx: STContextDeep): MutableRecord[] {
  return ctx.characters as MutableRecord[];
}

function findCharacter(ctx: STContextDeep, name: string, tags: readonly string[] = []): MutableRecord | undefined {
  const wanted = normalize(name);
  return characters(ctx).find((character) => {
    const charName = normalize(stringField(character, 'name'));
    const avatar = stringField(character, 'avatar');
    const avatarNorm = normalize(avatar);
    const avatarPngNorm = avatar.endsWith('.png') ? avatarNorm.slice(0, -4) : avatarNorm;
    if (wanted && charName !== wanted && avatarNorm !== wanted && avatarPngNorm !== wanted) return false;
    if (tags.length === 0) return true;
    const charTags = tagsForCharacter(ctx, character).map(normalize);
    return tags.every((tag) => charTags.includes(normalize(tag)));
  });
}

function stringField(record: MutableRecord, key: string): string {
  const value = record[key];
  return typeof value === 'string' ? value : '';
}

function tagsForCharacter(ctx: STContextDeep, character: MutableRecord): string[] {
  const direct = normalizeTags(character.tags);
  const data = isRecord(character.data) ? normalizeTags(character.data.tags) : [];
  const extensions = isRecord(character.extensions) ? normalizeTags(character.extensions.tags) : [];
  const dataExtensions = isRecord(character.data) && isRecord(character.data.extensions) ? normalizeTags(character.data.extensions.tags) : [];
  const tagMapTags = normalizeTags(ctx.tagMap[stringField(character, 'avatar')] ?? ctx.tagMap[stringField(character, 'name')]);
  return [...direct, ...data, ...extensions, ...dataExtensions, ...tagMapTags];
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => typeof item === 'string' ? item : isRecord(item) ? String(item.name ?? item.id ?? '') : String(item)).filter(Boolean);
  if (typeof value === 'string') return parseList(value);
  if (isRecord(value)) return Object.values(value).flatMap(normalizeTags);
  return [];
}

function targetCharacterName(args: Record<string, ScopeValue>, value: ScopeValue): string {
  const explicit = namedString(args, 'char') ?? namedString(args, 'target');
  if (explicit?.trim()) return explicit.trim();
  const name = namedString(args, 'name');
  if (name?.trim()) return name.trim();
  const raw = textValue(value).trim();
  if (raw) return raw.split(/\s+/u)[0] ?? raw;
  throw new Error('char-update requires name');
}

function characterUpdates(args: Record<string, ScopeValue>): MutableRecord {
  const updates: MutableRecord = {};
  for (const [key, value] of Object.entries(args)) {
    if (TARGET_ARGS.has(key)) continue;
    if (key === 'name' && !args.char && !args.target) continue;
    if (!CHARACTER_FIELDS.has(key)) throw new Error(`unsupported character field: ${key}`);
    updates[key] = key === 'tags' ? parseList(value) : value;
  }
  return updates;
}

function planCharacterFields(args: Record<string, ScopeValue>): MutableRecord {
  const fields: MutableRecord = {};
  for (const [key, value] of Object.entries(args)) {
    if (!CHARACTER_FIELDS.has(key)) throw new Error(`unsupported character field: ${key}`);
    fields[key] = key === 'tags' ? parseList(value) : value;
  }
  return fields;
}

function setCharacterField(character: MutableRecord, field: string, value: unknown): void {
  character[field] = value;
  if (isRecord(character.data)) character.data[field] = value;
}

function groups(ctx: STContextDeep): MutableRecord[] {
  return ctx.groups as MutableRecord[];
}

function requireActiveGroup(ctx: STContextDeep, command: string): MutableRecord {
  if (ctx.groupId === undefined || ctx.groupId === null || String(ctx.groupId) === '') throw new Error(`${command}: no active group`);
  const groupId = String(ctx.groupId);
  const byId = groups(ctx).find((group) => String(group.id ?? '') === groupId);
  if (byId) return byId;
  const index = Number(ctx.groupId);
  if (Number.isInteger(index) && groups(ctx)[index]) return groups(ctx)[index]!;
  if (Array.isArray(ctx.chatMetadata.members) || Array.isArray(ctx.chatMetadata.groupMembers)) return ctx.chatMetadata as MutableRecord;
  throw new Error(`${command}: active group not found`);
}

function groupMembers(group: MutableRecord): unknown[] {
  const existing = Array.isArray(group.members) ? group.members : Array.isArray(group.groupMembers) ? group.groupMembers : undefined;
  if (existing) return existing;
  const created: unknown[] = [];
  group.members = created;
  return created;
}

function memberDescriptor(character: MutableRecord, fallbackName: string, currentMembers: readonly unknown[]): { entry: unknown; key: string; name: string } {
  const name = stringField(character, 'name') || fallbackName;
  const avatar = stringField(character, 'avatar');
  const key = avatar || name;
  const useObjectEntry = currentMembers.some(isRecord);
  return { entry: useObjectEntry ? { name, ...(avatar ? { avatar } : {}) } : key, key, name };
}

interface MemberMatch {
  memberIndex: number;
  characterIndex: number;
  key: string;
  name: string;
  entry: unknown;
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

function setMemberDisabled(group: MutableRecord, match: MemberMatch, disabled: boolean): void {
  if (isRecord(match.entry)) {
    match.entry.disabled = disabled;
    return;
  }
  const disabledMembers = disabledMemberList(group);
  const currentIndex = disabledMembers.indexOf(match.key);
  if (disabled && currentIndex === -1) disabledMembers.push(match.key);
  if (!disabled && currentIndex !== -1) disabledMembers.splice(currentIndex, 1);
}

function disabledMemberList(group: MutableRecord): string[] {
  if (Array.isArray(group.disabled_members)) return group.disabled_members as string[];
  if (Array.isArray(group.disabledMembers)) return group.disabledMembers as string[];
  const list: string[] = [];
  group.disabled_members = list;
  return list;
}

function removeDisabledReference(group: MutableRecord, key: string): void {
  const list = disabledMemberList(group);
  const index = list.indexOf(key);
  if (index !== -1) list.splice(index, 1);
}

function isMemberDisabled(group: MutableRecord, match: MemberMatch): boolean {
  if (isRecord(match.entry) && match.entry.disabled === true) return true;
  return disabledMemberList(group).includes(match.key);
}

function nextRotatingMember(ctx: STContextDeep, group: MutableRecord): MemberMatch {
  const available = groupMembers(group).map((entry, index) => describeMember(ctx, index, entry)).filter((match) => !isMemberDisabled(group, match));
  if (available.length === 0) throw new Error('trigger: no enabled group members');
  const rawIndex = Number(ctx.chatMetadata.groupRotationIndex ?? 0);
  const index = Number.isFinite(rawIndex) ? rawIndex : 0;
  const match = available[index % available.length]!;
  ctx.chatMetadata.groupRotationIndex = (index + 1) % available.length;
  return match;
}

function requiredName(args: Record<string, ScopeValue>, value: ScopeValue, label: string): string {
  const name = optionalName(args, value);
  if (!name) throw new Error(`${label} is required`);
  return name;
}

function optionalName(args: Record<string, ScopeValue>, value: ScopeValue): string {
  return (namedString(args, 'name') ?? textValue(value)).trim();
}

function parseList(value: ScopeValue): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}

function isRecord(value: unknown): value is MutableRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
