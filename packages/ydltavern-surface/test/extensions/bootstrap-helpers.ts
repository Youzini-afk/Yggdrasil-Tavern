// Bootstrap helpers for real ST extension smoke tests.

import { JSDOM } from 'jsdom';
import { createEventSource } from '../../../ydltavern-st-compat/src/events';
import { createSTContextDeep } from '../../../ydltavern-st-compat/src/context-st';
import { mountSTGlobals } from '../../../ydltavern-st-compat/src/window-bootstrap';

export interface BootstrappedEnv {
  dom: JSDOM;
  window: any;
  globals: ReturnType<typeof mountSTGlobals>;
  context: any;
  cleanup: () => void;
}

export function bootstrapSTEnv(): BootstrappedEnv {
  const dom = new JSDOM(`<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <div id="movingDivs"></div>
  <div id="chat"></div>
  <div id="extensionsMenu"></div>
  <div id="leftSendForm"></div>
  <div id="rightSendForm"></div>
  <textarea id="send_textarea"></textarea>
  <button id="send_but"></button>
  <div id="extensions_settings"></div>
  <div id="extensions_settings2"></div>
</body>
</html>`, {
    url: 'http://localhost/',
    runScripts: 'outside-only',
  });

  const win = dom.window;

  // Plant standard globals onto the JSDOM window.
  setGlobal('window', win);
  setGlobal('document', win.document);
  setGlobal('HTMLElement', win.HTMLElement);
  setGlobal('Element', win.Element);
  setGlobal('Node', win.Node);
  setGlobal('navigator', win.navigator);
  setGlobal('localStorage', win.localStorage);
  setGlobal('sessionStorage', win.sessionStorage);

  // Build a deep ST context.
  const context = createSTContextDeep({
    eventSource: createEventSource(),
  });

  // Mount onto the JSDOM window. ST extensions read both window.* and globalThis.*.
  const globals = mountSTGlobals({
    context,
    target: win,
  });
  // Also mount onto globalThis so module-level globalThis access works.
  const globals2 = mountSTGlobals({
    context,
    target: globalThis,
  });

  return {
    dom,
    window: win,
    globals,
    context,
    cleanup: () => {
      globals.unmount();
      globals2.unmount();
      delete (globalThis as any).window;
      delete (globalThis as any).document;
      delete (globalThis as any).HTMLElement;
      delete (globalThis as any).Element;
      delete (globalThis as any).Node;
      delete (globalThis as any).navigator;
      delete (globalThis as any).localStorage;
      delete (globalThis as any).sessionStorage;
      dom.window.close();
    },
  };
}

function setGlobal(key: string, value: unknown): void {
  Object.defineProperty(globalThis, key, {
    configurable: true,
    enumerable: true,
    writable: true,
    value,
  });
}

export interface ExtensionLoadResult {
  module: any;
  errors: Error[];
  warnings: string[];
}

/**
 * Load an extension module. We can't natively resolve `../../../script.js`
 * imports inside Node — those resolve to our compat shims which are designed
 * for browser ESM. So we use a simpler strategy: build a fake import map by
 * pre-loading our shims as in-memory modules and hijacking the relative
 * import resolution.
 *
 * For Y6 v0, we test extension files that don't have heavy relative imports,
 * OR we test the IMPORT RESOLUTION SEPARATELY (verify shim files are valid)
 * and SEPARATELY assert that an extension can register against globalThis-mounted
 * APIs given the globals are present.
 */
export async function smokeExtensionAgainstGlobals(
  extensionFn: () => void | Promise<void>,
  _env: BootstrappedEnv,
): Promise<ExtensionLoadResult> {
  const errors: Error[] = [];
  const warnings: string[] = [];

  const origConsoleWarn = console.warn;
  const origConsoleError = console.error;
  console.warn = (...args: unknown[]) => {
    warnings.push(args.map(String).join(' '));
  };
  console.error = (...args: unknown[]) => {
    errors.push(new Error(args.map(String).join(' ')));
  };

  try {
    await extensionFn();
  } catch (err) {
    errors.push(err as Error);
  } finally {
    console.warn = origConsoleWarn;
    console.error = origConsoleError;
  }

  return {
    module: null,
    errors,
    warnings,
  };
}
