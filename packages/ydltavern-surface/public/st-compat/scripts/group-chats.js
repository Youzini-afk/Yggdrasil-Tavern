// SillyTavern public/scripts/group-chats.js compatibility shim.

const g = globalThis;
const value = (name, fallback = undefined) => (name in g ? g[name] : fallback);
const call = (name) => (...args) => {
  const fn = g[name] ?? g.SillyTavern?.getContext?.()?.[name];
  return typeof fn === 'function' ? fn(...args) : undefined;
};

export const selected_group = value('selected_group');
export const openGroupId = value('openGroupId');
export const is_group_automode_enabled = value('is_group_automode_enabled', false);
export const hideMutedSprites = value('hideMutedSprites', false);
export const is_group_generating = value('is_group_generating', false);
export const group_generation_id = value('group_generation_id');
export const groups = value('groups', []);
export const group_activation_strategy = value('group_activation_strategy', { NATURAL: 0, LIST: 1, MANUAL: 2, POOLED: 3 });
export const group_generation_mode = value('group_generation_mode', { SWAP: 0, APPEND: 1, APPEND_DISABLED: 2 });
export const DEFAULT_AUTO_MODE_DELAY = value('DEFAULT_AUTO_MODE_DELAY', 5);
export const groupCandidatesFilter = value('groupCandidatesFilter');
export const groupMembersFilter = value('groupMembersFilter');

export const saveGroupChat = call('saveGroupChat');
export const generateGroupWrapper = call('generateGroupWrapper');
export const deleteGroup = call('deleteGroup');
export const getGroupAvatar = call('getGroupAvatar');
export const getGroups = call('getGroups');
export const regenerateGroup = call('regenerateGroup');
export const resetSelectedGroup = call('resetSelectedGroup');
export const select_group_chats = call('select_group_chats');
export const getGroupChatNames = call('getGroupChatNames');
export const getGroupChat = call('getGroupChat');
export const getGroupMembers = call('getGroupMembers');
export const getGroupNames = call('getGroupNames');
export const findGroupMemberId = call('findGroupMemberId');
export const getGroupDepthPrompts = call('getGroupDepthPrompts');
export const getGroupCharacterCards = call('getGroupCharacterCards');
export const getGroupCharacterCardsLazy = call('getGroupCharacterCardsLazy');
export const renameGroupMember = call('renameGroupMember');
export const getGroupBlock = call('getGroupBlock');
export const editGroup = call('editGroup');
export const unshallowGroupMembers = call('unshallowGroupMembers');
export const openGroupById = call('openGroupById');
export const createNewGroupChat = call('createNewGroupChat');
export const getGroupPastChats = call('getGroupPastChats');
export const openGroupChat = call('openGroupChat');
export const renameGroupChat = call('renameGroupChat');
export const deleteGroupChatByName = call('deleteGroupChatByName');
export const deleteGroupChat = call('deleteGroupChat');
export const importGroupChat = call('importGroupChat');
export const saveGroupBookmarkChat = call('saveGroupBookmarkChat');
