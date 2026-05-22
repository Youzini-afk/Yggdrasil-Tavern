/**
 * globals.mjs: Installs ALL shims in the correct order before any ST module import.
 *
 * ORDER MATTERS:
 * 1. dom.mjs          — jsdom globals (window, document, Node, Element, localStorage)
 * 2. jquery.mjs       — $ and jQuery stubs (need window/document from dom)
 * 3. time.mjs         — Frozen Date/moment
 * 4. rng.mjs          — seedrandom Math.random replacement
 * 5. uuid.mjs         — Deterministic uuidv4
 * 6. domPurify.mjs    — Passthrough sanitizer
 * 7. fetch.mjs        — Fetch interceptor
 * 8. toastr.mjs       — No-op notification
 * 9. popup.mjs        — Reject all dialogs
 */

// 1. DOM first
import '../shims/dom.mjs';
// 2. jQuery (needs window/document)
import '../shims/jquery.mjs';
// 3. Frozen time
import { FROZEN_EPOCH, overrideMomentNow } from '../shims/time.mjs';
// 4. Deterministic RNG
import '../shims/rng.mjs';
// 5. Deterministic UUID
import { resetUuidCounter } from '../shims/uuid.mjs';
// 6. DOMPurify passthrough
import '../shims/domPurify.mjs';
// 7. Fetch interceptor
import { clearCaptured } from '../shims/fetch.mjs';
// 8. toastr no-op
import '../shims/toastr.mjs';
// 9. Popup stub
import '../shims/popup.mjs';

// Now install additional globals that ST modules expect
import Handlebars from 'handlebars';
import moment from 'moment';
import seedrandom from 'seedrandom';
import Fuse from 'fuse.js';

// Install library globals on window
globalThis.Handlebars = Handlebars;
globalThis.moment = moment;
globalThis.seedrandom = seedrandom;
globalThis.Fuse = Fuse;
globalThis.window.Handlebars = Handlebars;
globalThis.window.moment = moment;
globalThis.window.seedrandom = seedrandom;
globalThis.window.Fuse = Fuse;

// Override moment.now for deterministic time
overrideMomentNow(moment);

// Additional globals that various ST modules reference
globalThis.eventSource = {
  on: () => {},
  off: () => {},
  emit: () => true,
  once: () => {},
  removeAllListeners: () => {},
};

globalThis.event_types = {};
globalThis.extension_settings = {};
globalThis.power_user = {
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
  context: {
    preset: 'default',
  },
  experimental_macro_engine: false,
};

globalThis.oai_settings = {
  temp_openai: 0.7,
  top_p_openai: 1.0,
  openai_max_tokens: 256,
  stream_openai: false,
  openai_model: 'gpt-4o-mini',
  chat_completion_source: 'openai',
  frequency_penalty_openai: 0,
  presence_penalty_openai: 0,
  top_k_openai: 0,
  min_p_openai: 0,
  top_a_openai: 0,
  repetition_penalty_openai: 1,
  openai_prose_length: 0,
  openai_prose_label: '',
};

globalThis.textgenerationwebui_settings = {
  temp: 0.7,
  top_p: 1.0,
  top_k: 40,
  max_tokens: 256,
  repetition_penalty: 1,
};

globalThis.selected_group = null;
globalThis.groups = [];

/**
 * Resets all deterministic state for a fresh run.
 * Call this before each scenario to ensure reproducibility.
 */
export function resetHarnessState() {
  resetUuidCounter();
  clearCaptured();
  // Re-seed the RNG
  const rng = seedrandom('ydltavern-fixture-v1');
  Math.random = () => rng();
}

export { FROZEN_EPOCH };
