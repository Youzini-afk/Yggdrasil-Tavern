/**
 * extract-wi.mjs: Extracts getWorldInfoPrompt/checkWorldInfo output from ST.
 *
 * Input scenario JSON shape:
 * {
 *   entries: [...],
 *   chat: [],
 *   settings: {...},
 *   generation_type: 'normal'
 * }
 *
 * NOTE: World Info extraction from ST is deeply coupled to DOM, eventSource,
 * and many global state objects. In v0, this may fail for most scenarios.
 */

import { resetHarnessState } from '../shims/globals.mjs';

/**
 * Convert scenario chat format to ST's expected format.
 * ST's checkWorldInfo expects chat as an array of message text strings
 * in reverse order (most recent first). The WorldInfoBuffer does
 * messages[depth].trim() on each element.
 */
function formatChatForST(chat) {
  return chat
    .map((msg) => msg.mes || msg.content || msg.text || '')
    .reverse(); // ST processes messages in reverse order (most recent first)
}

/**
 * Run the WI extraction against ST's real checkWorldInfo.
 * Returns the activated entries and prompt text.
 */
export async function extractWI(scenario, stModules) {
  resetHarnessState();

  const wiMod = stModules.worldInfo;
  if (!wiMod?.checkWorldInfo && !wiMod?.getWorldInfoPrompt) {
    throw new Error('World Info functions not available in ST world-info module');
  }

  const { entries = [], chat = [], settings = {}, generation_type = 'normal' } = scenario;

  // Format chat messages to ST's expected shape
  const stChat = formatChatForST(chat);

  // Apply WI settings to the module's globals
  if (wiMod.setWorldInfoSettings && settings) {
    try {
      wiMod.setWorldInfoSettings(settings, { world_info: { entries } });
    } catch (err) {
      console.warn(`[extract-wi] setWorldInfoSettings failed: ${err.message}`);
    }
  }

  const maxContext = 8192;

  try {
    // Try checkWorldInfo first (returns more detail)
    if (wiMod.checkWorldInfo) {
      const result = await wiMod.checkWorldInfo(stChat, maxContext, true, { trigger: generation_type });
      return {
        worldInfoBefore: result.worldInfoBefore || '',
        worldInfoAfter: result.worldInfoAfter || '',
        activatedEntries: result.allActivatedEntries
          ? Array.from(
              typeof result.allActivatedEntries.keys === 'function'
                ? result.allActivatedEntries.keys()
                : (result.allActivatedEntries.entries?.() || [])
            ).map(([k, v]) => ({ uid: k, content: v?.content || '' }))
          : [],
        scenario: scenario._description,
      };
    }

    // Fallback to getWorldInfoPrompt
    if (wiMod.getWorldInfoPrompt) {
      const result = await wiMod.getWorldInfoPrompt(stChat, maxContext, true, { trigger: generation_type });
      return {
        worldInfoString: result.worldInfoString || '',
        worldInfoBefore: result.worldInfoBefore || '',
        worldInfoAfter: result.worldInfoAfter || '',
        scenario: scenario._description,
      };
    }
  } catch (err) {
    return {
      output: null,
      error: err.message,
      scenario: scenario._description,
    };
  }
}
