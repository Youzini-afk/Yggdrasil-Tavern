import type { Chat, Turn, TurnVariant } from '@ydltavern/types';

import type { MacroContext, MacroTraceEntry } from './macros.js';
import { substituteMacros } from './macros.js';

export type WorldInfoPosition = 'before' | 'after' | 'atDepth' | 'ANTop' | 'ANBottom' | 'outlet';
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
}

export interface WorldInfoActivatedEntry {
  readonly id: string;
  readonly book?: string;
  readonly comment?: string;
  readonly content: string;
  readonly position: WorldInfoPosition;
  readonly order: number;
  readonly depth?: number;
  readonly matchedKeys: readonly string[];
  readonly matchedSecondaryKeys: readonly string[];
  readonly macroTrace: readonly MacroTraceEntry[];
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
}

export interface EvaluateWorldInfoResult {
  readonly activated: readonly WorldInfoActivatedEntry[];
  readonly skipped: readonly WorldInfoSkippedEntry[];
  readonly buckets: Readonly<Record<WorldInfoPosition, readonly string[]>>;
  readonly diagnostics: WorldInfoDiagnostics;
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
  [7, 'outlet'],
]);

const LOGIC_BY_NUMBER = new Map<number, WorldInfoLogic>([
  [0, 'AND_ANY'],
  [1, 'NOT_ALL'],
  [2, 'NOT_ANY'],
  [3, 'AND_ALL'],
]);

const POSITION_NAMES = new Set<WorldInfoPosition>(['before', 'after', 'atDepth', 'ANTop', 'ANBottom', 'outlet']);

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
        depth: candidate.entry.depth,
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

  return {
    activated: activatedList,
    skipped: [...skipped.values()].sort((left, right) => left.id.localeCompare(right.id)),
    buckets: buildBuckets(activatedList),
    diagnostics: {
      scanDepth,
      scanTextChars: scanText.length,
      iterations,
      budgetType,
      budgetLimit,
      usedBudget,
      warnings,
      unsupported,
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
    return POSITION_BY_NUMBER.get(position) ?? 'before';
  }

  if (typeof position === 'string') {
    if (POSITION_NAMES.has(position as WorldInfoPosition)) {
      return position as WorldInfoPosition;
    }

    const normalized = position.toLowerCase();
    if (normalized === 'author_note_top') {
      return 'ANTop';
    }
    if (normalized === 'author_note_bottom') {
      return 'ANBottom';
    }
    warnings.push(`Unsupported WI position '${position}' normalized to before.`);
  }

  return 'before';
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

function buildBuckets(
  activated: readonly WorldInfoActivatedEntry[],
): Readonly<Record<WorldInfoPosition, readonly string[]>> {
  const buckets: Record<WorldInfoPosition, string[]> = {
    before: [],
    after: [],
    atDepth: [],
    ANTop: [],
    ANBottom: [],
    outlet: [],
  };

  for (const entry of activated) {
    buckets[entry.position].push(entry.content);
  }

  return buckets;
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
