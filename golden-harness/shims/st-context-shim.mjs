// st-context-shim.mjs: Replaces ST's st-context.js
export function getContext() {
  return {
    characterId: 0,
    groupId: null,
    chat: [],
    chatId: 'test-chat',
    name1: 'User',
    name2: 'Assistant',
    characters: [],
    group: {},
    extensionPrompts: {},
    settings: {},
    generationType: 'normal',
    streaming: false,
  };
}
