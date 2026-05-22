// group-chats-shim.mjs: Replaces ST's group-chats.js
export let groups = [];
export let selected_group = null;
export let is_group_generating = false;
export let group_generation_id = null;
export function saveGroupChat() {}
export function getGroups() { return []; }
export function generateGroupWrapper() { return Promise.resolve(''); }
export function resetSelectedGroup() {}
export function select_group_chats() {}
export function regenerateGroup() {}
export function getGroupChat() { return []; }
export function renameGroupMember() {}
export function createNewGroupChat() {}
export function getGroupAvatar() { return ''; }
export function deleteGroupChat() {}
export function renameGroupChat() {}
export function importGroupChat() {}
export function getGroupBlock() { return ''; }
export function getGroupCharacterCardsLazy() { return []; }
export function getGroupNames() { return []; }
export function getGroupDepthPrompts() { return []; }
