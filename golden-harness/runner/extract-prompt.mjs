/**
 * extract-prompt.mjs: Extracts the request body that ST assembles for
 * sendOpenAIRequest by intercepting the fetch call.
 *
 * Input scenario JSON shape:
 * {
 *   source: 'openai' | 'claude' | 'deepseek' | ...,
 *   model: string,
 *   messages: [{role, content}...],
 *   settings: {...}
 * }
 */

import { resetHarnessState } from '../shims/globals.mjs';
import { getCaptured, clearCaptured } from '../shims/fetch.mjs';

/**
 * Run the prompt extraction against ST's real sendOpenAIRequest.
 * Captures the fetch body via our interceptor.
 */
export async function extractPrompt(scenario, stModules) {
  resetHarnessState();
  clearCaptured();

  const openaiMod = stModules.openai;
  if (!openaiMod?.sendOpenAIRequest) {
    throw new Error('sendOpenAIRequest not available in ST openai module');
  }

  const { source, model, messages, settings = {} } = scenario;

  // Apply settings to oai_settings global
  const { power_user } = await import('../shims/power-user-shim.mjs');
  if (globalThis.oai_settings) {
    Object.assign(globalThis.oai_settings, settings, { openai_model: model, chat_completion_source: source });
  }

  try {
    // Call sendOpenAIRequest — fetch will be intercepted
    // type = 'normal', messages array, signal = abort signal
    const controller = new AbortController();
    await openaiMod.sendOpenAIRequest('normal', messages, controller.signal);

    // Get the captured fetch body
    const captured = getCaptured();
    const requestBody = captured.length > 0 ? captured[0] : null;

    return {
      requestBody: requestBody?.bodyJson || requestBody?.body || null,
      requestUrl: requestBody?.url || null,
      requestMethod: requestBody?.method || null,
      requestHeaders: requestBody?.headers || null,
      scenario: scenario._description,
    };
  } catch (err) {
    // Even if the request fails, we might have captured the body
    const captured = getCaptured();
    const requestBody = captured.length > 0 ? captured[0] : null;

    return {
      requestBody: requestBody?.bodyJson || requestBody?.body || null,
      requestUrl: requestBody?.url || null,
      error: err.message,
      scenario: scenario._description,
    };
  }
}
