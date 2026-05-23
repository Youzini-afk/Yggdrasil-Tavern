import { DARK_THEME } from '../components/product/themes/built-in-themes.js';
import type { TavernThemeSettings } from '../components/product/themes/theme-types.js';
import type {
  BackgroundDisplaySettings,
  BackgroundEntry,
  CharacterEntry,
  ConnectionSettings,
  FormattingSettings,
  PersistedSelection,
  PersonaEntry,
  SamplerSettings,
  WorldBookEntry,
} from '../types/state.js';

export interface TavernSettings {
  readonly activePreset: string;
  readonly streaming: boolean;
  readonly bannedTokens: string;
  readonly logitBias: string;
  readonly fastUImode: boolean;
  readonly reducedMotion: boolean;
  readonly showTimestamps: boolean;
  readonly showTokenCounter: boolean;
  readonly fontScale: number;
  readonly chatWidth: number;
  readonly avatarStyle: number;
}

export const DEFAULT_SETTINGS: TavernSettings = {
  activePreset: 'default',
  streaming: true,
  bannedTokens: '',
  logitBias: '',
  fastUImode: false,
  reducedMotion: false,
  showTimestamps: false,
  showTokenCounter: false,
  fontScale: 1,
  chatWidth: 50,
  avatarStyle: 0,
};

export const DEFAULT_THEME_SETTINGS: TavernThemeSettings = {
  themeId: DARK_THEME.name,
  density: DARK_THEME.density,
  fontFamily: DARK_THEME.font.family,
};

export const DEFAULT_SAMPLER: SamplerSettings = {
  temperature: 1,
  topP: 1,
  topK: 0,
  frequencyPenalty: 0,
  presencePenalty: 0,
  maxTokens: 256,
};

export const DEFAULT_CONNECTION: ConnectionSettings = {
  provider: 'openai',
  model: 'gpt-4-turbo',
  secretRef: 'secret_ref:store:OPENAI_API_KEY',
};

export const DEFAULT_FORMATTING: FormattingSettings = {
  contextTemplate: 'default',
  storyString: '{{description}}{{personality}}{{scenario}}',
  exampleSeparator: '***',
  chatStart: '',
  instructEnabled: false,
  instructTemplate: 'none',
  instructInputSequence: '<|im_start|>user\n',
  instructOutputSequence: '<|im_start|>assistant\n',
  instructSystemSequence: '<|im_start|>system\n',
  instructStopSequence: '<|im_end|>',
  instructSystemSameAsUser: true,
  systemPromptEnabled: true,
  systemPrompt: '',
  postHistoryInstructions: '',
  stopStrings: '',
  reasoningPrefix: '<think>',
  reasoningSuffix: '</think>',
  reasoningAutoCollapse: false,
  macroEnabled: true,
  macroNestedRecursive: true,
};

export const DEFAULT_BACKGROUND_DISPLAY: BackgroundDisplaySettings = {
  fitMode: 'cover',
  autoSelectByCharacter: false,
};

export const SEED_PERSONA: PersonaEntry = {
  id: 'persona-default-you',
  name: 'You',
  description: 'Default user persona.',
  createdAt: new Date(0).toISOString(),
};

export const SEED_CHARACTER: CharacterEntry = {
  id: 'sample-aria',
  name: 'Aria',
  description: 'Cheerful traveler. Sample character card.',
  personality: 'Curious, kind, optimistic.',
  tags: ['fantasy', 'sample'],
  createdAt: new Date(0).toISOString(),
};

export const SEED_WORLDBOOK: WorldBookEntry = {
  id: 'wb-empty',
  name: 'Untitled World Book',
  enabled: false,
  entries: [],
  createdAt: new Date(0).toISOString(),
};

export const SEED_BACKGROUND: BackgroundEntry = {
  id: 'bg-default',
  name: 'Default',
  url: '',
  folder: 'Default',
};

export const DEFAULT_SELECTION: PersistedSelection = {
  activeCharacterId: SEED_CHARACTER.id,
  activePersonaId: SEED_PERSONA.id,
  activeWorldBookId: SEED_WORLDBOOK.id,
  activeBackgroundId: SEED_BACKGROUND.id,
  selectedWorldEntryId: null,
  activeConnectionProfile: null,
  activePreset: DEFAULT_SETTINGS.activePreset,
};
