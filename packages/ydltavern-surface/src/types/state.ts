// YdlTavern surface state shapes.
// Sampler / connection / formatting fields mirror the SillyTavern settings
// JSONs and generation parameter scenario fixtures used by the engine-core
// golden tests; persistence deliberately stores secret_ref strings only.

// === Library entries ===

export interface CharacterEntry {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly personality?: string;
  readonly scenario?: string;
  readonly firstMes?: string;
  readonly mesExample?: string;
  readonly creatorNotes?: string;
  readonly tags?: string[];
  readonly avatarUrl?: string;
  readonly isGroup?: boolean;
  readonly members?: string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface PersonaEntry {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly avatarUrl?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface WorldBookEntry {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly description?: string;
  readonly entries: WorldEntry[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface WorldEntry {
  readonly uid: string;
  readonly key: string[];
  readonly secondaryKey?: string[];
  readonly content: string;
  readonly position: 'before_char' | 'after_char' | 'before_an' | 'after_an' | 'at_depth';
  readonly depth?: number;
  readonly scanDepth?: number;
  readonly probability: number;
  readonly order: number;
  readonly enabled: boolean;
  readonly comment?: string;
}

export interface BackgroundEntry {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly folder?: string;
  readonly thumbnailUrl?: string;
}

// === Settings slices ===

export interface SamplerSettings {
  readonly temperature: number;
  readonly topP: number;
  readonly topK: number;
  readonly minP?: number;
  readonly topA?: number;
  readonly tfs?: number;
  readonly typicalP?: number;
  readonly frequencyPenalty: number;
  readonly presencePenalty: number;
  readonly repetitionPenalty?: number;
  readonly repetitionPenaltyRange?: number;
  readonly maxTokens: number;
  readonly mirostat?: number;
  readonly mirostatTau?: number;
  readonly mirostatEta?: number;
  readonly seed?: number;
}

export interface ConnectionSettings {
  readonly provider: string;
  readonly model: string;
  readonly baseUrl?: string;
  readonly secretRef?: string;
  readonly organizationId?: string;
  readonly customHeaders?: Record<string, string>;
}

export interface FormattingSettings {
  readonly contextTemplate: string;
  readonly storyString: string;
  readonly exampleSeparator: string;
  readonly chatStart: string;
  readonly instructEnabled: boolean;
  readonly instructTemplate: string;
  readonly instructInputSequence: string;
  readonly instructOutputSequence: string;
  readonly instructSystemSequence: string;
  readonly instructStopSequence: string;
  readonly instructSystemSameAsUser: boolean;
  readonly systemPromptEnabled: boolean;
  readonly systemPrompt: string;
  readonly postHistoryInstructions: string;
  readonly stopStrings: string;
  readonly reasoningPrefix: string;
  readonly reasoningSuffix: string;
  readonly reasoningAutoCollapse: boolean;
  readonly macroEnabled: boolean;
  readonly macroNestedRecursive: boolean;
}

export interface BackgroundDisplaySettings {
  readonly fitMode: 'cover' | 'contain' | 'tile';
  readonly autoSelectByCharacter: boolean;
}

export interface PersistedSelection {
  readonly activeCharacterId: string | null;
  readonly activePersonaId: string | null;
  readonly activeWorldBookId: string | null;
  readonly activeBackgroundId: string | null;
  readonly selectedWorldEntryId: string | null;
  readonly activeConnectionProfile: string | null;
  readonly activePreset: string;
}
