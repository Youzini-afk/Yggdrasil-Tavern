// power-user-shim.mjs: Replaces ST's power-user.js

export const power_user = {
  // ST getInstructMacros dereferences sysprompt.content unconditionally for
  // {{systemPrompt}} / {{defaultSystemPrompt}} (SillyTavern
  // public/scripts/instruct-mode.js:753-761). Provide the same object shape in
  // the headless harness so evaluateMacros can execute without fixture fallback.
  sysprompt: {
    content: '',
    enabled: true,
  },
  prefer_character_prompt: false,
  instruct: {
    enabled: true,
    wrap: true,
    macro: true,
    names_behavior: 'force',
    system_same_as_user: false,
    input_sequence: '<|im_start|>user\n',
    output_sequence: '<|im_start|>assistant\n',
    first_output_sequence: '',
    last_output_sequence: '',
    input_suffix: '<|im_end|>\n',
    output_suffix: '<|im_end|>\n',
    system_sequence: '<|im_start|>system\n',
    system_suffix: '<|im_end|>\n',
    last_system_sequence: '',
    first_input_sequence: '',
    last_input_sequence: '',
    stop_sequence: '',
    separator_sequence: '',
    user_alignment_message: '',
    story_string_prefix: '',
    story_string_suffix: '',
    activation_regex: '',
    skip_examples: false,
    bind_to_context: false,
    sequences_as_stop_strings: false,
  },
  // ST getInstructMacros also reads context.example_separator/chat_start for
  // {{chatSeparator}} / {{chatStart}} (instruct-mode.js:763-773).
  context: { preset: 'default', example_separator: '', chat_start: '' },
  experimental_macro_engine: false,
  persona_description_position: 0,
  token_count: 0,
  auto_scroll: true,
  waifuMode: false,
  movingUI: false,
  collapsible_blocks: false,
  send_button_visible: true,
};

export const context_presets = { default: {} };
export const persona_description_positions = { BEFORE_CHAR: 0, AFTER_CHAR: 1, BEFORE_SYSTEM: 2, AFTER_SYSTEM: 3 };
export const MAX_CONTEXT_DEFAULT = 8192;
export const MAX_RESPONSE_DEFAULT = 2048;

export function loadPowerUserSettings() {}
export function collapseNewlines(text) { return (text || '').replace(/\n{3,}/g, '\n\n'); }
export function playMessageSound() {}
export function fixMarkdown(text) { return text; }
export function renderStoryString() { return ''; }
export function sortEntitiesList() {}
export function registerDebugFunction() {}
export function flushEphemeralStoppingStrings() { return []; }
export function resetMovableStyles() {}
export function forceCharacterEditorTokenize() {}
export function applyPowerUserSettings() {}
export function generatedTextFiltered() { return false; }
export function applyStylePins() {}
export function getCustomStoppingStrings() { return []; }
export function initMovingUI() {}
