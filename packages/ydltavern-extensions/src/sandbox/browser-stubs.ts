import type { ExtensionSandbox } from './runtime.js';
import { auditArgsShape } from './audit.js';

export interface BrowserStubsOptions {
  readonly seed?: string;
}

export function installBrowserStubs(sandbox: ExtensionSandbox, options: BrowserStubsOptions = {}): void {
  const seed = options.seed ?? sandbox.extensionId;
  sandbox.registerHostFunction('__ydlBrowserStubAudit', (api, argsJson) => {
    const args = parseArgs(argsJson);
    sandbox.recordAudit({ ts: Date.now(), api: String(api), args_shape: auditArgsShape(args) });
    return null;
  });
  void sandbox.eval(`(${sandboxBrowserBootstrap.toString()})(${JSON.stringify(seed)});`, '<ydltavern-browser-stubs>');
}

function parseArgs(value: unknown): unknown[] {
  if (typeof value !== 'string') return [];
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) ? parsed : [];
}

function sandboxBrowserBootstrap(seed: string): void {
  const g = globalThis as any;
  let uuidCounter = 0;
  let rngState = hashSeed(seed);
  let rafCounter = 0;

  function audit(api: string, args: unknown[] = []): void {
    if (typeof g.__ydlBrowserStubAudit === 'function') g.__ydlBrowserStubAudit(api, JSON.stringify(args));
  }

  function hashSeed(value: string): number {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < String(value).length; i++) {
      h ^= String(value).charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h || 1;
  }

  function nextByte(): number {
    rngState ^= rngState << 13;
    rngState ^= rngState >>> 17;
    rngState ^= rngState << 5;
    return rngState & 255;
  }

  function makeElement(tag: string): any {
    const children: unknown[] = [];
    const attributes: Record<string, string> = Object.create(null);
    const name = String(tag || '').toUpperCase();
    return {
      tagName: name,
      nodeName: name,
      children,
      childNodes: children,
      style: {},
      textContent: '',
      innerHTML: '',
      appendChild(child: unknown) { audit('document.element.appendChild', [name]); children.push(child); return child; },
      setAttribute(attr: string, value: unknown) { audit('document.element.setAttribute', [name, attr]); attributes[String(attr)] = String(value); },
      getAttribute(attr: string) { audit('document.element.getAttribute', [name, attr]); return attributes[String(attr)] ?? null; },
      remove() { audit('document.element.remove', [name]); },
      addEventListener(event: string) { audit('document.element.addEventListener', [name, event]); },
      removeEventListener(event: string) { audit('document.element.removeEventListener', [name, event]); },
    };
  }

  function makeStorage(apiName: string): any {
    const map = new Map<string, string>();
    return {
      get length() { audit(`${apiName}.length`); return map.size; },
      getItem(key: unknown) { audit(`${apiName}.getItem`, [key]); const k = String(key); return map.has(k) ? map.get(k) : null; },
      setItem(key: unknown, value: unknown) { audit(`${apiName}.setItem`, [key, value]); map.set(String(key), String(value)); },
      removeItem(key: unknown) { audit(`${apiName}.removeItem`, [key]); map.delete(String(key)); },
      clear() { audit(`${apiName}.clear`); map.clear(); },
      key(index: unknown) { audit(`${apiName}.key`, [index]); return Array.from(map.keys())[Number(index)] ?? null; },
    };
  }

  const document = {
    body: makeElement('body'),
    head: makeElement('head'),
    createElement(tag: string) { audit('document.createElement', [tag]); return makeElement(tag); },
    querySelector(selector: string) { audit('document.querySelector', [selector]); return null; },
    querySelectorAll(selector: string) { audit('document.querySelectorAll', [selector]); return []; },
    addEventListener(event: string) { audit('document.addEventListener', [event]); },
    removeEventListener(event: string) { audit('document.removeEventListener', [event]); },
  };

  function requestAnimationFrame(callback: (time: number) => void): number {
    audit('window.requestAnimationFrame');
    const id = ++rafCounter;
    if (typeof callback === 'function') g.setTimeout(() => callback(Date.now()), 16);
    return id;
  }

  function DOMException(this: Error, message?: string, name?: string): Error {
    const error = new Error(message || '');
    Object.setPrototypeOf(error, (DOMException as any).prototype);
    error.name = name || 'Error';
    return error;
  }
  (DOMException as any).prototype = Object.create(Error.prototype);
  (DOMException as any).prototype.constructor = DOMException;

  Object.defineProperty(g, 'window', { value: g, writable: false, configurable: false });
  Object.defineProperty(g, 'document', { value: document, writable: false, configurable: false });
  Object.defineProperty(g, 'location', { value: { href: 'sandbox://' }, writable: false, configurable: false });
  Object.defineProperty(g, 'navigator', { value: { userAgent: 'YdlTavernSandbox/1.0' }, writable: false, configurable: false });
  g.addEventListener = (event: string) => audit('window.addEventListener', [event]);
  g.removeEventListener = (event: string) => audit('window.removeEventListener', [event]);
  g.matchMedia = (query: string) => { audit('window.matchMedia', [query]); return { matches: false, media: String(query), addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }; };
  g.requestAnimationFrame = requestAnimationFrame;
  g.cancelAnimationFrame = (id: unknown) => audit('window.cancelAnimationFrame', [id]);
  g.setTimeout = (callback: () => void) => { audit('window.setTimeout'); if (typeof callback === 'function') callback(); return 1; };
  g.clearTimeout = (id: unknown) => audit('window.clearTimeout', [id]);
  Object.defineProperty(g, 'localStorage', { value: makeStorage('localStorage'), writable: false, configurable: false });
  Object.defineProperty(g, 'sessionStorage', { value: makeStorage('sessionStorage'), writable: false, configurable: false });
  Object.defineProperty(g, 'fetch', { value: () => { audit('fetch'); throw new Error('fetch is blocked in sandbox v1'); }, writable: false, configurable: false });
  g.indexedDB = {
    open() { audit('indexedDB.open'); throw new Error('indexedDB is blocked in sandbox v1'); },
    deleteDatabase() { audit('indexedDB.deleteDatabase'); throw new Error('indexedDB is blocked in sandbox v1'); },
  };
  g.performance = { now() { audit('performance.now'); return Date.now(); } };
  g.crypto = {
    randomUUID() {
      audit('crypto.randomUUID');
      const hex: string[] = [];
      for (let i = 0; i < 16; i++) hex.push(((nextByte() + uuidCounter) & 255).toString(16).padStart(2, '0'));
      uuidCounter++;
      hex[6] = ((parseInt(hex[6] || '0', 16) & 15) | 64).toString(16).padStart(2, '0');
      hex[8] = ((parseInt(hex[8] || '0', 16) & 63) | 128).toString(16).padStart(2, '0');
      const s = hex.join('');
      return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
    },
    getRandomValues(array: { length: number; [index: number]: number }) {
      audit('crypto.getRandomValues', [array?.length]);
      if (!array || typeof array.length !== 'number') throw new TypeError('Expected typed array');
      for (let i = 0; i < array.length; i++) array[i] = nextByte();
      return array;
    },
  };
  g.DOMException = DOMException;
  if (typeof g.AbortController === 'undefined') {
    g.AbortController = function AbortController(this: any) {
      const signal: { aborted: boolean; reason: unknown; addEventListener(): void; removeEventListener(): void; dispatchEvent(): boolean } = { aborted: false, reason: undefined, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; } };
      this.signal = signal;
      this.abort = (reason: unknown) => { signal.aborted = true; signal.reason = reason; };
    };
  }
}
