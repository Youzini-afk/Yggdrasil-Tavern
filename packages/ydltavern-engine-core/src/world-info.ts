import type { Chat, Turn, TurnRole, TurnVariant } from '@ydltavern/types';

import type { MacroContext, MacroTraceEntry } from './macros.js';
import { substituteMacros } from './macros.js';

export type WorldInfoPosition =
  | 'before'
  | 'after'
  | 'ANTop'
  | 'ANBottom'
  | 'atDepth'
  | 'EMTop'
  | 'EMBottom'
  | 'outlet';
export type WorldInfoLogic = 'AND_ANY' | 'NOT_ALL' | 'NOT_ANY' | 'AND_ALL';
export type WorldInfoBudgetType = 'characters' | 'approxTokens';

export interface WorldInfoEntry {
  readonly uid?: string | number;
  readonly id?: string | number;
  readonly world?: string;
  readonly comment?: string;
  readonly key?: readonly string[];
  readonly keys?: readonly string[];
  readonly keysecondary?: readonly string[];
  readonly secondaryKeys?: readonly string[];
  readonly content: string;
  readonly constant?: boolean;
  readonly selective?: boolean;
  readonly selectiveLogic?: WorldInfoLogic | number;
  readonly logic?: WorldInfoLogic | number;
  readonly order?: number;
  readonly position?: WorldInfoPosition | number | string;
  readonly depth?: number;
  readonly role?: TurnRole | number | string;
  readonly depthRole?: TurnRole | number | string;
  readonly depth_role?: TurnRole | number | string;
  readonly scanDepth?: number;
  readonly scan_depth?: number;
  readonly caseSensitive?: boolean;
  readonly case_sensitive?: boolean;
  readonly matchWholeWords?: boolean;
  readonly match_whole_words?: boolean;
  readonly disable?: boolean;
  readonly disabled?: boolean;
  readonly excludeRecursion?: boolean;
  readonly preventRecursion?: boolean;
  readonly delayUntilRecursion?: boolean;
  readonly ignoreBudget?: boolean;
  readonly outletName?: string;
  readonly outlet_name?: string;
  readonly outlet?: string;
}

export interface WorldInfoBook {
  readonly name?: string;
  readonly entries?: readonly WorldInfoEntry[];
}

export interface WorldInfoBudget {
  readonly max?: number;
  readonly type?: WorldInfoBudgetType;
}

export interface EvaluateWorldInfoInput {
  readonly chat: Chat;
  readonly book?: WorldInfoBook;
  readonly books?: readonly WorldInfoBook[];
  readonly scanData?: string | readonly string[];
  readonly scanDepth?: number;
  readonly recursiveScanDepth?: number;
  readonly budget?: WorldInfoBudget;
  readonly macroContext?: MacroContext;
  readonly authorNote?: string;
  readonly originalAuthorNote?: string;
  readonly author_note?: string;
}

export interface WorldInfoActivatedEntry {
  readonly id: string;
  readonly book?: string;
  readonly comment?: string;
  readonly content: string;
  readonly position: WorldInfoPosition;
  readonly order: number;
  readonly depth?: number;
  readonly role?: TurnRole;
  readonly outletName?: string;
  readonly matchedKeys: readonly string[];
  readonly matchedSecondaryKeys: readonly string[];
  readonly macroTrace: readonly MacroTraceEntry[];
}

export interface WorldInfoRoutedEntry {
  readonly content: string;
  readonly entryId: string;
  readonly order: number;
  readonly source?: string;
  readonly position: WorldInfoPosition;
  readonly depth?: number;
  readonly role?: TurnRole;
  readonly outletName?: string;
}

export interface WorldInfoExampleBucketEntry {
  readonly position: 'before' | 'after';
  readonly content: string;
  readonly entryId: string;
  readonly order: number;
}

export interface WorldInfoDepthBucket {
  readonly depth: number;
  readonly role: TurnRole;
  readonly entries: readonly WorldInfoRoutedEntry[];
  readonly content: readonly string[];
}

export interface WorldInfoOutletBucket {
  readonly entries: readonly WorldInfoRoutedEntry[];
  readonly content: readonly string[];
}

export interface WorldInfoAuthorNotePatch {
  readonly top: readonly string[];
  readonly original?: string;
  readonly bottom: readonly string[];
  readonly patched: string;
}

export interface WorldInfoBuckets {
  readonly before: readonly string[];
  readonly after: readonly string[];
  readonly atDepth: readonly string[];
  readonly ANTop: readonly string[];
  readonly ANBottom: readonly string[];
  readonly EMTop: readonly string[];
  readonly EMBottom: readonly string[];
  readonly outlet: readonly string[];
  readonly examples: readonly WorldInfoExampleBucketEntry[];
  readonly em: readonly WorldInfoExampleBucketEntry[];
  readonly depthEntries: readonly WorldInfoDepthBucket[];
  readonly anTop: readonly string[];
  readonly anBottom: readonly string[];
  readonly anPatch: WorldInfoAuthorNotePatch;
  readonly outlets: Readonly<Record<string, WorldInfoOutletBucket>>;
}

export interface WorldInfoSkippedEntry {
  readonly id: string;
  readonly book?: string;
  readonly reason: string;
}

export interface WorldInfoDiagnostics {
  readonly scanDepth: number;
  readonly scanTextChars: number;
  readonly iterations: number;
  readonly budgetType: WorldInfoBudgetType;
  readonly budgetLimit?: number;
  readonly usedBudget: number;
  readonly warnings: readonly string[];
  readonly unsupported: readonly string[];
  readonly uninserted: readonly string[];
  readonly routingTrace: readonly WorldInfoRoutingTraceEntry[];
}

export interface WorldInfoRoutingTraceEntry {
  readonly entryId: string;
  readonly source?: string;
  readonly position: WorldInfoPosition;
  readonly bucket: string;
  readonly order: number;
  readonly depth?: number;
  readonly role?: TurnRole;
  readonly outletName?: string;
  readonly inserted: boolean;
  readonly note?: string;
}

export interface EvaluateWorldInfoResult {
  readonly activated: readonly WorldInfoActivatedEntry[];
  readonly skipped: readonly WorldInfoSkippedEntry[];
  readonly buckets: WorldInfoBuckets;
  readonly diagnostics: WorldInfoDiagnostics;
}

interface BuildBucketsResult {
  readonly buckets: WorldInfoBuckets;
  readonly routingTrace: readonly WorldInfoRoutingTraceEntry[];
  readonly uninserted: readonly string[];
}

interface CandidateEntry {
  readonly entry: WorldInfoEntry;
  readonly bookName?: string;
  readonly id: string;
  readonly index: number;
}

interface MatchResult {
  readonly activated: boolean;
  readonly reason?: string;
  readonly matchedKeys: readonly string[];
  readonly matchedSecondaryKeys: readonly string[];
}

const POSITION_BY_NUMBER = new Map<number, WorldInfoPosition>([
  [0, 'before'],
  [1, 'after'],
  [2, 'ANTop'],
  [3, 'ANBottom'],
  [4, 'atDepth'],
  [5, 'EMTop'],
  [6, 'EMBottom'],
  [7, 'outlet'],
]);

const LOGIC_BY_NUMBER = new Map<number, WorldInfoLogic>([
  [0, 'AND_ANY'],
  [1, 'NOT_ALL'],
  [2, 'NOT_ANY'],
  [3, 'AND_ALL'],
]);

const POSITION_NAMES = new Set<WorldInfoPosition>([
  'before',
  'after',
  'ANTop',
  'ANBottom',
  'atDepth',
  'EMTop',
  'EMBottom',
  'outlet',
]);

const DEFAULT_AT_DEPTH = 4;

export function evaluateWorldInfo(input: EvaluateWorldInfoInput): EvaluateWorldInfoResult {
  const scanDepth = Math.max(0, input.scanDepth ?? 4);
  const maxIterations = Math.max(1, input.recursiveScanDepth ?? 1);
  const budgetType = input.budget?.type ?? 'characters';
  const budgetLimit = input.budget?.max;
  const warnings: string[] = [];
  const unsupported = [
    'ST token-level budget alignment is approximated, not tokenizer exact.',
    'Sticky/cooldown/delay/group scoring/vector lore are not implemented in engine-core P1.',
  ];
  const candidates = collectCandidates(input);
  const activated = new Map<string, WorldInfoActivatedEntry>();
  const skipped = new Map<string, WorldInfoSkippedEntry>();
  let scanText = buildScanText(input.chat, scanDepth, input.scanData);
  let usedBudget = 0;
  let iterations = 0;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    iterations = iteration + 1;
    const newlyActivated: string[] = [];

    for (const candidate of candidates) {
      if (activated.has(candidate.id)) {
        continue;
      }

      const match = matchEntry(candidate.entry, scanText, iteration);
      if (!match.activated) {
        rememberSkipped(skipped, candidate, match.reason ?? 'keys did not match');
        continue;
      }

      const expanded = substituteMacros(candidate.entry.content, input.macroContext ?? {});
      const cost = budgetCost(expanded.text, budgetType);
      if (budgetLimit !== undefined && candidate.entry.ignoreBudget !== true && usedBudget + cost > budgetLimit) {
        rememberSkipped(skipped, candidate, 'budget exceeded');
        continue;
      }

      usedBudget += cost;
      skipped.delete(candidate.id);
      const position = normalizePosition(candidate.entry.position, warnings);
      const active: WorldInfoActivatedEntry = {
        id: candidate.id,
        book: candidate.bookName,
        comment: candidate.entry.comment,
        content: expanded.text,
        position,
        order: candidate.entry.order ?? 0,
        depth: position === 'atDepth' ? normalizeDepth(candidate.entry.depth) : candidate.entry.depth,
        role: position === 'atDepth' ? normalizeDepthRole(candidate.entry, warnings) : undefined,
        outletName: position === 'outlet' ? normalizeOutletName(candidate.entry) : undefined,
        matchedKeys: match.matchedKeys,
        matchedSecondaryKeys: match.matchedSecondaryKeys,
        macroTrace: expanded.trace,
      };
      activated.set(candidate.id, active);

      if (candidate.entry.preventRecursion !== true && candidate.entry.excludeRecursion !== true) {
        newlyActivated.push(expanded.text);
      }
    }

    if (newlyActivated.length === 0) {
      break;
    }

    scanText = `${scanText}\n${newlyActivated.join('\n')}`;
  }

  const activatedList = [...activated.values()].sort(compareActivated);
  const routed = buildBuckets(activatedList, readOriginalAuthorNote(input));

  return {
    activated: activatedList,
    skipped: [...skipped.values()].sort((left, right) => left.id.localeCompare(right.id)),
    buckets: routed.buckets,
    diagnostics: {
      scanDepth,
      scanTextChars: scanText.length,
      iterations,
      budgetType,
      budgetLimit,
      usedBudget,
      warnings,
      unsupported: [...unsupported, ...unsupportedRoutingNotes(routed.uninserted)],
      uninserted: routed.uninserted,
      routingTrace: routed.routingTrace,
    },
  };
}

function collectCandidates(input: EvaluateWorldInfoInput): readonly CandidateEntry[] {
  const books = [...(input.books ?? []), ...(input.book === undefined ? [] : [input.book])];
  const candidates: CandidateEntry[] = [];
  let index = 0;

  for (const book of books) {
    for (const entry of book.entries ?? []) {
      const id = String(entry.uid ?? entry.id ?? `${book.name ?? 'book'}:${index}`);
      candidates.push({ entry, bookName: book.name, id, index });
      index += 1;
    }
  }

  return candidates.sort((left, right) => compareEntry(left.entry, right.entry) || left.index - right.index);
}

function matchEntry(entry: WorldInfoEntry, scanText: string, iteration: number): MatchResult {
  if (entry.disable === true || entry.disabled === true) {
    return { activated: false, reason: 'disabled', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  if (entry.delayUntilRecursion === true && iteration === 0) {
    return { activated: false, reason: 'delayUntilRecursion', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  const localScan = limitScanLines(scanText, entry.scanDepth ?? entry.scan_depth);
  const primaryKeys = entry.key ?? entry.keys ?? [];
  const secondaryKeys = entry.keysecondary ?? entry.secondaryKeys ?? [];
  const caseSensitive = entry.caseSensitive ?? entry.case_sensitive ?? false;
  const wholeWords = entry.matchWholeWords ?? entry.match_whole_words ?? false;
  const matchedKeys = entry.constant === true ? [] : matchingKeys(primaryKeys, localScan, caseSensitive, wholeWords);

  if (entry.constant !== true && primaryKeys.length > 0 && matchedKeys.length === 0) {
    return { activated: false, reason: 'primary keys did not match', matchedKeys, matchedSecondaryKeys: [] };
  }

  if (entry.constant !== true && primaryKeys.length === 0) {
    return { activated: false, reason: 'no primary keys', matchedKeys, matchedSecondaryKeys: [] };
  }

  const matchedSecondaryKeys = matchingKeys(secondaryKeys, localScan, caseSensitive, wholeWords);
  const logic = normalizeLogic(entry.selectiveLogic ?? entry.logic);
  if (secondaryKeys.length > 0 && !secondaryLogicMatches(logic, secondaryKeys.length, matchedSecondaryKeys.length)) {
    return {
      activated: false,
      reason: `secondary keys failed ${logic}`,
      matchedKeys,
      matchedSecondaryKeys,
    };
  }

  return { activated: true, matchedKeys, matchedSecondaryKeys };
}

function secondaryLogicMatches(logic: WorldInfoLogic, total: number, matched: number): boolean {
  switch (logic) {
    case 'AND_ANY':
      return matched > 0;
    case 'NOT_ALL':
      return matched < total;
    case 'NOT_ANY':
      return matched === 0;
    case 'AND_ALL':
      return matched === total;
  }
}

function matchingKeys(
  keys: readonly string[],
  scanText: string,
  caseSensitive: boolean,
  wholeWords: boolean,
): readonly string[] {
  return keys.filter((key) => keyMatches(key, scanText, caseSensitive, wholeWords));
}

function keyMatches(key: string, scanText: string, caseSensitive: boolean, wholeWords: boolean): boolean {
  const regex = parseRegexKey(key);
  if (regex !== undefined) {
    return regex.test(scanText);
  }

  const flags = caseSensitive ? 'u' : 'iu';
  const pattern = wholeWords ? `(?<![\\p{L}\\p{N}_])${escapeRegex(key)}(?![\\p{L}\\p{N}_])` : escapeRegex(key);
  return new RegExp(pattern, flags).test(scanText);
}

function parseRegexKey(key: string): RegExp | undefined {
  if (!key.startsWith('/')) {
    return undefined;
  }

  const lastSlash = key.lastIndexOf('/');
  if (lastSlash <= 0) {
    return undefined;
  }

  const pattern = key.slice(1, lastSlash);
  const flags = key.slice(lastSlash + 1);
  try {
    return new RegExp(pattern, flags);
  } catch {
    return undefined;
  }
}

function buildScanText(chat: Chat, scanDepth: number, scanData: string | readonly string[] | undefined): string {
  const parts: string[] = [];
  if (scanData !== undefined) {
    parts.push(...(Array.isArray(scanData) ? scanData : [scanData]));
  }

  const visibleTurns = chat.turns.filter((turn) => turn.hidden !== true && turn.deleted !== true);
  const selectedTurns = scanDepth === 0 ? [] : visibleTurns.slice(-scanDepth);
  parts.push(...selectedTurns.map(formatTurnForScan).filter((text) => text.length > 0));
  return parts.join('\n');
}

function formatTurnForScan(turn: Turn): string {
  const variant = turn.variants[turn.active_variant] as TurnVariant | undefined;
  if (variant === undefined) {
    return '';
  }

  const text = variant.subs
    .filter((sub) => sub.kind === 'text')
    .map((sub) => sub.text)
    .join('\n')
    .trim();

  return text.length === 0 ? '' : `${turn.role}: ${text}`;
}

function limitScanLines(scanText: string, scanDepth: number | undefined): string {
  if (scanDepth === undefined || scanDepth <= 0) {
    return scanText;
  }

  return scanText.split('\n').slice(-scanDepth).join('\n');
}

function normalizePosition(position: WorldInfoEntry['position'], warnings: string[]): WorldInfoPosition {
  if (typeof position === 'number') {
    const normalized = POSITION_BY_NUMBER.get(position);
    if (normalized !== undefined) {
      return normalized;
    }
    warnings.push(`Unsupported WI numeric position '${position}' normalized to before.`);
    return 'before';
  }

  if (typeof position === 'string') {
    if (POSITION_NAMES.has(position as WorldInfoPosition)) {
      return position as WorldInfoPosition;
    }

    const numeric = Number(position);
    if (Number.isInteger(numeric)) {
      const normalized = POSITION_BY_NUMBER.get(numeric);
      if (normalized !== undefined) {
        return normalized;
      }
    }

    const normalized = position.toLowerCase().replace(/[^a-z0-9]/gu, '');
    const alias = POSITION_ALIASES.get(normalized);
    if (alias !== undefined) {
      return alias;
    }
    warnings.push(`Unsupported WI position '${position}' normalized to before.`);
  }

  return 'before';
}

const POSITION_ALIASES = new Map<string, WorldInfoPosition>([
  ['before', 'before'],
  ['beforechar', 'before'],
  ['beforecharacter', 'before'],
  ['after', 'after'],
  ['afterchar', 'after'],
  ['aftercharacter', 'after'],
  ['antop', 'ANTop'],
  ['authortop', 'ANTop'],
  ['authornotetop', 'ANTop'],
  ['anbottom', 'ANBottom'],
  ['authorbottom', 'ANBottom'],
  ['authornotebottom', 'ANBottom'],
  ['atdepth', 'atDepth'],
  ['depth', 'atDepth'],
  ['emtop', 'EMTop'],
  ['exampletop', 'EMTop'],
  ['examplestop', 'EMTop'],
  ['mesexamplestop', 'EMTop'],
  ['embottom', 'EMBottom'],
  ['examplebottom', 'EMBottom'],
  ['examplesbottom', 'EMBottom'],
  ['mesexamplesbottom', 'EMBottom'],
  ['outlet', 'outlet'],
]);

function normalizeDepth(depth: number | undefined): number {
  return Number.isFinite(depth) && depth !== undefined && depth >= 0 ? Math.floor(depth) : DEFAULT_AT_DEPTH;
}

function normalizeDepthRole(entry: WorldInfoEntry, warnings: string[]): TurnRole {
  const raw = entry.role ?? entry.depthRole ?? entry.depth_role;
  if (raw === undefined) {
    return 'system';
  }

  if (typeof raw === 'number') {
    return DEPTH_ROLE_BY_NUMBER.get(raw) ?? 'system';
  }

  const normalized = raw.toLowerCase().replace(/[^a-z0-9]/gu, '');
  const role = DEPTH_ROLE_ALIASES.get(normalized);
  if (role !== undefined) {
    return role;
  }

  warnings.push(`Unsupported WI atDepth role '${raw}' normalized to system.`);
  return 'system';
}

const DEPTH_ROLE_BY_NUMBER = new Map<number, TurnRole>([
  [0, 'system'],
  [1, 'user'],
  [2, 'assistant'],
  [3, 'tool'],
]);

const DEPTH_ROLE_ALIASES = new Map<string, TurnRole>([
  ['system', 'system'],
  ['sys', 'system'],
  ['user', 'user'],
  ['human', 'user'],
  ['assistant', 'assistant'],
  ['char', 'assistant'],
  ['character', 'assistant'],
  ['model', 'assistant'],
  ['tool', 'tool'],
]);

function normalizeOutletName(entry: WorldInfoEntry): string {
  const outlet = entry.outletName ?? entry.outlet_name ?? entry.outlet;
  return outlet?.trim() === '' || outlet === undefined ? 'default' : outlet;
}

function normalizeLogic(logic: WorldInfoEntry['logic']): WorldInfoLogic {
  if (typeof logic === 'number') {
    return LOGIC_BY_NUMBER.get(logic) ?? 'AND_ANY';
  }

  if (logic === 'NOT_ALL' || logic === 'NOT_ANY' || logic === 'AND_ALL') {
    return logic;
  }

  return 'AND_ANY';
}

function compareEntry(left: WorldInfoEntry, right: WorldInfoEntry): number {
  return (left.order ?? 0) - (right.order ?? 0);
}

function compareActivated(left: WorldInfoActivatedEntry, right: WorldInfoActivatedEntry): number {
  return left.order - right.order || left.id.localeCompare(right.id);
}

function buildBuckets(activated: readonly WorldInfoActivatedEntry[], originalAuthorNote: string | undefined): BuildBucketsResult {
  const legacyBuckets: Record<WorldInfoPosition, string[]> = {
    before: [],
    after: [],
    ANTop: [],
    ANBottom: [],
    atDepth: [],
    EMTop: [],
    EMBottom: [],
    outlet: [],
  };
  const examples: WorldInfoExampleBucketEntry[] = [];
  const depthEntries: WorldInfoDepthBucket[] = [];
  const outlets: Record<string, WorldInfoOutletBucket> = {};
  const routingTrace: WorldInfoRoutingTraceEntry[] = [];
  const uninserted: string[] = [];

  for (const entry of activated) {
    const routed = routedEntry(entry);
    switch (entry.position) {
      case 'before':
      case 'after':
      case 'ANTop':
      case 'ANBottom':
        legacyBuckets[entry.position].unshift(entry.content);
        routingTrace.push(traceEntry(entry, entry.position, true));
        break;
      case 'EMTop':
      case 'EMBottom': {
        legacyBuckets[entry.position].unshift(entry.content);
        const position = entry.position === 'EMTop' ? 'before' : 'after';
        examples.unshift({ position, content: entry.content, entryId: entry.id, order: entry.order });
        routingTrace.push(traceEntry(entry, `examples.${position}`, false, 'EM routing is reported but not spliced into final chat messages.'));
        uninserted.push(`WI entry ${entry.id} routed to ${entry.position}; engine-core reports it but does not splice example messages.`);
        break;
      }
      case 'atDepth': {
        legacyBuckets.atDepth.unshift(entry.content);
        const depth = entry.depth ?? DEFAULT_AT_DEPTH;
        const role = entry.role ?? 'system';
        const key = `${depth}:${role}`;
        let bucket = depthEntries.find((item) => `${item.depth}:${item.role}` === key);
        if (bucket === undefined) {
          bucket = { depth, role, entries: [], content: [] };
          depthEntries.unshift(bucket);
        }
        (bucket.entries as WorldInfoRoutedEntry[]).unshift(routed);
        (bucket.content as string[]).unshift(entry.content);
        routingTrace.push(traceEntry(entry, 'depthEntries', false, 'atDepth routing is reported but not spliced into final chat messages.'));
        uninserted.push(`WI entry ${entry.id} routed to atDepth depth=${depth} role=${role}; engine-core reports it but does not splice chat history.`);
        break;
      }
      case 'outlet': {
        legacyBuckets.outlet.unshift(entry.content);
        const outletName = entry.outletName ?? 'default';
        outlets[outletName] ??= { entries: [], content: [] };
        (outlets[outletName].entries as WorldInfoRoutedEntry[]).unshift(routed);
        (outlets[outletName].content as string[]).unshift(entry.content);
        routingTrace.push(traceEntry(entry, `outlets.${outletName}`, false, 'Outlet routing is reported but not spliced into final chat messages.'));
        uninserted.push(`WI entry ${entry.id} routed to outlet '${outletName}'; engine-core reports it but does not splice final chat messages.`);
        break;
      }
    }
  }

  const anPatch = buildAuthorNotePatch(legacyBuckets.ANTop, originalAuthorNote, legacyBuckets.ANBottom);
  return {
    buckets: {
      ...legacyBuckets,
      examples,
      em: examples,
      depthEntries,
      anTop: legacyBuckets.ANTop,
      anBottom: legacyBuckets.ANBottom,
      anPatch,
      outlets,
    },
    routingTrace,
    uninserted,
  };
}

function routedEntry(entry: WorldInfoActivatedEntry): WorldInfoRoutedEntry {
  return omitUndefined({
    content: entry.content,
    entryId: entry.id,
    order: entry.order,
    source: entry.book,
    position: entry.position,
    depth: entry.depth,
    role: entry.role,
    outletName: entry.outletName,
  });
}

function traceEntry(
  entry: WorldInfoActivatedEntry,
  bucket: string,
  inserted: boolean,
  note?: string,
): WorldInfoRoutingTraceEntry {
  return omitUndefined({
    entryId: entry.id,
    source: entry.book,
    position: entry.position,
    bucket,
    order: entry.order,
    depth: entry.depth,
    role: entry.role,
    outletName: entry.outletName,
    inserted,
    note,
  });
}

function buildAuthorNotePatch(
  top: readonly string[],
  original: string | undefined,
  bottom: readonly string[],
): WorldInfoAuthorNotePatch {
  return omitUndefined({
    top,
    original,
    bottom,
    patched: [...top, ...(original === undefined || original.trim() === '' ? [] : [original]), ...bottom]
      .filter((part) => part.trim() !== '')
      .join('\n'),
  });
}

function readOriginalAuthorNote(input: EvaluateWorldInfoInput): string | undefined {
  return input.authorNote ?? input.originalAuthorNote ?? input.author_note;
}

function unsupportedRoutingNotes(uninserted: readonly string[]): readonly string[] {
  return uninserted.length === 0
    ? []
    : ['WI atDepth/outlet/EM routes are diagnostics/routing output only; engine-core does not splice them into final chat messages.'];
}

function rememberSkipped(skipped: Map<string, WorldInfoSkippedEntry>, candidate: CandidateEntry, reason: string): void {
  if (!skipped.has(candidate.id)) {
    skipped.set(candidate.id, { id: candidate.id, book: candidate.bookName, reason });
  }
}

function budgetCost(text: string, type: WorldInfoBudgetType): number {
  if (type === 'approxTokens') {
    return Math.ceil(text.length / 4);
  }

  return text.length;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function omitUndefined<T extends Record<string, unknown>>(input: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as T;
}
