import { ST_PROMPT_MANAGER_IDENTIFIERS } from '@ydltavern/types/st';

export type PromptManagerRole = 'system' | 'user' | 'assistant' | 'tool' | (string & Record<never, never>);

export interface PromptManagerPrompt {
  readonly identifier: string;
  readonly name?: string;
  readonly content: string;
  readonly enabled?: boolean;
  readonly marker?: boolean;
  readonly role?: PromptManagerRole;
  readonly injection_position?: string | number;
  readonly injection_depth?: number;
  readonly injection_order?: number;
  readonly forbid_overrides?: boolean;
  readonly generation_trigger?: readonly string[];
}

export interface PromptOrderEntry {
  readonly identifier: string;
  readonly enabled?: boolean;
  readonly order?: number;
  readonly marker?: boolean;
  readonly role?: PromptManagerRole;
  readonly injection_position?: string | number;
  readonly injection_depth?: number;
  readonly injection_order?: number;
  readonly forbid_overrides?: boolean;
  readonly generation_trigger?: readonly string[];
}

export interface PromptCollectionPrompt extends PromptManagerPrompt {
  readonly enabled: boolean;
  readonly marker: boolean;
  readonly order: number;
  readonly source: 'input' | 'default' | 'fallback' | 'anchor';
  readonly anchor?: boolean;
}

export type PromptOverrideStatus =
  | 'not_requested'
  | 'applied'
  | 'blocked_forbidden'
  | 'blocked_disabled'
  | 'missing_prompt';

export interface PromptOverrideDiagnostic {
  readonly identifier: 'main' | 'jailbreak';
  readonly requested: boolean;
  readonly status: PromptOverrideStatus;
  readonly reason?: string;
}

export interface PromptManagerDiagnostics {
  readonly unknownPromptIds: readonly string[];
  readonly disabledSkipped: readonly string[];
  readonly disabledAnchors: readonly string[];
  readonly triggerSkipped: readonly string[];
  readonly missingPromptFallbacks: readonly string[];
  readonly overrides: {
    readonly main: PromptOverrideDiagnostic;
    readonly jailbreak: PromptOverrideDiagnostic;
  };
  readonly warnings: readonly string[];
}

export interface CompilePromptCollectionInput {
  readonly prompts?: unknown;
  readonly prompt_order?: unknown;
  readonly promptOrder?: unknown;
  readonly generation_trigger?: string | readonly string[];
  readonly generationTrigger?: string | readonly string[];
  readonly generationTriggers?: readonly string[];
  readonly trigger?: string | readonly string[];
  readonly main_prompt?: string;
  readonly mainPrompt?: string;
  readonly jailbreak_prompt?: string;
  readonly jailbreakPrompt?: string;
  readonly overrides?: {
    readonly main?: string;
    readonly jailbreak?: string;
  };
}

export interface CompilePromptCollectionResult {
  readonly prompts: readonly PromptCollectionPrompt[];
  readonly collection: readonly PromptCollectionPrompt[];
  readonly diagnostics: PromptManagerDiagnostics;
}

type PromptIdentifier = (typeof ST_PROMPT_MANAGER_IDENTIFIERS)[number] | (string & Record<never, never>);

type MutableCollectionPrompt = Omit<PromptCollectionPrompt, 'content'> & { content: string };

type NormalizedOrderEntry = PromptOrderEntry & {
  readonly inlinePrompt?: PromptManagerPrompt;
};

const DEFAULT_PROMPT_ORDER = [
  'main',
  'worldInfoBefore',
  'worldInfoAfter',
  'enhanceDefinitions',
  'charDescription',
  'charPersonality',
  'scenario',
  'personaDescription',
  'nsfw',
  'dialogueExamples',
  'chatHistory',
  'jailbreak',
] as const satisfies readonly PromptIdentifier[];

const DEFAULT_MARKER_IDENTIFIERS: ReadonlySet<string> = new Set([
  'worldInfoBefore',
  'worldInfoAfter',
  'enhanceDefinitions',
  'charDescription',
  'charPersonality',
  'scenario',
  'personaDescription',
  'dialogueExamples',
  'chatHistory',
]);

const DEFAULT_PROMPTS: readonly PromptManagerPrompt[] = DEFAULT_PROMPT_ORDER.map((identifier) => ({
  identifier,
  content: '',
  marker: DEFAULT_MARKER_IDENTIFIERS.has(identifier),
  role: 'system',
}));

const DEFAULT_PROMPT_IDS: ReadonlySet<string> = new Set(DEFAULT_PROMPTS.map((prompt) => prompt.identifier));

export function compilePromptCollection(input: CompilePromptCollectionInput = {}): CompilePromptCollectionResult {
  const inputRecord = asRecord(input);
  const inputPrompts = normalizePrompts(inputRecord?.prompts);
  const inputPromptMap = new Map(inputPrompts.map((prompt) => [prompt.identifier, prompt]));
  const defaultPromptMap = new Map(DEFAULT_PROMPTS.map((prompt) => [prompt.identifier, prompt]));
  const explicitOrderEntries = normalizePromptOrder(inputRecord?.prompt_order ?? inputRecord?.promptOrder);
  const orderEntries = explicitOrderEntries.length > 0
    ? explicitOrderEntries
    : buildDefaultOrderEntries(inputPrompts);
  const activeTriggers = readStringArrayFromValue(
    inputRecord?.generation_trigger
      ?? inputRecord?.generationTrigger
      ?? inputRecord?.generationTriggers
      ?? inputRecord?.trigger,
  );

  const collection: MutableCollectionPrompt[] = [];
  const unknownPromptIds: string[] = [];
  const disabledSkipped: string[] = [];
  const disabledAnchors: string[] = [];
  const triggerSkipped: string[] = [];
  const missingPromptFallbacks: string[] = [];
  const warnings: string[] = [];

  orderEntries.forEach((entry, index) => {
    const inputPrompt = inputPromptMap.get(entry.identifier) ?? entry.inlinePrompt;
    const defaultPrompt = defaultPromptMap.get(entry.identifier);
    const prompt = inputPrompt ?? defaultPrompt;
    const enabled = readBoolean(entry.enabled) ?? readBoolean(prompt?.enabled) ?? true;

    if (enabled === false) {
      if (entry.identifier === 'main') {
        disabledAnchors.push(entry.identifier);
        collection.push({
          identifier: entry.identifier,
          content: '',
          enabled: false,
          marker: true,
          order: entry.order ?? index,
          source: 'anchor',
          anchor: true,
        });
        return;
      }

      disabledSkipped.push(entry.identifier);
      return;
    }

    const generationTriggers = entry.generation_trigger ?? prompt?.generation_trigger;
    if (!matchesGenerationTrigger(generationTriggers, activeTriggers)) {
      triggerSkipped.push(entry.identifier);
      return;
    }

    if (prompt === undefined) {
      unknownPromptIds.push(entry.identifier);
      warnings.push(`Unknown prompt identifier: ${entry.identifier}`);
      return;
    }

    const source = inputPrompt !== undefined
      ? 'input'
      : explicitOrderEntries.length > 0
        ? 'fallback'
        : 'default';
    if (source === 'fallback') {
      missingPromptFallbacks.push(entry.identifier);
    }

    collection.push(mergePromptIntoCollection(prompt, entry, index, source));
  });

  const overrides = {
    main: applyOverride('main', collection, readOverride(inputRecord, 'main')),
    jailbreak: applyOverride('jailbreak', collection, readOverride(inputRecord, 'jailbreak')),
  };

  const readonlyCollection = collection as readonly PromptCollectionPrompt[];
  return {
    prompts: readonlyCollection,
    collection: readonlyCollection,
    diagnostics: {
      unknownPromptIds,
      disabledSkipped,
      disabledAnchors,
      triggerSkipped,
      missingPromptFallbacks,
      overrides,
      warnings,
    },
  };
}

function buildDefaultOrderEntries(inputPrompts: readonly PromptManagerPrompt[]): readonly NormalizedOrderEntry[] {
  const defaultEntries: NormalizedOrderEntry[] = DEFAULT_PROMPT_ORDER.map((identifier, index) => ({
    identifier,
    enabled: true,
    order: index,
  }));
  const customEntries = inputPrompts
    .filter((prompt) => !DEFAULT_PROMPT_IDS.has(prompt.identifier))
    .map((prompt, customIndex): NormalizedOrderEntry => ({
      identifier: prompt.identifier,
      enabled: prompt.enabled,
      order: DEFAULT_PROMPT_ORDER.length + customIndex,
    }));

  return [...defaultEntries, ...customEntries];
}

function mergePromptIntoCollection(
  prompt: PromptManagerPrompt,
  entry: PromptOrderEntry,
  fallbackIndex: number,
  source: PromptCollectionPrompt['source'],
): MutableCollectionPrompt {
  return omitUndefined({
    identifier: prompt.identifier,
    name: prompt.name,
    content: prompt.content,
    enabled: true,
    marker: readBoolean(entry.marker) ?? readBoolean(prompt.marker) ?? DEFAULT_MARKER_IDENTIFIERS.has(prompt.identifier),
    role: entry.role ?? prompt.role,
    injection_position: entry.injection_position ?? prompt.injection_position,
    injection_depth: entry.injection_depth ?? prompt.injection_depth,
    injection_order: entry.injection_order ?? prompt.injection_order,
    forbid_overrides: readBoolean(entry.forbid_overrides) ?? readBoolean(prompt.forbid_overrides),
    generation_trigger: entry.generation_trigger ?? prompt.generation_trigger,
    order: entry.order ?? fallbackIndex,
    source,
  });
}

function applyOverride(
  identifier: 'main' | 'jailbreak',
  collection: MutableCollectionPrompt[],
  overrideContent: string | undefined,
): PromptOverrideDiagnostic {
  if (overrideContent === undefined) {
    return { identifier, requested: false, status: 'not_requested' };
  }

  const prompt = collection.find((item) => item.identifier === identifier);
  if (prompt === undefined) {
    return {
      identifier,
      requested: true,
      status: 'missing_prompt',
      reason: `${identifier} prompt is not present in the effective collection`,
    };
  }

  if (prompt.enabled === false) {
    return {
      identifier,
      requested: true,
      status: 'blocked_disabled',
      reason: `${identifier} prompt is disabled`,
    };
  }

  if (prompt.forbid_overrides === true) {
    return {
      identifier,
      requested: true,
      status: 'blocked_forbidden',
      reason: `${identifier} prompt forbids overrides`,
    };
  }

  prompt.content = overrideContent.includes('{{original}}')
    ? overrideContent.split('{{original}}').join(prompt.content)
    : overrideContent;
  return { identifier, requested: true, status: 'applied' };
}

function normalizePrompts(value: unknown): readonly PromptManagerPrompt[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      const prompt = normalizePrompt(item);
      return prompt === undefined ? [] : [prompt];
    });
  }

  const record = asRecord(value);
  if (record === undefined) {
    return [];
  }

  return Object.entries(record).flatMap(([identifier, rawPrompt]) => {
    const promptRecord = asRecord(rawPrompt);
    const prompt = promptRecord === undefined
      ? normalizePrompt({ identifier, content: rawPrompt })
      : normalizePrompt({ identifier, ...promptRecord });
    return prompt === undefined ? [] : [prompt];
  });
}

function normalizePrompt(value: unknown): PromptManagerPrompt | undefined {
  const record = asRecord(value);
  if (record === undefined) {
    return undefined;
  }

  const identifier = readString(record, ['identifier', 'id', 'prompt_id', 'promptId', 'name']);
  if (identifier === undefined || identifier.trim() === '') {
    return undefined;
  }

  const content = readString(record, ['content', 'prompt', 'text', 'value', 'message'])
    ?? readString(record, ['system_prompt']);

  return omitUndefined({
    identifier,
    name: readString(record, ['name', 'label']),
    content: content ?? '',
    enabled: readBoolean(record.enabled),
    marker: readBoolean(record.marker),
    role: readRole(record.role),
    injection_position: readStringOrNumber(record.injection_position ?? record.injectionPosition),
    injection_depth: readNumber(record.injection_depth ?? record.injectionDepth),
    injection_order: readNumber(record.injection_order ?? record.injectionOrder),
    forbid_overrides: readBoolean(record.forbid_overrides ?? record.forbidOverrides),
    generation_trigger: readGenerationTriggers(record),
  });
}

function normalizePromptOrder(value: unknown): readonly NormalizedOrderEntry[] {
  const directEntries = normalizeOrderEntries(value);
  if (directEntries.length > 0) {
    return directEntries;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const record = asRecord(item);
      const nested = normalizeOrderEntries(record?.order ?? record?.prompts ?? record?.prompt_order);
      if (nested.length > 0) {
        return nested;
      }
    }
  }

  const record = asRecord(value);
  return normalizeOrderEntries(record?.order ?? record?.prompts ?? record?.prompt_order);
}

function normalizeOrderEntries(value: unknown): readonly NormalizedOrderEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index) => {
    const entry = normalizeOrderEntry(item, index);
    return entry === undefined ? [] : [entry];
  });
}

function normalizeOrderEntry(value: unknown, index: number): NormalizedOrderEntry | undefined {
  if (typeof value === 'string') {
    return { identifier: value, order: index };
  }

  const record = asRecord(value);
  if (record === undefined) {
    return undefined;
  }

  const identifier = readString(record, ['identifier', 'id', 'prompt_id', 'promptId', 'prompt', 'name']);
  if (identifier === undefined || identifier.trim() === '') {
    return undefined;
  }

  const inlinePrompt = normalizePrompt({ identifier, ...record });
  const hasInlineContent = readString(record, ['content', 'text', 'value', 'message']) !== undefined;

  return omitUndefined({
    identifier,
    enabled: readBoolean(record.enabled),
    order: readNumber(record.order ?? record.position) ?? index,
    marker: readBoolean(record.marker),
    role: readRole(record.role),
    injection_position: readStringOrNumber(record.injection_position ?? record.injectionPosition),
    injection_depth: readNumber(record.injection_depth ?? record.injectionDepth),
    injection_order: readNumber(record.injection_order ?? record.injectionOrder),
    forbid_overrides: readBoolean(record.forbid_overrides ?? record.forbidOverrides),
    generation_trigger: readGenerationTriggers(record),
    inlinePrompt: hasInlineContent ? inlinePrompt : undefined,
  });
}

function matchesGenerationTrigger(
  promptTriggers: readonly string[] | undefined,
  activeTriggers: readonly string[] | undefined,
): boolean {
  if (promptTriggers === undefined || promptTriggers.length === 0) {
    return true;
  }
  if (activeTriggers === undefined || activeTriggers.length === 0) {
    return false;
  }

  const active = new Set(activeTriggers);
  return promptTriggers.some((trigger) => active.has(trigger));
}

function readOverride(record: Readonly<Record<string, unknown>> | undefined, identifier: 'main' | 'jailbreak'): string | undefined {
  if (record === undefined) {
    return undefined;
  }

  const overrides = asRecord(record.overrides);
  const overrideValue = readStringFromValue(overrides?.[identifier]);
  if (overrideValue !== undefined) {
    return overrideValue;
  }

  return identifier === 'main'
    ? readString(record, ['main_prompt', 'mainPrompt'])
    : readString(record, ['jailbreak_prompt', 'jailbreakPrompt']);
}

function readGenerationTriggers(record: Readonly<Record<string, unknown>>): readonly string[] | undefined {
  return readStringArrayFromValue(
    record.generation_trigger
      ?? record.generationTrigger
      ?? record.generation_triggers
      ?? record.generationTriggers
      ?? record.triggers
      ?? record.trigger,
  );
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as Readonly<Record<string, unknown>>
    : undefined;
}

function readString(record: Readonly<Record<string, unknown>>, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = readStringFromValue(record[key]);
    if (value !== undefined) {
      return value;
    }
  }
  return undefined;
}

function readStringFromValue(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function readRole(value: unknown): PromptManagerRole | undefined {
  return typeof value === 'string' && value.trim() !== '' ? value as PromptManagerRole : undefined;
}

function readBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') {
      return true;
    }
    if (value.toLowerCase() === 'false') {
      return false;
    }
  }
  return undefined;
}

function readNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

function readStringOrNumber(value: unknown): string | number | undefined {
  return typeof value === 'string' || typeof value === 'number' ? value : undefined;
}

function readStringArrayFromValue(value: unknown): readonly string[] | undefined {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value === 'string') {
    return value.trim() === '' ? [] : [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => typeof item === 'string' ? [item] : []);
  }
  return undefined;
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
