/**
 * script-shim.mjs: Provides all the named exports that ST's script.js normally exports.
 * In headless harness mode, these are stub implementations that return safe defaults.
 *
 * ST modules import from '../script.js' for these symbols.
 * Our custom module loader redirects that import to this file.
 */

import { uuidv4 } from './uuid.mjs';
import { $ } from './jquery.mjs';
import { FROZEN_EPOCH } from './time.mjs';

// ====== Core state variables ======
export let name1 = 'User';
export let name2 = 'Assistant';
export let chat = [];
export let chat_metadata = {};
export let characters = [];
export let main_api = 'openai';
export let this_chid = 0;
export let menu_type = 'chat';
export let online_status = 'no_connection';
export let is_send_press = false;
export let max_context = 8192;
export let comment_avatar = 'user';
export let default_avatar = '';
export let default_user_avatar = '';
export let user_avatar = 'user';
export const system_avatar = 'img/five.png';
export const systemUserName = 'System';
export let active_character = null;
export let active_group = null;
export let chatElement = null;
export let animation_duration = 200;
export let animation_easing = 'ease';
export let ANIMATION_DURATION_DEFAULT = 200;
export let CLIENT_VERSION = '1.18.0-golden-harness';
export let selected_button = '';

// ====== Event system ======
class SimpleEventSource {
  #handlers = {};
  on(event, handler) {
    (this.#handlers[event] ??= []).push(handler);
    return this;
  }
  off(event, handler) {
    if (this.#handlers[event]) {
      this.#handlers[event] = this.#handlers[event].filter(h => h !== handler);
    }
    return this;
  }
  emit(event, ...args) {
    (this.#handlers[event] ??= []).forEach(h => {
      try { h(...args); } catch (e) { console.error(`Event handler error for ${event}:`, e); }
    });
    return true;
  }
  once(event, handler) {
    const wrapped = (...args) => { this.off(event, wrapped); handler(...args); };
    this.on(event, wrapped);
  }
  removeAllListeners(event) {
    if (event) delete this.#handlers[event];
    else this.#handlers = {};
  }
}

export const eventSource = new SimpleEventSource();

export const event_types = {
  APP_READY: 'app_ready',
  CHAT_CHANGED: 'chat_changed',
  CHAT_COMPLETION_SETTINGS_READY: 'chat_completion_settings_ready',
  GENERATION_STARTED: 'generation_started',
  GENERATION_STOPPED: 'generation_stopped',
  MESSAGE_RECEIVED: 'message_received',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_EDITED: 'message_edited',
  MESSAGE_DELETED: 'message_deleted',
  MESSAGE_SWIPED: 'message_swiped',
  EXT_PROMPT_INITIALIZED: 'ext_prompt_initialized',
  WORLD_INFO_ACTIVATED: 'world_info_activated',
  WORLD_INFO_CHANGED: 'world_info_changed',
  WORLDINFO_ENTRIES_LOADED: 'worldinfo_entries_loaded',
  WORLDINFO_SCAN_DONE: 'worldinfo_scan_done',
  WORLDINFO_FORCE_ACTIVATE: 'worldinfo_force_activate',
  CHARACTER_LOADED: 'character_loaded',
  SETTINGS_UPDATED: 'settings_updated',
  SETTINGS_READY: 'settings_ready',
  FORCE_SAVE: 'force_save',
  SHUTDOWN: 'shutdown',
  EXIT: 'exit',
  GENERATION_CHANGED: 'generation_changed',
  ONLINE_STATUS_CHANGED: 'online_status_changed',
  MOVABLE_UI_STATE_RESET: 'movable_ui_state_reset',
  IMPORTEXPORT: 'importexport',
};

// ====== Extension prompts ======
export let extension_prompts = {};
export const extension_prompt_types = {
  SYSTEM: 0,
  BEFORE_CHAR: 1,
  AFTER_CHAR: 2,
  CHAT: 3,
  POST_CHAT: 4,
  IN_CHAT: 5,
};
export const extension_prompt_roles = {
  SYSTEM: 'system',
  ASSISTANT: 'assistant',
  USER: 'user',
};

// ====== System message types ======
export const system_message_types = {
  GENERIC: 'generic',
  HELPER: 'helper',
  PROMPT: 'prompt',
  SLASH_COMMAND: 'slash_command',
  ERROR: 'error',
};

// ====== Generation ======
export const Generate = {
  NORMAL: 'normal',
  CONTINUE: 'continue',
  QUIET: 'quiet',
  SWIPE: 'swipe',
};

export let amount_gen = 0;

// ====== Token counts ======
export function getMaxPromptTokens() { return 8192; }
export function getMaxContextTokens() { return 8192; }
export function getMaxResponseTokens() { return 2048; }
export function getMaxContextSize() { return 8192; }

// ====== Core functions ======
export function substituteParams(text, envOverrides) {
  if (!text) return '';
  let result = String(text);
  // Replace {{user}} / <USER>
  const user = envOverrides?.name1Override || name1;
  const char = envOverrides?.name2Override || name2;
  result = result.replace(/<USER>/gi, user);
  result = result.replace(/<BOT>/gi, char);
  result = result.replace(/<CHAR>/gi, char);
  result = result.replace(/<CHARIFNOTGROUP>/gi, char);
  result = result.replace(/<GROUP>/gi, '');
  result = result.replace(/\{\{user\}\}/gi, user);
  result = result.replace(/\{\{char\}\}/gi, char);
  return result;
}

export function substituteParamsExtended(text, _env, _overrides) {
  return substituteParams(text, _overrides);
}

export function getRequestHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer <redacted-test-key>' };
}

export function saveSettings() {}
export function saveSettingsDebounced() {}
export function saveChat() {}
export function saveChatConditional() {}
export function saveChatDebounced() {}
export function saveMetadata() {}
export function saveCharacterDebounced() {}
export function cancelDebouncedChatSave() {}
export function scrollChatToBottom() {}
export function printCharacters() {}
export function printCharactersDebounced() {}
export function printMessages() {}
export function setOnlineStatus(_status) {}
export function startStatusLoading() {}
export function resultCheckStatus() { return false; }
export function abortStatusCheck() {}
export function cancelStatusCheck() {}
export function activateSendButtons() {}
export function deactivateSendButtons() {}
export function messageFormatting(_mes, _name, _forceAvatar, _isSystem, _isUser) { return ''; }
export function reloadCurrentChat() { return Promise.resolve(); }
export function reloadCurrentChatUnsafe() { return Promise.resolve(); }
export function reloadMarkdownProcessor() {}
export function setAnimationDuration(_d) {}
export function doNewChat() {}
export function deleteMessage(_id) {}
export function deleteLastMessage() {}
export function addOneMessage(_mes, _forceId) {}
export function sendSystemMessage(_type, _text) {}
export function sendMessageAsUser(_text, _finish) {}
export function generateQuietPrompt(_prompt) { return Promise.resolve(''); }
export function generateRaw(_prompt, _type, _opts) { return Promise.resolve(''); }
export function generateRawData(_type) { return Promise.resolve({}); }
export function closeCurrentChat() {}
export function displayOnlineStatus() {}
export function displayPastChats() {}
export function displayVersion() {}
export function doNavbarIconClick() {}
export function selectRightMenuWithAnimation() {}
export function changeMainAPI(_api) {}
export function clearChat() {}
export function isGenerating() { return false; }
export function isChatSaving() { return false; }
export function isStreamingEnabled() { return false; }
export function isSwipingAllowed() { return false; }
export function isMessageSwipeable() { return false; }
export function isOdd(_n) { return false; }
export function sendGenerationRequest() {}
export function sendStreamingRequest() {}
export function sendTextareaMessage() {}
export function renameCharacter() { return Promise.resolve(); }
export function deleteCharacter() { return Promise.resolve(); }
export function duplicateCharacter() { return Promise.resolve(); }
export function importCharacterChat() { return Promise.resolve(); }
export function openCharacterChat() { return Promise.resolve(); }
export function renameChat() {}
export function renameGroupOrCharacterChat() {}
export function handleDeleteCharacter() {}
export function getChat() { return []; }
export function getChatsFromFiles() { return []; }
export function getPastCharacterChats() { return []; }
export function getCurrentChatId() { return 'test-chat-001'; }
export function getCurrentChatDetails() { return {}; }
export function getCharacters() { return []; }
export function getOneCharacter(_id) { return {}; }
export function getCharacterCardFields() { return {}; }
export function getCharacterCardFieldsLazy() { return {}; }
export function getCharacterSource() { return ''; }
export function getCharacterAvatar() { return ''; }
export function getThumbnailUrl() { return ''; }
export function getUserAvatar() { return ''; }
export function getUserAvatars() { return []; }
export function getGenerateUrl() { return '/api/backends/chat-completions/generate'; }
export function getGeneratingApi() { return 'openai'; }
export function getGeneratingModel() { return 'gpt-4o-mini'; }
export function getSettings() { return {}; }
export function getExtensionPrompt(_name, _position, _depth, _role) { return ''; }
export function getExtensionPromptByName(_name) { return ''; }
export function getExtensionPromptMaxDepth(_name) { return 0; }
export function getExtensionPromptRoleByName(_name) { return 'system'; }
export function getFirstDisplayedMessageId() { return 0; }
export function getNextMessageId() { return 0; }
export function getSystemMessageByType(_type) { return ''; }
export function getMediaDisplay() { return ''; }
export function getMediaIndex() { return -1; }
export function getStoppingStrings() { return []; }
export function getBiasStrings() { return []; }
export function getSlideToggleOptions() { return {}; }
export function getOverswipeBehavior() { return {}; }
export function selectCharacterById() {}
export function select_selected_character() {}
export function setActiveCharacter(_id) {}
export function setActiveGroup(_id) {}
export function setCharacterId(_id) {}
export function createOrEditCharacter() { return Promise.resolve(); }
export function create_save() { return Promise.resolve(); }
export function createRawPrompt() { return ''; }
export function createLazyFields() { return {}; }
export function createModelIcon() { return ''; }
export function characterToEntity() { return {}; }
export function groupToEntity() { return {}; }
export function formatCharacterAvatar() { return ''; }
export function ensureMessageMediaIsArray() {}
export function ensureSwipes() {}
export function hideSwipeButtons() {}
export function refreshSwipeButtons() {}
export function lastSwipeInfo() { return {}; }
export function recentSwipes() { return []; }
export function showBookmarksButtons() {}
export function updateBookmarkDisplay() {}
export function initBookmarks() {}
export function mesForShowdownParse(_mes) { return _mes; }
export function baseChatReplace() { return ''; }
export function cleanUpMessage() {}
export function appendImageToMessage() {}
export function appendMediaToMessage() {}
export function chatDragDropHandler() {}
export function charDragDropHandler() {}
export function processCommands() { return ''; }
export function processDroppedFiles() {}
export function promptItemize() {}
export function findItemizedPromptSet() { return null; }
export function clearItemizedPrompts() {}
export function deleteItemizedPrompts() {}
export function loadItemizedPrompts() {}
export function saveItemizedPrompts() {}
export function addCopyToCodeBlocks() {}
export function extractJsonFromData() { return null; }
export function extractMessageFromData() { return ''; }
export function extractMessageBias() { return ''; }
export function comment_avatar_fn() { return ''; }
export function callPopup(_text, _type, _opts) { return Promise.resolve(''); }
export function pingServer() {}
export function parseMesExamples(_examples) { return []; }
export function countOccurrences(_str, _sub) { return 0; }
export function reloadChatMutex() { return { acquire: () => Promise.resolve({ release: () => {} }) }; }
export function removeMacros(_text) { return _text; }
export function removeDepthPrompts() {}
export function replaceCurrentChat() {}
export function replaceItemizedPromptText() {}
export function redisplayChat() {}
export function resetChatState() {}
export function newAssistantChat() {}
export function itemizedParams() { return []; }
export function itemizedPrompts() { return []; }
export function neutralCharacterName() { return 'System'; }

// Additional exports that ST modules reference
export let settingsReady = true;
export let streamingProcessor = null;
export let swipeState = 0;
export const SWIPE_STATE = { NONE: 0, LEFT: 1, RIGHT: 2 };
export let characterGroupOverlay = null;
export let converter = null;
export function setGenerationParamsFromPreset() {}
export function setSendButtonState() {}
export function stopGeneration() {}
export function syncMesToSwipe() {}
export function updateMessageBlock() {}
export function closeMessageEditor() {}
export let nai_settings = {};


// Utility re-exports that script.js provides
export const CONNECT_API_MAP = {};
export const DEFAULT_PRINT_TIMEOUT = 0;
export const DEFAULT_SAVE_EDIT_TIMEOUT = 0;
export const MAX_INJECTION_DEPTH = 999;
export const UNIQUE_APIS = [];

// State mutation helpers (for scenario injection)
export function setChat(newChat) { chat = newChat; }
export function setName1(n) { name1 = n; }
export function setName2(n) { name2 = n; }
export function setMainApi(api) { main_api = api; }
export function setThisChid(id) { this_chid = id; }
export function setCharacters(chars) { characters = chars; }
export function setChatMetadata(meta) { chat_metadata = meta; }
export function setExtensionPrompts(prompts) { extension_prompts = prompts; }
