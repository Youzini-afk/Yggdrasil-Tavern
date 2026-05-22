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
import { setChat, setChatMetadata } from '../shims/script-shim.mjs';

const HARNESS_WORLD_NAME = 'golden-harness';
const DEFAULT_MAX_CONTEXT = 8192;

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

function buildWorldInfoBook(entries) {
  return {
    entries: Object.fromEntries(
      entries.map((entry, index) => [String(entry.uid ?? index), { ...entry, uid: entry.uid ?? index }]),
    ),
  };
}

function toActivatedArray(allActivatedEntries) {
  const values = allActivatedEntries instanceof Set
    ? [...allActivatedEntries.values()]
    : allActivatedEntries instanceof Map
      ? [...allActivatedEntries.values()]
      : Array.isArray(allActivatedEntries)
        ? allActivatedEntries
        : [];

  return values.map((entry) => ({
    uid: entry.uid,
    key: Array.isArray(entry.key) ? entry.key : [],
    content: entry.content || '',
    position: entry.position ?? 0,
    depth: entry.depth ?? null,
    scan_depth: entry.scanDepth ?? null,
    order: entry.order ?? 0,
    activation_reason: inferActivationReason(entry),
    comment: entry.comment || '',
    world: entry.world || HARNESS_WORLD_NAME,
  }));
}

function inferActivationReason(entry) {
  if (entry.constant) return 'constant';
  if (entry.useProbability && Number(entry.probability) < 100) return 'probability_passed';
  if (Array.isArray(entry.keysecondary) && entry.keysecondary.length > 0) return 'primary_secondary_match';
  return 'primary_match';
}

function toLegacyActivatedEntries(activatedEntries) {
  return activatedEntries.map((entry) => ({ uid: entry.uid, content: entry.content }));
}

function buildDiagnostics(result, activatedEntries, settings, maxContext) {
  const worldInfoString = `${result.worldInfoBefore || ''}${result.worldInfoAfter || ''}`;
  const budgetMax = Math.round(Number(settings.world_info_budget ?? 25) * maxContext / 100) || 1;
  const budgetCap = Number(settings.world_info_budget_cap ?? 0);
  return {
    budget_used: Math.ceil(worldInfoString.length / 3.35),
    budget_max: budgetCap > 0 && budgetMax > budgetCap ? budgetCap : budgetMax,
    scan_iterations: Math.max(1, Number(settings.world_info_recursive ? settings.world_info_max_recursion_steps || 1 : 1)),
    activated_count: activatedEntries.length,
  };
}

function shapeOutput(result, scenario, settings, maxContext) {
  const activatedEntries = toActivatedArray(result.allActivatedEntries);
  const worldInfoBefore = result.worldInfoBefore || '';
  const worldInfoAfter = result.worldInfoAfter || '';
  const worldInfoString = `${worldInfoBefore}${worldInfoAfter}`;

  return {
    // Legacy camelCase fields are kept for compare.mjs compatibility.
    worldInfoBefore,
    worldInfoAfter,
    activatedEntries: toLegacyActivatedEntries(activatedEntries),
    scenario: scenario._description,

    // Deep ST runtime dump for WI fixture inspection.
    activated_entries: activatedEntries,
    world_info_before: worldInfoBefore,
    world_info_after: worldInfoAfter,
    world_info_string: worldInfoString,
    EMEntries: result.EMEntries ?? [],
    WIDepthEntries: result.WIDepthEntries ?? [],
    ANBeforeEntries: result.ANBeforeEntries ?? [],
    ANAfterEntries: result.ANAfterEntries ?? [],
    outletEntries: result.outletEntries ?? {},
    diagnostics: buildDiagnostics(result, activatedEntries, settings, maxContext),
  };
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
  const maxContext = Number(settings.max_context ?? settings.openai_max_context ?? DEFAULT_MAX_CONTEXT);

  setChat(chat);
  setChatMetadata({});

  // Apply WI settings to the module's globals and inject the scenario book as
  // selected global lore. ST loads selected_world_info in setWorldInfoSettings
  // (world-info.js lines 917-1007) and then reads entries through
  // getSortedEntries/loadWorldInfo (lines 4415-4527).
  if (wiMod.setWorldInfoSettings && settings) {
    try {
      wiMod.worldInfoCache?.clear?.();
      wiMod.worldInfoCache?.set?.(HARNESS_WORLD_NAME, buildWorldInfoBook(entries));
      wiMod.setWorldInfoSettings(
        { ...settings, world_info: HARNESS_WORLD_NAME },
        { world_names: [HARNESS_WORLD_NAME] },
      );
    } catch (err) {
      console.warn(`[extract-wi] setWorldInfoSettings failed: ${err.message}`);
    }
  }

  try {
    // Try checkWorldInfo first (returns more detail)
    if (wiMod.checkWorldInfo) {
      const result = await wiMod.checkWorldInfo(stChat, maxContext, true, {
        trigger: generation_type,
        personaDescription: scenario.personaDescription ?? '',
        characterDescription: scenario.characterDescription ?? '',
        characterPersonality: scenario.characterPersonality ?? '',
        characterDepthPrompt: scenario.characterDepthPrompt ?? '',
        scenario: scenario.scenarioText ?? '',
        creatorNotes: scenario.creatorNotes ?? '',
      });
      return shapeOutput(result, scenario, settings, maxContext);
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
