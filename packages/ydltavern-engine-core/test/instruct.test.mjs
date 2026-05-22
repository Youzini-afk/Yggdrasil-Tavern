import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatInstructModeChat,
  formatInstructModeStoryString,
  formatInstructModeExamples,
  getInstructStoppingSequences,
  INSTRUCT_NAMES_BEHAVIOR,
  CHATML_TEMPLATE,
  ALPACA_TEMPLATE,
  VICUNA_TEMPLATE,
  MISTRAL_TEMPLATE,
  LLAMA3_TEMPLATE,
  BUILT_IN_TEMPLATES,
} from '../dist/index.js';

test('CHATML wraps user message with im_start/im_end and newline boundaries', () => {
  const out = formatInstructModeChat(
    { role: 'user', content: 'Hello' },
    CHATML_TEMPLATE,
    'Char',
    'Alice',
  );
  assert.ok(out.includes('<|im_start|>user'));
  assert.ok(out.includes('Hello'));
  assert.ok(out.includes('<|im_end|>'));
});

test('CHATML user message has no User prefix when names_behavior=force', () => {
  const out = formatInstructModeChat(
    { role: 'user', content: 'Hello, how are you today?', name: 'User' },
    { ...CHATML_TEMPLATE, names_behavior: INSTRUCT_NAMES_BEHAVIOR.FORCE },
    'Assistant',
    'User',
  );
  assert.equal(out, '<|im_start|>user\n\nHello, how are you today?<|im_end|>');
  assert.equal(out.includes('User: '), false);
});

test('CHATML wraps assistant message correctly', () => {
  const out = formatInstructModeChat(
    { role: 'assistant', content: 'Hi' },
    CHATML_TEMPLATE,
  );
  assert.ok(out.includes('<|im_start|>assistant'));
  assert.ok(out.includes('Hi'));
});

test('CHATML wraps system message via system_sequence by default', () => {
  const out = formatInstructModeChat(
    { role: 'system', content: 'You are helpful.' },
    CHATML_TEMPLATE,
  );
  assert.ok(out.includes('<|im_start|>system'));
  assert.ok(out.includes('You are helpful.'));
});

test('Mistral system_same_as_user routes system through input sequence', () => {
  const out = formatInstructModeChat(
    { role: 'system', content: 'sys' },
    MISTRAL_TEMPLATE,
  );
  assert.ok(out.startsWith('[INST]'));
});

test('first/last sequence variants override base when isFirst/isLast set', () => {
  const tmpl = {
    ...VICUNA_TEMPLATE,
    first_input_sequence: 'FIRST_USER: ',
    last_output_sequence: 'LAST_AI: ',
  };
  const first = formatInstructModeChat(
    { role: 'user', content: 'hi', isFirst: true },
    tmpl,
  );
  assert.ok(first.startsWith('FIRST_USER: '));

  const last = formatInstructModeChat(
    { role: 'assistant', content: 'bye', isLast: true },
    tmpl,
  );
  assert.ok(last.startsWith('LAST_AI: '));
});

test('names_behavior=ALWAYS prefixes name into body', () => {
  const tmpl = { ...VICUNA_TEMPLATE, names_behavior: INSTRUCT_NAMES_BEHAVIOR.ALWAYS };
  const out = formatInstructModeChat(
    { role: 'user', content: 'hi', name: 'Alice' },
    tmpl,
  );
  assert.ok(out.includes('Alice: hi'));
});

test('names_behavior=NEVER does not prefix name', () => {
  const out = formatInstructModeChat(
    { role: 'user', content: 'hi', name: 'Alice' },
    VICUNA_TEMPLATE,
  );
  assert.ok(!out.includes('Alice:'));
});

test('{{name}} substitution in sequences uses provided name', () => {
  const tmpl = {
    ...VICUNA_TEMPLATE,
    input_sequence: '{{name}}: ',
  };
  const out = formatInstructModeChat(
    { role: 'user', content: 'hi', name: 'Bob' },
    tmpl,
  );
  assert.ok(out.startsWith('Bob: '));
});

test('formatInstructModeStoryString wraps with prefix and suffix', () => {
  const tmpl = { story_string_prefix: '<<', story_string_suffix: '>>' };
  assert.equal(formatInstructModeStoryString('story body', tmpl), '<<story body>>');
});

test('formatInstructModeExamples skips when skip_examples=true', () => {
  const tmpl = { ...VICUNA_TEMPLATE, skip_examples: true };
  const out = formatInstructModeExamples(
    [{ role: 'user', content: 'a' }],
    tmpl,
  );
  assert.equal(out, '');
});

test('formatInstructModeExamples concatenates formatted messages', () => {
  const out = formatInstructModeExamples(
    [
      { role: 'user', content: 'q' },
      { role: 'assistant', content: 'a' },
    ],
    VICUNA_TEMPLATE,
  );
  assert.ok(out.includes('USER: q'));
  assert.ok(out.includes('ASSISTANT: a'));
});

test('getInstructStoppingSequences includes sequences when sequences_as_stop_strings=true', () => {
  const stops = getInstructStoppingSequences({
    ...CHATML_TEMPLATE,
    wrap: false,
  });
  assert.ok(stops.includes('<|im_start|>user\n'));
  assert.ok(stops.includes('<|im_start|>assistant\n'));
  assert.ok(stops.includes('<|im_end|>'));
});

test('getInstructStoppingSequences excludes sequences when sequences_as_stop_strings=false', () => {
  const tmpl = {
    ...CHATML_TEMPLATE,
    sequences_as_stop_strings: false,
    wrap: false,
  };
  const stops = getInstructStoppingSequences(tmpl);
  assert.equal(stops.includes('<|im_start|>user\n'), false);
  assert.ok(stops.includes('<|im_end|>'));
});

test('getInstructStoppingSequences appends chatStart and exampleSeparator', () => {
  const stops = getInstructStoppingSequences(
    { ...VICUNA_TEMPLATE, wrap: false },
    { chatStart: '***', exampleSeparator: '+++' },
  );
  assert.ok(stops.includes('***'));
  assert.ok(stops.includes('+++'));
});

test('getInstructStoppingSequences prefixes \\n when wrap=true', () => {
  const stops = getInstructStoppingSequences({
    ...CHATML_TEMPLATE,
    wrap: true,
  });
  assert.ok(stops.some((s) => s.startsWith('\n')));
});

test('BUILT_IN_TEMPLATES exposes ChatML/Alpaca/Vicuna/Mistral/Llama 3', () => {
  assert.equal(BUILT_IN_TEMPLATES.ChatML, CHATML_TEMPLATE);
  assert.equal(BUILT_IN_TEMPLATES.Alpaca, ALPACA_TEMPLATE);
  assert.equal(BUILT_IN_TEMPLATES.Vicuna, VICUNA_TEMPLATE);
  assert.equal(BUILT_IN_TEMPLATES.Mistral, MISTRAL_TEMPLATE);
  assert.equal(BUILT_IN_TEMPLATES['Llama 3'], LLAMA3_TEMPLATE);
});

test('Llama 3 template wraps with start_header_id and eot_id', () => {
  const out = formatInstructModeChat(
    { role: 'user', content: 'hi' },
    LLAMA3_TEMPLATE,
  );
  assert.ok(out.includes('<|start_header_id|>user<|end_header_id|>'));
  assert.ok(out.includes('<|eot_id|>'));
});

test('Llama 3 user message has no persona prefix when names_behavior=force', () => {
  const out = formatInstructModeChat(
    { role: 'user', content: 'I need your help with something important.', name: 'Atlas' },
    { ...LLAMA3_TEMPLATE, names_behavior: INSTRUCT_NAMES_BEHAVIOR.FORCE },
    'Luna',
    'Atlas',
  );
  assert.equal(out, '<|start_header_id|>user<|end_header_id|>\n\nI need your help with something important.<|eot_id|>');
  assert.equal(out.includes('Atlas: '), false);
});

test('Alpaca template uses ### Instruction / ### Response sequences', () => {
  const u = formatInstructModeChat({ role: 'user', content: 'q' }, ALPACA_TEMPLATE);
  const a = formatInstructModeChat({ role: 'assistant', content: 'r' }, ALPACA_TEMPLATE);
  assert.ok(u.includes('### Instruction:'));
  assert.ok(a.includes('### Response:'));
});

test('Alpaca template still supports User prefix when names_behavior=always', () => {
  const out = formatInstructModeChat(
    { role: 'user', content: 'q', name: 'User' },
    { ...ALPACA_TEMPLATE, names_behavior: INSTRUCT_NAMES_BEHAVIOR.ALWAYS },
  );
  assert.ok(out.includes('User: q'));
});
