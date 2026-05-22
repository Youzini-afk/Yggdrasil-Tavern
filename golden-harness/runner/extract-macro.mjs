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

  const { text, env, chat = [], settings = {} } = scenario;

  // Set up the global state that evaluateMacros reads
  // Import script-shim to set chat, name1, name2
  const scriptShim = await import('../shims/script-shim.mjs');
  scriptShim.setChat(chat);
  if (env.user) scriptShim.setName1(env.user);
  if (env.char) scriptShim.setName2(env.char);

  // Ensure power_user.instruct has the required fields
  const { power_user } = await import('../shims/power-user-shim.mjs');
  if (!power_user.instruct.enabled) {
    power_user.instruct.enabled = true;
  }

  try {
    const result = macrosMod.evaluateMacros(text, env);
    return {
      output: result,
      scenario: scenario._description,
      input: text,
    };
  } catch (err) {
    // evaluateMacros may fail for some macro types due to missing globals
    // Try a simpler extraction: just run the env substitution part
    try {
      // Manual env substitution as fallback
      let output = String(text);
      for (const [key, val] of Object.entries(env)) {
        if (typeof val === 'string' || typeof val === 'number') {
          output = output.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'gi'), String(val));
        }
      }
      // Also handle legacy markers
      output = output.replace(/<USER>/gi, env.user || '');
      output = output.replace(/<BOT>/gi, env.char || '');
      output = output.replace(/<CHAR>/gi, env.char || '');

      return {
        output: output,
        scenario: scenario._description,
        input: text,
        partial: true,
        error: err.message,
        note: 'Full evaluateMacros failed; used fallback env substitution only',
      };
    } catch (fallbackErr) {
      return {
        output: null,
        error: err.message,
        scenario: scenario._description,
        input: text,
      };
    }
  }
}
