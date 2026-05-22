// Deep port of SillyTavern provider-pattern built-in extensions (batch 2).
//
// References (read at port time):
//   public/scripts/extensions/caption/index.js — sources, refine, template
//   public/scripts/extensions/tts/index.js — provider registry, narration
//   public/scripts/extensions/translate/index.js — provider list, hooks
//   public/scripts/extensions/expressions/index.js — classify → label → sprite
//   public/scripts/extensions/attachments/index.js — Data Bank scopes
//   public/scripts/extensions/connection-manager/index.js — ConnectionProfile
//   public/scripts/extensions/stable-diffusion/index.js — trigger processor
//
// Pure logic — no DOM, no real network, no real model calls. Real I/O happens
// via Yggdrasil host outbound when wired through the engine package.

// ---------------------------------------------------------------------------
// Caption extension

export const CAPTION_SOURCE = {
  EXTRAS: 'extras',
  LOCAL: 'local',
  HORDE: 'horde',
  MULTIMODAL: 'multimodal',
} as const;
export type CaptionSource = (typeof CAPTION_SOURCE)[keyof typeof CAPTION_SOURCE];

export interface CaptionSettings {
  source: CaptionSource;
  multimodal_api?: string;
  multimodal_model?: string;
  prompt: string;
  template: string;
  refine_mode: boolean;
  prompt_ask: boolean;
  show_in_chat: boolean;
}

export const DEFAULT_CAPTION_SETTINGS: CaptionSettings = {
  source: CAPTION_SOURCE.MULTIMODAL,
  multimodal_api: 'openai',
  multimodal_model: 'gpt-4o',
  prompt: 'What’s in this image?',
  template: '[{{user}} sends {{char}} a picture that contains: {{caption}}]',
  refine_mode: false,
  prompt_ask: false,
  show_in_chat: true,
};

export interface CaptionPlanInput {
  settings: CaptionSettings;
  imageRef: string; // URL/data ref; engine layer resolves to bytes via outbound
  caption?: string; // when refining
  user?: string;
  char?: string;
}

export interface CaptionPlan {
  source: CaptionSource;
  endpoint: string;
  prompt: string;
  refine: boolean;
  template: string;
  rendered?: string;
}

export function planCaption(input: CaptionPlanInput): CaptionPlan {
  const { settings, caption, user = '{{user}}', char = '{{char}}' } = input;
  const endpoint = endpointForCaptionSource(settings.source);
  const rendered = caption !== undefined
    ? settings.template
      .replace(/\{\{caption\}\}/g, caption)
      .replace(/\{\{user\}\}/g, user)
      .replace(/\{\{char\}\}/g, char)
    : undefined;
  return {
    source: settings.source,
    endpoint,
    prompt: settings.prompt,
    refine: settings.refine_mode === true,
    template: settings.template,
    ...(rendered === undefined ? {} : { rendered }),
  };
}

function endpointForCaptionSource(source: CaptionSource): string {
  switch (source) {
    case CAPTION_SOURCE.EXTRAS:
      return '/api/caption';
    case CAPTION_SOURCE.LOCAL:
      return '/api/extra/caption';
    case CAPTION_SOURCE.HORDE:
      return '/api/horde/caption-image';
    case CAPTION_SOURCE.MULTIMODAL:
      return '/api/multimodal/caption';
  }
}

// ---------------------------------------------------------------------------
// TTS extension

export const TTS_PROVIDERS = [
  'System', 'Edge', 'ElevenLabs', 'Silero', 'GPT-SoVITS', 'Coqui', 'Novel',
  'OpenAI', 'OpenAI-Compatible', 'XTTS', 'VITS', 'GSVI', 'SBVITS2', 'AllTalk',
  'CosyVoice', 'SpeechT5', 'Azure', 'Google Translate', 'Google Native',
  'Chatterbox', 'Kokoro', 'TTS WebUI', 'Pollinations', 'MiniMax',
  'Electron Hub', 'Chutes', 'Volcengine',
] as const;
export type TtsProvider = (typeof TTS_PROVIDERS)[number];

export interface TtsSettings {
  enabled: boolean;
  provider: TtsProvider;
  auto_generation: boolean;
  periodic_auto_generation: boolean;
  narrate_by_paragraphs: boolean;
  narrate_dialogues_only: boolean;
  narrate_quoted_only: boolean;
  narrate_translated_only: boolean;
  narrate_user: boolean;
  voice_per_character: Readonly<Record<string, string>>;
}

export const DEFAULT_TTS_SETTINGS: TtsSettings = {
  enabled: false,
  provider: 'System',
  auto_generation: false,
  periodic_auto_generation: false,
  narrate_by_paragraphs: false,
  narrate_dialogues_only: false,
  narrate_quoted_only: false,
  narrate_translated_only: false,
  narrate_user: false,
  voice_per_character: {},
};

export interface TtsNarrationCandidate {
  messageId: number;
  characterName: string;
  text: string;
  voiceId?: string;
}

// Port of TTS extract-narratable-text (tts/index.js, simplified)
export function selectTtsSegments(text: string, settings: TtsSettings): readonly string[] {
  let work = text.replace(/\r/g, '');
  if (settings.narrate_dialogues_only) {
    const matches = work.match(/"[^"]+"/g) ?? [];
    work = matches.join(' ');
  } else if (settings.narrate_quoted_only) {
    const matches = work.match(/[“"][^“”"]+[”"]/g) ?? [];
    work = matches.join(' ');
  }
  if (settings.narrate_by_paragraphs) {
    return work.split(/\n\s*\n+/).map((s) => s.trim()).filter((s) => s.length > 0);
  }
  return work.trim().length > 0 ? [work.trim()] : [];
}

export function planTtsNarration(input: {
  settings: TtsSettings;
  messageId: number;
  characterName: string;
  text: string;
  isUser?: boolean;
}): readonly TtsNarrationCandidate[] {
  const { settings, messageId, characterName, text, isUser } = input;
  if (!settings.enabled) return [];
  if (isUser && !settings.narrate_user) return [];
  const voiceId = settings.voice_per_character[characterName];
  return selectTtsSegments(text, settings).map((seg) => ({
    messageId,
    characterName,
    text: seg,
    ...(voiceId ? { voiceId } : {}),
  }));
}

// ---------------------------------------------------------------------------
// Translate extension

export const TRANSLATE_PROVIDERS = [
  'deepl', 'google', 'libre', 'lingva', 'oneringtranslator', 'bingtranslator',
  'deeplx', 'yandex', 'claude',
] as const;
export type TranslateProvider = (typeof TRANSLATE_PROVIDERS)[number];

export interface TranslateSettings {
  provider: TranslateProvider;
  target_language: string; // BCP-47
  auto_mode: 'off' | 'incoming' | 'outgoing' | 'both';
  show_original: boolean;
}

export const DEFAULT_TRANSLATE_SETTINGS: TranslateSettings = {
  provider: 'google',
  target_language: 'en',
  auto_mode: 'off',
  show_original: false,
};

export interface TranslatePlan {
  provider: TranslateProvider;
  target: string;
  endpoint: string;
  text: string;
}

export function planTranslate(text: string, settings: TranslateSettings): TranslatePlan {
  return {
    provider: settings.provider,
    target: settings.target_language,
    endpoint: `/api/translate/${settings.provider}`,
    text,
  };
}

export function shouldTranslateMessage(
  settings: TranslateSettings,
  direction: 'incoming' | 'outgoing',
): boolean {
  switch (settings.auto_mode) {
    case 'off': return false;
    case 'both': return true;
    case 'incoming': return direction === 'incoming';
    case 'outgoing': return direction === 'outgoing';
  }
}

// ---------------------------------------------------------------------------
// Expressions extension (classify → label → sprite folder)

export interface ExpressionsSettings {
  api: 'classify' | 'llm' | 'webllm' | 'none';
  default_expression: string;
  fallback_expression: string;
  translate: boolean;
  show_default: boolean;
  visual_novel_mode: boolean;
}

export const DEFAULT_EXPRESSIONS_SETTINGS: ExpressionsSettings = {
  api: 'classify',
  default_expression: 'neutral',
  fallback_expression: 'neutral',
  translate: false,
  show_default: true,
  visual_novel_mode: false,
};

export interface ClassifyExpressionPlan {
  api: ExpressionsSettings['api'];
  endpoint?: string;
  text: string;
  fallback: string;
}

export function planClassifyExpression(text: string, settings: ExpressionsSettings): ClassifyExpressionPlan {
  return {
    api: settings.api,
    ...(settings.api === 'classify' ? { endpoint: '/api/extra/classify' } : {}),
    text: text.slice(0, 1000),
    fallback: settings.fallback_expression,
  };
}

// In-memory cache for sprite folder lookups, mirrors ST's spriteCache shape.
export class SpriteCache {
  private cache = new Map<string, readonly string[]>();
  set(folder: string, sprites: readonly string[]): void { this.cache.set(folder, sprites); }
  get(folder: string): readonly string[] | undefined { return this.cache.get(folder); }
  clear(): void { this.cache.clear(); }
}

// ---------------------------------------------------------------------------
// Attachments / Data Bank extension

export const ATTACHMENT_SCOPE = {
  GLOBAL: 'global',
  CHARACTER: 'character',
  CHAT: 'chat',
} as const;
export type AttachmentScope = (typeof ATTACHMENT_SCOPE)[keyof typeof ATTACHMENT_SCOPE];

export interface DataBankAttachment {
  id: string;
  url: string;
  name: string;
  scope: AttachmentScope;
  size: number;
  text?: string;
  disabled?: boolean;
}

export const DATABANK_SLASH_COMMANDS = [
  'databank-list', 'data-bank-list',
  'databank-get', 'data-bank-get',
  'databank-add', 'data-bank-add',
  'databank-update', 'data-bank-update',
  'databank-delete', 'data-bank-delete',
  'databank-disable', 'data-bank-disable',
  'databank-enable', 'data-bank-enable',
] as const;

export class DataBankStore {
  private byScope: Record<AttachmentScope, DataBankAttachment[]> = {
    global: [],
    character: [],
    chat: [],
  };

  list(scope?: AttachmentScope): readonly DataBankAttachment[] {
    if (scope) return this.byScope[scope];
    return [
      ...this.byScope.global,
      ...this.byScope.character,
      ...this.byScope.chat,
    ];
  }

  add(attachment: DataBankAttachment): void {
    this.byScope[attachment.scope].push(attachment);
  }

  remove(scope: AttachmentScope, id: string): boolean {
    const list = this.byScope[scope];
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  }

  get(scope: AttachmentScope, id: string): DataBankAttachment | undefined {
    return this.byScope[scope].find((a) => a.id === id);
  }

  setEnabled(scope: AttachmentScope, id: string, enabled: boolean): boolean {
    const a = this.get(scope, id);
    if (!a) return false;
    a.disabled = !enabled;
    return true;
  }

  update(scope: AttachmentScope, id: string, patch: Partial<DataBankAttachment>): boolean {
    const a = this.get(scope, id);
    if (!a) return false;
    Object.assign(a, patch);
    return true;
  }
}

// ---------------------------------------------------------------------------
// Connection Manager extension

export interface ConnectionProfile {
  id: string;
  name: string;
  mode: string;
  api?: string;
  preset?: string;
  model?: string;
  proxy?: string;
  instruct?: string;
  context?: string;
  'instruct-state'?: string;
  tokenizer?: string;
  'stop-strings'?: string;
  'start-reply-with'?: string;
  'reasoning-template'?: string;
  'prompt-post-processing'?: string;
  sysprompt?: string;
  'sysprompt-state'?: string;
  'api-url'?: string;
  'secret-id'?: string;
  'regex-preset'?: string;
  exclude?: readonly string[];
}

// CC_COMMANDS / TC_COMMANDS lists from connection-manager (subset reflecting
// fields the profile snapshots). The slash-command surface itself is wired
// elsewhere; this constant exists for inventory/diagnostics.
export const CONNECTION_PROFILE_FIELDS = [
  'mode', 'api', 'preset', 'model', 'proxy', 'instruct', 'context',
  'instruct-state', 'tokenizer', 'stop-strings', 'start-reply-with',
  'reasoning-template', 'prompt-post-processing', 'sysprompt',
  'sysprompt-state', 'api-url', 'secret-id', 'regex-preset',
] as const;

export interface ConnectionProfileSnapshot {
  readonly profile: ConnectionProfile;
  readonly excluded: readonly string[];
}

export function snapshotConnectionProfile(
  current: Readonly<Record<string, string | undefined>>,
  partial: Partial<ConnectionProfile>,
): ConnectionProfileSnapshot {
  const profile: ConnectionProfile = {
    id: partial.id ?? cryptoRandomId(),
    name: partial.name ?? 'Profile',
    mode: partial.mode ?? current.mode ?? 'cc',
  };
  const excluded = new Set(partial.exclude ?? []);
  for (const field of CONNECTION_PROFILE_FIELDS) {
    if (excluded.has(field)) continue;
    const v = current[field];
    if (v !== undefined && v !== '') (profile as unknown as Record<string, unknown>)[field] = v;
  }
  if (partial.exclude) profile.exclude = [...partial.exclude];
  return { profile, excluded: [...excluded] };
}

export function applyConnectionProfilePlan(profile: ConnectionProfile): { command: string; value: string }[] {
  const excluded = new Set(profile.exclude ?? []);
  const plan: { command: string; value: string }[] = [];
  for (const field of CONNECTION_PROFILE_FIELDS) {
    if (excluded.has(field)) continue;
    const value = (profile as unknown as Record<string, unknown>)[field];
    if (typeof value === 'string' && value !== '') {
      plan.push({ command: field, value });
    }
  }
  return plan;
}

function cryptoRandomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------------------------------------------------------------------------
// Stable Diffusion trigger processor (subset)

export const SD_TRIGGER = {
  CHARACTER: 'character',
  USER: 'user',
  SCENERY: 'scenery',
  LAST_MESSAGE: 'last_message',
  RAW_LAST: 'raw_last',
  BACKGROUND: 'background',
} as const;
export type SdTrigger = (typeof SD_TRIGGER)[keyof typeof SD_TRIGGER];

export interface SdProcessTriggerInput {
  text: string;
  type?: 'normal' | 'continue' | 'impersonate' | 'swipe' | 'regenerate' | 'quiet';
}

export interface SdProcessTriggerResult {
  trigger?: SdTrigger;
  subject?: string;
  abort: boolean;
}

const SD_TRIGGER_PATTERNS: { pattern: RegExp; trigger: SdTrigger }[] = [
  { pattern: /\b(?:draws|sketches|paints|generates) ?an? image of ([^.\n]+)/i, trigger: SD_TRIGGER.CHARACTER },
  { pattern: /\b(?:show me|show) ?an? image of ([^.\n]+)/i, trigger: SD_TRIGGER.SCENERY },
];

export function processSdTriggers(input: SdProcessTriggerInput): SdProcessTriggerResult {
  if (!input.text) return { abort: false };
  for (const { pattern, trigger } of SD_TRIGGER_PATTERNS) {
    const m = input.text.match(pattern);
    if (m && m[1]) return { trigger, subject: m[1].trim(), abort: false };
  }
  return { abort: false };
}

export const SD_BACKENDS = [
  'automatic1111', 'comfy', 'comfyrunpod', 'drawthings', 'novelai',
  'openai', 'horde', 'pollinations', 'stability', 'togetherai',
] as const;
export type SdBackend = (typeof SD_BACKENDS)[number];

// ---------------------------------------------------------------------------
// Gallery / Assets — placeholders that mirror ST's data shapes

export interface GallerySettings {
  folders: Readonly<Record<string, string>>;
  sort: 'asc' | 'desc' | 'random';
}

export const DEFAULT_GALLERY_SETTINGS: GallerySettings = {
  folders: {},
  sort: 'desc',
};

export interface AssetEntry {
  id: string;
  type: string;
  name: string;
  url: string;
  installed: boolean;
}
