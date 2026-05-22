// Deep port of SillyTavern World Info primitives.
//
// References (read at port time):
//   public/scripts/world-info.js — full pipeline (4478-5355)
//   public/scripts/world-info.js — `parseRegexFromString` (2821-2846)
//   public/scripts/world-info.js — `matchKeys` (337-365)
//   public/scripts/world-info.js — decorator parsing (4540-4585)
//   public/scripts/world-info.js — routing (5072-5163)
//   public/scripts/utils.js — `escapeRegex` (1378-1380)
//
// This module exposes pure ST-faithful primitives the higher-level evaluator
// can plug into. They are deterministic, side-effect free, and contain no
// network/secret/tokenizer dependencies.

// ---------------------------------------------------------------------------
// Position enum (world_info_position)

export const WORLD_INFO_POSITION = {
  before: 0,
  after: 1,
  ANTop: 2,
  ANBottom: 3,
  atDepth: 4,
  EMTop: 5,
  EMBottom: 6,
  outlet: 7,
} as const;
export type WorldInfoPositionValue = (typeof WORLD_INFO_POSITION)[keyof typeof WORLD_INFO_POSITION];

// wi_anchor_position (example messages)
export const WI_ANCHOR_POSITION = {
  before: 0,
  after: 1,
} as const;
export type WiAnchorPosition = (typeof WI_ANCHOR_POSITION)[keyof typeof WI_ANCHOR_POSITION];

// extension_prompt_roles for atDepth role buckets
export const EXTENSION_PROMPT_ROLE = {
  SYSTEM: 0,
  USER: 1,
  ASSISTANT: 2,
} as const;
export type ExtensionPromptRole = (typeof EXTENSION_PROMPT_ROLE)[keyof typeof EXTENSION_PROMPT_ROLE];

// selectiveLogic enum
export const SELECTIVE_LOGIC = {
  AND_ANY: 0,
  NOT_ALL: 1,
  NOT_ANY: 2,
  AND_ALL: 3,
} as const;
export type SelectiveLogicValue = (typeof SELECTIVE_LOGIC)[keyof typeof SELECTIVE_LOGIC];

// Generation triggers
export const WI_GENERATION_TRIGGER = {
  normal: 'normal',
  continue: 'continue',
  impersonate: 'impersonate',
  swipe: 'swipe',
  regenerate: 'regenerate',
  quiet: 'quiet',
} as const;
export type WIGenerationTrigger = (typeof WI_GENERATION_TRIGGER)[keyof typeof WI_GENERATION_TRIGGER];

// ---------------------------------------------------------------------------
// parseRegexFromString — accepts /.../flags with gimsuy flags only.
// Rejects unescaped / inside pattern. Returns null for malformed.

const REGEX_FLAG_PATTERN = /^[gimsuy]*$/;

export function parseRegexFromString(input: string): RegExp | null {
  const m = input.match(/^\/(.*)\/([gimsuy]*)$/s);
  if (!m) return null;
  const [, pattern, flags] = m;
  if (pattern === undefined || flags === undefined) return null;
  if (!REGEX_FLAG_PATTERN.test(flags)) return null;
  // Reject unescaped / inside the pattern body
  let escaped = false;
  for (const ch of pattern) {
    if (escaped) { escaped = false; continue; }
    if (ch === '\\') { escaped = true; continue; }
    if (ch === '/') return null;
  }
  try {
    return new RegExp(pattern, flags);
  } catch {
    return null;
  }
}

export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ---------------------------------------------------------------------------
// matchKeys — port of world-info.js matchKeys(haystack, needle, entry).

export interface MatchKeysOptions {
  caseSensitive?: boolean;
  matchWholeWords?: boolean;
}

export function matchKeys(haystack: string, needle: string, options: MatchKeysOptions = {}): boolean {
  if (!haystack || !needle) return false;

  // Try regex pattern first; if valid, regex bypasses case/wholeWord settings entirely.
  const re = parseRegexFromString(needle);
  if (re !== null) {
    return re.test(haystack);
  }

  const cs = options.caseSensitive === true;
  const ww = options.matchWholeWords === true;
  const hayN = cs ? haystack : haystack.toLowerCase();
  const needN = cs ? needle : needle.toLowerCase();

  if (ww) {
    // Multi-word needles use substring includes per ST behavior
    if (needN.split(/\s+/).length > 1) {
      return hayN.includes(needN);
    }
    // Single-token needles use boundary regex
    const pattern = new RegExp(`(?:^|\\W)(${escapeRegex(needN)})(?:$|\\W)`, cs ? '' : 'i');
    return pattern.test(haystack);
  }

  return hayN.includes(needN);
}

// ---------------------------------------------------------------------------
// selectiveLogicMatches — combines primary key match with secondary keys logic.

export function selectiveLogicMatches(
  haystack: string,
  primaryMatched: boolean,
  secondaryKeys: readonly string[],
  logic: SelectiveLogicValue,
  options: MatchKeysOptions = {},
): boolean {
  if (!primaryMatched) return false;
  if (secondaryKeys.length === 0) return true;
  const matches = secondaryKeys.map((k) => matchKeys(haystack, k, options));
  switch (logic) {
    case SELECTIVE_LOGIC.AND_ANY:
      return matches.some(Boolean);
    case SELECTIVE_LOGIC.NOT_ALL:
      return matches.some((m) => !m);
    case SELECTIVE_LOGIC.NOT_ANY:
      return matches.every((m) => !m);
    case SELECTIVE_LOGIC.AND_ALL:
      return matches.every(Boolean);
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// parseDecorators — top-of-content `@@...` lines, `@@@` is escape.
//
// ST recognizes only @@activate and @@dont_activate at the top of content.
// Returns the decorators found and the content with leading decorator lines stripped.
// `@@@activate` is treated as escaped, kept as `@@activate` literal text in content.

const KNOWN_DECORATORS = new Set(['@@activate', '@@dont_activate']);

export interface DecoratorParseResult {
  readonly decorators: readonly string[];
  readonly content: string;
}

export function parseDecorators(content: string): DecoratorParseResult {
  const lines = content.split(/\r?\n/);
  const decorators: string[] = [];
  let consumed = 0;
  for (const line of lines) {
    const trimmed = line.trimStart();
    // @@@ escape: treat as literal, stop decorator parsing, unescape one @
    if (trimmed.startsWith('@@@')) {
      // Unescape: reduce one @ in the resulting line; remaining content is preserved as-is
      const unescaped = lines.slice(consumed).map((l, i) =>
        i === 0 ? l.replace(/@@@/, '@@') : l,
      ).join('\n');
      return { decorators, content: unescaped };
    }
    if (!trimmed.startsWith('@@')) break;
    const token = trimmed.split(/\s+/)[0]!;
    if (KNOWN_DECORATORS.has(token)) {
      decorators.push(token);
    }
    consumed++;
  }
  return { decorators, content: lines.slice(consumed).join('\n') };
}

// ---------------------------------------------------------------------------
// Activation precedence (ST order, openai.js scan loop):
//   1. @@activate    → force-activate
//   2. @@dont_activate → force-skip
//   3. external activation (caller-supplied)
//   4. constant entry
//   5. sticky-active
//   6. keyword + selective logic match
//
// Returns the activation reason or undefined if not activated.

export type ActivationReason =
  | 'decorator_activate'
  | 'decorator_dont_activate'
  | 'external'
  | 'constant'
  | 'sticky'
  | 'keyword'
  | undefined;

export interface DecideActivationInput {
  readonly decorators: readonly string[];
  readonly externallyActivated: boolean;
  readonly constant: boolean;
  readonly stickyActive: boolean;
  readonly keywordMatched: boolean;
}

export function decideActivation(input: DecideActivationInput): ActivationReason {
  if (input.decorators.includes('@@activate')) return 'decorator_activate';
  if (input.decorators.includes('@@dont_activate')) return 'decorator_dont_activate';
  if (input.externallyActivated) return 'external';
  if (input.constant) return 'constant';
  if (input.stickyActive) return 'sticky';
  if (input.keywordMatched) return 'keyword';
  return undefined;
}

// ---------------------------------------------------------------------------
// Timed effects state machine (sticky / cooldown / delay).
//
// Persisted in chat_metadata.timedWorldInfo.{sticky,cooldown}.
// Each effect record: { hash, start, end, protected }.
//
// Activation order:
//   1. delay: skip if chatLength < entry.delay
//   2. sticky: if active record exists, force activate (bypass keyword check)
//   3. cooldown: if active record exists, skip (unless sticky bypass)
//   4. on activation, set sticky if entry.sticky > 0
//   5. when sticky ends, immediately create cooldown with `protected=true`

export interface TimedEffectRecord {
  hash: number;
  start: number;
  end: number;
  protected?: boolean;
}

export interface TimedEffectsState {
  sticky: TimedEffectRecord[];
  cooldown: TimedEffectRecord[];
}

export function emptyTimedEffectsState(): TimedEffectsState {
  return { sticky: [], cooldown: [] };
}

export function findTimedEffect(
  records: readonly TimedEffectRecord[] | undefined,
  hash: number,
  chatLength: number,
): TimedEffectRecord | undefined {
  return records?.find((r) => r.hash === hash && chatLength >= r.start && chatLength < r.end);
}

export function isStickyActive(state: TimedEffectsState, hash: number, chatLength: number): boolean {
  return findTimedEffect(state.sticky, hash, chatLength) !== undefined;
}

export function isCooldownActive(state: TimedEffectsState, hash: number, chatLength: number): boolean {
  return findTimedEffect(state.cooldown, hash, chatLength) !== undefined;
}

export function isDelayActive(entry: { delay?: number | null }, chatLength: number): boolean {
  return typeof entry.delay === 'number' && entry.delay > 0 && chatLength < entry.delay;
}

export interface ApplyActivationInput {
  hash: number;
  chatLength: number;
  sticky?: number | null;
  cooldown?: number | null;
}

// Mutates state to record sticky+cooldown after a successful activation.
export function applyActivationToTimedEffects(
  state: TimedEffectsState,
  input: ApplyActivationInput,
): void {
  const { hash, chatLength, sticky, cooldown } = input;
  if (typeof sticky === 'number' && sticky > 0) {
    if (!findTimedEffect(state.sticky, hash, chatLength)) {
      state.sticky = [...state.sticky, { hash, start: chatLength, end: chatLength + sticky }];
    }
  }
  if (typeof cooldown === 'number' && cooldown > 0) {
    // Cooldown attaches to the moment sticky ends (or activation if no sticky).
    const stickyRec = findTimedEffect(state.sticky, hash, chatLength);
    const start = stickyRec ? stickyRec.end : chatLength + 1;
    if (!state.cooldown.some((r) => r.hash === hash && r.start === start)) {
      state.cooldown = [...state.cooldown, { hash, start, end: start + cooldown, protected: stickyRec !== undefined }];
    }
  }
}

// ---------------------------------------------------------------------------
// Routing — port of world-info.js prompt assembly (5072-5163).
//
// ST sorts activated entries by `order` descending then `unshift`s into each
// bucket. Net effect: final bucket order is ascending by `order`.
//
// Buckets routed:
//   - before / after / EMTop / EMBottom / outlet — flat content[]
//   - ANTop / ANBottom — flat, joined via author note patch
//   - atDepth — keyed by (depth, role), entries merged with `\n`

export interface RoutableEntry {
  readonly content: string;
  readonly position: WorldInfoPositionValue;
  readonly order?: number;
  readonly depth?: number;
  readonly role?: ExtensionPromptRole;
  readonly outletName?: string;
}

export interface AuthorNotePatchInput {
  readonly originalAuthorNote?: string;
}

export interface RoutedDepthBucket {
  readonly depth: number;
  readonly role: ExtensionPromptRole;
  readonly content: string;
}

export interface RoutedOutletBucket {
  readonly name: string;
  readonly content: readonly string[];
}

export interface RoutedAuthorNotePatch {
  readonly top: string;
  readonly bottom: string;
  readonly originalAuthorNote: string;
  readonly patched: string;
}

export interface RoutedEntries {
  readonly before: readonly string[];
  readonly after: readonly string[];
  readonly examples: { readonly position: WiAnchorPosition; readonly content: string }[];
  readonly atDepth: readonly RoutedDepthBucket[];
  readonly outlets: readonly RoutedOutletBucket[];
  readonly authorNote: RoutedAuthorNotePatch;
}

export function routeActivatedEntries(
  activated: readonly RoutableEntry[],
  options: AuthorNotePatchInput = {},
): RoutedEntries {
  // Sort by order descending. ST then unshift into each bucket so net effect is ascending.
  const sorted = [...activated].sort((a, b) => (b.order ?? 0) - (a.order ?? 0));

  const before: string[] = [];
  const after: string[] = [];
  const anTop: string[] = [];
  const anBottom: string[] = [];
  const examples: { position: WiAnchorPosition; content: string }[] = [];
  const depthMap = new Map<string, { depth: number; role: ExtensionPromptRole; parts: string[] }>();
  const outletMap = new Map<string, string[]>();

  for (const entry of sorted) {
    switch (entry.position) {
      case WORLD_INFO_POSITION.before:
        before.unshift(entry.content);
        break;
      case WORLD_INFO_POSITION.after:
        after.unshift(entry.content);
        break;
      case WORLD_INFO_POSITION.ANTop:
        anTop.unshift(entry.content);
        break;
      case WORLD_INFO_POSITION.ANBottom:
        anBottom.unshift(entry.content);
        break;
      case WORLD_INFO_POSITION.EMTop:
        examples.unshift({ position: WI_ANCHOR_POSITION.before, content: entry.content });
        break;
      case WORLD_INFO_POSITION.EMBottom:
        examples.unshift({ position: WI_ANCHOR_POSITION.after, content: entry.content });
        break;
      case WORLD_INFO_POSITION.atDepth: {
        const depth = entry.depth ?? 0;
        const role = entry.role ?? EXTENSION_PROMPT_ROLE.SYSTEM;
        const key = `${depth}::${role}`;
        const bucket = depthMap.get(key) ?? { depth, role, parts: [] };
        bucket.parts.unshift(entry.content);
        depthMap.set(key, bucket);
        break;
      }
      case WORLD_INFO_POSITION.outlet: {
        const name = entry.outletName ?? '__default__';
        const bucket = outletMap.get(name) ?? [];
        bucket.push(entry.content);
        outletMap.set(name, bucket);
        break;
      }
    }
  }

  const originalAN = options.originalAuthorNote ?? '';
  const topJoined = anTop.join('\n');
  const bottomJoined = anBottom.join('\n');
  const patched = [topJoined, originalAN, bottomJoined].filter((s) => s.length > 0).join('\n');

  return {
    before,
    after,
    examples,
    atDepth: Array.from(depthMap.values()).map((b) => ({
      depth: b.depth,
      role: b.role,
      content: b.parts.join('\n'),
    })),
    outlets: Array.from(outletMap.entries()).map(([name, content]) => ({ name, content })),
    authorNote: {
      top: topJoined,
      bottom: bottomJoined,
      originalAuthorNote: originalAN,
      patched,
    },
  };
}

// ---------------------------------------------------------------------------
// Hash helper for timed effects (deterministic, JSON-stable).

export function entryHash(entry: { uid?: number | string; content?: string; key?: readonly string[] }): number {
  const seed = `${entry.uid ?? ''}|${entry.content ?? ''}|${(entry.key ?? []).join(',')}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return h;
}
