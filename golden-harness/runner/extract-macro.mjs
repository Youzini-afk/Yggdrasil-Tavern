/**
 * extract-macro.mjs: Extracts evaluateMacros output from ST.
 *
 * Input scenario JSON shape:
 * {
 *   text: string,
 *   env: { name1, name2, ... },
 *   chat: [],
 *   settings: {}
 * }
 */

import { resetHarnessState } from '../shims/globals.mjs';

/**
 * Run the macro extraction against ST's real evaluateMacros.
 */
export async function extractMacro(scenario, stModules) {
  resetHarnessState();

  const macrosMod = stModules.macros;
  if (!macrosMod?.evaluateMacros) {
    throw new Error('evaluateMacros not available in ST macros module');
  }

  const { text, env = {}, chat = [], settings = {} } = scenario;

  // Set up the global state that evaluateMacros reads
  // Import script-shim to set chat, name1, name2
  const scriptShim = await import('../shims/script-shim.mjs');
  scriptShim.setChat(adaptChatForST(chat, env));
  if (env.user) scriptShim.setName1(String(env.user));
  if (env.char) scriptShim.setName2(String(env.char));

  // Ensure power_user.instruct has the required fields
  const { power_user } = await import('../shims/power-user-shim.mjs');
  if (!power_user.instruct.enabled) {
    power_user.instruct.enabled = true;
  }

  try {
    const result = macrosMod.evaluateMacros(String(text ?? ''), env);
    return {
      output: result,
      scenario: scenario._description,
      input: text,
    };
  } catch (err) {
    return {
      output: null,
      error: err?.stack || err?.message || String(err),
      scenario: scenario._description,
      input: text,
    };
  }
}

function adaptChatForST(chat, env) {
  if (!Array.isArray(chat)) return [];

  return chat.map((message) => {
    const role = message.role;
    const isUser = message.is_user ?? role === 'user';
    const isSystem = message.is_system ?? role === 'system';
    const text = message.mes ?? message.content ?? message.text ?? '';

    return {
      ...message,
      name: message.name ?? (isSystem ? 'System' : isUser ? (env.user ?? 'User') : (env.char ?? 'Assistant')),
      is_user: isUser,
      is_system: isSystem,
      // ST last-message macros read .mes (SillyTavern public/scripts/macros.js:388-410),
      // while some scenarios use OpenAI-style .content. Keep both fields populated.
      mes: text,
      content: message.content ?? text,
      send_date: message.send_date ?? new Date().toISOString(),
    };
  });
}
