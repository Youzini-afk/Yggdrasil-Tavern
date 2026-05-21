import type { MacroContext, MacroTraceEntry } from './macros.js';
import { substituteMacros } from './macros.js';
import type { PromptBlock, PromptBlockIdentifier } from './prompt.js';
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
  readonly userName?: string;
  readonly model?: string;
  readonly persona?: string;
  readonly character?: PromptCriticalCharacterFields;
  readonly authorNote?: string | PromptCriticalAuthorNote;
  readonly instruct?: string;
  readonly postHistory?: string;
  readonly worldInfo?: EvaluateWorldInfoResult;
  readonly macroContext?: MacroContext;
  readonly baseOrder?: number;
}

export interface PromptCriticalDiagnostics {
  readonly includedBlocks: readonly PromptBlockIdentifier[];
  readonly skippedFields: readonly string[];
  readonly macroTrace: readonly MacroTraceEntry[];
  readonly warnings: readonly string[];
  readonly unsupported: readonly string[];
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
  const unsupported = [
    'Prompt-critical P1 does not implement full ST PromptManager override semantics.',
    'WI atDepth/outlet buckets are surfaced in diagnostics but not depth-injected into chat history by buildPrompt.',
  ];

  addBlock(blocks, includedBlocks, skippedFields, macroTrace, 'instruct', input.instruct, baseOrder + 0, macroContext);
  addRawBlock(
    blocks,
    includedBlocks,
    'worldInfoBefore',
    joinDefined(input.worldInfo?.buckets.before),
    baseOrder + 10,
  );
  addBlock(
    blocks,
    includedBlocks,
    skippedFields,
    macroTrace,
    'personaDescription',
    input.persona,
    baseOrder + 20,
    macroContext,
  );
  addBlock(
    blocks,
    includedBlocks,
    skippedFields,
    macroTrace,
    'charDescription',
    input.character?.description,
    baseOrder + 30,
    macroContext,
  );
  addBlock(
    blocks,
    includedBlocks,
    skippedFields,
    macroTrace,
    'charPersonality',
    input.character?.personality,
    baseOrder + 40,
    macroContext,
  );
  addBlock(
    blocks,
    includedBlocks,
    skippedFields,
    macroTrace,
    'scenario',
    input.character?.scenario,
    baseOrder + 50,
    macroContext,
  );
  addBlock(
    blocks,
    includedBlocks,
    skippedFields,
    macroTrace,
    'authorNote',
    joinDefined([
      ...(authorNote.position === 'top' ? [authorNote.content] : []),
      ...(input.worldInfo?.buckets.ANTop ?? []),
      ...(input.worldInfo?.buckets.ANBottom ?? []),
      ...(authorNote.position === 'bottom' ? [authorNote.content] : []),
    ]),
    baseOrder + 60,
    macroContext,
  );
  addRawBlock(blocks, includedBlocks, 'worldInfoAfter', joinDefined(input.worldInfo?.buckets.after), baseOrder + 80);
  addBlock(
    blocks,
    includedBlocks,
    skippedFields,
    macroTrace,
    'postHistory',
    input.postHistory,
    baseOrder + 90,
    macroContext,
  );

  if ((input.worldInfo?.buckets.atDepth.length ?? 0) > 0) {
    warnings.push('WI atDepth bucket produced content; buildPromptCriticalBlocks does not splice it into chat depth.');
  }
  if ((input.worldInfo?.buckets.outlet.length ?? 0) > 0) {
    warnings.push('WI outlet bucket produced content; engine-core P1 exposes diagnostics only.');
  }

  return { blocks, diagnostics: { includedBlocks, skippedFields, macroTrace, warnings, unsupported } };
}

function addBlock(
  blocks: PromptBlock[],
  includedBlocks: PromptBlockIdentifier[],
  skippedFields: string[],
  macroTrace: MacroTraceEntry[],
  identifier: PromptBlockIdentifier,
  content: string | undefined,
  order: number,
  macroContext: MacroContext,
): void {
  if (content === undefined || content.trim() === '') {
    skippedFields.push(String(identifier));
    return;
  }

  const substituted = substituteMacros(content, macroContext);
  macroTrace.push(...substituted.trace);
  addRawBlock(blocks, includedBlocks, identifier, substituted.text, order);
}

function addRawBlock(
  blocks: PromptBlock[],
  includedBlocks: PromptBlockIdentifier[],
  identifier: PromptBlockIdentifier,
  content: string | undefined,
  order: number,
): void {
  if (content === undefined || content.trim() === '') {
    return;
  }

  blocks.push({ identifier, role: 'system', content, enabled: true, order });
  includedBlocks.push(identifier);
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
