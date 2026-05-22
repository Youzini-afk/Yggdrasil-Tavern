export * from './macros.js';
export * from './golden.js';
export * from './model-boundary.js';
export * from './openai.js';
export {
  buildChatRequest,
  emptyStreamState,
  applyStreamChunk,
  isStreamDone,
} from './chat-completion-providers.js';
export type {
  ChatCompletionSource,
  ChatCompletionMessage,
  GenerationType as ChatGenerationType,
  BaseSettings as ChatBaseSettings,
  BuildChatRequestInput,
  ChatRequestBody,
  BuildChatRequestResult,
  StreamMergeState,
} from './chat-completion-providers.js';
export * from './prompt.js';
export * from './prompt-critical.js';
export * from './prompt-manager.js';
export {
  formatInstructModeChat,
  formatInstructModeStoryString,
  formatInstructModeExamples,
  getInstructStoppingSequences,
  INSTRUCT_NAMES_BEHAVIOR,
  CHATML_TEMPLATE,
  ALPACA_TEMPLATE,
  VICUNA_TEMPLATE,
  MISTRAL_TEMPLATE,
  LLAMA3_TEMPLATE,
  BUILT_IN_TEMPLATES,
} from './instruct.js';
export type {
  InstructRole,
  InstructNamesBehavior,
  InstructTemplate,
  FormatChatMessageInput,
} from './instruct.js';
export {
  Prompt,
  PromptCollection,
  Message,
  MessageCollection,
  ChatCompletion,
  INJECTION_POSITION,
  NAMES_BEHAVIOR,
  EXTENSION_PROMPT_TYPES,
  EXTENSION_PROMPT_ROLES,
  DEFAULT_DUMMY_CHARACTER_ID,
  SYSTEM_PROMPT_IDENTIFIERS,
  OVERRIDABLE_PROMPT_IDENTIFIERS,
  SQUASH_EXCLUDED_IDS,
  DEFAULT_PROMPT_ORDER,
  DEFAULT_MARKER_IDENTIFIERS,
  preparePromptsForChatCompletion,
  populationInjectionPrompts,
  populateChatHistory,
  populateDialogueExamples,
  squashSystemMessages,
  sanitizeName,
  getPromptOrderForCharacter,
  isPromptDisabledForActiveCharacter,
} from './prompt-manager-st.js';
export type {
  InjectionPositionValue,
  NamesBehaviorValue,
  ExtensionPromptType,
  ExtensionPromptRoleValue,
  STRole,
  GenerationType,
  PromptInit,
  MessageInit,
  PromptOrderList,
  ExtensionPromptEntry,
  STChatMessage,
  PreparePromptsInput,
  PrepareDiagnostics,
  PreparePromptsResult,
  PopulateChatHistoryOptions,
  PopulateChatHistoryResult,
  PopulateDialogueExamplesOptions,
} from './prompt-manager-st.js';
// Note: PromptOrderEntry is intentionally not re-exported from prompt-manager-st;
// the legacy export from prompt-manager.js is preserved. Use the ST class API
// (PromptOrderList) for the deep-port surface.
export * from './prompt-routing.js';
export * from './sampler.js';
export * from './streaming.js';
export * from './text-completion.js';
export {
  resolveTextGenServer,
  buildTextRequest,
  emptyTextStreamState,
  applyTextStreamChunk,
  HORDE_MIN_LENGTH,
  HORDE_MAX_RETRIES,
  planHordeJob,
} from './text-completion-providers.js';
export type {
  TextCompletionSource,
  TextCompletionSettings,
  BuildTextRequestInput,
  TextRequestBody,
  BuildTextRequestResult,
  TextStreamMergeState,
  HordeJobInput,
  HordeJobPlan,
} from './text-completion-providers.js';
export * from './token-budget.js';
export * from './tokenizer.js';
export * from './world-info.js';
export {
  WORLD_INFO_POSITION,
  WI_ANCHOR_POSITION,
  EXTENSION_PROMPT_ROLE,
  SELECTIVE_LOGIC,
  WI_GENERATION_TRIGGER,
  parseRegexFromString,
  escapeRegex,
  matchKeys,
  selectiveLogicMatches,
  parseDecorators,
  decideActivation,
  emptyTimedEffectsState,
  findTimedEffect,
  isStickyActive,
  isCooldownActive,
  isDelayActive,
  applyActivationToTimedEffects,
  routeActivatedEntries,
  entryHash,
} from './world-info-st.js';
export type {
  WorldInfoPositionValue,
  WiAnchorPosition,
  ExtensionPromptRole,
  SelectiveLogicValue,
  WIGenerationTrigger,
  MatchKeysOptions,
  DecoratorParseResult,
  ActivationReason,
  DecideActivationInput,
  TimedEffectRecord,
  TimedEffectsState,
  ApplyActivationInput,
  RoutableEntry,
  AuthorNotePatchInput,
  RoutedDepthBucket,
  RoutedOutletBucket,
  RoutedAuthorNotePatch,
  RoutedEntries,
} from './world-info-st.js';
