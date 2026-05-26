import { JSDOM } from 'jsdom';

export function installTestDom(): void {
  if (globalThis.window && globalThis.document) return;
  const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'https://example.test/' });
  globalThis.window = dom.window as unknown as Window & typeof globalThis;
  globalThis.document = dom.window.document;
  globalThis.HTMLElement = dom.window.HTMLElement;
  globalThis.Node = dom.window.Node;
  globalThis.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
  globalThis.HTMLInputElement = dom.window.HTMLInputElement;

  // React 18 internal event handling in jsdom can hit attachEvent fallback
  // when programmatic focus triggers focus/blur events.
  const proto = dom.window.HTMLElement.prototype as unknown as Record<string, unknown>;
  if (typeof proto.attachEvent !== 'function') {
    proto.attachEvent = () => undefined;
  }
  if (typeof proto.detachEvent !== 'function') {
    proto.detachEvent = () => undefined;
  }
}
