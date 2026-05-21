export const ST_WORLD_INFO_POSITIONS = {
  before: 0,
  after: 1,
  ANTop: 2,
  ANBottom: 3,
  atDepth: 4,
  EMTop: 5,
  EMBottom: 6,
  outlet: 7,
} as const;

export type STWorldInfoPositionName = keyof typeof ST_WORLD_INFO_POSITIONS;
export type STWorldInfoPosition = (typeof ST_WORLD_INFO_POSITIONS)[STWorldInfoPositionName];

export const ST_WORLD_INFO_LOGIC = {
  AND_ANY: 0,
  NOT_ALL: 1,
  NOT_ANY: 2,
  AND_ALL: 3,
} as const;

export type STWorldInfoLogicName = keyof typeof ST_WORLD_INFO_LOGIC;
export type STWorldInfoLogic = (typeof ST_WORLD_INFO_LOGIC)[STWorldInfoLogicName];

export const ST_WORLD_INFO_INSERTION_STRATEGIES = {
  evenly: 0,
  character_first: 1,
  global_first: 2,
} as const;

export type STWorldInfoInsertionStrategyName = keyof typeof ST_WORLD_INFO_INSERTION_STRATEGIES;
export type STWorldInfoInsertionStrategy =
  (typeof ST_WORLD_INFO_INSERTION_STRATEGIES)[STWorldInfoInsertionStrategyName];

export const ST_WORLD_INFO_SCAN_STATES = {
  NONE: 0,
  INITIAL: 1,
  RECURSION: 2,
  MIN_ACTIVATIONS: 3,
} as const;

export type STWorldInfoScanStateName = keyof typeof ST_WORLD_INFO_SCAN_STATES;
export type STWorldInfoScanState = (typeof ST_WORLD_INFO_SCAN_STATES)[STWorldInfoScanStateName];

export const ST_WORLD_INFO_ENTRY_FIELDS = [
  'uid',
  'world',
  'key',
  'keysecondary',
  'comment',
  'content',
  'constant',
  'vectorized',
  'selective',
  'selectiveLogic',
  'addMemo',
  'order',
  'position',
  'disable',
  'ignoreBudget',
  'excludeRecursion',
  'preventRecursion',
  'matchPersonaDescription',
  'matchCharacterDescription',
  'matchCharacterPersonality',
  'matchCharacterDepthPrompt',
  'matchScenario',
  'matchCreatorNotes',
  'delayUntilRecursion',
  'probability',
  'useProbability',
  'depth',
  'outletName',
  'group',
  'groupOverride',
  'groupWeight',
  'scanDepth',
  'caseSensitive',
  'matchWholeWords',
  'useGroupScoring',
  'automationId',
  'role',
  'sticky',
  'cooldown',
  'delay',
  'characterFilter',
  'characterFilter.names',
  'characterFilter.tags',
  'characterFilter.isExclude',
  'characterFilterNames',
  'characterFilterTags',
  'characterFilterExclude',
  'triggers',
  'decorators',
  'hash',
  'displayIndex',
] as const;

export type STWorldInfoEntryField = (typeof ST_WORLD_INFO_ENTRY_FIELDS)[number];
