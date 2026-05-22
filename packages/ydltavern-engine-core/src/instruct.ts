// Deep port of SillyTavern instruct-mode formatting.
//
// References (read at port time):
//   public/scripts/instruct-mode.js — formatInstructModeChat / StoryString / Examples
//   public/scripts/instruct-mode.js:301-367 getInstructStoppingSequences
//   public/scripts/instruct-mode.js:387-579 chat formatting
//
// Pure logic. No DOM. Deterministic given same input.

export type InstructRole = 'system' | 'user' | 'assistant';

export const INSTRUCT_NAMES_BEHAVIOR = {
  ALWAYS: 'always',
  FORCE: 'force',
  NEVER: 'never',
} as const;
export type InstructNamesBehavior = (typeof INSTRUCT_NAMES_BEHAVIOR)[keyof typeof INSTRUCT_NAMES_BEHAVIOR];

export interface InstructTemplate {
  enabled?: boolean;
  wrap?: boolean;
  macro?: boolean;
  story_string_prefix?: string;
  story_string_suffix?: string;
  input_sequence?: string;
  input_suffix?: string;
  output_sequence?: string;
  output_suffix?: string;
  system_sequence?: string;
  system_suffix?: string;
  last_system_sequence?: string;
  user_alignment_message?: string;
  stop_sequence?: string;
  first_output_sequence?: string;
  last_output_sequence?: string;
  first_input_sequence?: string;
  last_input_sequence?: string;
  activation_regex?: string;
  bind_to_context?: boolean;
  skip_examples?: boolean;
  names_behavior?: InstructNamesBehavior;
  system_same_as_user?: boolean;
  sequences_as_stop_strings?: boolean;
}

export interface FormatChatMessageInput {
  role: InstructRole;
  content: string;
  name?: string;
  isFirst?: boolean;
  isLast?: boolean;
  isNarrator?: boolean;
}

// formatInstructModeChat (instruct-mode.js:387-457)
export function formatInstructModeChat(
  message: FormatChatMessageInput,
  template: InstructTemplate,
  charName?: string,
  userName?: string,
): string {
  const { role, content, name, isFirst, isLast, isNarrator } = message;
  const wrap = template.wrap === true;

  let prefix = '';
  let suffix = '';

  if (isNarrator || role === 'system') {
    if (template.system_same_as_user) {
      prefix = pickInputSeq(template, isFirst, isLast);
      suffix = template.input_suffix ?? '';
    } else {
      prefix = isLast && template.last_system_sequence
        ? template.last_system_sequence
        : (template.system_sequence ?? '');
      suffix = template.system_suffix ?? '';
    }
  } else if (role === 'user') {
    prefix = pickInputSeq(template, isFirst, isLast);
    suffix = template.input_suffix ?? '';
  } else {
    prefix = pickOutputSeq(template, isFirst, isLast);
    suffix = template.output_suffix ?? '';
  }

  // {{name}} substitution in sequences
  const nameForSubst = name ?? (role === 'user' ? userName : charName) ?? '';
  prefix = prefix.replace(/\{\{name\}\}/g, nameForSubst);
  suffix = suffix.replace(/\{\{name\}\}/g, nameForSubst);

  const namesBehavior = template.names_behavior ?? INSTRUCT_NAMES_BEHAVIOR.NEVER;
  const includeName =
    namesBehavior === INSTRUCT_NAMES_BEHAVIOR.ALWAYS ||
    namesBehavior === INSTRUCT_NAMES_BEHAVIOR.FORCE;

  // ST inserts persona prefixes only in the message body assembly step
  // (SillyTavern/public/scripts/instruct-mode.js:450-453). Header-role
  // templates such as ChatML and Llama 3 keep identity in the control tokens,
  // so their bodies must remain plain content even if an imported preset has
  // names_behavior='force'.
  const body = includeName && nameForSubst && !suppressesBodyNamePrefix(template)
    ? `${nameForSubst}: ${content}`
    : content;

  // Wrap with newline if wrap=true and no suffix
  if (wrap && !suffix) suffix = '\n';

  const separator = wrap && suppressesBodyNamePrefix(template) ? '\n' : '';
  return [prefix, `${body}${suffix}`].filter((x) => x).join(separator);
}

function pickInputSeq(template: InstructTemplate, isFirst?: boolean, isLast?: boolean): string {
  if (isFirst && template.first_input_sequence) return template.first_input_sequence;
  if (isLast && template.last_input_sequence) return template.last_input_sequence;
  return template.input_sequence ?? '';
}

function pickOutputSeq(template: InstructTemplate, isFirst?: boolean, isLast?: boolean): string {
  if (isFirst && template.first_output_sequence) return template.first_output_sequence;
  if (isLast && template.last_output_sequence) return template.last_output_sequence;
  return template.output_sequence ?? '';
}

function suppressesBodyNamePrefix(template: InstructTemplate): boolean {
  return isChatMLTemplate(template) || isLlama3Template(template);
}

function isChatMLTemplate(template: InstructTemplate): boolean {
  return (template.input_sequence ?? '').includes('<|im_start|>user')
    && (template.output_sequence ?? '').includes('<|im_start|>assistant')
    && (template.input_suffix ?? '').includes('<|im_end|>');
}

function isLlama3Template(template: InstructTemplate): boolean {
  return (template.input_sequence ?? '').includes('<|start_header_id|>user<|end_header_id|>')
    && (template.output_sequence ?? '').includes('<|start_header_id|>assistant<|end_header_id|>')
    && (template.input_suffix ?? '').includes('<|eot_id|>');
}

// formatInstructModeStoryString (instruct-mode.js)
export function formatInstructModeStoryString(
  story: string,
  template: InstructTemplate,
): string {
  const prefix = template.story_string_prefix ?? '';
  const suffix = template.story_string_suffix ?? '';
  return `${prefix}${story}${suffix}`;
}

// formatInstructModeExamples (instruct-mode.js)
export function formatInstructModeExamples(
  examples: readonly { role: InstructRole; content: string; name?: string }[],
  template: InstructTemplate,
  charName?: string,
  userName?: string,
): string {
  if (template.skip_examples) return '';
  return examples
    .map((m) => formatInstructModeChat({ ...m }, template, charName, userName))
    .join('');
}

// getInstructStoppingSequences (instruct-mode.js:301-367)
export function getInstructStoppingSequences(
  template: InstructTemplate,
  options: { chatStart?: string; exampleSeparator?: string } = {},
): string[] {
  const seqs = new Set<string>();
  const wrap = template.wrap === true;
  const add = (s?: string): void => {
    if (!s) return;
    seqs.add(wrap ? `\n${s}` : s);
  };

  if (template.sequences_as_stop_strings) {
    add(template.input_sequence);
    add(template.output_sequence);
    add(template.first_output_sequence);
    add(template.last_output_sequence);
    add(template.system_sequence);
    add(template.last_system_sequence);
  }
  add(template.stop_sequence);
  add(options.chatStart);
  add(options.exampleSeparator);

  return [...seqs].filter((s) => s.length > 0);
}

// ChatML built-in (per ST instructPresets/ChatML.json)
export const CHATML_TEMPLATE: InstructTemplate = {
  enabled: true,
  wrap: true,
  macro: true,
  system_sequence: '<|im_start|>system\n',
  system_suffix: '<|im_end|>',
  input_sequence: '<|im_start|>user\n',
  input_suffix: '<|im_end|>',
  output_sequence: '<|im_start|>assistant\n',
  output_suffix: '<|im_end|>',
  stop_sequence: '<|im_end|>',
  names_behavior: INSTRUCT_NAMES_BEHAVIOR.NEVER,
  system_same_as_user: false,
  sequences_as_stop_strings: true,
};

export const ALPACA_TEMPLATE: InstructTemplate = {
  enabled: true,
  wrap: true,
  macro: true,
  system_sequence: '',
  system_suffix: '\n',
  input_sequence: '### Instruction:\n',
  input_suffix: '\n',
  output_sequence: '### Response:\n',
  output_suffix: '\n',
  stop_sequence: '',
  names_behavior: INSTRUCT_NAMES_BEHAVIOR.NEVER,
  sequences_as_stop_strings: true,
};

export const VICUNA_TEMPLATE: InstructTemplate = {
  enabled: true,
  wrap: true,
  macro: true,
  system_sequence: 'SYSTEM: ',
  system_suffix: '\n',
  input_sequence: 'USER: ',
  input_suffix: '\n',
  output_sequence: 'ASSISTANT: ',
  output_suffix: '\n',
  stop_sequence: '',
  names_behavior: INSTRUCT_NAMES_BEHAVIOR.NEVER,
  sequences_as_stop_strings: true,
};

export const MISTRAL_TEMPLATE: InstructTemplate = {
  enabled: true,
  wrap: false,
  macro: true,
  input_sequence: '[INST] ',
  input_suffix: ' [/INST]',
  output_sequence: '',
  output_suffix: '</s>',
  system_sequence: '[INST] ',
  system_suffix: ' [/INST]',
  stop_sequence: '</s>',
  system_same_as_user: true,
  names_behavior: INSTRUCT_NAMES_BEHAVIOR.NEVER,
};

export const LLAMA3_TEMPLATE: InstructTemplate = {
  enabled: true,
  wrap: false,
  macro: true,
  system_sequence: '<|start_header_id|>system<|end_header_id|>\n\n',
  system_suffix: '<|eot_id|>',
  input_sequence: '<|start_header_id|>user<|end_header_id|>\n\n',
  input_suffix: '<|eot_id|>',
  output_sequence: '<|start_header_id|>assistant<|end_header_id|>\n\n',
  output_suffix: '<|eot_id|>',
  stop_sequence: '<|eot_id|>',
  names_behavior: INSTRUCT_NAMES_BEHAVIOR.NEVER,
  sequences_as_stop_strings: true,
};

export const BUILT_IN_TEMPLATES: Readonly<Record<string, InstructTemplate>> = {
  ChatML: CHATML_TEMPLATE,
  Alpaca: ALPACA_TEMPLATE,
  Vicuna: VICUNA_TEMPLATE,
  Mistral: MISTRAL_TEMPLATE,
  'Llama 3': LLAMA3_TEMPLATE,
};
