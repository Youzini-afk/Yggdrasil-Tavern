/**
 * DOM shim: Creates a jsdom instance and installs browser globals.
 * This must be the FIRST shim loaded before any ST module import.
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM(
  '<!DOCTYPE html><html><head></head><body><div id="send_textarea"></div><div id="top-bar"></div><div id="character_select"></div></body></html>',
  { url: 'http://localhost:8000', pretendToBeVisual: true },
);

const { window } = dom;

// Install browser globals
globalThis.window = window;
globalThis.document = window.document;
globalThis.Node = window.Node;
globalThis.Element = window.Element;
globalThis.HTMLElement = window.HTMLElement;
globalThis.DocumentFragment = window.DocumentFragment;
globalThis.Text = window.Text;
globalThis.Comment = window.Comment;
globalThis.DOMParser = window.DOMParser;
globalThis.MutationObserver = window.MutationObserver;
globalThis.Event = window.Event;
globalThis.CustomEvent = window.CustomEvent;
globalThis.MouseEvent = window.MouseEvent;
globalThis.KeyboardEvent = window.KeyboardEvent;
globalThis.EventTarget = window.EventTarget;
globalThis.XMLSerializer = window.XMLSerializer;
globalThis.DOMException = window.DOMException;

// Storage
const storageData = {};
globalThis.localStorage = {
  getItem: (key) => storageData[key] ?? null,
  setItem: (key, val) => { storageData[key] = String(val); },
  removeItem: (key) => { delete storageData[key]; },
  clear: () => { Object.keys(storageData).forEach(k => delete storageData[k]); },
  get length() { return Object.keys(storageData).length; },
  key: (i) => Object.keys(storageData)[i] ?? null,
};
globalThis.sessionStorage = { ...globalThis.localStorage };

// Navigator stub
Object.defineProperty(globalThis, 'navigator', {
  value: { userAgent: 'Node.js/GoldenHarness', clipboard: { writeText: async () => {} } },
  writable: true,
  configurable: true,
});

// ResizeObserver stub
globalThis.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// IntersectionObserver stub
globalThis.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// requestAnimationFrame / cancelAnimationFrame stubs
globalThis.requestAnimationFrame = (cb) => setImmediate(cb);
globalThis.cancelAnimationFrame = (id) => clearImmediate(id);

// getComputedStyle shim
globalThis.getComputedStyle = window.getComputedStyle.bind(window);

// CSS support shim
globalThis.CSS = {
  supports: (prop, val) => {
    if (typeof prop === 'string' && val === undefined) return false;
    return false;
  },
  escape: (str) => str,
};

// location shim
globalThis.location = window.location;

// crypto shim for uuid — Node.js provides crypto, we just override randomUUID
if (globalThis.crypto?.randomUUID) {
  const origRandomUUID = globalThis.crypto.randomUUID.bind(globalThis.crypto);
  globalThis.crypto.randomUUID = () => '00000000-0000-0000-0000-000000000000';
}
// Override getRandomValues with deterministic version
if (globalThis.crypto?.getRandomValues) {
  const origGetRandomValues = globalThis.crypto.getRandomValues.bind(globalThis.crypto);
  globalThis.crypto.getRandomValues = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  };
}

// Image stub
globalThis.Image = class Image {
  constructor() { this.src = ''; this.onload = null; this.onerror = null; }
};

// Worker stub
globalThis.Worker = class Worker {
  constructor() { this.onmessage = null; }
  postMessage() {}
  terminate() {}
};

// WebSocket stub
globalThis.WebSocket = class WebSocket {
  constructor() { this.readyState = 0; }
  send() {}
  close() {}
};

// fetch is in its own shim (fetch.mjs), but we set a default that throws
if (!globalThis.fetch) {
  globalThis.fetch = () => Promise.reject(new Error('fetch not configured — use shims/fetch.mjs'));
}

export { dom, window };
