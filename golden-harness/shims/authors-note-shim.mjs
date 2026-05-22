// authors-note-shim.mjs: Replaces ST's authors-note.js
export const NOTE_MODULE_NAME = 'authornote';
export const metadata_keys = {};
// ST exports this as a mutable boolean. Keep it false in headless WI runs so
// world-info.js (lines 5149-5152) does not require a full Authors Note prompt.
export const shouldWIAddPrompt = false;
