// popup-shim.mjs: Replaces ST's popup.js
export const POPUP_RESULT = { AFFIRMATIVE: 'affirmative', NEGATIVE: 'negative', CANCEL: 'cancel' };
export const POPUP_TYPE = { CONFIRM: 'confirm', ALERT: 'alert', INPUT: 'input', TEXT: 'text' };
export class Popup { constructor() {} show() { return Promise.resolve(POPUP_RESULT.AFFIRMATIVE); } close() {} }
export async function callGenericPopup() { return POPUP_RESULT.AFFIRMATIVE; }
