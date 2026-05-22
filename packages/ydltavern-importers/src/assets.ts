import type { JsonObject, JsonValue, STPreservedPayload } from '@ydltavern/types';

import type { ImportDiagnostic } from './common/diagnostics.js';
import { booleanProp, jsonObjectArrayProp, objectProp, parseJsonInput, pickFirstObject, pickFirstString, pickFirstStringArray, stringArrayProp, stringProp } from './common/json.js';

export type PresetFormat = 'chat_completion' | 'text_completion' | 'openai' | 'kobold' | 'novel' | 'context' | 'instruct' | 'sysprompt' | 'unknown_json';
export type RegexScriptScope = 'GLOBAL' | 'PRESET' | 'SCOPED';

export interface ImportedPreset {
  readonly kind: 'preset';
  readonly format: PresetFormat;
  readonly name?: string;
  readonly prompt_order?: JsonValue;
  readonly sampler?: JsonObject;
  readonly raw: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedPersona {
  readonly kind: 'persona';
  readonly name?: string;
  readonly description?: string;
  readonly avatar?: string;
  readonly tags?: readonly string[];
  readonly extensions?: JsonObject;
  readonly raw: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedTheme {
  readonly kind: 'theme';
  readonly name?: string;
  readonly vars?: JsonObject;
  readonly css?: string;
  readonly background?: string | JsonObject;
  readonly powerUser?: JsonObject;
  readonly raw: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedQuickReplyItem {
  readonly label?: string;
  readonly message?: string;
  readonly autoExecute?: boolean;
  readonly raw: JsonObject;
}

export interface ImportedQuickReplySet {
  readonly name?: string;
  readonly items: readonly ImportedQuickReplyItem[];
  readonly links?: readonly string[];
  readonly autoExecute?: boolean;
  readonly raw: JsonObject;
}

export interface ImportedQuickReplies {
  readonly kind: 'quick_reply';
  readonly sets: readonly ImportedQuickReplySet[];
  readonly raw: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedRegexScript {
  readonly scope: RegexScriptScope;
  readonly name?: string;
  readonly find?: string;
  readonly replace?: string;
  readonly flags?: string;
  readonly placement?: string;
  readonly raw: JsonObject;
}

export interface ImportedRegexScripts {
  readonly kind: 'regex_script';
  readonly scripts: readonly ImportedRegexScript[];
  readonly raw: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export interface ImportedInstructPreset {
  readonly kind: 'instruct_preset';
  readonly name?: string;
  readonly system?: string;
  readonly user?: string;
  readonly assistant?: string;
  readonly separator?: string;
  readonly wrap?: boolean;
  readonly templates?: JsonObject;
  readonly raw: JsonObject;
  readonly preserved: STPreservedPayload;
  readonly diagnostics: readonly ImportDiagnostic[];
}

export function importPreset(input: string | JsonObject): ImportedPreset {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'preset JSON');
  return {
    kind: 'preset',
    format: detectPresetFormat(payload),
    name: stringProp(payload, 'name') ?? stringProp(payload, 'preset_name'),
    prompt_order: payload.prompt_order ?? payload.promptOrder,
    sampler: pickFirstObject(payload, ['sampler', 'samplers', 'sampling', 'parameters', 'settings']),
    raw: payload,
    preserved: { format: 'sillytavern_preset', payload },
    diagnostics,
  };
}

export function importPersona(input: string | JsonObject): ImportedPersona {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'persona JSON');
  return {
    kind: 'persona',
    name: pickFirstString(payload, ['name', 'persona_name', 'display_name']),
    description: pickFirstString(payload, ['description', 'prompt', 'persona_description']),
    avatar: pickFirstString(payload, ['avatar', 'avatar_url', 'image']),
    tags: pickFirstStringArray(payload, ['tags', 'tag_map']),
    extensions: objectProp(payload, 'extensions'),
    raw: payload,
    preserved: { format: 'sillytavern_persona', payload },
    diagnostics,
  };
}

export function importTheme(input: string | JsonObject): ImportedTheme {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'theme JSON');
  return {
    kind: 'theme',
    name: stringProp(payload, 'name'),
    vars: pickFirstObject(payload, ['vars', 'variables', 'cssVars']),
    css: pickFirstString(payload, ['css', 'custom_css']),
    background: stringProp(payload, 'background') ?? objectProp(payload, 'background'),
    powerUser: pickFirstObject(payload, ['power_user', 'powerUser', 'power_user_settings']),
    raw: payload,
    preserved: { format: 'sillytavern_theme', payload },
    diagnostics,
  };
}

export function importQuickReplies(input: string | JsonObject): ImportedQuickReplies {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'quick replies JSON');
  const setPayloads = jsonObjectArrayProp(payload, 'sets') ?? jsonObjectArrayProp(payload, 'quickReplySets') ?? [payload];
  const sets = setPayloads.map((set, index) => normalizeQuickReplySet(set, index, diagnostics));
  return {
    kind: 'quick_reply',
    sets,
    raw: payload,
    preserved: { format: 'sillytavern_quick_replies', payload },
    diagnostics,
  };
}

export function importRegexScripts(input: string | JsonObject): ImportedRegexScripts {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'regex scripts JSON');
  const scriptPayloads = jsonObjectArrayProp(payload, 'scripts') ?? jsonObjectArrayProp(payload, 'regex') ?? jsonObjectArrayProp(payload, 'data') ?? [payload];
  const scripts = scriptPayloads.map((script) => normalizeRegexScript(script));
  return {
    kind: 'regex_script',
    scripts,
    raw: payload,
    preserved: { format: 'sillytavern_regex_scripts', payload },
    diagnostics,
  };
}

export function importInstructPreset(input: string | JsonObject): ImportedInstructPreset {
  const diagnostics: ImportDiagnostic[] = [];
  const payload = parseJsonInput(input, 'instruct preset JSON');
  return {
    kind: 'instruct_preset',
    name: stringProp(payload, 'name'),
    system: pickFirstString(payload, ['system', 'system_prompt', 'system_sequence']),
    user: pickFirstString(payload, ['user', 'user_prompt', 'input_sequence', 'user_sequence']),
    assistant: pickFirstString(payload, ['assistant', 'assistant_prompt', 'output_sequence', 'assistant_sequence']),
    separator: pickFirstString(payload, ['separator', 'separator_sequence', 'stop_sequence']),
    wrap: booleanProp(payload, 'wrap') ?? booleanProp(payload, 'wrap_in_quotes'),
    templates: pickFirstObject(payload, ['templates', 'template', 'prompts']),
    raw: payload,
    preserved: { format: 'sillytavern_instruct_preset', payload },
    diagnostics,
  };
}

function detectPresetFormat(payload: JsonObject): PresetFormat {
  const name = `${stringProp(payload, 'type') ?? ''} ${stringProp(payload, 'api') ?? ''} ${stringProp(payload, 'source') ?? ''} ${stringProp(payload, 'preset_type') ?? ''}`.toLowerCase();
  if (name.includes('openai')) return 'openai';
  if (name.includes('kobold')) return 'kobold';
  if (name.includes('novel')) return 'novel';
  if (name.includes('context')) return 'context';
  if (name.includes('instruct')) return 'instruct';
  if (name.includes('sysprompt') || name.includes('system')) return 'sysprompt';
  if (payload.prompt_order !== undefined || payload.prompts !== undefined) return 'chat_completion';
  if (payload.temperature !== undefined || payload.top_p !== undefined || payload.max_length !== undefined || payload.max_tokens !== undefined) return 'text_completion';
  return 'unknown_json';
}

function normalizeQuickReplySet(set: JsonObject, index: number, diagnostics: ImportDiagnostic[]): ImportedQuickReplySet {
  const itemPayloads = jsonObjectArrayProp(set, 'items') ?? jsonObjectArrayProp(set, 'quickReplies') ?? jsonObjectArrayProp(set, 'quick_replies') ?? [];
  if (itemPayloads.length === 0) diagnostics.push({ severity: 'warning', message: 'Quick reply set has no item array; returning empty items.', path: `sets.${index}.items` });
  return {
    name: stringProp(set, 'name'),
    items: itemPayloads.map(normalizeQuickReplyItem),
    links: stringArrayProp(set, 'links') ?? stringArrayProp(set, 'linkedSets'),
    autoExecute: booleanProp(set, 'autoExecute') ?? booleanProp(set, 'auto_execute'),
    raw: set,
  };
}

function normalizeQuickReplyItem(item: JsonObject): ImportedQuickReplyItem {
  return {
    label: pickFirstString(item, ['label', 'name', 'title']),
    message: pickFirstString(item, ['message', 'mes', 'content', 'text']),
    autoExecute: booleanProp(item, 'autoExecute') ?? booleanProp(item, 'auto_execute'),
    raw: item,
  };
}

function normalizeRegexScript(script: JsonObject): ImportedRegexScript {
  return {
    scope: normalizeRegexScope(stringProp(script, 'scope') ?? stringProp(script, 'type')),
    name: stringProp(script, 'name') ?? stringProp(script, 'scriptName'),
    find: pickFirstString(script, ['find', 'pattern', 'regex']),
    replace: pickFirstString(script, ['replace', 'substitute', 'replacement']),
    flags: stringProp(script, 'flags'),
    placement: stringProp(script, 'placement') ?? stringProp(script, 'position'),
    raw: script,
  };
}

function normalizeRegexScope(value: string | undefined): RegexScriptScope {
  const upper = value?.toUpperCase();
  if (upper === 'PRESET') return 'PRESET';
  if (upper === 'SCOPED' || upper === 'CHARACTER' || upper === 'CHAT') return 'SCOPED';
  return 'GLOBAL';
}
