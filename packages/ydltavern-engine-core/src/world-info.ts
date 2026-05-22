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
export type WorldInfoGenerationType = 'normal' | 'continue' | 'impersonate' | 'swipe' | 'regenerate' | 'quiet';

export interface WorldInfoCharacterFilter {
  readonly names?: readonly string[] | string;
  readonly name?: readonly string[] | string;
  readonly characterNames?: readonly string[] | string;
  readonly tags?: readonly string[] | string;
  readonly tag?: readonly string[] | string;
  readonly isExclude?: boolean;
  readonly exclude?: boolean;
}

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
  readonly selectiveLogic?: WorldInfoLogic | number | string | readonly string[];
  readonly logic?: WorldInfoLogic | number;
  readonly triggers?: readonly string[] | string;
  readonly trigger?: readonly string[] | string;
  readonly generationTriggers?: readonly string[] | string;
  readonly generationTrigger?: readonly string[] | string;
  readonly generationTypes?: readonly string[] | string;
  readonly generationType?: readonly string[] | string;
  readonly generation_type?: readonly string[] | string;
  readonly characterFilter?: WorldInfoCharacterFilter | readonly string[] | string;
  readonly character_filter?: WorldInfoCharacterFilter | readonly string[] | string;
  readonly decorators?: readonly string[] | string;
  readonly decorator?: readonly string[] | string;
  readonly activationDecorator?: readonly string[] | string;
  readonly dontActivate?: boolean;
  readonly dont_activate?: boolean;
  readonly activate?: boolean;
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
  readonly delayUntilRecursion?: boolean | number;
  readonly matchPersonaDescription?: boolean;
  readonly matchCharacterDescription?: boolean;
  readonly matchCharacterPersonality?: boolean;
  readonly matchCharacterDepthPrompt?: boolean;
  readonly matchScenario?: boolean;
  readonly matchCreatorNotes?: boolean;
  readonly ignoreBudget?: boolean;
  readonly useProbability?: boolean | number | string;
  readonly use_probability?: boolean | number | string;
  readonly probability?: number | string;
  readonly sticky?: boolean | number | string;
  readonly cooldown?: boolean | number | string;
  readonly delay?: number | string;
  readonly group?: readonly string[] | string;
  readonly groupOverride?: boolean | number | string;
  readonly group_override?: boolean | number | string;
  readonly groupWeight?: number | string;
  readonly group_weight?: number | string;
  readonly useGroupScoring?: boolean | number | string;
  readonly use_group_scoring?: boolean | number | string;
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
  readonly maxRecursion?: number;
  readonly max_recursion?: number;
  readonly minActivations?: number;
  readonly min_activations?: number;
  readonly minimumActivations?: number;
  readonly generationType?: WorldInfoGenerationType | string;
  readonly generation_type?: WorldInfoGenerationType | string;
  readonly activeCharacterName?: string;
  readonly active_character_name?: string;
  readonly characterName?: string;
  readonly character_name?: string;
  readonly charName?: string;
  readonly activeCharacterTags?: readonly string[] | string;
  readonly active_character_tags?: readonly string[] | string;
  readonly characterTags?: readonly string[] | string;
  readonly character_tags?: readonly string[] | string;
  readonly charTags?: readonly string[] | string;
  readonly character?: {
    readonly name?: string;
    readonly tags?: readonly string[] | string;
    readonly description?: string;
    readonly personality?: string;
    readonly depthPrompt?: string;
    readonly depth_prompt?: string;
    readonly scenario?: string;
    readonly creatorNotes?: string;
    readonly creator_notes?: string;
  };
  readonly personaDescription?: string;
  readonly persona_description?: string;
  readonly persona?: string;
  readonly characterDescription?: string;
  readonly character_description?: string;
  readonly characterPersonality?: string;
  readonly character_personality?: string;
  readonly characterDepthPrompt?: string;
  readonly character_depth_prompt?: string;
  readonly depthPrompt?: string;
  readonly depth_prompt?: string;
  readonly scenario?: string;
  readonly creatorNotes?: string;
  readonly creator_notes?: string;
  readonly budget?: WorldInfoBudget;
  readonly runtimeState?: WorldInfoRuntimeState;
  readonly state?: WorldInfoRuntimeState;
  readonly chatLength?: number;
  readonly chat_length?: number;
  readonly dryRun?: boolean;
  readonly dry_run?: boolean;
  readonly macroContext?: MacroContext;
  readonly authorNote?: string;
  readonly originalAuthorNote?: string;
  readonly author_note?: string;
  readonly random?: () => number;
  readonly randomValues?: readonly number[];
  readonly rngSequence?: readonly number[];
}

export interface WorldInfoRuntimeEffectState {
  readonly entryId?: string;
  readonly entryHash?: string;
  readonly id?: string;
  readonly hash?: string;
  readonly start: number;
  readonly end: number;
  readonly protected?: boolean;
}

export interface WorldInfoRuntimeState {
  sticky?: readonly WorldInfoRuntimeEffectState[];
  cooldown?: readonly WorldInfoRuntimeEffectState[];
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
  readonly reason: string;
  readonly code: string;
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
  readonly code?: string;
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
  readonly activationTrace: readonly WorldInfoActivationTraceEntry[];
  readonly routingTrace: readonly WorldInfoRoutingTraceEntry[];
}

export interface WorldInfoActivationTraceEntry {
  readonly entryId: string;
  readonly source?: string;
  readonly activated: boolean;
  readonly code: string;
  readonly reason: string;
  readonly iteration: number;
  readonly matchedKeys: readonly string[];
  readonly matchedSecondaryKeys: readonly string[];
  readonly group?: string;
  readonly probability?: number;
  readonly roll?: number;
  readonly randomIndex?: number;
  readonly randomValue?: number;
  readonly score?: number;
  readonly maxScore?: number;
  readonly weight?: number;
  readonly winnerEntryId?: string;
}

interface RandomState {
  next(): RandomRoll;
}

interface RandomRoll {
  readonly index: number;
  readonly value: number;
}

interface PendingActivation {
  readonly candidate: CandidateEntry;
  readonly match: MatchResult;
  readonly expanded: {
    readonly text: string;
    readonly trace: readonly MacroTraceEntry[];
  };
  readonly cost: number;
  readonly stateActivation?: 'sticky';
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
  readonly nextState: WorldInfoRuntimeState;
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
  readonly code?: string;
  readonly matchedKeys: readonly string[];
  readonly matchedSecondaryKeys: readonly string[];
}

interface MatchContext {
  readonly generationType: WorldInfoGenerationType;
  readonly characterName?: string;
  readonly characterTags: readonly string[];
  readonly scanFlagTexts: Readonly<Record<ScanFlagName, string | undefined>>;
  readonly minActivationScan?: boolean;
}

type ScanFlagName =
  | 'matchPersonaDescription'
  | 'matchCharacterDescription'
  | 'matchCharacterPersonality'
  | 'matchCharacterDepthPrompt'
  | 'matchScenario'
  | 'matchCreatorNotes';

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
const DEFAULT_GENERATION_TYPE: WorldInfoGenerationType = 'normal';
const GENERATION_TYPES = new Set<WorldInfoGenerationType>([
  'normal',
  'continue',
  'impersonate',
  'swipe',
  'regenerate',
  'quiet',
]);
const GENERATION_TRIGGER_FIELDS = ['triggers', 'trigger', 'generationTriggers', 'generationTrigger', 'generationTypes', 'generationType', 'generation_type'] as const;
const SCAN_FLAG_NAMES: readonly ScanFlagName[] = [
  'matchPersonaDescription',
  'matchCharacterDescription',
  'matchCharacterPersonality',
  'matchCharacterDepthPrompt',
  'matchScenario',
  'matchCreatorNotes',
];

export function evaluateWorldInfo(input: EvaluateWorldInfoInput): EvaluateWorldInfoResult {
  const scanDepth = Math.max(0, input.scanDepth ?? 4);
  const maxIterations = Math.max(1, input.maxRecursion ?? input.max_recursion ?? input.recursiveScanDepth ?? 1);
  const minActivations = Math.max(0, input.minActivations ?? input.min_activations ?? input.minimumActivations ?? 0);
  const budgetType = input.budget?.type ?? 'characters';
  const budgetLimit = input.budget?.max;
  const chatLength = normalizeChatLength(input);
  const dryRun = input.dryRun === true || input.dry_run === true;
  const warnings: string[] = [];
  const unsupported = ['ST token-level budget alignment is approximated, not tokenizer exact.', 'Vector lore is not implemented in engine-core P1.'];
  const candidates = collectCandidates(input);
  const runtimeState = normalizeRuntimeState(input.runtimeState ?? input.state, chatLength);
  const nextState = cloneRuntimeState(runtimeState);
  const activationTrace: WorldInfoActivationTraceEntry[] = [];
  if (!dryRun) {
    transitionExpiredStickyToCooldown(candidates, runtimeState, nextState, chatLength, activationTrace);
  }
  const activated = new Map<string, WorldInfoActivatedEntry>();
  const skipped = new Map<string, WorldInfoSkippedEntry>();
  const matchContext = buildMatchContext(input);
  const randomState = buildRandomState(input);
  let scanText = buildScanText(input.chat, scanDepth, input.scanData);
  let usedBudget = 0;
  let iterations = 0;

  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    iterations = iteration + 1;
    const pending: PendingActivation[] = [];

    for (const candidate of candidates) {
      if (activated.has(candidate.id)) {
        continue;
      }

      const delay = normalizeNonNegativeInteger(candidate.entry.delay);
      if (delay > 0 && chatLength < delay) {
        const delayMatch: MatchResult = { activated: false, reason: `delay active until chatLength ${delay}`, code: 'delay_active', matchedKeys: [], matchedSecondaryKeys: [] };
        rememberSkipped(skipped, candidate, delayMatch.reason ?? 'delay active', delayMatch.code);
        activationTrace.push(traceActivation(candidate, false, delayMatch, iteration));
        continue;
      }

      const stickyState = findRuntimeEffect(nextState.sticky, candidate, chatLength);
      if (stickyState !== undefined) {
        const match: MatchResult = { activated: true, reason: `sticky active through chatLength ${stickyState.end}`, code: 'sticky_active', matchedKeys: [], matchedSecondaryKeys: [] };
        const expanded = substituteMacros(stripActivationDecorators(candidate.entry.content), input.macroContext ?? {});
        const cost = budgetCost(expanded.text, budgetType);
        if (budgetLimit !== undefined && candidate.entry.ignoreBudget !== true && usedBudget + cost > budgetLimit) {
          const budgetMatch = { ...match, activated: false, reason: 'budget exceeded', code: 'budget_exceeded' };
          rememberSkipped(skipped, candidate, budgetMatch.reason ?? 'budget exceeded', budgetMatch.code);
          activationTrace.push(traceActivation(candidate, false, budgetMatch, iteration));
          continue;
        }
        pending.push({ candidate, match, expanded, cost, stateActivation: 'sticky' });
        continue;
      }

      const cooldownState = findRuntimeEffect(nextState.cooldown, candidate, chatLength);
      if (cooldownState !== undefined) {
        const cooldownMatch: MatchResult = { activated: false, reason: `cooldown active through chatLength ${cooldownState.end}`, code: 'cooldown_active', matchedKeys: [], matchedSecondaryKeys: [] };
        rememberSkipped(skipped, candidate, cooldownMatch.reason ?? 'cooldown active', cooldownMatch.code);
        activationTrace.push(traceActivation(candidate, false, cooldownMatch, iteration));
        continue;
      }

      const match = matchEntry(candidate.entry, scanText, iteration, matchContext);
      if (!match.activated) {
        rememberSkipped(skipped, candidate, match.reason ?? 'keys did not match', match.code ?? 'key_mismatch');
        activationTrace.push(traceActivation(candidate, false, match, iteration));
        continue;
      }

      const probability = evaluateProbability(candidate, randomState, activationTrace, iteration);
      if (!probability.passed) {
        rememberSkipped(skipped, candidate, 'probability roll failed', 'probability_failed');
        continue;
      }

      const expanded = substituteMacros(stripActivationDecorators(candidate.entry.content), input.macroContext ?? {});
      const cost = budgetCost(expanded.text, budgetType);
      if (budgetLimit !== undefined && candidate.entry.ignoreBudget !== true && usedBudget + cost > budgetLimit) {
        const budgetMatch = { ...match, activated: false, reason: 'budget exceeded', code: 'budget_exceeded' };
        rememberSkipped(skipped, candidate, budgetMatch.reason, budgetMatch.code);
        activationTrace.push(traceActivation(candidate, false, budgetMatch, iteration));
        continue;
      }

      pending.push({ candidate, match, expanded, cost });
    }

    const groupSelected = applyGroupRules(pending, randomState, activationTrace, skipped, iteration);
    const selected: PendingActivation[] = [];
    let selectedBudget = usedBudget;
    for (const item of groupSelected) {
      if (budgetLimit !== undefined && item.candidate.entry.ignoreBudget !== true && selectedBudget + item.cost > budgetLimit) {
        const budgetMatch = { ...item.match, activated: false, reason: 'budget exceeded', code: 'budget_exceeded' };
        rememberSkipped(skipped, item.candidate, budgetMatch.reason, budgetMatch.code);
        activationTrace.push(traceActivation(item.candidate, false, budgetMatch, iteration));
        continue;
      }
      selectedBudget += item.cost;
      selected.push(item);
    }
    const newlyActivated = activatePending(selected, activated, skipped, activationTrace, iteration, warnings);
    if (!dryRun) {
      updateRuntimeStateForActivations(selected, nextState, chatLength);
    }
    usedBudget += selected.reduce((sum, item) => sum + item.cost, 0);

    if (newlyActivated.length === 0) {
      break;
    }

    scanText = `${scanText}\n${newlyActivated.join('\n')}`;
  }

  if (minActivations > activated.size) {
    const minScanText = buildMinActivationScanText(input, scanDepth, scanText);
    if (minScanText !== scanText) {
      warnings.push(
        `WI min activations requested ${minActivations}; expanded scan text from ${scanText.length} to ${minScanText.length} characters.`,
      );
      scanText = minScanText;
      for (const candidate of candidates) {
        if (activated.size >= minActivations) {
          break;
        }
        if (activated.has(candidate.id)) {
          continue;
        }

        const match = matchEntry(candidate.entry, scanText, iterations, { ...matchContext, minActivationScan: true });
        if (!match.activated) {
          rememberSkipped(skipped, candidate, match.reason ?? 'keys did not match', match.code ?? 'key_mismatch');
          activationTrace.push(traceActivation(candidate, false, match, iterations));
          continue;
        }

        const probability = evaluateProbability(candidate, randomState, activationTrace, iterations);
        if (!probability.passed) {
          rememberSkipped(skipped, candidate, 'probability roll failed', 'probability_failed');
          continue;
        }

        const expanded = substituteMacros(stripActivationDecorators(candidate.entry.content), input.macroContext ?? {});
        const cost = budgetCost(expanded.text, budgetType);
        if (budgetLimit !== undefined && candidate.entry.ignoreBudget !== true && usedBudget + cost > budgetLimit) {
          const budgetMatch = { ...match, activated: false, reason: 'budget exceeded', code: 'budget_exceeded' };
          rememberSkipped(skipped, candidate, budgetMatch.reason, budgetMatch.code);
          activationTrace.push(traceActivation(candidate, false, budgetMatch, iterations));
          continue;
        }

        usedBudget += cost;
        skipped.delete(candidate.id);
        activationTrace.push(traceActivation(candidate, true, match, iterations));
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
          reason: match.reason ?? 'min activation scan matched',
          code: match.code ?? 'min_activation_scan',
          macroTrace: expanded.trace,
        };
        activated.set(candidate.id, active);
      }
    }
  }

  const activatedList = [...activated.values()].sort(compareActivated);
  const routed = buildBuckets(activatedList, readOriginalAuthorNote(input));
  const resultState = dryRun ? cloneRuntimeState(runtimeState) : pruneRuntimeState(nextState, chatLength);

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
      activationTrace,
      routingTrace: routed.routingTrace,
    },
    nextState: resultState,
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

function buildMatchContext(input: EvaluateWorldInfoInput): MatchContext {
  const generationType = normalizeGenerationType(input.generationType ?? input.generation_type);
  const characterName =
    input.activeCharacterName ??
    input.active_character_name ??
    input.characterName ??
    input.character_name ??
    input.charName ??
    input.character?.name;
  const characterTags = normalizeStringArray(
    input.activeCharacterTags ?? input.active_character_tags ?? input.characterTags ?? input.character_tags ?? input.charTags ?? input.character?.tags,
  );
  return {
    generationType,
    characterName,
    characterTags,
    scanFlagTexts: {
      matchPersonaDescription: input.personaDescription ?? input.persona_description ?? input.persona,
      matchCharacterDescription: input.characterDescription ?? input.character_description ?? input.character?.description,
      matchCharacterPersonality: input.characterPersonality ?? input.character_personality ?? input.character?.personality,
      matchCharacterDepthPrompt:
        input.characterDepthPrompt ?? input.character_depth_prompt ?? input.depthPrompt ?? input.depth_prompt ?? input.character?.depthPrompt ?? input.character?.depth_prompt,
      matchScenario: input.scenario ?? input.character?.scenario,
      matchCreatorNotes: input.creatorNotes ?? input.creator_notes ?? input.character?.creatorNotes ?? input.character?.creator_notes,
    },
  };
}

function normalizeGenerationType(value: string | undefined): WorldInfoGenerationType {
  const normalized = value?.toLowerCase().replace(/[^a-z0-9]/gu, '') ?? DEFAULT_GENERATION_TYPE;
  switch (normalized) {
    case 'continue':
    case 'continuation':
      return 'continue';
    case 'impersonate':
    case 'impersonation':
      return 'impersonate';
    case 'swipe':
      return 'swipe';
    case 'regenerate':
    case 'regen':
      return 'regenerate';
    case 'quiet':
    case 'quietprompt':
      return 'quiet';
    default:
      return 'normal';
  }
}

function generationTriggerMatches(
  entry: WorldInfoEntry,
  generationType: WorldInfoGenerationType,
): { readonly matches: boolean; readonly triggers: readonly WorldInfoGenerationType[] } {
  const raw: string[] = [];
  for (const field of GENERATION_TRIGGER_FIELDS) {
    raw.push(...normalizeStringArray(entry[field]));
  }

  raw.push(...normalizeSelectiveLogicTriggers(entry.selectiveLogic));
  const triggers = raw.map(normalizeGenerationType).filter((trigger, index, values) => GENERATION_TYPES.has(trigger) && values.indexOf(trigger) === index);
  return { matches: triggers.length === 0 || triggers.includes(generationType), triggers };
}

function normalizeSelectiveLogicTriggers(value: WorldInfoEntry['selectiveLogic']): readonly string[] {
  const raw = normalizeStringArray(value);
  return raw.filter((item) => GENERATION_TYPES.has(normalizeGenerationType(item)) || item.toLowerCase() === 'continuation');
}

function characterFilterMatches(entry: WorldInfoEntry, characterName: string | undefined, characterTags: readonly string[]): boolean {
  const filter = entry.characterFilter ?? entry.character_filter;
  if (filter === undefined) {
    return true;
  }

  const normalizedName = normalizeComparable(characterName);
  const normalizedTags = new Set(characterTags.map(normalizeComparable));
  const { names, tags, exclude } = normalizeCharacterFilter(filter);
  if (names.length === 0 && tags.length === 0) {
    return true;
  }

  const nameMatched = names.length > 0 && normalizedName !== undefined && names.some((name) => normalizeComparable(name) === normalizedName);
  const tagMatched = tags.length > 0 && tags.some((tag) => normalizedTags.has(normalizeComparable(tag) ?? ''));
  const matched = nameMatched || tagMatched;
  return exclude ? !matched : matched;
}

function normalizeCharacterFilter(filter: NonNullable<WorldInfoEntry['characterFilter']>): {
  readonly names: readonly string[];
  readonly tags: readonly string[];
  readonly exclude: boolean;
} {
  if (typeof filter === 'string' || Array.isArray(filter)) {
    return { names: normalizeStringArray(filter), tags: [], exclude: false };
  }

  const objectFilter = filter as WorldInfoCharacterFilter;
  return {
    names: normalizeStringArray(objectFilter.names ?? objectFilter.name ?? objectFilter.characterNames),
    tags: normalizeStringArray(objectFilter.tags ?? objectFilter.tag),
    exclude: objectFilter.isExclude === true || objectFilter.exclude === true,
  };
}

function readActivationDecorator(entry: WorldInfoEntry): 'activate' | 'dont_activate' | undefined {
  const explicit = [
    ...normalizeStringArray(entry.decorators),
    ...normalizeStringArray(entry.decorator),
    ...normalizeStringArray(entry.activationDecorator),
  ]
    .map((item) => item.toLowerCase().replace(/[^a-z_]/gu, ''))
    .join(' ');

  if (entry.dontActivate === true || entry.dont_activate === true || explicit.includes('dont_activate') || explicit.includes('dontactivate')) {
    return 'dont_activate';
  }
  if (entry.activate === true || explicit.includes('activate') || /@@activate\b/iu.test(entry.content)) {
    return /@@dont_activate\b/iu.test(entry.content) ? 'dont_activate' : 'activate';
  }
  if (/@@dont_activate\b/iu.test(entry.content)) {
    return 'dont_activate';
  }
  return undefined;
}

function stripActivationDecorators(content: string): string {
  return content.replace(/@@(?:dont_activate|activate)\b\s*/giu, '').trim();
}

function buildScanFlagText(entry: WorldInfoEntry, scanFlagTexts: MatchContext['scanFlagTexts']): string {
  const parts: string[] = [];
  for (const flag of SCAN_FLAG_NAMES) {
    if (entry[flag] === true) {
      const text = scanFlagTexts[flag];
      if (text !== undefined && text.trim() !== '') {
        parts.push(text);
      }
    }
  }
  return parts.join('\n');
}

function buildMinActivationScanText(input: EvaluateWorldInfoInput, scanDepth: number, currentScanText: string): string {
  const expandedDepth = Math.max(scanDepth, input.chat.turns.length);
  const expanded = buildScanText(input.chat, expandedDepth, input.scanData);
  const context = buildMatchContext(input);
  const flagTexts = Object.values(context.scanFlagTexts).filter((text): text is string => text !== undefined && text.trim() !== '');
  return [...new Set([currentScanText, expanded, ...flagTexts].filter((text) => text.trim() !== ''))].join('\n');
}

function traceActivation(
  candidate: CandidateEntry,
  activated: boolean,
  match: MatchResult,
  iteration: number,
  extra?: Partial<WorldInfoActivationTraceEntry>,
): WorldInfoActivationTraceEntry {
  return omitUndefined({
    entryId: candidate.id,
    source: candidate.bookName,
    activated,
    code: match.code ?? (activated ? 'key_match' : 'key_mismatch'),
    reason: match.reason ?? (activated ? 'activated' : 'keys did not match'),
    iteration,
    matchedKeys: match.matchedKeys,
    matchedSecondaryKeys: match.matchedSecondaryKeys,
    ...extra,
  });
}

function buildRandomState(input: EvaluateWorldInfoInput): RandomState {
  const sequence = input.randomValues ?? input.rngSequence;
  let index = 0;
  return {
    next(): RandomRoll {
      const currentIndex = index;
      index += 1;
      const value = sequence?.[currentIndex] ?? input.random?.() ?? Math.random();
      return { index: currentIndex, value: normalizeRandomValue(value) };
    },
  };
}

function normalizeRandomValue(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value >= 1) {
    return value === 1 ? 1 : value % 1;
  }
  return value;
}

function evaluateProbability(
  candidate: CandidateEntry,
  randomState: RandomState,
  activationTrace: WorldInfoActivationTraceEntry[],
  iteration: number,
): { readonly passed: boolean } {
  const probability = normalizeProbability(candidate.entry.probability);
  const useProbability = normalizeBoolean(candidate.entry.useProbability ?? candidate.entry.use_probability) === true;
  if (!useProbability || probability >= 100) {
    return { passed: true };
  }

  const random = randomState.next();
  const roll = random.value * 100;
  const passed = roll <= probability;
  const match: MatchResult = {
    activated: passed,
    reason: `probability roll ${roll.toFixed(4)} ${passed ? '<=' : '>'} ${probability}`,
    code: passed ? 'probability_roll' : 'probability_failed',
    matchedKeys: [],
    matchedSecondaryKeys: [],
  };
  activationTrace.push(traceActivation(candidate, passed, match, iteration, { probability, roll, randomIndex: random.index, randomValue: random.value }));
  return { passed };
}

function applyGroupRules(
  pending: readonly PendingActivation[],
  randomState: RandomState,
  activationTrace: WorldInfoActivationTraceEntry[],
  skipped: Map<string, WorldInfoSkippedEntry>,
  iteration: number,
): readonly PendingActivation[] {
  const byGroup = new Map<string, PendingActivation[]>();
  const winners = new Map<string, PendingActivation | undefined>();
  const selected = new Set<PendingActivation>();

  for (const item of pending) {
    const groups = normalizeGroups(item.candidate.entry.group);
    if (groups.length === 0) {
      selected.add(item);
      continue;
    }
    for (const group of groups) {
      byGroup.set(group, [...(byGroup.get(group) ?? []), item]);
      activationTrace.push(
        traceActivation(item.candidate, true, { ...item.match, code: 'group_candidate', reason: `group candidate for ${group}` }, iteration, {
          group,
          score: groupScore(item),
          weight: groupWeight(item.candidate.entry),
        }),
      );
    }
  }

  for (const item of pending) {
    const groups = normalizeGroups(item.candidate.entry.group);
    if (groups.length === 0) {
      continue;
    }
    if (
      groups.every((group) => {
        if (!winners.has(group)) {
          winners.set(group, chooseGroupWinner(group, byGroup.get(group) ?? [], randomState, activationTrace, skipped, iteration));
        }
        return winners.get(group) === item;
      })
    ) {
      selected.add(item);
    }
  }

  return pending.filter((item) => selected.has(item));
}

function chooseGroupWinner(
  group: string,
  candidates: readonly PendingActivation[],
  randomState: RandomState,
  activationTrace: WorldInfoActivationTraceEntry[],
  skipped: Map<string, WorldInfoSkippedEntry>,
  iteration: number,
): PendingActivation | undefined {
  const unique = uniquePending(candidates);
  if (unique.length === 0) {
    return undefined;
  }
  if (unique.length === 1) {
    traceGroupWinner(unique[0], group, activationTrace, iteration);
    return unique[0];
  }

  let pool = unique;
  const scoringCandidates = pool.filter((item) => normalizeBoolean(item.candidate.entry.useGroupScoring ?? item.candidate.entry.use_group_scoring) === true);
  if (scoringCandidates.length > 0) {
    const maxScore = Math.max(...pool.map(groupScore));
    pool = pool.filter((item) => {
      const score = groupScore(item);
      if (score === maxScore) {
        return true;
      }
      rememberSkipped(skipped, item.candidate, `group scoring loser in ${group}`, 'group_scoring_loser');
      activationTrace.push(traceActivation(item.candidate, false, { ...item.match, code: 'group_scoring_loser', reason: `group ${group} score ${score} below max ${maxScore}` }, iteration, { group, score, maxScore }));
      return false;
    });
  }

  const overridePool = pool.filter((item) => normalizeBoolean(item.candidate.entry.groupOverride ?? item.candidate.entry.group_override) === true);
  if (overridePool.length > 0) {
    const maxOrder = Math.max(...overridePool.map((item) => item.candidate.entry.order ?? 0));
    const ordered = overridePool.filter((item) => (item.candidate.entry.order ?? 0) === maxOrder);
    const winner = ordered.sort((left, right) => left.candidate.index - right.candidate.index)[0];
    markGroupResult(group, pool, winner, activationTrace, skipped, iteration);
    return winner;
  }

  const totalWeight = pool.reduce((sum, item) => sum + groupWeight(item.candidate.entry), 0);
  let winner = pool[0];
  let random: RandomRoll | undefined;
  if (totalWeight > 0) {
    random = randomState.next();
    let threshold = random.value * totalWeight;
    for (const item of pool) {
      threshold -= groupWeight(item.candidate.entry);
      if (threshold <= 0) {
        winner = item;
        break;
      }
    }
  }
  markGroupResult(group, pool, winner, activationTrace, skipped, iteration, random);
  return winner;
}

function activatePending(
  selected: readonly PendingActivation[],
  activated: Map<string, WorldInfoActivatedEntry>,
  skipped: Map<string, WorldInfoSkippedEntry>,
  activationTrace: WorldInfoActivationTraceEntry[],
  iteration: number,
  warnings: string[],
): string[] {
  const newlyActivated: string[] = [];
  for (const item of selected) {
    const { candidate, match, expanded } = item;
    skipped.delete(candidate.id);
    activationTrace.push(traceActivation(candidate, true, match, iteration));
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
      reason: match.reason ?? 'activated',
      code: match.code ?? 'key_match',
      macroTrace: expanded.trace,
    };
    activated.set(candidate.id, active);
    if (candidate.entry.preventRecursion !== true && candidate.entry.excludeRecursion !== true) {
      newlyActivated.push(expanded.text);
    }
  }
  return newlyActivated;
}

function markGroupResult(
  group: string,
  pool: readonly PendingActivation[],
  winner: PendingActivation | undefined,
  activationTrace: WorldInfoActivationTraceEntry[],
  skipped: Map<string, WorldInfoSkippedEntry>,
  iteration: number,
  random?: RandomRoll,
): void {
  if (winner === undefined) {
    return;
  }
  for (const item of pool) {
    if (item === winner) {
      activationTrace.push(traceActivation(item.candidate, true, { ...item.match, code: 'group_winner', reason: `group ${group} winner` }, iteration, {
        group,
        randomIndex: random?.index,
        randomValue: random?.value,
        weight: groupWeight(item.candidate.entry),
      }));
    } else {
      rememberSkipped(skipped, item.candidate, `group ${group} loser`, 'group_loser');
      activationTrace.push(traceActivation(item.candidate, false, { ...item.match, code: 'group_loser', reason: `group ${group} loser` }, iteration, {
        group,
        winnerEntryId: winner.candidate.id,
        weight: groupWeight(item.candidate.entry),
      }));
    }
  }
}

function traceGroupWinner(item: PendingActivation | undefined, group: string, activationTrace: WorldInfoActivationTraceEntry[], iteration: number): void {
  if (item !== undefined) {
    activationTrace.push(traceActivation(item.candidate, true, { ...item.match, code: 'group_winner', reason: `group ${group} winner` }, iteration, { group }));
  }
}

function uniquePending(items: readonly PendingActivation[]): readonly PendingActivation[] {
  return [...new Set(items)];
}

function groupScore(item: PendingActivation): number {
  return item.match.matchedKeys.length + item.match.matchedSecondaryKeys.length;
}

function normalizeGroups(value: WorldInfoEntry['group']): readonly string[] {
  return normalizeStringArray(value).map((group) => group.trim()).filter((group, index, groups) => group.length > 0 && groups.indexOf(group) === index);
}

function groupWeight(entry: WorldInfoEntry): number {
  const weight = Number(entry.groupWeight ?? entry.group_weight ?? 1);
  return Number.isFinite(weight) && weight > 0 ? weight : 1;
}

function normalizeChatLength(input: EvaluateWorldInfoInput): number {
  const explicit = input.chatLength ?? input.chat_length;
  if (Number.isFinite(explicit) && explicit !== undefined) {
    return Math.max(0, Math.floor(explicit));
  }
  return input.chat.turns.filter((turn) => turn.hidden !== true && turn.deleted !== true).length;
}

function normalizeRuntimeState(state: WorldInfoRuntimeState | undefined, chatLength: number): WorldInfoRuntimeState {
  void chatLength;
  return {
    sticky: normalizeRuntimeEffects(state?.sticky),
    cooldown: normalizeRuntimeEffects(state?.cooldown),
  };
}

function normalizeRuntimeEffects(effects: readonly WorldInfoRuntimeEffectState[] | undefined): readonly WorldInfoRuntimeEffectState[] {
  if (effects === undefined) {
    return [];
  }
  const normalized: WorldInfoRuntimeEffectState[] = [];
  for (const effect of effects) {
      const start = Math.floor(Number(effect.start));
      const end = Math.floor(Number(effect.end));
      const entryId = effect.entryId ?? effect.id;
      const entryHash = effect.entryHash ?? effect.hash;
      if (!Number.isFinite(start) || !Number.isFinite(end) || (entryId === undefined && entryHash === undefined)) {
        continue;
      }
      normalized.push(omitUndefined({ entryId, entryHash, start, end, protected: effect.protected === true }));
  }
  return normalized;
}

function cloneRuntimeState(state: WorldInfoRuntimeState): WorldInfoRuntimeState {
  return {
    sticky: state.sticky?.map((effect) => ({ ...effect })) ?? [],
    cooldown: state.cooldown?.map((effect) => ({ ...effect })) ?? [],
  };
}

function pruneRuntimeState(state: WorldInfoRuntimeState, chatLength: number): WorldInfoRuntimeState {
  return {
    sticky: (state.sticky ?? []).filter((effect) => effect.end >= chatLength),
    cooldown: (state.cooldown ?? []).filter((effect) => effect.end >= chatLength),
  };
}

function findRuntimeEffect(effects: readonly WorldInfoRuntimeEffectState[] | undefined, candidate: CandidateEntry, chatLength: number): WorldInfoRuntimeEffectState | undefined {
  const hash = entryHash(candidate.entry);
  return effects?.find((effect) => effect.start <= chatLength && effect.end >= chatLength && (effect.entryId === candidate.id || effect.entryHash === hash));
}

function updateRuntimeStateForActivations(selected: readonly PendingActivation[], state: WorldInfoRuntimeState, chatLength: number): void {
  const sticky = [...(state.sticky ?? [])];
  const cooldown = [...(state.cooldown ?? [])];
  for (const item of selected) {
    if (item.stateActivation === 'sticky') {
      continue;
    }
    const stickyLength = normalizeDuration(item.candidate.entry.sticky);
    const cooldownLength = normalizeDuration(item.candidate.entry.cooldown);
    const hash = entryHash(item.candidate.entry);
    if (stickyLength > 0) {
      upsertRuntimeEffect(sticky, { entryId: item.candidate.id, entryHash: hash, start: chatLength, end: chatLength + stickyLength });
    }
    if (cooldownLength > 0 && stickyLength === 0) {
      upsertRuntimeEffect(cooldown, { entryId: item.candidate.id, entryHash: hash, start: chatLength + 1, end: chatLength + cooldownLength });
    }
  }
  state.sticky = sticky;
  state.cooldown = cooldown;
}

function transitionExpiredStickyToCooldown(
  candidates: readonly CandidateEntry[],
  currentState: WorldInfoRuntimeState,
  nextState: WorldInfoRuntimeState,
  chatLength: number,
  activationTrace: WorldInfoActivationTraceEntry[],
): void {
  const nextSticky = [...(nextState.sticky ?? [])].filter((effect) => effect.end >= chatLength);
  const nextCooldown = [...(nextState.cooldown ?? [])];
  for (const effect of currentState.sticky ?? []) {
    if (effect.end >= chatLength || effect.protected === true) {
      continue;
    }
    const candidate = candidates.find((item) => item.id === effect.entryId || entryHash(item.entry) === effect.entryHash);
    if (candidate === undefined) {
      continue;
    }
    const cooldownLength = normalizeDuration(candidate.entry.cooldown);
    if (cooldownLength <= 0) {
      continue;
    }
    const cooldownEffect = {
      entryId: candidate.id,
      entryHash: entryHash(candidate.entry),
      start: effect.end + 1,
      end: effect.end + cooldownLength,
      protected: true,
    };
    if (cooldownEffect.end >= chatLength) {
      upsertRuntimeEffect(nextCooldown, cooldownEffect);
    }
    activationTrace.push(
      traceActivation(
        candidate,
        false,
        { activated: false, reason: `sticky expired; protected cooldown until chatLength ${cooldownEffect.end}`, code: 'protected_cooldown_transition', matchedKeys: [], matchedSecondaryKeys: [] },
        0,
      ),
    );
  }
  nextState.sticky = nextSticky;
  nextState.cooldown = nextCooldown;
}

function upsertRuntimeEffect(effects: WorldInfoRuntimeEffectState[], effect: WorldInfoRuntimeEffectState): void {
  const index = effects.findIndex((item) => item.entryId === effect.entryId || item.entryHash === effect.entryHash);
  if (index >= 0) {
    effects[index] = effect;
  } else {
    effects.push(effect);
  }
}

function normalizeDuration(value: WorldInfoEntry['sticky'] | WorldInfoEntry['cooldown']): number {
  if (value === true) {
    return 1;
  }
  if (value === false || value === undefined) {
    return 0;
  }
  return normalizeNonNegativeInteger(value);
}

function normalizeNonNegativeInteger(value: number | string | undefined): number {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 0;
  }
  return Math.floor(numeric);
}

function entryHash(entry: WorldInfoEntry): string {
  return stableHash(`${normalizeStringArray(entry.key ?? entry.keys).join('\u0001')}\u0002${entry.content}`);
}

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function normalizeProbability(value: WorldInfoEntry['probability']): number {
  const probability = Number(value ?? 100);
  if (!Number.isFinite(probability)) {
    return 100;
  }
  return Math.min(100, Math.max(0, probability));
}

function normalizeBoolean(value: boolean | number | string | undefined): boolean | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(normalized)) {
    return true;
  }
  if (['false', '0', 'no', 'off', ''].includes(normalized)) {
    return false;
  }
  return undefined;
}

function matchEntry(entry: WorldInfoEntry, scanText: string, iteration: number, context: MatchContext): MatchResult {
  if (entry.disable === true || entry.disabled === true) {
    return { activated: false, reason: 'disabled', code: 'disabled', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  const decorator = readActivationDecorator(entry);
  if (decorator === 'dont_activate') {
    return { activated: false, reason: 'decorator @@dont_activate blocked entry', code: 'decorator_blocked', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  const triggerResult = generationTriggerMatches(entry, context.generationType);
  if (!triggerResult.matches) {
    return {
      activated: false,
      reason: `generation trigger mismatch for ${context.generationType}`,
      code: 'trigger_mismatch',
      matchedKeys: [],
      matchedSecondaryKeys: [],
    };
  }

  if (!characterFilterMatches(entry, context.characterName, context.characterTags)) {
    return {
      activated: false,
      reason: 'character filter mismatch',
      code: 'character_filter_mismatch',
      matchedKeys: [],
      matchedSecondaryKeys: [],
    };
  }

  if (entry.delayUntilRecursion === true && iteration === 0) {
    return { activated: false, reason: 'delayUntilRecursion waiting for recursive scan', code: 'delay_until_recursion', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  if (typeof entry.delayUntilRecursion === 'number' && iteration < entry.delayUntilRecursion) {
    return { activated: false, reason: `delayUntilRecursion waiting until iteration ${entry.delayUntilRecursion}`, code: 'delay_until_recursion', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  if (decorator === 'activate') {
    return { activated: true, reason: 'decorator @@activate forced entry', code: 'decorator_forced', matchedKeys: [], matchedSecondaryKeys: [] };
  }

  const scanFlagText = buildScanFlagText(entry, context.scanFlagTexts);
  const localScanBase = context.minActivationScan ? scanText : limitScanLines(scanText, entry.scanDepth ?? entry.scan_depth);
  const localScan = scanFlagText.length === 0 ? localScanBase : `${localScanBase}\n${scanFlagText}`;
  const primaryKeys = entry.key ?? entry.keys ?? [];
  const secondaryKeys = entry.keysecondary ?? entry.secondaryKeys ?? [];
  const caseSensitive = entry.caseSensitive ?? entry.case_sensitive ?? false;
  const wholeWords = entry.matchWholeWords ?? entry.match_whole_words ?? false;
  const matchedKeys = entry.constant === true ? [] : matchingKeys(primaryKeys, localScan, caseSensitive, wholeWords);
  const reasonPrefix = context.minActivationScan ? 'min activation scan ' : scanFlagText.length > 0 ? 'scan flag match ' : '';
  const successCode = context.minActivationScan ? 'min_activation_scan' : scanFlagText.length > 0 ? 'scan_flag_match' : 'key_match';

  if (entry.constant !== true && primaryKeys.length > 0 && matchedKeys.length === 0) {
    return { activated: false, reason: `${reasonPrefix}primary keys did not match`.trim(), code: 'key_mismatch', matchedKeys, matchedSecondaryKeys: [] };
  }

  if (entry.constant !== true && primaryKeys.length === 0) {
    return { activated: false, reason: 'no primary keys', code: 'key_mismatch', matchedKeys, matchedSecondaryKeys: [] };
  }

  const matchedSecondaryKeys = matchingKeys(secondaryKeys, localScan, caseSensitive, wholeWords);
  const logic = normalizeLogic(entry.logic ?? (isWorldInfoLogic(entry.selectiveLogic) || typeof entry.selectiveLogic === 'number' ? entry.selectiveLogic : undefined));
  if (secondaryKeys.length > 0 && !secondaryLogicMatches(logic, secondaryKeys.length, matchedSecondaryKeys.length)) {
    return {
      activated: false,
      reason: `${reasonPrefix}secondary keys failed ${logic}`.trim(),
      code: 'key_mismatch',
      matchedKeys,
      matchedSecondaryKeys,
    };
  }

  return { activated: true, reason: `${reasonPrefix}${entry.constant === true ? 'constant entry' : 'keys matched'}`.trim(), code: successCode, matchedKeys, matchedSecondaryKeys };
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

function isWorldInfoLogic(value: unknown): value is WorldInfoLogic {
  return value === 'AND_ANY' || value === 'NOT_ALL' || value === 'NOT_ANY' || value === 'AND_ALL';
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

function rememberSkipped(skipped: Map<string, WorldInfoSkippedEntry>, candidate: CandidateEntry, reason: string, code?: string): void {
  if (!skipped.has(candidate.id)) {
    skipped.set(candidate.id, omitUndefined({ id: candidate.id, book: candidate.bookName, reason, code }));
  }
}

function normalizeStringArray(value: readonly string[] | string | number | undefined): readonly string[] {
  if (value === undefined) {
    return [];
  }
  if (typeof value === 'number') {
    return [String(value)];
  }
  if (typeof value === 'string') {
    return value
      .split(/[|,]/u)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  return value.map((item) => String(item).trim()).filter((item) => item.length > 0);
}

function normalizeComparable(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized === undefined || normalized === '' ? undefined : normalized;
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
