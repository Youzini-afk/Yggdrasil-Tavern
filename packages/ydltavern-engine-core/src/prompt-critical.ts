import type { MacroContext, MacroTraceEntry } from './macros.js';
import { substituteMacros } from './macros.js';
import type { CompilePromptCollectionInput, PromptCollectionPrompt, PromptManagerDiagnostics } from './prompt-manager.js';
import { compilePromptCollection } from './prompt-manager.js';
import type { PromptBlock, PromptBlockIdentifier, PromptMessageRole } from './prompt.js';
import type { EvaluateWorldInfoResult } from './world-info.js';

export interface PromptCriticalCharacterFields {
  readonly name?: string;
  readonly description?: string;
  readonly personality?: string;
  readonly scenario?: string;
  readonly creatorNotes?: string;
  readonly mesExamples?: string;
  readonly charDepthPrompt?: string;
}

export interface PromptCriticalAuthorNote {
  readonly content: string;
  readonly position?: 'top' | 'bottom';
}

export interface BuildPromptCriticalBlocksInput {
  readonly [key: string]: unknown;
  readonly userName?: string;
  readonly model?: string;
  readonly persona?: string;
  readonly character?: PromptCriticalCharacterFields;
  readonly authorNote?: string | PromptCriticalAuthorNote;
  readonly instruct?: string;
  readonly postHistory?: string;
  readonly jailbreak?: string;
  readonly worldInfo?: EvaluateWorldInfoResult;
  readonly macroContext?: MacroContext;
  readonly baseOrder?: number;
  readonly promptManager?: PromptCriticalPromptManagerInput;
  readonly prompt_manager?: PromptCriticalPromptManagerInput;
  readonly prompts?: unknown;
  readonly prompt_order?: unknown;
  readonly promptOrder?: unknown;
  readonly generationType?: string | readonly string[];
  readonly generation_type?: string | readonly string[];
  readonly main_prompt?: string;
  readonly mainPrompt?: string;
  readonly jailbreak_prompt?: string;
  readonly jailbreakPrompt?: string;
  readonly overrides?: CompilePromptCollectionInput['overrides'];
}

export interface PromptCriticalPromptManagerInput extends CompilePromptCollectionInput {
  readonly [key: string]: unknown;
  readonly generationType?: string | readonly string[];
  readonly generation_type?: string | readonly string[];
}

export interface PromptCriticalMarkerMapping {
  readonly blockIdentifier: PromptBlockIdentifier;
  readonly promptIdentifier: string;
  readonly marker: boolean;
  readonly source: PromptCollectionPrompt['source'] | 'internal';
  readonly order: number;
  readonly field?: string;
}

export interface PromptCriticalDiagnostics {
  readonly includedBlocks: readonly PromptBlockIdentifier[];
  readonly skippedFields: readonly string[];
  readonly macroTrace: readonly MacroTraceEntry[];
  readonly warnings: readonly string[];
  readonly unsupported: readonly string[];
  readonly markerMapping: readonly PromptCriticalMarkerMapping[];
  readonly promptManager?: PromptManagerDiagnostics;
  readonly knownDeltas: readonly string[];
}

export interface BuildPromptCriticalBlocksResult {
  readonly blocks: readonly PromptBlock[];
  readonly diagnostics: PromptCriticalDiagnostics;
}

export function buildPromptCriticalBlocks(input: BuildPromptCriticalBlocksInput): BuildPromptCriticalBlocksResult {
  const baseOrder = input.baseOrder ?? 0;
  const blocks: PromptBlock[] = [];
  const includedBlocks: PromptBlockIdentifier[] = [];
  const skippedFields: string[] = [];
  const macroTrace: MacroTraceEntry[] = [];
  const warnings: string[] = [];
  const macroContext = buildMacroContext(input);
  const authorNote = normalizeAuthorNote(input.authorNote);
  const fieldMap = buildPromptCriticalFieldMap(input, authorNote, macroContext, macroTrace);
  const markerMapping: PromptCriticalMarkerMapping[] = [];
  const knownDeltas: string[] = [];
  const unsupported = [
    'Prompt-critical A2 preserves PromptManager prompt/order/injection metadata but does not implement full ST extension prompt semantics.',
    'WI atDepth/outlet buckets are surfaced in diagnostics but not depth-injected into chat history by buildPrompt.',
  ];

  const promptManagerInput = extractPromptManagerInput(input);
  if (promptManagerInput !== undefined) {
    const compiled = compilePromptCollection(normalizePromptManagerInput(promptManagerInput));

    for (const prompt of compiled.collection) {
      addPromptManagerBlock(blocks, includedBlocks, skippedFields, markerMapping, warnings, prompt, fieldMap, baseOrder);
    }

    addInternalDeltaBlock(
      blocks,
      includedBlocks,
      skippedFields,
      markerMapping,
      knownDeltas,
      'instruct',
      fieldMap.instruct?.content,
      baseOrder + 0,
    );
    addInternalDeltaBlock(
      blocks,
      includedBlocks,
      skippedFields,
      markerMapping,
      knownDeltas,
      'authorNote',
      fieldMap.authorNote?.content,
      baseOrder + 60,
    );
    addInternalDeltaBlock(
      blocks,
      includedBlocks,
      skippedFields,
      markerMapping,
      knownDeltas,
      'postHistory',
      fieldMap.postHistory?.content,
      baseOrder + 90,
    );

    addWorldInfoWarnings(input, warnings);
    return {
      blocks,
      diagnostics: {
        includedBlocks,
        skippedFields,
        macroTrace,
        warnings,
        unsupported,
        markerMapping,
        promptManager: compiled.diagnostics,
        knownDeltas,
      },
    };
  }

  addRawBlock(blocks, includedBlocks, 'instruct', fieldMap.instruct?.content, baseOrder + 0);
  addRawBlock(
    blocks,
    includedBlocks,
    'worldInfoBefore',
    fieldMap.worldInfoBefore?.content,
    baseOrder + 10,
  );
  addRawBlock(blocks, includedBlocks, 'personaDescription', fieldMap.personaDescription?.content, baseOrder + 20);
  addRawBlock(blocks, includedBlocks, 'charDescription', fieldMap.charDescription?.content, baseOrder + 30);
  addRawBlock(blocks, includedBlocks, 'charPersonality', fieldMap.charPersonality?.content, baseOrder + 40);
  addRawBlock(blocks, includedBlocks, 'scenario', fieldMap.scenario?.content, baseOrder + 50);
  addRawBlock(blocks, includedBlocks, 'authorNote', fieldMap.authorNote?.content, baseOrder + 60);
  addRawBlock(blocks, includedBlocks, 'worldInfoAfter', fieldMap.worldInfoAfter?.content, baseOrder + 80);
  addRawBlock(blocks, includedBlocks, 'postHistory', fieldMap.postHistory?.content, baseOrder + 90);

  addSkippedLegacyFields(skippedFields, fieldMap);
  addWorldInfoWarnings(input, warnings);

  return { blocks, diagnostics: { includedBlocks, skippedFields, macroTrace, warnings, unsupported, markerMapping, knownDeltas } };
}

function addRawBlock(
  blocks: PromptBlock[],
  includedBlocks: PromptBlockIdentifier[],
  identifier: PromptBlockIdentifier,
  content: string | undefined,
  order: number,
  metadata: PromptBlockMetadata = {},
): void {
  if (content === undefined || content.trim() === '') {
    return;
  }

  blocks.push(omitUndefined({ identifier, role: metadata.role ?? 'system', content, enabled: true, order, ...metadata }));
  includedBlocks.push(identifier);
}

type PromptCriticalFieldIdentifier =
  | 'worldInfoBefore'
  | 'worldInfoAfter'
  | 'personaDescription'
  | 'charDescription'
  | 'charPersonality'
  | 'scenario'
  | 'dialogueExamples'
  | 'chatHistory'
  | 'jailbreak'
  | 'instruct'
  | 'authorNote'
  | 'postHistory';

type PromptCriticalFieldMap = Partial<Record<PromptCriticalFieldIdentifier, { readonly content: string; readonly marker: boolean }>>;

type PromptBlockMetadata = Pick<PromptBlock, 'role' | 'position' | 'injection_position' | 'injection_depth' | 'injection_order'>;

const PROMPT_CRITICAL_MARKER_IDENTIFIERS: ReadonlySet<string> = new Set([
  'worldInfoBefore',
  'worldInfoAfter',
  'personaDescription',
  'charDescription',
  'charPersonality',
  'scenario',
  'dialogueExamples',
  'chatHistory',
  'jailbreak',
]);

const LEGACY_SKIPPED_FIELDS = [
  'instruct',
  'personaDescription',
  'charDescription',
  'charPersonality',
  'scenario',
  'authorNote',
  'postHistory',
] as const satisfies readonly PromptCriticalFieldIdentifier[];

function buildPromptCriticalFieldMap(
  input: BuildPromptCriticalBlocksInput,
  authorNote: PromptCriticalAuthorNote,
  macroContext: MacroContext,
  macroTrace: MacroTraceEntry[],
): PromptCriticalFieldMap {
  return {
    worldInfoBefore: rawField(joinDefined(input.worldInfo?.buckets.before), true),
    worldInfoAfter: rawField(joinDefined(input.worldInfo?.buckets.after), true),
    personaDescription: macroField(input.persona, true, macroContext, macroTrace),
    charDescription: macroField(input.character?.description, true, macroContext, macroTrace),
    charPersonality: macroField(input.character?.personality, true, macroContext, macroTrace),
    scenario: macroField(input.character?.scenario, true, macroContext, macroTrace),
    dialogueExamples: macroField(input.character?.mesExamples, true, macroContext, macroTrace),
    chatHistory: rawField('', true),
    jailbreak: macroField(input.jailbreak, true, macroContext, macroTrace),
    instruct: macroField(input.instruct, false, macroContext, macroTrace),
    authorNote: macroField(joinDefined([
      ...(authorNote.position === 'top' ? [authorNote.content] : []),
      ...(input.worldInfo?.buckets.ANTop ?? []),
      ...(input.worldInfo?.buckets.ANBottom ?? []),
      ...(authorNote.position === 'bottom' ? [authorNote.content] : []),
    ]), false, macroContext, macroTrace),
    postHistory: macroField(input.postHistory, false, macroContext, macroTrace),
  };
}

function rawField(content: string | undefined, marker: boolean): { readonly content: string; readonly marker: boolean } | undefined {
  return content === undefined ? undefined : { content, marker };
}

function macroField(
  content: string | undefined,
  marker: boolean,
  macroContext: MacroContext,
  macroTrace: MacroTraceEntry[],
): { readonly content: string; readonly marker: boolean } | undefined {
  if (content === undefined) {
    return undefined;
  }

  const substituted = substituteMacros(content, macroContext);
  macroTrace.push(...substituted.trace);
  return { content: substituted.text, marker };
}

function addPromptManagerBlock(
  blocks: PromptBlock[],
  includedBlocks: PromptBlockIdentifier[],
  skippedFields: string[],
  markerMapping: PromptCriticalMarkerMapping[],
  warnings: string[],
  prompt: PromptCollectionPrompt,
  fieldMap: PromptCriticalFieldMap,
  baseOrder: number,
): void {
  if (prompt.enabled === false) {
    return;
  }

  const field = readPromptCriticalField(prompt.identifier, prompt.marker);
  const fieldContent = field === undefined ? undefined : fieldMap[field]?.content;
  const content = fieldContent ?? (field === 'chatHistory' ? '' : prompt.content);
  const shouldKeepEmptyAnchor = prompt.identifier === 'chatHistory';
  if (content.trim() === '' && !shouldKeepEmptyAnchor) {
    if (field !== undefined) {
      skippedFields.push(field);
    }
    return;
  }

  const role = readPromptBlockRole(prompt.role, warnings, prompt.identifier);
  const metadata = promptBlockMetadata(prompt, role);
  const identifier = prompt.identifier as PromptBlockIdentifier;
  blocks.push(omitUndefined({
    identifier,
    role: role ?? 'system',
    content,
    enabled: true,
    order: baseOrder + prompt.order,
    ...metadata,
  }));
  includedBlocks.push(identifier);
  markerMapping.push({
    blockIdentifier: identifier,
    promptIdentifier: prompt.identifier,
    marker: prompt.marker,
    source: prompt.source,
    order: prompt.order,
    field,
  });
}

function addInternalDeltaBlock(
  blocks: PromptBlock[],
  includedBlocks: PromptBlockIdentifier[],
  skippedFields: string[],
  markerMapping: PromptCriticalMarkerMapping[],
  knownDeltas: string[],
  identifier: PromptBlockIdentifier,
  content: string | undefined,
  order: number,
): void {
  knownDeltas.push(`${identifier} is emitted as an engine-core internal prompt-critical block because ST PromptManager has no matching marker.`);
  if (content === undefined || content.trim() === '') {
    skippedFields.push(String(identifier));
    return;
  }

  addRawBlock(blocks, includedBlocks, identifier, content, order);
  markerMapping.push({
    blockIdentifier: identifier,
    promptIdentifier: identifier,
    marker: false,
    source: 'internal',
    order,
    field: String(identifier),
  });
}

function readPromptCriticalField(identifier: string, marker: boolean): PromptCriticalFieldIdentifier | undefined {
  return marker && PROMPT_CRITICAL_MARKER_IDENTIFIERS.has(identifier)
    ? identifier as PromptCriticalFieldIdentifier
    : undefined;
}

function promptBlockMetadata(prompt: PromptCollectionPrompt, role: PromptMessageRole | undefined): PromptBlockMetadata {
  return omitUndefined({
    role,
    position: typeof prompt.injection_position === 'number' ? prompt.injection_position : undefined,
    injection_position: prompt.injection_position,
    injection_depth: prompt.injection_depth,
    injection_order: prompt.injection_order,
  });
}

function readPromptBlockRole(
  role: PromptCollectionPrompt['role'],
  warnings: string[],
  identifier: string,
): PromptMessageRole | undefined {
  if (role === undefined) {
    return undefined;
  }
  if (role === 'system' || role === 'user' || role === 'assistant' || role === 'tool') {
    return role as PromptMessageRole;
  }

  warnings.push(`PromptManager prompt ${identifier} uses unsupported role ${role}; falling back to system.`);
  return undefined;
}

function addSkippedLegacyFields(skippedFields: string[], fieldMap: PromptCriticalFieldMap): void {
  for (const field of LEGACY_SKIPPED_FIELDS) {
    if (fieldMap[field] === undefined || fieldMap[field]?.content.trim() === '') {
      skippedFields.push(field);
    }
  }
}

function addWorldInfoWarnings(input: BuildPromptCriticalBlocksInput, warnings: string[]): void {
  if ((input.worldInfo?.buckets.atDepth.length ?? 0) > 0) {
    warnings.push('WI atDepth bucket produced content; buildPromptCriticalBlocks does not splice it into chat depth.');
  }
  if ((input.worldInfo?.buckets.outlet.length ?? 0) > 0) {
    warnings.push('WI outlet bucket produced content; engine-core P1 exposes diagnostics only.');
  }
}

function extractPromptManagerInput(input: BuildPromptCriticalBlocksInput): PromptCriticalPromptManagerInput | undefined {
  const nested = asPromptManagerInput(input.promptManager ?? input.prompt_manager);
  if (nested !== undefined) {
    return nested;
  }

  if (
    input.prompts !== undefined
    || input.prompt_order !== undefined
    || input.promptOrder !== undefined
    || input.generationType !== undefined
    || input.generation_type !== undefined
    || input.main_prompt !== undefined
    || input.mainPrompt !== undefined
    || input.jailbreak_prompt !== undefined
    || input.jailbreakPrompt !== undefined
    || input.overrides !== undefined
  ) {
    return input as PromptCriticalPromptManagerInput;
  }

  return undefined;
}

function asPromptManagerInput(value: unknown): PromptCriticalPromptManagerInput | undefined {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? value as PromptCriticalPromptManagerInput
    : undefined;
}

function normalizePromptManagerInput(input: PromptCriticalPromptManagerInput): CompilePromptCollectionInput {
  const generationType = input.generationType ?? input.generation_type;
  return generationType === undefined
    ? input
    : { ...input, generation_trigger: input.generation_trigger ?? generationType };
}

function buildMacroContext(input: BuildPromptCriticalBlocksInput): MacroContext {
  return {
    ...input.macroContext,
    user: input.macroContext?.user ?? input.userName,
    char: input.macroContext?.char ?? input.character?.name,
    description: input.macroContext?.description ?? input.character?.description,
    personality: input.macroContext?.personality ?? input.character?.personality,
    scenario: input.macroContext?.scenario ?? input.character?.scenario,
    persona: input.macroContext?.persona ?? input.persona,
    charDepthPrompt: input.macroContext?.charDepthPrompt ?? input.character?.charDepthPrompt,
    creatorNotes: input.macroContext?.creatorNotes ?? input.character?.creatorNotes,
    mesExamples: input.macroContext?.mesExamples ?? input.character?.mesExamples,
    model: input.macroContext?.model ?? input.model,
  };
}

function normalizeAuthorNote(authorNote: string | PromptCriticalAuthorNote | undefined): PromptCriticalAuthorNote {
  if (authorNote === undefined) {
    return { content: '', position: 'bottom' };
  }

  if (typeof authorNote === 'string') {
    return { content: authorNote, position: 'bottom' };
  }

  return authorNote;
}

function joinDefined(values: readonly string[] | undefined): string {
  return (values ?? []).filter((value) => value.trim() !== '').join('\n');
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
