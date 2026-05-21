export const ST_PROMPT_MANAGER_IDENTIFIERS = [
  'main',
  'nsfw',
  'dialogueExamples',
  'jailbreak',
  'chatHistory',
  'worldInfoAfter',
  'worldInfoBefore',
  'enhanceDefinitions',
  'charDescription',
  'charPersonality',
  'scenario',
  'personaDescription',
  'custom UUID',
] as const;

export type STPromptManagerIdentifier = (typeof ST_PROMPT_MANAGER_IDENTIFIERS)[number];
