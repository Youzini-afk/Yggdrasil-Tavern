/**
 * Popup shim: Rejects all dialog interactions.
 * ST uses popups for confirmations; in headless mode we auto-reject.
 */

const POPUP_RESULT = {
  AFFIRMATIVE: 'affirmative',
  NEGATIVE: 'negative',
  CANCEL: 'cancel',
};

const POPUP_TYPE = {
  CONFIRM: 'confirm',
  ALERT: 'alert',
  INPUT: 'input',
  TEXT: 'text',
};

class Popup {
  constructor() { this.result = POPUP_RESULT.AFFIRMATIVE; }
  show() { return Promise.resolve(POPUP_RESULT.AFFIRMATIVE); }
  close() {}
}

async function callGenericPopup(_text, _popupType, _opts) {
  return POPUP_RESULT.AFFIRMATIVE;
}

globalThis.callGenericPopup = callGenericPopup;
globalThis.Popup = Popup;
globalThis.POPUP_RESULT = POPUP_RESULT;
globalThis.POPUP_TYPE = POPUP_TYPE;

export { callGenericPopup, Popup, POPUP_RESULT, POPUP_TYPE };
