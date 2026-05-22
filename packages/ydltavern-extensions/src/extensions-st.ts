// Deep port of SillyTavern built-in extensions.
//
// References (read at port time):
//   public/scripts/extensions/regex/engine.js — placement enum, getRegexedString
//   public/scripts/extensions/memory/index.js — summarize prompt builder
//   public/scripts/extensions/vectors/index.js — sources, chunking, retrieval
//   public/scripts/extensions/quick-reply/index.js — auto-execute hook list
//   public/scripts/extensions/token-counter/index.js — friendly tokenizer + count
//
// Pure logic — no DOM, no real network, no real model calls.
// Real I/O happens via Yggdrasil host outbound.

// ---------------------------------------------------------------------------
// Regex extension (engine.js)

export const REGEX_PLACEMENT = {
  MD_DISPLAY: 0, // deprecated
  USER_INPUT: 1,
  AI_OUTPUT: 2,
  SLASH_COMMAND: 3,
  WORLD_INFO: 5,
  REASONING: 6,
} as const;
export type RegexPlacementValue = (typeof REGEX_PLACEMENT)[keyof typeof REGEX_PLACEMENT];

export interface RegexScriptST {
  id: string;
  scriptName: string;
  findRegex: string; // /.../flags or plain
  replaceString: string;
  trimStrings?: readonly string[];
  placement: readonly RegexPlacementValue[];
  disabled?: boolean;
  markdownOnly?: boolean;
  promptOnly?: boolean;
  runOnEdit?: boolean;
  substituteRegex?: number; // 0=no, 1=raw, 2=substituteParams
  minDepth?: number | null;
  maxDepth?: number | null;
}

export interface GetRegexedStringOptions {
  placement: RegexPlacementValue;
  depth?: number;
  isPrompt?: boolean;
  isMarkdown?: boolean;
  isEdit?: boolean;
  substituteParams?: (text: string) => string;
}

// LRU cache for compiled RegExp objects (size 1000 per ST RegexProvider)
class RegexProvider {
  private cache = new Map<string, RegExp>();
  private capacity = 1000;

  get(pattern: string, flags: string): RegExp {
    const key = `${flags}:${pattern}`;
    const existing = this.cache.get(key);
    if (existing) {
      // touch
      this.cache.delete(key);
      this.cache.set(key, existing);
      return existing;
    }
    const re = new RegExp(pattern, flags);
    if (this.cache.size >= this.capacity) {
      const first = this.cache.keys().next().value;
      if (first !== undefined) this.cache.delete(first);
    }
    this.cache.set(key, re);
    return re;
  }
}

const regexProvider = new RegexProvider();

// Port of getRegexedString (engine.js:281-378)
export function getRegexedString(
  rawString: string,
  scripts: readonly RegexScriptST[],
  options: GetRegexedStringOptions,
): string {
  const { placement, depth, isPrompt, isMarkdown, isEdit } = options;
  let current = rawString;

  for (const script of scripts) {
    if (script.disabled === true) continue;
    if (!script.placement.includes(placement)) continue;
    if (isMarkdown && script.markdownOnly === false) continue;
    if (isPrompt && script.promptOnly === false) continue;
    if (isEdit === false && script.runOnEdit === true) continue;
    if (typeof depth === 'number') {
      if (typeof script.minDepth === 'number' && depth < script.minDepth) continue;
      if (typeof script.maxDepth === 'number' && depth > script.maxDepth) continue;
    }
    current = runRegexScript(current, script, options);
  }

  return current;
}

function runRegexScript(
  text: string,
  script: RegexScriptST,
  options: GetRegexedStringOptions,
): string {
  // Substitute regex if requested
  let findStr = script.findRegex;
  if (script.substituteRegex === 2 && options.substituteParams) {
    findStr = options.substituteParams(findStr);
  }

  // Parse /pattern/flags or fall back to plain string treated as pattern
  let pattern: string;
  let flags: string;
  const m = findStr.match(/^\/(.*)\/([gimsuy]*)$/s);
  if (m) {
    pattern = m[1] ?? '';
    flags = m[2] ?? 'g';
    if (!flags.includes('g')) flags += 'g';
  } else {
    pattern = findStr;
    flags = 'g';
  }

  let re: RegExp;
  try {
    re = regexProvider.get(pattern, flags);
  } catch {
    return text; // bad regex → no-op
  }

  return text.replace(re, (match: string, ...groups: unknown[]) => {
    let replacement = script.replaceString;
    // ST-style: {{match}} → $0
    replacement = replacement.replace(/\{\{match\}\}/g, '$0');
    // Resolve $0..$N
    replacement = replacement.replace(/\$(\d+|&)/g, (_full, ref: string) => {
      if (ref === '&' || ref === '0') return match;
      const idx = Number.parseInt(ref, 10) - 1;
      const arg = groups[idx];
      return typeof arg === 'string' ? arg : '';
    });
    // Trim strings
    let result = replacement;
    if (script.trimStrings) {
      for (const trim of script.trimStrings) {
        result = result.split(trim).join('');
      }
    }
    // Final substituteParams
    if (options.substituteParams) result = options.substituteParams(result);
    return result;
  });
}

// ---------------------------------------------------------------------------
// Memory extension (memory/index.js)

export const MEMORY_SOURCE = {
  EXTRAS: 'extras',
  MAIN: 'main',
  WEBLLM: 'webllm',
} as const;
export type MemorySource = (typeof MEMORY_SOURCE)[keyof typeof MEMORY_SOURCE];

export const MEMORY_POSITION = {
  IN_PROMPT: 0,
  IN_CHAT: 1,
  BEFORE_PROMPT: 2,
} as const;

export const MEMORY_PROMPT_BUILDER = {
  DEFAULT: 0,
  RAW_BLOCKING: 1,
  RAW_NON_BLOCKING: 2,
} as const;
export type MemoryPromptBuilder = (typeof MEMORY_PROMPT_BUILDER)[keyof typeof MEMORY_PROMPT_BUILDER];

export interface MemorySettings {
  source: MemorySource;
  prompt: string;
  template: string;
  position: number;
  depth: number;
  role: number; // 0=system, 1=user, 2=assistant
  scan: boolean;
  promptWords: number;
  promptInterval: number;
  promptForceWords: number;
  overrideResponseLength: number;
  maxMessagesPerRequest: number;
  prompt_builder: MemoryPromptBuilder;
  memoryFrozen: boolean;
  SkipWIAN: boolean;
}

export const DEFAULT_MEMORY_SETTINGS: MemorySettings = {
  source: MEMORY_SOURCE.MAIN,
  prompt: 'Ignore previous instructions. Summarize the most important facts and events that have happened in the chat so far. Limit the summary to {{words}} words or less. Your response should include nothing but the summary.',
  template: '[Summary: {{summary}}]',
  position: MEMORY_POSITION.IN_PROMPT,
  depth: 2,
  role: 0,
  scan: false,
  promptWords: 200,
  promptInterval: 10,
  promptForceWords: 0,
  overrideResponseLength: 0,
  maxMessagesPerRequest: 0,
  prompt_builder: MEMORY_PROMPT_BUILDER.DEFAULT,
  memoryFrozen: false,
  SkipWIAN: false,
};

export interface MemoryTriggerInput {
  chatLength: number;
  lastSummaryAt: number;
  wordsSinceLastSummary: number;
  isSending?: boolean;
  isGenerating?: boolean;
  unsupportedBackend?: boolean;
}

export interface MemoryTriggerDecision {
  shouldSummarize: boolean;
  reason: string;
}

// Port of memory trigger conditions (memory/index.js)
export function shouldSummarize(
  settings: MemorySettings,
  input: MemoryTriggerInput,
): MemoryTriggerDecision {
  if (settings.memoryFrozen) return { shouldSummarize: false, reason: 'frozen' };
  if (input.isSending) return { shouldSummarize: false, reason: 'sending' };
  if (input.isGenerating) return { shouldSummarize: false, reason: 'generating' };
  if (input.unsupportedBackend) return { shouldSummarize: false, reason: 'unsupported_backend' };

  const messagesSince = input.chatLength - input.lastSummaryAt;
  if (settings.promptInterval > 0 && messagesSince >= settings.promptInterval) {
    return { shouldSummarize: true, reason: 'interval' };
  }
  if (settings.promptForceWords > 0 && input.wordsSinceLastSummary >= settings.promptForceWords) {
    return { shouldSummarize: true, reason: 'force_words' };
  }
  return { shouldSummarize: false, reason: 'no_trigger' };
}

export interface FormatMemoryValueInput {
  summary: string;
  template?: string;
}

// Port of formatMemoryValue (memory/index.js)
export function formatMemoryValue(input: FormatMemoryValueInput, settings = DEFAULT_MEMORY_SETTINGS): string {
  if (!input.summary || input.summary.trim() === '') return '';
  const tmpl = input.template ?? settings.template;
  return tmpl.replace(/\{\{summary\}\}/g, input.summary);
}

// ---------------------------------------------------------------------------
// Vectors extension (vectors/index.js)

export const VECTORS_SOURCE = [
  'transformers',
  'togetherai',
  'openai',
  'electronhub',
  'openrouter',
  'cohere',
  'ollama',
  'vllm',
  'webllm',
  'google',
  'chutes',
  'nanogpt',
  'siliconflow',
  'workers_ai',
  'extras',
  'mistralai',
  'palm',
  'nomicai',
] as const;
export type VectorsSource = (typeof VECTORS_SOURCE)[number];

export interface VectorsSettings {
  // Backend selection
  source: VectorsSource;
  // Chat mode
  enabled_chats: boolean;
  keep_hidden: boolean;
  template: string;
  depth: number;
  position: number;
  protect: number;
  insert: number;
  query: number;
  message_chunk_size: number;
  score_threshold: number;
  // Files mode
  enabled_files: boolean;
  size_threshold: number;
  chunk_size: number;
  chunk_count: number;
  overlap_percent: number;
  only_custom_boundary: boolean;
  // Data Bank mode
  size_threshold_db: number;
  chunk_size_db: number;
  chunk_count_db: number;
  overlap_percent_db: number;
  file_template_db: string;
  file_position_db: number;
  file_depth_db: number;
  file_depth_role_db: number;
  // Summarization
  summarize: boolean;
  summarize_sent: boolean;
  summary_source: string;
  summary_prompt: string;
  summary_retries: number;
  summary_threshold: number;
  force_chunk_delimiter: string;
}

export const DEFAULT_VECTORS_SETTINGS: VectorsSettings = {
  source: 'transformers',
  enabled_chats: false,
  keep_hidden: false,
  template: 'Past events:\n{{text}}',
  depth: 2,
  position: 0,
  protect: 5,
  insert: 3,
  query: 2,
  message_chunk_size: 400,
  score_threshold: 0.25,
  enabled_files: false,
  size_threshold: 10,
  chunk_size: 5000,
  chunk_count: 2,
  overlap_percent: 10,
  only_custom_boundary: false,
  size_threshold_db: 10,
  chunk_size_db: 5000,
  chunk_count_db: 5,
  overlap_percent_db: 10,
  file_template_db: 'Related information:\n{{text}}',
  file_position_db: 0,
  file_depth_db: 4,
  file_depth_role_db: 0,
  summarize: false,
  summarize_sent: false,
  summary_source: 'main',
  summary_prompt: 'Summarize the most important facts and events for retrieval. Be concise.',
  summary_retries: 3,
  summary_threshold: 1024,
  force_chunk_delimiter: '',
};

export interface ChunkTextOptions {
  size: number;
  overlapPercent: number;
  customBoundary?: string;
  onlyCustomBoundary?: boolean;
}

// Port of splitByChunks (vectors/index.js, simplified to size+overlap)
export function chunkText(text: string, options: ChunkTextOptions): string[] {
  const { size, overlapPercent } = options;
  if (size <= 0 || text.length === 0) return text ? [text] : [];

  // Optional custom boundary split first
  if (options.onlyCustomBoundary && options.customBoundary) {
    return text.split(options.customBoundary).filter((s) => s.length > 0);
  }

  const overlap = Math.max(0, Math.floor(size * overlapPercent / 100));
  const stride = Math.max(1, size - overlap);
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += stride) {
    chunks.push(text.slice(i, i + size));
    if (i + size >= text.length) break;
  }
  return chunks;
}

export interface VectorsInjectionPlan {
  position: number;
  depth: number;
  text: string;
}

// Port of injectDataBankChunks (plan-only)
export function planVectorsInjection(
  retrievedChunks: readonly string[],
  settings: VectorsSettings,
): VectorsInjectionPlan {
  const text = retrievedChunks.join('\n\n');
  const wrapped = settings.template.replace(/\{\{text\}\}/g, text);
  return {
    position: settings.position,
    depth: settings.depth,
    text: wrapped,
  };
}

// ---------------------------------------------------------------------------
// Quick Reply extension (quick-reply/index.js)

export const QUICK_REPLY_AUTO_EVENTS = [
  'APP_READY',
  'CHAT_CHANGED',
  'USER_MESSAGE_RENDERED',
  'CHARACTER_MESSAGE_RENDERED',
  'GROUP_MEMBER_DRAFTED',
  'WORLD_INFO_ACTIVATED',
  'CHAT_CREATED',
  'GROUP_CHAT_CREATED',
  'GENERATION_AFTER_COMMANDS',
] as const;
export type QuickReplyAutoEvent = (typeof QUICK_REPLY_AUTO_EVENTS)[number];

export interface QuickReplyEntry {
  id?: string;
  label: string;
  message: string;
  contextMenu?: readonly { label: string; message: string }[];
  automationId?: string;
  // Auto-execution flags
  executeOnStartup?: boolean;
  executeOnUser?: boolean;
  executeOnAi?: boolean;
  executeOnChatChange?: boolean;
  executeOnGroupMemberDraft?: boolean;
  executeOnNewChat?: boolean;
  executeBeforeGeneration?: boolean;
}

export interface QuickReplySet {
  name: string;
  isVisible?: boolean;
  isCombined?: boolean;
  qrList: readonly QuickReplyEntry[];
}

export interface QuickReplySettings {
  isEnabled: boolean;
  isCombined?: boolean;
  config: { setList: readonly QuickReplySet[] };
  characterConfigs?: Readonly<Record<string, unknown>>;
}

export const DEFAULT_QUICK_REPLY_SETTINGS: QuickReplySettings = {
  isEnabled: false,
  isCombined: false,
  config: { setList: [] },
};

// Port of AutoExecuteHandler dispatch (quick-reply/src/AutoExecuteHandler.js)
export function autoExecuteCandidates(
  settings: QuickReplySettings,
  event: QuickReplyAutoEvent,
): readonly QuickReplyEntry[] {
  if (!settings.isEnabled) return [];
  const result: QuickReplyEntry[] = [];
  for (const set of settings.config.setList) {
    for (const qr of set.qrList) {
      if (matchesEvent(qr, event)) result.push(qr);
    }
  }
  return result;
}

function matchesEvent(qr: QuickReplyEntry, event: QuickReplyAutoEvent): boolean {
  switch (event) {
    case 'APP_READY':
      return qr.executeOnStartup === true;
    case 'CHAT_CHANGED':
      return qr.executeOnChatChange === true;
    case 'USER_MESSAGE_RENDERED':
      return qr.executeOnUser === true;
    case 'CHARACTER_MESSAGE_RENDERED':
      return qr.executeOnAi === true;
    case 'GROUP_MEMBER_DRAFTED':
      return qr.executeOnGroupMemberDraft === true;
    case 'CHAT_CREATED':
    case 'GROUP_CHAT_CREATED':
      return qr.executeOnNewChat === true;
    case 'GENERATION_AFTER_COMMANDS':
      return qr.executeBeforeGeneration === true;
    case 'WORLD_INFO_ACTIVATED':
      return qr.automationId !== undefined && qr.automationId !== '';
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// Token counter extension (token-counter/index.js)

export function tokenCounterPlan(text: string, tokenizerName: string): {
  text: string;
  tokenizer: string;
  charCount: number;
  approxTokens: number;
} {
  return {
    text,
    tokenizer: tokenizerName,
    charCount: text.length,
    approxTokens: Math.ceil(text.length / 4),
  };
}
