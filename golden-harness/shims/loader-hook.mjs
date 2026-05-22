/**
 * loader-hook.mjs: The actual module resolution hooks for the golden harness.
 * Redirects specific ST module paths to our shims.
 *
 * IMPORTANT: The resolve function MUST be async and MUST await nextResolve,
 * because nextResolve returns a Promise.
 */

import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve as nodePathResolve, dirname } from 'node:path';
import { fileURLToPath as urlToPath } from 'node:url';

// The ST source path
const ST_PATH = process.env.YDLTAVERN_ST_PATH || '/workspace/Yggdrasil/SillyTavern';
const ST_PUBLIC = nodePathResolve(ST_PATH, 'public');
const ST_SCRIPTS = nodePathResolve(ST_PUBLIC, 'scripts');

// Directory containing our shims
const SHIMS_DIR = nodePathResolve(dirname(urlToPath(import.meta.url)));

/**
 * Map of ST file absolute paths → shim file absolute paths.
 */
const REDIRECTS = {
  [nodePathResolve(ST_PUBLIC, 'lib.js')]: nodePathResolve(SHIMS_DIR, 'lib-shim.mjs'),
  [nodePathResolve(ST_PUBLIC, 'script.js')]: nodePathResolve(SHIMS_DIR, 'script-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'st-context.js')]: nodePathResolve(SHIMS_DIR, 'st-context-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'extensions.js')]: nodePathResolve(SHIMS_DIR, 'extensions-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'power-user.js')]: nodePathResolve(SHIMS_DIR, 'power-user-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'group-chats.js')]: nodePathResolve(SHIMS_DIR, 'group-chats-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'RossAscends-mods.js')]: nodePathResolve(SHIMS_DIR, 'ross-ascends-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'variables.js')]: nodePathResolve(SHIMS_DIR, 'variables-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'secrets.js')]: nodePathResolve(SHIMS_DIR, 'secrets-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'tokenizers.js')]: nodePathResolve(SHIMS_DIR, 'tokenizers-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'textgen-settings.js')]: nodePathResolve(SHIMS_DIR, 'textgen-settings-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'kai-settings.js')]: nodePathResolve(SHIMS_DIR, 'kai-settings-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'nai-settings.js')]: nodePathResolve(SHIMS_DIR, 'nai-settings-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'horde.js')]: nodePathResolve(SHIMS_DIR, 'horde-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'authors-note.js')]: nodePathResolve(SHIMS_DIR, 'authors-note-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'personas.js')]: nodePathResolve(SHIMS_DIR, 'personas-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'tags.js')]: nodePathResolve(SHIMS_DIR, 'tags-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'filters.js')]: nodePathResolve(SHIMS_DIR, 'filters-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'constants.js')]: nodePathResolve(SHIMS_DIR, 'constants-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'i18n.js')]: nodePathResolve(SHIMS_DIR, 'i18n-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'templates.js')]: nodePathResolve(SHIMS_DIR, 'templates-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'user.js')]: nodePathResolve(SHIMS_DIR, 'user-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'popup.js')]: nodePathResolve(SHIMS_DIR, 'popup-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'sse-stream.js')]: nodePathResolve(SHIMS_DIR, 'sse-stream-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'logprobs.js')]: nodePathResolve(SHIMS_DIR, 'logprobs-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'tool-calling.js')]: nodePathResolve(SHIMS_DIR, 'tool-calling-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'textgen-models.js')]: nodePathResolve(SHIMS_DIR, 'textgen-models-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'custom-request.js')]: nodePathResolve(SHIMS_DIR, 'custom-request-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'bookmarks.js')]: nodePathResolve(SHIMS_DIR, 'bookmarks-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'audio-player.js')]: nodePathResolve(SHIMS_DIR, 'audio-player-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'chat-templates.js')]: nodePathResolve(SHIMS_DIR, 'chat-templates-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'sysprompt.js')]: nodePathResolve(SHIMS_DIR, 'sysprompt-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'system-messages.js')]: nodePathResolve(SHIMS_DIR, 'system-messages-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'reasoning.js')]: nodePathResolve(SHIMS_DIR, 'reasoning-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'logit-bias.js')]: nodePathResolve(SHIMS_DIR, 'logit-bias-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'request-compression.js')]: nodePathResolve(SHIMS_DIR, 'request-compression-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'preset-manager.js')]: nodePathResolve(SHIMS_DIR, 'preset-manager-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'chats.js')]: nodePathResolve(SHIMS_DIR, 'chats-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'char-data.js')]: nodePathResolve(SHIMS_DIR, 'char-data-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'stats.js')]: nodePathResolve(SHIMS_DIR, 'stats-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'input-md-formatting.js')]: nodePathResolve(SHIMS_DIR, 'input-md-formatting-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'dragdrop.js')]: nodePathResolve(SHIMS_DIR, 'dragdrop-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'dynamic-styles.js')]: nodePathResolve(SHIMS_DIR, 'dynamic-styles-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'dom-handlers.js')]: nodePathResolve(SHIMS_DIR, 'dom-handlers-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'keyboard.js')]: nodePathResolve(SHIMS_DIR, 'keyboard-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'data-maid.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'showdown-exclusion.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'showdown-underscore.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'a11y.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'backgrounds.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'browser-fixes.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'bulk-edit.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'cfg-scale.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'f-localStorage.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'login.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'samplerSelect.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'scrapers.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'server-history.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'setting-search.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'swipe-picker.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'welcome-screen.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'action-loader.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'action-loader-slashcommands.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'extensions-slashcommands.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'loader.js')]: nodePathResolve(SHIMS_DIR, 'no-op-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'additional-headers.js')]: nodePathResolve(SHIMS_DIR, 'additional-headers-shim.mjs'),

  // Individual slash-commands files — all redirect to the comprehensive shim
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandArgument.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandParser.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommand.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandAbortController.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandBreakController.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandBrowser.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandClosure.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandClosureResult.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandCommonEnumsProvider.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandDebugController.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandEnumValue.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandExecutionError.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandExecutor.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandNamedArgumentAssignment.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandParserError.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandScope.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'slash-commands/SlashCommandReturnHelper.js')]: nodePathResolve(SHIMS_DIR, 'slash-commands-shim.mjs'),

  // Individual util files
  [nodePathResolve(ST_SCRIPTS, 'util/AccountStorage.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/SimpleMutex.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/Semaphore.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/extract.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/fetch-polyfill.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/content-manager.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/dragdrop.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/unique-id.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/smart-date.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/regex-match.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/file-math.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'util/stream-fadein.js')]: nodePathResolve(SHIMS_DIR, 'util-dir-shim.mjs'),

  // Individual macros files
  [nodePathResolve(ST_SCRIPTS, 'macros/AmountGenMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/CharacterLoreMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/ConditionalMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/DateTimeMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/DefaultMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/EmojiMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/EnvironmentMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/IfMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/InstructMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/Macro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/MaxContextMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/PersonaDescriptionMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/RandomMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/SlashCommandMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/StopMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
  [nodePathResolve(ST_SCRIPTS, 'macros/TimeMacro.js')]: nodePathResolve(SHIMS_DIR, 'macros-dir-shim.mjs'),
};

// Directory shims — catch any import from ST's subdirectories
// Only for extensions/ since those are loaded dynamically
const DIR_SHIMS = [
  { dir: nodePathResolve(ST_SCRIPTS, 'extensions'), shim: nodePathResolve(SHIMS_DIR, 'extensions-dir-shim.mjs') },
];

export async function resolve(specifier, context, nextResolve) {
  // Handle absolute /scripts/... paths that ST uses in browser context
  // These are like: /scripts/i18n.js, /scripts/utils.js, /scripts/power-user.js
  if (specifier.startsWith('/scripts/') && specifier.endsWith('.js')) {
    const scriptName = specifier.replace('/scripts/', '');
    const absolutePath = nodePathResolve(ST_SCRIPTS, scriptName);
    if (REDIRECTS[absolutePath]) {
      return {
        url: pathToFileURL(REDIRECTS[absolutePath]).href,
        shortCircuit: true,
        format: 'module',
      };
    }
    // If not in REDIRECTS, try resolving normally
    try {
      const result = await nextResolve(absolutePath, context);
      return result;
    } catch {
      // Fall through to normal resolution
    }
  }

  // Also handle /../../lib.js and /../script.js absolute paths from ST modules
  if (specifier.startsWith('/') && !specifier.startsWith('/scripts/')) {
    // These are likely wrong absolute paths; try to resolve them from ST public dir
    const relativePath = specifier.replace(/^\//, '');
    const absolutePath = nodePathResolve(ST_PUBLIC, relativePath);
    if (REDIRECTS[absolutePath]) {
      return {
        url: pathToFileURL(REDIRECTS[absolutePath]).href,
        shortCircuit: true,
        format: 'module',
      };
    }
  }

  const result = await nextResolve(specifier, context);

  if (result.url?.startsWith('file://')) {
    let resolvedPath = '';
    try { resolvedPath = fileURLToPath(result.url); } catch { return result; }

    // Check exact redirects
    if (REDIRECTS[resolvedPath]) {
      return {
        url: pathToFileURL(REDIRECTS[resolvedPath]).href,
        shortCircuit: true,
        format: 'module',
      };
    }

    // Check directory shims
    for (const { dir, shim } of DIR_SHIMS) {
      if (resolvedPath.startsWith(dir + '/') || resolvedPath.startsWith(dir + '\\')) {
        return {
          url: pathToFileURL(shim).href,
          shortCircuit: true,
          format: 'module',
        };
      }
    }
  }

  return result;
}
