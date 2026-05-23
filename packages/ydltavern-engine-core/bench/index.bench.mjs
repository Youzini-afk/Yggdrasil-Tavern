import {
  preparePromptsForChatCompletion,
  populateChatHistory,
  populateDialogueExamples,
  squashSystemMessages,
  evaluateWorldInfo,
  substituteMacros,
  countTokens,
  TOKENIZER,
} from '../dist/index.js';
import { runBench } from './_harness.mjs';
import { promptSmall, promptMedium, promptLarge } from './fixtures/prompts.mjs';
import { wiSmall, wiMedium, wiLarge } from './fixtures/world-info.mjs';
import { macrosShort, macrosLong, macroContext, macroOptions } from './fixtures/macros.mjs';
import { text100, text10k } from './fixtures/tokenizer.mjs';

function compilePromptFixture(fixture) {
  const { chat, examples, ...input } = fixture;
  const prepared = preparePromptsForChatCompletion(input);
  populateChatHistory(prepared.chatCompletion, chat, { names_behavior: input.names_behavior });
  populateDialogueExamples(prepared.chatCompletion, examples);
  const messages = input.squash_system_messages === false
    ? prepared.chatCompletion.getChat()
    : squashSystemMessages(prepared.chatCompletion.getChat());
  return { ...prepared, messages };
}

// engine-core exports countTokens as the public async tokenizer surface. It uses
// concrete local adapters for OpenAI/GPT and Llama3, so these scenarios benchmark
// count/encode-equivalent paths without reaching out to the filesystem or network.
await runBench('@ydltavern/engine-core', [
  { name: 'prompt_manager.compile.small', fn: () => compilePromptFixture(promptSmall) },
  { name: 'prompt_manager.compile.medium', fn: () => compilePromptFixture(promptMedium) },
  { name: 'prompt_manager.compile.large', fn: () => compilePromptFixture(promptLarge) },
  { name: 'world_info.evaluate.small', fn: () => evaluateWorldInfo(wiSmall) },
  { name: 'world_info.evaluate.medium', fn: () => evaluateWorldInfo(wiMedium) },
  { name: 'world_info.evaluate.large', fn: () => evaluateWorldInfo(wiLarge) },
  { name: 'macros.expand.short', fn: () => substituteMacros(macrosShort, macroContext, macroOptions) },
  { name: 'macros.expand.long', fn: () => substituteMacros(macrosLong, macroContext, macroOptions) },
  { name: 'tokenizer.gpt.encode.short', fn: () => countTokens(text100, { tokenizerId: TOKENIZER.OPENAI, modelHint: 'gpt-4o' }) },
  { name: 'tokenizer.gpt.encode.long', fn: () => countTokens(text10k, { tokenizerId: TOKENIZER.OPENAI, modelHint: 'gpt-4o' }) },
  { name: 'tokenizer.llama3.encode.short', fn: () => countTokens(text100, { tokenizerId: TOKENIZER.LLAMA3, modelHint: 'llama-3-8b' }) },
  { name: 'tokenizer.llama3.encode.long', fn: () => countTokens(text10k, { tokenizerId: TOKENIZER.LLAMA3, modelHint: 'llama-3-8b' }) },
]);
