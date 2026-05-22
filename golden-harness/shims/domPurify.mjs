/**
 * DOMPurify shim: Passthrough sanitizer.
 * In headless mode we don't need real sanitization — just pass content through.
 */

function createDOMPurify() {
  const purify = {
    sanitize: (html) => typeof html === 'string' ? html : '',
    setConfig: () => {},
    addHook: () => {},
    removeAllHooks: () => {},
    isSupported: true,
  };
  return purify;
}

// Provide both window-level and module-level access
const DOMPurify = createDOMPurify();
if (globalThis.window) {
  globalThis.window.DOMPurify = DOMPurify;
}
globalThis.DOMPurify = DOMPurify;

export { DOMPurify, createDOMPurify };
