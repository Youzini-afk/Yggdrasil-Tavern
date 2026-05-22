// Deep port of SillyTavern PromptManager + ChatCompletion algorithms.
//
// References (read at port time):
//   public/scripts/PromptManager.js — Prompt + PromptCollection + defaults
//   public/scripts/openai.js — preparePromptsForChatCompletion, populationInjectionPrompts,
//     populateChatHistory, populateDialogueExamples, squashSystemMessages, ChatCompletion
//
// This module exposes ST-style classes and the prepare/populate/squash functions.
// It does not call the network, does not run tokenizers, and does not store secrets.
// Token counting falls back to a char/4 approximation; the precise tokenizer port
// lives in tokenizers.ts (phase N8).

export const INJECTION_POSITION = {
  RELATIVE: 0,
  ABSOLUTE: 1,
} as const;
export type InjectionPositionValue = (typeof INJECTION_POSITION)[keyof typeof INJECTION_POSITION];

export const NAMES_BEHAVIOR = {
  NONE: -1,
  DEFAULT: 0,
  COMPLETION: 1,
  CONTENT: 2,
} as const;
export type NamesBehaviorValue = (typeof NAMES_BEHAVIOR)[keyof typeof NAMES_BEHAVIOR];

export const EXTENSION_PROMPT_TYPES = {
  NONE: -1,
  IN_PROMPT: 0,
  IN_CHAT: 1,
  BEFORE_PROMPT: 2,
} as const;
export type ExtensionPromptType = (typeof EXTENSION_PROMPT_TYPES)[keyof typeof EXTENSION_PROMPT_TYPES];

export const EXTENSION_PROMPT_ROLES = {
  SYSTEM: 0,
  USER: 1,
  ASSISTANT: 2,
} as const;
export type ExtensionPromptRoleValue = (typeof EXTENSION_PROMPT_ROLES)[keyof typeof EXTENSION_PROMPT_ROLES];

export const DEFAULT_DUMMY_CHARACTER_ID = 100001;

export const SYSTEM_PROMPT_IDENTIFIERS = ['main', 'nsfw', 'jailbreak', 'enhanceDefinitions'] as const;
export const OVERRIDABLE_PROMPT_IDENTIFIERS = ['main', 'jailbreak'] as const;
export const SQUASH_EXCLUDED_IDS = ['newMainChat', 'newChat', 'groupNudge'] as const;

// Default ST prompt order from PromptManager.js promptManagerDefaultPromptOrder
export const DEFAULT_PROMPT_ORDER = [
  'main',
  'worldInfoBefore',
  'personaDescription',
  'charDescription',
  'charPersonality',
  'scenario',
  'enhanceDefinitions',
  'nsfw',
  'worldInfoAfter',
  'dialogueExamples',
  'chatHistory',
  'jailbreak',
] as const;

export const DEFAULT_MARKER_IDENTIFIERS: ReadonlySet<string> = new Set([
  'dialogueExamples',
  'chatHistory',
  'worldInfoAfter',
  'worldInfoBefore',
  'charDescription',
  'charPersonality',
  'scenario',
  'personaDescription',
  'enhanceDefinitions',
]);

export type STRole = 'system' | 'user' | 'assistant' | 'tool';
export type GenerationType = 'normal' | 'continue' | 'impersonate' | 'swipe' | 'regenerate' | 'quiet';

export interface PromptInit {
  identifier?: string;
  role?: STRole;
  content?: string;
  name?: string;
  system_prompt?: boolean;
  position?: string;
  injection_position?: InjectionPositionValue;
  injection_depth?: number;
  injection_order?: number;
  forbid_overrides?: boolean;
  extension?: boolean;
  injection_trigger?: readonly string[];
  marker?: boolean;
  enabled?: boolean;
}

export class Prompt {
  identifier: string;
  role: STRole;
  content: string;
  name: string;
  system_prompt: boolean;
  position?: string;
  injection_position: InjectionPositionValue;
  injection_depth: number;
  injection_order: number;
  forbid_overrides: boolean;
  extension: boolean;
  injection_trigger: readonly string[];
  marker: boolean;
  enabled: boolean;

  constructor(init: PromptInit = {}) {
    this.identifier = init.identifier ?? generateUuid();
    this.role = init.role ?? 'system';
    this.content = init.content ?? '';
    this.name = init.name ?? '';
    this.system_prompt = init.system_prompt ?? false;
    this.position = init.position;
    this.injection_position = init.injection_position ?? INJECTION_POSITION.RELATIVE;
    this.injection_depth = init.injection_depth ?? 4;
    this.injection_order = init.injection_order ?? 100;
    this.forbid_overrides = init.forbid_overrides ?? false;
    this.extension = init.extension ?? false;
    this.injection_trigger = init.injection_trigger ?? [];
    this.marker = init.marker ?? DEFAULT_MARKER_IDENTIFIERS.has(this.identifier);
    this.enabled = init.enabled ?? true;
  }
}

export class PromptCollection {
  private items: Prompt[] = [];
  readonly overriddenPrompts: string[] = [];

  add(...prompts: Prompt[]): void {
    for (const prompt of prompts) {
      if (!(prompt instanceof Prompt)) {
        throw new TypeError('PromptCollection.add expects Prompt instances');
      }
      this.items.push(prompt);
    }
  }

  set(prompt: Prompt, position: number): void {
    if (!(prompt instanceof Prompt)) {
      throw new TypeError('PromptCollection.set expects a Prompt instance');
    }
    this.items[position] = prompt;
  }

  override(prompt: Prompt, position: number): void {
    this.set(prompt, position);
    this.overriddenPrompts.push(prompt.identifier);
  }

  get(identifier: string): Prompt | undefined {
    return this.items.find((p) => p.identifier === identifier);
  }

  index(identifier: string): number {
    return this.items.findIndex((p) => p.identifier === identifier);
  }

  has(identifier: string): boolean {
    return this.index(identifier) !== -1;
  }

  insertAt(prompt: Prompt, position: number): void {
    this.items.splice(position, 0, prompt);
  }

  remove(identifier: string): void {
    const idx = this.index(identifier);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    }
  }

  toArray(): readonly Prompt[] {
    return [...this.items];
  }

  get length(): number {
    return this.items.length;
  }
}

export interface MessageInit {
  role: STRole;
  content: string;
  name?: string;
  identifier?: string;
  tool_call_id?: string;
}

export class Message {
  role: STRole;
  content: string;
  name?: string;
  identifier?: string;
  tool_call_id?: string;
  tokens: number;

  constructor(init: MessageInit) {
    this.role = init.role;
    this.content = init.content;
    if (init.name !== undefined) this.name = init.name;
    if (init.identifier !== undefined) this.identifier = init.identifier;
    if (init.tool_call_id !== undefined) this.tool_call_id = init.tool_call_id;
    this.tokens = approxTokenCount(init.content);
  }

  setName(name: string): void {
    const sanitized = sanitizeName(name);
    if (sanitized.length > 0) {
      this.name = sanitized;
    }
  }

  toObject(): { role: STRole; content: string; name?: string; tool_call_id?: string } {
    const obj: { role: STRole; content: string; name?: string; tool_call_id?: string } = {
      role: this.role,
      content: this.content,
    };
    if (this.name !== undefined) obj.name = this.name;
    if (this.tool_call_id !== undefined) obj.tool_call_id = this.tool_call_id;
    return obj;
  }
}

export class MessageCollection {
  identifier: string;
  messages: Message[];

  constructor(identifier: string, messages: Message[] = []) {
    this.identifier = identifier;
    this.messages = messages;
  }

  add(message: Message): void {
    this.messages.push(message);
  }

  prepend(message: Message): void {
    this.messages.unshift(message);
  }

  get tokens(): number {
    return this.messages.reduce((sum, m) => sum + m.tokens, 0);
  }
}

export class ChatCompletion {
  private tokenBudget = 0;
  private items: Array<Message | MessageCollection> = [];
  readonly prompts: PromptCollection;

  constructor(prompts: PromptCollection) {
    this.prompts = prompts;
  }

  setTokenBudget(context: number, response: number): void {
    this.tokenBudget = context - response;
  }

  getRemainingBudget(): number {
    return this.tokenBudget;
  }

  reserveBudget(amount: number): void {
    this.tokenBudget -= amount;
  }

  freeBudget(amount: number): void {
    this.tokenBudget += amount;
  }

  canAfford(item: Message | MessageCollection): boolean {
    return this.tokenBudget >= item.tokens;
  }

  append(item: Message | MessageCollection): void {
    this.items.push(item);
  }

  prepend(item: Message | MessageCollection): void {
    this.items.unshift(item);
  }

  insertAt(item: Message | MessageCollection, position: number): void {
    this.items.splice(position, 0, item);
  }

  insertAfter(item: Message | MessageCollection, identifier: string): void {
    const idx = this.findIndex(identifier);
    if (idx !== -1) {
      this.items.splice(idx + 1, 0, item);
    } else {
      this.items.push(item);
    }
  }

  insertBefore(item: Message | MessageCollection, identifier: string): void {
    const idx = this.findIndex(identifier);
    if (idx !== -1) {
      this.items.splice(idx, 0, item);
    } else {
      this.items.push(item);
    }
  }

  appendIntoCollection(message: Message, collectionIdentifier: string): void {
    const target = this.findItem(collectionIdentifier);
    if (target instanceof MessageCollection) {
      target.add(message);
    } else {
      this.items.push(message);
    }
  }

  prependIntoCollection(message: Message, collectionIdentifier: string): void {
    const target = this.findItem(collectionIdentifier);
    if (target instanceof MessageCollection) {
      target.prepend(message);
    } else {
      this.items.unshift(message);
    }
  }

  has(identifier: string): boolean {
    return this.findIndex(identifier) !== -1;
  }

  remove(identifier: string): void {
    const idx = this.findIndex(identifier);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    }
  }

  getCollection(identifier: string): MessageCollection | undefined {
    const item = this.findItem(identifier);
    return item instanceof MessageCollection ? item : undefined;
  }

  getItems(): readonly (Message | MessageCollection)[] {
    return this.items;
  }

  getChat(): { role: STRole; content: string; name?: string; tool_call_id?: string }[] {
    const chat: { role: STRole; content: string; name?: string; tool_call_id?: string }[] = [];
    for (const item of this.items) {
      if (item instanceof Message) {
        chat.push(item.toObject());
      } else {
        for (const msg of item.messages) {
          chat.push(msg.toObject());
        }
      }
    }
    return chat;
  }

  private findIndex(identifier: string): number {
    return this.items.findIndex((item) =>
      item instanceof Message ? item.identifier === identifier : item.identifier === identifier,
    );
  }

  private findItem(identifier: string): Message | MessageCollection | undefined {
    return this.items.find((item) =>
      item instanceof Message ? item.identifier === identifier : item.identifier === identifier,
    );
  }
}

export interface PromptOrderEntry {
  identifier: string;
  enabled: boolean;
}

export interface PromptOrderList {
  character_id: string | number;
  order: PromptOrderEntry[];
}

export function getPromptOrderForCharacter(
  prompt_order: readonly PromptOrderList[],
  character: { id: string | number } | undefined,
): readonly PromptOrderEntry[] {
  if (character === undefined) return [];
  return (
    prompt_order.find((list) => String(list.character_id) === String(character.id))?.order ?? []
  );
}

export function isPromptDisabledForActiveCharacter(
  prompt_order: readonly PromptOrderList[],
  character: { id: string | number } | undefined,
  identifier: string,
): boolean {
  const entry = getPromptOrderForCharacter(prompt_order, character).find(
    (e) => e.identifier === identifier,
  );
  return entry !== undefined ? !entry.enabled : false;
}

export interface ExtensionPromptEntry {
  value: string;
  position: ExtensionPromptType;
  depth: number;
  scan: boolean;
  role: ExtensionPromptRoleValue;
}

export interface STChatMessage {
  role: STRole;
  content: string;
  name?: string;
  identifier?: string;
  is_user?: boolean;
  is_system?: boolean;
  is_narrator?: boolean;
  hidden?: boolean;
  deleted?: boolean;
}

export interface PreparePromptsInput {
  prompts: readonly PromptInit[] | Record<string, PromptInit>;
  prompt_order?: readonly PromptOrderList[];
  active_character?: { id: string | number };
  generation_type?: GenerationType;
  // Marker fills
  worldInfoBefore?: string;
  worldInfoAfter?: string;
  charDescription?: string;
  charPersonality?: string;
  scenario?: string;
  personaDescription?: string;
  // Format strings
  scenario_format?: string;
  personality_format?: string;
  // Overrides
  systemPromptOverride?: string;
  jailbreakPromptOverride?: string;
  // OpenAI / power_user settings
  squash_system_messages?: boolean;
  names_behavior?: NamesBehaviorValue;
  impersonation_prompt?: string;
  group_nudge_prompt?: string;
  continue_prefill?: boolean;
  continue_nudge_prompt?: string;
  // Extension prompts (1_memory, 2_floating_prompt, 3_vectors, 4_vectors_data_bank, chromadb)
  extensionPrompts?: Record<string, ExtensionPromptEntry>;
  // Budget
  openai_max_context?: number;
  openai_max_tokens?: number;
  // Bias / quiet
  bias?: string;
  quietPrompt?: string;
  // Group
  selected_group?: { name: string; members: string[] } | null;
  // Strategy
  prompt_strategy?: 'global' | 'character';
  dummy_id?: number | string;
  // substituteParams hook
  substituteParams?: (text: string) => string;
}

export interface PrepareDiagnostics {
  overriddenPrompts: readonly string[];
  disabledSkipped: readonly string[];
  disabledAnchors: readonly string[];
  triggerSkipped: readonly string[];
  unknownPromptIds: readonly string[];
  warnings: readonly string[];
  reservations: { reason: string; tokens: number }[];
  triggeredOverrides: { identifier: string; status: 'applied' | 'blocked_disabled' | 'blocked_forbidden' | 'missing_prompt' }[];
}

export interface PreparePromptsResult {
  chatCompletion: ChatCompletion;
  prompts: PromptCollection;
  diagnostics: PrepareDiagnostics;
}

// Port of preparePromptsForChatCompletion (openai.js)
export function preparePromptsForChatCompletion(
  input: PreparePromptsInput,
): PreparePromptsResult {
  const promptsMap = normalizePromptsToMap(input.prompts);
  const character = input.active_character ?? { id: input.dummy_id ?? DEFAULT_DUMMY_CHARACTER_ID };
  const orderEntries = input.prompt_order && input.prompt_order.length > 0
    ? getPromptOrderForCharacter(input.prompt_order, character)
    : [];
  const effectiveOrder = orderEntries.length > 0 ? orderEntries : buildDefaultOrder(promptsMap);

  const collection = new PromptCollection();
  const generationType = input.generation_type ?? 'normal';
  const subst = input.substituteParams ?? ((s: string) => s);

  const disabledSkipped: string[] = [];
  const disabledAnchors: string[] = [];
  const triggerSkipped: string[] = [];
  const unknownPromptIds: string[] = [];
  const warnings: string[] = [];
  const triggeredOverrides: PrepareDiagnostics['triggeredOverrides'] = [];

  for (const entry of effectiveOrder) {
    const promptInit = promptsMap.get(entry.identifier);
    if (promptInit === undefined) {
      // Built-in marker that the caller didn't pre-declare → fabricate
      if (DEFAULT_MARKER_IDENTIFIERS.has(entry.identifier)) {
        const marker = new Prompt({ identifier: entry.identifier, marker: true, content: '' });
        if (entry.enabled === false) {
          if (entry.identifier === 'main') {
            disabledAnchors.push(entry.identifier);
            collection.add(new Prompt({ identifier: 'main', content: '', enabled: false }));
          } else {
            disabledSkipped.push(entry.identifier);
          }
          continue;
        }
        fillMarkerContent(marker, input, subst);
        collection.add(marker);
        continue;
      }
      unknownPromptIds.push(entry.identifier);
      continue;
    }

    const prompt = new Prompt(promptInit);

    if (entry.enabled === false) {
      if (entry.identifier === 'main') {
        // Main is special: keep as empty anchor
        const anchor = new Prompt({ ...promptInit, content: '', enabled: false });
        collection.add(anchor);
        disabledAnchors.push(entry.identifier);
      } else {
        disabledSkipped.push(entry.identifier);
      }
      continue;
    }

    // injection_trigger filter
    if (
      prompt.injection_trigger.length > 0 &&
      !prompt.injection_trigger.includes(generationType)
    ) {
      triggerSkipped.push(entry.identifier);
      continue;
    }

    // ABSOLUTE prompts skip relative collection - they're handled by populationInjectionPrompts
    if (prompt.injection_position === INJECTION_POSITION.ABSOLUTE) {
      collection.add(prompt);
      continue;
    }

    // Marker fills (applied after enabled & trigger checks)
    fillMarkerContent(prompt, input, subst);

    collection.add(prompt);
  }

  // Apply overrides for main and jailbreak
  for (const id of OVERRIDABLE_PROMPT_IDENTIFIERS) {
    const overrideContent = id === 'main'
      ? input.systemPromptOverride
      : input.jailbreakPromptOverride;
    if (overrideContent === undefined) continue;

    const idx = collection.index(id);
    if (idx === -1) {
      warnings.push(`Override requested for ${id} but prompt not in collection`);
      triggeredOverrides.push({ identifier: id, status: 'missing_prompt' });
      continue;
    }
    const existing = collection.get(id)!;
    if (existing.enabled === false) {
      warnings.push(`Override blocked: ${id} is disabled`);
      triggeredOverrides.push({ identifier: id, status: 'blocked_disabled' });
      continue;
    }
    if (existing.forbid_overrides === true) {
      warnings.push(`Override blocked: ${id} has forbid_overrides=true`);
      triggeredOverrides.push({ identifier: id, status: 'blocked_forbidden' });
      continue;
    }
    const original = existing.content;
    const newContent = overrideContent.includes('{{original}}')
      ? overrideContent.split('{{original}}').join(original)
      : overrideContent;
    const overridden = new Prompt({
      identifier: existing.identifier,
      role: existing.role,
      content: newContent,
      name: existing.name,
      system_prompt: existing.system_prompt,
      injection_position: existing.injection_position,
      injection_depth: existing.injection_depth,
      injection_order: existing.injection_order,
      forbid_overrides: existing.forbid_overrides,
      extension: existing.extension,
      injection_trigger: existing.injection_trigger,
      marker: existing.marker,
      enabled: existing.enabled,
    });
    collection.override(overridden, idx);
    triggeredOverrides.push({ identifier: id, status: 'applied' });
  }

  const chatCompletion = new ChatCompletion(collection);
  if (input.openai_max_context !== undefined && input.openai_max_tokens !== undefined) {
    chatCompletion.setTokenBudget(input.openai_max_context, input.openai_max_tokens);
  }

  const reservations: { reason: string; tokens: number }[] = [];

  // Walk collection in order, building messages / message collections
  for (const prompt of collection.toArray()) {
    if (prompt.injection_position === INJECTION_POSITION.ABSOLUTE) {
      // Skip - injected later via populationInjectionPrompts
      continue;
    }
    if (prompt.marker || prompt.identifier === 'chatHistory' || prompt.identifier === 'dialogueExamples') {
      // Markers become MessageCollection placeholders for later population.
      // chatHistory and dialogueExamples are always placeholders even if not flagged marker.
      const mc = new MessageCollection(prompt.identifier);
      // Marker prompts that were filled with content (e.g. worldInfoBefore) emit as a message instead
      if (
        prompt.content.trim() !== '' &&
        prompt.identifier !== 'chatHistory' &&
        prompt.identifier !== 'dialogueExamples'
      ) {
        mc.add(new Message({
          role: prompt.role,
          content: prompt.content,
          identifier: prompt.identifier,
        }));
      }
      chatCompletion.append(mc);
      continue;
    }
    if (prompt.content.trim() === '') {
      // Skip empty non-marker prompts (except main anchor which we keep as empty placeholder)
      if (prompt.identifier === 'main' && prompt.enabled === false) {
        chatCompletion.append(new Message({
          role: prompt.role,
          content: '',
          identifier: 'main',
        }));
      }
      continue;
    }
    chatCompletion.append(new Message({
      role: prompt.role,
      content: prompt.content,
      name: prompt.name || undefined,
      identifier: prompt.identifier,
    }));
  }

  // Control prompts: impersonate, quiet, bias
  if (generationType === 'impersonate' && input.impersonation_prompt) {
    const msg = new Message({
      role: 'system',
      content: subst(input.impersonation_prompt),
      identifier: 'impersonate',
    });
    if (chatCompletion.has('chatHistory')) {
      chatCompletion.insertBefore(msg, 'chatHistory');
    } else {
      chatCompletion.append(msg);
    }
  }

  if (generationType === 'quiet' && input.quietPrompt) {
    const msg = new Message({
      role: 'system',
      content: input.quietPrompt,
      identifier: 'quietPrompt',
    });
    chatCompletion.append(msg);
  }

  if (input.bias && input.bias.length > 0) {
    const msg = new Message({
      role: 'assistant',
      content: input.bias,
      identifier: 'bias',
    });
    chatCompletion.append(msg);
  }

  // Extension prompts: summary (1_memory), authorsNote (2_floating_prompt),
  // vectorsMemory (3_vectors), vectorsDataBank (4_vectors_data_bank), smartContext (chromadb)
  // For BEFORE_PROMPT and IN_PROMPT positions only here.
  if (input.extensionPrompts) {
    appendExtensionPrompts(chatCompletion, input.extensionPrompts);
  }

  // Group nudge: appended at end of chatHistory, excluded from squash, reserves budget
  if (input.selected_group && generationType !== 'impersonate' && input.group_nudge_prompt) {
    const memberStr = input.selected_group.members.join(', ');
    const nudgeContent = subst(
      input.group_nudge_prompt
        .split('{{group}}').join(memberStr)
        .split('{{group_members}}').join(memberStr),
    );
    const msg = new Message({
      role: 'system',
      content: nudgeContent,
      identifier: 'groupNudge',
    });
    chatCompletion.appendIntoCollection(msg, 'chatHistory');
    reservations.push({ reason: 'groupNudge', tokens: msg.tokens });
    chatCompletion.reserveBudget(msg.tokens);
  }

  return {
    chatCompletion,
    prompts: collection,
    diagnostics: {
      overriddenPrompts: collection.overriddenPrompts,
      disabledSkipped,
      disabledAnchors,
      triggerSkipped,
      unknownPromptIds,
      warnings,
      reservations,
      triggeredOverrides,
    },
  };
}

function normalizePromptsToMap(
  prompts: PreparePromptsInput['prompts'],
): Map<string, PromptInit> {
  const map = new Map<string, PromptInit>();
  if (Array.isArray(prompts)) {
    for (const p of prompts) {
      if (p.identifier) map.set(p.identifier, p);
    }
  } else {
    for (const [id, p] of Object.entries(prompts)) {
      const merged: PromptInit = { ...(p as PromptInit), identifier: (p as PromptInit).identifier ?? id };
      map.set(merged.identifier as string, merged);
    }
  }
  return map;
}

function buildDefaultOrder(promptsMap: Map<string, PromptInit>): readonly PromptOrderEntry[] {
  // If the caller didn't supply prompt_order, walk DEFAULT_PROMPT_ORDER intersected with provided prompts,
  // then append any extra prompts after.
  const seen = new Set<string>();
  const entries: PromptOrderEntry[] = [];
  for (const id of DEFAULT_PROMPT_ORDER) {
    if (promptsMap.has(id) || DEFAULT_MARKER_IDENTIFIERS.has(id)) {
      entries.push({ identifier: id, enabled: true });
      seen.add(id);
    }
  }
  for (const id of promptsMap.keys()) {
    if (!seen.has(id)) {
      entries.push({ identifier: id, enabled: true });
    }
  }
  return entries;
}

function fillMarkerContent(
  prompt: Prompt,
  input: PreparePromptsInput,
  subst: (text: string) => string,
): void {
  switch (prompt.identifier) {
    case 'worldInfoBefore':
      if (input.worldInfoBefore !== undefined) prompt.content = input.worldInfoBefore;
      break;
    case 'worldInfoAfter':
      if (input.worldInfoAfter !== undefined) prompt.content = input.worldInfoAfter;
      break;
    case 'charDescription':
      if (input.charDescription !== undefined) {
        prompt.content = subst(input.charDescription);
      }
      break;
    case 'charPersonality':
      if (input.charPersonality !== undefined) {
        prompt.content = input.personality_format
          ? subst(input.personality_format.split('{{personality}}').join(input.charPersonality))
          : subst(input.charPersonality);
      }
      break;
    case 'scenario':
      if (input.scenario !== undefined) {
        prompt.content = input.scenario_format
          ? subst(input.scenario_format.split('{{scenario}}').join(input.scenario))
          : subst(input.scenario);
      }
      break;
    case 'personaDescription':
      if (input.personaDescription !== undefined) {
        prompt.content = subst(input.personaDescription);
      }
      break;
  }
}

function appendExtensionPrompts(
  chatCompletion: ChatCompletion,
  extensionPrompts: Record<string, ExtensionPromptEntry>,
): void {
  // ST extension prompt keys we know about (BEFORE_PROMPT / IN_PROMPT)
  const known: Record<string, string> = {
    '1_memory': 'summary',
    '2_floating_prompt': 'authorsNote',
    '3_vectors': 'vectorsMemory',
    '4_vectors_data_bank': 'vectorsDataBank',
    'chromadb': 'smartContext',
  };
  for (const [key, entry] of Object.entries(extensionPrompts)) {
    if (entry.position !== EXTENSION_PROMPT_TYPES.BEFORE_PROMPT && entry.position !== EXTENSION_PROMPT_TYPES.IN_PROMPT) {
      continue;
    }
    if (!entry.value) continue;
    const role: STRole =
      entry.role === EXTENSION_PROMPT_ROLES.USER
        ? 'user'
        : entry.role === EXTENSION_PROMPT_ROLES.ASSISTANT
          ? 'assistant'
          : 'system';
    const identifier = known[key] ?? key.replace(/\W/g, '_');
    const msg = new Message({ role, content: entry.value, identifier });
    chatCompletion.append(msg);
  }
}

// Port of populationInjectionPrompts (openai.js)
// Walks chat (newest-first reversed indexing) and splices ABSOLUTE prompts at their depths.
// For each depth d in 0..maxDepth:
//   collect ABSOLUTE prompts where injection_depth === d && content
//   group by injection_order desc
//   within order group, group by role: system, user, assistant
//   join same-role with \n
//   merge IN_CHAT extension prompts at depth into bucket order=100
//   splice into chat at depth + totalInserted (insert from front)
export function populationInjectionPrompts(
  chat: STChatMessage[],
  prompts: PromptCollection,
  extensionPrompts: Record<string, ExtensionPromptEntry> = {},
  maxDepth = 4,
): STChatMessage[] {
  const absolutePrompts = prompts
    .toArray()
    .filter(
      (p) =>
        p.injection_position === INJECTION_POSITION.ABSOLUTE &&
        p.content !== undefined &&
        p.content.trim() !== '',
    );

  const result = [...chat];
  let totalInserted = 0;

  for (let depth = 0; depth <= maxDepth; depth++) {
    const atDepth = absolutePrompts.filter((p) => p.injection_depth === depth);
    const hasExt = hasExtensionAtDepth(extensionPrompts, depth);
    if (atDepth.length === 0 && !hasExt) continue;

    // Bucket by injection_order
    const byOrder = new Map<number, Prompt[]>();
    for (const p of atDepth) {
      const order = p.injection_order ?? 100;
      const list = byOrder.get(order) ?? [];
      list.push(p);
      byOrder.set(order, list);
    }
    if (hasExt && !byOrder.has(100)) byOrder.set(100, []);

    const orders = Array.from(byOrder.keys()).sort((a, b) => b - a); // desc

    for (const order of orders) {
      const bucket = byOrder.get(order) ?? [];
      const byRole: Record<STRole, string[]> = { system: [], user: [], assistant: [], tool: [] };
      for (const p of bucket) byRole[p.role].push(p.content);

      if (order === 100) {
        const ext = collectExtensionPromptsAtDepth(extensionPrompts, depth);
        if (ext.system) byRole.system.push(ext.system);
        if (ext.user) byRole.user.push(ext.user);
        if (ext.assistant) byRole.assistant.push(ext.assistant);
      }

      const insertions: STChatMessage[] = [];
      for (const role of ['system', 'user', 'assistant'] as const) {
        const merged = byRole[role].join('\n');
        if (merged.length > 0) insertions.push({ role, content: merged });
      }

      if (insertions.length > 0) {
        const insertPos = Math.min(depth + totalInserted, result.length);
        result.splice(insertPos, 0, ...insertions);
        totalInserted += insertions.length;
      }
    }
  }

  return result;
}

function hasExtensionAtDepth(
  extensionPrompts: Record<string, ExtensionPromptEntry>,
  depth: number,
): boolean {
  return Object.values(extensionPrompts).some(
    (e) => e.position === EXTENSION_PROMPT_TYPES.IN_CHAT && e.depth === depth && e.value,
  );
}

function collectExtensionPromptsAtDepth(
  extensionPrompts: Record<string, ExtensionPromptEntry>,
  depth: number,
): { system?: string; user?: string; assistant?: string } {
  const buckets: { system?: string[]; user?: string[]; assistant?: string[] } = {};
  for (const entry of Object.values(extensionPrompts)) {
    if (entry.position !== EXTENSION_PROMPT_TYPES.IN_CHAT || entry.depth !== depth || !entry.value) {
      continue;
    }
    const role: 'system' | 'user' | 'assistant' =
      entry.role === EXTENSION_PROMPT_ROLES.USER
        ? 'user'
        : entry.role === EXTENSION_PROMPT_ROLES.ASSISTANT
          ? 'assistant'
          : 'system';
    (buckets[role] ??= []).push(entry.value);
  }
  return {
    system: buckets.system?.join('\n'),
    user: buckets.user?.join('\n'),
    assistant: buckets.assistant?.join('\n'),
  };
}

// Port of squashSystemMessages (openai.js)
// Merges consecutive UNNAMED system messages with \n.
// Skips empty system messages.
// Excludes ids: newMainChat, newChat, groupNudge.
export function squashSystemMessages(messages: readonly STChatMessage[]): STChatMessage[] {
  const result: STChatMessage[] = [];
  for (const msg of messages) {
    if (msg.role === 'system' && (!msg.content || msg.content.trim() === '')) continue;

    const last = result[result.length - 1];
    const lastExcluded =
      last !== undefined && last.identifier !== undefined &&
      (SQUASH_EXCLUDED_IDS as readonly string[]).includes(last.identifier);
    const msgExcluded =
      msg.identifier !== undefined &&
      (SQUASH_EXCLUDED_IDS as readonly string[]).includes(msg.identifier);

    if (
      last !== undefined &&
      last.role === 'system' &&
      msg.role === 'system' &&
      !last.name &&
      !msg.name &&
      !lastExcluded &&
      !msgExcluded
    ) {
      result[result.length - 1] = {
        ...last,
        content: last.content + '\n' + msg.content,
      };
    } else {
      result.push(msg);
    }
  }
  return result;
}

// Port of populateChatHistory (openai.js)
// Walks chat newest→oldest, prepends affordable messages, stops on first unaffordable.
export interface PopulateChatHistoryOptions {
  names_behavior?: NamesBehaviorValue;
  pin_examples?: boolean;
  isContinue?: boolean;
  continue_prefill?: boolean;
  continueNudgePrompt?: string;
}

export interface PopulateChatHistoryResult {
  inserted: number;
  dropped: number;
}

export function populateChatHistory(
  chatCompletion: ChatCompletion,
  chat: readonly STChatMessage[],
  options: PopulateChatHistoryOptions = {},
): PopulateChatHistoryResult {
  const collection = chatCompletion.getCollection('chatHistory');
  if (!collection) return { inserted: 0, dropped: 0 };

  const namesBehavior = options.names_behavior ?? NAMES_BEHAVIOR.NONE;
  const reversed = [...chat].reverse();

  let inserted = 0;
  let dropped = 0;
  for (let i = 0; i < reversed.length; i++) {
    const msg = reversed[i];
    if (!msg) continue;
    if (msg.hidden === true || msg.deleted === true) continue;

    const identifier = `chatHistory-${chat.length - i}`;
    const message = new Message({
      role: msg.is_narrator ? 'system' : msg.role,
      content: msg.content.replace(/\r/g, ''),
      identifier,
    });

    if (namesBehavior === NAMES_BEHAVIOR.COMPLETION && msg.name) {
      message.setName(msg.name);
    } else if (namesBehavior === NAMES_BEHAVIOR.CONTENT && msg.name && msg.role !== 'system') {
      message.content = `${msg.name}: ${message.content}`;
      message.tokens = approxTokenCount(message.content);
    }

    if (!chatCompletion.canAfford(message)) {
      dropped++;
      break;
    }

    collection.prepend(message);
    chatCompletion.reserveBudget(message.tokens);
    inserted++;
  }

  // Drain remaining as dropped count
  dropped += reversed.length - inserted - dropped;
  return { inserted, dropped };
}

// Port of populateDialogueExamples (openai.js)
// Replaces <START> with {Example Dialogue:} and inserts example blocks.
export interface PopulateDialogueExamplesOptions {
  newExampleChatPrompt?: string;
  pin_examples?: boolean;
}

export function populateDialogueExamples(
  chatCompletion: ChatCompletion,
  examples: readonly string[] | string,
  options: PopulateDialogueExamplesOptions = {},
): { inserted: number; blocks: number } {
  const collection = chatCompletion.getCollection('dialogueExamples');
  if (!collection) return { inserted: 0, blocks: 0 };

  const blockSep = options.newExampleChatPrompt ?? '[Example Chat]';
  const rawBlocks = Array.isArray(examples)
    ? examples
    : (typeof examples === 'string' ? splitExampleText(examples) : []);

  let inserted = 0;
  let blockCount = 0;
  for (const block of rawBlocks) {
    if (!block || block.trim() === '') continue;
    const blockMessages = parseExampleBlock(block);

    // Reserve newExampleChat header
    const header = new Message({ role: 'system', content: blockSep });
    if (!chatCompletion.canAfford(header)) break;

    let blockAffordable = true;
    let tokensThisBlock = header.tokens;
    for (const m of blockMessages) {
      tokensThisBlock += m.tokens;
      if (chatCompletion.getRemainingBudget() < tokensThisBlock) {
        blockAffordable = false;
        break;
      }
    }
    if (!blockAffordable) break;

    collection.add(header);
    chatCompletion.reserveBudget(header.tokens);
    for (const m of blockMessages) {
      collection.add(m);
      chatCompletion.reserveBudget(m.tokens);
      inserted++;
    }
    blockCount++;
  }

  return { inserted, blocks: blockCount };
}

// Port of parseExampleIntoIndividual (openai.js, simplified): split by lines,
// skip first line (header), detect user/bot lines via name1: / name2: prefix,
// emit messages with role=system and name=example_user / example_assistant.
function parseExampleBlock(block: string): Message[] {
  // splitExampleText already removed the {Example Dialogue:} marker, so the block
  // contains only dialogue lines. Do NOT skip the first line as a header here.
  const messages: Message[] = [];
  const lines = block.split(/\r?\n/);
  let current: { role: STRole; name: string; content: string[] } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    if (line.startsWith('{{user}}:') || /^[A-Za-z0-9_]+:\s/.test(line)) {
      if (current) {
        messages.push(new Message({
          role: current.role,
          content: current.content.join('\n'),
          name: current.name,
        }));
      }
      const isUser = line.startsWith('{{user}}:');
      current = {
        role: 'system',
        name: isUser ? 'example_user' : 'example_assistant',
        content: [line.replace(/^[^:]*:\s?/, '')],
      };
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current) {
    messages.push(new Message({
      role: current.role,
      content: current.content.join('\n'),
      name: current.name,
    }));
  }
  return messages;
}

function splitExampleText(text: string): string[] {
  // ST replaces <START> with {Example Dialogue:}
  const normalized = text.replace(/<START>/g, '{Example Dialogue:}');
  return normalized.split('{Example Dialogue:}').map((s) => s.trim()).filter((s) => s.length > 0);
}

// Sanitize name to ST OpenAI rules: [A-Za-z0-9_]{1,64}
export function sanitizeName(name: string): string {
  return name.replace(/[^A-Za-z0-9_]/g, '_').substring(0, 64);
}

// Approximate token count (real port lives in N8 tokenizers.ts)
function approxTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

function generateUuid(): string {
  // Avoid Node-specific imports for portability across Node and browser bundles.
  const r = () => Math.random().toString(16).slice(2, 10);
  return `${r()}${r()}-${r()}-${r()}-${r()}-${r()}${r()}${r()}`;
}
